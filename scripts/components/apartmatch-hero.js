/**
 * <rf-apartmatch-hero> — Hero full-screen do ApartMatch com fundo animado
 * em Three.js (rede de partículas conectando-se, representando o algoritmo
 * de compatibilidade). Carrega Three.js sob demanda via CDN (ESM) e tem
 * fallback gracioso (gradiente estático) se WebGL/Three.js não estiverem
 * disponíveis, ou frame único se o usuário preferir menos movimento.
 */

import { prefersReducedMotion } from '../utils/dom.js';
import { renderWaveDivider } from '../utils/wave-divider.js';

const THREE_CDN = 'https://unpkg.com/three@0.161.0/build/three.module.js';

class RFApartmatchHero extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="apartmatch-hero" id="apartmatch-hero">
        <canvas class="apartmatch-hero__canvas" data-apartmatch-canvas aria-hidden="true"></canvas>
        <div class="apartmatch-hero__overlay" aria-hidden="true"></div>

        <div class="container apartmatch-hero__inner">
          <span class="apartmatch-hero__badge">
            <span aria-hidden="true">✨</span> Novidade
          </span>

          <h1 class="apartmatch-hero__title">
            Apart<span class="apartmatch-hero__title-accent">Match</span>
          </h1>

          <p class="apartmatch-hero__lead">
            Responda rapidinho e descubra o apartamento ideal pra sua viagem em Recife —
            em menos de 1 minuto.
          </p>

          <div class="apartmatch-hero__actions">
            <button type="button" class="btn btn--primary btn--lg" data-open-matching>
              <span aria-hidden="true">🧭</span> Fazer o Matching agora
            </button>
            <a href="#como-funciona" class="btn btn--outline btn--lg">Ver como funciona</a>
          </div>

          <div class="apartmatch-hero__stats">
            <div class="apartmatch-hero__stat">
              <strong>6</strong>
              <span>perguntas rápidas</span>
            </div>
            <div class="apartmatch-hero__stat">
              <strong>4</strong>
              <span>apartamentos analisados</span>
            </div>
            <div class="apartmatch-hero__stat">
              <strong>100%</strong>
              <span>grátis, sem compromisso</span>
            </div>
          </div>
        </div>

        ${renderWaveDivider('var(--cream)')}
      </section>
    `;

    this._section = this.querySelector('.apartmatch-hero');
    this._canvas = this.querySelector('[data-apartmatch-canvas]');
    this._initScene();
  }

  async _initScene() {
    if (!this._canvas || typeof window === 'undefined') return;
    if (!window.WebGLRenderingContext) return; // sem suporte a WebGL — fica só o gradiente CSS

    try {
      const THREE = await import(/* webpackIgnore: true */ THREE_CDN);
      this._buildScene(THREE);
    } catch (err) {
      console.warn('[apartmatch] Three.js indisponível — usando fundo estático.', err);
    }
  }

  _buildScene(THREE) {
    const canvas = this._canvas;
    const section = this._section;
    const reduced = prefersReducedMotion();
    const isMobile = window.innerWidth < 700;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    camera.position.z = 62;

    const COUNT = isMobile ? 50 : 130;
    const BOUNDS = { x: 90, y: 55, z: 38 };
    const MAX_DIST = isMobile ? 15 : 19;

    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * BOUNDS.x * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS.y * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS.z * 2;
      velocities[i * 3] = (Math.random() - 0.5) * 0.035;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.035;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.035;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointsMat = new THREE.PointsMaterial({
      color: 0x9fe6ec,
      size: isMobile ? 1.7 : 2.1,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(pointsGeo, pointsMat);
    scene.add(points);

    const maxSegments = COUNT * 6;
    const linePositions = new Float32Array(maxSegments * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x1b9aaa,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const resize = () => {
      const w = section.clientWidth || window.innerWidth;
      const h = section.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    let targetRotX = 0;
    let targetRotY = 0;
    const onPointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = nx * 0.14;
      targetRotX = -ny * 0.09;
    };

    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0.01 },
    );
    observer.observe(section);

    const pos = pointsGeo.attributes.position.array;
    const linePos = lineGeo.attributes.position.array;

    const tick = () => {
      if (visible) {
        for (let i = 0; i < COUNT; i++) {
          const ix = i * 3;
          pos[ix] += velocities[ix];
          pos[ix + 1] += velocities[ix + 1];
          pos[ix + 2] += velocities[ix + 2];
          if (Math.abs(pos[ix]) > BOUNDS.x) velocities[ix] *= -1;
          if (Math.abs(pos[ix + 1]) > BOUNDS.y) velocities[ix + 1] *= -1;
          if (Math.abs(pos[ix + 2]) > BOUNDS.z) velocities[ix + 2] *= -1;
        }
        pointsGeo.attributes.position.needsUpdate = true;

        let segIdx = 0;
        for (let i = 0; i < COUNT && segIdx < maxSegments; i++) {
          const ix = i * 3;
          for (let j = i + 1; j < COUNT && segIdx < maxSegments; j++) {
            const jx = j * 3;
            const dx = pos[ix] - pos[jx];
            const dy = pos[ix + 1] - pos[jx + 1];
            const dz = pos[ix + 2] - pos[jx + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < MAX_DIST) {
              const li = segIdx * 6;
              linePos[li] = pos[ix];
              linePos[li + 1] = pos[ix + 1];
              linePos[li + 2] = pos[ix + 2];
              linePos[li + 3] = pos[jx];
              linePos[li + 4] = pos[jx + 1];
              linePos[li + 5] = pos[jx + 2];
              segIdx++;
            }
          }
        }
        lineGeo.setDrawRange(0, segIdx * 2);
        lineGeo.attributes.position.needsUpdate = true;

        camera.rotation.x += (targetRotX - camera.rotation.x) * 0.04;
        camera.rotation.y += (targetRotY - camera.rotation.y) * 0.04;

        renderer.render(scene, camera);
      }
      this._raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      renderer.render(scene, camera);
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      this._raf = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);

    this._cleanup = () => {
      cancelAnimationFrame(this._raf);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      pointsGeo.dispose();
      lineGeo.dispose();
      pointsMat.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }

  disconnectedCallback() {
    this._cleanup?.();
  }
}

customElements.define('rf-apartmatch-hero', RFApartmatchHero);
