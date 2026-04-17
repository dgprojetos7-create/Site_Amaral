import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Button from '../../components/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const isAuthenticated = await login(email, password);

    if (isAuthenticated) {
      navigate('/admin');
    } else {
      setError('Credenciais invalidas. Verifique e-mail e senha.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-navy" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-md)' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', padding: 'var(--spacing-xl)', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-gold)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md) auto' }}>
          <Lock size={32} />
        </div>

        <h1 className="text-navy" style={{ marginBottom: '0.5rem' }}>Acesso Restrito</h1>
        <p className="text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
          Entre com o e-mail e a senha do administrador configurados no ambiente.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-gray)' }}>E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
              required
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-gray)' }}>Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', outline: 'none' }}
              required
            />
          </div>

          {error && <p style={{ color: '#e53e3e', fontSize: '0.9rem', margin: 0 }}>{error}</p>}

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar no Painel'}
          </Button>

          <p style={{ marginTop: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-gray-light)' }}>
            Dica: defina `ADMIN_SEED_EMAIL` e `ADMIN_SEED_PASSWORD`, reinicie o backend para sincronizar o admin automaticamente
            ou execute `npm run db:seed-admin`.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
