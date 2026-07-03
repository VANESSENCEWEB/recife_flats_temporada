/**
 * <rf-footer> — Rodapé completo inspirado no buracodaveia.
 */

import { BUSINESS, whatsappUrl } from '../data/location.js';
import { APARTAMENTOS } from '../data/apartamentos.js';
import { apartmentUrl, pageHref } from '../data/site-structure.js';

class RFFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    const waLink = whatsappUrl();

    const aptLinks = APARTAMENTOS.map((a) => `
      <li>
        <a href="${apartmentUrl(a.slug)}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
          ${a.name}
        </a>
      </li>
    `).join('');

    this.innerHTML = `
      <footer class="site-footer">
        <div class="site-footer__main">
          <div class="container site-footer__grid">

            <div class="site-footer__brand">
              <div class="site-footer__brand-header">
                <span class="site-footer__logo-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="8" width="7" height="10" rx="1" fill="white" fill-opacity="0.9"/>
                    <rect x="11" y="5" width="7" height="13" rx="1" fill="white" fill-opacity="0.7"/>
                  </svg>
                </span>
                <div>
                  <strong class="site-footer__brand-name">Recife Flats</strong>
                  <span class="site-footer__brand-sub">Temporada</span>
                </div>
              </div>
              <p class="site-footer__desc">
                Apartamentos de temporada prontos pra você chegar e curtir. Pertinho da praia,
                com tudo incluso, reserva direta e atendimento de quem é da terra.
              </p>
              <div class="site-footer__socials">
                <a href="${waLink}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A10 10 0 0 0 3.6 17l-1.6 5 5.1-1.6A10 10 0 1 0 20.5 3.5z"/></svg>
                </a>
                <a href="https://instagram.com/recifeflats" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
                </a>
                <a href="mailto:${BUSINESS.email}" aria-label="E-mail">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                </a>
              </div>
            </div>

            <div class="site-footer__col">
              <h4>Apartamentos</h4>
              <ul>${aptLinks}
                <li><a href="${pageHref('./apartamentos.html')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg> Ver todos</a></li>
              </ul>
            </div>

            <div class="site-footer__col">
              <h4>Navegação</h4>
              <ul>
                <li><a href="${pageHref('./index.html')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg> Início</a></li>
                <li><a href="${pageHref('./apartamentos.html')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg> Apartamentos</a></li>
                <li><a href="${pageHref('./sobre.html')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg> Sobre</a></li>
                <li><a href="${pageHref('./contato.html')}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg> Contato</a></li>
              </ul>
            </div>

            <div class="site-footer__col">
              <h4>Suporte</h4>
              <div class="site-footer__contact">
                <div class="site-footer__contact-item">
                  <span class="site-footer__contact-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A10 10 0 0 0 3.6 17l-1.6 5 5.1-1.6A10 10 0 1 0 20.5 3.5z"/></svg>
                  </span>
                  <div>
                    <strong>WhatsApp</strong>
                    <a href="${waLink}" target="_blank" rel="noopener noreferrer">${BUSINESS.phoneDisplay}</a>
                  </div>
                </div>
                <div class="site-footer__contact-item">
                  <span class="site-footer__contact-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                  </span>
                  <div>
                    <strong>E-mail</strong>
                    <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>
                  </div>
                </div>
              </div>
              <div class="site-footer__status">
                <span class="site-footer__status-dot" aria-hidden="true"></span>
                Atendimento online
              </div>
            </div>

          </div>
        </div>

        <div class="site-footer__bottom">
          <div class="container site-footer__bottom-inner">
            <p>© ${year} Recife Flats Temporada. Todos os direitos reservados.</p>
            <p>Boa Viagem &amp; Pina — Recife, PE</p>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('rf-footer', RFFooter);
