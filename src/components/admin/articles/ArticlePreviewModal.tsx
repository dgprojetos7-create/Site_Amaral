import React from 'react';
import { CalendarDays, Tag, X } from 'lucide-react';
import type { EditableArticleDraft } from '../../../services/article-editor';
import { buildPreviewArticle } from '../../../services/article-editor';

interface ArticlePreviewModalProps {
  article: EditableArticleDraft;
  onClose: () => void;
}

const ArticlePreviewModal: React.FC<ArticlePreviewModalProps> = ({ article, onClose }) => {
  const preview = buildPreviewArticle(article);

  return (
    <div className="article-preview-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="article-preview-modal">
        <div className="article-preview-modal__header">
          <div>
            <span className="article-editor__eyebrow">Preview</span>
            <h3>Como o artigo fica para leitura</h3>
          </div>
          <button type="button" className="article-editor__icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <article className="article-preview-sheet">
          <div className="article-preview-sheet__meta">
            <span><CalendarDays size={14} /> {preview.displayDate || preview.publishedAt}</span>
            <span>{preview.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
          </div>
          {preview.authorName && <div className="article-preview-sheet__author">Por {preview.authorName}</div>}
          <h1>{preview.title}</h1>
          <p className="article-preview-sheet__excerpt">{preview.excerpt}</p>
          {preview.imageUrl && <img src={preview.imageUrl} alt={preview.title} className="article-preview-sheet__image" />}
          <div className="article-preview-sheet__content" dangerouslySetInnerHTML={{ __html: preview.content }} />
          {preview.tags.length > 0 && (
            <div className="article-preview-sheet__tags">
              {preview.tags.map((tag) => (
                <span key={tag}><Tag size={12} /> {tag}</span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default ArticlePreviewModal;
