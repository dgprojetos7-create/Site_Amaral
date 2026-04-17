import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

const nodeEnv = process.env.NODE_ENV || 'development';
const loadedEnvFiles: string[] = [];
const defaultJwtSecret = 'change-this-super-secret-key';
const defaultAdminEmail = 'admin@example.com';
const defaultAdminPassword = 'change-this-admin-password';

const envFiles = nodeEnv === 'production'
  ? ['.env.production', '.env']
  : ['.env.development', '.env'];

for (const envFile of envFiles) {
  const envFilePath = path.resolve(process.cwd(), envFile);

  if (!fs.existsSync(envFilePath)) {
    continue;
  }

  dotenv.config({ path: envFilePath, quiet: true });
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
  jwtSecret: process.env.JWT_SECRET || defaultJwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminSeed: {
    name: process.env.ADMIN_SEED_NAME || 'Administrador',
    email: process.env.ADMIN_SEED_EMAIL || defaultAdminEmail,
    password: process.env.ADMIN_SEED_PASSWORD || defaultAdminPassword,
  },
  loadedEnvFiles,
};

export const isProduction = env.nodeEnv === 'production';

if (isProduction) {
  const missingSecureValues: string[] = [];

  if (env.jwtSecret === defaultJwtSecret) {
    missingSecureValues.push('JWT_SECRET');
  }

  if (env.adminSeed.password === defaultAdminPassword) {
    missingSecureValues.push('ADMIN_SEED_PASSWORD');
  }

  if (missingSecureValues.length > 0) {
    throw new Error(
      `Defina valores seguros para ${missingSecureValues.join(', ')} antes de iniciar em producao.`,
    );
  }
}
