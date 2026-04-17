# Guia de Configuração Local - Projeto Site Amaral

Este guia orienta como configurar o ambiente de desenvolvimento local para que o site funcione 100% com banco de dados MySQL.

## 🚀 Quick Start (Automated) - RECOMENDADO

Preparei um conjunto de scripts para Windows que facilitam sua vida. Execute-os na raiz do projeto:

1.  **`setup-db.bat`**: Cria o banco, importa as tabelas e configura o admin inicial.
2.  **`start-local.bat`**: Verifica se o MySQL está ativo e inicia o frontend + backend.
3.  **`reset-db.bat`**: Reseta o banco para o estado original (pede confirmação).
4.  **`backup-db.bat`**: Gera um backup do banco na pasta `database-backups/` com data e hora.

---

## ⚙️ Variáveis de Ambiente

O projeto agora identifica automaticamente o contexto:
- **`.env.development`**: Para seu uso local. Configure usuário/senha do seu MySQL aqui.
- **`.env.production.example`**: Modelo de configuração para a Hostinger (não renomeie para `.env` com dados reais no Git).

---

## 🛠️ Preparação Manual

### Passo A: Criar o Banco
Abra seu terminal do MySQL ou uma ferramenta como MySQL Workbench/HeidiSQL e execute:
```sql
CREATE DATABASE site_amaral_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Passo B: Executar o Schema
Importe a estrutura das tabelas. No terminal (Windows):
```bash
mysql -u root -p site_amaral_local < server/sql/schema.sql
```
*Ou copie o conteúdo de `server/sql/schema.sql` e cole no seu editor SQL.*

---

## 2. Variáveis de Ambiente

O projeto já está configurado para ler arquivos específicos por ambiente:
- `.env.development`: Usado durante o desenvolvimento local (`npm run dev`).
- `.env.production`: Usado em produção (futuramente na Hostinger).

Verifique se o arquivo `.env.development` na raiz do projeto possui as credenciais corretas do seu MySQL local (usuário e senha).

---

## 3. Criar Usuário Administrador

Após configurar o banco, crie o usuário para acessar o painel em `/admin`:
```bash
npm run db:seed-admin
```

---

## 4. Iniciar o Projeto

Para rodar frontend e backend simultaneamente:
```bash
npm run dev
```

- **Frontend:** [http://localhost:5174](http://localhost:5174)
- **Backend:** [http://localhost:3001](http://localhost:3001)

---

## Notas Técnicas para o Desenvolvedor
- O backend foi refatorado para ser robusto: se o MySQL estiver desligado, o servidor **não trava**, mas exibirá avisos no console e as rotas de API retornarão erro até que o banco seja ligado.
- Nunca envie o arquivo `.env.production` ou `.env.development` com senhas reais para o Git. Eles já estão no `.gitignore`.
