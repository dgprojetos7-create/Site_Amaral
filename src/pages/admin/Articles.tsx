import React, { type ChangeEvent, useEffect, useState } from 'react';
import { Check, Edit2, Eye, Plus, Search, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import ArticleEditorModal from '../../components/admin/articles/ArticleEditorModal';
import { cmsApi } from '../../api/cms';
import { useArticleEditor } from '../../hooks/useArticleEditor';
import { createEmptyArticleDraft, normalizeArticleDraft } from '../../services/article-editor';
import { isOversizedInlineImage, optimizeImageForStorage } from '../../services/image-upload';
import type { Article, MediaItem } from '../../types/cms';
import './Books.css';
import '../../components/admin/articles/ArticleEditor.css';

type EditableArticle = Partial<Article> & { id?: number };

const AdminArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<EditableArticle | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formMessageType, setFormMessageType] = useState<'success' | 'error'>('success');
  const [isSaving, setIsSaving] = useState(false);
  const { draft, tagsInput, autosaveStatus, updateDraft, updateTags, resetDraft, clearStoredDraft } = useArticleEditor(selectedArticle, isModalOpen);

  const loadArticles = async () => {
    const [nextArticles, nextMedia] = await Promise.all([
      cmsApi.getArticles(),
      cmsApi.getMedia(),
    ]);

    setArticles(nextArticles);
    setMedia(nextMedia.filter((item) => item.mediaType === 'image'));
  };

  useEffect(() => {
    void loadArticles();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este artigo?')) {
      return;
    }

    await cmsApi.deleteArticle(id);
    await loadArticles();
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setFormMessage('');

    try {
      const payload = normalizeArticleDraft(draft);

      if (isOversizedInlineImage(payload.imageUrl)) {
        throw new Error('A imagem local ainda esta grande demais. Use uma imagem menor ou selecione uma da biblioteca.');
      }

      if (draft.id) {
        await cmsApi.updateArticle(draft.id, payload);
        setMessage('Artigo atualizado com sucesso.');
        setFormMessage('Artigo atualizado com sucesso.');
      } else {
        await cmsApi.createArticle(payload);
        setMessage('Artigo criado com sucesso.');
        setFormMessage('Artigo criado com sucesso.');
      }

      setFormMessageType('success');
      clearStoredDraft();
      setModalOpen(false);
      setSelectedArticle(createEmptyArticleDraft());
      await loadArticles();
    } catch (requestError) {
      const errorMessage = requestError instanceof Error ? requestError.message : 'Nao foi possivel salvar o artigo.';
      setMessage(errorMessage);
      setFormMessage(errorMessage);
      setFormMessageType('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const imageUrl = await optimizeImageForStorage(file);
      updateDraft('imageUrl', imageUrl);
      setFormMessage('Imagem otimizada e pronta para salvar.');
      setFormMessageType('success');
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Nao foi possivel processar a imagem.');
      setFormMessageType('error');
    }

    event.target.value = '';
  };

  const filteredArticles = articles.filter((article) => article.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-articles-page books-page-shell">
      {message && <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>{message}</div>}

      <div className="books-toolbar">
        <div className="books-search">
          <Search size={18} className="books-search-icon" />
          <input
            type="text"
            placeholder="Buscar por titulo..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <Button
          onClick={() => {
            resetDraft();
            setSelectedArticle(createEmptyArticleDraft());
            setFormMessage('');
            setFormMessageType('success');
            setModalOpen(true);
          }}
          variant="secondary"
          className="books-primary-action"
        >
          <Plus size={18} /> Novo Artigo
        </Button>
      </div>

      <div className="card books-table-card">
        <table className="books-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Data</th>
              <th>Categoria</th>
              <th>Status</th>
              <th className="books-table-actions-header">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id} className="books-row">
                <td>
                  <div className="books-row-title">{article.title}</div>
                  <div className="books-row-year">{article.slug}</div>
                </td>
                <td>{article.displayDate || article.publishedAt}</td>
                <td><span className="books-category-pill">{article.category}</span></td>
                <td>
                  <span className={`books-status books-status--${article.status}`}>
                    {article.status === 'published' ? <Check size={14} /> : <Eye size={14} />}
                    {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td>
                  <div className="books-row-actions">
                    <button type="button" className="admin-icon-btn" onClick={() => { setSelectedArticle(article); setFormMessage(''); setFormMessageType('success'); setModalOpen(true); }}>
                      <Edit2 size={16} />
                    </button>
                    <button type="button" className="admin-icon-btn danger" onClick={() => void handleDelete(article.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ArticleEditorModal
        article={draft}
        media={media}
        autosaveStatus={autosaveStatus}
        isSaving={isSaving}
        formMessage={formMessage}
        formMessageType={formMessageType}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        onFieldChange={updateDraft}
        tagsInput={tagsInput}
        onTagsChange={updateTags}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
};

export default AdminArticles;
