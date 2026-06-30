/**
 * Conteúdo estendido para páginas individuais de apartamento.
 * Complementa os dados em apartamentos.js (highlights, regras, SEO, etc.).
 *
 * Ícones de highlights/nearby/rules/safetyRules usam classes Font Awesome
 * (ex.: "fas fa-key") para bater com o template de referência.
 * amenityItems mantém emoji, igual ao template original.
 */

/** @typedef {{
 *   seoTitle: string,
 *   overviewTitle: string,
 *   overviewSubtitle: string,
 *   pricePerNight: number | null,
 *   cleaningFee: number,
 *   checkIn: string,
 *   checkOut: string,
 *   highlights: { icon: string, title: string, text: string }[],
 *   extendedDescription: string[],
 *   amenityItems: { icon: string, label: string }[],
 *   nearby: { icon: string, title: string, distance: string }[],
 *   rules: { icon: string, text: string, negative?: boolean }[],
 *   safetyRules: { icon: string, text: string }[],
 *   cancellation: string,
 *   ratingLabel: string,
 *   ratingCategories: { name: string, score: number }[],
 *   sampleReviews: { author: string, date: string, rating: number, text: string }[],
 * }} ApartmentDetailExtras */

/** @type {Record<string, ApartmentDetailExtras>} */
export const APARTMENT_DETAIL_EXTRAS = {
  'apartamento-2-quartos-boa-viagem': {
    seoTitle: 'Apartamento 2 Quartos Boa Viagem — 100m da Praia | Temporada Recife',
    overviewTitle: 'Apartamento completo em Boa Viagem',
    overviewSubtitle: '6 hóspedes · 2 quartos · 3 camas · 1 banheiro',
    pricePerNight: 350,
    cleaningFee: 100,
    checkIn: '15h00',
    checkOut: '11h00',
    highlights: [
      { icon: 'fas fa-key', title: 'Autoatendimento', text: 'Check-in independente com orientações claras — sem espera' },
      { icon: 'fas fa-map-marker-alt', title: 'Pé na areia', text: 'A cerca de 100 m da Praia de Boa Viagem' },
      { icon: 'fas fa-calendar-check', title: 'Check-in flexível', text: 'Horários adaptáveis conforme disponibilidade' },
      { icon: 'fas fa-shield-alt', title: 'Reserva direta', text: 'Fale conosco pelo WhatsApp — sem intermediários' },
    ],
    extendedDescription: [
      '<strong>Apartamento amplo em Boa Viagem</strong> para aluguel de temporada em Recife, ideal para famílias ou grupos de até 6 pessoas. Dois quartos, cozinha completa e Wi-Fi de alta velocidade.',
      'Localização prática: perto da orla, mercados, farmácias, restaurantes e do Shopping Recife. Excelente para <strong>férias, trabalho remoto e estadias médias</strong>.',
      'Pet friendly sob pedido. Estacionamento rotativo no condomínio. <strong>Reserva direta sem taxas de plataforma</strong> — atendimento humano do início ao check-out.',
    ],
    amenityItems: [
      { icon: '📶', label: 'WiFi 300Mbps' },
      { icon: '❄️', label: 'Ar-condicionado' },
      { icon: '🍳', label: 'Cozinha completa' },
      { icon: '📺', label: 'Smart TV' },
      { icon: '🅿️', label: 'Estacionamento rotativo' },
      { icon: '🐾', label: 'Pet friendly (sob pedido)' },
      { icon: '🌊', label: '100 m da praia' },
      { icon: '🔐', label: 'Portaria 24h' },
      { icon: '🧺', label: 'Máquina de lavar' },
      { icon: '🛁', label: 'Banheiro completo' },
      { icon: '🛏️', label: '2 quartos mobiliados' },
      { icon: '📏', label: '72 m²' },
    ],
    nearby: [
      { icon: 'fas fa-umbrella-beach', title: 'Praia de Boa Viagem', distance: '100 m · 2 min a pé' },
      { icon: 'fas fa-shopping-bag', title: 'Shopping Recife', distance: '800 m · 10 min a pé' },
      { icon: 'fas fa-plane', title: 'Aeroporto dos Guararapes', distance: '~8 min de carro' },
      { icon: 'fas fa-utensils', title: 'Restaurantes e cafés', distance: 'Na rua e entorno' },
      { icon: 'fas fa-hospital', title: 'Farmácias e mercados', distance: 'A poucos passos' },
    ],
    rules: [
      { icon: 'fas fa-clock', text: 'Check-in: a partir das 15h00' },
      { icon: 'fas fa-sign-out-alt', text: 'Check-out: até 11h00' },
      { icon: 'fas fa-users', text: 'Máximo de 6 hóspedes' },
      { icon: 'fas fa-smoking-ban', text: 'Não é permitido fumar', negative: true },
      { icon: 'fas fa-glass-cheers', text: 'Eventos e festas não permitidos', negative: true },
      { icon: 'fas fa-paw', text: 'Pets sob pedido e aprovação prévia' },
    ],
    safetyRules: [
      { icon: 'fas fa-shield-alt', text: 'Portaria e segurança no condomínio' },
      { icon: 'fas fa-fire-extinguisher', text: 'Detector de fumaça' },
      { icon: 'fas fa-first-aid', text: 'Kit de primeiros socorros sob solicitação' },
    ],
    cancellation: 'Cancelamento e reembolso conforme combinado na reserva. Entre em contato pelo WhatsApp para detalhes antes de fechar.',
    ratingLabel: 'Excepcional',
    ratingCategories: [
      { name: 'Limpeza', score: 4.9 },
      { name: 'Comunicação', score: 5.0 },
      { name: 'Check-in', score: 4.8 },
      { name: 'Exatidão', score: 4.9 },
      { name: 'Localização', score: 5.0 },
      { name: 'Custo-benefício', score: 4.9 },
    ],
    sampleReviews: [
      { author: 'Maria Silva', date: 'Janeiro 2026', rating: 5, text: 'Apartamento impecável e exatamente como nas fotos. Localização perfeita perto da praia. A anfitriã é super atenciosa. Voltaremos!' },
      { author: 'Carlos Eduardo', date: 'Dezembro 2025', rating: 5, text: 'Excelente custo-benefício. Espaçoso, bem equipado e muito limpo. Reserva direta valeu muito a pena, sem taxas extras.' },
      { author: 'Ana Paula', date: 'Novembro 2025', rating: 5, text: 'Ficamos uma semana e foi perfeito. Cozinha completa, Wi-Fi ótimo para trabalho remoto. Com certeza voltamos!' },
    ],
  },

  'flat-golden-view-1006': {
    seoTitle: 'Flat Golden View 1006 — Piscina Rooftop | Temporada Boa Viagem',
    overviewTitle: 'Flat com piscina na cobertura',
    overviewSubtitle: '3 hóspedes · 1 quarto · 2 camas · 1 banheiro',
    pricePerNight: 200,
    cleaningFee: 80,
    checkIn: '15h00',
    checkOut: '11h00',
    highlights: [
      { icon: 'fas fa-water', title: 'Piscina rooftop', text: 'Área de lazer na cobertura com vista da região' },
      { icon: 'fas fa-shield-alt', title: 'Portaria 24h', text: 'Condomínio com segurança e controle de acesso' },
      { icon: 'fas fa-map-marker-alt', title: 'Boa Viagem central', text: 'Perto da praia e do Shopping Recife' },
      { icon: 'fas fa-comments', title: 'Reserva direta', text: 'Negocie datas e valores direto pelo WhatsApp' },
    ],
    extendedDescription: [
      '<strong>Flat Golden View 1006</strong> — unidade compacta e funcional, muito procurada por quem quer praticidade em Boa Viagem com estrutura de condomínio.',
      'Piscina na cobertura, portaria 24h e estacionamento. Ideal para casais ou pequenos grupos que valorizam <strong>localização e comodidades</strong>.',
      'Wi-Fi incluso, cozinha equipada e ambiente climatizado. <strong>Reserva direta</strong> com atendimento rápido para disponibilidade e check-in.',
    ],
    amenityItems: [
      { icon: '📶', label: 'WiFi 300Mbps' },
      { icon: '🏊', label: 'Piscina rooftop' },
      { icon: '❄️', label: 'Ar-condicionado' },
      { icon: '🍳', label: 'Cozinha equipada' },
      { icon: '🅿️', label: 'Estacionamento' },
      { icon: '🔐', label: 'Portaria 24h' },
      { icon: '🌊', label: 'Perto da praia' },
      { icon: '🛏️', label: '1 quarto' },
      { icon: '📏', label: '42 m²' },
    ],
    nearby: [
      { icon: 'fas fa-umbrella-beach', title: 'Praia de Boa Viagem', distance: '~200 m' },
      { icon: 'fas fa-shopping-bag', title: 'Shopping Recife', distance: '5 min a pé' },
      { icon: 'fas fa-plane', title: 'Aeroporto', distance: '~8 min de carro' },
      { icon: 'fas fa-utensils', title: 'Restaurantes', distance: 'Variedade no bairro' },
    ],
    rules: [
      { icon: 'fas fa-clock', text: 'Check-in: a partir das 15h00' },
      { icon: 'fas fa-sign-out-alt', text: 'Check-out: até 11h00' },
      { icon: 'fas fa-users', text: 'Máximo de 3 hóspedes' },
      { icon: 'fas fa-smoking-ban', text: 'Não é permitido fumar', negative: true },
      { icon: 'fas fa-paw', text: 'Pets não permitidos', negative: true },
    ],
    safetyRules: [
      { icon: 'fas fa-shield-alt', text: 'Segurança 24h no condomínio' },
      { icon: 'fas fa-fire-extinguisher', text: 'Detector de fumaça' },
    ],
    cancellation: 'Política de cancelamento informada antes da confirmação. Fale conosco pelo WhatsApp.',
    ratingLabel: 'Excepcional',
    ratingCategories: [
      { name: 'Limpeza', score: 4.9 },
      { name: 'Comunicação', score: 5.0 },
      { name: 'Check-in', score: 4.8 },
      { name: 'Localização', score: 5.0 },
      { name: 'Custo-benefício', score: 4.9 },
    ],
    sampleReviews: [
      { author: 'Ricardo M.', date: 'Fevereiro 2026', rating: 5, text: 'Flat muito bem localizado. Piscina na cobertura é um diferencial. Check-in tranquilo e apartamento conforme anunciado.' },
      { author: 'Juliana F.', date: 'Janeiro 2026', rating: 5, text: 'Perfeito para casal. Limpo, funcional e perto de tudo. Recomendo a reserva direta.' },
    ],
  },

  'studio-203-boa-viagem': {
    seoTitle: 'Studio 203 Boa Viagem — Ideal Casal | Temporada Recife',
    overviewTitle: 'Studio compacto em Boa Viagem',
    overviewSubtitle: '2 hóspedes · 1 quarto · 1 cama · 1 banheiro',
    pricePerNight: null,
    cleaningFee: 0,
    checkIn: '15h00',
    checkOut: '11h00',
    highlights: [
      { icon: 'fas fa-heart', title: 'Ideal para casal', text: 'Layout inteligente para 1 ou 2 hóspedes' },
      { icon: 'fas fa-plane', title: 'Acesso rápido', text: 'Perto da praia e com boa ligação ao aeroporto' },
      { icon: 'fas fa-moon', title: 'Ambiente tranquilo', text: 'Silêncio entre 22h e 7h' },
      { icon: 'fas fa-comments', title: 'Consulte valores', text: 'Disponibilidade e preço sob consulta no WhatsApp' },
    ],
    extendedDescription: [
      '<strong>Studio 203</strong> em Boa Viagem — opção enxuta e bem localizada para casais ou viagens curtas a trabalho.',
      'Wi-Fi, cozinha e ambiente climatizado. Pets sob pedido. Check-in entre 15h e 22h; check-out entre 9h e 11h.',
      'Consulte disponibilidade e condições para suas datas. <strong>Atendimento direto</strong> sem taxas de plataforma.',
    ],
    amenityItems: [
      { icon: '📶', label: 'WiFi' },
      { icon: '❄️', label: 'Ar-condicionado' },
      { icon: '🍳', label: 'Cozinha' },
      { icon: '🌊', label: 'Perto da praia' },
      { icon: '🐾', label: 'Pet sob pedido' },
      { icon: '🛏️', label: '1 quarto studio' },
      { icon: '📏', label: '35 m²' },
    ],
    nearby: [
      { icon: 'fas fa-umbrella-beach', title: 'Praia de Boa Viagem', distance: 'Poucos minutos a pé' },
      { icon: 'fas fa-plane', title: 'Aeroporto', distance: 'Acesso rápido' },
      { icon: 'fas fa-store', title: 'Comércio local', distance: 'Mercados e farmácias próximos' },
    ],
    rules: [
      { icon: 'fas fa-clock', text: 'Check-in: 15h às 22h' },
      { icon: 'fas fa-sign-out-alt', text: 'Check-out: 9h às 11h' },
      { icon: 'fas fa-users', text: 'Máximo de 2 hóspedes' },
      { icon: 'fas fa-volume-mute', text: 'Silêncio: 22h às 7h' },
      { icon: 'fas fa-paw', text: 'Pets sob pedido' },
    ],
    safetyRules: [
      { icon: 'fas fa-shield-alt', text: 'Condomínio com controle de acesso' },
    ],
    cancellation: 'Condições informadas na cotação. Entre em contato para detalhes.',
    ratingLabel: 'Muito bem avaliado',
    ratingCategories: [
      { name: 'Limpeza', score: 4.8 },
      { name: 'Comunicação', score: 4.9 },
      { name: 'Localização', score: 4.9 },
      { name: 'Custo-benefício', score: 4.8 },
    ],
    sampleReviews: [],
  },

  'apartamento-804-pina': {
    seoTitle: 'Apartamento 804 Pina — Piscina | Ao Lado do RioMar | Temporada Recife',
    overviewTitle: 'Apartamento completo no Pina',
    overviewSubtitle: '5 hóspedes · 2 quartos · 3 camas · 1 banheiro',
    pricePerNight: null,
    cleaningFee: 100,
    checkIn: '15h00',
    checkOut: '11h00',
    highlights: [
      { icon: 'fas fa-shopping-bag', title: 'Ao lado do RioMar', text: 'Shopping, cinema e serviços a poucos passos' },
      { icon: 'fas fa-water', title: 'Piscina no condomínio', text: 'Área de lazer para toda a família' },
      { icon: 'fas fa-square-parking', title: 'Garagem', text: 'Vaga de estacionamento inclusa' },
      { icon: 'fas fa-comments', title: 'Reserva direta', text: 'Sem taxas de intermediário — fale conosco' },
    ],
    extendedDescription: [
      '<strong>Apartamento 804 no Pina</strong> para temporada em Recife — 2 quartos, piscina, Wi-Fi e garagem. Localização estratégica ao lado do RioMar Shopping.',
      'Ideal para famílias e estadias médias. Check-in 15h–22h, check-out 9h–11h. Pets permitidos com possível taxa.',
      'Próximo à orla, feirinha de artesanato e vias principais. <strong>Consulte valores e disponibilidade</strong> pelo WhatsApp.',
    ],
    amenityItems: [
      { icon: '📶', label: 'WiFi 300Mbps' },
      { icon: '🏊', label: 'Piscina' },
      { icon: '❄️', label: 'Ar-condicionado' },
      { icon: '🍳', label: 'Cozinha completa' },
      { icon: '🅿️', label: 'Garagem' },
      { icon: '🐾', label: 'Pets (possível taxa)' },
      { icon: '🛍️', label: 'Ao lado do RioMar' },
      { icon: '🌊', label: 'Perto da praia' },
      { icon: '🛏️', label: '2 quartos' },
      { icon: '📏', label: '68 m²' },
    ],
    nearby: [
      { icon: 'fas fa-shopping-bag', title: 'RioMar Shopping', distance: '50 m · ao lado' },
      { icon: 'fas fa-umbrella-beach', title: 'Praia de Pina / Boa Viagem', distance: '~100 m' },
      { icon: 'fas fa-plane', title: 'Aeroporto Internacional', distance: '~8 min de carro' },
      { icon: 'fas fa-utensils', title: 'Restaurantes e bares', distance: 'No entorno' },
      { icon: 'fas fa-hospital', title: 'Farmácia e serviços', distance: '500 m' },
    ],
    rules: [
      { icon: 'fas fa-clock', text: 'Check-in: 15h às 22h' },
      { icon: 'fas fa-sign-out-alt', text: 'Check-out: 9h às 11h' },
      { icon: 'fas fa-users', text: 'Máximo de 5 hóspedes' },
      { icon: 'fas fa-smoking-ban', text: 'Não é permitido fumar', negative: true },
      { icon: 'fas fa-glass-cheers', text: 'Festas não permitidas', negative: true },
      { icon: 'fas fa-paw', text: 'Pets permitidos com possível taxa' },
    ],
    safetyRules: [
      { icon: 'fas fa-shield-alt', text: 'Segurança 24h no condomínio' },
      { icon: 'fas fa-fire-extinguisher', text: 'Detector de fumaça' },
      { icon: 'fas fa-first-aid', text: 'Kit de primeiros socorros' },
    ],
    cancellation: 'Cancelamento gratuito até 5 dias antes do check-in, quando aplicável. Confirme condições no WhatsApp.',
    ratingLabel: 'Muito bem avaliado',
    ratingCategories: [
      { name: 'Limpeza', score: 4.8 },
      { name: 'Comunicação', score: 4.9 },
      { name: 'Check-in', score: 4.8 },
      { name: 'Localização', score: 5.0 },
      { name: 'Custo-benefício', score: 4.8 },
    ],
    sampleReviews: [
      { author: 'Fernanda L.', date: 'Janeiro 2026', rating: 5, text: 'Localização imbatível ao lado do RioMar. Apartamento espaçoso e bem equipado. Piscina ótima para as crianças.' },
    ],
  },
};

/** @param {string} slug */
export function getApartmentDetailExtras(slug) {
  return APARTMENT_DETAIL_EXTRAS[slug] || null;
}
