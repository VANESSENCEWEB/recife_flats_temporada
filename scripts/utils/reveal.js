/**
 * reveal.js — Animação suave ao entrar no viewport.
 */

import { prefersReducedMotion } from './dom.js';

export function initReveal(root = document) {
  const els = root.querySelectorAll('.reveal:not(.is-visible)');
  if (!els.length) return;

  if (prefersReducedMotion()) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  if (!window.__rfRevealIO) {
    window.__rfRevealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          window.__rfRevealIO.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    );
  }

  els.forEach((el) => window.__rfRevealIO.observe(el));
}
