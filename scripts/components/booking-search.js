/**
 * <rf-booking-search> — Caixa "Verificar disponibilidade".
 *
 * Uso:
 *   <rf-booking-search></rf-booking-search>
 *
 * Atributos opcionais:
 *   action  : URL para onde o form vai (default: /apartamentos.html)
 *
 * Ao submeter, vai pra ação com query params:
 *   ?checkin=2026-07-10&checkout=2026-07-15&guests=2
 */

class RFBookingSearch extends HTMLElement {
  connectedCallback() {
    const action = this.getAttribute('action') || '/apartamentos.html';

    // datas padrão: hoje e daqui a 3 dias, para iniciar o campo válido
    const today = new Date();
    const inDef = today.toISOString().slice(0, 10);
    const out = new Date(today);
    out.setDate(out.getDate() + 3);
    const outDef = out.toISOString().slice(0, 10);

    this.innerHTML = /* html */`
      <form class="booking-search" action="${action}" method="GET" data-booking>

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

        <div class="booking-search__body">

          <label class="booking-search__field">
            <span class="booking-search__label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Check-in
            </span>
            <input class="booking-search__input"
                   type="date"
                   name="checkin"
                   value="${inDef}"
                   required
                   aria-label="Data de check-in">
          </label>

          <label class="booking-search__field">
            <span class="booking-search__label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Check-out
            </span>
            <input class="booking-search__input"
                   type="date"
                   name="checkout"
                   value="${outDef}"
                   required
                   aria-label="Data de check-out">
          </label>

          <label class="booking-search__field">
            <span class="booking-search__label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Hóspedes
            </span>
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

    // Validação simples: check-out tem que ser depois do check-in
    const form = this.querySelector('[data-booking]');
    const cin  = form.checkin;
    const cout = form.checkout;

    cin.addEventListener('change', () => {
      // garante checkout > checkin
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
