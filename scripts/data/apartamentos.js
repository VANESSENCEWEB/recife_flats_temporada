/**
 * Dados dos 4 apartamentos — 3 em Boa Viagem, 1 em Pina.
 * Alinhado ao site recifeflatstemporada.com
 */

import { getManifestImages } from './apartment-image-manifest.js';
import { assetUrl } from '../utils/paths.js';

export const FALLBACK_IMAGE = './assets/images/boa_viagem-01.avif.png';

/** @typedef {{ src: string, alt: string }} ApartmentImage */

const COVER_BY_SLUG = {
  'studio-203-boa-viagem': [
    { src: FALLBACK_IMAGE, alt: 'Studio 203 Boa Viagem — temporada em Recife' },
  ],
  'apartamento-804-pina': [
    { src: FALLBACK_IMAGE, alt: 'Apartamento 804 Pina — temporada em Recife' },
  ],
};

/** @param {string} slug */
function getApartmentImages(slug) {
  const manifest = getManifestImages(slug);
  if (manifest?.length) return manifest;
  return COVER_BY_SLUG[slug] || [{ src: FALLBACK_IMAGE, alt: 'Recife Flats Temporada' }];
}

/** @typedef {{
 *   id: string,
 *   slug: string,
 *   name: string,
 *   neighborhood: string,
 *   neighborhoodSlug: string,
 *   building: string,
 *   badge: string | null,
 *   tagline: string,
 *   description: string,
 *   beds: number,
 *   bedrooms: number,
 *   guests: number,
 *   bathrooms: number,
 *   parking: boolean,
 *   pool: boolean,
 *   petFriendly: boolean,
 *   size: string,
 *   priceFrom: string | null,
 *   priceNote: string,
 *   rating: number,
 *   reviewCount: number,
 *   amenities: string[],
 *   images: ApartmentImage[],
 * }} Apartment */

/** @type {Apartment[]} */
export const APARTAMENTOS = [
  {
    id: '01',
    slug: 'apartamento-2-quartos-boa-viagem',
    name: 'Apartamento 2 Quartos Boa Viagem',
    neighborhood: 'Boa Viagem',
    neighborhoodSlug: 'boa-viagem',
    building: 'Edifício Ipê · Apt 105',
    badge: 'Para família',
    tagline: '100 m da praia — espaço ideal para famílias',
    description:
      'Apartamento amplo com 2 quartos, cozinha completa, Wi-Fi e pet friendly sob pedido. Localização prática em Boa Viagem, a poucos passos da orla e do comércio do bairro.',
    beds: 3,
    bedrooms: 2,
    guests: 6,
    bathrooms: 1,
    parking: true,
    pool: false,
    petFriendly: true,
    size: '72 m²',
    priceFrom: 'R$ 350',
    priceNote: '/dia',
    rating: 4.9,
    reviewCount: 42,
    amenities: ['Wi-Fi', '2 quartos', '100 m da praia', 'Pet friendly', 'Estacionamento rotativo', 'Cozinha equipada'],
    images: getApartmentImages('apartamento-2-quartos-boa-viagem'),
  },
  {
    id: '02',
    slug: 'flat-golden-view-1006',
    name: 'Flat Golden View 1006',
    neighborhood: 'Boa Viagem',
    neighborhoodSlug: 'boa-viagem',
    building: 'Golden View · Apt 1006',
    badge: 'Mais procurado',
    tagline: 'Piscina na cobertura e portaria 24h',
    description:
      'Flat compacto e funcional, muito procurado por quem quer piscina na cobertura, portaria 24h e localização prática perto da praia e do Shopping Recife.',
    beds: 2,
    bedrooms: 1,
    guests: 3,
    bathrooms: 1,
    parking: true,
    pool: true,
    petFriendly: false,
    size: '42 m²',
    priceFrom: 'R$ 200',
    priceNote: '/dia',
    rating: 4.9,
    reviewCount: 38,
    amenities: ['Wi-Fi', 'Piscina rooftop', 'Portaria 24h', 'Estacionamento', '1 quarto', 'Perto da praia'],
    images: getApartmentImages('flat-golden-view-1006'),
  },
  {
    id: '03',
    slug: 'studio-203-boa-viagem',
    name: 'Studio 203 Boa Viagem',
    neighborhood: 'Boa Viagem',
    neighborhoodSlug: 'boa-viagem',
    building: 'Edifício Ipê · Apt 203',
    badge: 'Studio',
    tagline: 'Ideal para casal — perto da praia e do aeroporto',
    description:
      'Studio de 1 quarto com ótima localização em Boa Viagem. Check-in 15h–22h, check-out 9h–11h e pets sob pedido. Silêncio entre 22h e 7h.',
    beds: 1,
    bedrooms: 1,
    guests: 2,
    bathrooms: 1,
    parking: false,
    pool: false,
    petFriendly: true,
    size: '35 m²',
    priceFrom: null,
    priceNote: 'Sob consulta',
    rating: 4.8,
    reviewCount: 0,
    amenities: ['Wi-Fi', '1 quarto', 'Ideal casal', 'Pet sob pedido', 'Perto da praia'],
    images: getApartmentImages('studio-203-boa-viagem'),
  },
  {
    id: '04',
    slug: 'apartamento-804-pina',
    name: 'Apartamento 804 Pina',
    neighborhood: 'Pina',
    neighborhoodSlug: 'pina',
    building: 'Pina · Apt 804',
    badge: '2 quartos',
    tagline: 'Ao lado do Shopping RioMar',
    description:
      'Apartamento de 2 quartos no Pina com piscina, Wi-Fi e garagem. Check-in 15h–22h, check-out 9h–11h. Pets permitidos com possível taxa. Próximo à feirinha e à orla.',
    beds: 3,
    bedrooms: 2,
    guests: 5,
    bathrooms: 1,
    parking: true,
    pool: true,
    petFriendly: true,
    size: '68 m²',
    priceFrom: null,
    priceNote: 'Sob consulta',
    rating: 4.8,
    reviewCount: 0,
    amenities: ['Wi-Fi', '2 quartos', 'Piscina', 'Garagem', 'Pets', 'RioMar'],
    images: getApartmentImages('apartamento-804-pina'),
  },
];

/** @param {Apartment} apt */
export function resolveImages(apt) {
  const images = apt.images.length
    ? apt.images
    : [{ src: FALLBACK_IMAGE, alt: apt.name }];

  const fallback = assetUrl(FALLBACK_IMAGE);

  return images.map((img) => ({
    src: assetUrl(img.src),
    alt: img.alt,
    placeholder: fallback,
  }));
}

/** @param {string} slug */
export function getApartmentBySlug(slug) {
  return APARTAMENTOS.find((a) => a.slug === slug) || null;
}

/** @param {string} neighborhoodSlug */
export function getApartmentsByNeighborhood(neighborhoodSlug) {
  return APARTAMENTOS.filter((a) => a.neighborhoodSlug === neighborhoodSlug);
}
