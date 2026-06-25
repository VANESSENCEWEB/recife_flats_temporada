/**
 * <rf-navbar> — Header sticky reutilizável.
 *
 * Uso:
 *   <rf-navbar over-hero></rf-navbar>
 *
 * Atributos:
 *   over-hero  : aplica o estilo claro inicial (texto branco) sobre hero escuro
 *   whatsapp   : número de WhatsApp (default: o de produção)
 *
 * Eventos emitidos:
 *   rf-menu-toggle  : disparado ao clicar no botão "Menu" (detail: { open: boolean })
 */

const WHATSAPP_DEFAULT = '558196601178';

class RFNavbar extends HTMLElement {
  connectedCallback() {
    const overHero  = this.hasAttribute('over-hero');
    const whatsapp  = this.getAttribute('whatsapp') || WHATSAPP_DEFAULT;
    const heroTarget = this.getAttribute('hero-target') || '#hero';

    this.innerHTML = /* html */`
      <header class="navbar ${overHero ? 'is-over-hero' : ''}" data-navbar>
        <div class="navbar__inner container">

          <a href="/" class="navbar__logo" aria-label="Recife Flats — Início">
            <span class="navbar__logo-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="8"  width="7" height="10" rx="1" fill="white" fill-opacity="0.9"/>
                <rect x="11" y="5" width="7" height="13" rx="1" fill="white" fill-opacity="0.7"/>
                <rect x="5"  y="11" width="1.5" height="2" rx="0.3" fill="#6E2410"/>
                <rect x="8"  y="11" width="1.5" height="2" rx="0.3" fill="#6E2410"/>
                <rect x="13" y="8"  width="1.5" height="2" rx="0.3" fill="#6E2410"/>
                <rect x="16" y="8"  width="1.5" height="2" rx="0.3" fill="#6E2410"/>
                <rect x="13" y="11" width="1.5" height="2" rx="0.3" fill="#6E2410"/>
                <rect x="16" y="11" width="1.5" height="2" rx="0.3" fill="#6E2410"/>
              </svg>
            </span>
            <span class="navbar__logo-text">
              <span class="navbar__logo-name">Recife Flats</span>
              <span class="navbar__logo-sub">Temporada</span>
            </span>
          </a>

          <div class="navbar__actions">
            <a href="tel:+558196601178" class="btn--phone" aria-label="Telefone para contato">
              <span class="btn--phone__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <span class="btn--phone__text">
                <span class="btn--phone__label">Fale conosco</span>
                <span class="btn--phone__number">+55 81 99660-1178</span>
              </span>
            </a>

            <button class="menu-toggle"
                    data-menu-toggle
                    type="button"
                    aria-label="Abrir menu de navegação"
                    aria-expanded="false"
                    aria-controls="rf-menu">
              <span class="menu-toggle__label">Menu</span>
              <span class="menu-toggle__icon" aria-hidden="true">
                <span></span><span></span><span></span>
              </span>
            </button>
          </div>
        </div>
      </header>
    `;

    this._navbar    = this.querySelector('[data-navbar]');
    this._toggle    = this.querySelector('[data-menu-toggle]');
    this._heroEl    = document.querySelector(heroTarget);

    // 1. Observa o hero — define is-over-hero / is-scrolled
    if (this._heroEl) {
      this._observer = new IntersectionObserver(
        ([entry]) => {
          const over = entry.isIntersecting;
          this._navbar.classList.toggle('is-over-hero', over);
          this._navbar.classList.toggle('is-scrolled',  !over);
        },
        { threshold: 0.05 }
      );
      this._observer.observe(this._heroEl);
    } else {
      this._navbar.classList.add('is-scrolled');
    }

    // 2. Emite evento global ao clicar no botão Menu
    this._toggle.addEventListener('click', () => {
      const isOpen = this._toggle.classList.toggle('is-open');
      this._toggle.setAttribute('aria-expanded', String(isOpen));
      window.dispatchEvent(new CustomEvent('rf-menu-toggle', { detail: { open: isOpen } }));
    });

    // 3. Escuta para sincronizar (caso o menu seja fechado por dentro)
    this._unsync = (e) => {
      const open = e.detail.open;
      this._toggle.classList.toggle('is-open', open);
      this._toggle.setAttribute('aria-expanded', String(open));
    };
    window.addEventListener('rf-menu-state', this._unsync);
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    window.removeEventListener('rf-menu-state', this._unsync);
  }
}

customElements.define('rf-navbar', RFNavbar);
