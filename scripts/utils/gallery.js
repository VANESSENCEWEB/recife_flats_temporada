/**
 * Inicializa galeria estilo Booking: imagem principal + miniaturas + setas.
 * @param {HTMLElement} root
 */
export function initGallery(root) {
  if (!root || root.dataset.galleryInit === 'true') return;

  const mainImg = root.querySelector('[data-gallery-main]');
  const thumbs  = [...root.querySelectorAll('[data-gallery-thumb]')];
  const prevBtn = root.querySelector('[data-gallery-prev]');
  const nextBtn = root.querySelector('[data-gallery-next]');

  if (!mainImg || !thumbs.length) return;

  root.dataset.galleryInit = 'true';
  let index = thumbs.findIndex((t) => t.classList.contains('is-active'));
  if (index < 0) index = 0;

  const sources = thumbs.map((t) => ({
    src: t.dataset.src || t.querySelector('img')?.src || '',
    alt: t.dataset.alt || t.querySelector('img')?.alt || '',
  }));

  const counter = root.querySelector('.apt-gallery__counter');

  const setActive = (nextIndex, animate = true) => {
    index = (nextIndex + sources.length) % sources.length;
    const { src, alt } = sources[index];

    thumbs.forEach((t, i) => t.classList.toggle('is-active', i === index));
    if (counter) counter.textContent = `${index + 1} / ${sources.length}`;

    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mainImg.src = src;
      mainImg.alt = alt;
      return;
    }

    mainImg.classList.add('is-fading');
    window.setTimeout(() => {
      mainImg.src = src;
      mainImg.alt = alt;
      mainImg.classList.remove('is-fading');
    }, 180);
  };

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => setActive(i));
  });

  prevBtn?.addEventListener('click', () => setActive(index - 1));
  nextBtn?.addEventListener('click', () => setActive(index + 1));

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  setActive(index - 1);
    if (e.key === 'ArrowRight') setActive(index + 1);
  });
}

/**
 * @param {ApartmentImage & { placeholder?: string }} img
 * @param {string} fallback
 */
export function galleryImageSrc(img, fallback) {
  return img.src || img.placeholder || fallback;
}
