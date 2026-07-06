/**
 * <rf-stats-banner> — Números de impacto (faixa amarela do sketch).
 */

import { prefersReducedMotion } from '../utils/dom.js';

const STATS = [
  { value: '500+', label: 'Hóspedes atendidos', icon: '✈️' },
  { value: '4', label: 'Flats exclusivos', icon: '🏠' },
  { value: '4.9', label: 'Nota no Google', icon: '⭐' },
  { value: '98%', label: 'Satisfação', icon: '💛' },
];

class RFStatsBanner extends HTMLElement {
  connectedCallback() {
    const items = STATS.map((s) => `
      <div class="stats__item" data-stats-reveal>
        <span class="stats__icon" aria-hidden="true">${s.icon}</span>
        <span class="stats__value">${s.value}</span>
        <span class="stats__label">${s.label}</span>
      </div>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--sand stats" aria-label="Números do Recife Flats">
        <div class="container stats__inner">${items}</div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;
    gsap.from(this.querySelectorAll('[data-stats-reveal]'), {
      opacity: 0,
      y: 24,
      scale: 0.96,
      duration: 0.7,
      stagger: 0.1,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: this, start: 'top 88%', once: true },
    });
  }
}

customElements.define('rf-stats-banner', RFStatsBanner);
