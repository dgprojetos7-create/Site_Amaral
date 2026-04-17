import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePublicSite } from '../context/usePublicSite';

const Blog: React.FC = () => {
  const { articles, isLoading, error } = usePublicSite();
  const publishedArticles = articles.filter((article) => article.status === 'published');

  return (
    <>
      <Helmet>
        <title>Blog & Ensaios | Nilton Amaral</title>
        <meta name="description" content="Artigos, resenhas e rascunhos de pensamentos do escritor Nilton Célio da Silva Amaral." />
      </Helmet>

      <section className="bg-navy" style={{ padding: 'var(--spacing-xl) 0 var(--spacing-lg) 0' }}>
        <div className="container text-center">
          <h1 className="text-gold">Blog & Ensaios Curtos</h1>
          <p className="text-beige" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            Fragmentos, reflexões e artigos breves sobre literatura, história e o ofício da escrita.
          </p>
        </div>
      </section>

      <section className="section bg-beige">
        <div className="container" style={{ maxWidth: '800px' }}>
          {isLoading && <p>Carregando artigos...</p>}
          {error && <p>{error}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {publishedArticles.map((post) => (
              <article
                key={post.id}
                style={{
                  backgroundColor: 'var(--color-white)',
                  padding: 'var(--spacing-lg)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                }}
                className="blog-card"
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ color: 'var(--color-gold)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {post.displayDate || post.publishedAt}
                </div>
                <h2 className="text-navy" style={{ marginBottom: '1rem' }}>
                  <Link to={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{post.title}</Link>
                </h2>
                <p style={{ color: 'var(--color-gray-light)', marginBottom: '1.5rem' }}>{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} style={{ color: 'var(--color-navy)', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                  Ler ensaio completo &rarr;
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
