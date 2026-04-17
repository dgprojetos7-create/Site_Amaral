import React from 'react';
import { Link } from 'react-router-dom';
import { usePublicSite } from '../context/usePublicSite';
import { findCmsPageBlock, getCmsPageBySlug, getCmsText } from '../lib/cms-pages';

const Footer: React.FC = () => {
  const { pages } = usePublicSite();
  const sitePage = getCmsPageBySlug(pages, 'site');
  const footerBrand = findCmsPageBlock(sitePage, 'footerBrand');
  const footerNavigation = findCmsPageBlock(sitePage, 'footerNavigation');
  const footerContact = findCmsPageBlock(sitePage, 'footerContact');
  const footerLegal = findCmsPageBlock(sitePage, 'footerLegal');
  const showBrand = footerBrand?.isActive ?? true;
  const showNavigation = footerNavigation?.isActive ?? true;
  const showContact = footerContact?.isActive ?? true;
  const showLegal = footerLegal?.isActive ?? true;
  const navigationLinks = [
    {
      label: getCmsText(footerNavigation, 'link1Label', 'Sobre o Autor'),
      href: getCmsText(footerNavigation, 'link1Href', '/sobre'),
    },
    {
      label: getCmsText(footerNavigation, 'link2Label', 'Livros'),
      href: getCmsText(footerNavigation, 'link2Href', '/livros'),
    },
    {
      label: getCmsText(footerNavigation, 'link3Label', 'Blog'),
      href: getCmsText(footerNavigation, 'link3Href', '/blog'),
    },
    {
      label: getCmsText(footerNavigation, 'link4Label', 'Contato'),
      href: getCmsText(footerNavigation, 'link4Href', '/contato'),
    },
  ].filter((item) => item.label && item.href);
  const hasTopContent = showBrand || showNavigation || showContact;

  return (
    <footer
      className="bg-navy section"
      style={{
        paddingTop: hasTopContent ? '1.25rem' : '0.75rem',
        paddingBottom: showLegal ? '0.8rem' : '0.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        {hasTopContent && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.9rem 1.5rem',
              marginBottom: showLegal ? '0.8rem' : 0,
            }}
          >
            {showBrand && (
              <div style={{ maxWidth: '430px' }}>
                <h3 className="text-gold text-serif" style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', lineHeight: 1.1 }}>
                  {getCmsText(footerBrand, 'siteTitle', 'Nilton Amaral')}
                </h3>
                <p style={{ color: 'var(--color-beige)', opacity: 0.74, fontSize: '0.88rem', lineHeight: 1.45, margin: 0 }}>
                  {getCmsText(
                    footerBrand,
                    'description',
                    'Escritor, pesquisador e autor independente. Explorando as profundezas da condicao humana atraves da literatura academica e ficcional.',
                  )}
                </p>
              </div>
            )}

            {showNavigation && navigationLinks.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h4 className="text-gold" style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                  {getCmsText(footerNavigation, 'title', 'Links Rapidos')}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.35rem 0.9rem', margin: 0, padding: 0 }}>
                  {navigationLinks.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link to={link.href} style={{ color: 'var(--color-beige)', opacity: 0.8, fontSize: '0.9rem' }}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showContact && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h4 className="text-gold" style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                  {getCmsText(footerContact, 'title', 'Contato')}
                </h4>
                <p style={{ color: 'var(--color-beige)', opacity: 0.8, fontSize: '0.9rem', margin: 0 }}>
                  {getCmsText(footerContact, 'email', 'contato@niltonamaral.com.br')}
                </p>
                <span style={{ color: 'rgba(245, 235, 220, 0.3)' }}>•</span>
                <p style={{ color: 'var(--color-beige)', opacity: 0.8, fontSize: '0.9rem', margin: 0 }}>
                  {getCmsText(footerContact, 'location', 'Sao Paulo, SP - Brasil')}
                </p>
              </div>
            )}
          </div>
        )}

        {showLegal && (
          <div
            style={{
              borderTop: hasTopContent ? '1px solid rgba(255,255,255,0.08)' : 'none',
              paddingTop: hasTopContent ? '0.7rem' : 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.6rem 1rem',
              fontSize: '0.78rem',
              color: 'var(--color-beige)',
              opacity: 0.66,
            }}
          >
            <p style={{ margin: 0 }}>
              {getCmsText(
                footerLegal,
                'copyrightText',
                `Copyright ${new Date().getFullYear()} Nilton Celio da Silva Amaral. Todos os direitos reservados.`,
              )}
            </p>
            <Link to={getCmsText(footerLegal, 'privacyHref', '/privacidade')} style={{ color: 'inherit' }}>
              {getCmsText(footerLegal, 'privacyLabel', 'Politica de Privacidade')}
            </Link>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 900px) {
          footer .container > div:first-child {
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
