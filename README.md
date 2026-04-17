# Site Amaral

Aplicacao full-stack pronta para GitHub e deploy no Railway, com frontend React + Vite, API Express e persistencia em MySQL.

## Stack

- React 18 + Vite
- Node.js + Express
- TypeScript no frontend e backend
- MySQL 8+ ou MariaDB compativel
- Autenticacao administrativa por cookie HTTP-only

## Estrutura

- `src/`: site publico e painel `/admin`
- `server/src/`: API Express
- `server/sql/schema.sql`: schema inicial do banco
- `scripts/windows/`: automacoes locais para Windows
- `docs/`: guias de setup local e deploy

## Requisitos

- Node.js 20.9+ (o projeto declara `>=20.9.0 <25`)
- MySQL 8+ ou MariaDB compativel

## Setup rapido

1. Instale as dependencias com `npm install`.
2. Copie `.env.example` para `.env` ou `.env.development`.
3. Ajuste as variaveis de banco e credenciais do admin.
4. Execute o schema em `server/sql/schema.sql`.
5. Rode `npm run db:seed-admin` para criar ou atualizar o administrador.
6. Inicie com `npm run dev`.

O frontend roda em `http://localhost:5174` e a API em `http://localhost:3001`.

## Scripts principais

- `npm run dev`: sobe Vite e API em paralelo
- `npm run build`: compila frontend e backend
- `npm run start`: sobe a versao de producao
- `npm run db:seed-admin`: cria ou atualiza o admin usando o ambiente atual
- `npm run db:seed-admin:dev`: forca seed com `NODE_ENV=development`
- `npm run lint`: valida o codigo com ESLint

Quando o banco esta disponivel, o backend tambem sincroniza automaticamente o usuario admin configurado no ambiente durante a inicializacao.

## Deploy no Railway

O repositorio agora inclui `railway.toml` com:

- `buildCommand = "npm run build"`
- `startCommand = "npm run start"`
- healthcheck em `/api/health`

Em producao, `JWT_SECRET` e `ADMIN_SEED_PASSWORD` precisam estar definidos com valores reais no ambiente do deploy ou em `.env.production`. O backend nao usa `.env` como fallback em producao.

Guia detalhado: [docs/DEPLOY_RAILWAY.md](docs/DEPLOY_RAILWAY.md)

## Guias auxiliares

- [docs/LOCAL_SETUP.md](docs/LOCAL_SETUP.md)
- [docs/DEPLOY_RAILWAY.md](docs/DEPLOY_RAILWAY.md)

## Recursos do sistema

- login administrativo real com tabela `users`
- CRUD completo de livros
- CRUD completo de artigos
- gerenciamento de midia por URL
- edicao de textos institucionais
- paginas publicas servidas pelo mesmo backend em producao
