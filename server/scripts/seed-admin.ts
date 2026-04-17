import { execute, query } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { hashPassword } from '../src/lib/auth.js';

const main = async () => {
  const passwordHash = await hashPassword(env.adminSeed.password);
  const existing = await query<{ id: number }[]>('SELECT id FROM users WHERE email = ? LIMIT 1', [env.adminSeed.email]);

  if (existing[0]) {
    await execute('UPDATE users SET name = ?, password_hash = ?, role = ?, is_active = 1 WHERE id = ?', [
      env.adminSeed.name,
      passwordHash,
      'admin',
      existing[0].id,
    ]);
    console.log(`Usuario admin atualizado: ${env.adminSeed.email}`);
    return;
  }

  await execute('INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)', [
    env.adminSeed.name,
    env.adminSeed.email,
    passwordHash,
    'admin',
  ]);

  console.log(`Usuario admin criado: ${env.adminSeed.email}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
