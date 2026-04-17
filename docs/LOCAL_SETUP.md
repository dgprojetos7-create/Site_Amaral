# Guia de Configuracao Local

Este guia cobre o fluxo local do Site Amaral com MySQL, seed do administrador e scripts auxiliares para Windows.

## Scripts locais

Os scripts de apoio foram movidos para `scripts/windows/`:

1. `scripts/windows/setup-db.bat`: cria o banco local, importa o schema e executa o seed do admin.
2. `scripts/windows/start-local.bat`: verifica o MySQL e sobe frontend + backend.
3. `scripts/windows/reset-db.bat`: recria o banco local do zero.
4. `scripts/windows/backup-db.bat`: gera um dump em `database-backups/`.

## Setup manual

1. Instale dependencias com `npm install`.
2. Copie `.env.example` para `.env.development` ou `.env`.
3. Ajuste as credenciais do MySQL local.
4. Crie o banco:

```sql
CREATE DATABASE site_amaral_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Importe o schema:

```bash
mysql -u root -p site_amaral_local < server/sql/schema.sql
```

6. Crie ou atualize o administrador:

```bash
npm run db:seed-admin
```

7. Rode o projeto:

```bash
npm run dev
```

## Enderecos locais

- Frontend: `http://localhost:5174`
- Backend: `http://localhost:3001`
- Healthcheck: `http://localhost:3001/api/health`

## Observacoes

- O backend le primeiro `.env.development` ou `.env.production` e usa `.env` apenas como fallback.
- O script `npm run db:seed-admin` agora respeita o ambiente atual, o que evita seed incorreto em producao.
- Nunca envie `.env`, `.env.development` ou `.env.production` com segredos reais para o GitHub.
