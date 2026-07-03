/**
 * <rf-match> — "Faça um match": pedido de ajuda quando o hóspede não
 * encontra um flat livre para as datas dele.
 *
 * Uso:
 *   <rf-match></rf-match>                 → seção padrão (fim das páginas)
 *   <rf-match variant="empty"></rf-match> → estado de "nada disponível"
 *
 * Sem backend: ao enviar, monta uma mensagem e abre o WhatsApp da casa
 * (wa.me) já preenchido. Depois troca o formulário por um estado de sucesso.
 *
 * Prefill: lê ?checkin=&checkout=&guests= da URL.
 */

import { WHATSAPP, readSearchParams } from '../data/apartments.js';

const BUDGETS = [
  { value: '', label: 'Qualquer valor' },
  { value: 'até R$250/noite', label: 'até R$ 250 / noite' },
  { value: 'R$250–400/noite', label: 'R$ 250 – 400 / noite' },
  { value: 'R$400–600/noite', label: 'R$ 400 – 600 / noite' },
  { value: 'acima de R$600/noite', label: 'acima de R$ 600 / noite' },
];

class RFMatch extends HTMLElement {
  connectedCallback() {
    const variant = this.getAttribute('variant') || 'section';
    const { checkin, checkout, guests } = readSearchParams();

    const heading =
      variant === 'empty'
        ? 'Nenhum flat livre para essas datas — deixa que a gente encontra'
        : 'Não achou o flat ideal?';

    const lead =
      variant === 'empty'
        ? 'Conte o que você procura e a nossa equipe faz o match com um apartamento parceiro (ou uma data alternativa) em minutos, direto no WhatsApp.'
        : 'Faça um match: diga suas datas, o perfil da estadia e a gente indica o apartamento certo pra você — sem custo e sem compromisso.';

    const guestOptions = Array.from({ length: 8 }, (_, i) => i + 1)
      .map(
        (n) =>
          `<option value="${n}" ${n === (guests || 2) ? 'selected' : ''}>${n} ${n === 1 ? 'hóspede' : 'hóspedes'}</option>`
      )
      .join('');

    this.innerHTML = /* html */ `
      <section class="match match--${variant}">
        <div class="match__card">
          <div class="match__intro">
            <span class="match__eyebrow">
              <span class="match__eyebrow-dot" aria-hidden="true"></span>
              Match personalizado
            </span>
            <h2 class="match__title">${heading}</h2>
            <p class="match__lead">${lead}</p>
            <ul class="match__perks">
              <li>Resposta humana no WhatsApp</li>
              <li>Sugestão de datas alternativas</li>
              <li>Sem taxas de reserva</li>
            </ul>
          </div>

          <form class="match__form" data-match-form novalidate>
            <div class="match__row">
              <label class="match__field">
                <span class="match__label">Seu nome</span>
                <input class="match__input" type="text" name="nome" placeholder="Como te chamamos?" required>
              </label>
              <label class="match__field">
                <span class="match__label">WhatsApp</span>
                <input class="match__input" type="tel" name="whatsapp" placeholder="(81) 9 0000-0000" required>
              </label>
            </div>

            <div class="match__row">
              <label class="match__field">
                <span class="match__label">Check-in</span>
                <input class="match__input" type="date" name="checkin" value="${checkin}">
              </label>
              <label class="match__field">
                <span class="match__label">Check-out</span>
                <input class="match__input" type="date" name="checkout" value="${checkout}">
              </label>
            </div>

            <div class="match__row">
              <label class="match__field">
                <span class="match__label">Hóspedes</span>
                <select class="match__input match__select" name="guests">${guestOptions}</select>
              </label>
              <label class="match__field">
                <span class="match__label">Orçamento</span>
                <select class="match__input match__select" name="budget">
                  ${BUDGETS.map((b) => `<option value="${b.value}">${b.label}</option>`).join('')}
                </select>
              </label>
            </div>

            <label class="match__field">
              <span class="match__label">O que não pode faltar? <span class="match__optional">(opcional)</span></span>
              <textarea class="match__input match__textarea" name="notes" rows="2" placeholder="Ex.: vista mar, pet friendly, perto do Riomar…"></textarea>
            </label>

            <button type="submit" class="match__submit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              Quero meu match
            </button>
            <p class="match__hint" data-match-hint aria-live="polite"></p>
          </form>

          <div class="match__success" data-match-success hidden>
            <span class="match__success-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </span>
            <h3 class="match__success-title">Pedido enviado!</h3>
            <p class="match__success-text">
              Abrimos o WhatsApp com o seu match. Se ele não abrir,
              <a data-match-fallback href="#" target="_blank" rel="noopener">toque aqui para continuar</a>.
            </p>
          </div>
        </div>
      </section>
    `;

    this._form = this.querySelector('[data-match-form]');
    this._hint = this.querySelector('[data-match-hint]');
    this._success = this.querySelector('[data-match-success]');
    this._fallback = this.querySelector('[data-match-fallback]');

    this._form.addEventListener('submit', (e) => this._onSubmit(e));
  }

  _onSubmit(e) {
    e.preventDefault();
    const data = new FormData(this._form);
    const nome = (data.get('nome') || '').toString().trim();
    const whatsapp = (data.get('whatsapp') || '').toString().trim();

    if (!nome || !whatsapp) {
      this._hint.textContent = 'Preencha nome e WhatsApp para a gente te achar o match.';
      this._hint.classList.add('is-error');
      return;
    }
    this._hint.classList.remove('is-error');

    const checkin = (data.get('checkin') || '').toString();
    const checkout = (data.get('checkout') || '').toString();
    const guests = (data.get('guests') || '').toString();
    const budget = (data.get('budget') || '').toString();
    const notes = (data.get('notes') || '').toString().trim();

    const lines = [
      'Olá! Quero fazer um *match* de apartamento na Recife Flats Temporada.',
      '',
      `• Nome: ${nome}`,
      `• WhatsApp: ${whatsapp}`,
      checkin || checkout ? `• Datas: ${checkin || '—'} até ${checkout || '—'}` : '',
      `• Hóspedes: ${guests}`,
      budget ? `• Orçamento: ${budget}` : '',
      notes ? `• Preferências: ${notes}` : '',
    ].filter(Boolean);

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;

    this._fallback.setAttribute('href', url);
    window.open(url, '_blank', 'noopener');

    this._form.hidden = true;
    this._success.hidden = false;
  }
}

customElements.define('rf-match', RFMatch);
