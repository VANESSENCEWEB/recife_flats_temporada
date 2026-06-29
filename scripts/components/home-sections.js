/**
 * <rf-home-sections> — Story, passos, valores, depoimentos e CTA (design exemplo).
 */

import { whatsappUrl } from '../data/location.js';

const TESTIMONIALS = [
  { stars: 5, quote: 'Apartamento em Boa Viagem idêntico às fotos. Vista incrível e atendimento impecável.', author: 'Mariana R.', meta: 'São Paulo — 7 noites', initials: 'MR' },
  { stars: 5, quote: 'Flat Golden View perfeito para o casal. Check-in rápido e suporte no WhatsApp em minutos.', author: 'Caio P.', meta: 'Brasília — 5 noites', initials: 'CP' },
  { stars: 5, quote: 'Apt 105 espaçoso, limpo e bem localizado. Família adorou Boa Viagem.', author: 'Família Lopes', meta: 'Porto Alegre — 10 noites', initials: 'FL' },
  { stars: 5, quote: 'Apartamento no Pina com ótima localização. Voltaremos com certeza!', author: 'Ana S.', meta: 'Rio de Janeiro — 4 noites', initials: 'AS' },
];

function testimonialCard(t) {
  return `
    <article class="testimonial--card">
      <div class="testimonial__stars">${'★'.repeat(t.stars)}</div>
      <blockquote>"${t.quote}"</blockquote>
      <div class="testimonial__author">
        <div class="avatar">${t.initials}</div>
        <div><strong>${t.author}</strong><small>${t.meta}</small></div>
      </div>
    </article>
  `;
}

class RFHomeSections extends HTMLElement {
  connectedCallback() {
    const cards = [...TESTIMONIALS, ...TESTIMONIALS].map(testimonialCard).join('');

    this.innerHTML = `
      <section class="section section--screen">
        <div class="container">
          <div class="story">
            <div class="story__media reveal-x" data-parallax>
              <img src="./assets/images/boa_viagem-01.avif.png" alt="Vista para a praia em Recife" loading="lazy">
              <span class="story__badge">Hospedagem verificada</span>
            </div>
            <div class="story__copy">
              <span class="pre-title pre-title--dark reveal"><span class="pre-title__dot"></span> Sobre nós</span>
              <h2 class="reveal">Sua casa em Recife,<br>com <span class="accent-word">jeito de praia.</span></h2>
              <p class="reveal">Somos especialistas em temporada em Boa Viagem e Pina. Cada um dos nossos 4 apartamentos é visitado, fotografado e preparado pessoalmente pela nossa equipe local.</p>
              <div class="story__tags reveal">
                <span class="tag">Boa Viagem</span><span class="tag">Pina</span><span class="tag">Vista mar</span><span class="tag">Check-in fácil</span>
              </div>
              <a href="./sobre.html" class="btn btn--accent reveal">Conheça nossa história</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--screen section--dark" id="como-funciona">
        <div class="container">
          <div class="section-head">
            <div class="section-head__copy">
              <span class="pre-title reveal"><span class="pre-title__dot"></span> Como funciona</span>
              <h2 class="reveal">Reserve em 4 passos<br><span class="accent-word">simples.</span></h2>
            </div>
          </div>
          <div class="steps" data-stagger>
            <div class="step"><div class="step__num">01</div><h4>Escolha o imóvel</h4><p>4 opções em Boa Viagem e Pina — todas com fotos reais e descrição completa.</p></div>
            <div class="step"><div class="step__num">02</div><h4>Fale com a gente</h4><p>Confirme datas e tire dúvidas pelo WhatsApp com atendimento humano.</p></div>
            <div class="step"><div class="step__num">03</div><h4>Reserve com segurança</h4><p>Contrato digital, pagamento parcelado e tudo protegido pela LGPD.</p></div>
            <div class="step"><div class="step__num">04</div><h4>Curta Recife</h4><p>Check-in flexível, kit boas-vindas e suporte durante toda a estadia.</p></div>
          </div>
        </div>
      </section>

      <section class="section section--screen">
        <div class="container">
          <div class="section-head">
            <div class="section-head__copy">
              <span class="pre-title pre-title--dark reveal"><span class="pre-title__dot"></span> Por que escolher</span>
              <h2 class="reveal">Hospedagem com alma<br><span class="accent-word">pernambucana.</span></h2>
            </div>
          </div>
          <div class="values" data-stagger>
            <div class="value"><div class="value__num">01</div><h4>Imóveis verificados</h4><p>Cada apartamento é vistoriado e fotografado pela nossa equipe antes de ir ao site.</p></div>
            <div class="value"><div class="value__num">02</div><h4>Atendimento humano</h4><p>Você fala com quem mora em Recife — sem robô, sem call center.</p></div>
            <div class="value"><div class="value__num">03</div><h4>Preço transparente</h4><p>Valor total desde o início: diárias, limpeza e taxas sem surpresas.</p></div>
            <div class="value"><div class="value__num">04</div><h4>Pé na areia</h4><p>Os 4 imóveis ficam em Boa Viagem e Pina — os melhores bairros à beira-mar.</p></div>
          </div>
        </div>
      </section>

      <section class="section section--screen" id="depoimentos" style="background:var(--color-bg-alt)">
        <div class="container">
          <div class="section-head">
            <div class="section-head__copy">
              <span class="pre-title pre-title--dark reveal"><span class="pre-title__dot"></span> Quem já se hospedou</span>
              <h2 class="reveal">Histórias de quem<br>viveu <span class="accent-word">Recife.</span></h2>
            </div>
          </div>
          <div class="testimonials-marquee reveal">
            <div class="testimonials-marquee__track">${cards}</div>
          </div>
        </div>
      </section>

      <section class="section section--screen">
        <div class="container">
          <div class="cta-banner reveal">
            <span class="pre-title reveal"><span class="pre-title__dot"></span> Próxima temporada</span>
            <h2>Reserve seu flat em Boa Viagem ou Pina.</h2>
            <p>Conte suas datas — respondemos em até 1 hora com disponibilidade e valores.</p>
            <div class="cta-banner__actions">
              <a href="${whatsappUrl('Olá! Gostaria de reservar um apartamento em Recife.')}" class="btn btn--coral" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
              <a href="./apartamentos.html" class="btn btn--ghost">Ver os 4 apartamentos</a>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('rf-home-sections', RFHomeSections);
