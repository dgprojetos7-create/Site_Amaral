import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { cmsApi } from '../api/cms';
import { renderArticleContent } from '../services/article-editor';
import { usePublicSite } from '../context/usePublicSite';
import type { Article } from '../types/cms';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { articles, isLoading } = usePublicSite();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const localArticle = articles.find((item) => item.slug === slug);

    if (localArticle) {
      setArticle(localArticle);
      return;
    }

    if (!slug) {
      return;
    }

    const loadArticle = async () => {
      try {
        const nextArticle = await cmsApi.getPublicArticleBySlug(slug);
        setArticle(nextArticle);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Artigo não encontrado.');
      }
    };

    void loadArticle();
  }, [articles, slug]);

  if (!article) {
    return (
      <section className="section bg-beige">
        <div className="container">
          <Link to="/blog" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-navy)' }}>
            <ArrowLeft size={18} /> Voltar para o blog
          </Link>
          <h1 className="text-navy" style={{ marginTop: '1rem' }}>{isLoading ? 'Carregando artigo...' : 'Artigo não encontrado'}</h1>
          <p>{error || 'Não encontramos esse conteúdo.'}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.metaTitle || `${article.title} | Nilton Amaral`}</title>
        <meta name="description" content={article.metaDescription || article.excerpt} />
      </Helmet>

      <section className="section bg-beige">
        <div className="container" style={{ maxWidth: '860px' }}>
          <Link to="/blog" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-navy)' }}>
            <ArrowLeft size={18} /> Voltar para o blog
          </Link>

          <article className="card public-article-card" style={{ marginTop: '1.5rem', padding: 'var(--spacing-lg)' }}>
            <div className="public-article-meta">
              <span className="text-gold" style={{ fontWeight: 600 }}>
                {article.displayDate || article.publishedAt}
              </span>
              {article.authorName && <span className="public-article-author">Por {article.authorName}</span>}
            </div>
            <h1 className="text-navy public-article-title" style={{ marginTop: '0.75rem' }}>{article.title}</h1>
            {article.category && <p className="public-article-category" style={{ color: 'var(--color-gray-light)' }}>{article.category}</p>}
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="public-article-image"
                style={{ width: '100%', borderRadius: 'var(--radius-md)', margin: '1.5rem 0' }}
              />
            )}
            <div
              className="public-article-content"
              dangerouslySetInnerHTML={{ __html: renderArticleContent(article.content || article.excerpt) }}
            />
          </article>
        </div>
      </section>
    </>
  );
};

export default ArticleDetail;
