/**
 * Dados dos 4 apartamentos — troque as imagens em assets/images/apartments/
 * Mantemos URLs de placeholder (Unsplash) até as fotos reais estarem no projeto.
 */

export const FALLBACK_IMAGE = './assets/images/boa_viagem-01.avif.png';

/** @typedef {{ src: string, alt: string }} ApartmentImage */
/** @typedef {{
 *   id: string,
 *   slug: string,
 *   name: string,
 *   neighborhood: string,
 *   tagline: string,
 *   description: string,
 *   beds: number,
 *   bedrooms: number,
 *   guests: number,
 *   bathrooms: number,
 *   parking: boolean,
 *   size: string,
 *   amenities: string[],
 *   images: ApartmentImage[],
 * }} Apartment */

/** @type {Apartment[]} */
export const APARTAMENTOS = [
  {
    id: '01',
    slug: 'boa-viagem-201',
    name: 'Apto Boa Viagem 201',
    neighborhood: 'Boa Viagem',
    tagline: 'Ideal para famílias — perto da praia',
    description:
      'Apartamento amplo e bem ventilado, mobiliado com o essencial para o dia a dia. Sala integrada à cozinha, varanda com vista parcial do bairro e quartos confortáveis para descansar depois da praia.',
    beds: 3,
    bedrooms: 2,
    guests: 6,
    bathrooms: 2,
    parking: true,
    size: '72 m²',
    amenities: ['Wi-Fi', 'Ar-condicionado', 'Cozinha equipada', 'TV', 'Varanda'],
    images: [
      { src: './assets/images/apartments/boa-viagem-201-01.jpg', alt: 'Sala de estar do apartamento Boa Viagem 201' },
      { src: './assets/images/apartments/boa-viagem-201-02.jpg', alt: 'Quarto principal' },
      { src: './assets/images/apartments/boa-viagem-201-03.jpg', alt: 'Cozinha equipada' },
      { src: './assets/images/apartments/boa-viagem-201-04.jpg', alt: 'Varanda com vista do bairro' },
    ],
  },
  {
    id: '02',
    slug: 'pina-vista-mar',
    name: 'Apto Pina Vista Mar',
    neighborhood: 'Pina',
    tagline: 'Casal ou pequena família — praticidade e localização',
    description:
      'Unidade compacta e funcional, a poucos minutos da orla. Perfeita para quem quer praticidade sem abrir mão de conforto: cama de casal, sofá-cama na sala e cozinha completa para refeições rápidas.',
    beds: 2,
    bedrooms: 1,
    guests: 4,
    bathrooms: 1,
    parking: false,
    size: '48 m²',
    amenities: ['Wi-Fi', 'Ar-condicionado', 'Cozinha equipada', 'TV', 'Próximo à praia'],
    images: [
      { src: './assets/images/apartments/pina-vista-01.jpg', alt: 'Sala integrada do apartamento Pina' },
      { src: './assets/images/apartments/pina-vista-02.jpg', alt: 'Quarto com cama de casal' },
      { src: './assets/images/apartments/pina-vista-03.jpg', alt: 'Banheiro social' },
    ],
  },
  {
    id: '03',
    slug: 'espinheiro-centro',
    name: 'Apto Espinheiro Centro',
    neighborhood: 'Espinheiro',
    tagline: 'Grupo de amigos — no coração da cidade',
    description:
      'Apartamento em bairro tradicional, com fácil acesso a restaurantes, mercados e transporte. Dois quartos bem distribuídos, ideal para grupos que querem explorar Recife com autonomia.',
    beds: 4,
    bedrooms: 2,
    guests: 5,
    bathrooms: 1,
    parking: false,
    size: '65 m²',
    amenities: ['Wi-Fi', 'Ventilador', 'Cozinha equipada', 'TV', 'Área de serviço'],
    images: [
      { src: './assets/images/apartments/espinheiro-01.jpg', alt: 'Sala do apartamento Espinheiro' },
      { src: './assets/images/apartments/espinheiro-02.jpg', alt: 'Segundo quarto com beliches' },
      { src: './assets/images/apartments/espinheiro-03.jpg', alt: 'Cozinha e área de serviço' },
      { src: './assets/images/apartments/espinheiro-04.jpg', alt: 'Fachada do prédio' },
    ],
  },
  {
    id: '04',
    slug: 'boa-viagem-405',
    name: 'Apto Boa Viagem 405',
    neighborhood: 'Boa Viagem',
    tagline: 'Família grande — espaço e vaga de garagem',
    description:
      'Nossa unidade mais espaçosa: três quartos, sala ampla e vaga de garagem inclusa. Ótima opção para famílias numerosas ou duas famílias viajando juntas, com conforto para todos.',
    beds: 5,
    bedrooms: 3,
    guests: 8,
    bathrooms: 2,
    parking: true,
    size: '95 m²',
    amenities: ['Wi-Fi', 'Ar-condicionado', 'Cozinha equipada', 'TV', 'Garagem', 'Varanda'],
    images: [
      { src: './assets/images/apartments/boa-viagem-405-01.jpg', alt: 'Sala ampla do apartamento 405' },
      { src: './assets/images/apartments/boa-viagem-405-02.jpg', alt: 'Suíte master' },
      { src: './assets/images/apartments/boa-viagem-405-03.jpg', alt: 'Segundo quarto' },
      { src: './assets/images/apartments/boa-viagem-405-04.jpg', alt: 'Terceiro quarto' },
      { src: './assets/images/apartments/boa-viagem-405-05.jpg', alt: 'Varanda e vista' },
    ],
  },
];

/** Placeholders visuais até as fotos locais existirem */
const PLACEHOLDER_BY_SLUG = {
  'boa-viagem-201': [
    'https://images.unsplash.com/photo-1522708323590-24dffb6222e9?w=900&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80',
    'https://images.unsplash.com/photo-1556912173-46c336c0fd55?w=900&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80',
  ],
  'pina-vista-mar': [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=80',
  ],
  'espinheiro-centro': [
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80',
  ],
  'boa-viagem-405': [
    'https://images.unsplash.com/photo-1567767292278-a4f21aabe24d?w=900&q=80',
    'https://images.unsplash.com/photo-1616137467421-90a0f4e4b992?w=900&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded39a2c7?w=900&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80',
  ],
};

/**
 * Resolve src da imagem: usa local se existir, senão placeholder Unsplash.
 * @param {Apartment} apt
 * @returns {ApartmentImage[]}
 */
export function resolveImages(apt) {
  const placeholders = PLACEHOLDER_BY_SLUG[apt.slug] || [];
  return apt.images.map((img, i) => ({
    src: img.src,
    alt: img.alt,
    placeholder: placeholders[i] || placeholders[0] || FALLBACK_IMAGE,
  }));
}

/** @param {string} slug */
export function getApartmentBySlug(slug) {
  return APARTAMENTOS.find((a) => a.slug === slug) || null;
}
