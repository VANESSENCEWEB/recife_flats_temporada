/**
 * in-view-animations.js — Reveals ao entrar no viewport (IntersectionObserver).
 * Padrão leve: CSS animation pausada até .is-visible.
 */

import { prefersReducedMotion } from './dom.js';

function revealAll(root) {
  root.querySelectorAll('.animate-on-scroll, [data-aos-stagger], .text-reveal').forEach((el) => {
    el.classList.add('is-visible');
  });
}

export function initInViewAnimations(root = document) {
  if (prefersReducedMotion()) {
    revealAll(root);
    return;
  }

  if (!window.__rfInViewIO) {
    window.__rfInViewIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          window.__rfInViewIO.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    );
  }

  const io = window.__rfInViewIO;

  root.querySelectorAll('.animate-on-scroll:not(.is-visible)').forEach((el) => io.observe(el));
  root.querySelectorAll('[data-aos-stagger]:not(.is-visible)').forEach((el) => io.observe(el));
  root.querySelectorAll('.text-reveal:not(.is-visible)').forEach((el) => io.observe(el));
}
