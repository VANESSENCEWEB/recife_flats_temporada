/**
 * <rf-hero> — Hero stop-scroll com vídeo em loop + buscador.
 *
 * Suporta vídeos diferentes para dia e noite, carregados via API
 * (JSON estático ou CMS) com fallback nos atributos HTML.
 *
 * Uso:
 *   <rf-hero
 *     hero-id="home"
 *     api-base="./data"
 *     video-day="/assets/videos/recife-day.mp4"
 *     video-night="/assets/videos/recife-night.mp4"
 *     poster-day="/assets/images/hero-day.jpg"
 *     poster-night="/assets/images/hero-night.jpg"
 *     timezone="America/Recife"
 *     day-start="6"
 *     night-start="18"
 *     eyebrow="Recife · Boa Viagem · Pina"
 *     title='Sua estadia em <em>Recife</em> começa aqui.'
 *     description="Apartamentos de temporada, mobiliados com tudo que você precisa.">
 *   </rf-hero>
 *
 * API (duas chamadas em paralelo):
 *   GET {api-base}/hero/{hero-id}/day.json
 *   GET {api-base}/hero/{hero-id}/night.json
 *
 * O buscador <rf-booking-search> é renderizado automaticamente
 * dentro do hero. Se quiser esconder, use o atributo no-search.
 *
 * Requer GSAP global.
 */

import { splitTextIntoLetters } from '../utils/split-text.js';
import { prefersReducedMotion } from '../utils/dom.js';
import { getTimeOfDay, getTimeOptionsFromElement } from '../utils/time-of-day.js';
import {
  applyVideoAsset,
  fetchHeroAssetsByPeriod,
  getFallbackAssetsFromElement,
  pickActiveAsset,
} from '../modules/hero-assets.js';

const PERIOD_CHECK_MS = 60_000;

class RFHero extends HTMLElement {
  connectedCallback() {
    this._periodCheckInterval = null;
    this._currentPeriod = null;
    this._assets = null;
    this._init();
  }

  disconnectedCallback() {
    if (this._periodCheckInterval) {
      clearInterval(this._periodCheckInterval);
      this._periodCheckInterval = null;
    }
  }

  async _init() {
    const timeOptions = getTimeOptionsFromElement(this);
    const period = getTimeOfDay(timeOptions);
    this._currentPeriod = period;

    const fallback = getFallbackAssetsFromElement(this);
    const initial = pickActiveAsset(fallback, period);

    this._renderShell(initial);
    this.dataset.period = period;
    this._animate();

    const heroId = this.getAttribute('hero-id') || 'home';
    const apiBase = this.getAttribute('api-base');

    if (apiBase === '' || apiBase === 'false') {
      this._assets = fallback;
      this._startPeriodWatcher(timeOptions);
      return;
    }

    try {
      const assets = await fetchHeroAssetsByPeriod(heroId, apiBase || './data');
      this._assets = assets;

      const active = pickActiveAsset(assets, period);
      const videoEl = this.querySelector('.hero__video');
      const posterEl = this.querySelector('.hero__poster');
      applyVideoAsset(videoEl, posterEl, active);
    } catch (err) {
      console.warn('[rf-hero] API unavailable, using HTML fallbacks', err);
      this._assets = fallback;
    }

    this._startPeriodWatcher(timeOptions);
  }

  _startPeriodWatcher(timeOptions) {
    this._periodCheckInterval = setInterval(() => {
      const period = getTimeOfDay(timeOptions);
      if (period === this._currentPeriod || !this._assets) return;

      this._currentPeriod = period;
      this.dataset.period = period;

      const active = pickActiveAsset(this._assets, period);
      const videoEl = this.querySelector('.hero__video');
      const posterEl = this.querySelector('.hero__poster');
      applyVideoAsset(videoEl, posterEl, active);
    }, PERIOD_CHECK_MS);
  }

  _renderShell(asset) {
    const eyebrow = this.getAttribute('eyebrow') || 'Recife · Boa Viagem · Pina';
    const title = this.getAttribute('title') || this.getAttribute('heading')
      || 'Sua estadia em <em>Recife</em> começa aqui.';
    const description = this.getAttribute('description') || '';
    const noSearch = this.hasAttribute('no-search');

    const video = asset?.video || '';
    const videoWebm = asset?.videoWebm || '';
    const poster = asset?.poster || '';

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

        <div class="hero__scroll" aria-hidden="true">
          <span class="hero__scroll-text">Scroll</span>
          <span class="hero__scroll-line"></span>
        </div>

        <div class="hero__clouds" aria-hidden="true">
          <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path class="cloud-back" fill="rgba(255,255,255,0.6)" d="M0,140 C120,90 240,110 360,120 C480,130 600,80 720,100 C840,120 960,150 1080,130 C1200,110 1320,90 1440,120 L1440,200 L0,200 Z"/>
            <path class="cloud-mid" fill="rgba(255,255,255,0.85)" d="M0,160 C100,130 200,150 320,140 C440,130 560,110 680,130 C800,150 920,170 1060,150 C1200,130 1320,140 1440,160 L1440,200 L0,200 Z"/>
            <path class="cloud-front" fill="#FFFFFF" d="M0,180 C80,165 160,175 280,170 C400,165 520,150 640,165 C760,180 880,185 1020,175 C1160,165 1300,175 1440,180 L1440,200 L0,200 Z"/>
          </svg>
        </div>
      </section>
    `;
  }

  _animate() {
    const reduce = prefersReducedMotion();
    const titleEl = this.querySelector('[data-hero-title]');
    const eyebrowEl = this.querySelector('[data-hero-eyebrow]');
    const descEl = this.querySelector('[data-hero-desc]');
    const searchEl = this.querySelector('[data-hero-search]');

    const letters = titleEl ? splitTextIntoLetters(titleEl) : [];

    if (reduce) {
      [eyebrowEl, descEl, searchEl].forEach(el => {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      letters.forEach(l => { l.style.opacity = '1'; l.style.transform = 'none'; });
      return;
    }

    const tl = gsap.timeline({ delay: 0.15 });

    if (letters.length) {
      tl.to(letters, {
        opacity: 1, y: 0,
        duration: 0.5, ease: 'power2.out',
        stagger: 0.022,
      }, 0);
    }
    if (eyebrowEl) tl.to(eyebrowEl, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.1);
    if (descEl) tl.to(descEl, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.4);
    if (searchEl) tl.to(searchEl, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.6);
  }
}

customElements.define('rf-hero', RFHero);
