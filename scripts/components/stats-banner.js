/**
 * <rf-stats-banner> — Números de impacto com contagem animada.
 */

const STATS = [
  { value: 500, suffix: '+', label: 'Hóspedes atendidos', desc: 'Viajantes que já confiaram na nossa hospedagem em Recife.' },
  { value: 4, suffix: '', label: 'Flats exclusivos', desc: 'Unidades verificadas em Boa Viagem e Pina.' },
  { value: 4.9, suffix: '', label: 'Nota no Google', desc: 'Avaliação média com depoimentos reais de hóspedes.', decimals: 1 },
  { value: 98, suffix: '%', label: 'Satisfação', desc: 'Índice de recomendação após a estadia.' },
];

class RFStatsBanner extends HTMLElement {
  connectedCallback() {
    const items = STATS.map((s) => `
      <div class="stats__item">
        <span class="stats__value" data-count-up="${s.value}" data-suffix="${s.suffix}"${s.decimals ? ` data-decimals="${s.decimals}"` : ''}>0${s.suffix}</span>
        <span class="stats__label">${s.label}</span>
        <p class="stats__desc">${s.desc}</p>
      </div>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--muted stats" aria-label="Números do Recife Flats">
        <div class="container">
          <header class="section-head section-head--center animate-on-scroll">
            <span class="section-eyebrow">Em números</span>
            <h2 class="section-head__title">Recife Flats em <em>destaque</em></h2>
            <p class="section-head__lead">Hospedagem local com atendimento direto, flats verificados e experiência consistente em cada estadia.</p>
          </header>
          <div class="section-body stats__inner" data-aos-stagger>${items}</div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-stats-banner', RFStatsBanner);
