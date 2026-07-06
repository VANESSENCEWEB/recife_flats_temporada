/**
 * <rf-neighborhoods-showcase> — Destinos / bairros em destaque.
 */

import { NEIGHBORHOODS } from '../data/site-structure.js';
import { APARTAMENTOS } from '../data/apartamentos.js';
import { assetUrl } from '../utils/paths.js';

const COVER = {
  'boa-viagem': './assets/images/boa_viagem-01.avif.png',
  pina: './assets/images/boa_viagem-01.avif.png',
};

class RFNeighborhoodsShowcase extends HTMLElement {
  connectedCallback() {
    const cards = Object.values(NEIGHBORHOODS).map((n) => {
      const count = APARTAMENTOS.filter((a) => a.neighborhoodSlug === n.slug).length;
      const img = assetUrl(COVER[n.slug] || './assets/images/boa_viagem-01.avif.png');
      return `
        <article class="dest-card spotlight-card">
          <a href="${n.pageUrl}" class="dest-card__media">
            <img src="${img}" alt="Apartamentos em ${n.name}, Recife" loading="lazy">
            <span class="dest-card__count">${count} imóve${count > 1 ? 'is' : 'l'}</span>
          </a>
          <div class="dest-card__body">
            <span class="dest-card__region">Pernambuco · Recife</span>
            <h3 class="dest-card__title"><a href="${n.pageUrl}">${n.name}</a></h3>
            <p class="dest-card__text">${n.description}</p>
            <a href="${n.pageUrl}" class="link-arrow">
              Explorar ${n.name}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </article>
      `;
    }).join('');

    this.innerHTML = `
      <section class="home-section home-section--muted destinations" id="destinos" aria-labelledby="dest-heading">
        <div class="container">
          <header class="section-head section-head--split animate-on-scroll">
            <div>
              <span class="section-eyebrow">Destinos</span>
              <h2 class="section-head__title" id="dest-heading">Principais <em>bairros</em></h2>
              <p class="section-head__lead">Onde nossos apartamentos estão localizados em Recife.</p>
            </div>
          </header>
          <div class="section-body destinations__grid" data-aos-stagger>${cards}</div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-neighborhoods-showcase', RFNeighborhoodsShowcase);
