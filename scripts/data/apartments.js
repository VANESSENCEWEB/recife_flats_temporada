/**
 * apartments.js — Fonte única de verdade dos apartamentos.
 *
 * Sem backend: os dados vivem aqui. Toda página (listagem, individual,
 * matching) lê deste módulo, evitando repetir HTML/estado por apartamento.
 *
 * Cada apartamento tem:
 *   id        : slug único (usado em apartamento.html?id=<id>)
 *   name      : nome comercial
 *   location  : bairro
 *   theme     : chave de gradiente/acento (ocean | accent | sun | clay)
 *   guests    : capacidade máxima de hóspedes
 *   bedrooms  : quartos
 *   bathrooms : banheiros
 *   area      : metros quadrados
 *   priceFrom : diária a partir de (R$)
 *   rating    : nota média
 *   image     : foto real (opcional — cai no gradiente do tema se ausente)
 *   summary   : uma linha para o card
 *   description : parágrafo(s) para a página individual
 *   features  : lista de comodidades
 *   blocked   : períodos indisponíveis [ [inicioISO, fimISO], ... ]
 */

export const WHATSAPP = '558196601178';

export const APARTMENTS = [
  {
    id: 'vista-mar-boa-viagem',
    name: 'Vista Mar Boa Viagem',
    location: 'Boa Viagem',
    theme: 'ocean',
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    area: 78,
    priceFrom: 320,
    rating: 4.9,
    image: './assets/images/boa_viagem-01.avif.png',
    summary: 'Dois quartos a 80 m da areia, varanda com vista aberta para o mar.',
    description:
      'Um flat leve e arejado na quadra da praia de Boa Viagem. A sala se abre para a varanda com vista para o mar, cozinha equipada e dois quartos confortáveis — ideal para famílias ou dois casais que querem acordar com o som das ondas.',
    features: [
      'Wi-Fi 300 Mbps',
      'Ar-condicionado nos quartos',
      'Cozinha equipada',
      'Varanda com vista mar',
      'Piscina no prédio',
      'Portaria 24h',
    ],
    blocked: [
      ['2026-12-20', '2027-01-05'],
      ['2026-08-10', '2026-08-18'],
    ],
  },
  {
    id: 'studio-pina',
    name: 'Studio Pina Sunrise',
    location: 'Pina',
    theme: 'accent',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    area: 42,
    priceFrom: 210,
    rating: 4.8,
    image: '',
    summary: 'Studio integrado, perfeito para casais, a passos do Pina e do Riomar.',
    description:
      'Compacto e inteligente: um studio integrado com cama queen, kitchenette completa e uma janela generosa que enche o ambiente de luz. A localização no Pina coloca você a poucos minutos do calçadão, restaurantes e do shopping Riomar.',
    features: [
      'Wi-Fi 200 Mbps',
      'Ar-condicionado',
      'Kitchenette completa',
      'Smart TV',
      'Academia no prédio',
      'Check-in autônomo',
    ],
    blocked: [
      ['2026-12-20', '2027-01-05'],
    ],
  },
  {
    id: 'cobertura-sunset',
    name: 'Cobertura Sunset',
    location: 'Boa Viagem',
    theme: 'sun',
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    area: 140,
    priceFrom: 520,
    rating: 5.0,
    image: '',
    summary: 'Cobertura de três suítes com terraço, ofurô e o melhor pôr do sol de Recife.',
    description:
      'Nosso endereço mais amplo: três suítes, living em pé-direito duplo e um terraço privativo com ofurô voltado para o horizonte. Feita para grupos e famílias que querem espaço de sobra sem abrir mão do requinte à beira-mar.',
    features: [
      'Wi-Fi 500 Mbps',
      'Três suítes climatizadas',
      'Terraço com ofurô',
      'Cozinha gourmet',
      'Vaga para 2 carros',
      'Portaria 24h',
    ],
    blocked: [
      ['2026-12-20', '2027-01-05'],
      ['2026-09-05', '2026-09-15'],
    ],
  },
  {
    id: 'garden-flat-pina',
    name: 'Garden Flat Pina',
    location: 'Pina',
    theme: 'clay',
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    priceFrom: 360,
    rating: 4.9,
    image: '',
    summary: 'Térreo com jardim privativo e churrasqueira, dois quartos e muito verde.',
    description:
      'Um flat garden raro no Pina: área externa privativa com jardim e churrasqueira, dois quartos amplos e uma sala que se estende para fora. Perfeito para quem quer o clima de casa com a praticidade de um flat de temporada.',
    features: [
      'Wi-Fi 300 Mbps',
      'Jardim privativo',
      'Churrasqueira',
      'Ar-condicionado',
      'Pet friendly',
      'Portaria 24h',
    ],
    blocked: [
      ['2026-12-20', '2027-01-05'],
    ],
  },
];

/** Retorna um apartamento pelo id, ou undefined. */
export function getApartment(id) {
  return APARTMENTS.find((a) => a.id === id);
}

/**
 * Lê os parâmetros de busca da URL atual.
 * @returns {{ checkin: string, checkout: string, guests: number }}
 */
export function readSearchParams() {
  const p = new URLSearchParams(window.location.search);
  const guestsRaw = parseInt(p.get('guests'), 10);
  return {
    checkin: p.get('checkin') || '',
    checkout: p.get('checkout') || '',
    guests: Number.isFinite(guestsRaw) && guestsRaw > 0 ? guestsRaw : 0,
  };
}

/** Serializa os parâmetros de busca (ignora vazios) numa query string. */
export function buildSearchQuery({ checkin, checkout, guests } = {}) {
  const p = new URLSearchParams();
  if (checkin) p.set('checkin', checkin);
  if (checkout) p.set('checkout', checkout);
  if (guests) p.set('guests', String(guests));
  const s = p.toString();
  return s ? `?${s}` : '';
}

/**
 * Dois intervalos [aStart, aEnd) e [bStart, bEnd) se sobrepõem?
 * Datas em formato ISO (YYYY-MM-DD) comparam corretamente como string.
 */
function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * O apartamento está livre no período pedido?
 * Sem datas => considera livre (usuário só está navegando).
 */
export function isAvailable(apt, checkin, checkout) {
  if (!checkin || !checkout) return true;
  if (checkout <= checkin) return true;
  return !apt.blocked.some(([bStart, bEnd]) =>
    rangesOverlap(checkin, checkout, bStart, bEnd)
  );
}

/** Cabe o número de hóspedes pedido? Sem valor => sim. */
export function fitsGuests(apt, guests) {
  if (!guests) return true;
  return apt.guests >= guests;
}

/**
 * O apartamento atende à busca (datas livres E capacidade)?
 */
export function matchesSearch(apt, { checkin, checkout, guests } = {}) {
  return isAvailable(apt, checkin, checkout) && fitsGuests(apt, guests);
}

/** Formata R$ sem centavos. */
export function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

/** Formata "2026-06-27" -> "27 jun". Vazio => ''. */
export function formatDateShort(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${String(d).padStart(2, '0')} ${months[(m - 1) % 12]}`;
}
