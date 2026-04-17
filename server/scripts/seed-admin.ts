import { syncAdminSeedUser } from '../src/services/admin-seed-service.js';

const main = async () => {
  const result = await syncAdminSeedUser();
  const actionLabel = result.action === 'created' ? 'criado' : 'atualizado';
  console.log(`Usuario admin ${actionLabel}: ${result.email}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
