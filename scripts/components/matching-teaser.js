/**
 * <rf-matching-teaser> — Matching dentro do trilho .container (sem foto esticada).
 */

import { assetUrl } from '../utils/paths.js';

class RFMatchingTeaser extends HTMLElement {
  connectedCallback() {
    const photoSrc = assetUrl('./assets/images/matching/matching-couple-doubt.jpg');
    const photoSrcWebp = assetUrl('./assets/images/matching/matching-couple-doubt.webp');

    this.innerHTML = `
      <section class="home-section home-section--cream matching-contained" id="matching" aria-labelledby="matching-heading">
        <div class="container">
          <div class="matching-contained__grid">
            <div class="matching-contained__media animate-on-scroll">
              <picture>
                <source srcset="${photoSrcWebp}" type="image/webp">
                <img src="${photoSrc}" alt="Casal em dúvida olhando para o celular, em frente a um prédio de apartamentos em Boa Viagem" loading="lazy">
              </picture>
            </div>

            <div class="matching-contained__copy animate-on-scroll aos-delay-2">
              <header class="section-head">
                <span class="eyebrow eyebrow--pill">Em dúvida?</span>
                <h2 class="section-head__title text-reveal" id="matching-heading">
                  <span class="text-reveal__line">Não sabe qual <em>apartamento</em> escolher?</span>
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
  }
}

customElements.define('rf-matching-teaser', RFMatchingTeaser);
