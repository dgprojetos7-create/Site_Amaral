import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, FileText, Image as ImageIcon, Plus, Settings, Sparkles } from 'lucide-react';
import { cmsApi } from '../../api/cms';
import type { DashboardSummary } from '../../types/cms';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const nextSummary = await cmsApi.getDashboardSummary();
        setSummary(nextSummary);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar o dashboard.');
      }
    };

    void loadSummary();
  }, []);

  if (!summary) {
    return <div className="card" style={{ padding: '1.5rem' }}>{error || 'Carregando dashboard...'}</div>;
  }

  const stats = [
    {
      label: 'Livros cadastrados',
      value: summary.counts.books.toString(),
      helper: `${summary.counts.publishedBooks} publicados`,
      icon: Book,
      tone: 'gold',
    },
    {
      label: 'Artigos cadastrados',
      value: summary.counts.articles.toString(),
      helper: `${summary.counts.publishedArticles} publicados`,
      icon: FileText,
      tone: 'emerald',
    },
    {
      label: 'Mídias disponíveis',
      value: summary.counts.media.toString(),
      helper: 'Biblioteca visual do site',
      icon: ImageIcon,
      tone: 'slate',
    },
  ];

  return (
    <div className="admin-dashboard">
      <section className="dashboard-hero card">
        <div className="dashboard-hero-copy">
          <span className="dashboard-kicker">Resumo do painel</span>
          <h3>Estrutura pronta para operar com dados reais.</h3>
          <p>Livros, artigos, mídia e textos institucionais agora saem do backend Express com persistência MySQL.</p>
        </div>

        <div className="dashboard-hero-cta">
          <Link to="/admin/livros" className="btn btn-secondary hero-cta-primary">
            <Plus size={18} />
            Novo Livro
          </Link>
          <Link to="/admin/paginas" className="btn btn-outline hero-cta-secondary">
            <Settings size={18} />
            Textos do Site
          </Link>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <h3>Métricas</h3>
          <p>Números essenciais do catálogo editorial.</p>
        </div>

        <div className="dashboard-metrics-grid">
          {stats.map((stat) => (
            <div key={stat.label} className={`dashboard-metric-card dashboard-metric-card--${stat.tone}`}>
              <div className="dashboard-metric-icon">
                <stat.icon size={22} />
              </div>
              <div className="dashboard-metric-content">
                <span className="dashboard-metric-label">{stat.label}</span>
                <strong className="dashboard-metric-value">{stat.value}</strong>
                <span className="dashboard-metric-helper">{stat.helper}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid--primary">
        <div className="card dashboard-card">
          <div className="dashboard-section-heading">
            <h3>Ações rápidas</h3>
            <p>Atalhos para os fluxos mais usados do painel.</p>
          </div>

          <div className="dashboard-quick-actions">
            <Link to="/admin/livros" className="dashboard-action-cta">
              <div className="dashboard-action-copy">
                <div className="dashboard-action-icon">
                  <Book size={20} />
                </div>
                <div>
                  <strong>Gerenciar livros</strong>
                  <span>CRUD completo, compra física, e-book e opções de exibição.</span>
                </div>
              </div>
              <ArrowRight size={18} />
            </Link>

            <Link to="/admin/artigos" className="dashboard-action-cta">
              <div className="dashboard-action-copy">
                <div className="dashboard-action-icon">
                  <FileText size={20} />
                </div>
                <div>
                  <strong>Gerenciar artigos</strong>
                  <span>Blog integrado ao front com slug, status e conteúdo persistente.</span>
                </div>
              </div>
              <ArrowRight size={18} />
            </Link>

            <Link to="/admin/paginas" className="dashboard-action-cta">
              <div className="dashboard-action-copy">
                <div className="dashboard-action-icon">
                  <Sparkles size={20} />
                </div>
                <div>
                  <strong>Editar textos institucionais</strong>
                  <span>Hero, biografia e contato em seções controladas pelo banco.</span>
                </div>
              </div>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="card dashboard-card">
          <div className="dashboard-section-heading">
            <h3>Últimos livros</h3>
            <p>Conteúdos recentes do catálogo.</p>
          </div>

          <div className="dashboard-list">
            {summary.recentBooks.map((book) => (
              <div key={book.id} className="dashboard-list-item">
                <div className="dashboard-list-copy">
                  <strong>{book.title}</strong>
                  <span>{book.category} • {book.year || 'Sem ano'}</span>
                </div>
                <div className="dashboard-list-meta">
                  <span className={`dashboard-status-pill dashboard-status-pill--${book.status === 'published' ? 'success' : 'warning'}`}>
                    {book.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  <Link to="/admin/livros" className="dashboard-inline-link">Editar</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid--secondary">
        <div className="card dashboard-card">
          <div className="dashboard-section-heading">
            <h3>Últimos artigos</h3>
            <p>Textos mais recentes do blog.</p>
          </div>

          <div className="dashboard-list">
            {summary.recentArticles.map((article) => (
              <div key={article.id} className="dashboard-list-item">
                <div className="dashboard-list-copy">
                  <strong>{article.title}</strong>
                  <span>{article.displayDate || article.publishedAt || 'Sem data'}</span>
                </div>
                <div className="dashboard-list-meta">
                  <span className={`dashboard-status-pill dashboard-status-pill--${article.status === 'published' ? 'success' : 'warning'}`}>
                    {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                  <Link to="/admin/artigos" className="dashboard-inline-link">Editar</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card dashboard-card">
          <div className="dashboard-section-heading">
            <h3>Arquitetura</h3>
            <p>Pontos principais do ambiente atual.</p>
          </div>

          <div className="dashboard-site-panel">
            <Link to="/admin/paginas" className="dashboard-site-link">
              <Sparkles size={20} />
              <div>
                <strong>Frontend React + Vite</strong>
                <span>Site público e admin em rotas separadas dentro da mesma SPA.</span>
              </div>
            </Link>

            <div className="dashboard-site-link">
              <Settings size={20} />
              <div>
                <strong>Backend Node + Express</strong>
                <span>API pronta para publicar com MySQL e autenticação por cookie.</span>
              </div>
            </div>

            <div className="dashboard-site-link">
              <ImageIcon size={20} />
              <div>
                <strong>Banco MySQL</strong>
                <span>Tabelas reais para usuários, livros, artigos, mídia e seções do site.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
