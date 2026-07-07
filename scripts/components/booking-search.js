/**
 * <rf-booking-search> — Caixa "Verificar disponibilidade".
 *
 * Uso:
 *   <rf-booking-search></rf-booking-search>
 *   <rf-booking-search variant="hero"></rf-booking-search>
 *
 * Atributos opcionais:
 *   action  : URL para onde o form vai (default: /apartamentos.html)
 *   variant : "hero" para painel escuro no hero (auto-detecta se dentro de .hero)
 */

class RFBookingSearch extends HTMLElement {
  connectedCallback() {
    const action = this.getAttribute('action') || './apartamentos.html';
    const inHero = this.hasAttribute('variant')
      ? this.getAttribute('variant') === 'hero'
      : Boolean(this.closest('.hero'));

    const today = new Date();
    const inDef = today.toISOString().slice(0, 10);
    const out = new Date(today);
    out.setDate(out.getDate() + 3);
    const outDef = out.toISOString().slice(0, 10);

    const header = inHero ? `
      <header class="booking-search__header booking-search__header--hero">
        <span class="booking-search__hero-label">Verificar disponibilidade</span>
        <span class="booking-search__hero-status">
          <span class="booking-search__status-dot" aria-hidden="true"></span>
          Reserva direta sem taxa
        </span>
      </header>
    ` : `
      <header class="booking-search__header">
        <span class="booking-search__title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 8h18M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            <path d="M8 3v4M16 3v4"/>
          </svg>
          Verificar disponibilidade
        </span>
        <span class="booking-search__status">
          <span class="booking-search__status-dot" aria-hidden="true"></span>
          Atualizado em tempo real
        </span>
      </header>
    `;

    const roomField = inHero ? `
      <label class="booking-search__field booking-search__field--room">
        <span class="booking-search__label">Quarto</span>
        <select class="booking-search__select"
                name="quartos"
                aria-label="Tipo de quarto">
          <option value="">Qualquer um</option>
          <option value="studio">Studio</option>
          <option value="1">1 quarto</option>
          <option value="2">2 quartos</option>
        </select>
      </label>
    ` : '';

    const checkinLabel = inHero ? 'Entrada' : 'Check-in';
    const checkoutLabel = inHero ? 'Saída' : 'Check-out';

    this.innerHTML = /* html */`
      <form class="booking-search${inHero ? ' booking-search--hero' : ''}" action="${action}" method="GET" data-booking>
        ${header}
        <div class="booking-search__body">
          <label class="booking-search__field booking-search__field--checkin">
            <span class="booking-search__label">${checkinLabel}</span>
            <input class="booking-search__input"
                   type="date"
                   name="checkin"
                   value="${inDef}"
                   required
                   aria-label="Data de entrada">
          </label>

          <label class="booking-search__field booking-search__field--checkout">
            <span class="booking-search__label">${checkoutLabel}</span>
            <input class="booking-search__input"
                   type="date"
                   name="checkout"
                   value="${outDef}"
                   required
                   aria-label="Data de saída">
          </label>

          <label class="booking-search__field booking-search__field--guests">
            <span class="booking-search__label">Hóspedes</span>
            <select class="booking-search__select"
                    name="guests"
                    aria-label="Quantidade de hóspedes">
              <option value="1">1 hóspede</option>
              <option value="2" selected>2 hóspedes</option>
              <option value="3">3 hóspedes</option>
              <option value="4">4 hóspedes</option>
              <option value="5">5 hóspedes</option>
              <option value="6">6 hóspedes</option>
            </select>
          </label>

          ${roomField}

          <button type="submit" class="booking-search__submit" aria-label="Consultar disponibilidade">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span class="booking-search__submit-text">Consultar</span>
          </button>
        </div>
      </form>
    `;

    const form = this.querySelector('[data-booking]');
    const cin = form.checkin;
    const cout = form.checkout;

    cin.addEventListener('change', () => {
      if (cout.value <= cin.value) {
        const d = new Date(cin.value);
        d.setDate(d.getDate() + 1);
        cout.value = d.toISOString().slice(0, 10);
      }
      cout.min = cin.value;
    });
    cout.min = cin.value;
  }
}

customElements.define('rf-booking-search', RFBookingSearch);
