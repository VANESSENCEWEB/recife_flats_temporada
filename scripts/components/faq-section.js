/**
 * <rf-faq-section> — Perguntas frequentes (seção própria).
 */

import { prefersReducedMotion } from '../utils/dom.js';

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

class RFFaqSection extends HTMLElement {
  connectedCallback() {
    const items = FAQ.map((item, i) => `
      <details class="faq__item" data-reveal ${i === 0 ? 'open' : ''}>
        <summary class="faq__question">${item.q}</summary>
        <p class="faq__answer">${item.a}</p>
      </details>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--cream faq-section" id="faq" aria-labelledby="faq-heading">
        <div class="container">
          <header class="section-head section-head--center" data-reveal>
            <span class="eyebrow eyebrow--pill">Dúvidas</span>
            <h2 class="section-head__title" id="faq-heading">Perguntas frequentes</h2>
            <p class="section-head__lead">Respostas objetivas para você reservar com tranquilidade.</p>
          </header>
          <div class="section-body faq-section__list">${items}</div>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;
    gsap.from(this.querySelectorAll('[data-reveal]'), {
      opacity: 0,
      y: 18,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 88%', once: true },
    });
  }
}

customElements.define('rf-faq-section', RFFaqSection);
