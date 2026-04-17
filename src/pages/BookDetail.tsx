import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BookOpen, ShoppingCart } from 'lucide-react';
import Button from '../components/Button';
import { cmsApi } from '../api/cms';
import { usePublicSite } from '../context/usePublicSite';
import type { Book } from '../types/cms';

const sectionSpacing = { marginTop: 'var(--spacing-lg)' } as const;
const technicalRowStyle = { borderBottom: '1px solid var(--color-border)' } as const;
const technicalHeadingStyle = { textAlign: 'left', padding: '0.75rem 0', color: 'var(--color-gray)', fontWeight: 500 } as const;
const technicalValueStyle = { textAlign: 'right', padding: '0.75rem 0' } as const;

const BookDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { books, isLoading } = usePublicSite();
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const localBook = books.find((item) => item.slug === slug);

    if (localBook) {
      setBook(localBook);
      return;
    }

    if (!slug) {
      return;
    }

    const loadBook = async () => {
      try {
        const nextBook = await cmsApi.getPublicBookBySlug(slug);
        setBook(nextBook);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Livro não encontrado.');
      }
    };

    void loadBook();
  }, [books, slug]);

  if (!book) {
    return (
      <section className="bg-beige" style={{ padding: 'var(--spacing-md) 0 var(--spacing-xl) 0' }}>
        <div className="container">
          <Link
            to="/livros"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-navy)',
              marginBottom: 'var(--spacing-lg)',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={18} /> Voltar para o catálogo
          </Link>
          <h1 className="text-navy">{isLoading ? 'Carregando livro...' : 'Livro não encontrado'}</h1>
          <p>{error || 'Nenhuma obra foi encontrada para este link.'}</p>
        </div>
      </section>
    );
  }

  const synopsisParagraphs = (book.synopsis || '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const shouldShowReview = Boolean(book.showReviewSection && book.reviewText?.trim());
  const technicalDetails = [
    { label: 'Editora', value: book.publisher?.trim() || '' },
    { label: 'Páginas', value: book.pageCount?.trim() ? `${book.pageCount.trim()} páginas` : '' },
    { label: 'ISBN', value: book.isbn?.trim() || '' },
    { label: 'Ano', value: book.technicalYear?.trim() || book.year?.trim() || '' },
    { label: 'Formato', value: book.format?.trim() || '' },
    { label: 'Outros detalhes', value: book.technicalDetailsExtra?.trim() || '' },
  ].filter((item) => item.value);
  const shouldShowTechnicalDetails = Boolean(book.showTechnicalDetails && technicalDetails.length > 0);

  return (
    <>
      <Helmet>
        <title>{book.title} | Nilton Amaral</title>
        <meta name="description" content={`Detalhes sobre o livro ${book.title}. ${book.subtitle}`} />
      </Helmet>

      <section className="bg-beige" style={{ padding: 'var(--spacing-md) 0 var(--spacing-xl) 0' }}>
        <div className="container">
          <Link
            to="/livros"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-navy)',
              marginBottom: 'var(--spacing-lg)',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={18} /> Voltar para o catálogo
          </Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xl)' }}>
            <div style={{ flex: '1 1 300px', maxWidth: '400px', margin: '0 auto' }}>
              <img
                src={book.coverImage}
                alt={`Capa de ${book.title}`}
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)' }}
              />

              {book.showPurchaseLinks && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                  <Button
                    variant="primary"
                    href={book.physicalPurchaseLink}
                    target="_blank"
                    rel="noreferrer"
                    disabled={!book.physicalPurchaseLink}
                    style={{ display: 'flex', gap: '0.5rem' }}
                  >
                    <ShoppingCart size={18} /> Comprar físico
                  </Button>
                  <Button
                    variant="outline"
                    href={book.ebookPurchaseLink}
                    target="_blank"
                    rel="noreferrer"
                    disabled={!book.ebookPurchaseLink}
                    style={{ display: 'flex', gap: '0.5rem' }}
                  >
                    <BookOpen size={18} /> E-book
                  </Button>
                </div>
              )}
            </div>

            <div style={{ flex: '2 1 400px' }}>
              <span className="text-gold" style={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {book.category} &bull; {book.year}
              </span>
              <h1 className="text-navy" style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{book.title}</h1>
              {book.subtitle && (
                <h2
                  className="text-muted"
                  style={{ fontSize: '1.5rem', fontWeight: 400, fontFamily: 'var(--font-primary)', marginBottom: 'var(--spacing-md)' }}
                >
                  {book.subtitle}
                </h2>
              )}

              {synopsisParagraphs.length > 0 && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                  <h3 className="text-navy" style={{ marginBottom: 'var(--spacing-sm)' }}>Sinopse</h3>
                  {synopsisParagraphs.map((paragraph, index) => (
                    <p key={`${book.id}-synopsis-${index}`} style={{ whiteSpace: 'pre-line' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {shouldShowReview && (
                <div style={{ ...sectionSpacing, backgroundColor: 'var(--color-white)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                  <h3 className="text-navy" style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1.2rem' }}>O que a crítica diz</h3>
                  <blockquote style={{ fontStyle: 'italic', borderLeft: '4px solid var(--color-gold)', paddingLeft: '1rem', color: 'var(--color-gray)' }}>
                    <p style={{ whiteSpace: 'pre-line', marginBottom: 0 }}>{book.reviewText}</p>
                    {book.reviewSource && (
                      <footer style={{ marginTop: '0.5rem', fontWeight: 600, fontStyle: 'normal', fontSize: '0.9rem' }}>
                        {book.reviewSource}
                      </footer>
                    )}
                  </blockquote>
                </div>
              )}

              {shouldShowTechnicalDetails && (
                <div style={sectionSpacing}>
                  <h3 className="text-navy" style={{ marginBottom: 'var(--spacing-sm)' }}>Detalhes Técnicos</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                    <tbody>
                      {technicalDetails.map((item) => (
                        <tr key={item.label} style={technicalRowStyle}>
                          <th style={technicalHeadingStyle}>{item.label}</th>
                          <td style={{ ...technicalValueStyle, whiteSpace: item.label === 'Outros detalhes' ? 'pre-line' : 'normal' }}>{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookDetail;
