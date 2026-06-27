/**
 * <rf-neighborhood-hub> — Página hub de bairro (Boa Viagem ou Pina).
 *
 * Uso: <rf-neighborhood-hub slug="boa-viagem"></rf-neighborhood-hub>
 */

import { getNeighborhood } from '../data/site-structure.js';
import { getApartmentsByNeighborhood } from '../data/apartamentos.js';
import { prefersReducedMotion } from '../utils/dom.js';

class RFNeighborhoodHub extends HTMLElement {
  connectedCallback() {
    const slug = this.getAttribute('slug');
    const n    = getNeighborhood(slug);

    if (!n) {
      this.innerHTML = '<p>Bairro não encontrado.</p>';
      return;
    }

    const apts = getApartmentsByNeighborhood(slug);
    document.title = `Apartamentos em ${n.name} — Recife Flats Temporada`;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = n.description;

    const sections = apts.map((apt, i) => {
      const reverse = i % 2 === 1;
      return `
        <div class="nb-hub__item" data-nb-reveal>
          <rf-apartment-card slug="${apt.slug}"${reverse ? ' reverse' : ''}></rf-apartment-card>
        </div>
        ${i < apts.length - 1 ? '<div class="nb-hub__divider" aria-hidden="true"></div>' : ''}
      `;
    }).join('');

    const highlights = n.highlights.map((h) => `<li>${h}</li>`).join('');

    this.innerHTML = `
      <div class="nb-hub">
        <header class="nb-hub__intro">
          <div class="container nb-hub__intro-inner" data-nb-reveal>
            <span class="eyebrow">Temporada em Recife</span>
            <h1 class="nb-hub__title">Apartamentos em <em class="display-italic">${n.name}</em></h1>
            <p class="nb-hub__lead">${n.intro}</p>
            <ul class="nb-hub__highlights">${highlights}</ul>
          </div>
        </header>

        <div class="container nb-hub__list">
          ${sections}
        </div>

        <section class="nb-hub__cta" data-nb-reveal>
          <div class="container nb-hub__cta-inner">
            <h2>Quer comparar com outro bairro?</h2>
            <p>Veja todos os imóveis ou explore ${slug === 'boa-viagem' ? 'Pina' : 'Boa Viagem'}.</p>
            <div class="nb-hub__cta-actions">
              <a href="./apartamentos.html" class="btn btn--secondary">Todos os apartamentos</a>
              <a href="./${slug === 'boa-viagem' ? 'pina' : 'boa-viagem'}.html" class="btn btn--primary">
                Ver ${slug === 'boa-viagem' ? 'Pina' : 'Boa Viagem'}
              </a>
            </div>
          </div>
        </section>
      </div>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;
    this.querySelectorAll('[data-nb-reveal]').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  }
}

customElements.define('rf-neighborhood-hub', RFNeighborhoodHub);
