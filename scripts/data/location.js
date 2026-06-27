/**
 * Dados de localização — Recife Flats Temporada
 * Reaproveitados do site atual (recifeflatstemporada.com) + Google Business Profile.
 */

export const BUSINESS = {
  name: 'Recife Flats Temporada',
  streetAddress: 'Av. Eng. Domingos Ferreira, 2041',
  neighborhood: 'Boa Viagem',
  city: 'Recife',
  state: 'PE',
  postalCode: '51111-020',
  country: 'BR',
  phone: '+5581996601178',
  phoneDisplay: '+55 (81) 99660-1178',
  whatsapp: '5581996601178',
  email: 'contato@recifeflats.com.br',
  website: 'https://recifeflatstemporada.com',
  lat: -8.1075708,
  lng: -34.890327,
};

/** @param {string} [text] */
export function whatsappUrl(text = '') {
  const digits = BUSINESS.whatsapp.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Embed oficial do Google Maps (Google Business Profile) */
export const MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d15800.718138107459!2d-34.89551885!3d-8.08316525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x7ab1f002a2cf031%3A0xbd7a3f8421cc6d7f!2sRecife%20Flats%20Temporada%2C%20Av.%20Eng.%20Domingos%20Ferreira%2C%202041%20-%202041%20-%20Boa%20Viagem%2C%20Recife%20-%20PE%2C%2051111-020!3m2!1d-8.1075708!2d-34.890327!5e0!3m2!1spt-BR!2sbr!4v1782567333714!5m2!1spt-BR!2sbr';

export const MAPS_LINKS = {
  place: 'https://www.google.com/maps/place/Recife+Flats+Temporada/@-8.1075708,-34.890327,17z/data=!3m1!4b1!4m6!3m5!1s0x7ab1f002a2cf031:0xbd7a3f8421cc6d7f!8m2!3d-8.1075708!4d-34.890327',
  directions:
    'https://www.google.com/maps/dir/?api=1&destination=Recife+Flats+Temporada,Av.+Eng.+Domingos+Ferreira,+2041,+Boa+Viagem,+Recife,+PE,+51111-020&travelmode=driving',
  reviews:
    'https://www.google.com/maps/place/Recife+Flats+Temporada/@-8.1075708,-34.890327,17z/data=!4m8!3m7!1s0x7ab1f002a2cf031:0xbd7a3f8421cc6d7f!8m2!3d-8.1075708!4d-34.890327!9m1!1b1',
  profile: 'https://www.google.com/maps/place/Recife+Flats+Temporada/@-8.1075708,-34.890327,17z/data=!3m1!4b1!4m6!3m5!1s0x7ab1f002a2cf031:0xbd7a3f8421cc6d7f!8m2!3d-8.1075708!4d-34.890327',
};

export const LOCATION_BENEFITS = [
  {
    id: 'boa-viagem',
    title: 'Boa Viagem',
    description: 'Ideal para quem quer praia, padarias, restaurantes e rotina resolvida a pé.',
    items: [
      '100 m a 200 m da orla em unidades selecionadas',
      'Mercados, farmácias e cafés por perto',
      'Ótima base para casal, família ou trabalho remoto',
    ],
  },
  {
    id: 'pina',
    title: 'Pina',
    description: 'Região estratégica perto do RioMar, do polo empresarial e do acesso ao centro.',
    items: [
      'Ao lado do RioMar Shopping',
      'Boa conexão com vias principais',
      'Excelente para estadias médias e longas',
    ],
  },
  {
    id: 'pratico',
    title: 'Vantagem prática',
    description: 'Você economiza tempo de deslocamento e fica perto do que realmente usa na viagem.',
    items: [
      '~8 min do aeroporto em rotas favoráveis',
      '~2 min da praia em unidades selecionadas',
      'Suporte por WhatsApp durante a estadia',
    ],
  },
];

/** Fallback quando a Places API não está configurada */
export const FALLBACK_REVIEWS = {
  rating: 4.9,
  userRatingCount: 42,
  source: 'Google',
  reviews: [],
};
