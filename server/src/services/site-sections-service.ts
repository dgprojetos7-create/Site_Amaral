import type { RowDataPacket } from 'mysql2/promise';
import { execute, query } from '../config/db.js';
import { AppError } from '../middleware/app-error.js';
import { repairTextEncoding } from '../utils/strings.js';

const allowedSectionKeys = ['homeHero', 'about', 'contact'] as const;
export type SiteSectionKey = (typeof allowedSectionKeys)[number];

interface SiteSectionRow extends RowDataPacket {
  id: number;
  section_key: SiteSectionKey;
  title: string;
  content_json: unknown;
}

export interface SiteSections {
  homeHero: {
    title: string;
    subtitle: string;
  };
  about: {
    trajetoria: string;
    transicao: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

const defaultTitles: Record<SiteSectionKey, string> = {
  homeHero: 'Hero da Home',
  about: 'Sobre o Autor',
  contact: 'Contato',
};

const defaultSiteSections: SiteSections = {
  homeHero: {
    title: 'A palavra como instrumento de exploração do ser.',
    subtitle:
      'Ensaios acadêmicos, romances históricos e análises literárias que buscam compreender a complexidade da experiência humana através das eras.',
  },
  about: {
    trajetoria:
      'Nascido em São Paulo em 1968, Nilton Célio da Silva Amaral desenvolveu desde cedo um fascínio particular pelas narrativas históricas.',
    transicao:
      "A publicação de sua obra conceitual, 'A História da Bíblia' (2026), marcou uma inflexão em sua carreira e consolidou sua presença editorial.",
  },
  contact: {
    email: 'contato@niltonamaral.com.br',
    phone: '+55 (11) 98765-4321',
    address: 'São Paulo, SP - Brasil',
  },
};

const normalizeSiteSections = (sections: SiteSections): SiteSections => ({
  homeHero: {
    title: repairTextEncoding(sections.homeHero.title || defaultSiteSections.homeHero.title),
    subtitle: repairTextEncoding(sections.homeHero.subtitle || defaultSiteSections.homeHero.subtitle),
  },
  about: {
    trajetoria: repairTextEncoding(sections.about.trajetoria || defaultSiteSections.about.trajetoria),
    transicao: repairTextEncoding(sections.about.transicao || defaultSiteSections.about.transicao),
  },
  contact: {
    email: repairTextEncoding(sections.contact.email || defaultSiteSections.contact.email),
    phone: repairTextEncoding(sections.contact.phone || defaultSiteSections.contact.phone),
    address: repairTextEncoding(sections.contact.address || defaultSiteSections.contact.address),
  },
});

const isSectionKey = (value: string): value is SiteSectionKey => allowedSectionKeys.includes(value as SiteSectionKey);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const safeParseSection = (value: unknown) => {
  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value);
      return isPlainObject(parsedValue) ? parsedValue : null;
    } catch {
      return null;
    }
  }

  return isPlainObject(value) ? value : null;
};

export const listSiteSections = async (): Promise<SiteSections> => {
  const rows = await query<SiteSectionRow[]>('SELECT * FROM site_sections ORDER BY id ASC');
  const mapped = rows.reduce<Partial<SiteSections>>((accumulator, row) => {
    const content = safeParseSection(row.content_json);

    if (!content) {
      return accumulator;
    }

    switch (row.section_key) {
      case 'homeHero':
        accumulator.homeHero = content as SiteSections['homeHero'];
        break;
      case 'about':
        accumulator.about = content as SiteSections['about'];
        break;
      case 'contact':
        accumulator.contact = content as SiteSections['contact'];
        break;
      default:
        break;
    }

    return accumulator;
  }, {});

  return normalizeSiteSections({
    ...defaultSiteSections,
    ...mapped,
  });
};

export const updateSiteSection = async (sectionKey: string, payload: unknown) => {
  if (!isSectionKey(sectionKey)) {
    throw new AppError('Seção do site não reconhecida.', 404);
  }

  await execute(
    `
      INSERT INTO site_sections (section_key, title, content_json)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        content_json = VALUES(content_json)
    `,
    [sectionKey, defaultTitles[sectionKey], JSON.stringify(payload ?? {})],
  );

  const sections = await listSiteSections();
  return sections[sectionKey];
};
