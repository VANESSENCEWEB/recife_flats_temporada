/**
 * hero.js — Animações de entrada do hero (GSAP)
 */

import { $$, prefersReducedMotion } from "../utils/dom.js";
import { initAllSplitText, resetSplitText } from "../utils/split-text.js";
import { showAllReveals } from "./animations.js";

/**
 * Inicializa animações do hero com GSAP.
 */
export function initHero() {
  const reduced = prefersReducedMotion();
  const hero = document.querySelector(".hero");
  if (!hero) return;

  if (!reduced) {
    initAllSplitText();
  }

  if (typeof window.gsap === "undefined") {
    resetSplitText();
    showAllReveals();
    return;
  }

  const gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  if (reduced) {
    showAllReveals();
    resetSplitText();
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

  const heroWords = $$("[data-split] .split-word > span");
  if (heroWords.length) {
    gsap.set(heroWords, { y: "110%" });
    tl.to(heroWords, {
      y: "0%",
      duration: 1.1,
      stagger: 0.04,
    }, 0.1);
  }

  tl.from(
  ".hero .pre-title, .hero__desc, .hero__badges, .hero__actions, .hero__search-wrap",
    {
      y: 24,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
    },
    0.35
  );

  gsap.from(".hero__media video, .hero__media img", {
    scale: 1.12,
    duration: 2,
    ease: "expo.out",
  });
}
