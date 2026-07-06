/**
 * <rf-apartment-grid-card> — Card compacto para grids (hub e bairros).
 *
 * Uso: <rf-apartment-grid-card slug="flat-golden-view-1006"></rf-apartment-grid-card>
 */

import { getApartmentBySlug, resolveImages, FALLBACK_IMAGE } from '../data/apartamentos.js';
import { apartmentUrl } from '../data/site-structure.js';

class RFApartmentGridCard extends HTMLElement {
  connectedCallback() {
    const slug = this.getAttribute('slug');
    const apt  = getApartmentBySlug(slug);

    if (!apt) {
      this.innerHTML = '';
      return;
    }

    const images = resolveImages(apt);
    const cover  = images[0];
    const src    = cover.src || cover.placeholder || FALLBACK_IMAGE;
    const fallback = cover.placeholder || FALLBACK_IMAGE;
    const href   = apartmentUrl(apt.slug);
    const price  = apt.priceFrom
      ? `<span class="apt-grid-card__price">a partir de <strong>${apt.priceFrom}</strong>${apt.priceNote}</span>`
      : `<span class="apt-grid-card__price apt-grid-card__price--consult">${apt.priceNote}</span>`;

    const photoCount = apt.images.length;
    const photoBadge = photoCount > 1
      ? `<span class="apt-grid-card__photos">${photoCount} fotos</span>`
      : '';

    this.innerHTML = `
      <article class="apt-grid-card"
               data-apt-grid-card
               data-bedrooms="${apt.bedrooms}"
               data-pool="${apt.pool}"
               data-parking="${apt.parking}"
               data-neighborhood="${apt.neighborhoodSlug}">
        <a href="${href}" class="apt-grid-card__media">
          ${apt.badge ? `<span class="apt-grid-card__badge">${apt.badge}</span>` : ''}
          ${photoBadge}
          <img src="${src}" alt="${cover.alt}" loading="lazy" decoding="async"
               onerror="this.onerror=null;this.src='${fallback}'">
        </a>
        <div class="apt-grid-card__body">
          <span class="apt-grid-card__meta">${apt.building} · ${apt.neighborhood}</span>
          <h3 class="apt-grid-card__title"><a href="${href}">${apt.name}</a></h3>
          <p class="apt-grid-card__tagline">${apt.tagline}</p>
          <div class="apt-grid-card__rating" aria-label="Nota ${apt.rating} de 5">
            <span class="apt-grid-card__stars">★ ${apt.rating.toFixed(1)}</span>
            ${apt.reviewCount ? `<span class="apt-grid-card__reviews">(${apt.reviewCount})</span>` : ''}
          </div>
          <ul class="apt-grid-card__chips">
            <li>${apt.bedrooms} quarto${apt.bedrooms > 1 ? 's' : ''}</li>
            <li>${apt.bathrooms} banh.</li>
            ${apt.pool ? '<li>Piscina</li>' : ''}
            ${apt.parking ? '<li>Garagem</li>' : ''}
          </ul>
          ${price}
          <div class="apt-grid-card__actions">
            <a href="${href}" class="btn btn--secondary btn--sm">Ver detalhes</a>
            <a href="${href}#reservar" class="btn btn--clay btn--sm">Reservar</a>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define('rf-apartment-grid-card', RFApartmentGridCard);
