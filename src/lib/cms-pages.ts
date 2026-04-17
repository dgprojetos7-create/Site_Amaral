import type { CmsPage, CmsPageBlock, CmsPageSlug, SiteSections } from '../types/cms';

type CmsFieldKind = 'text' | 'textarea' | 'list' | 'image';

export interface CmsBlockFieldDefinition {
  key: string;
  label: string;
  kind: CmsFieldKind;
  rows?: number;
}

export interface CmsBlockDefinition {
  label: string;
  description: string;
  fields: CmsBlockFieldDefinition[];
}

export const cmsPageDefinitions: Record<
  CmsPageSlug,
  {
    label: string;
    description: string;
    blocks: Record<string, CmsBlockDefinition>;
  }
> = {
  home: {
    label: 'Home',
    description: 'Hero principal, destaques editoriais e chamadas de conversao.',
    blocks: {
      hero: {
        label: 'Hero',
        description: 'Cabecalho principal da pagina inicial.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'textarea', rows: 3 },
          { key: 'subtitle', label: 'Subtitulo', kind: 'textarea', rows: 4 },
          { key: 'primaryCtaLabel', label: 'Botao principal', kind: 'text' },
          { key: 'primaryCtaHref', label: 'Link do botao principal', kind: 'text' },
          { key: 'secondaryCtaLabel', label: 'Botao secundario', kind: 'text' },
          { key: 'secondaryCtaHref', label: 'Link do botao secundario', kind: 'text' },
          { key: 'authorImageUrl', label: 'Foto do autor', kind: 'image' },
          { key: 'authorImageAlt', label: 'Alt da foto do autor', kind: 'text' },
          { key: 'backgroundBook1Url', label: 'Livro decorativo 1', kind: 'image' },
          { key: 'backgroundBook2Url', label: 'Livro decorativo 2', kind: 'image' },
          { key: 'backgroundBook3Url', label: 'Livro decorativo 3', kind: 'image' },
        ],
      },
      featuredBooks: {
        label: 'Destaque de livros',
        description: 'Texto de apoio da grade de livros em destaque.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'text' },
          { key: 'description', label: 'Descricao', kind: 'textarea', rows: 3 },
          { key: 'ctaLabel', label: 'Texto do botao', kind: 'text' },
          { key: 'ctaHref', label: 'Link do botao', kind: 'text' },
        ],
      },
      authorIntro: {
        label: 'Introducao do autor',
        description: 'Bloco institucional com texto de apresentacao.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'text' },
          { key: 'body', label: 'Texto principal', kind: 'textarea', rows: 5 },
          { key: 'secondaryBody', label: 'Texto secundario', kind: 'textarea', rows: 5 },
          { key: 'ctaLabel', label: 'Texto do botao', kind: 'text' },
          { key: 'ctaHref', label: 'Link do botao', kind: 'text' },
        ],
      },
      researchThemes: {
        label: 'Temas de pesquisa',
        description: 'Lista de temas em destaque na home.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'text' },
          { key: 'items', label: 'Itens da lista', kind: 'list', rows: 6 },
        ],
      },
      contactCta: {
        label: 'CTA institucional',
        description: 'Chamada final para contato profissional.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'text' },
          { key: 'description', label: 'Descricao', kind: 'textarea', rows: 4 },
          { key: 'ctaLabel', label: 'Texto do botao', kind: 'text' },
          { key: 'ctaHref', label: 'Link do botao', kind: 'text' },
        ],
      },
    },
  },
  about: {
    label: 'Sobre',
    description: 'Biografia, transicao de carreira e credenciais.',
    blocks: {
      hero: {
        label: 'Hero',
        description: 'Cabecalho da pagina Sobre.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'text' },
          { key: 'subtitle', label: 'Subtitulo', kind: 'textarea', rows: 3 },
        ],
      },
      biography: {
        label: 'Biografia',
        description: 'Texto principal da pagina do autor.',
        fields: [
          { key: 'title', label: 'Titulo da secao', kind: 'text' },
          { key: 'portraitUrl', label: 'Imagem da biografia', kind: 'image' },
          { key: 'portraitAlt', label: 'Alt da imagem da biografia', kind: 'text' },
          { key: 'trajetoria', label: 'Trajetoria', kind: 'textarea', rows: 8 },
          { key: 'transitionTitle', label: 'Titulo da transicao', kind: 'text' },
          { key: 'transicao', label: 'Transicao', kind: 'textarea', rows: 8 },
          { key: 'closingParagraph', label: 'Paragrafo final', kind: 'textarea', rows: 5 },
        ],
      },
      academicBackground: {
        label: 'Formacao academica',
        description: 'Lista de formacao e titulacoes.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'text' },
          { key: 'items', label: 'Itens da lista', kind: 'list', rows: 6 },
        ],
      },
      selectedAwards: {
        label: 'Premios',
        description: 'Lista de premios e honrarias.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'text' },
          { key: 'items', label: 'Itens da lista', kind: 'list', rows: 6 },
        ],
      },
    },
  },
  contact: {
    label: 'Contato',
    description: 'Hero, bloco de contato e formulario institucional.',
    blocks: {
      hero: {
        label: 'Hero',
        description: 'Cabecalho da pagina Contato.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'text' },
          { key: 'subtitle', label: 'Subtitulo', kind: 'textarea', rows: 3 },
        ],
      },
      intro: {
        label: 'Introducao',
        description: 'Texto editorial da pagina de contato.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'text' },
          { key: 'body', label: 'Texto principal', kind: 'textarea', rows: 4 },
          { key: 'secondaryBody', label: 'Texto secundario', kind: 'textarea', rows: 4 },
        ],
      },
      contactDetails: {
        label: 'Dados de contato',
        description: 'Informacoes praticas usadas em contato e privacidade.',
        fields: [
          { key: 'emailTitle', label: 'Titulo do e-mail', kind: 'text' },
          { key: 'email', label: 'E-mail', kind: 'text' },
          { key: 'phoneTitle', label: 'Titulo do telefone', kind: 'text' },
          { key: 'phone', label: 'Telefone', kind: 'text' },
          { key: 'addressTitle', label: 'Titulo do endereco', kind: 'text' },
          { key: 'address', label: 'Endereco', kind: 'textarea', rows: 3 },
          { key: 'postalCode', label: 'CEP', kind: 'text' },
        ],
      },
      contactForm: {
        label: 'Formulario',
        description: 'Titulos e assuntos do formulario institucional.',
        fields: [
          { key: 'title', label: 'Titulo', kind: 'text' },
          { key: 'submitLabel', label: 'Texto do botao', kind: 'text' },
          { key: 'subjectOptions', label: 'Assuntos', kind: 'list', rows: 6 },
        ],
      },
    },
  },
  site: {
    label: 'Rodape',
    description: 'Edicao do rodape publico: marca, links, contato e faixa legal.',
    blocks: {
      footerBrand: {
        label: 'Bloco institucional',
        description: 'Nome do site e texto institucional exibidos no rodape.',
        fields: [
          { key: 'siteTitle', label: 'Nome do site', kind: 'text' },
          { key: 'description', label: 'Descricao', kind: 'textarea', rows: 4 },
        ],
      },
      footerNavigation: {
        label: 'Links rapidos',
        description: 'Titulo e links exibidos no rodape.',
        fields: [
          { key: 'title', label: 'Titulo da coluna', kind: 'text' },
          { key: 'link1Label', label: 'Link 1 - texto', kind: 'text' },
          { key: 'link1Href', label: 'Link 1 - URL', kind: 'text' },
          { key: 'link2Label', label: 'Link 2 - texto', kind: 'text' },
          { key: 'link2Href', label: 'Link 2 - URL', kind: 'text' },
          { key: 'link3Label', label: 'Link 3 - texto', kind: 'text' },
          { key: 'link3Href', label: 'Link 3 - URL', kind: 'text' },
          { key: 'link4Label', label: 'Link 4 - texto', kind: 'text' },
          { key: 'link4Href', label: 'Link 4 - URL', kind: 'text' },
        ],
      },
      footerContact: {
        label: 'Contato',
        description: 'Informacoes exibidas na coluna de contato do rodape.',
        fields: [
          { key: 'title', label: 'Titulo da coluna', kind: 'text' },
          { key: 'email', label: 'E-mail', kind: 'text' },
          { key: 'location', label: 'Localizacao', kind: 'text' },
        ],
      },
      footerLegal: {
        label: 'Faixa legal',
        description: 'Texto legal e link de privacidade na linha inferior do rodape.',
        fields: [
          { key: 'copyrightText', label: 'Texto de copyright', kind: 'text' },
          { key: 'privacyLabel', label: 'Texto do link de privacidade', kind: 'text' },
          { key: 'privacyHref', label: 'URL de privacidade', kind: 'text' },
        ],
      },
    },
  },
};

export const getCmsPageBySlug = (pages: CmsPage[], slug: CmsPageSlug) =>
  pages.find((page) => page.slug === slug) || null;

export const findCmsPageBlock = (page: CmsPage | null, key: string): CmsPageBlock | null =>
  page?.blocks.find((block) => block.key === key) || null;

export const getCmsPageBlock = (page: CmsPage | null, key: string): CmsPageBlock | null =>
  findCmsPageBlock(page, key)?.isActive ? findCmsPageBlock(page, key) : null;

export const getCmsText = (block: CmsPageBlock | null, key: string, fallback = '') => {
  const value = block?.data[key];
  return typeof value === 'string' ? value : fallback;
};

export const getCmsList = (block: CmsPageBlock | null, key: string, fallback: string[] = []) => {
  const value = block?.data[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallback;
};

export const buildSiteSectionsFromPages = (pages: CmsPage[]): SiteSections => {
  const homePage = getCmsPageBySlug(pages, 'home');
  const aboutPage = getCmsPageBySlug(pages, 'about');
  const contactPage = getCmsPageBySlug(pages, 'contact');

  const homeHero = getCmsPageBlock(homePage, 'hero');
  const biography = getCmsPageBlock(aboutPage, 'biography');
  const contactDetails = getCmsPageBlock(contactPage, 'contactDetails');

  return {
    homeHero: {
      title: getCmsText(homeHero, 'title', 'A palavra como instrumento de exploracao do ser.'),
      subtitle: getCmsText(
        homeHero,
        'subtitle',
        'Ensaios, romances e analises literarias orientadas por pesquisa e profundidade.',
      ),
    },
    about: {
      trajetoria: getCmsText(biography, 'trajetoria', ''),
      transicao: getCmsText(biography, 'transicao', ''),
    },
    contact: {
      email: getCmsText(contactDetails, 'email', 'contato@niltonamaral.com.br'),
      phone: getCmsText(contactDetails, 'phone', '+55 (11) 98765-4321'),
      address: getCmsText(contactDetails, 'address', 'Sao Paulo, SP - Brasil'),
    },
  };
};
