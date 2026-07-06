/**
 * <rf-reservation-steps> — Como funciona (processo 01 · 02 · 03).
 */

import { whatsappUrl } from '../data/location.js';

const STEPS = [
  {
    num: '01',
    title: 'Escolha o apartamento ideal',
    text: 'Compare localização, capacidade, estrutura e faixa de preço para a sua viagem em Recife.',
  },
  {
    num: '02',
    title: 'Fale conosco pelo WhatsApp',
    text: 'Enviamos disponibilidade, valores e orientações objetivas — sem intermediação de plataforma.',
  },
  {
    num: '03',
    title: 'Confirme e receba o check-in',
    text: 'Após a confirmação, você recebe instruções de acesso e suporte até o check-out.',
  },
];

class RFReservationSteps extends HTMLElement {
  connectedCallback() {
    const steps = STEPS.map((step) => `
      <article class="process-card spotlight-card">
        <span class="process-card__index" aria-hidden="true">${step.num}</span>
        <div>
          <h3 class="process-card__title">${step.title}</h3>
          <p class="process-card__text">${step.text}</p>
        </div>
      </article>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--white process-section" id="como-funciona" aria-labelledby="process-heading">
        <div class="container">
          <header class="section-head section-head--split animate-on-scroll">
            <div>
              <span class="section-eyebrow">Como funciona</span>
              <h2 class="section-head__title" id="process-heading">Simplificando sua <em>reserva</em></h2>
              <p class="section-head__lead">Processo direto, atendimento humano e negociação sem taxas de marketplace.</p>
            </div>
            <div class="section-head__action">
              <a href="${whatsappUrl('Olá! Quero verificar disponibilidade para minhas datas.')}" class="link-arrow" target="_blank" rel="noopener noreferrer">
                Pedir disponibilidade
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </header>

          <div class="section-body process-section__grid" data-aos-stagger>${steps}</div>

          <div class="process-section__cta animate-on-scroll aos-delay-3">
            <a href="${whatsappUrl('Olá! Quero verificar disponibilidade para minhas datas.')}" class="btn btn--primary btn--beam" target="_blank" rel="noopener noreferrer">
              Falar no WhatsApp
            </a>
            <a href="./apartamentos.html" class="btn btn--secondary">Ver apartamentos</a>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-reservation-steps', RFReservationSteps);
