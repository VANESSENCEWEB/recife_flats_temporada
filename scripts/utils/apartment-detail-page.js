/**
 * Interações — template apartamento (nav, galeria modal, reserva).
 */

export function initApartmentDetailPage(root, opts) {
  if (!root || root.dataset.detailInit === 'true') return;
  root.dataset.detailInit = 'true';

  initSectionNav(root);
  initGalleryModal(root);
  initBookingForm(root, opts);
}

function stackOffset() {
  const announcement = document.querySelector('.announcement');
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 84;
  const tickerH = 44;
  let top = navH + tickerH;
  if (announcement) top += announcement.offsetHeight;
  return top;
}

function initSectionNav(root) {
  const links = [...root.querySelectorAll('[data-apt-nav]')];
  const ids = links.map((l) => l.getAttribute('href')?.replace('#', '')).filter(Boolean);
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href')?.replace('#', '');
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      window.scrollTo({ top: el.offsetTop - stackOffset() - 8, behavior: 'smooth' });
      links.forEach((a) => a.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });

  const onScroll = () => {
    const pos = window.scrollY + stackOffset() + 60;
    let current = sections[0];
    sections.forEach((s) => { if (pos >= s.offsetTop) current = s; });
    if (!current) return;
    links.forEach((l) => {
      l.classList.toggle('is-active', l.getAttribute('href') === `#${current.id}`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initGalleryModal(root) {
  const modal = root.querySelector('[data-gallery-modal]');
  const openBtn = root.querySelector('[data-gallery-open]');
  const closeBtn = root.querySelector('[data-gallery-close]');
  if (!modal) return;

  const open = () => { modal.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
  const close = () => { modal.classList.remove('is-open'); document.body.style.overflow = ''; };

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
  root.querySelectorAll('[data-gallery-tile]').forEach((t) => {
    t.addEventListener('click', open);
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

function initBookingForm(root, opts) {
  const { pricePerNight, cleaningFee, maxGuests, waReserveUrl } = opts;
  const checkin = root.querySelector('[data-checkin]');
  const checkout = root.querySelector('[data-checkout]');
  const guestsToggle = root.querySelector('[data-guests-toggle]');
  const guestsPanel = root.querySelector('[data-guests-panel]');
  const guestsDisplay = root.querySelector('[data-guests-display]');
  const adultsCount = root.querySelector('[data-adults-count]');
  const childrenCount = root.querySelector('[data-children-count]');
  const nightsEl = root.querySelector('[data-nights-count]');
  const subtotalEl = root.querySelector('[data-subtotal]');
  const totalEl = root.querySelector('[data-total]');
  const reserveBtn = root.querySelector('[data-reserve-btn]');

  let adults = 2;
  let children = 0;
  const today = new Date().toISOString().split('T')[0];
  if (checkin) checkin.min = today;
  if (checkout) checkout.min = today;

  const fmt = (n) => `R$ ${n.toLocaleString('pt-BR')}`;

  const updateGuests = () => {
    if (guestsDisplay) {
      guestsDisplay.textContent =
        `${adults === 1 ? '1 adulto' : `${adults} adultos`} · ${children === 0 ? '0 crianças' : children === 1 ? '1 criança' : `${children} crianças`}`;
    }
    if (adultsCount) adultsCount.textContent = String(adults);
    if (childrenCount) childrenCount.textContent = String(children);
    const dA = root.querySelector('[data-adults-down]');
    const uA = root.querySelector('[data-adults-up]');
    const dC = root.querySelector('[data-children-down]');
    const uC = root.querySelector('[data-children-up]');
    if (dA) dA.disabled = adults <= 1;
    if (uA) uA.disabled = adults + children >= maxGuests;
    if (dC) dC.disabled = children <= 0;
    if (uC) uC.disabled = adults + children >= maxGuests;
  };

  guestsToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    guestsPanel?.classList.toggle('is-open');
  });
  document.addEventListener('click', (e) => {
    if (!guestsPanel?.contains(e.target) && e.target !== guestsToggle) {
      guestsPanel?.classList.remove('is-open');
    }
  });

  [['adults-up', () => adults++, () => adults + children < maxGuests],
    ['adults-down', () => adults--, () => adults > 1],
    ['children-up', () => children++, () => adults + children < maxGuests],
    ['children-down', () => children--, () => children > 0],
  ].forEach(([sel, mutate, ok]) => {
    root.querySelector(`[data-${sel}]`)?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (ok()) { mutate(); updateGuests(); }
    });
  });
  updateGuests();

  const calc = () => {
    if (!pricePerNight || !checkin?.value || !checkout?.value) return;
    const nights = Math.round((new Date(checkout.value) - new Date(checkin.value)) / 86400000);
    if (nights <= 0) return;
    const sub = pricePerNight * nights;
    if (nightsEl) nightsEl.textContent = String(nights);
    if (subtotalEl) subtotalEl.textContent = fmt(sub);
    if (totalEl) totalEl.textContent = fmt(sub + (cleaningFee || 0));
  };

  checkin?.addEventListener('change', () => {
    if (checkin.value && checkout) {
      const d = new Date(checkin.value);
      d.setDate(d.getDate() + 1);
      checkout.min = d.toISOString().split('T')[0];
    }
    calc();
  });
  checkout?.addEventListener('change', calc);

  reserveBtn?.addEventListener('click', () => {
    const parts = ['Olá! Gostaria de reservar este apartamento.'];
    if (checkin?.value) parts.push(`Check-in: ${checkin.value}`);
    if (checkout?.value) parts.push(`Check-out: ${checkout.value}`);
    parts.push(`Hóspedes: ${adults} adulto(s)${children ? `, ${children} criança(s)` : ''}`);
    const base = waReserveUrl.split('?')[0];
    window.open(`${base}?text=${encodeURIComponent(parts.join(' · '))}`, '_blank', 'noopener,noreferrer');
  });
}
