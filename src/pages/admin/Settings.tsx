import React from 'react';
import { Database, Globe2, ShieldCheck } from 'lucide-react';

const cards = [
  {
    title: 'Deploy Hostinger',
    description: 'Use o build do frontend em dist e rode o servidor Express compilado em server/dist com as variáveis de ambiente do MySQL.',
    icon: Globe2,
  },
  {
    title: 'Banco MySQL',
    description: 'O schema está em server/sql/schema.sql e o admin pode ser criado com npm run db:seed-admin.',
    icon: Database,
  },
  {
    title: 'Segurança',
    description: 'A autenticação do painel agora usa cookie HTTP-only assinado com JWT em vez de localStorage.',
    icon: ShieldCheck,
  },
];

const AdminSettings: React.FC = () => {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <section className="card" style={{ padding: '1.5rem' }}>
        <h3 className="text-navy" style={{ marginBottom: '0.5rem' }}>Configurações</h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          Esta área resume os pontos operacionais mais importantes para publicar e manter o projeto em produção.
        </p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {cards.map((card) => (
          <article key={card.title} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ width: '2.8rem', height: '2.8rem', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10, 25, 47, 0.08)', color: 'var(--color-navy)', marginBottom: '1rem' }}>
              <card.icon size={20} />
            </div>
            <h4 style={{ marginBottom: '0.35rem', color: '#0f172a' }}>{card.title}</h4>
            <p style={{ margin: 0, color: '#64748b' }}>{card.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default AdminSettings;
