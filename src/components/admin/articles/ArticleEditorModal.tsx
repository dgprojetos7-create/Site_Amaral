import React, { type ChangeEvent, useMemo, useState } from 'react';
import { CalendarDays, Eye, Image as ImageIcon, Info, Save, Sparkles, X } from 'lucide-react';
import Button from '../../Button';
import type { MediaItem } from '../../../types/cms';
import type { EditableArticleDraft } from '../../../services/article-editor';
import { stripHtml } from '../../../services/article-editor';
import RichTextEditor from './RichTextEditor';
import TagInput from './TagInput';
import ArticlePreviewModal from './ArticlePreviewModal';

interface ArticleEditorModalProps {
  article: EditableArticleDraft;
  media: MediaItem[];
  autosaveStatus: 'idle' | 'saving' | 'saved';
  isSaving: boolean;
  formMessage: string;
  formMessageType: 'success' | 'error';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onFieldChange: <K extends keyof EditableArticleDraft>(field: K, value: EditableArticleDraft[K]) => void;
  tagsInput: string;
  onTagsChange: (value: string) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  article,
  media,
  autosaveStatus,
  isSaving,
  formMessage,
  formMessageType,
  isOpen,
  onClose,
  onSubmit,
  onFieldChange,
  tagsInput,
  onTagsChange,
  onImageUpload,
}) => {
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const selectedImageId = useMemo(
    () => media.find((item) => item.url === article.imageUrl)?.id || '',
    [article.imageUrl, media],
  );

  const readingStats = useMemo(() => {
    const plainText = stripHtml(article.content || article.excerpt);
    const words = plainText ? plainText.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 220));

    return {
      words,
      readingTime,
      seoDescriptionLength: article.metaDescription.length,
    };
  }, [article.content, article.excerpt, article.metaDescription.length]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="article-editor-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
        <div className="article-editor-modal" role="dialog" aria-modal="true">
          <div className="article-editor-header">
            <div>
              <span className="article-editor__eyebrow">Editor editorial</span>
              <h3>{article.id ? 'Refinar artigo' : 'Criar novo artigo'}</h3>
              <p>Organize a escrita na coluna principal e deixe publicacao, SEO e taxonomia na sidebar.</p>
            </div>
            <div className="article-editor-header__actions">
              <span className={`article-editor__autosave article-editor__autosave--${autosaveStatus}`}>
                {autosaveStatus === 'saving' ? 'Salvando rascunho...' : autosaveStatus === 'saved' ? 'Rascunho salvo automaticamente' : 'Edicao pronta'}
              </span>
              <button type="button" className="article-editor__icon-button" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="article-editor-layout">
            <main className="article-editor-main">
              <section className="article-editor-card article-editor-card--hero">
                {formMessage && (
                  <div className={`article-editor-form-message article-editor-form-message--${formMessageType}`} role="alert">
                    {formMessage}
                  </div>
                )}

                <div className="article-editor-card__header">
                  <div>
                    <span className="article-editor__eyebrow">Narrativa</span>
                    <h4>Area principal de escrita</h4>
                  </div>
                  <div className="article-editor-card__header-actions">
                    <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)} className="article-editor-action">
                      <Eye size={16} /> Preview
                    </Button>
                    <Button type="submit" variant="secondary" className="article-editor-action" disabled={isSaving}>
                      <Save size={16} /> {isSaving ? 'Salvando...' : 'Salvar artigo'}
                    </Button>
                  </div>
                </div>

                <div className="article-editor-field">
                  <label htmlFor="article-title">Titulo</label>
                  <input
                    id="article-title"
                    type="text"
                    value={article.title}
                    onChange={(event) => onFieldChange('title', event.target.value)}
                    placeholder="Digite um titulo forte e claro"
                    required
                  />
                </div>

                <div className="article-editor-field">
                  <label htmlFor="article-excerpt">Resumo</label>
                  <textarea
                    id="article-excerpt"
                    rows={4}
                    value={article.excerpt}
                    onChange={(event) => onFieldChange('excerpt', event.target.value)}
                    placeholder="Apresente a ideia central do artigo em poucas linhas"
                  />
                </div>

                <div className="article-editor-field">
                  <label>Conteudo</label>
                  <RichTextEditor value={article.content} onChange={(value) => onFieldChange('content', value)} />
                </div>
              </section>

              <section className="article-editor-card">
                <div className="article-editor-card__header">
                  <div>
                    <span className="article-editor__eyebrow">SEO</span>
                    <h4>Metadados de busca</h4>
                  </div>
                  <span className="article-editor-card__hint"><Sparkles size={14} /> Ajuste para indexacao e compartilhamento</span>
                </div>

                <div className="article-editor-grid">
                  <div className="article-editor-field">
                    <label htmlFor="article-meta-title">Meta title</label>
                    <input
                      id="article-meta-title"
                      type="text"
                      value={article.metaTitle}
                      onChange={(event) => onFieldChange('metaTitle', event.target.value)}
                      placeholder="Titulo para buscadores"
                    />
                  </div>
                  <div className="article-editor-field article-editor-field--full">
                    <label htmlFor="article-meta-description">Meta description</label>
                    <textarea
                      id="article-meta-description"
                      rows={3}
                      value={article.metaDescription}
                      onChange={(event) => onFieldChange('metaDescription', event.target.value)}
                      placeholder="Descricao curta para Google e redes sociais"
                    />
                    <small>{readingStats.seoDescriptionLength}/160 caracteres recomendados</small>
                  </div>
                </div>
              </section>
            </main>

            <aside className="article-editor-sidebar">
              <section className="article-editor-card article-editor-sidebar__card">
                <div className="article-editor-card__header">
                  <div>
                    <span className="article-editor__eyebrow">Publicacao</span>
                    <h4>Configuracoes</h4>
                  </div>
                </div>

                <div className="article-editor-field">
                  <label htmlFor="article-status">Status</label>
                  <select id="article-status" value={article.status} onChange={(event) => onFieldChange('status', event.target.value as EditableArticleDraft['status'])}>
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>

                <div className="article-editor-field">
                  <label htmlFor="article-date">Data</label>
                  <div className="article-editor-input-icon">
                    <CalendarDays size={16} />
                    <input id="article-date" type="date" value={article.publishedAt} onChange={(event) => onFieldChange('publishedAt', event.target.value)} />
                  </div>
                </div>

                <div className="article-editor-field">
                  <label htmlFor="article-display-date">Data de exibicao</label>
                  <input id="article-display-date" type="text" value={article.displayDate} onChange={(event) => onFieldChange('displayDate', event.target.value)} />
                </div>

                <div className="article-editor-field">
                  <label htmlFor="article-author-name">Autor do artigo</label>
                  <input
                    id="article-author-name"
                    type="text"
                    value={article.authorName}
                    onChange={(event) => onFieldChange('authorName', event.target.value)}
                    placeholder="Opcional"
                  />
                </div>

                <div className="article-editor-field">
                  <label htmlFor="article-category">Categoria</label>
                  <input id="article-category" type="text" value={article.category} onChange={(event) => onFieldChange('category', event.target.value)} />
                </div>

                <div className="article-editor-field">
                  <label htmlFor="article-slug">Slug</label>
                  <input id="article-slug" type="text" value={article.slug} onChange={(event) => onFieldChange('slug', event.target.value)} />
                </div>

                <div className="article-editor-field">
                  <label>Tags</label>
                  <TagInput value={tagsInput} tags={article.tags} onChange={onTagsChange} />
                </div>
              </section>

              <section className="article-editor-card article-editor-sidebar__card">
                <div className="article-editor-card__header">
                  <div>
                    <span className="article-editor__eyebrow">Midia</span>
                    <h4>Imagem de destaque</h4>
                  </div>
                </div>

                <div className="article-editor-cover">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title || 'Preview da imagem de destaque'} />
                  ) : (
                    <div className="article-editor-cover__placeholder">
                      <ImageIcon size={22} />
                      <span>Nenhuma imagem selecionada</span>
                    </div>
                  )}
                </div>

                <div className="article-editor-field">
                  <label htmlFor="article-media-select">Biblioteca</label>
                  <select
                    id="article-media-select"
                    value={selectedImageId}
                    onChange={(event) => {
                      const selected = media.find((item) => item.id === Number(event.target.value));
                      onFieldChange('imageUrl', selected?.url || '');
                    }}
                  >
                    <option value="">Selecionar imagem da biblioteca</option>
                    {media.map((item) => (
                      <option key={item.id} value={item.id}>{item.title || item.url}</option>
                    ))}
                  </select>
                </div>

                <div className="article-editor-field">
                  <label htmlFor="article-image-url">URL da imagem</label>
                  <input id="article-image-url" type="url" value={article.imageUrl} onChange={(event) => onFieldChange('imageUrl', event.target.value)} placeholder="https://..." />
                </div>

                <label className="article-editor-upload">
                  <span>Upload local para preview</span>
                  <input type="file" accept="image/*" onChange={(event) => void onImageUpload(event)} />
                </label>
              </section>

              <section className="article-editor-card article-editor-sidebar__card">
                <div className="article-editor-card__header">
                  <div>
                    <span className="article-editor__eyebrow">Resumo rapido</span>
                    <h4>Indicadores</h4>
                  </div>
                </div>

                <div className="article-editor-stats">
                  <div>
                    <strong>{readingStats.words}</strong>
                    <span>palavras</span>
                  </div>
                  <div>
                    <strong>{readingStats.readingTime} min</strong>
                    <span>leitura</span>
                  </div>
                </div>

                <div className="article-editor-note">
                  <Info size={16} />
                  <span>O slug acompanha o titulo automaticamente ate voce editar manualmente.</span>
                </div>
              </section>
            </aside>
          </form>
        </div>
      </div>

      {isPreviewOpen && <ArticlePreviewModal article={article} onClose={() => setPreviewOpen(false)} />}
    </>
  );
};

export default ArticleEditorModal;
