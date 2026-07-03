/**
 * <rf-apartments> — Grade de apartamentos com filtro por busca.
 *
 * Uso:
 *   <rf-apartments></rf-apartments>
 *
 * Lê ?checkin=&checkout=&guests= da URL. Marca cada card como disponível
 * ou sem vaga. Se NENHUM apartamento atender à busca, exibe o bloco de
 * matching (<rf-match variant="empty">) no topo para o hóspede pedir ajuda.
 *
 * Anima a entrada dos cards com GSAP/ScrollTrigger quando disponível.
 */

import {
  APARTMENTS,
  matchesSearch,
  readSearchParams,
  formatDateShort,
} from '../data/apartments.js';
import { apartmentCardHTML } from './apartment-card.js';
import { prefersReducedMotion } from '../utils/dom.js';

class RFApartments extends HTMLElement {
  connectedCallback() {
    const search = readSearchParams();
    const hasSearch = Boolean(search.checkin && search.checkout);
    const availableCount = APARTMENTS.filter((a) => matchesSearch(a, search)).length;
    const noneAvailable = hasSearch && availableCount === 0;

    const summary = hasSearch
      ? `
        <div class="apts__summary" data-apts-summary>
          <span class="apts__summary-label">Sua busca</span>
          <span class="apts__summary-chips">
            <span class="apts__chip">${formatDateShort(search.checkin)} → ${formatDateShort(search.checkout)}</span>
            ${search.guests ? `<span class="apts__chip">${search.guests} ${search.guests === 1 ? 'hóspede' : 'hóspedes'}</span>` : ''}
            <span class="apts__chip apts__chip--result">
              ${availableCount} ${availableCount === 1 ? 'flat livre' : 'flats livres'}
            </span>
          </span>
        </div>`
      : '';

    // Cards, com os disponíveis primeiro quando há busca.
    const ordered = hasSearch
      ? [...APARTMENTS].sort(
          (a, b) => Number(matchesSearch(b, search)) - Number(matchesSearch(a, search))
        )
      : APARTMENTS;

    this.innerHTML = /* html */ `
      <section class="apts">
        <div class="container">

          <div class="apts__toolbar">
            ${summary}
            <div class="apts__refine">
              <span class="apts__refine-label">Ajustar datas</span>
              <rf-booking-search
                action="/apartamentos.html"
                ${search.checkin ? `checkin="${search.checkin}"` : ''}
                ${search.checkout ? `checkout="${search.checkout}"` : ''}
                ${search.guests ? `guests="${search.guests}"` : ''}></rf-booking-search>
            </div>
          </div>

          ${noneAvailable ? `
            <div class="apts__empty" data-apts-empty>
              <rf-match variant="empty"></rf-match>
            </div>
          ` : ''}

          <div class="apts__grid" data-apts-grid>
            ${ordered.map((apt) => apartmentCardHTML(apt, search)).join('')}
          </div>

        </div>
      </section>
    `;

    this._reveal();
  }

  _reveal() {
    if (prefersReducedMotion() || !window.gsap || !window.ScrollTrigger) return;
    const cards = this.querySelectorAll('.apt-card');
    gsap.from(cards, {
      opacity: 0,
      y: 32,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: this.querySelector('[data-apts-grid]'),
        start: 'top 85%',
      },
    });
  }
}

customElements.define('rf-apartments', RFApartments);
