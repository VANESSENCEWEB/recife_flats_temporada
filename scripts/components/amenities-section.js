/**
 * <rf-amenities-section> — Grade de comodidades "Tudo que você precisa".
 */

const AMENITIES = [
  { icon: '📶', label: 'Wi-Fi 300Mbps' },
  { icon: '❄️', label: 'Ar-condicionado' },
  { icon: '🏖️', label: 'Perto da praia' },
  { icon: '🏊', label: 'Piscina' },
  { icon: '🅿️', label: 'Estacionamento' },
  { icon: '🍳', label: 'Cozinha completa' },
  { icon: '📺', label: 'Smart TV' },
  { icon: '🔒', label: 'Segurança 24h' },
  { icon: '🧺', label: 'Lavanderia' },
  { icon: '💬', label: 'Suporte WhatsApp' },
];

class RFAmenitiesSection extends HTMLElement {
  connectedCallback() {
    const items = AMENITIES.map((a) => `
      <li class="amenities__item spotlight-card">
        <span class="amenities__icon" aria-hidden="true">${a.icon}</span>
        <span class="amenities__label">${a.label}</span>
      </li>
    `).join('');

    this.innerHTML = `
      <section class="home-section home-section--cream amenities" id="comodidades" aria-labelledby="amenities-heading">
        <div class="container">
          <header class="section-head section-head--center animate-on-scroll">
            <span class="section-eyebrow">Comodidades</span>
            <h2 class="section-head__title" id="amenities-heading">
              Tudo que você <em>precisa</em>
            </h2>
            <p class="section-head__lead">
              Flats mobiliados e equipados para você chegar, descansar e aproveitar Recife sem dor de cabeça.
            </p>
          </header>
          <ul class="section-body amenities__grid" data-aos-stagger>${items}</ul>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-amenities-section', RFAmenitiesSection);
