/**
 * wave-divider.js — Divisor animado entre seções (3 camadas de onda SVG
 * em velocidades diferentes), inspirado no efeito usado em
 * https://vanessenceweb.github.io/ALIQUOTA/
 *
 * Uso:
 *   <div class="wave-divider" ...>${renderWaveDivider('var(--cream)')}</div>
 *   ou direto:
 *   `<section style="position:relative">...${renderWaveDivider('var(--white)')}</section>`
 */

/** @param {string} color cor final da 3ª camada (a que "entrega" a próxima seção) */
export function renderWaveDivider(color = 'var(--cream)') {
  return `
    <div class="wave-divider" style="--wave-color:${color}" aria-hidden="true">
      <svg class="wave-divider__layer wave-divider__layer--a" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,45 C240,90 480,0 720,45 C960,90 1200,0 1440,45 L1440,90 L0,90 Z"/>
      </svg>
      <svg class="wave-divider__layer wave-divider__layer--b" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,27 C280,81 560,9 840,40 C1120,76 1300,14 1440,36 L1440,90 L0,90 Z"/>
      </svg>
      <svg class="wave-divider__layer wave-divider__layer--c" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path d="M0,54 C200,9 450,86 720,36 C990,9 1220,76 1440,50 L1440,90 L0,90 Z"/>
      </svg>
    </div>
  `;
}
