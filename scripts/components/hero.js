/**
 * <rf-hero> — Hero editorial fullscreen (design exemplo / Tripora).
 */

import { initAllSplitText } from '../utils/split-text.js';
import { prefersReducedMotion } from '../utils/dom.js';
import { showAllReveals } from '../utils/scroll-animations.js';

class RFHero extends HTMLElement {
  connectedCallback() {
    const video       = this.getAttribute('video')       || '';
    const poster      = this.getAttribute('poster')      || '';
    const eyebrow     = this.getAttribute('eyebrow')     || 'Boa Viagem & Pina · Recife, PE';
    const title       = this.getAttribute('title')       || 'Sua temporada além do <span class="accent">comum.</span>';
    const description = this.getAttribute('description') || '4 apartamentos selecionados à beira-mar em Recife. Mobiliados, verificados e com atendimento de quem é da terra.';
    const noSearch    = this.hasAttribute('no-search');

    this.innerHTML = `
      <section class="hero" id="hero" aria-label="Apresentação">
        <div class="hero__media">
          ${video ? `
            <video autoplay muted loop playsinline preload="metadata"
                   ${poster ? `poster="${poster}"` : ''} aria-hidden="true">
              <source src="${video}" type="video/mp4">
            </video>
          ` : ''}
          ${poster ? `<img src="${poster}" alt="" loading="eager" fetchpriority="high" aria-hidden="true">` : ''}
        </div>
        <div class="hero__overlay" aria-hidden="true"></div>

        <div class="container hero__inner">
          <div class="hero__content">
            <div class="pre-title" data-hero-eyebrow>
              <span class="pre-title__dot"></span> ${eyebrow}
            </div>
            <h1 data-split data-hero-title>${title}</h1>
            <p class="hero__desc" data-hero-desc>${description}</p>
            <div class="hero__badges" data-hero-badges>
              <span class="hero__badge">★ 4.9 no Google</span>
              <span class="hero__badge">Pé na areia</span>
              <span class="hero__badge">Reserva direta</span>
            </div>
            <div class="hero__actions" data-hero-actions>
              <a href="./apartamentos.html" class="btn btn--accent">Ver apartamentos</a>
              <a href="#apartamentos" class="btn btn--ghost">Explorar</a>
            </div>
          </div>

          ${noSearch ? '' : `
            <div class="hero__search-wrap" data-hero-search>
              <rf-booking-search action="./apartamentos.html"></rf-booking-search>
            </div>
          `}
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    const reduced = prefersReducedMotion();

    if (!reduced) initAllSplitText(this);

    if (reduced || !window.gsap) {
      showAllReveals(this);
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    const words = this.querySelectorAll('[data-split] .split-word > span');

    if (words.length) {
      gsap.set(words, { y: '110%' });
      tl.to(words, { y: '0%', duration: 1.1, stagger: 0.04 }, 0.1);
    }

    tl.from(
      this.querySelectorAll('.pre-title, .hero__desc, .hero__badges, .hero__actions, .hero__search-wrap'),
      { y: 24, opacity: 0, duration: 1, stagger: 0.08 },
      0.35,
    );

    const media = this.querySelector('.hero__media video, .hero__media img');
    if (media) {
      gsap.from(media, { scale: 1.12, duration: 2, ease: 'expo.out' });
    }
  }
}

customElements.define('rf-hero', RFHero);
