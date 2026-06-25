/**
 * <rf-apartments-section> — Seção com os 4 apartamentos e divisores.
 *
 * Uso:
 *   <rf-apartments-section></rf-apartments-section>
 *   <rf-apartments-section compact></rf-apartments-section>  (home preview)
 */

import { APARTAMENTOS } from '../data/apartamentos.js';
import { prefersReducedMotion } from '../utils/dom.js';

class RFApartmentsSection extends HTMLElement {
  connectedCallback() {
    const compact = this.hasAttribute('compact');
    const showHeader = !this.hasAttribute('no-header');

    const cards = APARTAMENTOS.map((apt, i) => {
      const reverse = i % 2 === 1;
      const divider = i < APARTAMENTOS.length - 1
        ? '<div class="apartments-section__divider" aria-hidden="true"></div>'
        : '';
      return `
        <div class="apartments-section__item" data-apt-item>
          <rf-apartment-card slug="${apt.slug}"${reverse ? ' reverse' : ''}></rf-apartment-card>
        </div>
        ${divider}
      `;
    }).join('');

    this.innerHTML = `
      <section class="apartments-section${compact ? ' apartments-section--compact' : ''}${!showHeader ? ' apartments-section--bare' : ''}" id="apartamentos"${showHeader ? ' aria-labelledby="apartments-heading"' : ''}>
        <div class="container apartments-section__inner">
          ${showHeader ? `
            <header class="apartments-section__header" data-apt-header>
              <span class="apartments-section__eyebrow">Nossa coleção</span>
              <h2 class="apartments-section__title" id="apartments-heading">
                Quatro apartamentos <em>confortáveis</em> em Recife
              </h2>
              <p class="apartments-section__lead">
                Unidades mobiliadas para famílias e grupos — práticas, bem localizadas
                e com a atenção de quem mora na cidade. Sem luxo exagerado: o essencial
                bem feito para sua temporada.
              </p>
            </header>
          ` : ''}

          <div class="apartments-section__list">
            ${cards}
          </div>

          ${compact ? `
            <footer class="apartments-section__footer" data-apt-footer>
              <a href="./apartamentos.html" class="btn btn--secondary btn--lg">
                Ver todos os apartamentos
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </footer>
          ` : ''}
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;

    const header = this.querySelector('[data-apt-header]');
    const items  = this.querySelectorAll('[data-apt-item]');
    const footer = this.querySelector('[data-apt-footer]');

    if (header) {
      gsap.from(header.children, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true,
        },
      });
    }

    items.forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        y: 48,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          once: true,
        },
      });
    });

    if (footer) {
      gsap.from(footer, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
          once: true,
        },
      });
    }
  }
}

customElements.define('rf-apartments-section', RFApartmentsSection);
