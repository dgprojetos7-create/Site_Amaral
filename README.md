# Site Amaral

Arquitetura full-stack pronta para publicacao com:

- frontend React + Vite
- painel administrativo em `/admin`
- backend Node.js + Express
- persistencia real em MySQL
- autenticacao administrativa por cookie HTTP-only

## Estrutura

- `src/`: frontend publico e painel admin
- `server/src/`: API Express
- `server/sql/schema.sql`: schema inicial do banco
- `server/dist/`: backend compilado para producao
- `dist/`: frontend compilado para producao

## Requisitos

- Node.js 18+
- MySQL 8+ ou MariaDB compativel

## Configuracao local

1. Copie `.env.example` para `.env`
2. Ajuste as credenciais do MySQL
3. Execute o schema:

```sql
SOURCE server/sql/schema.sql;
```

4. Crie o usuario admin:

```bash
npm run db:seed-admin
```

5. Instale dependencias e rode o ambiente:

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: sobe Vite + API Express em paralelo
- `npm run build`: compila frontend e backend
- `npm run start`: inicia o backend compilado em `server/dist`
- `npm run db:seed-admin`: cria/atualiza o usuario admin no MySQL
- `npm run lint`: valida o codigo

## Variaveis de ambiente

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change-this-super-secret-key
JWT_EXPIRES_IN=7d

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=site_amaral

ADMIN_SEED_NAME=Administrador
ADMIN_SEED_EMAIL=admin@niltonamaral.com
ADMIN_SEED_PASSWORD=ChangeMe123!
```

## Deploy

### Fluxo recomendado

1. Configure o MySQL em producao
2. Rode `server/sql/schema.sql`
3. Defina as variaveis de ambiente no painel da hospedagem
4. Execute `npm install`
5. Execute `npm run build`
6. Execute `npm run db:seed-admin`
7. Inicie com `npm run start`

O backend Express serve a API em `/api` e entrega o build do frontend em `dist`, incluindo o painel em `/admin`.

## Recursos implementados

- login real do admin com tabela `users`
- CRUD completo de livros
- CRUD completo de artigos
- CRUD de midia por URL
- edicao dos textos institucionais do site
- controle de exibicao para critica, detalhes tecnicos e links de compra
- links separados para livro fisico e e-book
- paginas publicas consumindo a API real

## Banco de dados

Tabelas presentes no schema:

- `users`
- `books`
- `book_purchase_links`
- `book_quotes`
- `articles`
- `media`
- `site_sections`
