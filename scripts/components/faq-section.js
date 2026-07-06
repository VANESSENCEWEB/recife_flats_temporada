/**
 * <rf-faq-section> — FAQ em duas colunas com perguntas numeradas.
 */

import { whatsappUrl } from '../data/location.js';

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
      <details class="faq__item" ${i === 0 ? 'open' : ''}>
        <summary class="faq__question">
          <span class="faq__num">${i + 1}.</span>
          <span class="faq__question-text">${item.q}</span>
        </summary>
        <p class="faq__answer">${item.a}</p>
      </details>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--cream faq-section" id="faq" aria-labelledby="faq-heading">
        <div class="container">
          <div class="faq-section__layout">
            <div class="faq-section__intro animate-on-scroll">
              <header class="section-head">
                <span class="section-eyebrow">Dúvidas</span>
                <h2 class="section-head__title" id="faq-heading">Perguntas <em>frequentes</em></h2>
                <p class="section-head__lead">Respostas objetivas para você reservar com tranquilidade e sem surpresas.</p>
              </header>
              <div class="faq-section__cta">
                <a href="${whatsappUrl('Olá! Tenho uma dúvida sobre reserva em Recife.')}" class="btn btn--primary btn--beam" target="_blank" rel="noopener noreferrer">
                  Falar conosco
                </a>
              </div>
            </div>
            <div class="section-body faq-section__list" data-aos-stagger>${items}</div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-faq-section', RFFaqSection);
