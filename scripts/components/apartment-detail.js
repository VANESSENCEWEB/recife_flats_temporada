/**
 * <rf-apartment-detail> — Página individual estilo template (galeria, booking, seções).
 */

import { getApartmentBySlug, resolveImages, FALLBACK_IMAGE, APARTAMENTOS } from '../data/apartamentos.js';
import { getApartmentDetailExtras } from '../data/apartment-detail-data.js';
import { getNeighborhood, apartmentUrl, pageHref } from '../data/site-structure.js';
import { BUSINESS, whatsappUrl, MAPS_EMBED_URL } from '../data/location.js';
import { initApartmentDetailPage } from '../utils/apartment-detail-page.js';

function stars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function renderMosaicGallery(images) {
  const tiles = images.slice(0, 5);
  while (tiles.length < 5 && images.length) {
    tiles.push(images[tiles.length % images.length]);
  }

  const cells = tiles.map((img, i) => `
    <button type="button" class="apt-mosaic__item${i === 0 ? ' apt-mosaic__item--hero' : ''}" data-gallery-tile aria-label="Ver foto ${i + 1}">
      <img src="${img.src}" alt="${img.alt}" loading="${i === 0 ? 'eager' : 'lazy'}" onerror="this.onerror=null;this.src='${img.placeholder}'">
    </button>
  `).join('');

  const modalItems = images.map((img, i) => `
    <figure class="apt-gallery-modal__item">
      <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.onerror=null;this.src='${img.placeholder}'">
      <figcaption>${img.alt || `Foto ${i + 1}`}</figcaption>
    </figure>
  `).join('');

  return `
    <div class="apt-mosaic" data-apt-gallery>
      ${cells}
      ${images.length > 1 ? `
        <button type="button" class="apt-mosaic__all" data-gallery-open>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          Mostrar todas as fotos (${images.length})
        </button>
      ` : ''}
    </div>
    <div class="apt-gallery-modal" data-gallery-modal role="dialog" aria-modal="true" aria-label="Galeria de fotos">
      <div class="apt-gallery-modal__header">
        <span class="apt-gallery-modal__title">Todas as fotos</span>
        <button type="button" class="apt-gallery-modal__close" data-gallery-close aria-label="Fechar galeria">×</button>
      </div>
      <div class="apt-gallery-modal__grid">${modalItems}</div>
    </div>
  `;
}

function renderOtherApartments(currentSlug) {
  const others = APARTAMENTOS.filter((a) => a.slug !== currentSlug).slice(0, 3);
  return others.map((a) => {
    const cover = resolveImages(a)[0];
    return `
    <a href="${apartmentUrl(a.slug)}" class="apt-related-card">
      <div class="apt-related-card__media">
        <img src="${cover.src}" alt="${a.name}" loading="lazy" onerror="this.onerror=null;this.src='${cover.placeholder}'">
        ${a.badge ? `<span class="apt-related-card__tag">${a.badge}</span>` : ''}
      </div>
      <div class="apt-related-card__body">
        <h3 class="apt-related-card__title">${a.name}</h3>
        <p class="apt-related-card__meta">${a.neighborhood} · ${a.building}</p>
        <div class="apt-related-card__chips">
          ${a.amenities.slice(0, 3).map((x) => `<span>${x}</span>`).join('')}
        </div>
        <div class="apt-related-card__footer">
          <span class="apt-related-card__price">${a.priceFrom ? `${a.priceFrom}${a.priceNote}` : a.priceNote}</span>
          <span class="apt-related-card__rating">★ ${a.rating.toFixed(1)}</span>
        </div>
      </div>
    </a>
  `;
  }).join('');
}

class RFApartmentDetail extends HTMLElement {
  connectedCallback() {
    const params = new URLSearchParams(window.location.search);
    const slug   = this.getAttribute('slug') || params.get('slug');
    const apt    = getApartmentBySlug(slug);
    const extras = slug ? getApartmentDetailExtras(slug) : null;

    if (!apt || !extras) {
      this.innerHTML = `
        <section class="apt-page apt-page--error">
          <div class="container">
            <h1>Apartamento não encontrado</h1>
            <p><a href="${pageHref('./apartamentos.html')}" class="btn btn--primary">Ver apartamentos</a></p>
          </div>
        </section>
      `;
      return;
    }

    const images = resolveImages(apt);
    const n = getNeighborhood(apt.neighborhoodSlug);
    const waBase = whatsappUrl(`Olá! Tenho interesse no ${apt.name}.`);
    const priceDisplay = apt.priceFrom
      ? `<span class="apt-booking__amount">${apt.priceFrom}</span><span class="apt-booking__unit">${apt.priceNote}</span>`
      : `<span class="apt-booking__amount apt-booking__amount--consult">${apt.priceNote}</span>`;

    document.title = `${extras.seoTitle} — Recife Flats Temporada`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.content = `${apt.tagline}. ${apt.building}, ${apt.neighborhood}. Reserve direto com a Recife Flats Temporada.`;
    }

    const badges = [
      apt.bedrooms ? `🛏️ ${apt.bedrooms} quarto${apt.bedrooms > 1 ? 's' : ''}` : null,
      `👥 até ${apt.guests} pessoas`,
      apt.pool ? '🏊 Piscina' : null,
      '📶 WiFi',
      apt.parking ? '🅿️ Estacionamento' : null,
      apt.petFriendly ? '🐾 Pet friendly' : null,
    ].filter(Boolean);

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Accommodation',
      name: apt.name,
      description: apt.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: apt.neighborhood,
        addressRegion: 'PE',
        addressCountry: 'BR',
      },
      numberOfRooms: String(apt.bedrooms),
      occupancy: { '@type': 'QuantitativeValue', maxValue: String(apt.guests) },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: String(apt.rating),
        reviewCount: String(apt.reviewCount || 1),
      },
    };
    if (extras.pricePerNight) {
      schema.offers = {
        '@type': 'Offer',
        price: String(extras.pricePerNight),
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
      };
    }

    this.innerHTML = `
      <article class="apt-page" data-apt-page>

        <nav class="apt-page-nav" aria-label="Seções do apartamento">
          <div class="container apt-page-nav__inner">
            <a href="#visao-geral" class="apt-page-nav__link is-active" data-apt-nav>Visão geral</a>
            <a href="#comodidades" class="apt-page-nav__link" data-apt-nav>Comodidades</a>
            <a href="#avaliacoes" class="apt-page-nav__link" data-apt-nav>Avaliações</a>
            <a href="#localizacao" class="apt-page-nav__link" data-apt-nav>Localização</a>
            <a href="#regras" class="apt-page-nav__link" data-apt-nav>Regras</a>
            <a href="#reserva" class="apt-page-nav__link" data-apt-nav>Reservar</a>
          </div>
        </nav>

        <div class="container apt-page__container">

          <header class="apt-page__title" id="visao-geral">
            <h1 class="apt-page__h1">${extras.seoTitle.replace(/ \|.*/, '')}</h1>
            <div class="apt-page__meta">
              <div class="apt-page__rating">
                <span class="apt-page__rating-badge">${apt.rating.toFixed(1)} ★</span>
                <span class="apt-page__rating-label">${extras.ratingLabel}</span>
                ${apt.reviewCount ? `<span class="apt-page__rating-count">· ${apt.reviewCount} avaliações</span>` : ''}
              </div>
              <a href="#localizacao" class="apt-page__location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                ${apt.neighborhood}, Recife — PE
              </a>
            </div>
            <div class="apt-page__badges">
              ${badges.map((b) => `<span class="apt-page__badge">${b}</span>`).join('')}
            </div>
          </header>

          ${renderMosaicGallery(images)}

          <div class="apt-page__layout">

            <div class="apt-page__main">

              <section class="apt-card" id="visao-geral-card">
                <h2 class="apt-card__title">${extras.overviewTitle}</h2>
                <p class="apt-card__subtitle">${extras.overviewSubtitle}</p>
                <div class="apt-highlights">
                  ${extras.highlights.map((h) => `
                    <div class="apt-highlight">
                      <span class="apt-highlight__icon" aria-hidden="true">${h.icon}</span>
                      <div>
                        <h3 class="apt-highlight__title">${h.title}</h3>
                        <p class="apt-highlight__text">${h.text}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </section>

              <section class="apt-card">
                <h2 class="apt-card__title">Sobre este espaço</h2>
                <div class="apt-description">
                  ${extras.extendedDescription.map((p) => `<p>${p}</p>`).join('')}
                  <p>${apt.description}</p>
                </div>
              </section>

              <section class="apt-card" id="comodidades">
                <h2 class="apt-card__title">O que este lugar oferece</h2>
                <p class="apt-card__subtitle">Tudo o que você precisa para uma estadia confortável</p>
                <div class="apt-amenities">
                  ${extras.amenityItems.map((a) => `
                    <div class="apt-amenity"><span class="apt-amenity__icon">${a.icon}</span><span>${a.label}</span></div>
                  `).join('')}
                </div>
              </section>

              <section class="apt-card" id="avaliacoes">
                <div class="apt-reviews-score">
                  <span class="apt-reviews-score__big">${apt.rating.toFixed(1)}</span>
                  <div>
                    <div class="apt-reviews-score__stars" aria-hidden="true">${stars(apt.rating)}</div>
                    <p class="apt-reviews-score__label">${extras.ratingLabel}
                      ${apt.reviewCount ? `<span>· ${apt.reviewCount} avaliações</span>` : ''}
                    </p>
                  </div>
                </div>
                <h2 class="apt-card__title">Avaliações</h2>
                <div class="apt-reviews-bars">
                  ${extras.ratingCategories.map((c) => `
                    <div class="apt-review-bar">
                      <span class="apt-review-bar__name">${c.name}</span>
                      <div class="apt-review-bar__track"><div class="apt-review-bar__fill" style="width:${(c.score / 5) * 100}%"></div></div>
                      <span class="apt-review-bar__score">${c.score.toFixed(1)}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="apt-reviews-list">
                  ${extras.sampleReviews.length
    ? extras.sampleReviews.map((r) => `
                      <blockquote class="apt-review">
                        <header class="apt-review__head">
                          <span class="apt-review__avatar" aria-hidden="true">${r.author.charAt(0)}</span>
                          <div>
                            <strong class="apt-review__author">${r.author}</strong>
                            <span class="apt-review__date">${r.date}</span>
                          </div>
                          <span class="apt-review__stars" aria-label="Nota ${r.rating}">${stars(r.rating)}</span>
                        </header>
                        <p>${r.text}</p>
                      </blockquote>
                    `).join('')
    : `<p class="apt-reviews-empty">Veja avaliações reais no <a href="${BUSINESS.website}" target="_blank" rel="noopener noreferrer">Google Business Profile</a>.</p>`}
                </div>
              </section>

              <section class="apt-card" id="localizacao">
                <h2 class="apt-card__title">Localização</h2>
                <p class="apt-card__subtitle">${apt.neighborhood}, Recife — PE · ${apt.building}</p>
                <div class="apt-map">
                  <iframe src="${MAPS_EMBED_URL}" title="Mapa — ${apt.name}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                <div class="apt-nearby">
                  ${extras.nearby.map((p) => `
                    <div class="apt-nearby__item">
                      <span class="apt-nearby__icon" aria-hidden="true">${p.icon}</span>
                      <div><strong>${p.title}</strong><span>${p.distance}</span></div>
                    </div>
                  `).join('')}
                </div>
                ${n ? `<p class="apt-nb-blurb">${n.intro}</p>` : ''}
              </section>

              <section class="apt-card" id="regras">
                <h2 class="apt-card__title">O que você precisa saber</h2>
                <h3 class="apt-card__h3">Regras da casa</h3>
                <ul class="apt-rules">
                  ${extras.rules.map((r) => `
                    <li class="apt-rules__item${r.negative ? ' apt-rules__item--no' : ''}">
                      <span aria-hidden="true">${r.icon}</span> ${r.text}
                    </li>
                  `).join('')}
                </ul>
                <h3 class="apt-card__h3">Saúde e segurança</h3>
                <ul class="apt-rules">
                  ${extras.safetyRules.map((r) => `
                    <li class="apt-rules__item"><span aria-hidden="true">${r.icon}</span> ${r.text}</li>
                  `).join('')}
                </ul>
                <h3 class="apt-card__h3">Política de cancelamento</h3>
                <p class="apt-cancel">${extras.cancellation}</p>
              </section>

            </div>

            <aside class="apt-page__aside" id="reserva">
              <div class="apt-booking">
                <div class="apt-booking__price">${priceDisplay}</div>

                <div class="apt-booking__form">
                  <label class="apt-booking__field">
                    <span>Check-in</span>
                    <input type="date" class="apt-booking__input" data-checkin>
                  </label>
                  <label class="apt-booking__field">
                    <span>Check-out</span>
                    <input type="date" class="apt-booking__input" data-checkout>
                  </label>
                  <div class="apt-booking__field apt-booking__guests">
                    <span>Hóspedes</span>
                    <button type="button" class="apt-booking__input apt-booking__guests-btn" data-guests-toggle>
                      <span data-guests-display>2 adultos · 0 crianças</span>
                    </button>
                    <div class="apt-booking__guests-panel" data-guests-panel>
                      <div class="apt-booking__guest-row">
                        <div><strong>Adultos</strong><small>13 anos ou mais</small></div>
                        <div class="apt-booking__counter">
                          <button type="button" data-adults-down aria-label="Menos adultos">−</button>
                          <span data-adults-count>2</span>
                          <button type="button" data-adults-up aria-label="Mais adultos">+</button>
                        </div>
                      </div>
                      <div class="apt-booking__guest-row">
                        <div><strong>Crianças</strong><small>2 a 12 anos</small></div>
                        <div class="apt-booking__counter">
                          <button type="button" data-children-down aria-label="Menos crianças">−</button>
                          <span data-children-count>0</span>
                          <button type="button" data-children-up aria-label="Mais crianças">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="button" class="apt-booking__reserve btn btn--primary btn--block" data-reserve-btn>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A10 10 0 0 0 3.6 17l-1.6 5 5.1-1.6A10 10 0 1 0 20.5 3.5z"/></svg>
                  Reservar via WhatsApp
                </button>
                <p class="apt-booking__notice">Você não será cobrado agora · Sem taxas de plataforma</p>

                ${extras.pricePerNight ? `
                  <div class="apt-booking__breakdown">
                    <div class="apt-booking__row">
                      <span>${apt.priceFrom} × <span data-nights-count>5</span> noites</span>
                      <span data-subtotal>—</span>
                    </div>
                    ${extras.cleaningFee ? `<div class="apt-booking__row"><span>Taxa de limpeza</span><span>${formatBRL(extras.cleaningFee)}</span></div>` : ''}
                    <div class="apt-booking__total">
                      <span>Total estimado</span>
                      <span data-total>—</span>
                    </div>
                  </div>
                ` : ''}

                <div class="apt-booking__trust">
                  <p>🔒 Reserva segura e direta</p>
                  <p>💬 Suporte pelo WhatsApp</p>
                  <p>📋 Regras claras antes de fechar</p>
                </div>
              </div>
            </aside>

          </div>

          <div class="apt-cta-wa">
            <span class="apt-cta-wa__icon" aria-hidden="true">💬</span>
            <div>
              <h3>Pronto para reservar?</h3>
              <p>Fale direto conosco pelo WhatsApp — sem taxas, sem intermediários.</p>
              <a href="${waBase}" class="btn btn--secondary" target="_blank" rel="noopener noreferrer">${BUSINESS.phoneDisplay}</a>
            </div>
          </div>

        </div>

        <section class="apt-related">
          <div class="container">
            <header class="apt-related__header">
              <h2>Outros apartamentos disponíveis</h2>
              <p>Explore mais opções da Recife Flats Temporada</p>
            </header>
            <div class="apt-related__grid">${renderOtherApartments(apt.slug)}</div>
            <p class="apt-related__cta">
              <a href="${pageHref('./apartamentos.html')}" class="btn btn--primary">Ver todos os apartamentos</a>
            </p>
          </div>
        </section>

        <script type="application/ld+json">${JSON.stringify(schema)}</script>
      </article>
    `;

    initApartmentDetailPage(this.querySelector('[data-apt-page]'), {
      pricePerNight: extras.pricePerNight,
      cleaningFee: extras.cleaningFee,
      maxGuests: apt.guests,
      waReserveUrl: waBase,
    });
  }
}

function formatBRL(n) {
  return `R$ ${n.toLocaleString('pt-BR')}`;
}

customElements.define('rf-apartment-detail', RFApartmentDetail);
