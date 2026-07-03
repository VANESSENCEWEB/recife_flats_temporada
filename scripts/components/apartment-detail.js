/**
 * <rf-apartment-detail> — Template completo (mosaico, reserva fixa, specs, mapa, etc.)
 */

import { getApartmentBySlug, resolveImages, FALLBACK_IMAGE, APARTAMENTOS } from '../data/apartamentos.js';
import { getApartmentDetailExtras } from '../data/apartment-detail-data.js';
import { getNeighborhood, apartmentUrl, pageHref } from '../data/site-structure.js';
import { BUSINESS, whatsappUrl, MAPS_EMBED_URL } from '../data/location.js';
import { initApartmentDetailPage } from '../utils/apartment-detail-page.js';

const TICKER_ITEMS = [
  '🏠 Flats mobiliados em Boa Viagem',
  '🌊 A 100m da praia',
  '📶 WiFi 300Mbps',
  '🏊 Piscina e academia',
  '🔒 Segurança 24h',
  '⭐ Nota 4.9',
  '💬 Reserva direta sem taxas',
];

function stars(rating) {
  const n = Math.round(rating);
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function renderTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
    .map((t) => `<span class="apt-ticker__item">${t}</span>`)
    .join('');
  return `<div class="apt-ticker" aria-hidden="true"><div class="apt-ticker__track">${items}</div></div>`;
}

function renderGallery(images) {
  const tiles = images.slice(0, 5);
  while (tiles.length < 5 && images.length) tiles.push(images[tiles.length % images.length]);

  const cells = tiles.map((img, i) => `
    <div class="gallery-item${i === 0 ? ' gallery-item--hero' : ''}" data-gallery-tile role="button" tabindex="0" aria-label="Ver foto ${i + 1}">
      <img src="${img.src}" alt="${img.alt}" loading="${i === 0 ? 'eager' : 'lazy'}" onerror="this.onerror=null;this.src='${img.placeholder}'">
    </div>
  `).join('');

  const modalItems = images.map((img, i) => `
    <div class="modal-gallery-item">
      <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.onerror=null;this.src='${img.placeholder}'">
      <span class="modal-image-label">${img.alt || `Foto ${i + 1}`}</span>
    </div>
  `).join('');

  return `
    <div class="gallery" data-apt-gallery>
      ${cells}
      ${images.length > 1 ? `
        <button type="button" class="show-all-photos" data-gallery-open>
          <i class="fas fa-images" aria-hidden="true"></i>
          Mostrar todas as fotos
        </button>
      ` : ''}
    </div>
    <div class="gallery-modal" data-gallery-modal role="dialog" aria-modal="true" aria-label="Galeria de fotos">
      <div class="modal-header">
        <span class="modal-title">Todas as fotos do apartamento</span>
        <button type="button" class="modal-close" data-gallery-close aria-label="Fechar">×</button>
      </div>
      <div class="modal-gallery">${modalItems}</div>
    </div>
  `;
}

function renderMatchingCta() {
  return `
    <section class="apt-matching-cta">
      <div class="container apt-matching-cta__inner">
        <div class="apt-matching-cta__icon" aria-hidden="true">🎯</div>
        <div class="apt-matching-cta__text">
          <h3>Em dúvida se este é o apartamento certo pra você?</h3>
          <p>Responda 6 perguntas rápidas e descubra, em menos de 1 minuto, qual apê da Recife Flats combina mais com a sua viagem.</p>
        </div>
        <button type="button" class="btn btn--sun apt-matching-cta__btn" data-open-matching>
          <span aria-hidden="true">⚡</span> Fazer Matching agora
        </button>
      </div>
    </section>
  `;
}

function renderOtherApartments(currentSlug) {
  return APARTAMENTOS.filter((a) => a.slug !== currentSlug).map((a) => {
    const cover = resolveImages(a)[0];
    const chips = a.amenities.slice(0, 4);
    return `
      <a href="${apartmentUrl(a.slug)}" class="apt-card-link">
        <div class="apt-card-link__img">
          <img src="${cover.src}" alt="${a.name}" loading="lazy" onerror="this.onerror=null;this.src='${cover.placeholder}'">
          ${a.badge ? `<span class="apt-card-link__tag">${a.badge}</span>` : ''}
        </div>
        <div class="apt-card-link__body">
          <h3 class="apt-card-link__title">${a.name}</h3>
          <p class="apt-card-link__meta">
            <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
            ${a.neighborhood} · ${a.building}
          </p>
          <div class="apt-card-link__chips">
            ${chips.map((c) => `<span class="apt-amenity-chip">${c}</span>`).join('')}
          </div>
          <div class="apt-card-link__footer">
            <span class="apt-card-link__price">${a.priceFrom ? `${a.priceFrom}<span>${a.priceNote}</span>` : a.priceNote}</span>
            <span class="apt-card-link__rating">★ ${a.rating.toFixed(1)}${a.reviewCount ? ` · ${a.reviewCount} avl.` : ''}</span>
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
          <div class="container"><h1>Apartamento não encontrado</h1>
          <p><a href="${pageHref('./apartamentos.html')}" class="btn btn--primary">Ver apartamentos</a></p></div>
        </section>`;
      return;
    }

    const images = resolveImages(apt);
    const n = getNeighborhood(apt.neighborhoodSlug);
    const waBase = whatsappUrl(`Olá! Tenho interesse no ${apt.name}.`);

    document.title = `${extras.seoTitle} — Recife Flats Temporada`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `${apt.tagline}. ${apt.building}, ${apt.neighborhood}. Reserve direto.`;

    const titleBadges = [
      `🏠 ${apt.bedrooms} quarto${apt.bedrooms > 1 ? 's' : ''}`,
      `👥 até ${apt.guests} pessoas`,
      apt.pool ? '🏊 Piscina' : null,
      '📶 WiFi 300Mbps',
      apt.parking ? '🅿️ Estacionamento' : null,
    ].filter(Boolean);

    const priceHtml = apt.priceFrom
      ? `<span class="price">${apt.priceFrom}</span><span class="price-label"> ${apt.priceNote}</span>`
      : `<span class="price price--consult">${apt.priceNote}</span>`;

    const breakdownHtml = extras.pricePerNight ? `
      <div class="price-breakdown">
        <div class="price-row"><span>${apt.priceFrom} × <span data-nights-count>5</span> noites</span><span data-subtotal>—</span></div>
        ${extras.cleaningFee ? `<div class="price-row"><span>Taxa de limpeza</span><span>${formatBRL(extras.cleaningFee)}</span></div>` : ''}
        <div class="price-total"><span>Total</span><span data-total>—</span></div>
      </div>
    ` : '';

    this.innerHTML = `
      <article class="apt-page" data-apt-page>

        ${renderTicker()}

        <nav class="apt-nav" aria-label="Seções do apartamento">
          <div class="container apt-nav__inner">
            <a href="#visao-geral" class="apt-nav__link is-active" data-apt-nav>Visão Geral</a>
            <a href="#comodidades" class="apt-nav__link" data-apt-nav>Comodidades</a>
            <a href="#avaliacoes" class="apt-nav__link" data-apt-nav>Avaliações</a>
            <a href="#localizacao" class="apt-nav__link" data-apt-nav>Localização</a>
            <a href="#regras" class="apt-nav__link" data-apt-nav>Regras</a>
            <a href="#reserva" class="apt-nav__link" data-apt-nav>Reservar</a>
          </div>
        </nav>

        <div class="container apt-page__body">

          <header class="title-section" id="visao-geral">
            <h1>${extras.seoTitle.replace(/ \|.*/, '')}</h1>
            <div class="rating-location">
              <div class="rating">
                <span class="rating-badge">${apt.rating.toFixed(1)} ★</span>
                <span class="rating-text">${extras.ratingLabel}</span>
                ${apt.reviewCount ? `<span class="rating-count">· ${apt.reviewCount} avaliações</span>` : ''}
              </div>
              <a href="#localizacao" class="location-link">
                <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                ${apt.neighborhood}, Recife — PE
              </a>
            </div>
            <div class="apt-badges">
              ${titleBadges.map((b) => `<span class="apt-badge">${b}</span>`).join('')}
            </div>
          </header>

          ${renderGallery(images)}

          <div class="main-content">

            <div class="left-column">

              <section class="card">
                <h2>${extras.overviewTitle}</h2>
                <p class="card-subtitle">${extras.overviewSubtitle}</p>
                <div class="highlights">
                  ${extras.highlights.map((h) => `
                    <div class="highlight-item">
                      <div class="highlight-icon"><i class="${h.icon}" aria-hidden="true"></i></div>
                      <div class="highlight-content">
                        <h4>${h.title}</h4>
                        <p>${h.text}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </section>

              <section class="card">
                <h2>Sobre este espaço</h2>
                <div class="description">
                  ${extras.extendedDescription.map((p) => `<p>${p}</p>`).join('')}
                  <p>${apt.description}</p>
                </div>
              </section>

              <section class="card" id="comodidades">
                <h2>O que este lugar oferece</h2>
                <p class="card-subtitle">Tudo o que você precisa para uma estadia perfeita</p>
                <div class="amenities-grid">
                  ${extras.amenityItems.map((a) => `
                    <div class="amenity-item"><span class="amenity-icon">${a.icon}</span><span>${a.label}</span></div>
                  `).join('')}
                </div>
              </section>

              <section class="card" id="avaliacoes">
                <div class="review-score-big">
                  <div class="big-score">${apt.rating.toFixed(1)}</div>
                  <div>
                    <div class="review-stars-big" aria-hidden="true">${stars(apt.rating)}</div>
                    <div class="score-label">${extras.ratingLabel}
                      ${apt.reviewCount ? `<span>${apt.reviewCount} avaliações verificadas</span>` : ''}
                    </div>
                  </div>
                </div>
                <h2>Avaliações</h2>
                <div class="reviews-summary">
                  ${extras.ratingCategories.map((c) => `
                    <div class="review-category">
                      <span class="category-name">${c.name}</span>
                      <div class="category-bar"><div class="category-fill" style="width:${(c.score / 5) * 100}%"></div></div>
                      <span class="category-score">${c.score.toFixed(1)}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="reviews-list">
                  ${extras.sampleReviews.length
    ? extras.sampleReviews.map((r) => `
                    <div class="review-card">
                      <div class="review-header">
                        <div class="review-avatar">${r.author.charAt(0)}</div>
                        <div class="review-author"><h4>${r.author}</h4><span class="review-date">${r.date}</span></div>
                        <div class="review-stars">${stars(r.rating)}</div>
                      </div>
                      <p class="review-text">${r.text}</p>
                    </div>
                  `).join('')
    : `<p class="reviews-empty">Veja avaliações no <a href="${MAPS_EMBED_URL}" target="_blank" rel="noopener noreferrer">Google Maps</a>.</p>`}
                </div>
              </section>

              <section class="card" id="localizacao">
                <h2>Localização</h2>
                <p class="card-subtitle">${apt.neighborhood}, Recife — PE · ${apt.building}</p>
                <div class="location-map">
                  <iframe src="${MAPS_EMBED_URL}" title="Mapa — ${apt.name}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                <div class="nearby-places">
                  ${extras.nearby.map((p) => `
                    <div class="place-item">
                      <div class="place-icon"><i class="${p.icon}" aria-hidden="true"></i></div>
                      <div class="place-info"><h4>${p.title}</h4><p>${p.distance}</p></div>
                    </div>
                  `).join('')}
                </div>
                ${n ? `<p class="neighborhood-blurb">${n.intro}</p>` : ''}
              </section>

              <section class="card" id="regras">
                <h2>O que você precisa saber</h2>
                <h3 class="card-h3">Regras da casa</h3>
                <div class="rules-list">
                  ${extras.rules.map((r) => `
                    <div class="rule-row${r.negative ? ' rule-row--no' : ''}"><i class="${r.icon}" aria-hidden="true"></i> ${r.text}</div>
                  `).join('')}
                </div>
                <h3 class="card-h3">Saúde e segurança</h3>
                <div class="rules-list">
                  ${extras.safetyRules.map((r) => `
                    <div class="rule-row"><i class="${r.icon}" aria-hidden="true"></i> ${r.text}</div>
                  `).join('')}
                </div>
                <h3 class="card-h3">Política de cancelamento</h3>
                <p class="cancel-text">${extras.cancellation}</p>
              </section>

            </div>

            <aside class="booking-aside" id="reserva">
              <div class="booking-card">
                <div class="price-section">${priceHtml}</div>
                <div class="booking-form">
                  <div class="form-group">
                    <label>Check-in</label>
                    <input type="date" class="form-input" data-checkin>
                  </div>
                  <div class="form-group">
                    <label>Check-out</label>
                    <input type="date" class="form-input" data-checkout>
                  </div>
                  <div class="form-group guests-selector">
                    <label>Hóspedes</label>
                    <button type="button" class="form-input guests-trigger" data-guests-toggle>
                      <span data-guests-display>2 adultos · 0 crianças</span>
                    </button>
                    <div class="guests-panel" data-guests-panel>
                      <div class="guest-row">
                        <div class="guest-info"><h4>Adultos</h4><p>13 anos ou mais</p></div>
                        <div class="guest-counter">
                          <button type="button" class="counter-btn" data-adults-down aria-label="Menos adultos">−</button>
                          <span class="counter-value" data-adults-count>2</span>
                          <button type="button" class="counter-btn" data-adults-up aria-label="Mais adultos">+</button>
                        </div>
                      </div>
                      <div class="guest-row">
                        <div class="guest-info"><h4>Crianças</h4><p>2 a 12 anos</p></div>
                        <div class="guest-counter">
                          <button type="button" class="counter-btn" data-children-down aria-label="Menos crianças">−</button>
                          <span class="counter-value" data-children-count>0</span>
                          <button type="button" class="counter-btn" data-children-up aria-label="Mais crianças">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" class="btn-reserve" data-reserve-btn>
                  <i class="fab fa-whatsapp" style="font-size:1.2rem" aria-hidden="true"></i>
                  Reservar via WhatsApp
                </button>
                <p class="booking-notice">Você não será cobrado agora · Sem taxas extras</p>
                ${breakdownHtml}
                <div class="booking-trust">
                  <div class="trust-item"><i class="fas fa-lock" aria-hidden="true"></i> Reserva 100% segura</div>
                  <div class="trust-item"><i class="fas fa-undo" aria-hidden="true"></i> Cancelamento conforme combinado</div>
                  <div class="trust-item"><i class="fas fa-headset" aria-hidden="true"></i> Suporte direto no WhatsApp</div>
                </div>
              </div>
            </aside>

          </div>

          <div class="cta-whatsapp">
            <div class="cta-icon" aria-hidden="true">💬</div>
            <div>
              <h3>Pronto para reservar?</h3>
              <p>Fale direto conosco pelo WhatsApp — sem taxas, sem intermediários.</p>
              <a href="${waBase}" class="cta-btn" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-whatsapp" aria-hidden="true"></i>
                ${BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>

        </div>

        ${renderMatchingCta()}

        <section class="outros-apts">
          <div class="container">
            <header class="section-header">
              <h2>Outros Apartamentos Disponíveis</h2>
              <p>Explore mais opções da Recife Flats Temporada · Reserva direta</p>
            </header>
            <div class="apts-grid">${renderOtherApartments(apt.slug)}</div>
            <div class="apts-cta">
              <a href="${pageHref('./apartamentos.html')}" class="btn-ver-todos">Ver todos os apartamentos</a>
            </div>
          </div>
        </section>

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
