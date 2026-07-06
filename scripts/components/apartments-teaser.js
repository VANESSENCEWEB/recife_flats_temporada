/**
 * <rf-apartments-teaser> — Destaque na home com links para bairros.
 */

import { APARTAMENTOS } from '../data/apartamentos.js';
import { NEIGHBORHOODS } from '../data/site-structure.js';

class RFApartmentsTeaser extends HTMLElement {
  connectedCallback() {
    const cards = APARTAMENTOS.slice(0, 4)
      .map((a) => `<rf-apartment-grid-card slug="${a.slug}"></rf-apartment-grid-card>`)
      .join('');

    const neighborhoodLinks = Object.values(NEIGHBORHOODS).map((n) => {
      const count = APARTAMENTOS.filter((a) => a.neighborhoodSlug === n.slug).length;
      return `
        <a href="${n.pageUrl}" class="apt-teaser__nb-link spotlight-card">
          <span class="apt-teaser__nb-name">${n.name}</span>
          <span class="apt-teaser__nb-count">${count} imóve${count > 1 ? 'is' : 'l'}</span>
        </a>
      `;
    }).join('');

    this.innerHTML = `
      <section class="home-section home-section--white apt-teaser" id="apartamentos" aria-labelledby="apt-teaser-heading">
        <div class="container apt-teaser__inner">
          <header class="section-head section-head--split animate-on-scroll">
            <div>
              <span class="section-eyebrow">Imóveis em destaque</span>
              <h2 class="section-head__title" id="apt-teaser-heading">
                Explore nossos <em>apartamentos</em>
              </h2>
              <p class="section-head__lead">
                Do casal ao grupo em família — escolha o flat ideal em Boa Viagem ou Pina e reserve direto.
              </p>
            </div>
            <div class="section-head__action">
              <a href="./apartamentos.html" class="link-arrow">
                Ver catálogo completo
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </header>

          <div class="apt-teaser__nb-row animate-on-scroll aos-delay-2" data-aos-stagger>
            ${neighborhoodLinks}
          </div>

          <div class="apt-teaser__grid" data-aos-stagger>
            ${cards}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-apartments-teaser', RFApartmentsTeaser);
