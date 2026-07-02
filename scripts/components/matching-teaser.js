/**
 * <rf-matching-teaser> — Seção full-screen (stop-scroll) do Matching Inteligente.
 * Ocupa a tela inteira ao ser rolada até ela, com animações de entrada e
 * contagem de score. Ao clicar no CTA, dispara `rf-matching-open`.
 */

import { APARTAMENTOS, resolveImages } from '../data/apartamentos.js';
import { prefersReducedMotion } from '../utils/dom.js';

const STEPS = [
  {
    num: '01',
    title: 'Responda 6 perguntas rápidas',
    text: 'Objetivo da viagem, pessoas, estacionamento, piscina, internet e orçamento.',
  },
  {
    num: '02',
    title: 'Veja o score de cada apê',
    text: 'Compatibilidade de 0 a 100%, com explicação personalizada para você.',
  },
  {
    num: '03',
    title: 'Reserve o ideal',
    text: 'Direto pelo WhatsApp — com ou sem disponibilidade confirmada nas suas datas.',
  },
];

function pickVisualApartments() {
  const bySlug = (slug) => APARTAMENTOS.find((a) => a.slug === slug);
  return [
    { apt: bySlug('apartamento-2-quartos-boa-viagem'), score: 92 },
    { apt: bySlug('flat-golden-view-1006'), score: 78 },
  ].filter((item) => item.apt);
}

class RFMatchingTeaser extends HTMLElement {
  connectedCallback() {
    const visualApts = pickVisualApartments();

    const stepsHtml = STEPS.map((s) => `
      <div class="matching-hero__step" data-matching-reveal>
        <span class="matching-hero__step-num">${s.num}</span>
        <div>
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </div>
      </div>
    `).join('');

    const cardsHtml = visualApts.map(({ apt, score }, i) => {
      const cover = resolveImages(apt)[0];
      return `
        <div class="matching-hero__card matching-hero__card--${i === 0 ? 'a' : 'b'}" data-matching-reveal>
          <img src="${cover.src}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${cover.placeholder}'">
          <span class="matching-hero__score" data-count-to="${score}">0%</span>
        </div>
      `;
    }).join('');

    this.innerHTML = `
      <section class="matching-hero" id="matching" aria-labelledby="matching-heading">
        <div class="matching-hero__bg" aria-hidden="true"></div>
        <div class="matching-hero__glow matching-hero__glow--a" aria-hidden="true"></div>
        <div class="matching-hero__glow matching-hero__glow--b" aria-hidden="true"></div>

        <div class="container matching-hero__inner">
          <div class="matching-hero__copy">
            <span class="eyebrow eyebrow--pill" data-matching-reveal>Não sabe qual escolher?</span>
            <h2 class="matching-hero__title" id="matching-heading" data-matching-reveal>
              Faça o <em class="display-italic">Matching Inteligente</em>
            </h2>
            <p class="matching-hero__lead" data-matching-reveal>
              Responda 6 perguntas rápidas sobre a sua viagem e descubra, em segundos,
              qual apartamento combina mais com você — com ou sem data definida.
            </p>

            <div class="matching-hero__steps">${stepsHtml}</div>

            <button type="button" class="btn btn--primary btn--lg matching-hero__cta" data-open-matching data-matching-reveal>
              <span aria-hidden="true">🧭</span> Fazer o Matching Inteligente
            </button>
          </div>

          <div class="matching-hero__visual" aria-hidden="true">
            ${cardsHtml}
            <div class="matching-hero__ring" data-matching-reveal>
              <svg viewBox="0 0 120 120" class="matching-hero__ring-svg">
                <circle cx="60" cy="60" r="52" class="matching-hero__ring-track"></circle>
                <circle cx="60" cy="60" r="52" class="matching-hero__ring-fill" data-ring-fill></circle>
              </svg>
              <span class="matching-hero__ring-label">
                <strong>Match</strong>
                Inteligente
              </span>
            </div>
          </div>
        </div>

        <div class="matching-hero__scroll-hint" aria-hidden="true">
          <span>Role para continuar</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    const counters = [...this.querySelectorAll('[data-count-to]')];
    const ringFill = this.querySelector('[data-ring-fill]');
    const RING_CIRC = 2 * Math.PI * 52;

    if (ringFill) {
      ringFill.style.strokeDasharray = `${RING_CIRC}`;
      ringFill.style.strokeDashoffset = `${RING_CIRC}`;
    }

    if (prefersReducedMotion() || !window.gsap) {
      counters.forEach((el) => { el.textContent = `${el.dataset.countTo}%`; });
      if (ringFill) ringFill.style.strokeDashoffset = `${RING_CIRC * 0.12}`;
      return;
    }

    gsap.from(this.querySelectorAll('[data-matching-reveal]'), {
      opacity: 0,
      y: 32,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 75%', once: true },
    });

    counters.forEach((el) => {
      const target = Number(el.dataset.countTo);
      const state = { val: 0 };
      gsap.to(state, {
        val: target,
        duration: 1.5,
        ease: 'power1.out',
        scrollTrigger: { trigger: this, start: 'top 75%', once: true },
        onUpdate: () => { el.textContent = `${Math.round(state.val)}%`; },
      });
    });

    if (ringFill) {
      gsap.to(ringFill, {
        strokeDashoffset: RING_CIRC * 0.12,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: this, start: 'top 75%', once: true },
      });
    }
  }
}

customElements.define('rf-matching-teaser', RFMatchingTeaser);
