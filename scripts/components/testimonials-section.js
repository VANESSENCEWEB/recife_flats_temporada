/**
 * <rf-testimonials-section> — Depoimentos de hóspedes (seção própria).
 */

import { prefersReducedMotion } from '../utils/dom.js';

const TESTIMONIALS = [
  {
    initials: 'MR',
    name: 'Mariana R.',
    meta: 'São Paulo · 7 noites',
    quote: 'Apartamento idêntico às fotos, pertinho da praia. Atendimento impecável do check-in ao check-out.',
  },
  {
    initials: 'CP',
    name: 'Caio P.',
    meta: 'Brasília · 5 noites',
    quote: 'Flat Golden View perfeito para o casal. Resposta rápida no WhatsApp e tudo muito limpo.',
  },
  {
    initials: 'FL',
    name: 'Família Lopes',
    meta: 'Porto Alegre · 10 noites',
    quote: 'Apt espaçoso para a família, bem localizado em Boa Viagem. Voltaremos com certeza.',
  },
];

class RFTestimonialsSection extends HTMLElement {
  connectedCallback() {
    const cards = TESTIMONIALS.map((t) => `
      <article class="review-card" data-reveal>
        <div class="review-card__stars" aria-label="5 de 5 estrelas">★★★★★</div>
        <blockquote class="review-card__quote">"${t.quote}"</blockquote>
        <div class="review-card__author">
          <span class="review-card__avatar" aria-hidden="true">${t.initials}</span>
          <div>
            <strong>${t.name}</strong>
            <span>${t.meta}</span>
          </div>
        </div>
      </article>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--white testimonials" id="depoimentos" aria-labelledby="reviews-heading">
        <div class="container">
          <header class="section-head" data-reveal>
            <span class="eyebrow eyebrow--pill">Avaliações</span>
            <h2 class="section-head__title" id="reviews-heading">
              O que dizem nossos <em>hóspedes</em>
            </h2>
            <p class="section-head__lead">
              Nota <strong class="testimonials__score">4.9</strong> no Google — avaliações reais de quem já se hospedou.
            </p>
          </header>
          <div class="section-body testimonials__grid">${cards}</div>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;
    gsap.from(this.querySelectorAll('[data-reveal]'), {
      opacity: 0,
      y: 20,
      duration: 0.55,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 88%', once: true },
    });
  }
}

customElements.define('rf-testimonials-section', RFTestimonialsSection);
