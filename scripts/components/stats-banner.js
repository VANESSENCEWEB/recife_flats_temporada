/**
 * <rf-stats-banner> — Números de impacto (faixa amarela do sketch).
 */

const STATS = [
  { value: '500+', label: 'Hóspedes atendidos', icon: '✈️' },
  { value: '4', label: 'Flats exclusivos', icon: '🏠' },
  { value: '4.9', label: 'Nota no Google', icon: '⭐' },
  { value: '98%', label: 'Satisfação', icon: '💛' },
];

class RFStatsBanner extends HTMLElement {
  connectedCallback() {
    const items = STATS.map((s) => `
      <div class="stats__item">
        <span class="stats__icon" aria-hidden="true">${s.icon}</span>
        <span class="stats__value">${s.value}</span>
        <span class="stats__label">${s.label}</span>
      </div>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--sand stats" aria-label="Números do Recife Flats">
        <div class="container stats__inner" data-aos-stagger>${items}</div>
      </section>
    `;
  }
}

customElements.define('rf-stats-banner', RFStatsBanner);
