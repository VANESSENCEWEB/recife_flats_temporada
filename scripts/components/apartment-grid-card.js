/**
 * <rf-apartment-grid-card> — Card estilo property (design exemplo).
 */

import { getApartmentBySlug, resolveImages, FALLBACK_IMAGE } from '../data/apartamentos.js';
import { apartmentUrl } from '../data/site-structure.js';

const TAG_CLASS = {
  'boa-viagem': 'property__tag--bv',
  pina: 'property__tag--sea',
};

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
    const tagClass = TAG_CLASS[apt.neighborhoodSlug] || 'property__tag--bv';
    const tagLabel = apt.badge || apt.neighborhood;
    const sizeNum = apt.size.replace(/[^\d]/g, '') || apt.size;

    const price = apt.priceFrom
      ? `<div class="property__price">${apt.priceFrom} <small>${apt.priceNote}</small></div>`
      : `<div class="property__price"><small>${apt.priceNote}</small></div>`;

    this.innerHTML = `
      <article class="property"
               data-apt-grid-card
               data-bairro="${apt.neighborhoodSlug}"
               data-bedrooms="${apt.bedrooms}"
               data-pool="${apt.pool}"
               data-parking="${apt.parking}"
               data-neighborhood="${apt.neighborhoodSlug}">
        <a href="${href}" class="property__media">
          <img src="${src}" alt="${cover.alt}" loading="lazy" decoding="async"
               onerror="this.onerror=null;this.src='${fallback}'">
          <span class="property__tag ${tagClass}">${tagLabel}</span>
          ${apt.images.length > 1 ? `<span class="property__tag property__tag--accent" style="left:auto;right:0.75rem;background:rgba(13,13,13,.65)">${apt.images.length} fotos</span>` : ''}
        </a>
        <div class="property__body">
          <span class="property__loc">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/></svg>
            ${apt.neighborhood}, Recife — PE
          </span>
          <h3 class="property__title"><a href="${href}">${apt.name}</a></h3>
          <div class="property__stats">
            <span class="property__stat"><strong>${sizeNum}</strong> m²</span>
            <span class="property__stat"><strong>${apt.bedrooms}</strong> quarto${apt.bedrooms > 1 ? 's' : ''}</span>
            <span class="property__stat"><strong>${apt.guests}</strong> hóspedes</span>
          </div>
          <div class="property__foot">
            ${price}
            <a href="${href}#reservar" class="link-arrow">Reservar</a>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define('rf-apartment-grid-card', RFApartmentGridCard);
