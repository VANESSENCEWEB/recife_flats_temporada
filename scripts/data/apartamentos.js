/**
 * Dados dos 4 apartamentos — 3 em Boa Viagem, 1 em Pina.
 * Alinhado ao site recifeflatstemporada.com
 */

export const FALLBACK_IMAGE = './assets/images/boa_viagem-01.avif.png';

const BV = './assets/images/apartamentos/boa-viagem';

/** @typedef {{ src: string, alt: string }} ApartmentImage */
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
    images: [
      { src: `${BV}/apt-105/sala-apartamento-105-boa-viagem-visao-ampla_opt.webp`, alt: 'Sala ampla do apartamento 105 em Boa Viagem' },
      { src: `${BV}/apt-105/sala-apartamento-105-boa-viagem-tv-parede-mesa-posta-flores_opt.webp`, alt: 'Sala com TV, mesa posta e decoração floral' },
      { src: `${BV}/apt-105/quarto-casal-1-apartamento-105-boa-viagem-vista-ampla-sofa-cama-ar-condicionado_opt.webp`, alt: 'Primeiro quarto com cama e ar-condicionado' },
      { src: `${BV}/apt-105/quarto-casal-2-apartamento-105-boa-viagem-vista-geral-ar-condicionado_opt.webp`, alt: 'Segundo quarto de casal com ar-condicionado' },
      { src: `${BV}/apt-105/cozinha-apartamento-105-boa-viagem-cozinha-armario-geladeira-fogao-pia_opt.webp`, alt: 'Cozinha completa com geladeira e fogão' },
      { src: `${BV}/apt-105/banheiro-apartamento-105-boa-viagem-visao-ampla_opt.webp`, alt: 'Banheiro social com box de vidro' },
      { src: `${BV}/apt-105/area-externa-apartamento-105-boa-viagem-delikata-e-estacionamento-rotativo_opt.webp`, alt: 'Área externa do edifício Delikata em Boa Viagem' },
    ],
  },
  {
    id: '02',
    slug: 'flat-golden-view-1006',
    name: 'Flat Golden View 1006',
    neighborhood: 'Boa Viagem',
    neighborhoodSlug: 'boa-viagem',
    building: 'Golden View',
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
    reviewCount: 42,
    amenities: ['Wi-Fi', 'Piscina rooftop', 'Portaria 24h', 'Estacionamento', '1 quarto', 'Perto da praia'],
    images: [
      { src: `${BV}/apt-1006/sala-flat-1006-golden-view-sofa-tv-recife.webp`, alt: 'Sala mobiliada do Flat Golden View 1006' },
      { src: `${BV}/apt-1006/sala-mobiliada-flat-1006-golden-view-boa-viagem.webp`, alt: 'Sala com sofá e TV no Golden View' },
      { src: `${BV}/apt-1006/quarto-aconchegante-golden-view-boa-viagem.webp`, alt: 'Quarto aconchegante com ar-condicionado' },
      { src: `${BV}/apt-1006/cozinha-completa-golden-view-boa-viagem.webp`, alt: 'Cozinha completa do flat' },
      { src: `${BV}/apt-1006/piscina-no-roftop-vista-ampla-edf-golden-view-boa-viagem.avif`, alt: 'Piscina no rooftop com vista ampla' },
      { src: `${BV}/apt-1006/area-piscina-edf-golden-view-boa-viagem.webp`, alt: 'Área da piscina no Golden View' },
      { src: `${BV}/apt-1006/estacionamento-gratuito-incluso-golden-view-boa-viagem.webp`, alt: 'Estacionamento gratuito incluso' },
    ],
  },
  {
    id: '03',
    slug: 'studio-203-boa-viagem',
    name: 'Studio 203 Boa Viagem',
    neighborhood: 'Boa Viagem',
    neighborhoodSlug: 'boa-viagem',
    building: 'Boa Viagem',
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
    images: [
      { src: './assets/images/apartments/studio-203-01.jpg', alt: 'Studio 203 Boa Viagem' },
      { src: './assets/images/apartments/studio-203-02.jpg', alt: 'Cozinha compacta' },
    ],
  },
  {
    id: '04',
    slug: 'apartamento-804-pina',
    name: 'Apartamento 804 Pina',
    neighborhood: 'Pina',
    neighborhoodSlug: 'pina',
    building: 'Pina',
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
    images: [
      { src: './assets/images/apartments/pina-804-01.jpg', alt: 'Apartamento 804 Pina — sala' },
      { src: './assets/images/apartments/pina-804-02.jpg', alt: 'Quarto do apartamento' },
      { src: './assets/images/apartments/pina-804-03.jpg', alt: 'Vista do bairro Pina' },
    ],
  },
];

const PLACEHOLDER_BY_SLUG = {
  'studio-203-boa-viagem': [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80',
  ],
  'apartamento-804-pina': [
    'https://images.unsplash.com/photo-1567767292278-a4f21aabe24d?w=900&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80',
  ],
};

/** @param {Apartment} apt */
export function resolveImages(apt) {
  const placeholders = PLACEHOLDER_BY_SLUG[apt.slug] || [];
  const firstLocal = apt.images[0]?.src;
  return apt.images.map((img, i) => ({
    src: img.src,
    alt: img.alt,
    placeholder: placeholders[i] || placeholders[0] || firstLocal || FALLBACK_IMAGE,
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
