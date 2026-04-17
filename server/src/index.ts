import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { pool } from './config/db.js';
import { env } from './config/env.js';
import { app } from './app.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);
const clientDistPath = path.resolve(currentDirectoryPath, '../../dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');
const databaseConnectRetries = 5;
const databaseRetryDelayMs = 1500;

const wait = (milliseconds: number) => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});

const verifyDatabaseConnection = async () => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= databaseConnectRetries; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      return { connected: true, attempts: attempt, error: null as Error | null };
    } catch (error) {
      lastError = error as Error;

      if (attempt < databaseConnectRetries) {
        console.warn(
          `Conexao com MySQL falhou na tentativa ${attempt}/${databaseConnectRetries}. Tentando novamente em ${databaseRetryDelayMs}ms...`,
        );
        await wait(databaseRetryDelayMs);
      }
    }
  }

  return { connected: false, attempts: databaseConnectRetries, error: lastError };
};

if (fs.existsSync(clientDistPath) && fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));
  app.get('/{*path}', (request, response, next) => {
    if (request.path.startsWith('/api')) {
      next();
      return;
    }

    response.sendFile(clientIndexPath);
  });
}

const server = app.listen(env.port, async () => {
  console.log(`Backend rodando em http://localhost:${env.port}`);
  console.log(`Ambiente: ${env.nodeEnv}`);
  console.log(
    `Arquivos de ambiente carregados: ${
      env.loadedEnvFiles.length > 0 ? env.loadedEnvFiles.join(', ') : 'nenhum'
    }`,
  );
  console.log(`Banco configurado: ${env.db.user}@${env.db.host}:${env.db.port}/${env.db.database}`);

  const databaseStatus = await verifyDatabaseConnection();

  if (databaseStatus.connected) {
    console.log('CONEXAO COM BANCO DE DADOS: OK');
    return;
  }

  console.error('CONEXAO COM BANCO DE DADOS: FALHA');
  console.warn('O servidor continuara rodando, mas funcionalidades que dependem do banco falharao.');
  console.warn(`Tentativas realizadas: ${databaseStatus.attempts}`);
  console.debug('Erro detalhado:', databaseStatus.error?.message || 'Erro desconhecido.');
});

const shutdown = async () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
