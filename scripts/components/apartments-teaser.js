/**
 * <rf-apartments-teaser> — Destaque na home (design exemplo).
 */

import { APARTAMENTOS } from '../data/apartamentos.js';

class RFApartmentsTeaser extends HTMLElement {
  connectedCallback() {
    const cards = APARTAMENTOS.slice(0, 4)
      .map((a) => `<rf-apartment-grid-card slug="${a.slug}"></rf-apartment-grid-card>`)
      .join('');

    this.innerHTML = `
      <section class="section section--apartments" id="apartamentos" style="background:var(--color-bg-alt)" aria-labelledby="apt-teaser-heading">
        <div class="container">
          <div class="section-head">
            <div class="section-head__copy">
              <span class="pre-title pre-title--dark reveal"><span class="pre-title__dot"></span> Nossos imóveis</span>
              <h2 class="reveal" id="apt-teaser-heading">4 apartamentos em<br><span class="accent-word">Boa Viagem</span> e Pina.</h2>
            </div>
            <a href="./apartamentos.html" class="link-arrow reveal">Ver catálogo completo</a>
          </div>
          <div class="properties properties--compact" data-stagger>
            ${cards}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-apartments-teaser', RFApartmentsTeaser);
