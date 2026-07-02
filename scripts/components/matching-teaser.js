/**
 * <rf-matching-teaser> — Chamada de impacto para o ApartMatch.
 * Divisão 50/50: foto do casal ocupando a metade esquerda da seção
 * inteira (tela cheia), texto + CTAs na metade direita.
 */

import { assetUrl } from '../utils/paths.js';
import { prefersReducedMotion } from '../utils/dom.js';
import { renderWaveDivider } from '../utils/wave-divider.js';

class RFMatchingTeaser extends HTMLElement {
  connectedCallback() {
    const photoSrc = assetUrl('./assets/images/matching/matching-couple-doubt.jpg');
    const photoSrcWebp = assetUrl('./assets/images/matching/matching-couple-doubt.webp');

    this.innerHTML = `
      <section class="matching-simple" id="matching" aria-labelledby="matching-heading">
        <div class="matching-simple__grid">

          <div class="matching-simple__photo-col">
            <picture>
              <source srcset="${photoSrcWebp}" type="image/webp">
              <img src="${photoSrc}" alt="Casal em dúvida olhando para o celular, em frente a um prédio de apartamentos em Boa Viagem" loading="lazy">
            </picture>
            <div class="matching-simple__badge">
              <span class="matching-simple__spinner" aria-hidden="true"></span>
              Calculando compatibilidade…
            </div>
          </div>

          <div class="matching-simple__text-col">
            <div class="matching-simple__content" data-matching-reveal>
              <span class="eyebrow eyebrow--pill">Em dúvida?</span>
              <h2 class="matching-simple__title" id="matching-heading">Não sabe qual<br>apartamento escolher?</h2>
              <p class="matching-simple__text">
                Faça o <strong>Matching Inteligente</strong> e descubra, em segundos, o apê ideal pra sua viagem em Recife.
              </p>
              <div class="matching-simple__actions">
                <button type="button" class="btn btn--sun btn--lg" data-open-matching>
                  <span aria-hidden="true">⚡</span> Fazer Matching agora
                </button>
                <a href="./apartmatch.html" class="btn btn--outline btn--lg">
                  <span aria-hidden="true">🧭</span> Saiba mais
                </a>
              </div>
            </div>
          </div>

        </div>

        ${renderWaveDivider('var(--ocean)')}
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;

    gsap.from(this.querySelectorAll('[data-matching-reveal]'), {
      opacity: 0,
      y: 28,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 85%', once: true },
    });
  }
}

customElements.define('rf-matching-teaser', RFMatchingTeaser);
