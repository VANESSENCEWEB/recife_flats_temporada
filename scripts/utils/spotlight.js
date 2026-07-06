/**
 * spotlight.js — Efeito “flashlight” que segue o cursor em cards.
 */

import { on, prefersReducedMotion } from './dom.js';

export function initSpotlightCards(root = document, selector = '.spotlight-card') {
  if (prefersReducedMotion()) return;

  root.querySelectorAll(selector).forEach((card) => {
    on(card, 'mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
}
