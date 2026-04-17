import { env, isProduction } from '../config/env.js';

const databaseUnavailableCodes = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ENOTFOUND',
  'ETIMEDOUT',
  'PROTOCOL_CONNECTION_LOST',
  'ER_BAD_DB_ERROR',
  'ER_NO_SUCH_TABLE',
]);

export const isDatabaseUnavailableError = (error: unknown) => {
  if (isProduction || !error || typeof error !== 'object') {
    return false;
  }

  const code = typeof (error as { code?: unknown }).code === 'string' ? (error as { code: string }).code : '';
  return databaseUnavailableCodes.has(code);
};

const timestamp = '2026-03-12T00:00:00.000Z';

export const demoBooks = [
  {
    id: 1,
    slug: 'a-historia-da-biblia',
    title: 'A Historia da Biblia',
    subtitle: 'Da Tradicao Oral ao Canon Sagrado',
    year: '2026',
    coverImage: '/livro2.png',
    category: 'Religiao',
    synopsis: 'Uma analise profunda sobre a formacao dos textos sagrados.',
    isbn: '',
    physicalPurchaseLink: '',
    ebookPurchaseLink: '',
    showReviewSection: false,
    showTechnicalDetails: true,
    showPurchaseLinks: false,
    reviewText: '',
    reviewSource: '',
    quotes: [],
    publisher: '',
    pageCount: '',
    technicalYear: '',
    format: '',
    technicalDetailsExtra: '',
    isFeatured: true,
    status: 'published',
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 2,
    slug: 'aparicoes-da-virgem-maria',
    title: 'Aparicoes da Virgem Maria',
    subtitle: 'De Guadalupe a Medjugorje',
    year: '2024',
    coverImage: '/livro1.png',
    category: 'Religiao',
    synopsis: 'Estudo historico e fenomenologico das mariologias contemporaneas.',
    isbn: '',
    physicalPurchaseLink: '',
    ebookPurchaseLink: '',
    showReviewSection: false,
    showTechnicalDetails: false,
    showPurchaseLinks: false,
    reviewText: '',
    reviewSource: '',
    quotes: [],
    publisher: '',
    pageCount: '',
    technicalYear: '',
    format: '',
    technicalDetailsExtra: '',
    isFeatured: true,
    status: 'published',
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 3,
    slug: 'historia-das-religioes',
    title: 'Historia das Religioes',
    subtitle: 'Judaismo, Hinduismo, Budismo, Cristianismo e Islamismo',
    year: '2024',
    coverImage: '/livro3.png',
    category: 'Religiao',
    synopsis: 'Um panorama das grandes tradicoes espirituais da humanidade.',
    isbn: '',
    physicalPurchaseLink: '',
    ebookPurchaseLink: '',
    showReviewSection: false,
    showTechnicalDetails: false,
    showPurchaseLinks: false,
    reviewText: '',
    reviewSource: '',
    quotes: [],
    publisher: '',
    pageCount: '',
    technicalYear: '',
    format: '',
    technicalDetailsExtra: '',
    isFeatured: true,
    status: 'published',
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

export const demoArticles = [
  {
    id: 1,
    slug: 'notas-sobre-a-historiografia-na-literatura-de-cordel',
    title: 'Notas sobre a historiografia na literatura de cordel',
    authorName: 'Nilton Celio da Silva Amaral',
    publishedAt: '2026-03-12',
    displayDate: '12 Marco, 2026',
    excerpt:
      'Uma breve analise sobre como a memoria popular nordestina preservou fatos que a academia muitas vezes relegou as notas de rodape.',
    content: '<p>Conteudo completo do artigo aqui...</p>',
    category: 'Historia',
    tags: ['historia', 'cordel', 'memoria'],
    metaTitle: 'Notas sobre a historiografia na literatura de cordel',
    metaDescription: 'Uma leitura breve sobre memoria popular, cordel e historiografia brasileira.',
    imageUrl: '',
    status: 'published',
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 2,
    slug: 'o-processo-criativo-por-tras-de-a-historia-da-biblia',
    title: 'O processo criativo por tras de A Historia da Biblia',
    authorName: '',
    publishedAt: '2026-02-05',
    displayDate: '05 Fevereiro, 2026',
    excerpt:
      'Neste ensaio pessoal, discuto as motivacoes e os obstaculos de se escrever sobre tradicao e canon em um seculo de ruidos constantes.',
    content: '<p>Conteudo completo do artigo aqui...</p>',
    category: 'Bastidores',
    tags: ['processo-criativo', 'ensaio'],
    metaTitle: 'O processo criativo por tras de A Historia da Biblia',
    metaDescription: 'Bastidores de escrita, pesquisa e construcao do livro A Historia da Biblia.',
    imageUrl: '',
    status: 'published',
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

export const demoMedia = [
  {
    id: 1,
    title: 'Livro 1',
    altText: 'Capa do livro 1',
    url: '/livro1.png',
    mediaType: 'image',
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 2,
    title: 'Livro 2',
    altText: 'Capa do livro 2',
    url: '/livro2.png',
    mediaType: 'image',
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 3,
    title: 'Livro 3',
    altText: 'Capa do livro 3',
    url: '/livro3.png',
    mediaType: 'image',
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 4,
    title: 'Autor',
    altText: 'Retrato do autor',
    url: '/autor.jpg',
    mediaType: 'image',
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

export const demoSiteSections = {
  homeHero: {
    title: 'A palavra como instrumento de exploracao do ser.',
    subtitle:
      'Ensaios academicos, romances historicos e analises literarias que buscam compreender a complexidade da experiencia humana atraves das eras.',
  },
  about: {
    trajetoria: 'Nascido em Sao Paulo em 1968, Nilton Celio da Silva Amaral desenvolveu desde cedo um fascinio por narrativas historicas.',
    transicao: "A publicacao de 'A Historia da Biblia' marcou uma inflexao em sua carreira editorial.",
  },
  contact: {
    email: 'contato@niltonamaral.com.br',
    phone: '+55 (11) 98765-4321',
    address: 'Sao Paulo, SP - Brasil',
  },
};

export const getDemoAdminUser = () => ({
  id: 1,
  name: env.adminSeed.name,
  email: env.adminSeed.email,
  role: 'admin',
  isActive: true,
});

export const demoWriteUnavailableMessage =
  'Banco MySQL indisponivel no ambiente local. O painel esta em modo demonstracao e permite apenas leitura.';

export const getDemoDashboardSummary = () => ({
  counts: {
    books: demoBooks.length,
    publishedBooks: demoBooks.filter((book) => book.status === 'published').length,
    draftBooks: demoBooks.filter((book) => book.status === 'draft').length,
    articles: demoArticles.length,
    publishedArticles: demoArticles.filter((article) => article.status === 'published').length,
    draftArticles: demoArticles.filter((article) => article.status === 'draft').length,
    media: demoMedia.length,
  },
  recentBooks: demoBooks.slice(0, 4),
  recentArticles: demoArticles.slice(0, 4),
  sections: demoSiteSections,
});
