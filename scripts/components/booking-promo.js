/**
 * <rf-booking-promo> — CTA final com buscador (faixa azul do sketch).
 */

import { prefersReducedMotion } from '../utils/dom.js';

class RFBookingPromo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="home-section home-section--ocean booking-promo" id="reservar" aria-labelledby="booking-promo-heading">
        <div class="container booking-promo__inner">
          <header class="section-head" data-promo-reveal>
            <span class="eyebrow eyebrow--pill">Reserva direta</span>
            <h2 class="section-head__title" id="booking-promo-heading">
              Economize até <em>20%</em> reservando direto
            </h2>
            <p class="section-head__lead">
              Sem taxas de plataforma. Informe suas datas e receba disponibilidade em até 1 hora.
            </p>
          </header>
          <div class="section-body booking-promo__form-wrap" data-promo-reveal>
            <rf-booking-search action="./apartamentos.html"></rf-booking-search>
          </div>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;
    gsap.from(this.querySelectorAll('[data-promo-reveal]'), {
      opacity: 0,
      y: 28,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 85%', once: true },
    });
  }
}

customElements.define('rf-booking-promo', RFBookingPromo);
