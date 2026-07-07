/**
 * <rf-hero-roof> — Telhado terracota no topo absoluto da home (moldura casa).
 * Desktop only; some no mobile para não comprimir o hero.
 */

class RFHeroRoof extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="hero-roof" aria-hidden="true">
        <svg class="hero-roof__svg" viewBox="0 0 1200 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 140 L0 52 L600 0 L1200 52 L1200 140 Z" fill="var(--terracotta-600)"/>
          <path d="M0 52 L600 0 L1200 52" fill="none" stroke="var(--terracotta-800)" stroke-width="2" vector-effect="non-scaling-stroke"/>
          <path d="M80 140 L80 72 L1120 72 L1120 140 Z" fill="var(--terracotta-700)" opacity="0.35"/>
        </svg>
      </div>
    `;
  }
}

customElements.define('rf-hero-roof', RFHeroRoof);
