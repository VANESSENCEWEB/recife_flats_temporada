/**
 * <rf-apartments-hub> — Listagem geral agrupada por bairro + filtros simples.
 */

import { APARTAMENTOS } from '../data/apartamentos.js';
import { NEIGHBORHOODS } from '../data/site-structure.js';
import { prefersReducedMotion } from '../utils/dom.js';

class RFApartmentsHub extends HTMLElement {
  connectedCallback() {
    const groups = Object.values(NEIGHBORHOODS).map((n) => {
      const apts = APARTAMENTOS.filter((a) => a.neighborhoodSlug === n.slug);
      const cards = apts.map((a) => `<rf-apartment-grid-card slug="${a.slug}"></rf-apartment-grid-card>`).join('');
      return `
        <section class="apt-hub__group" id="${n.slug}" aria-labelledby="hub-${n.slug}">
          <div class="apt-hub__group-head">
            <div>
              <h2 class="apt-hub__group-title" id="hub-${n.slug}">${n.name}</h2>
              <p class="apt-hub__group-desc">${n.intro}</p>
            </div>
            <a href="${n.pageUrl}" class="apt-hub__group-link">
              Ver página do bairro
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
          <div class="apt-hub__grid properties properties--compact" data-apt-grid>${cards}</div>
        </section>
      `;
    }).join('');

    this.innerHTML = `
      <div class="apt-hub">
        <div class="apt-hub__filters" data-apt-filters role="group" aria-label="Filtrar apartamentos">
          <button type="button" class="apt-hub__filter is-active" data-filter="all">Todos</button>
          <button type="button" class="apt-hub__filter" data-filter="bedrooms-2">2 quartos</button>
          <button type="button" class="apt-hub__filter" data-filter="pool">Com piscina</button>
          <button type="button" class="apt-hub__filter" data-filter="parking">Com garagem</button>
        </div>
        ${groups}
        <section class="apt-hub__booking" id="reservar">
          <div class="apt-hub__booking-inner">
            <h2>Pronto para reservar?</h2>
            <p>Escolha as datas e fale conosco pelo WhatsApp.</p>
            <rf-booking-search action="./apartamentos.html#reservar"></rf-booking-search>
          </div>
        </section>
      </div>
    `;

    this._bindFilters();
    this._animate();
  }

  _bindFilters() {
    const filters = this.querySelectorAll('[data-filter]');
    const cards   = this.querySelectorAll('[data-apt-grid-card]');

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach((b) => b.classList.toggle('is-active', b === btn));
        const key = btn.dataset.filter;

        cards.forEach((card) => {
          let show = true;
          if (key === 'bedrooms-2') show = card.dataset.bedrooms === '2';
          if (key === 'pool') show = card.dataset.pool === 'true';
          if (key === 'parking') show = card.dataset.parking === 'true';
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;
    gsap.from(this.querySelectorAll('.property'), {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 85%', once: true },
    });
  }
}

customElements.define('rf-apartments-hub', RFApartmentsHub);
