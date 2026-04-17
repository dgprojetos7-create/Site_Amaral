# Deploy no Railway

Este projeto está preparado para rodar como um único serviço no Railway, servindo a API e o frontend pelo mesmo processo Node.js.

## O que já está configurado

- `railway.toml` na raiz
- Build com `npm run build`
- Start com `npm run start`
- Healthcheck em `/api/health`
- Sincronização automática do admin na inicialização

## Arquitetura de banco de dados

O projeto suporta dois modos de conexão:

### Opção 1: MySQL do Railway (Recomendado)
1. Crie um serviço MySQL no Railway
2. Conecte o MySQL ao serviço Site_Amaral
3. O Railway injeta `DATABASE_URL` automaticamente
4. Configure as outras variáveis conforme abaixo

### Opção 2: MySQL externo
Se usar um MySQL fora do Railway, configure manualmente:
- `DB_HOST`: Host do MySQL
- `DB_PORT`: Porta (padrão 3306)
- `DB_USER`: Usuário
- `DB_PASSWORD`: Senha
- `DB_NAME`: Nome do banco

## Variáveis de ambiente obrigatórias

Configure estas variáveis no serviço do Railway:

```env
NODE_ENV=production
CORS_ORIGIN=https://seu-dominio-ou-app.railway.app

# OBRIGATÓRIO: Segredo JWT longo, aleatório e único
# Gere com: openssl rand -hex 32
JWT_SECRET=seu_valor_real_aqui_minimo_64_caracteres

JWT_EXPIRES_IN=7d

# Banco de dados (se não usar DATABASE_URL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=site_amaral

# Admin seed - sincronizado automaticamente na inicialização
ADMIN_SEED_NAME=Administrador
ADMIN_SEED_EMAIL=admin@seudominio.com.br

# OBRIGATÓRIO: Senha forte e única para o admin
ADMIN_SEED_PASSWORD=sua_senha_forte_aqui
```

### Notas importantes

- **NODE_ENV**: Deve ser `production`. Em produção, o backend rejeita valores de exemplo e não usa `.env` como fallback.
- **JWT_SECRET**: Obrigatório em produção. Deve ser um valor real, longo e aleatório. Gere com `openssl rand -hex 32`.
- **ADMIN_SEED_PASSWORD**: Obrigatório em produção. Deve ser uma senha forte e única.
- **DATABASE_URL**: Se você conectar um MySQL do Railway ao serviço, o Railway injeta essa variável automaticamente. Nesse caso, você pode omitir `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- **PORT**: O Railway injeta automaticamente. Não configure manualmente.

## Passo a passo de deploy

1. **Conecte o repositório** do GitHub ao Railway
2. **Configure o MySQL**:
   - Crie um serviço MySQL no Railway, OU
   - Configure um MySQL externo com as variáveis `DB_*`
3. **Configure as variáveis de ambiente** no serviço Site_Amaral:
   - `NODE_ENV=production`
   - `CORS_ORIGIN` com seu domínio
   - `JWT_SECRET` com um valor real gerado
   - `ADMIN_SEED_EMAIL` e `ADMIN_SEED_PASSWORD` com credenciais reais
4. **Rode o schema do banco**:
   - Execute `server/sql/schema.sql` no banco de produção
5. **Faça o deploy**:
   - O Railway fará o build e deploy automaticamente
   - Na inicialização, o backend sincroniza o admin automaticamente

## Sincronização automática do admin

Quando o backend inicia e consegue conectar ao banco:
1. Verifica se existe usuário com `ADMIN_SEED_EMAIL`
2. Se não existe: cria com `ADMIN_SEED_PASSWORD`
3. Se existe: atualiza a senha para `ADMIN_SEED_PASSWORD`

Isso garante que o admin sempre está sincronizado com as variáveis de ambiente.

## Observações operacionais

- O frontend usa `/api` por padrão, então o deploy monolítico no Railway não precisa de `VITE_API_BASE_URL`
- Em produção, não há fallback para `.env` — todas as variáveis críticas devem estar no ambiente
- Se você trocar `ADMIN_SEED_EMAIL` ou `ADMIN_SEED_PASSWORD`, a sincronização automática atualizará o banco na próxima inicialização
- Logs de sincronização aparecem no console do Railway com prefixo `ADMIN SEED:`

## Troubleshooting

### "Configuracao de producao invalida"
Você esqueceu de definir `JWT_SECRET` ou `ADMIN_SEED_PASSWORD` no Railway. Defina valores reais (não placeholders).

### "Conexao com banco de dados: FALHA"
- Verifique se o MySQL está rodando
- Verifique se as credenciais (`DB_*`) estão corretas
- Verifique se o banco `DB_NAME` existe
- Se usar `DATABASE_URL`, verifique se está no formato correto

### Não consigo fazer login
- Verifique se `ADMIN_SEED_EMAIL` e `ADMIN_SEED_PASSWORD` estão corretos
- Verifique os logs do Railway para mensagens de `ADMIN SEED:`
- Se o admin foi criado, tente fazer login com as credenciais configuradas
