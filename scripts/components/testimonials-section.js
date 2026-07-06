/**
 * <rf-testimonials-section> — Depoimentos em grid + marquee.
 */

const TESTIMONIALS = [
  {
    initials: 'MR',
    name: 'Mariana R.',
    meta: 'São Paulo · 7 noites',
    quote: 'Apartamento idêntico às fotos, pertinho da praia. Atendimento impecável do check-in ao check-out.',
  },
  {
    initials: 'CP',
    name: 'Caio P.',
    meta: 'Brasília · 5 noites',
    quote: 'Flat Golden View perfeito para o casal. Resposta rápida no WhatsApp e tudo muito limpo.',
  },
  {
    initials: 'FL',
    name: 'Família Lopes',
    meta: 'Porto Alegre · 10 noites',
    quote: 'Apt espaçoso para a família, bem localizado em Boa Viagem. Voltaremos com certeza.',
  },
  {
    initials: 'AS',
    name: 'Ana S.',
    meta: 'Rio de Janeiro · 4 noites',
    quote: 'Reserva direta sem dor de cabeça. Flat preparado, Wi-Fi excelente e localização imbatível.',
  },
  {
    initials: 'RL',
    name: 'Ricardo L.',
    meta: 'Curitiba · 6 noites',
    quote: 'Equipe atenciosa e apartamento exatamente como nas fotos. Recomendo para quem vem a trabalho.',
  },
];

function reviewCard(t) {
  return `
    <article class="review-card spotlight-card">
      <div class="review-card__stars" aria-label="5 de 5 estrelas">★★★★★</div>
      <blockquote class="review-card__quote">"${t.quote}"</blockquote>
      <div class="review-card__author">
        <span class="review-card__avatar" aria-hidden="true">${t.initials}</span>
        <div>
          <strong>${t.name}</strong>
          <span>${t.meta}</span>
        </div>
      </div>
    </article>
  `;
}

class RFTestimonialsSection extends HTMLElement {
  connectedCallback() {
    const cards = TESTIMONIALS.slice(0, 3).map(reviewCard).join('');
    const marqueeCards = [...TESTIMONIALS, ...TESTIMONIALS].map(reviewCard).join('');

    this.innerHTML = `
      <section class="home-section home-section--white testimonials" id="depoimentos" aria-labelledby="reviews-heading">
        <div class="container">
          <header class="section-head section-head--split animate-on-scroll">
            <div>
              <span class="section-eyebrow">Avaliações</span>
              <h2 class="section-head__title" id="reviews-heading">O que dizem nossos <em>hóspedes</em></h2>
              <p class="section-head__lead">
                Nota <strong class="testimonials__score">4.9</strong> no Google — avaliações reais de quem já se hospedou.
              </p>
            </div>
          </header>
          <div class="section-body testimonials__grid" data-aos-stagger>${cards}</div>
          <div class="testimonials__marquee" aria-hidden="true">
            <div class="testimonials__marquee-track">${marqueeCards}</div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-testimonials-section', RFTestimonialsSection);
