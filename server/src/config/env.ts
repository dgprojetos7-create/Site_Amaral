import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.env.production' : '.env.development';
const baseEnvPath = path.resolve(process.cwd(), '.env');
const modeEnvPath = path.resolve(process.cwd(), envFile);
const loadedEnvFiles: string[] = [];

if (fs.existsSync(baseEnvPath)) {
  dotenv.config({ path: baseEnvPath, quiet: true });
  loadedEnvFiles.push('.env');
}

if (fs.existsSync(modeEnvPath)) {
  dotenv.config({ path: modeEnvPath, override: true, quiet: true });
  loadedEnvFiles.push(envFile);
}

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOrigins = (value: string | undefined) =>
  (value || 'http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseNumber(process.env.PORT, 3001),
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseNumber(process.env.DB_PORT, 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'site_amaral',
  },
  jwtSecret: process.env.JWT_SECRET || 'change-this-super-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminSeed: {
    name: process.env.ADMIN_SEED_NAME || 'Administrador',
    email: process.env.ADMIN_SEED_EMAIL || 'admin@niltonamaral.com',
    password: process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!',
  },
  loadedEnvFiles,
};

export const isProduction = env.nodeEnv === 'production';
