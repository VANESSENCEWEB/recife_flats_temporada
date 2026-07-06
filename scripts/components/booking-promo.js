/**
 * <rf-booking-promo> — CTA final com buscador.
 */

class RFBookingPromo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="home-section home-section--ocean booking-promo" id="reservar" aria-labelledby="booking-promo-heading">
        <div class="container booking-promo__inner">
          <header class="section-head section-head--center animate-on-scroll">
            <span class="section-eyebrow">Reserva direta</span>
            <h2 class="section-head__title text-reveal" id="booking-promo-heading">
              <span class="text-reveal__line">Economize até <em>20%</em> reservando direto</span>
            </h2>
            <p class="section-head__lead">
              Sem taxas de plataforma. Informe suas datas e receba disponibilidade em até 1 hora.
            </p>
          </header>
          <div class="section-body booking-promo__form-wrap animate-on-scroll aos-delay-2">
            <rf-booking-search action="./apartamentos.html"></rf-booking-search>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-booking-promo', RFBookingPromo);
