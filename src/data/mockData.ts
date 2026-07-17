import { MartialArt, Tournament, Athlete, Academy, News, Document } from '../types';

export const INITIAL_MARTIAL_ARTS: MartialArt[] = [
  {
    id: 'bjj',
    name: 'Jiu-Jitsu Brasileiro (BJJ)',
    description: 'Arte marcial focada no combate no solo, utilizando técnicas de imobilização, chaves e estrangulamentos para submeter o oponente sem desferir golpes.',
    category: 'Grappling',
    origin: 'Brasil / Rio de Janeiro',
    icon: 'Shield',
    departmentHead: 'Mestre Robson Albuquerque (Faixa Coral 7º Grau)',
    majorCompetitions: ['Estadual de Jiu-Jitsu FEAMCRJ', 'Copa Carioca de BJJ', 'Desafio das Equipes']
  },
  {
    id: 'kickboxing',
    name: 'Kickboxing',
    description: 'Esporte de combate em pé que combina técnicas de socos do boxe tradicional com chutes potentes de diversas artes marciais.',
    category: 'Percussão',
    origin: 'Japão / EUA',
    icon: 'Swords',
    departmentHead: 'Mestre Alexandre "Caveira" Silva',
    majorCompetitions: ['Grand Prix de Kickboxing RJ', 'Taça Guanabara de Combate', 'Estadual FEAMCRJ']
  },
  {
    id: 'muaythai',
    name: 'Muay Thai',
    description: 'Conhecido como a "Arte das Oito Armas", utiliza socos, chutes, joelhadas, cotoveladas e técnicas de clinche em combates altamente dinâmicos.',
    category: 'Percussão',
    origin: 'Tailândia',
    icon: 'Flame',
    departmentHead: 'Kru-Yai Wellington Santos',
    majorCompetitions: ['Cinturão de Ouro Muay Thai RJ', 'Copa Rio de Combate', 'Estadual de Muay Thai']
  },
  {
    id: 'karate',
    name: 'Karate-Do',
    description: 'Arte marcial tradicional focada em golpes de impacto como socos, chutes e golpes com a mão aberta, valorizando a disciplina, precisão e autodefesa.',
    category: 'Tradicional',
    origin: 'Japão (Okinawa)',
    icon: 'Zap',
    departmentHead: 'Sensei Yasutaka Kimura (5º Dan)',
    majorCompetitions: ['Campeonato Metropolitano de Karate', 'Copa Katsura', 'Estadual FEAMCRJ Kumite']
  },
  {
    id: 'taekwondo',
    name: 'Taekwondo',
    description: 'Arte marcial olímpica de origem coreana, caracterizada pelo uso predominante de chutes aéreos, giros e técnicas de alta velocidade.',
    category: 'Tradicional',
    origin: 'Coreia do Sul',
    icon: 'Trophy',
    departmentHead: 'Grão-Mestre Kim Jung-Woo (8º Dan)',
    majorCompetitions: ['Carioca de Taekwondo Seletivas', 'Festival de Taekwondo RJ', 'Estadual FEAMCRJ Kyorugui']
  },
  {
    id: 'mma',
    name: 'Artes Marciais Mistas (MMA)',
    description: 'Modalidade de combate que permite o uso de uma ampla variedade de técnicas de luta em pé e de solo, combinando diferentes artes marciais.',
    category: 'Mista',
    origin: 'Mundial (Inspirado no Vale-Tudo Carioca)',
    icon: 'Activity',
    departmentHead: 'Treinador Vinicius "Tubarão" Ramos',
    majorCompetitions: ['Estadual de MMA Amador', 'Cinturão FEAMCRJ de MMA', 'Desafio Arena de Combate']
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    title: 'Campeonato Estadual de Jiu-Jitsu FEAMCRJ 2026',
    date: '2026-08-15',
    location: 'Arena Carioca 1 - Parque Olímpico',
    city: 'Rio de Janeiro - RJ',
    registrationDeadline: '2026-08-10',
    entryFee: 120,
    status: 'open',
    modalities: ['Jiu-Jitsu Brasileiro (BJJ)'],
    registeredCount: 428,
    description: 'O maior torneio estadual de Jiu-Jitsu do Rio de Janeiro. Categorias do mirim ao master, faixas branca a preta. Medalhas exclusivas e premiação em dinheiro para os campeões do absoluto.',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 't2',
    title: 'Copa Carioca de Kickboxing e Muay Thai',
    date: '2026-09-05',
    location: 'Ginásio Caio Martins',
    city: 'Niterói - RJ',
    registrationDeadline: '2026-08-30',
    entryFee: 90,
    status: 'open',
    modalities: ['Kickboxing', 'Muay Thai'],
    registeredCount: 184,
    description: 'Espectáculo de trocas de golpes em pé de alta intensidade! Regras de K1 Rules e Low Kicks para Kickboxing, e regras tradicionais para Muay Thai. Excelente estrutura com 3 ringues simultâneos.',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 't3',
    title: 'Festival Estadual de Karate e Taekwondo',
    date: '2026-10-12',
    location: 'Ginásio do Tijuca Tênis Clube',
    city: 'Rio de Janeiro - RJ',
    registrationDeadline: '2026-10-05',
    entryFee: 80,
    status: 'upcoming',
    modalities: ['Karate-Do', 'Taekwondo'],
    registeredCount: 0,
    description: 'Focado na tradição e na precisão olímpica. Competições de Kata/Poomsae (formas) e Kumite/Kyorugui (combates). Arbitragem eletrônica e tatames oficiais olímpicos.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 't4',
    title: 'GP FEAMCRJ de Artes Marciais Mistas Amadoras',
    date: '2026-06-20',
    location: 'Centro de Treinamento FEAMCRJ',
    city: 'Rio de Janeiro (Tijuca) - RJ',
    registrationDeadline: '2026-06-15',
    entryFee: 150,
    status: 'closed',
    modalities: ['Artes Marciais Mistas (MMA)'],
    registeredCount: 48,
    description: 'O trampolim oficial para o MMA Profissional nacional. Combates amadores totalmente seguros, com uso de protetor de canela e luvas especiais de 7oz. Supervisão médica completa.',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop'
  }
];

export const INITIAL_ATHLETES: Athlete[] = [
  {
    id: 'ath-1',
    name: 'Carlos Henrique Gracie Silva',
    cpf: '123.456.789-01',
    dateOfBirth: '1995-04-12',
    gender: 'M',
    email: 'carlos.gracie@gmail.com',
    phone: '(21) 98765-4321',
    rank: 'Faixa Preta 2º Grau',
    modality: 'Jiu-Jitsu Brasileiro (BJJ)',
    academyName: 'Alliance Jiu-Jitsu Copacabana',
    registrationNumber: 'FEAM-2021-0043',
    status: 'active',
    affiliationDate: '2021-02-15'
  },
  {
    id: 'ath-2',
    name: 'Mariana Mendonça de Souza',
    cpf: '987.654.321-09',
    dateOfBirth: '2001-08-23',
    gender: 'F',
    email: 'mari.kick@outlook.com',
    phone: '(21) 99234-5678',
    rank: 'Faixa Preta 1º Dan',
    modality: 'Kickboxing',
    academyName: 'Combat Team Tijuca',
    registrationNumber: 'FEAM-2023-0189',
    status: 'active',
    affiliationDate: '2023-05-10'
  },
  {
    id: 'ath-3',
    name: 'Roberto "Trovão" Mendes',
    cpf: '456.789.123-45',
    dateOfBirth: '1992-11-02',
    gender: 'M',
    email: 'trovao.muaythai@yahoo.com',
    phone: '(21) 97111-2233',
    rank: 'Grau Preto (Instrutor Master)',
    modality: 'Muay Thai',
    academyName: 'Niterói Fight Center',
    registrationNumber: 'FEAM-2020-0012',
    status: 'active',
    affiliationDate: '2020-01-20'
  },
  {
    id: 'ath-4',
    name: 'Ana Júlia de Oliveira',
    cpf: '321.654.987-12',
    dateOfBirth: '2005-01-30',
    gender: 'F',
    email: 'anaju.tkd@gmail.com',
    phone: '(21) 98122-3344',
    rank: 'Faixa Vermelha Ponta Preta',
    modality: 'Taekwondo',
    academyName: 'Associação ShotoKan Barra',
    registrationNumber: 'FEAM-2025-0512',
    status: 'active',
    affiliationDate: '2025-03-12'
  },
  {
    id: 'ath-5',
    name: 'Gabriel "Ciclone" Medeiros',
    cpf: '234.567.890-12',
    dateOfBirth: '1998-07-15',
    gender: 'M',
    email: 'gabriel.ciclone@gmail.com',
    phone: '(21) 99888-7766',
    rank: 'Faixa Marrom',
    modality: 'Jiu-Jitsu Brasileiro (BJJ)',
    academyName: 'Gracie Barra Jardim Oceânico',
    registrationNumber: 'FEAM-2024-0094',
    status: 'pending',
    affiliationDate: '2024-11-01'
  }
];

export const INITIAL_ACADEMIES: Academy[] = [
  {
    id: 'acad-1',
    name: 'Alliance Jiu-Jitsu Copacabana',
    headInstructor: 'Mestre Alexandre "Gigi" Paiva',
    address: 'Avenida Nossa Senhora de Copacabana, 1230 - Sala 401',
    neighborhood: 'Copacabana',
    city: 'Rio de Janeiro',
    phone: '(21) 2256-7890',
    email: 'alliance.copacabana@alliance.com.br',
    modalities: ['Jiu-Jitsu Brasileiro (BJJ)'],
    certifiedUntil: '2027-12-31',
    status: 'active'
  },
  {
    id: 'acad-2',
    name: 'Gracie Barra Jardim Oceânico',
    headInstructor: 'Professor Ricardo "Cachorrão" Almeida',
    address: 'Avenida Armando Lombardi, 450 - Loja B',
    neighborhood: 'Barra da Tijuca',
    city: 'Rio de Janeiro',
    phone: '(21) 2493-4567',
    email: 'contato@gbjardimoceanico.com.br',
    modalities: ['Jiu-Jitsu Brasileiro (BJJ)', 'Artes Marciais Mistas (MMA)'],
    certifiedUntil: '2026-12-31',
    status: 'active'
  },
  {
    id: 'acad-3',
    name: 'Combat Team Tijuca',
    headInstructor: 'Mestre Alexandre Silva',
    address: 'Rua Conde de Bonfim, 342 - 3º Andar',
    neighborhood: 'Tijuca',
    city: 'Rio de Janeiro',
    phone: '(21) 2568-1234',
    email: 'tijuca@combatteam.com.br',
    modalities: ['Kickboxing', 'Muay Thai', 'Artes Marciais Mistas (MMA)'],
    certifiedUntil: '2027-06-30',
    status: 'active'
  },
  {
    id: 'acad-4',
    name: 'Associação ShotoKan Barra',
    headInstructor: 'Sensei Carlos Alberto Suzuki',
    address: 'Avenida das Américas, 5001 - Bloco 3, Sala 102',
    neighborhood: 'Barra da Tijuca',
    city: 'Rio de Janeiro',
    phone: '(21) 3325-9876',
    email: 'contato@shotokanbarra.com',
    modalities: ['Karate-Do', 'Taekwondo'],
    certifiedUntil: '2026-12-31',
    status: 'active'
  },
  {
    id: 'acad-5',
    name: 'Niterói Fight Center',
    headInstructor: 'Professor Wellington "Noguchi" Santos',
    address: 'Rua Gavião Peixoto, 182 - Fundos',
    neighborhood: 'Icaraí',
    city: 'Niterói',
    phone: '(21) 2714-3456',
    email: 'niteroifight@gmail.com',
    modalities: ['Muay Thai', 'Kickboxing'],
    certifiedUntil: '2027-02-28',
    status: 'active'
  },
  {
    id: 'acad-6',
    name: 'Impacto Fight Club',
    headInstructor: 'Treinador Roberto Ramos',
    address: 'Estrada do Mendanha, 1205 - 2º Andar',
    neighborhood: 'Campo Grande',
    city: 'Rio de Janeiro',
    phone: '(21) 3402-1212',
    email: 'impactocampogrande@impactofc.com',
    modalities: ['Jiu-Jitsu Brasileiro (BJJ)', 'Muay Thai', 'Kickboxing'],
    certifiedUntil: '2025-12-31',
    status: 'expired'
  }
];

export const INITIAL_NEWS: News[] = [
  {
    id: 'news-1',
    title: 'FEAMCRJ abre inscrições para o Estadual de Jiu-Jitsu 2026 na Arena Carioca 1',
    category: 'Campeonato',
    date: '2026-07-10',
    excerpt: 'Estão oficialmente abertas as inscrições para o maior estadual de Jiu-Jitsu do ano. Preparem-se para lutar na prestigiada Arena Carioca 1 no Parque Olímpico.',
    content: 'A Federação Esportiva de Arte Marcial e Combate do Rio de Janeiro (FEAMCRJ) convida todos os atletas federados e suas respectivas academias para o Campeonato Estadual de Jiu-Jitsu 2026. O evento será realizado nos dias 15 e 16 de Agosto na majestosa Arena Carioca 1, no Parque Olímpico da Barra da Tijuca.\n\nCom uma expectativa de receber mais de 1.500 competidores de todas as regiões do estado do Rio de Janeiro, o evento contará com 12 áreas oficiais de tatame, arbitragem qualificada por cursos de reciclagem internacional, placares eletrônicos de última geração e transmissão ao vivo em nosso portal oficial.\n\nAs inscrições podem ser feitas diretamente na aba "Campeonatos" do nosso site. Atletas com filiação ativa em 2026 contam com um desconto de 20% na taxa de inscrição.',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=600&auto=format&fit=crop',
    author: 'Assessoria de Imprensa FEAMCRJ'
  },
  {
    id: 'news-2',
    title: 'Campanha de Recadastramento de Atletas e Descontos de Anuidade para 2026',
    category: 'Filiação',
    date: '2026-07-02',
    excerpt: 'Regularize sua situação cadastral até o fim de julho e ganhe descontos exclusivos nas taxas de inscrições de todos os campeonatos homologados.',
    content: 'Visando modernizar nossa base de dados e emitir as novas Carteiras Digitais Inteligentes, a FEAMCRJ lança a Campanha Estadual de Recadastramento de Atletas.\n\nTodos os atletas já cadastrados em nosso sistema devem acessar a aba "Portal do Atleta" para revisar suas informações, anexar foto atualizada para o perfil de combate e conferir seu status de graduação certificado. Atletas pendentes que regularizarem sua anuidade até o dia 31 de Julho terão anulação automática de juros retroativos e receberão um kit oficial com camiseta de filiação no próximo evento de sua modalidade.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    author: 'Departamento de Cadastro e Fomento'
  },
  {
    id: 'news-3',
    title: 'Curso Oficial de Arbitragem Regras K1 e Low Kicks de Kickboxing na Tijuca',
    category: 'Curso',
    date: '2026-06-25',
    excerpt: 'Indispensável para treinadores, atletas que buscam compreender os critérios de pontuação e novos árbitros interessados em integrar o quadro oficial.',
    content: 'O Departamento de Formação de Árbitros da FEAMCRJ promoverá, no dia 22 de Agosto, o Curso Intensivo de Regras Oficiais para Kickboxing. O local do curso será o auditório do Centro de Treinamento FEAMCRJ em nossa sede na Tijuca.\n\nO curso abrangerá:\n- Critérios de pontuação em rounds de K1 Rules e Low Kicks.\n- Procedimentos de segurança, pesagem e exames médicos obrigatórios.\n- Simulação em ringue com lutas reais assistidas.\n- Gestão de cartões e conduta antidesportiva.\n\nAs vagas são limitadas a 50 participantes para garantir a qualidade de aprendizado. Inscrições abertas na secretaria da federação e por e-mail.',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop',
    author: 'Mestre Alexandre Silva - Diretor de Arbitragem'
  }
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    title: 'Regulamento Geral Unificado de Competições FEAMCRJ 2026',
    category: 'Regulamento',
    uploadDate: '2026-01-10',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: 'doc-2',
    title: 'Tabela de Taxas Administrativas, Anuidade e Filiações 2026',
    category: 'Taxas',
    uploadDate: '2026-01-05',
    size: '850 KB',
    format: 'PDF'
  },
  {
    id: 'doc-3',
    title: 'Manual de Padronização de Graduações e Exames de Faixa Preta',
    category: 'Manual',
    uploadDate: '2026-02-18',
    size: '4.1 MB',
    format: 'PDF'
  },
  {
    id: 'doc-4',
    title: 'Ficha Cadastral de Filiação Coletiva para Academias (Novas Fichas)',
    category: 'Formulário',
    uploadDate: '2026-03-01',
    size: '1.2 MB',
    format: 'DOCX'
  },
  {
    id: 'doc-5',
    title: 'Termo de Responsabilidade e Isenção Médica para Menores de Idade',
    category: 'Formulário',
    uploadDate: '2026-04-12',
    size: '430 KB',
    format: 'PDF'
  }
];
