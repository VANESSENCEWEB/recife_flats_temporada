/**
 * <rf-home-marquee> — Faixa de localidades estilo exemplo.
 */

class RFHomeMarquee extends HTMLElement {
  connectedCallback() {
    const items = [
      'Boa Viagem', 'Pina', 'Vista mar', '4 apartamentos',
      'Recife — PE', 'Pé na areia', 'Reserva direta',
    ];
    const track = [...items, ...items]
      .map((t) => `<span class="marquee__item">${t}</span>`)
      .join('');

    this.innerHTML = `
      <div class="marquee" aria-hidden="true">
        <div class="marquee__track">${track}</div>
      </div>
    `;
  }
}

customElements.define('rf-home-marquee', RFHomeMarquee);
