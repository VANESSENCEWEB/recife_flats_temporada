/**
 * <rf-apartment-card> — Card de apartamento estilo hospedagem.
 *
 * Uso:
 *   <rf-apartment-card slug="boa-viagem-201"></rf-apartment-card>
 *   <rf-apartment-card slug="boa-viagem-201" reverse></rf-apartment-card>
 */

import { getApartmentBySlug, resolveImages, FALLBACK_IMAGE } from '../data/apartamentos.js';
import { apartmentUrl, getBreadcrumbs, getNeighborhood } from '../data/site-structure.js';
import { initGallery } from '../utils/gallery.js';

const ICONS = {
  bed: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`,
  users: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  bath: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.12 0L3 5"/><path d="M4 10h16"/><path d="M4 10v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M12 4v6"/></svg>`,
  parking: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`,
  noParking: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`,
  area: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
};

function renderGallery(images, name) {
  const [first, ...rest] = images;
  const mainSrc = first.src || first.placeholder || FALLBACK_IMAGE;
  const mainFallback = first.placeholder || FALLBACK_IMAGE;

  const thumbs = images.map((img, i) => {
    const src = img.src || img.placeholder || FALLBACK_IMAGE;
    const fallback = img.placeholder || FALLBACK_IMAGE;
    return `
      <button type="button"
              class="apt-card__thumb${i === 0 ? ' is-active' : ''}"
              data-gallery-thumb
              data-src="${src}"
              data-alt="${img.alt}"
              aria-label="Ver foto ${i + 1} de ${name}">
        <img src="${src}" alt="" loading="lazy" decoding="async"
             onerror="this.onerror=null;this.src='${fallback}'">
      </button>
    `;
  }).join('');

  return `
    <div class="apt-card__gallery apt-gallery" data-gallery tabindex="0" aria-label="Fotos de ${name}">
      <div class="apt-gallery__stage">
        <img class="apt-gallery__main" data-gallery-main
             src="${mainSrc}" alt="${first.alt}"
             loading="lazy" decoding="async"
             onerror="this.onerror=null;this.src='${mainFallback}'">
        ${images.length > 1 ? `
          <button type="button" class="apt-gallery__nav apt-gallery__nav--prev" data-gallery-prev aria-label="Foto anterior">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button type="button" class="apt-gallery__nav apt-gallery__nav--next" data-gallery-next aria-label="Próxima foto">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <span class="apt-gallery__counter" aria-hidden="true">1 / ${images.length}</span>
        ` : ''}
      </div>
      ${images.length > 1 ? `<div class="apt-gallery__thumbs">${thumbs}</div>` : ''}
    </div>
  `;
}

class RFApartmentCard extends HTMLElement {
  connectedCallback() {
    const slug    = this.getAttribute('slug');
    const reverse = this.hasAttribute('reverse');
    const apt     = getApartmentBySlug(slug);

    if (!apt) {
      this.innerHTML = `<p class="apt-card__error">Apartamento não encontrado.</p>`;
      return;
    }

    const images = resolveImages(apt);
    const detailHref = apartmentUrl(apt.slug);
    const bookHref   = `${detailHref}#reservar`;

    this.innerHTML = `
      <article class="apt-card${reverse ? ' apt-card--reverse' : ''}" data-apt-card>
        ${renderGallery(images, apt.name)}

        <div class="apt-card__body">
          <header class="apt-card__header">
            <span class="apt-card__eyebrow">${apt.neighborhood}</span>
            <h3 class="apt-card__title">${apt.name}</h3>
            <p class="apt-card__tagline">${apt.tagline}</p>
          </header>

          <ul class="apt-card__stats" aria-label="Informações do apartamento">
            <li>${ICONS.bed} ${apt.bedrooms} quarto${apt.bedrooms > 1 ? 's' : ''} · ${apt.beds} camas</li>
            <li>${ICONS.users} Até ${apt.guests} hóspedes</li>
            <li>${ICONS.bath} ${apt.bathrooms} banheiro${apt.bathrooms > 1 ? 's' : ''}</li>
            <li>${ICONS.area} ${apt.size}</li>
            <li class="apt-card__stat--parking">
              ${apt.parking ? ICONS.parking : ICONS.noParking}
              ${apt.parking ? 'Com vaga de garagem' : 'Sem vaga de garagem'}
            </li>
          </ul>

          <ul class="apt-card__amenities" aria-label="Comodidades">
            ${apt.amenities.map((a) => `<li>${a}</li>`).join('')}
          </ul>

          <p class="apt-card__desc">${apt.description}</p>

          <div class="apt-card__actions">
            <a href="${detailHref}" class="btn btn--secondary">Saiba mais</a>
            <a href="${bookHref}" class="btn btn--primary">Reservar agora</a>
          </div>
        </div>
      </article>
    `;

    initGallery(this.querySelector('[data-gallery]'));
  }
}

customElements.define('rf-apartment-card', RFApartmentCard);
