/**
 * <rf-hero> — Hero stop-scroll com vídeo em loop + buscador.
 *
 * Uso:
 *   <rf-hero
 *     video="/assets/videos/recife-loop.mp4"
 *     poster="/assets/images/hero-poster.jpg"
 *     eyebrow="Recife · Boa Viagem · Pina"
 *     title='Sua estadia em <em>Recife</em> começa aqui.'
 *     description="Apartamentos de temporada, mobiliados com tudo que você precisa.">
 *   </rf-hero>
 *
 * O buscador <rf-booking-search> é renderizado automaticamente
 * dentro do hero. Se quiser esconder, use o atributo no-search.
 *
 * Requer GSAP global.
 */

import { splitTextIntoLetters } from '../utils/split-text.js';
import { prefersReducedMotion } from '../utils/dom.js';

class RFHero extends HTMLElement {
  connectedCallback() {
    const video       = this.getAttribute('video')       || '';
    const videoWebm   = this.getAttribute('video-webm')  || '';
    const poster      = this.getAttribute('poster')      || '';
    const eyebrow     = this.getAttribute('eyebrow')     || 'Recife · Boa Viagem · Pina';
    const title       = this.getAttribute('title')       || 'Sua estadia em <em>Recife</em> começa aqui.';
    const description = this.getAttribute('description') || '';
    const noSearch    = this.hasAttribute('no-search');

    this.innerHTML = `
      <section class="hero" id="hero" aria-label="Apresentação">

        ${poster ? `<img class="hero__poster" src="${poster}" alt="" loading="eager" aria-hidden="true">` : ''}

        ${video ? `
          <video class="hero__video"
                 autoplay muted loop playsinline preload="metadata"
                 ${poster ? `poster="${poster}"` : ''}
                 aria-hidden="true">
            ${videoWebm ? `<source src="${videoWebm}" type="video/webm">` : ''}
            <source src="${video}" type="video/mp4">
          </video>
        ` : ''}

        <div class="hero__overlay"></div>
        <div class="hero__grain"></div>

        <div class="hero__container container">

        

          <div class="hero__text">
            <span class="hero__eyebrow" data-hero-eyebrow>
              <span class="hero__eyebrow-dot"></span>
              <span class="hero__eyebrow-text">${eyebrow}</span>
            </span>

            <h1 class="hero__title" data-hero-title>${title}</h1>

            ${description ? `
              <p class="hero__description" data-hero-desc>${description}</p>
            ` : ''}
          </div>

          ${noSearch ? '' : `
            <div class="hero__search" data-hero-search>
              <rf-booking-search action="/apartamentos.html"></rf-booking-search>
            </div>
          `}

        </div>

        <div class="hero__clouds" aria-hidden="true">
          <svg class="hero__clouds-layer hero__clouds-layer--back" viewBox="0 0 1440 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path fill="#FFFFFF" d="M0,180 L0,110 C40,100 80,120 130,115 C175,108 200,80 260,75 C320,70 360,95 420,100 C485,105 520,75 580,68 C645,60 680,95 740,98 C810,102 860,72 920,68 C985,63 1020,98 1080,100 C1145,103 1180,75 1240,72 C1300,68 1340,98 1380,108 C1410,115 1440,112 1440,112 L1440,180 Z"/>
          </svg>
          <svg class="hero__clouds-layer hero__clouds-layer--mid" viewBox="0 0 1440 140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path fill="#FFFFFF" d="M0,140 L0,90 C50,75 100,95 160,90 C220,85 260,60 320,65 C380,70 420,95 480,92 C550,88 600,62 660,68 C720,73 770,98 830,95 C900,92 940,65 1000,68 C1060,71 1100,95 1160,98 C1230,101 1280,72 1340,75 C1390,77 1440,90 1440,90 L1440,140 Z"/>
          </svg>
          <svg class="hero__clouds-layer hero__clouds-layer--front" viewBox="0 0 1440 110" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path fill="#FFFFFF" d="M0,110 L0,70
              C30,60 60,75 90,72
              C115,68 130,52 165,50
              C205,48 230,72 270,72
              C310,72 335,55 380,52
              C425,48 450,72 495,72
              C540,72 565,52 610,50
              C660,48 685,72 730,72
              C775,72 800,55 845,52
              C895,48 920,72 965,72
              C1010,72 1035,55 1080,52
              C1130,48 1155,72 1200,72
              C1245,72 1270,55 1315,52
              C1360,48 1395,68 1440,72
              L1440,110 Z"/>
          </svg>
        </div>

        <div class="hero__scroll" aria-hidden="true" data-hero-scroll>
          <span class="hero__scroll-text">Scroll</span>
          <span class="hero__scroll-line"></span>
        </div>
      </section>
    `;

    this._animate();
  }

  _animate() {
    const reduce = prefersReducedMotion();
    const titleEl   = this.querySelector('[data-hero-title]');
    const eyebrowEl = this.querySelector('[data-hero-eyebrow]');
    const descEl    = this.querySelector('[data-hero-desc]');
    const searchEl  = this.querySelector('[data-hero-search]');
    const scrollEl  = this.querySelector('[data-hero-scroll]');
    const emEl      = titleEl?.querySelector('em');

    const letters = titleEl ? splitTextIntoLetters(titleEl) : [];

    if (reduce) {
      [eyebrowEl, descEl, searchEl, scrollEl].forEach(el => {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      letters.forEach(l => { l.style.opacity = '1'; l.style.transform = 'none'; });
      if (emEl) { emEl.style.opacity = '1'; emEl.style.transform = 'none'; }
      return;
    }

    if (letters.length) {
      gsap.set(letters, { opacity: 0, y: 28 });
    }
    if (emEl) gsap.set(emEl, { opacity: 0, scale: 0.94 });

    const tl = gsap.timeline({ delay: 0.1 });

    if (letters.length) {
      tl.to(letters, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: { each: 0.02, from: 'start' },
      }, 0);
    }

    if (emEl) {
      tl.to(emEl, {
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: 'back.out(1.5)',
      }, 0.3);
    }

    if (eyebrowEl) {
      tl.fromTo(eyebrowEl,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        0.05
      );
    }

    if (descEl) {
      tl.fromTo(descEl,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        0.38
      );
    }

    if (searchEl) {
      tl.fromTo(searchEl,
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
        0.55
      );
    }

    if (scrollEl) {
      tl.fromTo(scrollEl,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        1.0
      );
    }
  }
}

customElements.define('rf-hero', RFHero);
