import React from 'react';
import { Helmet } from 'react-helmet-async';
import BookCard from '../components/BookCard';
import { usePublicSite } from '../context/usePublicSite';

const Books: React.FC = () => {
  const { books, isLoading, error } = usePublicSite();
  const publishedBooks = books.filter((book) => book.status === 'published');

  return (
    <>
      <Helmet>
        <title>Livros | Nilton Amaral</title>
        <meta name="description" content="Catálogo completo das obras de Nilton Célio da Silva Amaral: história das religiões e espiritualidade." />
      </Helmet>

      <section className="bg-navy" style={{ padding: 'var(--spacing-xl) 0 var(--spacing-lg) 0' }}>
        <div className="container text-center">
          <h1 className="text-gold">Livros Publicados</h1>
          <p className="text-beige" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            Ficção, ensaios não ficcionais e literatura acadêmica.
          </p>
        </div>
      </section>

      <section className="section bg-beige">
        <div className="container">
          {isLoading && <p>Carregando catálogo...</p>}
          {error && <p>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" style={{ background: 'var(--color-navy)', color: 'var(--color-beige)' }}>Todos</button>
            <button className="btn btn-outline" style={{ background: 'var(--color-white)' }}>Religião</button>
            <button className="btn btn-outline" style={{ background: 'var(--color-white)' }}>História</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {publishedBooks.map((book) => (
              <BookCard key={book.id} slug={book.slug} title={book.title} subtitle={book.subtitle} coverImage={book.coverImage} year={book.year} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Books;
