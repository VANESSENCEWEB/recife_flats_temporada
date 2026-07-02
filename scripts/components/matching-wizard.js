/**
 * <rf-matching-wizard> — Matching Inteligente.
 *
 * Modal com questionário passo a passo (6 perguntas + data opcional) que
 * calcula compatibilidade com os 4 apartamentos e mostra os resultados
 * ordenados por score, com captura de lead quando não há disponibilidade.
 *
 * Abre ao ouvir o evento global `rf-matching-open` (disparado pelo
 * <rf-matching-teaser> ou por qualquer botão com [data-open-matching]).
 */

import { resolveImages } from '../data/apartamentos.js';
import { apartmentUrl } from '../data/site-structure.js';
import { whatsappUrl } from '../data/location.js';
import {
  OBJECTIVE_OPTIONS,
  GUEST_OPTIONS,
  PARKING_OPTIONS,
  POOL_OPTIONS,
  WIFI_OPTIONS,
  BUDGET_OPTIONS,
  QUESTION_ORDER,
  rankApartments,
  scoreTier,
} from '../utils/matching-engine.js';
import { saveMatchingLead, checkAvailability } from '../utils/supabase-client.js';

const QUESTION_LABELS = {
  objective: { title: 'Qual o objetivo da sua viagem?', options: OBJECTIVE_OPTIONS },
  guests: { title: 'Quantas pessoas vão se hospedar?', options: GUEST_OPTIONS.map((n) => ({ value: n, label: n === 1 ? '1 pessoa' : `${n} pessoas`, icon: '👤' })) },
  parking: { title: 'Qual a importância do estacionamento?', options: PARKING_OPTIONS },
  pool: { title: 'Tem preferência de piscina?', options: POOL_OPTIONS },
  wifi: { title: 'Precisa de boa internet?', options: WIFI_OPTIONS },
  budget: { title: 'Qual seu perfil de orçamento?', options: BUDGET_OPTIONS },
};

function emptyAnswers() {
  return {
    hasDates: null,
    checkin: '',
    checkout: '',
    objective: null,
    guests: null,
    parking: null,
    pool: null,
    wifi: null,
    budget: null,
    freeText: '',
  };
}

function buildReserveMessage(apt, answers) {
  const parts = [`Olá! Fiz o Matching Inteligente no site e o ${apt.name} teve a maior compatibilidade com meu perfil.`];
  if (answers.checkin && answers.checkout) {
    parts.push(`Datas: ${answers.checkin} a ${answers.checkout}.`);
  }
  parts.push('Gostaria de reservar.');
  return parts.join(' ');
}

function buildLeadWaFallback(lead) {
  const parts = [`Olá! Sou ${lead.name} e fiz o Matching Inteligente no site.`];
  if (lead.checkin && lead.checkout) parts.push(`Datas desejadas: ${lead.checkin} a ${lead.checkout}.`);
  if (lead.preferredName) parts.push(`Apartamento de interesse: ${lead.preferredName}.`);
  parts.push('Quero saber sobre disponibilidade.');
  return parts.join(' ');
}

class RFMatchingWizard extends HTMLElement {
  connectedCallback() {
    this.answers = emptyAnswers();
    this.step = 'intro';
    this.results = null;
    this.availability = {};
    this.leadState = { open: false, sending: false, sent: false, error: null };

    this.innerHTML = `
      <div class="matching-modal" data-matching-modal role="dialog" aria-modal="true" aria-label="Matching Inteligente" hidden>
        <div class="matching-modal__backdrop" data-matching-close></div>
        <div class="matching-modal__panel">
          <header class="matching-modal__header">
            <span class="matching-modal__title">
              <span aria-hidden="true">🧭</span> Matching Inteligente
            </span>
            <button type="button" class="matching-modal__close" data-matching-close aria-label="Fechar">✕</button>
          </header>
          <div class="matching-modal__body" data-matching-body></div>
        </div>
      </div>
    `;

    this._modal = this.querySelector('[data-matching-modal]');
    this._body = this.querySelector('[data-matching-body]');

    this.addEventListener('click', (e) => this._handleClick(e));
    this.addEventListener('submit', (e) => this._handleSubmit(e));

    window.addEventListener('rf-matching-open', () => this.open());
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-open-matching]')) {
        e.preventDefault();
        this.open();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this._modal.hidden) this.close();
    });

    this._render();
  }

  open() {
    this._modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => this._modal.classList.add('is-open'));
  }

  close() {
    this._modal.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(() => { this._modal.hidden = true; }, 220);
  }

  restart() {
    this.answers = emptyAnswers();
    this.step = 'intro';
    this.results = null;
    this.availability = {};
    this.leadState = { open: false, sending: false, sent: false, error: null };
    this._render();
  }

  _goNext(currentStep) {
    const idx = QUESTION_ORDER.indexOf(currentStep);
    if (idx === -1) return;
    if (idx === QUESTION_ORDER.length - 1) {
      this.step = 'details';
      this._render();
      return;
    }
    this.step = QUESTION_ORDER[idx + 1];
    this._render();
  }

  _goBack(currentStep) {
    if (currentStep === 'dates') { this.step = 'intro'; this._render(); return; }
    if (currentStep === 'dates-from-results') { this.step = 'results'; this._render(); return; }
    if (currentStep === 'results') { this.step = 'details'; this._render(); return; }
    if (currentStep === 'details') { this.step = 'budget'; this._render(); return; }
    const idx = QUESTION_ORDER.indexOf(currentStep);
    if (idx === 0) {
      this.step = this.answers.hasDates ? 'dates' : 'intro';
    } else if (idx > 0) {
      this.step = QUESTION_ORDER[idx - 1];
    }
    this._render();
  }

  async _finish() {
    this.results = rankApartments(this.answers);
    this.step = 'results';
    this._render();

    if (this.answers.hasDates && this.answers.checkin && this.answers.checkout) {
      this._checkAvailabilityForResults();
    }
  }

  async _checkAvailabilityForResults() {
    const { checkin, checkout } = this.answers;
    const checks = await Promise.all(
      this.results.map(async (r) => ({
        slug: r.apt.slug,
        available: await checkAvailability(r.apt.slug, checkin, checkout),
      })),
    );
    checks.forEach(({ slug, available }) => { this.availability[slug] = available; });

    // Reordena: disponíveis primeiro (mantendo o score como critério secundário)
    this.results = [...this.results].sort((a, b) => {
      const avA = this.availability[a.apt.slug];
      const avB = this.availability[b.apt.slug];
      if (avA === avB) return b.score - a.score;
      if (avA === false) return 1;
      if (avB === false) return -1;
      return b.score - a.score;
    });

    this._render();
  }

  _handleClick(e) {
    const closeBtn = e.target.closest('[data-matching-close]');
    if (closeBtn) { this.close(); return; }

    const backBtn = e.target.closest('[data-action="back"]');
    if (backBtn) { this._goBack(this.step); return; }

    const restartBtn = e.target.closest('[data-action="restart"]');
    if (restartBtn) { this.restart(); return; }

    const datesYes = e.target.closest('[data-action="dates-yes"]');
    if (datesYes) { this.answers.hasDates = true; this.step = 'dates'; this._render(); return; }

    const datesNo = e.target.closest('[data-action="dates-no"]');
    if (datesNo) { this.answers.hasDates = false; this.step = QUESTION_ORDER[0]; this._render(); return; }

    const datesContinue = e.target.closest('[data-action="dates-continue"]');
    if (datesContinue) {
      const form = this.querySelector('[data-dates-form]');
      this.answers.checkin = form.checkin.value;
      this.answers.checkout = form.checkout.value;
      this.step = QUESTION_ORDER[0];
      this._render();
      return;
    }

    const optionBtn = e.target.closest('[data-select]');
    if (optionBtn) {
      const field = optionBtn.dataset.select;
      const raw = optionBtn.dataset.value;
      this.answers[field] = field === 'guests' ? Number(raw) : raw;
      this._goNext(field);
      return;
    }

    const addDatesBtn = e.target.closest('[data-action="add-dates"]');
    if (addDatesBtn) { this.answers.hasDates = true; this.step = 'dates-from-results'; this._render(); return; }

    const toggleLead = e.target.closest('[data-action="toggle-lead"]');
    if (toggleLead) {
      this.leadState.open = !this.leadState.open;
      this.leadState.preferredSlug = toggleLead.dataset.slug || this.leadState.preferredSlug || null;
      this._render();
      return;
    }

    const detailsDone = e.target.closest('[data-action="details-continue"], [data-action="details-skip"]');
    if (detailsDone) {
      const ta = this.querySelector('[data-freetext]');
      this.answers.freeText = ta ? ta.value.trim() : '';
      this._finish();
      return;
    }
  }

  async _handleSubmit(e) {
    if (e.target.matches('[data-dates-from-results-form]')) {
      e.preventDefault();
      this.answers.checkin = e.target.checkin.value;
      this.answers.checkout = e.target.checkout.value;
      this.step = 'results';
      this._render();
      this._checkAvailabilityForResults();
      return;
    }

    if (e.target.matches('[data-lead-form]')) {
      e.preventDefault();
      const form = e.target;
      this.leadState.sending = true;
      this._render();

      const preferredSlug = form.dataset.slug || null;
      const preferred = this.results?.find((r) => r.apt.slug === preferredSlug)?.apt;

      const lead = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        whatsapp: form.whatsapp.value.trim(),
        checkin: form.checkin?.value || this.answers.checkin || '',
        checkout: form.checkout?.value || this.answers.checkout || '',
        preferredSlug,
        preferredName: preferred?.name || null,
        guests: this.answers.guests,
        objective: this.answers.objective,
        budget: this.answers.budget,
        answers: this.answers,
      };

      const result = await saveMatchingLead(lead);
      this.leadState.sending = false;
      this.leadState.sent = true;
      this.leadState.savedRemotely = result.ok;
      this.leadState.waFallback = whatsappUrl(buildLeadWaFallback(lead));
      this._render();
    }
  }

  _render() {
    this._body.innerHTML = this._renderStep();
  }

  _renderStep() {
    if (this.step === 'intro') return this._renderIntro();
    if (this.step === 'dates') return this._renderDates();
    if (this.step === 'dates-from-results') return this._renderDatesFromResults();
    if (this.step === 'details') return this._renderDetails();
    if (this.step === 'results') return this._renderResults();
    return this._renderQuestion(this.step);
  }

  _renderProgress(currentStep) {
    const idx = QUESTION_ORDER.indexOf(currentStep);
    const total = QUESTION_ORDER.length;
    const current = idx + 1;
    const pct = Math.round((current / total) * 100);
    return `
      <div class="matching-progress">
        <span class="matching-progress__label">Pergunta ${current} de ${total}</span>
        <div class="matching-progress__track"><div class="matching-progress__fill" style="width:${pct}%"></div></div>
      </div>
    `;
  }

  _renderIntro() {
    return `
      <div class="matching-step matching-step--intro">
        <span class="matching-step__eyebrow">Passo opcional</span>
        <h3 class="matching-step__title">Você já sabe as datas da sua viagem?</h3>
        <p class="matching-step__lead">Tudo bem se ainda não souber — fazemos o match pelo seu perfil e você confere disponibilidade depois.</p>
        <div class="matching-options matching-options--two">
          <button type="button" class="matching-option" data-action="dates-yes">
            <span class="matching-option__icon" aria-hidden="true">📅</span>
            <span class="matching-option__label">Sim, já sei as datas</span>
          </button>
          <button type="button" class="matching-option" data-action="dates-no">
            <span class="matching-option__icon" aria-hidden="true">🤔</span>
            <span class="matching-option__label">Ainda não sei</span>
          </button>
        </div>
      </div>
    `;
  }

  _renderDates() {
    const { checkin, checkout } = this.answers;
    return `
      <div class="matching-step">
        <h3 class="matching-step__title">Quais são suas datas?</h3>
        <form class="matching-dates-form" data-dates-form>
          <label class="matching-field">
            <span>Check-in</span>
            <input type="date" name="checkin" class="matching-input" value="${checkin || ''}" required>
          </label>
          <label class="matching-field">
            <span>Check-out</span>
            <input type="date" name="checkout" class="matching-input" value="${checkout || ''}" required>
          </label>
        </form>
        <div class="matching-nav">
          <button type="button" class="matching-nav__back" data-action="back">← Voltar</button>
          <button type="button" class="btn btn--primary" data-action="dates-continue">Continuar</button>
        </div>
      </div>
    `;
  }

  _renderDatesFromResults() {
    const { checkin, checkout } = this.answers;
    return `
      <div class="matching-step">
        <h3 class="matching-step__title">Verificar disponibilidade</h3>
        <form class="matching-dates-form" data-dates-from-results-form>
          <label class="matching-field">
            <span>Check-in</span>
            <input type="date" name="checkin" class="matching-input" value="${checkin || ''}" required>
          </label>
          <label class="matching-field">
            <span>Check-out</span>
            <input type="date" name="checkout" class="matching-input" value="${checkout || ''}" required>
          </label>
          <div class="matching-nav">
            <button type="button" class="matching-nav__back" data-action="back">← Voltar</button>
            <button type="submit" class="btn btn--primary">Verificar</button>
          </div>
        </form>
      </div>
    `;
  }

  _renderQuestion(step) {
    const { title, options } = QUESTION_LABELS[step];
    const selected = this.answers[step];
    const isNumeric = step === 'guests';

    const optionsHtml = options.map((opt) => `
      <button type="button"
              class="matching-option${isNumeric ? ' matching-option--numeric' : ''}${selected === opt.value ? ' is-selected' : ''}"
              data-select="${step}"
              data-value="${opt.value}">
        <span class="matching-option__icon" aria-hidden="true">${opt.icon || ''}</span>
        <span class="matching-option__label">${opt.label}</span>
      </button>
    `).join('');

    return `
      <div class="matching-step">
        ${this._renderProgress(step)}
        <h3 class="matching-step__title">${title}</h3>
        <div class="matching-options${isNumeric ? ' matching-options--numeric' : ''}">${optionsHtml}</div>
        <div class="matching-nav">
          <button type="button" class="matching-nav__back" data-action="back">← Voltar</button>
        </div>
      </div>
    `;
  }

  _renderDetails() {
    const value = this.answers.freeText || '';
    return `
      <div class="matching-step">
        <span class="matching-step__eyebrow">Detalhe extra (opcional)</span>
        <h3 class="matching-step__title">Quer contar mais alguma coisa?</h3>
        <p class="matching-step__lead">
          Ex.: "queremos ficar bem perto da praia" ou "viajamos com um cachorro pequeno".
          Isso ajuda a explicar melhor por que um apê combina com você.
        </p>
        <textarea class="matching-input matching-textarea" data-freetext rows="3"
                  placeholder="Escreva aqui, se quiser (opcional)…">${value}</textarea>
        <div class="matching-nav">
          <button type="button" class="matching-nav__back" data-action="back">← Voltar</button>
          <div class="matching-nav__group">
            <button type="button" class="matching-link-btn" data-action="details-skip">Pular</button>
            <button type="button" class="btn btn--primary" data-action="details-continue">Ver resultados</button>
          </div>
        </div>
      </div>
    `;
  }

  _renderResults() {
    const results = this.results || [];
    const { hasDates, checkin, checkout } = this.answers;

    const topUnavailable = hasDates && this.availability[results[0]?.apt.slug] === false;

    const cards = results.map((r) => this._renderResultCard(r)).join('');

    return `
      <div class="matching-step matching-step--results">
        <div class="matching-disclaimer">
          <span aria-hidden="true">ℹ️</span>
          Os valores são diárias e podem variar conforme a data, antecedência e demanda do período
          (alta temporada, feriados, etc.). Quanto antes reservar, melhor o preço.
        </div>

        ${hasDates ? `
          <p class="matching-results__dates">Datas informadas: <strong>${checkin}</strong> → <strong>${checkout}</strong></p>
        ` : `
          <div class="matching-results__no-dates">
            <p>Ranking geral por compatibilidade — sem filtro de datas.</p>
            <button type="button" class="matching-link-btn" data-action="add-dates">Verificar disponibilidade para datas específicas</button>
          </div>
        `}

        ${topUnavailable ? `
          <div class="matching-alert">
            <strong>O apartamento com melhor compatibilidade não está disponível nessas datas.</strong>
            <p>Deixe seus dados que avisamos assim que abrir uma vaga, ou veja as próximas opções abaixo.</p>
            <button type="button" class="btn btn--secondary" data-action="toggle-lead" data-slug="${results[0].apt.slug}">
              Quero ser avisado quando liberar
            </button>
          </div>
        ` : ''}

        <div class="matching-results__list">${cards}</div>

        ${this._renderLeadSection()}

        <div class="matching-nav matching-nav--results">
          <button type="button" class="matching-nav__back" data-action="restart">↺ Refazer o matching</button>
        </div>
      </div>
    `;
  }

  _renderResultCard(result) {
    const { apt, score, reason } = result;
    const tier = scoreTier(score);
    const cover = resolveImages(apt)[0];
    const href = apartmentUrl(apt.slug);
    const waLink = whatsappUrl(buildReserveMessage(apt, this.answers));

    const availability = this.answers.hasDates ? this.availability[apt.slug] : undefined;
    const availabilityBadge = availability === true
      ? '<span class="matching-card__availability is-available">✓ Disponível</span>'
      : availability === false
        ? '<span class="matching-card__availability is-unavailable">Indisponível nessas datas</span>'
        : '';

    return `
      <article class="matching-card">
        <div class="matching-card__media">
          <img src="${cover.src}" alt="${apt.name}" loading="lazy" onerror="this.onerror=null;this.src='${cover.placeholder}'">
          <span class="matching-card__score ${tier.className}">${score}%</span>
        </div>
        <div class="matching-card__body">
          <div class="matching-card__head">
            <h4 class="matching-card__title">${apt.name}</h4>
            ${availabilityBadge}
          </div>
          <span class="matching-card__tier ${tier.className}">${tier.label}</span>
          <p class="matching-card__reason">${reason}</p>
          <div class="matching-card__meta">
            <span>${apt.bedrooms} quarto${apt.bedrooms > 1 ? 's' : ''}</span>
            <span>até ${apt.guests} hóspedes</span>
            <span>${apt.priceFrom ? `${apt.priceFrom}${apt.priceNote}` : apt.priceNote}</span>
          </div>
          <div class="matching-card__actions">
            <a href="${href}" class="btn btn--secondary btn--sm">Ver apartamento</a>
            <a href="${waLink}" class="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer">Reservar no WhatsApp</a>
          </div>
        </div>
      </article>
    `;
  }

  _renderLeadSection() {
    const { open, sending, sent, savedRemotely, waFallback, preferredSlug } = this.leadState;

    if (sent) {
      return `
        <div class="matching-lead matching-lead--sent">
          <p><strong>Recebemos seu contato!</strong> ${savedRemotely
    ? 'Vamos avisar assim que tiver disponibilidade.'
    : 'Anotamos seus dados — para agilizar, fale com a gente agora mesmo:'}</p>
          <a href="${waFallback}" class="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer">Falar no WhatsApp agora</a>
        </div>
      `;
    }

    return `
      <div class="matching-lead">
        <button type="button" class="matching-link-btn" data-action="toggle-lead">
          ${open ? '− Fechar' : '+ Não encontrou disponibilidade? Deixe seus dados'}
        </button>
        ${open ? `
          <form class="matching-lead__form" data-lead-form data-slug="${preferredSlug || ''}">
            <label class="matching-field">
              <span>Nome</span>
              <input type="text" name="name" class="matching-input" required>
            </label>
            <label class="matching-field">
              <span>E-mail</span>
              <input type="email" name="email" class="matching-input">
            </label>
            <label class="matching-field">
              <span>WhatsApp</span>
              <input type="tel" name="whatsapp" class="matching-input" placeholder="(81) 90000-0000" required>
            </label>
            <div class="matching-field-row">
              <label class="matching-field">
                <span>Check-in desejado</span>
                <input type="date" name="checkin" class="matching-input" value="${this.answers.checkin || ''}">
              </label>
              <label class="matching-field">
                <span>Check-out desejado</span>
                <input type="date" name="checkout" class="matching-input" value="${this.answers.checkout || ''}">
              </label>
            </div>
            <button type="submit" class="btn btn--primary btn--block" ${sending ? 'disabled' : ''}>
              ${sending ? 'Enviando…' : 'Enviar'}
            </button>
          </form>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('rf-matching-wizard', RFMatchingWizard);
