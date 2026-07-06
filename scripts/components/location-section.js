/**
 * <rf-location-section> — Localização privilegiada + mapa Google Business + avaliações.
 *
 * Uso:
 *   <rf-location-section></rf-location-section>
 *
 * Reviews ao vivo: configure API key em scripts/config/google-maps.config.js
 * ou window.RF_GOOGLE_MAPS = { apiKey: '...', placeId: 'ChIJ...' }
 */

import {
  BUSINESS,
  MAPS_EMBED_URL,
  MAPS_LINKS,
  LOCATION_BENEFITS,
} from '../data/location.js';
import { loadReviews, renderStars } from '../utils/google-reviews.js';
import { prefersReducedMotion } from '../utils/dom.js';

function benefitCard(benefit) {
  const items = benefit.items.map((item) => `<li>${item}</li>`).join('');
  return `
    <article class="location-benefit" data-location-reveal>
      <h3 class="location-benefit__title">${benefit.title}</h3>
      <p class="location-benefit__desc">${benefit.description}</p>
      <ul class="location-benefit__list">${items}</ul>
    </article>
  `;
}

function reviewCard(review) {
  const authorLink = review.authorUri
    ? `<a href="${review.authorUri}" target="_blank" rel="noopener noreferrer" class="location-review__author">${review.author}</a>`
    : `<span class="location-review__author">${review.author}</span>`;

  return `
    <blockquote class="location-review" data-location-reveal>
      <div class="location-review__stars" aria-label="Nota ${review.rating} de 5">
        ${renderStars(review.rating)}
      </div>
      <p class="location-review__text">"${review.text}"</p>
      <footer class="location-review__footer">
        ${authorLink}
        ${review.relativeTime ? `<span class="location-review__time">${review.relativeTime}</span>` : ''}
      </footer>
    </blockquote>
  `;
}

function buildJsonLd(rating, reviewCount) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: BUSINESS.name,
    url: BUSINESS.website,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.state,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.lat,
      longitude: BUSINESS.lng,
    },
    areaServed: ['Boa Viagem', 'Pina', 'Recife'],
  };

  if (rating && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount,
      bestRating: 5,
    };
  }

  return JSON.stringify(schema);
}

class RFLocationSection extends HTMLElement {
  connectedCallback() {
    const benefits = LOCATION_BENEFITS.map(benefitCard).join('');
    const fullAddress = `${BUSINESS.streetAddress} — ${BUSINESS.neighborhood}, ${BUSINESS.city} - ${BUSINESS.state}`;

    this.innerHTML = `
      <section class="location-section" id="localizacao" aria-labelledby="location-heading">
        <div class="container location-section__inner">

          <header class="location-section__header" data-location-reveal>
              <span class="eyebrow eyebrow--pill">Recife bem localizado</span>
            <h2 class="location-section__title" id="location-heading">
              Perto da praia, shopping, aeroporto e da <em class="display-italic">vida real</em>
            </h2>
            <p class="location-section__lead">
              Nossos imóveis concentram-se em Boa Viagem e Pina — regiões práticas para lazer,
              trabalho, compras e deslocamento rápido em Recife.
            </p>
          </header>

          <div class="location-benefits">
            ${benefits}
          </div>

          <div class="location-panel" data-location-reveal>
            <div class="location-panel__map-col">
              <div class="location-map">
                <iframe
                  class="location-map__iframe"
                  src="${MAPS_EMBED_URL}"
                  title="Mapa — ${BUSINESS.name}, ${fullAddress}"
                  loading="lazy"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
                <div class="location-map__overlay">
                  <p class="location-map__address">
                    <strong>${BUSINESS.name}</strong>
                    <span>${fullAddress}</span>
                  </p>
                  <div class="location-map__actions">
                    <a href="${MAPS_LINKS.place}" class="btn btn--secondary btn--sm" target="_blank" rel="noopener noreferrer">
                      Ver no Google Maps
                    </a>
                    <a href="${MAPS_LINKS.directions}" class="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer">
                      Traçar rota
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="location-panel__reviews-col">
              <div class="location-reviews-header">
                <div class="location-rating" data-rating-summary aria-live="polite">
                  <div class="location-rating__score">
                    <span class="location-rating__value" data-rating-value>—</span>
                    <div class="location-stars" data-rating-stars aria-hidden="true"></div>
                  </div>
                  <p class="location-rating__meta">
                    <span data-rating-count>Carregando avaliações…</span>
                    <span class="location-rating__source">Google Business Profile</span>
                  </p>
                </div>
                <a href="${MAPS_LINKS.reviews}" class="location-reviews-link" target="_blank" rel="noopener noreferrer" data-reviews-link>
                  Ver todas no Google
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>
                </a>
              </div>

              <div class="location-reviews-list" data-reviews-list role="list">
                <p class="location-reviews-placeholder" data-reviews-placeholder>
                  Conecte a Places API para exibir avaliações reais aqui, ou veja diretamente no Google Maps.
                </p>
              </div>
            </div>
          </div>

        </div>
        <script type="application/ld+json" data-location-schema></script>
      </section>
    `;

    this._loadReviews();
    this._animate();
  }

  async _loadReviews() {
    const data = await loadReviews();

    const valueEl  = this.querySelector('[data-rating-value]');
    const starsEl  = this.querySelector('[data-rating-stars]');
    const countEl  = this.querySelector('[data-rating-count]');
    const listEl   = this.querySelector('[data-reviews-list]');
    const placeholder = this.querySelector('[data-reviews-placeholder]');
    const linkEl   = this.querySelector('[data-reviews-link]');
    const schemaEl = this.querySelector('[data-location-schema]');

    const rating = data.rating ?? 4.9;
    const count  = data.userRatingCount ?? 0;

    if (valueEl) valueEl.textContent = rating.toFixed(1);
    if (starsEl) {
      starsEl.innerHTML = renderStars(rating);
      starsEl.setAttribute('aria-label', `Nota média ${rating} de 5`);
    }
    if (countEl) {
      countEl.textContent = count
        ? `${count} avaliações no Google${data.live ? '' : ' (configure a API para atualizar)'}`
        : 'Avaliações no Google Business Profile';
    }

    if (data.googleMapsUri && linkEl) linkEl.href = data.googleMapsUri;

    if (schemaEl) {
      schemaEl.textContent = buildJsonLd(rating, count);
    }

    if (!listEl) return;

    if (data.reviews?.length) {
      placeholder?.remove();
      listEl.innerHTML = data.reviews.map(reviewCard).join('');
      listEl.setAttribute('aria-label', 'Avaliações de hóspedes no Google');
    } else if (placeholder) {
      placeholder.innerHTML = data.live
        ? 'Nenhuma avaliação com texto disponível no momento. <a href="' + MAPS_LINKS.reviews + '" target="_blank" rel="noopener noreferrer">Veja no Google Maps</a>.'
        : `Nota <strong>${rating}</strong> no Google — <a href="${MAPS_LINKS.reviews}" target="_blank" rel="noopener noreferrer">leia as avaliações reais</a> ou configure a Places API para exibi-las aqui.`;
    }
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;

    const reveals = this.querySelectorAll('[data-location-reveal]');
    reveals.forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: 'power2.out',
        delay: i * 0.03,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      });
    });
  }
}

customElements.define('rf-location-section', RFLocationSection);
