/**
 * main.js — Ponto de entrada.
 * Importa todos os Web Components. Ao carregar, eles se auto-registram
 * via customElements.define() e ficam disponíveis em qualquer página.
 */

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

import './components/announcement.js';
import './components/navbar.js';
import './components/menu.js';
import './components/booking-search.js';
import './components/hero.js';
import './components/match.js';
import './components/apartments.js';
import './components/apartment-detail.js';
