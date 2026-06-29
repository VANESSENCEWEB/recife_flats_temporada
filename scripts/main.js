/**
 * main.js — Ponto de entrada.
 */

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

import './components/announcement.js';
import './components/navbar.js';
import './components/menu.js';
import './components/booking-search.js';
import './components/hero.js';
import './components/home-marquee.js';
import './components/home-sections.js';
import './components/footer.js';
import './components/location-section.js';
import './components/breadcrumbs.js';
import './components/apartment-card.js';
import './components/apartment-grid-card.js';
import './components/apartments-hub.js';
import './components/neighborhood-hub.js';
import './components/apartments-teaser.js';
import './components/apartment-detail.js';
import './components/contact-page.js';

import { initLenis } from './utils/lenis.js';
import { initScrollAnimations } from './utils/scroll-animations.js';

function bootMotion() {
  initLenis();
  initScrollAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootMotion);
} else {
  bootMotion();
}
