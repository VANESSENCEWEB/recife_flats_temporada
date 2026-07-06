/**
 * <rf-matching-teaser> — Matching dentro do trilho .container (sem foto esticada).
 */

import { assetUrl } from '../utils/paths.js';
import { prefersReducedMotion } from '../utils/dom.js';

class RFMatchingTeaser extends HTMLElement {
  connectedCallback() {
    const photoSrc = assetUrl('./assets/images/matching/matching-couple-doubt.jpg');
    const photoSrcWebp = assetUrl('./assets/images/matching/matching-couple-doubt.webp');

    this.innerHTML = `
      <section class="home-section home-section--cream matching-contained" id="matching" aria-labelledby="matching-heading">
        <div class="container">
          <div class="matching-contained__grid">
            <div class="matching-contained__media" data-matching-reveal>
              <picture>
                <source srcset="${photoSrcWebp}" type="image/webp">
                <img src="${photoSrc}" alt="Casal em dúvida olhando para o celular, em frente a um prédio de apartamentos em Boa Viagem" loading="lazy">
              </picture>
            </div>

            <div class="matching-contained__copy" data-matching-reveal>
              <header class="section-head">
                <span class="eyebrow eyebrow--pill">Em dúvida?</span>
                <h2 class="section-head__title" id="matching-heading">
                  Não sabe qual <em>apartamento</em> escolher?
                </h2>
                <p class="section-head__lead">
                  Faça o <strong>Matching Inteligente</strong> e descubra, em segundos, o apê ideal pra sua viagem em Recife.
                </p>
              </header>
              <div class="matching-contained__actions section-cta">
                <button type="button" class="btn btn--sun btn--lg" data-open-matching>
                  Fazer Matching agora
                </button>
                <a href="./apartmatch.html" class="btn btn--secondary btn--lg">Saiba mais</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;

    gsap.from(this.querySelectorAll('[data-matching-reveal]'), {
      opacity: 0,
      y: 22,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 88%', once: true },
    });
  }
}

customElements.define('rf-matching-teaser', RFMatchingTeaser);
