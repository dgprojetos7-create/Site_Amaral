import type { RowDataPacket } from 'mysql2';
import { execute, query } from '../config/db.js';
import { env } from '../config/env.js';
import { hashPassword } from '../lib/auth.js';

interface ExistingAdminRow extends RowDataPacket {
  id: number;
}

export interface AdminSeedResult {
  action: 'created' | 'updated';
  email: string;
}

export const syncAdminSeedUser = async (): Promise<AdminSeedResult> => {
  const passwordHash = await hashPassword(env.adminSeed.password);
  const existing = await query<ExistingAdminRow[]>('SELECT id FROM users WHERE email = ? LIMIT 1', [env.adminSeed.email]);

  if (existing[0]) {
    await execute('UPDATE users SET name = ?, password_hash = ?, role = ?, is_active = 1 WHERE id = ?', [
      env.adminSeed.name,
      passwordHash,
      'admin',
      existing[0].id,
    ]);

    return {
      action: 'updated',
      email: env.adminSeed.email,
    };
  }

  await execute('INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)', [
    env.adminSeed.name,
    env.adminSeed.email,
    passwordHash,
    'admin',
  ]);

  return {
    action: 'created',
    email: env.adminSeed.email,
  };
};
