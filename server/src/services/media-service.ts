import type { RowDataPacket } from 'mysql2/promise';
import { execute, query } from '../config/db.js';
import { AppError } from '../middleware/app-error.js';
import { asString } from '../utils/strings.js';

type MediaType = 'image' | 'video' | 'external';

interface MediaRow extends RowDataPacket {
  id: number;
  title: string | null;
  alt_text: string | null;
  url: string;
  media_type: MediaType;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: number;
  title: string;
  altText: string;
  url: string;
  mediaType: MediaType;
  createdAt: string;
  updatedAt: string;
}

const mapMedia = (row: MediaRow): MediaItem => ({
  id: row.id,
  title: row.title || '',
  altText: row.alt_text || '',
  url: row.url,
  mediaType: row.media_type,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const normalizeMediaInput = (payload: unknown) => {
  const data = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;
  const url = asString(data.url);

  if (!url) {
    throw new AppError('A URL da mídia é obrigatória.', 422);
  }

  return {
    title: asString(data.title),
    altText: asString(data.altText),
    url,
    mediaType: data.mediaType === 'video' ? 'video' : data.mediaType === 'external' ? 'external' : 'image',
  };
};

export const listMedia = async () => {
  const rows = await query<MediaRow[]>('SELECT * FROM media ORDER BY updated_at DESC, id DESC');
  return rows.map(mapMedia);
};

export const createMedia = async (payload: unknown) => {
  const input = normalizeMediaInput(payload);
  const result = await execute(
    'INSERT INTO media (title, alt_text, url, media_type) VALUES (?, ?, ?, ?)',
    [input.title || null, input.altText || null, input.url, input.mediaType],
  );
  const rows = await query<MediaRow[]>('SELECT * FROM media WHERE id = ? LIMIT 1', [result.insertId]);
  if (!rows[0]) {
    throw new AppError('Não foi possível carregar a mídia após o cadastro.', 500);
  }
  return mapMedia(rows[0]);
};

export const updateMedia = async (mediaId: number, payload: unknown) => {
  const input = normalizeMediaInput(payload);
  const existing = await query<MediaRow[]>('SELECT * FROM media WHERE id = ? LIMIT 1', [mediaId]);

  if (!existing[0]) {
    throw new AppError('Mídia não encontrada.', 404);
  }

  await execute('UPDATE media SET title = ?, alt_text = ?, url = ?, media_type = ? WHERE id = ?', [
    input.title || null,
    input.altText || null,
    input.url,
    input.mediaType,
    mediaId,
  ]);

  const rows = await query<MediaRow[]>('SELECT * FROM media WHERE id = ? LIMIT 1', [mediaId]);
  if (!rows[0]) {
    throw new AppError('Não foi possível carregar a mídia após a atualização.', 500);
  }
  return mapMedia(rows[0]);
};

export const deleteMedia = async (mediaId: number) => {
  const existing = await query<RowDataPacket[]>('SELECT id FROM media WHERE id = ? LIMIT 1', [mediaId]);

  if (!existing[0]) {
    throw new AppError('Mídia não encontrada.', 404);
  }

  await execute('DELETE FROM media WHERE id = ?', [mediaId]);
};
