/**
 * <rf-faq-section> — Perguntas frequentes (conteúdo do site ao vivo).
 */

import { whatsappUrl } from '../data/location.js';

const FAQ = [
  {
    q: 'Os apartamentos são exatamente como nas fotos?',
    a: 'Sim. Trabalhamos com fotos reais dos imóveis e detalhamos localização, estrutura, capacidade e itens de cada unidade antes da confirmação.',
  },
  {
    q: 'Como funciona a caução?',
    a: 'Algumas reservas exigem caução e outras não. Quando aplicável, isso é informado antes do fechamento, junto com valor, forma de pagamento e prazo de devolução.',
  },
  {
    q: 'Posso reservar direto sem plataforma?',
    a: 'Sim. A proposta da Recife Flats Temporada é facilitar a reserva direta pelo WhatsApp, com atendimento rápido e menos custo operacional.',
  },
  {
    q: 'Atendem viagem a trabalho e estadia longa?',
    a: 'Sim. Temos unidades com Wi-Fi de alta velocidade, cozinha equipada e localização prática para quem vem a Recife trabalhar ou precisa ficar mais dias.',
  },
];

class RFFaqSection extends HTMLElement {
  connectedCallback() {
    const items = FAQ.map((item, i) => `
      <details class="faq__item" ${i === 0 ? 'open' : ''}>
        <summary class="faq__question">${item.q}</summary>
        <p class="faq__answer">${item.a}</p>
      </details>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--cream faq-section" id="faq" aria-labelledby="faq-heading">
        <div class="container">
          <header class="section-head section-head--center animate-on-scroll">
            <span class="eyebrow eyebrow--pill">FAQ</span>
            <h2 class="section-head__title" id="faq-heading">Perguntas que fecham a reserva mais <em>rápido</em></h2>
            <p class="section-head__lead">Respostas diretas para reduzir objeção, alinhar expectativa e facilitar sua decisão.</p>
          </header>
          <div class="section-body faq-section__list" data-aos-stagger>${items}</div>
          <div class="faq-section__cta animate-on-scroll aos-delay-2">
            <a href="${whatsappUrl('Olá! Quero disponibilidade para minhas datas.')}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">
              Pedir disponibilidade
            </a>
            <a href="./apartamentos.html" class="btn btn--secondary">Comparar apartamentos</a>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-faq-section', RFFaqSection);
