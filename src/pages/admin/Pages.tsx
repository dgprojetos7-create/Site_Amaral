import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { cmsApi } from '../../api/cms';
import {
  cmsPageDefinitions,
  type CmsBlockFieldDefinition,
} from '../../lib/cms-pages';
import { usePublicSite } from '../../context/usePublicSite';
import type { CmsPage, CmsPageBlock, CmsPageSlug, MediaItem } from '../../types/cms';

const pageOrder: CmsPageSlug[] = ['home', 'about', 'contact', 'site'];

const getCurrentPage = (pages: CmsPage[], slug: CmsPageSlug) =>
  pages.find((page) => page.slug === slug) || null;

const getBlockValue = (block: CmsPageBlock, field: CmsBlockFieldDefinition) => {
  const value = block.data[field.key];

  if (field.kind === 'list') {
    return Array.isArray(value) ? value.join('\n') : '';
  }

  return typeof value === 'string' ? value : '';
};

const AdminPages: React.FC = () => {
  const { refresh } = usePublicSite();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState<CmsPageSlug>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const loadPages = async () => {
      try {
        const [nextPages, nextMedia] = await Promise.all([
          cmsApi.getPages(),
          cmsApi.getMedia(),
        ]);
        setPages(nextPages);
        setMedia(nextMedia.filter((item) => item.mediaType === 'image'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadPages();
  }, []);

  const currentPage = getCurrentPage(pages, selectedPageSlug);
  const currentDefinition = cmsPageDefinitions[selectedPageSlug];

  const updateCurrentPage = (updater: (page: CmsPage) => CmsPage) => {
    setPages((currentPages) =>
      currentPages.map((page) => (page.slug === selectedPageSlug ? updater(page) : page)),
    );
  };

  const updateBlockField = (blockKey: string, fieldKey: string, value: string | string[]) => {
    updateCurrentPage((page) => ({
      ...page,
      blocks: page.blocks.map((block) =>
        block.key === blockKey
          ? {
              ...block,
              data: {
                ...block.data,
                [fieldKey]: value,
              },
            }
          : block,
      ),
    }));
  };

  const updatePageField = (
    field: keyof Pick<CmsPage, 'title' | 'description' | 'seoTitle' | 'seoDescription' | 'status'>,
    value: string,
  ) => {
    updateCurrentPage((page) => ({
      ...page,
      [field]: value,
    }));
  };

  const toggleBlock = (blockKey: string, isActive: boolean) => {
    updateCurrentPage((page) => ({
      ...page,
      blocks: page.blocks.map((block) => (block.key === blockKey ? { ...block, isActive } : block)),
    }));
  };

  const handleSave = async () => {
    if (!currentPage) {
      return;
    }

    setIsSaving(true);
    setStatusMessage('');

    try {
      const savedPage = await cmsApi.updatePage(currentPage.slug, currentPage);
      setPages((currentPages) =>
        currentPages.map((page) => (page.slug === savedPage.slug ? savedPage : page)),
      );
      await refresh();
      setStatusMessage(`Pagina "${savedPage.title}" salva com sucesso.`);
    } catch (requestError) {
      setStatusMessage(requestError instanceof Error ? requestError.message : 'Nao foi possivel salvar a pagina.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="card" style={{ padding: '1.5rem' }}>Carregando paginas do CMS...</div>;
  }

  if (!currentPage) {
    return <div className="card" style={{ padding: '1.5rem' }}>Nao foi possivel carregar a pagina selecionada.</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {statusMessage && <div className="card" style={{ padding: '1rem' }}>{statusMessage}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        <aside className="card" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
          <div>
            <h3 className="text-navy" style={{ marginBottom: '0.35rem' }}>CMS de Paginas</h3>
            <p style={{ margin: 0, color: '#64748b' }}>
              Estrutura editorial inspirada em WordPress, com paginas e blocos reutilizaveis.
            </p>
          </div>

          {pageOrder.map((slug) => {
            const definition = cmsPageDefinitions[slug];
            const page = getCurrentPage(pages, slug);
            const isActive = selectedPageSlug === slug;

            return (
              <button
                key={slug}
                type="button"
                onClick={() => setSelectedPageSlug(slug)}
                style={{
                  textAlign: 'left',
                  padding: '0.9rem 1rem',
                  borderRadius: '12px',
                  border: isActive ? '1px solid var(--color-navy)' : '1px solid var(--color-border)',
                  background: isActive ? 'rgba(10, 25, 47, 0.08)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <strong style={{ display: 'block', color: '#0f172a' }}>{definition.label}</strong>
                <span style={{ display: 'block', color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  {page?.status === 'published' ? 'Publicado' : 'Rascunho'}
                </span>
              </button>
            );
          })}
        </aside>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <section className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ display: 'inline-block', color: '#64748b', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Pagina</span>
                <h3 className="text-navy" style={{ marginBottom: '0.35rem' }}>{currentDefinition.label}</h3>
                <p style={{ margin: 0, color: '#64748b' }}>{currentDefinition.description}</p>
              </div>

              <button type="button" onClick={() => void handleSave()} className="admin-save-btn" disabled={isSaving}>
                {isSaving ? 'Salvando...' : <Save size={18} />}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Titulo interno</label>
                <input type="text" value={currentPage.title} onChange={(event) => updatePageField('title', event.target.value)} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={currentPage.status} onChange={(event) => updatePageField('status', event.target.value)}>
                  <option value="published">Publicado</option>
                  <option value="draft">Rascunho</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Descricao interna</label>
                <textarea rows={3} value={currentPage.description} onChange={(event) => updatePageField('description', event.target.value)} />
              </div>
              <div className="form-group">
                <label>SEO Title</label>
                <input type="text" value={currentPage.seoTitle} onChange={(event) => updatePageField('seoTitle', event.target.value)} />
              </div>
              <div className="form-group">
                <label>SEO Description</label>
                <textarea rows={3} value={currentPage.seoDescription} onChange={(event) => updatePageField('seoDescription', event.target.value)} />
              </div>
            </div>
          </section>

          {selectedPageSlug === 'site' && (
            <section
              className="card"
              style={{
                padding: '1rem 1.25rem',
                borderLeft: '4px solid var(--color-gold)',
                background: 'rgba(10, 25, 47, 0.03)',
              }}
            >
              <strong style={{ display: 'block', color: '#0f172a', marginBottom: '0.35rem' }}>
                Edicao do rodape publico
              </strong>
              <p style={{ margin: 0, color: '#64748b' }}>
                Os blocos abaixo controlam a area final do site. Voce pode editar os textos e usar
                `Exibir bloco` para mostrar ou ocultar cada parte.
              </p>
            </section>
          )}

          {currentPage.blocks
            .slice()
            .sort((first, second) => first.sortOrder - second.sortOrder)
            .map((block) => {
              const blockDefinition = currentDefinition.blocks[block.key];

              if (!blockDefinition) {
                return null;
              }

              return (
                <section key={block.key} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h4 className="text-navy" style={{ marginBottom: '0.35rem' }}>{blockDefinition.label}</h4>
                      <p style={{ margin: 0, color: '#64748b' }}>{blockDefinition.description}</p>
                    </div>

                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9rem', color: '#475569' }}>
                      <input type="checkbox" checked={block.isActive} onChange={(event) => toggleBlock(block.key, event.target.checked)} />
                      Exibir bloco
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {blockDefinition.fields.map((field) => {
                      const value = getBlockValue(block, field);
                      const isWide = field.kind !== 'text';
                      const selectedMedia = media.find((item) => item.url === value);

                      return (
                        <div key={`${block.key}-${field.key}`} className="form-group" style={isWide ? { gridColumn: '1 / -1' } : undefined}>
                          <label>{field.label}</label>
                          {field.kind === 'text' ? (
                            <input
                              type="text"
                              value={value}
                              onChange={(event) => updateBlockField(block.key, field.key, event.target.value)}
                            />
                          ) : field.kind === 'image' ? (
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                              <select
                                value={selectedMedia?.id || ''}
                                onChange={(event) => {
                                  const selected = media.find((item) => item.id === Number(event.target.value));
                                  updateBlockField(block.key, field.key, selected?.url || '');
                                }}
                              >
                                <option value="">Selecionar da biblioteca de midia</option>
                                {media.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.title || item.url}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="url"
                                value={value}
                                placeholder="https://... ou data:image/..."
                                onChange={(event) => updateBlockField(block.key, field.key, event.target.value)}
                              />
                              {value && (
                                <div
                                  style={{
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '12px',
                                    padding: '0.75rem',
                                    background: '#fff',
                                    maxWidth: '260px',
                                  }}
                                >
                                  <img
                                    src={value}
                                    alt={field.label}
                                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <textarea
                              rows={field.rows || 5}
                              value={value}
                              onChange={(event) =>
                                updateBlockField(
                                  block.key,
                                  field.key,
                                  field.kind === 'list'
                                    ? event.target.value
                                        .split('\n')
                                        .map((item) => item.trim())
                                        .filter(Boolean)
                                    : event.target.value,
                                )
                              }
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </div>
      </div>

      <style>{`
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--color-gray);
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.7rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          outline: none;
          font-family: inherit;
          background: white;
        }

        .admin-save-btn {
          background: var(--color-navy);
          color: white;
          border: none;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 110px;
        }

        .admin-save-btn:hover {
          background: var(--color-gold);
          color: var(--color-navy);
        }

        .admin-save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AdminPages;
