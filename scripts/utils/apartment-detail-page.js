/**
 * Interações da página de apartamento: nav por seções, galeria modal, reserva.
 * @param {HTMLElement} root
 * @param {{ pricePerNight: number | null, cleaningFee: number, maxGuests: number, waReserveUrl: string }} opts
 */
export function initApartmentDetailPage(root, opts) {
  if (!root || root.dataset.detailInit === 'true') return;
  root.dataset.detailInit = 'true';

  initSectionNav(root);
  initGalleryModal(root);
  initBookingForm(root, opts);
}

function initSectionNav(root) {
  const navLinks = [...root.querySelectorAll('[data-apt-nav]')];
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute('href')?.replace('#', '');
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  const headerOffset = () => {
    const nav = document.querySelector('.navbar');
    const announcement = document.querySelector('.announcement');
    const aptNav = root.querySelector('.apt-page-nav');
    let h = (nav?.offsetHeight || 84) + (aptNav?.offsetHeight || 48);
    if (announcement) h += announcement.offsetHeight;
    return h + 8;
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href')?.replace('#', '');
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      window.scrollTo({ top: el.offsetTop - headerOffset(), behavior: 'smooth' });
      navLinks.forEach((a) => a.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });

  const onScroll = () => {
    const scrollPos = window.scrollY + headerOffset() + 40;
    let current = sections[0];
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) current = section;
    });
    if (!current) return;
    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${current.id}`;
      link.classList.toggle('is-active', match);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initGalleryModal(root) {
  const modal = root.querySelector('[data-gallery-modal]');
  const openBtn = root.querySelector('[data-gallery-open]');
  const closeBtn = root.querySelector('[data-gallery-close]');
  if (!modal || !openBtn) return;

  const open = () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  root.querySelectorAll('[data-gallery-tile]').forEach((tile, i) => {
    tile.addEventListener('click', () => {
      if (i === 0 && openBtn) open();
      else open();
    });
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

  const updateGuests = () => {
    const adultLabel = adults === 1 ? '1 adulto' : `${adults} adultos`;
    const childLabel = children === 0 ? '0 crianças' : children === 1 ? '1 criança' : `${children} crianças`;
    if (guestsDisplay) guestsDisplay.textContent = `${adultLabel} · ${childLabel}`;
    if (adultsCount) adultsCount.textContent = String(adults);
    if (childrenCount) childrenCount.textContent = String(children);

    const downAdults = root.querySelector('[data-adults-down]');
    const upAdults = root.querySelector('[data-adults-up]');
    const downChildren = root.querySelector('[data-children-down]');
    const upChildren = root.querySelector('[data-children-up]');
    if (downAdults) downAdults.disabled = adults <= 1;
    if (upAdults) upAdults.disabled = adults + children >= maxGuests;
    if (downChildren) downChildren.disabled = children <= 0;
    if (upChildren) upChildren.disabled = adults + children >= maxGuests;
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

  root.querySelector('[data-adults-up]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (adults + children < maxGuests) { adults++; updateGuests(); }
  });
  root.querySelector('[data-adults-down]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (adults > 1) { adults--; updateGuests(); }
  });
  root.querySelector('[data-children-up]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (adults + children < maxGuests) { children++; updateGuests(); }
  });
  root.querySelector('[data-children-down]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (children > 0) { children--; updateGuests(); }
  });
  updateGuests();

  const formatBRL = (n) => `R$ ${n.toLocaleString('pt-BR')}`;

  const calcPrice = () => {
    if (!pricePerNight || !checkin?.value || !checkout?.value) return;
    const diff = Math.round((new Date(checkout.value) - new Date(checkin.value)) / 86400000);
    if (diff <= 0) return;
    const sub = pricePerNight * diff;
    const total = sub + (cleaningFee || 0);
    if (nightsEl) nightsEl.textContent = String(diff);
    if (subtotalEl) subtotalEl.textContent = formatBRL(sub);
    if (totalEl) totalEl.textContent = formatBRL(total);
  };

  checkin?.addEventListener('change', () => {
    if (checkin.value && checkout) {
      const next = new Date(checkin.value);
      next.setDate(next.getDate() + 1);
      checkout.min = next.toISOString().split('T')[0];
    }
    calcPrice();
  });
  checkout?.addEventListener('change', calcPrice);

  reserveBtn?.addEventListener('click', () => {
    const parts = [`Olá! Gostaria de reservar este apartamento.`];
    if (checkin?.value) parts.push(`Check-in: ${checkin.value}`);
    if (checkout?.value) parts.push(`Check-out: ${checkout.value}`);
    parts.push(`Hóspedes: ${adults} adulto(s)${children ? `, ${children} criança(s)` : ''}`);
    const msg = parts.join(' · ');
    const url = waReserveUrl.includes('?')
      ? `${waReserveUrl.split('?')[0]}?text=${encodeURIComponent(msg)}`
      : `${waReserveUrl}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}
