/**
 * <rf-matching-teaser> — Chamada simples e direta para o ApartMatch.
 * Cabe em uma única tela (mobile e desktop): foto + selo "calculando",
 * título curto e um botão. Sem scroll longo, sem várias cenas de texto.
 */

import { assetUrl } from '../utils/paths.js';
import { prefersReducedMotion } from '../utils/dom.js';

class RFMatchingTeaser extends HTMLElement {
  connectedCallback() {
    const photoSrc = assetUrl('./assets/images/matching/matching-couple-doubt.jpg');
    const photoSrcWebp = assetUrl('./assets/images/matching/matching-couple-doubt.webp');

    this.innerHTML = `
      <section class="matching-simple" id="matching" aria-labelledby="matching-heading">
        <div class="container matching-simple__grid">

          <div class="matching-simple__visual" data-matching-reveal>
            <div class="matching-simple__photo">
              <picture>
                <source srcset="${photoSrcWebp}" type="image/webp">
                <img src="${photoSrc}" alt="Casal em dúvida olhando para o celular, em frente a um prédio de apartamentos" loading="lazy">
              </picture>
              <div class="matching-simple__badge">
                <span class="matching-simple__spinner" aria-hidden="true"></span>
                Calculando compatibilidade…
              </div>
            </div>
          </div>

          <div class="matching-simple__content" data-matching-reveal>
            <span class="eyebrow eyebrow--pill">Em dúvida?</span>
            <h2 class="matching-simple__title" id="matching-heading">Não sabe qual<br>apartamento escolher?</h2>
            <p class="matching-simple__text">
              Faça o <strong>Matching Inteligente</strong> e descubra, em segundos, o apê ideal pra sua viagem em Recife.
            </p>
            <div class="matching-simple__actions">
              <a href="./apartmatch.html" class="btn btn--primary btn--lg">
                <span aria-hidden="true">🧭</span> Saiba mais
              </a>
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
      y: 24,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 85%', once: true },
    });
  }
}

customElements.define('rf-matching-teaser', RFMatchingTeaser);
