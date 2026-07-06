/**
 * <rf-amenities-section> — Por que alugar conosco (conteúdo do site ao vivo).
 */

const VALUES = [
  {
    title: 'Negociação direta',
    text: 'Você fala conosco sem intermediários, entende as regras antes de pagar e evita ruído de plataforma.',
  },
  {
    title: 'Fotos reais do imóvel',
    text: 'Trabalhamos com material do próprio apartamento para reduzir expectativa errada e aumentar confiança na decisão.',
  },
  {
    title: 'Resposta mais rápida',
    text: 'Disponibilidade, valor, caução, regras e check-in são tratados em conversa objetiva pelo WhatsApp.',
  },
  {
    title: 'Estrutura para estadia prática',
    text: 'Wi-Fi, cozinha, localização funcional e suporte para turismo, trabalho remoto e viagens em família.',
  },
];

class RFAmenitiesSection extends HTMLElement {
  connectedCallback() {
    const items = VALUES.map((v) => `
      <li class="amenities__item spotlight-card">
        <h3 class="amenities__label">${v.title}</h3>
        <p class="amenities__text">${v.text}</p>
      </li>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--cream amenities" id="por-que" aria-labelledby="amenities-heading">
        <div class="container">
          <header class="section-head animate-on-scroll">
            <span class="eyebrow eyebrow--pill">Por que escolher</span>
            <h2 class="section-head__title" id="amenities-heading">
              Por que alugar <em>conosco</em>
            </h2>
            <p class="section-head__lead">
              Não é só hospedagem. É reserva direta com contexto local, resposta rápida e imóveis selecionados para funcionar de verdade no dia a dia da viagem.
            </p>
          </header>
          <ul class="section-body amenities__grid amenities__grid--values">${items}</ul>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-amenities-section', RFAmenitiesSection);
