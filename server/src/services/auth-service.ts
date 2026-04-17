import type { RowDataPacket } from 'mysql2';
import { query } from '../config/db.js';
import { comparePassword } from '../lib/auth.js';
import { AppError } from '../middleware/app-error.js';
import { asBoolean } from '../utils/strings.js';

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const mapUser = (user: UserRow): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: asBoolean(user.is_active),
});

export const findUserById = async (userId: number) => {
  const rows = await query<UserRow[]>('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0] ? mapUser(rows[0]) : null;
};

export const loginAdmin = async (email: string, password: string) => {
  const rows = await query<UserRow[]>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  const user = rows[0];

  if (!user) {
    throw new AppError('Credenciais invalidas.', 401);
  }

  if (!asBoolean(user.is_active)) {
    throw new AppError('Este usuario esta desativado.', 403);
  }

  const isValidPassword = await comparePassword(password, user.password_hash);

  if (!isValidPassword) {
    throw new AppError('Credenciais invalidas.', 401);
  }

  return mapUser(user);
};
