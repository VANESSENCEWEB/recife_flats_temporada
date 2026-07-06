/**
 * <rf-neighborhoods-showcase> — Destinos / bairros em destaque.
 */

import { NEIGHBORHOODS } from '../data/site-structure.js';
import { APARTAMENTOS } from '../data/apartamentos.js';
import { assetUrl } from '../utils/paths.js';
import { prefersReducedMotion } from '../utils/dom.js';

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
        <article class="dest-card" data-dest-reveal>
          <a href="${n.pageUrl}" class="dest-card__media">
            <img src="${img}" alt="Apartamentos em ${n.name}, Recife" loading="lazy">
            <span class="dest-card__count">${count} imóve${count > 1 ? 'is' : 'l'}</span>
          </a>
          <div class="dest-card__body">
            <span class="dest-card__region">Pernambuco · Recife</span>
            <h3 class="dest-card__title"><a href="${n.pageUrl}">${n.name}</a></h3>
            <p class="dest-card__text">${n.description}</p>
            <a href="${n.pageUrl}" class="btn btn--secondary btn--sm">Explorar ${n.name}</a>
          </div>
        </article>
      `;
    }).join('');

    this.innerHTML = `
      <section class="destinations" id="destinos" aria-labelledby="dest-heading">
        <div class="destinations__banner" aria-hidden="true">
          <span class="destinations__banner-logo">Recife Flats</span>
          <span class="destinations__banner-region">Pernambuco</span>
        </div>
        <div class="container destinations__inner">
          <header class="destinations__header" data-dest-reveal>
            <span class="eyebrow eyebrow--pill">Onde ficar</span>
            <h2 class="destinations__title" id="dest-heading">Principais <em class="title-accent">destinos</em></h2>
          </header>
          <div class="destinations__grid">${cards}</div>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;
    gsap.from(this.querySelectorAll('[data-dest-reveal]'), {
      opacity: 0,
      y: 28,
      duration: 0.65,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 85%', once: true },
    });
  }
}

customElements.define('rf-neighborhoods-showcase', RFNeighborhoodsShowcase);
