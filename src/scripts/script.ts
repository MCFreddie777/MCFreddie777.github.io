// Behaviour for the site: theme, hamburger, progress bar, hover borders, typing, scroll motion, stickers, fan, easter egg.
// Nothing here knows any text; it reads data-* attributes and class names from the markup.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import Lenis from "lenis";
import { setLocale, type Locale } from "../paraglide/runtime.js";

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const root = document.documentElement;

/* year */
$$(".yr").forEach((e) => (e.textContent = String(new Date().getFullYear())));

/* theme */
$("#theme")?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch {}
});

/* language switcher: Paraglide saves the pick in a cookie (so "/" opens it next time) and opens this page in that language */
$$<HTMLAnchorElement>(".lang a").forEach((a) =>
  a.addEventListener("click", (e) => {
    e.preventDefault();
    setLocale(a.hreflang as Locale);
  }),
);

/* hamburger */
const topbar = $("#top");
const burger = $("#burger");
const setMenu = (open: boolean) => {
  topbar?.classList.toggle("open", open);
  burger?.setAttribute("aria-expanded", String(open));
};
burger?.addEventListener("click", () => setMenu(!topbar?.classList.contains("open")));
$$("#top nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* progress bar */
const prog = $("#prog");
const setProg = (p: number) => { if (prog) prog.style.transform = `scaleX(${p})`; };
const onScroll = () => setProg(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* hover borders: only the element under the pointer */
addEventListener("pointermove", (e) => {
  $$(".glowb:hover").forEach((el) => {
    const b = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - b.left}px`);
    el.style.setProperty("--y", `${e.clientY - b.top}px`);
  });
}, { passive: true });

/* easter egg: click the window or the button */
const egg = $("#egg-win");
egg?.addEventListener("click", () => {
  const out = $("#eggout");
  if (!out || !out.hidden) return;
  out.hidden = false;
  $("#sudo")!.hidden = true;
  egg.classList.remove("armed");
  if (!reduce) gsap.from(out, { y: 10, opacity: 0, duration: 0.5, ease: "expo.out" });
});

if (!reduce) {
  gsap.registerPlugin(ScrollTrigger, Draggable);

  /* smooth scroll, synced with ScrollTrigger */
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => setProg(s.progress) });

  const typeInto = (el: HTMLElement, text: string) => {
    const o = { n: 0 };
    el.textContent = "";
    gsap.to(o, { n: text.length, duration: 0.05 * text.length + 0.2, ease: "none", onUpdate: () => (el.textContent = text.slice(0, Math.round(o.n))) });
  };

  /* boot lines print one by one on load, like program output */
  $$(".boot li").forEach((li, i) => {
    li.style.visibility = "hidden";
    setTimeout(() => (li.style.visibility = ""), 300 + i * 600);
  });

  /* hero name: typed WITHOUT diacritics (data-wrong), then corrects itself to data-right */
  const typed = $("#typed");
  const h1 = $("#name");
  if (typed && typed.dataset.wrong && typed.dataset.right) {
    const wrong = typed.dataset.wrong, right = typed.dataset.right;
    let p = 0;
    while (p < wrong.length && p < right.length && wrong[p] === right[p]) p++;
    const steps: string[] = [];
    for (let i = 1; i <= wrong.length; i++) steps.push(wrong.slice(0, i));
    steps.push("\0");
    for (let i = wrong.length - 1; i >= p; i--) steps.push(wrong.slice(0, i));
    for (let i = p + 1; i <= right.length; i++) steps.push(right.slice(0, i));
    typed.textContent = "";
    let k = 0;
    const step = () => {
      if (k >= steps.length) { h1?.classList.remove("oops"); return; }
      const s = steps[k++];
      if (s === "\0") { setTimeout(step, 900); return; }
      typed.textContent = s;
      setTimeout(step, k <= wrong.length ? 95 : 70 + Math.random() * 50);
    };
    step();
  }
  const who = $("#who");
  if (who?.dataset.text) typeInto(who, who.dataset.text);

  /* commands type themselves when scrolled into view */
  $$(".cmd").forEach((c, i) => {
    if (i === 0) return; // the first one sits right under the hero and is already visible on load
    const span = $(".c", c);
    const txt = c.dataset.cmd;
    if (!span || !txt) return;
    span.textContent = "";
    ScrollTrigger.create({ trigger: c, start: "top 90%", once: true, onEnter: () => typeInto(span, txt) });
  });

  /* content slides in */
  $$(".bd > *:not(.cmd):not(.quests), .contact > *").forEach((el) => {
    gsap.from(el, { y: 20, opacity: 0, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%", once: true }, clearProps: "all" });
  });

  /* marker highlights draw themselves (not the company name under the name) */
  $$("mark").forEach((m) => {
    if (m.closest(".tag")) return;
    gsap.fromTo(m, { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: m, start: "top 90%", once: true } });
  });

  /* cursor glow + draggable stickers (pointer devices only) */
  if (fine) {
    const g = $("#glow");
    if (g) {
      const qx = gsap.quickTo(g, "x", { duration: 0.5, ease: "power3" });
      const qy = gsap.quickTo(g, "y", { duration: 0.5, ease: "power3" });
      addEventListener("pointermove", (e) => { g.style.opacity = "1"; qx(e.clientX); qy(e.clientY); }, { passive: true });
      document.addEventListener("pointerleave", () => (g.style.opacity = "0"));
    }
    if ($(".sticker")) Draggable.create(".sticker", { type: "x,y", bounds: "main", edgeResistance: 0.7, zIndexBoost: true });
  }

  /* side quests: rows slide sideways as you scroll, alternating direction */
  const q = $("#quests");
  if (q) {
    q.classList.add("moving");
    $$(".row", q).forEach((r, i) => {
      const travel = Math.max(140, r.scrollWidth - q.clientWidth);
      gsap.fromTo(r, { x: i % 2 ? -travel : 0 }, { x: i % 2 ? 0 : -travel, ease: "none", scrollTrigger: { trigger: q, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    });
  }
}
