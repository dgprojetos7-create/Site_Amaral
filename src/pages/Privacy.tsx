import React from 'react';
import { Helmet } from 'react-helmet-async';
import { usePublicSite } from '../context/usePublicSite';

const Privacy: React.FC = () => {
  const { siteSections } = usePublicSite();

  return (
    <>
      <Helmet>
        <title>Política de Privacidade | Nilton Amaral</title>
        <meta name="description" content="Política de privacidade do site oficial de Nilton Amaral." />
      </Helmet>

      <section className="bg-navy" style={{ padding: 'var(--spacing-xl) 0 var(--spacing-lg) 0' }}>
        <div className="container text-center">
          <h1 className="text-gold">Política de Privacidade</h1>
          <p className="text-beige" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <h2 className="text-navy" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>1. Coleta de Informações</h2>
              <p>
                Coletamos informações que você nos fornece diretamente, como quando preenche o formulário
                de contato. Os tipos de informações que podemos coletar incluem seu nome, endereço de e-mail e qualquer
                outra informação que você opte por fornecer na sua mensagem.
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <h2 className="text-navy" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>2. Uso das Informações</h2>
              <p>
                Utilizamos as informações que coletamos para responder às suas solicitações, comentários e perguntas,
                e para fornecer suporte. Seus dados não serão compartilhados, vendidos ou alugados para terceiros
                sob nenhuma circunstância, exceto mediante exigência legal.
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <h2 className="text-navy" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>3. Cookies e Tecnologias de Rastreamento</h2>
              <p>
                Este site pode utilizar cookies básicos estritamente necessários para o seu funcionamento adequado.
                Não utilizamos cookies de rastreamento de terceiros com fins publicitários.
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <h2 className="text-navy" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>4. Segurança</h2>
              <p>
                Tomamos medidas razoáveis para ajudar a proteger as informações sobre você contra perda, roubo,
                uso indevido e acesso não autorizado, divulgação, alteração e destruição.
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <h2 className="text-navy" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>5. Contato</h2>
              <p>
                Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através do
                e-mail:{' '}
                <a href={`mailto:${siteSections?.contact.email || 'contato@niltonamaral.com.br'}`} style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                  {siteSections?.contact.email || 'contato@niltonamaral.com.br'}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Privacy;
