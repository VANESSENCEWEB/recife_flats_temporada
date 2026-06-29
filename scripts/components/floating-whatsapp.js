/**
 * <rf-floating-whatsapp> — Botão fixo de WhatsApp.
 */

import { whatsappUrl } from '../data/location.js';

class RFFloatingWhatsapp extends HTMLElement {
  connectedCallback() {
    const href = whatsappUrl('Olá! Vim pelo site e gostaria de mais informações.');

    this.innerHTML = `
      <a href="${href}"
         class="floating-whatsapp"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="Falar no WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.5 3.5A10 10 0 0 0 3.6 17l-1.6 5 5.1-1.6A10 10 0 1 0 20.5 3.5z"/>
        </svg>
        <span class="floating-whatsapp__pulse" aria-hidden="true"></span>
      </a>
    `;
  }
}

customElements.define('rf-floating-whatsapp', RFFloatingWhatsapp);
