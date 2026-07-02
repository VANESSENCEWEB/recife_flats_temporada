/**
 * <rf-matching-teaser> — Chamada opcional para o Matching Inteligente.
 * Fica logo abaixo da busca tradicional. Ao clicar, dispara `rf-matching-open`.
 */

class RFMatchingTeaser extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="matching-teaser" id="matching" aria-labelledby="matching-heading">
        <div class="container matching-teaser__inner">
          <div class="matching-teaser__copy">
            <span class="eyebrow eyebrow--pill">Não sabe qual escolher?</span>
            <h2 class="matching-teaser__title" id="matching-heading">
              Faça o <em class="display-italic">Matching Inteligente</em>
            </h2>
            <p class="matching-teaser__lead">
              Responda 6 perguntas rápidas sobre a sua viagem e descubra qual apartamento
              combina mais com você — com ou sem data definida.
            </p>
            <button type="button" class="btn btn--primary" data-open-matching>
              <span aria-hidden="true">🧭</span> Fazer o Matching Inteligente
            </button>
          </div>
          <div class="matching-teaser__visual" aria-hidden="true">
            <div class="matching-teaser__score matching-teaser__score--a">92%</div>
            <div class="matching-teaser__score matching-teaser__score--b">78%</div>
            <div class="matching-teaser__score matching-teaser__score--c">65%</div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-matching-teaser', RFMatchingTeaser);
