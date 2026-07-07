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
import './components/trust-strip.js';
import './components/location-section.js';
import './components/reservation-steps.js';
import './components/matching-teaser.js';
import './components/matching-wizard.js';
import './components/apartmatch-hero.js';
import './components/apartmatch-sections.js';
import './components/footer.js';
import './components/floating-whatsapp.js';
import './components/breadcrumbs.js';
import './components/apartment-card.js';
import './components/apartment-grid-card.js';
import './components/apartments-hub.js';
import './components/neighborhood-hub.js';
import './components/apartments-teaser.js';
import './components/amenities-section.js';
import './components/neighborhoods-showcase.js';
import './components/testimonials-section.js';
import './components/faq-section.js';
import './components/stats-banner.js';
import './components/booking-promo.js';
import './components/apartment-detail.js';
import './components/contact-page.js';
import { initReveal } from './utils/reveal.js';

function bootReveal() {
  initReveal();
  document.addEventListener('rf-content-ready', () => initReveal());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootReveal);
} else {
  bootReveal();
}
