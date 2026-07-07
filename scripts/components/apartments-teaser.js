/**
 * <rf-apartments-teaser> — Destaque na home com links para bairros.
 */

import { APARTAMENTOS } from '../data/apartamentos.js';
import { NEIGHBORHOODS } from '../data/site-structure.js';
import { prefersReducedMotion } from '../utils/dom.js';

class RFApartmentsTeaser extends HTMLElement {
  connectedCallback() {
    const cards = APARTAMENTOS.slice(0, 4)
      .map((a) => `<rf-apartment-grid-card slug="${a.slug}"></rf-apartment-grid-card>`)
      .join('');

    const neighborhoodLinks = Object.values(NEIGHBORHOODS).map((n) => {
      const count = APARTAMENTOS.filter((a) => a.neighborhoodSlug === n.slug).length;
      return `
        <a href="${n.pageUrl}" class="apt-teaser__nb-link">
          <span class="apt-teaser__nb-name">${n.name}</span>
          <span class="apt-teaser__nb-count">${count} imóve${count > 1 ? 'is' : 'l'}</span>
        </a>
      `;
    }).join('');

    this.innerHTML = `
      <section class="home-section home-section--white apt-teaser" id="apartamentos" aria-labelledby="apt-teaser-heading">
        <div class="container apt-teaser__inner">
          <header class="section-head" data-apt-teaser-reveal>
            <span class="eyebrow eyebrow--pill">Nossa coleção</span>
            <h2 class="section-head__title" id="apt-teaser-heading">
              Flats para <em>temporada</em> em Recife
            </h2>
            <p class="section-head__lead">
              Cada apartamento é escolhido a dedo — compare localização, estrutura e preço, e reserve direto conosco.
            </p>
          </header>

          <div class="apt-teaser__nb-row" data-apt-teaser-reveal>
            ${neighborhoodLinks}
          </div>

          <div class="apt-teaser__grid" data-apt-teaser-reveal>
            ${cards}
          </div>

          <footer class="apt-teaser__footer" data-apt-teaser-reveal>
            <a href="./apartamentos.html" class="btn btn--secondary btn--lg">
              Ver todos os apartamentos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </footer>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;
    gsap.from(this.querySelectorAll('[data-apt-teaser-reveal]'), {
      opacity: 0,
      y: 28,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 85%', once: true },
    });
  }
}

customElements.define('rf-apartments-teaser', RFApartmentsTeaser);
