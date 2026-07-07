/**
 * <rf-trust-strip> — Faixa de confiança abaixo da hero.
 */

class RFTrustStrip extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="trust-strip">
        <div class="container trust-strip__inner">
          <div class="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span><strong>4.9</strong> no Google</span>
          </div>
          <div class="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12c2-8 8-10 10-10s8 2 10 10"/><path d="M12 2v20"/></svg>
            <span><strong>100m</strong> da praia</span>
          </div>
          <div class="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>
            <span><strong>Wi-Fi</strong> 300Mbps</span>
          </div>
          <div class="trust-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span><strong>Reserva</strong> direta</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('rf-trust-strip', RFTrustStrip);
