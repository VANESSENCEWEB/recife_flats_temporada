/**
 * animations.js — Reveals de scroll e parallax (GSAP ScrollTrigger)
 */

import { $$, prefersReducedMotion } from "../utils/dom.js";

/** Mostra todo conteúdo quando GSAP não carrega. */
export function showAllReveals() {
  $$(".reveal, .reveal-x, [data-split] .split-word > span").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

/**
 * Inicializa animações de scroll em toda a página.
 */
export function initScrollAnimations() {
  const reduced = prefersReducedMotion();

  if (reduced || typeof window.gsap === "undefined") {
    showAllReveals();
    return;
  }

  const gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  $$(".reveal").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: window.ScrollTrigger
        ? { trigger: el, start: "top 90%", once: true }
        : undefined,
      delay: parseFloat(el.dataset.delay || 0),
    });
  });

  $$(".reveal-x").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      x: 28,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: window.ScrollTrigger
        ? { trigger: el, start: "top 88%", once: true }
        : undefined,
    });
  });

  $$("[data-stagger]").forEach((group) => {
    gsap.from(group.children, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: window.ScrollTrigger
        ? { trigger: group, start: "top 85%", once: true }
        : undefined,
    });
  });

  if (window.ScrollTrigger) {
    $$("[data-parallax]").forEach((el) => {
      gsap.to(el, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    window.ScrollTrigger.refresh();
  }
}

/**
 * Formulário de contato com feedback demo.
 */
export function initContactForm() {
  const contactForm = document.querySelector("[data-contact-form]");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.querySelector("[data-form-status]");
    if (status) {
      status.textContent =
        "Obrigado! Recebemos sua mensagem — vamos responder em breve.";
      status.style.color = "var(--color-palm)";
    }
    contactForm.reset();
  });
}
