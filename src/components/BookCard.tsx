import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

interface BookCardProps {
  id?: string;
  slug?: string;
  title: string;
  subtitle?: string;
  coverImage: string;
  year: string;
}

const BookCard: React.FC<BookCardProps> = ({ id, slug, title, subtitle, coverImage, year }) => {
  const bookSlug = slug || id || '';

  return (
    <Link to={`/livros/${bookSlug}`} className="book-card card">
      <div className="book-cover-container">
        <img src={coverImage} alt={`Capa do livro ${title}`} className="book-cover" />
      </div>
      <div className="book-info">
        <span className="book-year text-gold">{year}</span>
        <h3 className="book-title text-navy">{title}</h3>
        {subtitle && <h4 className="book-subtitle text-muted">{subtitle}</h4>}
      </div>
    </Link>
  );
};

export default BookCard;
