/**
 * Animações de scroll estilo exemplo (reveal, stagger, parallax).
 */

import { prefersReducedMotion } from './dom.js';

export function showAllReveals(root = document) {
  root.querySelectorAll('.reveal, .reveal-x, [data-split] .split-word > span').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

export function initScrollAnimations(root = document) {
  const reduced = prefersReducedMotion();

  if (reduced || typeof window.gsap === 'undefined') {
    showAllReveals(root);
    return;
  }

  const gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  root.querySelectorAll('.reveal').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      delay: parseFloat(el.dataset.delay || 0),
    });
  });

  root.querySelectorAll('.reveal-x').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      x: 28,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  root.querySelectorAll('[data-stagger]').forEach((group) => {
    gsap.from(group.children, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });

  if (window.ScrollTrigger) {
    root.querySelectorAll('[data-parallax]').forEach((el) => {
      gsap.to(el, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
    window.ScrollTrigger.refresh();
  }
}
