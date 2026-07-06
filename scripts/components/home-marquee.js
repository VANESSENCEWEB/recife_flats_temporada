/**
 * <rf-home-marquee> — Faixa de localidades com loop infinito.
 */

class RFHomeMarquee extends HTMLElement {
  connectedCallback() {
    const items = [
      'Boa Viagem', 'Pina', 'Vista mar', '4 apartamentos',
      'Recife — PE', 'Pé na areia', 'Reserva direta', 'Nota 4.9',
    ];
    const track = [...items, ...items]
      .map((t) => `<span class="rf-marquee__item">${t}</span>`)
      .join('');

    this.innerHTML = `
      <div class="rf-marquee" aria-hidden="true">
        <div class="rf-marquee__track">${track}</div>
      </div>
    `;
  }
}

customElements.define('rf-home-marquee', RFHomeMarquee);
