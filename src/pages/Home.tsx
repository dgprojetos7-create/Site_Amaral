import React from 'react';
import { Helmet } from 'react-helmet-async';
import Button from '../components/Button';
import BookCard from '../components/BookCard';
import { getCmsList, getCmsPageBlock, getCmsPageBySlug, getCmsText } from '../lib/cms-pages';
import { usePublicSite } from '../context/usePublicSite';
import './Home.css';

const heroParticles = [
  { top: '10%', left: '8%', size: 7, opacity: 0.5, blur: 0, duration: '18s', delay: '-2s', variant: 'a' },
  { top: '16%', left: '24%', size: 5, opacity: 0.42, blur: 0, duration: '22s', delay: '-9s', variant: 'b' },
  { top: '20%', left: '72%', size: 9, opacity: 0.32, blur: 1.5, duration: '26s', delay: '-5s', variant: 'c' },
  { top: '32%', left: '14%', size: 6, opacity: 0.4, blur: 0, duration: '20s', delay: '-12s', variant: 'c' },
  { top: '28%', left: '43%', size: 4, opacity: 0.45, blur: 0, duration: '16s', delay: '-7s', variant: 'a' },
  { top: '38%', left: '60%', size: 7, opacity: 0.28, blur: 1, duration: '24s', delay: '-4s', variant: 'b' },
  { top: '44%', left: '82%', size: 5, opacity: 0.4, blur: 0, duration: '21s', delay: '-10s', variant: 'a' },
  { top: '52%', left: '10%', size: 8, opacity: 0.24, blur: 1.5, duration: '28s', delay: '-15s', variant: 'b' },
  { top: '58%', left: '31%', size: 4, opacity: 0.42, blur: 0, duration: '19s', delay: '-8s', variant: 'c' },
  { top: '62%', left: '50%', size: 6, opacity: 0.34, blur: 0.8, duration: '23s', delay: '-6s', variant: 'a' },
  { top: '70%', left: '74%', size: 7, opacity: 0.3, blur: 1.2, duration: '25s', delay: '-3s', variant: 'b' },
  { top: '78%', left: '18%', size: 5, opacity: 0.44, blur: 0, duration: '17s', delay: '-11s', variant: 'c' },
  { top: '82%', left: '42%', size: 9, opacity: 0.2, blur: 2.2, duration: '30s', delay: '-14s', variant: 'a' },
  { top: '86%', left: '88%', size: 6, opacity: 0.34, blur: 0, duration: '18s', delay: '-5s', variant: 'b' },
  { top: '14%', left: '91%', size: 4, opacity: 0.5, blur: 0, duration: '15s', delay: '-1s', variant: 'c' },
  { top: '48%', left: '91%', size: 5, opacity: 0.36, blur: 0.5, duration: '27s', delay: '-16s', variant: 'a' },
  { top: '67%', left: '58%', size: 3, opacity: 0.52, blur: 0, duration: '14s', delay: '-13s', variant: 'b' },
  { top: '36%', left: '4%', size: 5, opacity: 0.38, blur: 0, duration: '19s', delay: '-9s', variant: 'c' },
];

const Home: React.FC = () => {
  const { books, pages, siteSections, isLoading, error } = usePublicSite();
  const homePage = getCmsPageBySlug(pages, 'home');
  const heroBlock = getCmsPageBlock(homePage, 'hero');
  const featuredBooksBlock = getCmsPageBlock(homePage, 'featuredBooks');
  const authorIntroBlock = getCmsPageBlock(homePage, 'authorIntro');
  const researchThemesBlock = getCmsPageBlock(homePage, 'researchThemes');
  const contactCtaBlock = getCmsPageBlock(homePage, 'contactCta');
  const heroAuthorImage = getCmsText(heroBlock, 'authorImageUrl', '/autor.jpg');
  const heroAuthorImageAlt = getCmsText(
    heroBlock,
    'authorImageAlt',
    'Retrato do autor Nilton Celio da Silva Amaral',
  );
  const backgroundBook1Url = getCmsText(heroBlock, 'backgroundBook1Url', '/livro1.png');
  const backgroundBook2Url = getCmsText(heroBlock, 'backgroundBook2Url', '/livro2.png');
  const backgroundBook3Url = getCmsText(heroBlock, 'backgroundBook3Url', '/livro3.png');
  const featuredBooks = books.filter((book) => book.isFeatured && book.status === 'published');
  const researchThemes = getCmsList(researchThemesBlock, 'items', [
    'Historia Colonial Brasileira',
    'Sociologia da Literatura',
    'Memoria e Identidade Nacional',
    'Filosofia do Tempo',
  ]);

  if (isLoading && !homePage && !siteSections) {
    return <section className="section bg-beige"><div className="container">Carregando conteudo...</div></section>;
  }

  if (error && !homePage && !siteSections) {
    return <section className="section bg-beige"><div className="container">{error}</div></section>;
  }

  return (
    <>
      <Helmet>
        <title>{homePage?.seoTitle || 'Nilton Amaral | Escritor e Pesquisador'}</title>
        <meta
          name="description"
          content={homePage?.seoDescription || 'Site oficial de Nilton Celio da Silva Amaral, escritor e pesquisador brasileiro.'}
        />
      </Helmet>

      <section className="hero bg-navy">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-bg-mist hero-bg-mist--left" />
          <div className="hero-bg-mist hero-bg-mist--right" />
          <div className="hero-bg-particles">
            {heroParticles.map((particle, index) => (
              <span
                key={`${particle.top}-${particle.left}-${index}`}
                className={`hero-particle hero-particle--${particle.variant}`}
                style={{
                  top: particle.top,
                  left: particle.left,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  filter: `blur(${particle.blur}px)`,
                  animationDuration: particle.duration,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </div>
          <div className="hero-bg-book hero-bg-book--1">
            <img src={backgroundBook1Url} alt="" />
          </div>
          <div className="hero-bg-book hero-bg-book--2">
            <img src={backgroundBook2Url} alt="" />
          </div>
          <div className="hero-bg-book hero-bg-book--3">
            <img src={backgroundBook3Url} alt="" />
          </div>
        </div>

        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title text-gold">
              {getCmsText(heroBlock, 'title', siteSections?.homeHero.title || '')}
            </h1>
            <p className="hero-subtitle text-beige">
              {getCmsText(heroBlock, 'subtitle', siteSections?.homeHero.subtitle || '')}
            </p>
            <div className="hero-actions">
              <Button to={getCmsText(heroBlock, 'primaryCtaHref', '/livros')} variant="secondary">
                {getCmsText(heroBlock, 'primaryCtaLabel', 'Conhecer Obras')}
              </Button>
              <Button
                to={getCmsText(heroBlock, 'secondaryCtaHref', '/sobre')}
                variant="outline"
                style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}
              >
                {getCmsText(heroBlock, 'secondaryCtaLabel', 'Sobre o Autor')}
              </Button>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img src={heroAuthorImage} alt={heroAuthorImageAlt} className="hero-image" />
          </div>
        </div>
      </section>

      <section className="section bg-beige">
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2 className="text-navy">{getCmsText(featuredBooksBlock, 'title', 'Obras em Destaque')}</h2>
            <p className="text-muted">
              {getCmsText(featuredBooksBlock, 'description', 'Uma selecao dos trabalhos mais recentes e premiados.')}
            </p>
          </div>

          <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
            {featuredBooks.map((book) => (
              <BookCard key={book.id} slug={book.slug} title={book.title} subtitle={book.subtitle} coverImage={book.coverImage} year={book.year} />
            ))}
          </div>

          <div className="text-center" style={{ marginTop: 'var(--spacing-lg)' }}>
            <Button to={getCmsText(featuredBooksBlock, 'ctaHref', '/livros')} variant="outline">
              {getCmsText(featuredBooksBlock, 'ctaLabel', 'Ver todo o catalogo')}
            </Button>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="block-split" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 className="text-navy">{getCmsText(authorIntroBlock, 'title', 'Sobre Nilton Amaral')}</h2>
              <p>{getCmsText(authorIntroBlock, 'body')}</p>
              <p>{getCmsText(authorIntroBlock, 'secondaryBody')}</p>
              <Button to={getCmsText(authorIntroBlock, 'ctaHref', '/sobre')} variant="primary" style={{ marginTop: 'var(--spacing-sm)' }}>
                {getCmsText(authorIntroBlock, 'ctaLabel', 'Ler Biografia Completa')}
              </Button>
            </div>

            <div style={{ flex: '1 1 400px' }}>
              <div className="themes-box bg-beige" style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                <h3 className="text-navy" style={{ marginBottom: 'var(--spacing-sm)' }}>
                  {getCmsText(researchThemesBlock, 'title', 'Temas de Pesquisa')}
                </h3>
                <ul className="themes-list" style={{ listStyleType: 'none', padding: 0 }}>
                  {researchThemes.map((theme, index) => (
                    <li
                      key={theme}
                      style={{
                        padding: '0.5rem 0',
                        borderBottom: index === researchThemes.length - 1 ? 'none' : '1px solid var(--color-border)',
                      }}
                    >
                      {theme}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-navy text-center" style={{ padding: 'var(--spacing-xl) 0' }}>
        <div className="container">
          <h2 className="text-gold">{getCmsText(contactCtaBlock, 'title', 'Entrevistas, Palestras e Consultoria')}</h2>
          <p className="text-beige" style={{ maxWidth: '600px', margin: '0 auto var(--spacing-md) auto', opacity: 0.9 }}>
            {getCmsText(
              contactCtaBlock,
              'description',
              'O autor esta disponivel para participacao em eventos academicos, feiras literarias e bancas de avaliacao. Para solicitacoes da imprensa ou convites, entre em contato.',
            )}
          </p>
          <Button to={getCmsText(contactCtaBlock, 'ctaHref', '/contato')} variant="secondary">
            {getCmsText(contactCtaBlock, 'ctaLabel', 'Entrar em Contato')}
          </Button>
        </div>
      </section>
    </>
  );
};

export default Home;
