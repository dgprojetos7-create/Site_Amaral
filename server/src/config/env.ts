import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

const nodeEnv = process.env.NODE_ENV?.trim() || 'development';
const isProductionEnvironment = nodeEnv === 'production';
const loadedEnvFiles: string[] = [];

const defaultJwtSecret = 'change-this-super-secret-key';
const defaultAdminEmail = 'admin@example.com';
const defaultAdminPassword = 'change-this-admin-password';

const envFiles = isProductionEnvironment
  ? ['.env.production']
  : ['.env.development', '.env'];

for (const envFile of envFiles) {
  const envFilePath = path.resolve(process.cwd(), envFile);

  if (!fs.existsSync(envFilePath)) {
    continue;
  }

  dotenv.config({ path: envFilePath, quiet: true });
  loadedEnvFiles.push(envFile);
}

const readEnvString = (name: string) => {
  const value = process.env[name];

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOrigins = (value: string | undefined) =>
  (value || 'http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const productionSecretRules = [
  {
    envName: 'JWT_SECRET',
    value: readEnvString('JWT_SECRET'),
    blockedValues: new Set([
      defaultJwtSecret,
      'generate-a-long-random-secret-for-production',
      'gere-um-segredo-longo-e-aleatorio',
    ]),
    guidance: 'um segredo longo, aleatorio e exclusivo',
  },
  {
    envName: 'ADMIN_SEED_PASSWORD',
    value: readEnvString('ADMIN_SEED_PASSWORD'),
    blockedValues: new Set([
      defaultAdminPassword,
      'defina-uma-senha-forte',
    ]),
    guidance: 'uma senha forte e exclusiva para o administrador',
  },
];

const invalidProductionSecrets = isProductionEnvironment
  ? productionSecretRules.filter((rule) => !rule.value || rule.blockedValues.has(rule.value))
  : [];

export const env = {
  nodeEnv,
  port: parseNumber(readEnvString('PORT'), 3001),
  corsOrigins: parseOrigins(readEnvString('CORS_ORIGIN')),
  db: {
    host: readEnvString('DB_HOST') || 'localhost',
    port: parseNumber(readEnvString('DB_PORT'), 3306),
    user: readEnvString('DB_USER') || 'root',
    password: readEnvString('DB_PASSWORD') || '',
    database: readEnvString('DB_NAME') || 'site_amaral',
  },
  jwtSecret: readEnvString('JWT_SECRET') || (isProductionEnvironment ? '' : defaultJwtSecret),
  jwtExpiresIn: readEnvString('JWT_EXPIRES_IN') || '7d',
  adminSeed: {
    name: readEnvString('ADMIN_SEED_NAME') || 'Administrador',
    email: readEnvString('ADMIN_SEED_EMAIL') || defaultAdminEmail,
    password: readEnvString('ADMIN_SEED_PASSWORD') || (isProductionEnvironment ? '' : defaultAdminPassword),
  },
  loadedEnvFiles,
};

export const isProduction = env.nodeEnv === 'production';

if (invalidProductionSecrets.length > 0) {
  const invalidVariables = invalidProductionSecrets
    .map((rule) => `${rule.envName} (${rule.guidance})`)
    .join(', ');

  throw new Error(
    `Configuracao de producao invalida. Defina ${invalidVariables} no ambiente do deploy ou em .env.production. Valores de exemplo de .env.example e .env.production.example nao sao aceitos.`,
  );
}
