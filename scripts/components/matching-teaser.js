/**
 * <rf-matching-teaser> — Seção "scroll story" do Matching Inteligente.
 *
 * Divide a tela em duas colunas: foto de um casal em dúvida + mockup de
 * celular (uma coluna), e um texto que muda de cena conforme o usuário
 * rola a página (outra coluna). No desktop, a seção fica "presa" (pin)
 * enquanto o usuário rola, trocando de cena — como um vídeo controlado
 * pelo scroll. No mobile, as cenas aparecem empilhadas normalmente
 * (sem pin) e o mockup do celular cicla sozinho.
 */

import { APARTAMENTOS, resolveImages } from '../data/apartamentos.js';
import { assetUrl } from '../utils/paths.js';
import { prefersReducedMotion } from '../utils/dom.js';

const SCENES = [
  {
    eyebrow: 'Em dúvida?',
    title: 'Não sabe qual<br>apartamento escolher?',
    text: 'Várias opções, pouca certeza — a gente conhece essa sensação. E resolve isso rapidinho.',
    phone: 'question',
  },
  {
    eyebrow: 'A solução',
    title: 'Conheça o <em class="display-italic">ApartMatch</em>',
    text: 'Um questionário rápido e um algoritmo inteligente encontram o apê ideal pra sua viagem em Recife.',
    phone: 'question',
  },
  {
    eyebrow: 'Como funciona',
    title: 'A gente entende<br>o seu perfil',
    text: 'Comparamos suas respostas — objetivo, pessoas, estacionamento, piscina, internet e orçamento — com os atributos reais de cada apartamento.',
    phone: 'loading',
  },
  {
    eyebrow: 'Resultado',
    title: 'Veja a compatibilidade<br>em segundos',
    text: 'Cada apartamento recebe um score de 0 a 100% com uma explicação personalizada — sem enrolação.',
    phone: 'ready',
  },
  {
    eyebrow: 'Pronto pra começar?',
    title: 'Faça o Matching Inteligente',
    text: 'Leva menos de 1 minuto e pode te poupar horas comparando anúncio por anúncio.',
    phone: 'results',
    cta: true,
  },
];

const PHONE_ORDER = ['question', 'loading', 'ready', 'results'];

function renderPhoneScreens() {
  const results = APARTAMENTOS.slice(0, 3).map((apt) => resolveImages(apt)[0]);

  return `
    <div class="phone-screen is-active" data-phone-screen="question">
      <div class="phone-screen__pin" aria-hidden="true">📍</div>
      <h4 class="phone-screen__title">Qual o objetivo<br>da sua viagem?</h4>
      <div class="phone-screen__options">
        <div class="phone-screen__option"><span aria-hidden="true">👨‍👩‍👧‍👦</span> Família</div>
        <div class="phone-screen__option is-selected"><span aria-hidden="true">💑</span> Casal</div>
        <div class="phone-screen__option"><span aria-hidden="true">💻</span> Trabalho remoto</div>
        <div class="phone-screen__option"><span aria-hidden="true">🏖️</span> Turismo</div>
      </div>
    </div>

    <div class="phone-screen" data-phone-screen="loading">
      <div class="phone-screen__ring-wrap">
        <svg viewBox="0 0 120 120" class="phone-screen__ring" aria-hidden="true">
          <defs>
            <linearGradient id="matchRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff8fab"/>
              <stop offset="100%" stop-color="#4ade80"/>
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="50" class="phone-screen__ring-track"></circle>
          <circle cx="60" cy="60" r="50" class="phone-screen__ring-fill"></circle>
        </svg>
        <span class="phone-screen__ring-dot" aria-hidden="true"></span>
      </div>
      <p class="phone-screen__caption">Calculando compatibilidade…</p>
    </div>

    <div class="phone-screen" data-phone-screen="ready">
      <div class="phone-screen__check" aria-hidden="true">✓</div>
      <h4 class="phone-screen__title">Seu Matching Inteligente<br>está pronto!</h4>
    </div>

    <div class="phone-screen" data-phone-screen="results">
      <p class="phone-screen__results-label">Resultados encontrados: <strong>${APARTAMENTOS.length} apartamentos</strong></p>
      <div class="phone-screen__results-grid">
        ${results.map((img, i) => `
          <div class="phone-screen__result">
            <img src="${img.src}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${img.placeholder}'">
            <span>${i === 0 ? 'A' : i === 1 ? 'B' : 'C'} · ${88 - i * 9}%</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

class RFMatchingTeaser extends HTMLElement {
  connectedCallback() {
    const scenesHtml = SCENES.map((s, i) => `
      <div class="matching-story__scene${i === 0 ? ' is-active' : ''}" data-scene="${i}">
        <span class="matching-story__eyebrow">${s.eyebrow}</span>
        <h2 class="matching-story__title" ${i === 0 ? 'id="matching-heading"' : ''}>${s.title}</h2>
        <p class="matching-story__text">${s.text}</p>
        ${s.cta ? `
          <div class="matching-story__actions">
            <button type="button" class="btn btn--primary btn--lg" data-open-matching>
              <span aria-hidden="true">🧭</span> Fazer o Matching Inteligente
            </button>
            <a href="./apartmatch.html" class="btn btn--outline btn--lg">Saiba mais</a>
          </div>
        ` : ''}
      </div>
    `).join('');

    const dotsHtml = SCENES.map((_, i) => `<span class="matching-story__dot${i === 0 ? ' is-active' : ''}" data-progress-dot></span>`).join('');

    const photoSrc = assetUrl('./assets/images/matching/matching-couple-doubt.jpg');
    const photoSrcWebp = assetUrl('./assets/images/matching/matching-couple-doubt.webp');

    this.innerHTML = `
      <section class="matching-story" id="matching" data-matching-story aria-labelledby="matching-heading">
        <div class="container matching-story__grid">

          <div class="matching-story__visual">
            <div class="matching-story__photo">
              <picture>
                <source srcset="${photoSrcWebp}" type="image/webp">
                <img src="${photoSrc}" alt="Casal em dúvida olhando para o celular, em frente a um prédio de apartamentos" loading="lazy">
              </picture>
            </div>
            <div class="matching-story__phone" aria-hidden="true">
              <div class="matching-story__phone-notch"></div>
              <div class="matching-story__phone-screen" data-phone-container>
                ${renderPhoneScreens()}
              </div>
            </div>
          </div>

          <div class="matching-story__content">
            <div class="matching-story__scenes" data-scenes>${scenesHtml}</div>
            <div class="matching-story__dots" data-dots>${dotsHtml}</div>
          </div>

        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    const section = this.querySelector('[data-matching-story]');
    const scenes = [...this.querySelectorAll('[data-scene]')];
    const dots = [...this.querySelectorAll('[data-progress-dot]')];
    const phoneScreens = [...this.querySelectorAll('[data-phone-screen]')];
    const total = scenes.length;

    const setActive = (idx) => {
      scenes.forEach((el, i) => el.classList.toggle('is-active', i === idx));
      dots.forEach((el, i) => el.classList.toggle('is-active', i === idx));
      const key = SCENES[idx]?.phone;
      phoneScreens.forEach((el) => el.classList.toggle('is-active', el.dataset.phoneScreen === key));
    };

    if (prefersReducedMotion() || !window.gsap || !window.ScrollTrigger) {
      this.querySelectorAll('.matching-story__scene').forEach((el) => el.classList.add('is-active'));
      return;
    }

    ScrollTrigger.matchMedia({
      '(min-width: 900px)': () => {
        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * (total - 1) * 0.85)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(total - 1, Math.floor(self.progress * total));
            setActive(idx);
          },
        });
        return () => st.kill();
      },

      '(max-width: 899px)': () => {
        scenes.forEach((el) => el.classList.add('is-active'));
        const triggers = scenes.map((el, i) => gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }));
        dots.forEach((el, i) => el.classList.toggle('is-active', i === 0));

        let phoneIdx = 0;
        const cyclePhone = () => {
          phoneIdx = (phoneIdx + 1) % PHONE_ORDER.length;
          const key = PHONE_ORDER[phoneIdx];
          phoneScreens.forEach((el) => el.classList.toggle('is-active', el.dataset.phoneScreen === key));
        };
        const interval = window.setInterval(cyclePhone, 2800);

        return () => {
          window.clearInterval(interval);
          triggers.forEach((tw) => tw.scrollTrigger?.kill());
        };
      },
    });
  }
}

customElements.define('rf-matching-teaser', RFMatchingTeaser);
