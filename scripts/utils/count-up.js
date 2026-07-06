/**
 * count-up.js — Animação de números ao entrar no viewport.
 */

import { prefersReducedMotion } from './dom.js';

function animateValue(el, end, suffix, decimals = 0, duration = 1400) {
  const start = 0;
  const startTime = performance.now();

  const tick = (now) => {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - t) ** 3;
    const current = start + (end - start) * eased;
    el.textContent = `${decimals ? current.toFixed(decimals) : Math.round(current)}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export function initCountUp(root = document) {
  const els = root.querySelectorAll('[data-count-up]');
  if (!els.length) return;

  if (prefersReducedMotion()) {
    els.forEach((el) => {
      const end = parseFloat(el.dataset.countUp);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      el.textContent = `${decimals ? end.toFixed(decimals) : end}${suffix}`;
    });
    return;
  }

  if (!window.__rfCountUpIO) {
    window.__rfCountUpIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const end = parseFloat(el.dataset.countUp);
          const suffix = el.dataset.suffix || '';
          const decimals = parseInt(el.dataset.decimals || '0', 10);
          animateValue(el, end, suffix, decimals);
          window.__rfCountUpIO.unobserve(el);
        });
      },
      { threshold: 0.4 },
    );
  }

  els.forEach((el) => {
    if (!el.dataset.counted) {
      window.__rfCountUpIO.observe(el);
      el.dataset.counted = '1';
    }
  });
}
