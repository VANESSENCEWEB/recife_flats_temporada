/**
 * apartment-card.js — Renderizador de card de apartamento.
 *
 * Não é um custom element: é uma função pura que devolve o HTML do card.
 * Assim listagem, "você também pode gostar" e qualquer outra grade
 * reutilizam o MESMO markup, sem repetição.
 */

import {
  matchesSearch,
  buildSearchQuery,
  formatPrice,
} from '../data/apartments.js';

/**
 * @param {object} apt   apartamento (ver data/apartments.js)
 * @param {object} search { checkin, checkout, guests }
 * @returns {string} HTML do card
 */
export function apartmentCardHTML(apt, search = {}) {
  const hasSearch = Boolean(search.checkin && search.checkout);
  const available = matchesSearch(apt, search);
  const href = `apartamento.html?id=${encodeURIComponent(apt.id)}${
    buildSearchQuery(search).replace('?', '&')
  }`;

  const media = apt.image
    ? `<img class="apt-card__img" src="${apt.image}" alt="${apt.name}" loading="lazy">`
    : `<span class="apt-card__placeholder" aria-hidden="true">${apt.name}</span>`;

  const status = hasSearch
    ? available
      ? `<span class="apt-card__status apt-card__status--free">Disponível nas suas datas</span>`
      : `<span class="apt-card__status apt-card__status--busy">Sem vaga nessas datas</span>`
    : '';

  return `
    <article class="apt-card apt-card--${apt.theme} ${
      hasSearch && !available ? 'is-unavailable' : ''
    }">
      <a class="apt-card__link" href="${href}" aria-label="Ver ${apt.name}">
        <div class="apt-card__media apt-card__media--${apt.theme}">
          ${media}
          <span class="apt-card__badge">${apt.location}</span>
          ${status}
        </div>

        <div class="apt-card__body">
          <div class="apt-card__head">
            <h3 class="apt-card__name">${apt.name}</h3>
            <span class="apt-card__rating" aria-label="Nota ${apt.rating}">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01z"/></svg>
              ${apt.rating.toFixed(1)}
            </span>
          </div>

          <p class="apt-card__summary">${apt.summary}</p>

          <ul class="apt-card__specs">
            <li>${apt.guests} hóspedes</li>
            <li>${apt.bedrooms} ${apt.bedrooms === 1 ? 'quarto' : 'quartos'}</li>
            <li>${apt.area} m²</li>
          </ul>

          <div class="apt-card__foot">
            <span class="apt-card__price">
              <strong>${formatPrice(apt.priceFrom)}</strong> / noite
            </span>
            <span class="apt-card__cta">
              Ver detalhes
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </div>
        </div>
      </a>
    </article>
  `;
}
