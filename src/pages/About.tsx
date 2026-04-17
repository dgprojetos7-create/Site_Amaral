import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getCmsList, getCmsPageBlock, getCmsPageBySlug, getCmsText } from '../lib/cms-pages';
import { usePublicSite } from '../context/usePublicSite';

const About: React.FC = () => {
  const { pages, siteSections, isLoading, error } = usePublicSite();
  const aboutPage = getCmsPageBySlug(pages, 'about');
  const heroBlock = getCmsPageBlock(aboutPage, 'hero');
  const biographyBlock = getCmsPageBlock(aboutPage, 'biography');
  const academicBlock = getCmsPageBlock(aboutPage, 'academicBackground');
  const awardsBlock = getCmsPageBlock(aboutPage, 'selectedAwards');
  const biographyPortraitUrl = getCmsText(biographyBlock, 'portraitUrl', '/autor.jpg');
  const biographyPortraitAlt = getCmsText(
    biographyBlock,
    'portraitAlt',
    'Nilton Amaral em seu escritorio',
  );
  const academicItems = getCmsList(academicBlock, 'items');
  const awardItems = getCmsList(awardsBlock, 'items');

  return (
    <>
      <Helmet>
        <title>{aboutPage?.seoTitle || 'Sobre o Autor | Nilton Amaral'}</title>
        <meta
          name="description"
          content={aboutPage?.seoDescription || 'Biografia, formacao academica e trajetoria literaria do escritor Nilton Celio da Silva Amaral.'}
        />
      </Helmet>

      <section className="bg-navy" style={{ padding: 'var(--spacing-xl) 0 var(--spacing-lg) 0' }}>
        <div className="container text-center">
          <h1 className="text-gold">{getCmsText(heroBlock, 'title', 'Sobre o Autor')}</h1>
          <p className="text-beige" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            {getCmsText(heroBlock, 'subtitle', 'Uma vida dedicada a interseccao entre a historia, a filosofia e a literatura.')}
          </p>
        </div>
      </section>

      <section className="section bg-beige">
        <div className="container">
          {isLoading && <p>Carregando biografia...</p>}
          {error && <p>{error}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'var(--color-white)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <div style={{ float: 'left', marginRight: '2rem', marginBottom: '1rem', width: '100%', maxWidth: '300px' }}>
                  <img
                    src={biographyPortraitUrl}
                    alt={biographyPortraitAlt}
                    style={{ borderRadius: 'var(--radius-sm)', width: '100%', height: 'auto', filter: 'grayscale(20%) sepia(10%)' }}
                  />
                </div>

                <h2 className="text-navy">{getCmsText(biographyBlock, 'title', 'Trajetoria')}</h2>
                <p>{getCmsText(biographyBlock, 'trajetoria', siteSections?.about.trajetoria || '')}</p>

                <h2 className="text-navy" style={{ marginTop: 'var(--spacing-md)' }}>
                  {getCmsText(biographyBlock, 'transitionTitle', 'A Transicao para a Literatura')}
                </h2>
                <p>{getCmsText(biographyBlock, 'transicao', siteSections?.about.transicao || '')}</p>
                <p>
                  {getCmsText(
                    biographyBlock,
                    'closingParagraph',
                    'Desde entao, o autor tem alternado entre a publicacao de ficcao e ensaios, sendo reconhecido por um estilo literario de prosa analitica e elegiaca.',
                  )}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-navy" style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>Formacao e Honrarias</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                <div className="card" style={{ padding: 'var(--spacing-md)' }}>
                  <h3 className="text-gold" style={{ fontSize: '1.2rem' }}>{getCmsText(academicBlock, 'title', 'Formacao Academica')}</h3>
                  <ul style={{ marginTop: 'var(--spacing-sm)', paddingLeft: '1.2rem', color: 'var(--color-gray)' }}>
                    {academicItems.map((item) => (
                      <li key={item} style={{ marginBottom: '0.5rem' }}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-md)' }}>
                  <h3 className="text-gold" style={{ fontSize: '1.2rem' }}>{getCmsText(awardsBlock, 'title', 'Premios Selecionados')}</h3>
                  <ul style={{ marginTop: 'var(--spacing-sm)', paddingLeft: '1.2rem', color: 'var(--color-gray)' }}>
                    {awardItems.map((item) => (
                      <li key={item} style={{ marginBottom: '0.5rem' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
