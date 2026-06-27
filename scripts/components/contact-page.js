/**
 * contact-page.js — Formulário, FAQ exclusivo e animações da página de contato.
 * Ativa automaticamente quando encontra [data-contact-page].
 */

import { whatsappUrl } from '../data/location.js';
import { prefersReducedMotion } from '../utils/dom.js';

function initContactForm(root) {
  const form    = root.querySelector('[data-contact-form]');
  const success = root.querySelector('[data-form-success]');
  const error   = root.querySelector('[data-form-error]');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.hidden = true;
    error.hidden   = true;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Sem backend por enquanto — simula envio e oferece WhatsApp como alternativa
    form.hidden = true;
    success.hidden = false;

    const data = new FormData(form);
    const nome = data.get('nome') || '';
    const msg  = data.get('mensagem') || '';
    const waLink = root.querySelector('.contact-cta a[href*="wa.me"]');
    if (waLink) {
      waLink.href = whatsappUrl(
        `Olá! Meu nome é ${nome}. ${msg ? msg + ' ' : ''}Gostaria de saber mais sobre os apartamentos.`
      );
    }
  });
}

function initFaqAccordion(root) {
  const items = root.querySelectorAll('.faq-item');
  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
}

function initAnimations(root) {
  if (prefersReducedMotion() || !window.gsap) return;

  const reveals = root.querySelectorAll('[data-contact-reveal]');
  reveals.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 36,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });
}

function initContactPage() {
  const root = document.querySelector('[data-contact-page]');
  if (!root) return;

  initContactForm(root);
  initFaqAccordion(root);
  initAnimations(root);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactPage);
} else {
  initContactPage();
}
