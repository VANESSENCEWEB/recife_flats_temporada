/**
 * <rf-amenities-section> — Grade de comodidades "Tudo que você precisa".
 */

import { prefersReducedMotion } from '../utils/dom.js';

const AMENITIES = [
  { icon: '📶', label: 'Wi-Fi 300Mbps' },
  { icon: '❄️', label: 'Ar-condicionado' },
  { icon: '🏖️', label: 'Perto da praia' },
  { icon: '🏊', label: 'Piscina' },
  { icon: '🅿️', label: 'Estacionamento' },
  { icon: '🍳', label: 'Cozinha completa' },
  { icon: '📺', label: 'Smart TV' },
  { icon: '🔒', label: 'Segurança 24h' },
  { icon: '🧺', label: 'Lavanderia' },
  { icon: '💬', label: 'Suporte WhatsApp' },
];

class RFAmenitiesSection extends HTMLElement {
  connectedCallback() {
    const items = AMENITIES.map((a) => `
      <li class="amenities__item" data-amenities-reveal>
        <span class="amenities__icon" aria-hidden="true">${a.icon}</span>
        <span class="amenities__label">${a.label}</span>
      </li>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--cream amenities" id="comodidades" aria-labelledby="amenities-heading">
        <div class="container">
          <header class="section-head" data-amenities-reveal>
            <span class="eyebrow eyebrow--pill">Garantimos tudo</span>
            <h2 class="section-head__title" id="amenities-heading">
              Tudo o que você <em>precisa</em>
            </h2>
            <p class="section-head__lead">
              Apartamentos mobiliados, prontos pra usar, com fotos reais e estrutura completa pra sua estadia em Recife.
            </p>
          </header>
          <ul class="section-body amenities__grid">${items}</ul>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;
    gsap.from(this.querySelectorAll('[data-amenities-reveal]'), {
      opacity: 0,
      y: 20,
      duration: 0.55,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 85%', once: true },
    });
  }
}

customElements.define('rf-amenities-section', RFAmenitiesSection);
