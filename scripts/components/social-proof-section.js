/**
 * <rf-social-proof-section> — Depoimentos + FAQ (bloco do sketch).
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

const FAQ = [
  {
    q: 'Como faço para reservar?',
    a: 'Escolha o apartamento, envie suas datas pelo WhatsApp ou formulário e receba disponibilidade e valor total sem surpresas.',
  },
  {
    q: 'Qual a distância da praia?',
    a: 'Nossos imóveis em Boa Viagem ficam a cerca de 100 m da orla. No Pina, você está a poucos minutos de Boa Viagem e do RioMar.',
  },
  {
    q: 'O que está incluso na diária?',
    a: 'Wi-Fi, enxoval, utensílios de cozinha e suporte durante a estadia. Taxas e regras são informadas antes da confirmação.',
  },
  {
    q: 'Posso levar pet?',
    a: 'Alguns apartamentos aceitam pets mediante consulta. Informe na reserva para confirmarmos a unidade ideal.',
  },
];

class RFSocialProofSection extends HTMLElement {
  connectedCallback() {
    const cards = TESTIMONIALS.map((t) => `
      <article class="review-card" data-social-reveal>
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

    const faq = FAQ.map((item, i) => `
      <details class="faq__item" data-social-reveal ${i === 0 ? 'open' : ''}>
        <summary class="faq__question">${item.q}</summary>
        <p class="faq__answer">${item.a}</p>
      </details>
    `).join('');

    this.innerHTML = `
      <section class="social-proof" id="depoimentos" aria-labelledby="reviews-heading">
        <div class="container social-proof__inner">
          <div class="social-proof__reviews">
            <header class="social-proof__header" data-social-reveal>
              <span class="eyebrow eyebrow--pill">Avaliações</span>
              <h2 class="social-proof__title" id="reviews-heading">
                O que dizem nossos <em class="title-accent">hóspedes</em>
              </h2>
              <div class="social-proof__rating">
                <span class="social-proof__score">4.9</span>
                <span class="social-proof__score-meta">/ 5 no Google · baseado em avaliações reais</span>
              </div>
            </header>
            <div class="social-proof__cards">${cards}</div>
          </div>

          <div class="social-proof__faq">
            <header data-social-reveal>
              <h3 class="social-proof__faq-title">Perguntas frequentes</h3>
            </header>
            <div class="faq">${faq}</div>
          </div>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;
    gsap.from(this.querySelectorAll('[data-social-reveal]'), {
      opacity: 0,
      y: 22,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 85%', once: true },
    });
  }
}

customElements.define('rf-social-proof-section', RFSocialProofSection);
