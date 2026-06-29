/**
 * <rf-footer> — Rodapé editorial (design exemplo).
 */

import { BUSINESS, whatsappUrl } from '../data/location.js';

class RFFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();

    this.innerHTML = `
      <footer class="footer">
        <div class="footer__bg" aria-hidden="true">
          <img src="./assets/images/boa_viagem-01.avif.png" alt="" loading="lazy">
        </div>
        <div class="footer__overlay" aria-hidden="true"></div>
        <div class="container">
          <h2 class="reveal">Recife <span class="accent">Flats.</span></h2>
          <div class="footer__grid">
            <div class="footer__brand">
              <p>4 apartamentos por temporada em Boa Viagem e Pina, Recife — PE. Hospedagem verificada, atendimento local e suporte durante a estadia.</p>
              <div class="footer__contact">
                <a href="tel:${BUSINESS.phone}">${BUSINESS.phoneDisplay}</a>
                <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a>
                <span>Boa Viagem &amp; Pina — Recife, PE</span>
              </div>
            </div>
            <div class="footer__col">
              <h5>Navegação</h5>
              <ul>
                <li><a href="./index.html">Início</a></li>
                <li><a href="./apartamentos.html">Apartamentos</a></li>
                <li><a href="./sobre.html">Sobre nós</a></li>
                <li><a href="./contato.html">Contato</a></li>
              </ul>
            </div>
            <div class="footer__col">
              <h5>Bairros</h5>
              <ul>
                <li><a href="./boa-viagem.html">Boa Viagem</a></li>
                <li><a href="./pina.html">Pina</a></li>
              </ul>
            </div>
            <div class="footer__col">
              <h5>Redes</h5>
              <div class="socials">
                <a href="https://instagram.com/recifeflats" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>
                </a>
                <a href="${whatsappUrl()}" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A10 10 0 0 0 3.6 17l-1.6 5 5.1-1.6A10 10 0 1 0 20.5 3.5z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div class="footer__bottom">
            <span>© ${year} Recife Flats. Todos os direitos reservados.</span>
            <span>Recife Flats Temporada</span>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('rf-footer', RFFooter);
