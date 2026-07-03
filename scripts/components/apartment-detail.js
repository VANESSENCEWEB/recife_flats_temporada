/**
 * <rf-apartment-detail> — Página individual de um apartamento.
 *
 * Uso (em apartamento.html):
 *   <rf-apartment-detail></rf-apartment-detail>
 *
 * Lê ?id=<slug> da URL e monta a página a partir de data/apartments.js.
 * Preserva ?checkin=&checkout=&guests= para manter o contexto da busca.
 * Se o id for inválido, mostra um estado "não encontrado" amigável.
 */

import {
  APARTMENTS,
  getApartment,
  isAvailable,
  fitsGuests,
  readSearchParams,
  buildSearchQuery,
  formatPrice,
  formatDateShort,
  WHATSAPP,
} from '../data/apartments.js';
import { apartmentCardHTML } from './apartment-card.js';
import { prefersReducedMotion } from '../utils/dom.js';

class RFApartmentDetail extends HTMLElement {
  connectedCallback() {
    const id = new URLSearchParams(window.location.search).get('id') || '';
    const apt = getApartment(id);
    const search = readSearchParams();

    if (!apt) {
      this._renderNotFound();
      return;
    }

    document.title = `${apt.name} — Recife Flats Temporada`;

    const hasSearch = Boolean(search.checkin && search.checkout);
    const free = isAvailable(apt, search.checkin, search.checkout);
    const fits = fitsGuests(apt, search.guests);
    const available = free && fits;

    const statusBlock = hasSearch
      ? `
        <div class="detail-book__status detail-book__status--${available ? 'free' : 'busy'}">
          <span class="detail-book__status-dot"></span>
          ${
            available
              ? 'Disponível para as suas datas'
              : !fits
              ? `Capacidade máxima: ${apt.guests} hóspedes`
              : 'Sem vaga nessas datas'
          }
        </div>
        <div class="detail-book__dates">
          <span>${formatDateShort(search.checkin)} → ${formatDateShort(search.checkout)}</span>
          ${search.guests ? `<span>· ${search.guests} ${search.guests === 1 ? 'hóspede' : 'hóspedes'}</span>` : ''}
        </div>`
      : `<div class="detail-book__status detail-book__status--idle">
           <span class="detail-book__status-dot"></span>
           Selecione as datas para ver a disponibilidade
         </div>`;

    const waLines = [
      `Olá! Tenho interesse no *${apt.name}* (${apt.location}).`,
      hasSearch ? `Datas: ${search.checkin} até ${search.checkout}.` : '',
      search.guests ? `Hóspedes: ${search.guests}.` : '',
    ].filter(Boolean);
    const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waLines.join('\n'))}`;

    const reserveCta = available
      ? `<a class="detail-book__cta" href="${waUrl}" target="_blank" rel="noopener">
           Reservar via WhatsApp
         </a>`
      : `<a class="detail-book__cta detail-book__cta--soft" href="#match">
           Fazer um match para essas datas
         </a>`;

    const media = apt.image
      ? `<img class="detail-gallery__img" src="${apt.image}" alt="${apt.name}">`
      : `<span class="detail-gallery__placeholder" aria-hidden="true">${apt.name}</span>`;

    const related = APARTMENTS.filter((a) => a.id !== apt.id).slice(0, 3);

    this.innerHTML = /* html */ `
      <article class="detail">
        <div class="container">
          <a class="detail__back" href="apartamentos.html${buildSearchQuery(search)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
            Todos os apartamentos
          </a>

          <header class="detail__header">
            <span class="eyebrow">${apt.location} · Recife</span>
            <h1 class="detail__title">${apt.name}</h1>
            <div class="detail__meta">
              <span class="detail__rating">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01z"/></svg>
                ${apt.rating.toFixed(1)}
              </span>
              <span class="detail__meta-sep">·</span>
              <span>${apt.guests} hóspedes</span>
              <span class="detail__meta-sep">·</span>
              <span>${apt.bedrooms} ${apt.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
              <span class="detail__meta-sep">·</span>
              <span>${apt.bathrooms} ${apt.bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
              <span class="detail__meta-sep">·</span>
              <span>${apt.area} m²</span>
            </div>
          </header>

          <div class="detail-gallery detail-gallery--${apt.theme}">
            <div class="detail-gallery__main detail-gallery__main--${apt.theme}">
              ${media}
            </div>
            <div class="detail-gallery__side" aria-hidden="true">
              <span class="detail-gallery__tile detail-gallery__tile--a"></span>
              <span class="detail-gallery__tile detail-gallery__tile--b"></span>
            </div>
          </div>

          <div class="detail__body">
            <div class="detail__content">
              <section class="detail__section">
                <h2 class="detail__section-title">Sobre o apartamento</h2>
                <p class="detail__desc">${apt.description}</p>
              </section>

              <section class="detail__section">
                <h2 class="detail__section-title">O que este flat oferece</h2>
                <ul class="detail__features">
                  ${apt.features
                    .map(
                      (f) => `
                    <li class="detail__feature">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                      ${f}
                    </li>`
                    )
                    .join('')}
                </ul>
              </section>
            </div>

            <aside class="detail__aside">
              <div class="detail-book">
                <div class="detail-book__price">
                  <strong>${formatPrice(apt.priceFrom)}</strong>
                  <span>a partir de / noite</span>
                </div>
                ${statusBlock}
                ${reserveCta}
                <a class="detail-book__secondary" href="apartamentos.html${buildSearchQuery(search)}">
                  Ver outras datas e apartamentos
                </a>
              </div>
            </aside>
          </div>

          <section class="detail__related">
            <h2 class="detail__section-title">Você também pode gostar</h2>
            <div class="detail__related-grid">
              ${related.map((a) => apartmentCardHTML(a, search)).join('')}
            </div>
          </section>
        </div>

        <div class="container" id="match">
          <rf-match></rf-match>
        </div>
      </article>
    `;

    this._reveal();
  }

  _renderNotFound() {
    document.title = 'Apartamento não encontrado — Recife Flats Temporada';
    this.innerHTML = /* html */ `
      <section class="detail-empty">
        <div class="container detail-empty__inner">
          <span class="eyebrow">Ops</span>
          <h1 class="detail-empty__title">Não encontramos esse apartamento</h1>
          <p class="detail-empty__text">
            O link pode ter expirado. Veja a coleção completa de flats de temporada.
          </p>
          <a class="btn btn--primary" href="apartamentos.html">Ver apartamentos</a>
        </div>
      </section>
    `;
  }

  _reveal() {
    if (prefersReducedMotion() || !window.gsap) return;
    const targets = this.querySelectorAll('.detail__header, .detail-gallery, .detail__body > *');
    gsap.from(targets, {
      opacity: 0,
      y: 26,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      delay: 0.05,
    });
  }
}

customElements.define('rf-apartment-detail', RFApartmentDetail);
