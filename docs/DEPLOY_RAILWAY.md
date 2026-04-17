# Deploy no Railway

Este projeto esta preparado para rodar como um unico servico no Railway, servindo a API e o frontend pelo mesmo processo Node.js.

## O que ja esta configurado

- `railway.toml` na raiz
- build com `npm run build`
- start com `npm run start`
- healthcheck em `/api/health`

## Variaveis de ambiente necessarias

Defina estas variaveis no servico do Railway:

```env
NODE_ENV=production
CORS_ORIGIN=https://seu-dominio-ou-app.railway.app
JWT_SECRET=gere-um-segredo-longo-e-aleatorio
JWT_EXPIRES_IN=7d

DB_HOST=railway_mysql_host
DB_PORT=3306
DB_USER=railway_mysql_user
DB_PASSWORD=railway_mysql_password
DB_NAME=railway_mysql_database

ADMIN_SEED_NAME=Administrador
ADMIN_SEED_EMAIL=admin@seudominio.com.br
ADMIN_SEED_PASSWORD=defina-uma-senha-forte
```

Observacao: o Railway injeta `PORT` automaticamente. Em geral voce nao precisa definir esse valor manualmente.

## Passo a passo

1. Conecte o repositorio do GitHub ao Railway.
2. Configure um MySQL do proprio Railway ou um MySQL externo.
3. Rode `server/sql/schema.sql` no banco de producao.
4. Preencha as variaveis de ambiente do servico.
5. Faca o deploy.
6. Depois do primeiro deploy, execute `npm run db:seed-admin` no servico para criar ou atualizar o administrador.

## Observacoes operacionais

- O frontend usa `/api` por padrao, entao o deploy monolitico no Railway nao precisa de `VITE_API_BASE_URL`.
- O backend em producao nao usa fallback de login em modo demonstracao.
- Se voce trocar `ADMIN_SEED_EMAIL` ou `ADMIN_SEED_PASSWORD`, execute novamente `npm run db:seed-admin` para sincronizar o usuario admin no banco.
