/**
 * site-animations.js — Inicializa animações globais da home e páginas.
 */

import { initInViewAnimations } from '../utils/in-view-animations.js';
import { initSpotlightCards } from '../utils/spotlight.js';
import { initScrollAnimations } from '../utils/scroll-animations.js';
import { initCountUp } from '../utils/count-up.js';

function boot() {
  initInViewAnimations();
  initSpotlightCards();
  initScrollAnimations();
  initCountUp();

  if (window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
  }
}

function scheduleRefresh() {
  if (window.__rfAnimRaf) cancelAnimationFrame(window.__rfAnimRaf);
  window.__rfAnimRaf = requestAnimationFrame(boot);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

const mo = new MutationObserver(scheduleRefresh);
mo.observe(document.body, { childList: true, subtree: true });
