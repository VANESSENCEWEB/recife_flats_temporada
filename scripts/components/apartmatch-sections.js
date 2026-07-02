/**
 * <rf-apartmatch-sections> — Conteúdo abaixo do hero da página ApartMatch:
 * como funciona, algoritmo (pesos), as 6 perguntas, transparência e CTA final.
 * Todas as seções revelam com scroll (GSAP ScrollTrigger) quando disponível.
 */

import { prefersReducedMotion } from '../utils/dom.js';

const STEPS = [
  { num: '01', title: 'Diga suas datas (ou não)', text: 'Se já souber quando viaja, ótimo. Se não, sem problema — o matching funciona só com o seu perfil.' },
  { num: '02', title: 'Responda 6 perguntas', text: 'Objetivo da viagem, pessoas, estacionamento, piscina, internet e orçamento. Leva menos de 1 minuto.' },
  { num: '03', title: 'Veja o score de cada apê', text: 'Compatibilidade de 0 a 100%, com uma explicação personalizada de por que aquele apartamento combina com você.' },
  { num: '04', title: 'Reserve com confiança', text: 'Direto pelo WhatsApp — com aviso de disponibilidade quando você já informou datas.' },
];

const ALGO_WEIGHTS = [
  { label: 'Capacidade', value: 30 },
  { label: 'Estacionamento', value: 20 },
  { label: 'Localização / objetivo', value: 20 },
  { label: 'Piscina', value: 15 },
  { label: 'Internet', value: 10 },
  { label: 'Orçamento', value: 5 },
];

const QUESTIONS_PREVIEW = [
  { icon: '🎯', title: 'Objetivo da viagem', text: 'Família, casal, trabalho remoto ou turismo/lazer.' },
  { icon: '👥', title: 'Quantidade de pessoas', text: 'De 1 a 6 hóspedes na reserva.' },
  { icon: '🅿️', title: 'Estacionamento', text: 'Não precisa, seria bom ou é essencial?' },
  { icon: '🏊', title: 'Piscina', text: 'Rooftop, térrea, tanto faz ou sem piscina.' },
  { icon: '📶', title: 'Internet', text: 'Básico, importante ou essencial (home office).' },
  { icon: '💰', title: 'Orçamento', text: 'Econômico, médio ou sem restrição.' },
];

const TRUST_ITEMS = [
  { icon: '💸', title: 'Preços variam por data', text: 'Os valores são diárias e podem mudar conforme antecedência, demanda e período (alta temporada, feriados etc.).' },
  { icon: '🎯', title: 'É uma recomendação, não uma garantia', text: 'O score é baseado no seu perfil — a disponibilidade e o preço final dependem sempre da data escolhida.' },
  { icon: '⏱️', title: 'Quanto antes, melhor', text: 'Reservar com antecedência aumenta as chances de conseguir o apartamento ideal com o melhor preço.' },
];

class RFApartmatchSections extends HTMLElement {
  connectedCallback() {
    const stepsHtml = STEPS.map((s) => `
      <article class="apartmatch-step" data-am-reveal>
        <span class="apartmatch-step__num">${s.num}</span>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
      </article>
    `).join('');

    const barsHtml = ALGO_WEIGHTS.map((w) => `
      <div class="apartmatch-bar">
        <div class="apartmatch-bar__label"><span>${w.label}</span><span>${w.value}%</span></div>
        <div class="apartmatch-bar__track">
          <div class="apartmatch-bar__fill" data-am-bar data-fill="${w.value}"></div>
        </div>
      </div>
    `).join('');

    const questionsHtml = QUESTIONS_PREVIEW.map((q) => `
      <article class="apartmatch-question" data-am-reveal>
        <span class="apartmatch-question__icon" aria-hidden="true">${q.icon}</span>
        <div>
          <h3>${q.title}</h3>
          <p>${q.text}</p>
        </div>
      </article>
    `).join('');

    const trustHtml = TRUST_ITEMS.map((t) => `
      <article class="apartmatch-trust-card" data-am-reveal>
        <span class="apartmatch-trust-card__icon" aria-hidden="true">${t.icon}</span>
        <h3>${t.title}</h3>
        <p>${t.text}</p>
      </article>
    `).join('');

    this.innerHTML = `
      <section class="apartmatch-steps" id="como-funciona" aria-labelledby="am-steps-heading">
        <div class="container">
          <header class="apartmatch-steps__header" data-am-reveal>
            <span class="eyebrow eyebrow--pill">Como funciona</span>
            <h2 id="am-steps-heading">Do perfil à reserva em 4 passos</h2>
            <p>Sem burocracia: você responde, o ApartMatch calcula, você decide.</p>
          </header>
          <div class="apartmatch-steps__grid">${stepsHtml}</div>
        </div>
      </section>

      <section class="apartmatch-algo" aria-labelledby="am-algo-heading">
        <div class="container apartmatch-algo__inner">
          <div class="apartmatch-algo__copy" data-am-reveal>
            <span class="eyebrow eyebrow--on-dark">Por trás do algoritmo</span>
            <h2 id="am-algo-heading">Um score justo, pensado para o seu perfil</h2>
            <p>Comparamos suas respostas com os atributos reais de cada apartamento — capacidade, estacionamento, piscina, internet e orçamento — e priorizamos o que mais importa numa estadia em Recife.</p>
            <p>O resultado é um percentual de 0 a 100% com uma explicação em português claro do porquê daquele apartamento combinar (ou não) com você.</p>
          </div>
          <div class="apartmatch-algo__bars" data-am-bars>${barsHtml}</div>
        </div>
      </section>

      <section class="apartmatch-questions" aria-labelledby="am-questions-heading">
        <div class="container">
          <header class="apartmatch-questions__header" data-am-reveal>
            <span class="eyebrow eyebrow--pill">O questionário</span>
            <h2 id="am-questions-heading">As 6 perguntas do ApartMatch</h2>
            <p>Rápidas, diretas e pensadas pra quem vem curtir Boa Viagem ou o Pina.</p>
          </header>
          <div class="apartmatch-questions__grid">${questionsHtml}</div>
        </div>
      </section>

      <section class="apartmatch-trust" aria-labelledby="am-trust-heading">
        <div class="container">
          <header class="apartmatch-trust__header" data-am-reveal>
            <span class="eyebrow eyebrow--pill">Transparência total</span>
            <h2 id="am-trust-heading">Sem letra miúda</h2>
            <p>Você merece saber exatamente como o Matching funciona antes de reservar.</p>
          </header>
          <div class="apartmatch-trust__grid">${trustHtml}</div>
        </div>
      </section>

      <section class="apartmatch-cta" aria-labelledby="am-cta-heading">
        <div class="container apartmatch-cta__inner" data-am-reveal>
          <h2 id="am-cta-heading">Pronto para encontrar o seu apê ideal?</h2>
          <p>Leva menos de 1 minuto e pode economizar horas comparando anúncio por anúncio.</p>
          <button type="button" class="btn btn--primary btn--lg" data-open-matching>
            <span aria-hidden="true">🧭</span> Fazer o Matching Inteligente
          </button>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    const bars = [...this.querySelectorAll('[data-am-bar]')];

    if (prefersReducedMotion() || !window.gsap) {
      bars.forEach((el) => { el.style.width = `${el.dataset.fill}%`; });
      return;
    }

    gsap.from(this.querySelectorAll('[data-am-reveal]'), {
      opacity: 0,
      y: 28,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: this, start: 'top 85%', once: true },
    });

    const barsWrap = this.querySelector('[data-am-bars]');
    if (barsWrap && bars.length) {
      ScrollTrigger.create({
        trigger: barsWrap,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          bars.forEach((el, i) => {
            gsap.to(el, {
              width: `${el.dataset.fill}%`,
              duration: 1.1,
              delay: i * 0.08,
              ease: 'power2.out',
            });
          });
        },
      });
    }
  }
}

customElements.define('rf-apartmatch-sections', RFApartmatchSections);
