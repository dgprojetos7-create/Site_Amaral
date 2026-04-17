import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Phone } from 'lucide-react';
import Button from '../components/Button';
import { getCmsList, getCmsPageBlock, getCmsPageBySlug, getCmsText } from '../lib/cms-pages';
import { usePublicSite } from '../context/usePublicSite';

const Contact: React.FC = () => {
  const { pages, siteSections, isLoading, error } = usePublicSite();
  const contactPage = getCmsPageBySlug(pages, 'contact');
  const heroBlock = getCmsPageBlock(contactPage, 'hero');
  const introBlock = getCmsPageBlock(contactPage, 'intro');
  const contactDetailsBlock = getCmsPageBlock(contactPage, 'contactDetails');
  const contactFormBlock = getCmsPageBlock(contactPage, 'contactForm');
  const subjectOptions = getCmsList(contactFormBlock, 'subjectOptions', [
    'Mensagem de Leitor',
    'Solicitacao de Imprensa',
    'Convite Academico',
    'Direitos Autorais',
    'Outro',
  ]);

  return (
    <>
      <Helmet>
        <title>{contactPage?.seoTitle || 'Contato | Nilton Amaral'}</title>
        <meta
          name="description"
          content={contactPage?.seoDescription || 'Entre em contato com Nilton Celio da Silva Amaral para palestras, entrevistas ou mensagens de leitores.'}
        />
      </Helmet>

      <section className="bg-navy" style={{ padding: 'var(--spacing-xl) 0 var(--spacing-lg) 0' }}>
        <div className="container text-center">
          <h1 className="text-gold">{getCmsText(heroBlock, 'title', 'Contato Institucional')}</h1>
          <p className="text-beige" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            {getCmsText(heroBlock, 'subtitle', 'Para convites academicos, solicitacoes da imprensa e correspondencia com leitores.')}
          </p>
        </div>
      </section>

      <section className="section bg-beige">
        <div className="container">
          {isLoading && <p>Carregando informacoes de contato...</p>}
          {error && <p>{error}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-xl)', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <h2 className="text-navy">{getCmsText(introBlock, 'title', 'Vamos conversar')}</h2>
                <p>{getCmsText(introBlock, 'body')}</p>
                <p>{getCmsText(introBlock, 'secondaryBody')}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-gold)', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--color-navy)' }}>{getCmsText(contactDetailsBlock, 'emailTitle', 'E-mail Direto')}</h4>
                    <p style={{ margin: 0, color: 'var(--color-gray-light)' }}>{getCmsText(contactDetailsBlock, 'email', siteSections?.contact.email || '')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-gold)', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--color-navy)' }}>{getCmsText(contactDetailsBlock, 'phoneTitle', 'Assessoria de Imprensa')}</h4>
                    <p style={{ margin: 0, color: 'var(--color-gray-light)' }}>{getCmsText(contactDetailsBlock, 'phone', siteSections?.contact.phone || '')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-gold)', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--color-navy)' }}>{getCmsText(contactDetailsBlock, 'addressTitle', 'Correspondencia Fisica')}</h4>
                    <p style={{ margin: 0, color: 'var(--color-gray-light)' }}>
                      {getCmsText(contactDetailsBlock, 'address', siteSections?.contact.address || '')}
                      <br />
                      {getCmsText(contactDetailsBlock, 'postalCode', 'CEP 01000-000')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-white)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
              <h3 className="text-navy" style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-primary)' }}>
                {getCmsText(contactFormBlock, 'title', 'Envie uma mensagem')}
              </h3>
              <form onSubmit={(event) => event.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="name" style={{ fontWeight: 500, color: 'var(--color-gray)' }}>Nome Completo *</label>
                  <input type="text" id="name" required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'var(--font-primary)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="email" style={{ fontWeight: 500, color: 'var(--color-gray)' }}>E-mail *</label>
                  <input type="email" id="email" required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'var(--font-primary)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="subject" style={{ fontWeight: 500, color: 'var(--color-gray)' }}>Assunto</label>
                  <select id="subject" style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'var(--font-primary)', backgroundColor: 'transparent' }}>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="message" style={{ fontWeight: 500, color: 'var(--color-gray)' }}>Mensagem *</label>
                  <textarea id="message" rows={5} required style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'var(--font-primary)', resize: 'vertical' }} />
                </div>

                <Button type="submit" variant="primary" style={{ marginTop: '0.5rem' }}>
                  {getCmsText(contactFormBlock, 'submitLabel', 'Enviar Mensagem')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
