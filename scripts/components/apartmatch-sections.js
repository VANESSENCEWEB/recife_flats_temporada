/**
 * <rf-apartmatch-sections> — Conteúdo abaixo do hero da página ApartMatch.
 * Direto ao ponto: 3 passos + CTA. Sem textão, sem seções técnicas.
 */

import { prefersReducedMotion } from '../utils/dom.js';
import { assetUrl } from '../utils/paths.js';

const STEPS = [
  { num: '01', icon: '✍️', title: 'Responda rapidinho', text: 'Algumas perguntas sobre a sua viagem — leva menos de 1 minuto.' },
  { num: '02', icon: '🎯', title: 'Veja a compatibilidade', text: 'Cada apartamento recebe um score e uma explicação do porquê combina com você.' },
  { num: '03', icon: '💬', title: 'Reserve pelo WhatsApp', text: 'Direto com a gente, sem intermediários.' },
];

class RFApartmatchSections extends HTMLElement {
  connectedCallback() {
    const stepsHtml = STEPS.map((s) => `
      <article class="apartmatch-step" data-am-reveal>
        <span class="apartmatch-step__icon" aria-hidden="true">${s.icon}</span>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
      </article>
    `).join('');

    const illustrationSrc = assetUrl('./assets/images/apartmatch/apartmatch-illustration.jpg');
    const illustrationSrcWebp = assetUrl('./assets/images/apartmatch/apartmatch-illustration.webp');

    this.innerHTML = `
      <section class="apartmatch-illustration" aria-labelledby="am-illustration-heading">
        <div class="container apartmatch-illustration__inner">
          <div class="apartmatch-illustration__media" data-am-reveal>
            <picture>
              <source srcset="${illustrationSrcWebp}" type="image/webp">
              <img src="${illustrationSrc}" alt="Ilustração de prédios de apartamentos à beira-mar em Boa Viagem, com um pin indicando o apartamento ideal" loading="lazy">
            </picture>
          </div>
          <div class="apartmatch-illustration__copy" data-am-reveal>
            <span class="eyebrow eyebrow--pill">De verdade, do jeito certo</span>
            <h2 id="am-illustration-heading">Seu próximo apê à beira-mar em Recife</h2>
            <p>Apartamentos mobiliados em Boa Viagem e Pina, prontos pra você chegar e curtir. O ApartMatch encontra qual deles combina com a sua viagem.</p>
          </div>
        </div>
      </section>

      <section class="apartmatch-steps" id="como-funciona" aria-labelledby="am-steps-heading">
        <div class="container">
          <h2 id="am-steps-heading" class="apartmatch-steps__heading" data-am-reveal>Como funciona</h2>
          <div class="apartmatch-steps__grid">${stepsHtml}</div>
        </div>
      </section>

      <section class="apartmatch-cta" aria-labelledby="am-cta-heading">
        <div class="container apartmatch-cta__inner" data-am-reveal>
          <h2 id="am-cta-heading">Pronto para encontrar o seu apê ideal?</h2>
          <button type="button" class="btn btn--primary btn--lg" data-open-matching>
            <span aria-hidden="true">🧭</span> Fazer o Matching Inteligente
          </button>
          <p class="apartmatch-cta__note">Grátis, sem compromisso. Os preços são diárias e variam por data e demanda.</p>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    if (prefersReducedMotion() || !window.gsap) return;

    gsap.from(this.querySelectorAll('[data-am-reveal]'), {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 85%', once: true },
    });
  }
}

customElements.define('rf-apartmatch-sections', RFApartmatchSections);
