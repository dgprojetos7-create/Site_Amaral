import React, { ChangeEvent, useEffect, useState } from 'react';
import { Check, Edit2, Eye, Image as ImageIcon, Plus, Search, Trash2, X } from 'lucide-react';
import Button from '../../components/Button';
import { cmsApi } from '../../api/cms';
import { isOversizedInlineImage, optimizeImageForStorage } from '../../services/image-upload';
import type { Book, MediaItem } from '../../types/cms';
import './Books.css';

type EditableBook = Partial<Book> & { id?: number };

const emptyBook = (): EditableBook => ({
  slug: '',
  title: '',
  subtitle: '',
  year: new Date().getFullYear().toString(),
  coverImage: '/livro1.png',
  category: 'Religiao',
  synopsis: '',
  isbn: '',
  physicalPurchaseLink: '',
  ebookPurchaseLink: '',
  showReviewSection: false,
  showTechnicalDetails: false,
  showPurchaseLinks: false,
  reviewText: '',
  reviewSource: '',
  publisher: '',
  pageCount: '',
  technicalYear: new Date().getFullYear().toString(),
  format: '',
  technicalDetailsExtra: '',
  isFeatured: false,
  status: 'draft',
});

const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<EditableBook>(emptyBook());
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formMessageType, setFormMessageType] = useState<'success' | 'error'>('success');
  const [isSaving, setIsSaving] = useState(false);

  const loadBooks = async () => {
    const [nextBooks, nextMedia] = await Promise.all([
      cmsApi.getBooks(),
      cmsApi.getMedia(),
    ]);
    setBooks(nextBooks);
    setMedia(nextMedia.filter((item) => item.mediaType === 'image'));
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  const updateCurrentBook = <K extends keyof EditableBook>(field: K, value: EditableBook[K]) => {
    setCurrentBook((previous) => ({ ...previous, [field]: value }));
  };

  const handleCoverChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const imageUrl = await optimizeImageForStorage(file);
      updateCurrentBook('coverImage', imageUrl);
      setFormMessage('Imagem otimizada e pronta para salvar.');
      setFormMessageType('success');
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Nao foi possivel processar a imagem selecionada.');
      setFormMessageType('error');
    }

    event.target.value = '';
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este livro?')) {
      return;
    }

    await cmsApi.deleteBook(id);
    await loadBooks();
  };

  const persistBook = async (statusOverride?: Book['status']) => {
    setIsSaving(true);
    setFormMessage('');

    try {
      const payload = {
        ...currentBook,
        status: statusOverride || currentBook.status || 'draft',
      };

      if (isOversizedInlineImage(payload.coverImage || '')) {
        throw new Error('A imagem da capa ainda esta grande demais. Use uma imagem menor ou selecione uma da biblioteca.');
      }

      if (payload.id) {
        await cmsApi.updateBook(payload.id, payload);
        setMessage('Livro atualizado com sucesso.');
        setFormMessage('Livro atualizado com sucesso.');
      } else {
        await cmsApi.createBook(payload);
        setMessage('Livro criado com sucesso.');
        setFormMessage('Livro criado com sucesso.');
      }

      setFormMessageType('success');
      setModalOpen(false);
      setCurrentBook(emptyBook());
      await loadBooks();
    } catch (requestError) {
      const errorMessage = requestError instanceof Error ? requestError.message : 'Nao foi possivel salvar o livro.';
      setMessage(errorMessage);
      setFormMessage(errorMessage);
      setFormMessageType('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    await persistBook();
  };

  const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-books-page books-page-shell">
      {message && <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>{message}</div>}

      <div className="books-toolbar">
        <div className="books-search">
          <Search size={18} className="books-search-icon" />
          <input type="text" placeholder="Buscar por titulo..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        </div>

        <Button onClick={() => { setCurrentBook(emptyBook()); setFormMessage(''); setFormMessageType('success'); setModalOpen(true); }} variant="secondary" className="books-primary-action">
          <Plus size={18} /> Novo Livro
        </Button>
      </div>

      <div className="card books-table-card">
        <table className="books-table">
          <thead>
            <tr>
              <th>Capa</th>
              <th>Titulo / Ano</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Destaque</th>
              <th className="books-table-actions-header">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id} className="books-row">
                <td><img src={book.coverImage} alt={`Capa de ${book.title}`} className="books-row-cover" /></td>
                <td><div className="books-row-title">{book.title}</div><div className="books-row-year">{book.year}</div></td>
                <td><span className="books-category-pill">{book.category}</span></td>
                <td>
                  <span className={`books-status books-status--${book.status}`}>
                    {book.status === 'published' ? <Check size={14} /> : <Eye size={14} />}
                    {book.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td>{book.isFeatured ? <Check size={18} className="books-featured-check" /> : '-'}</td>
                <td>
                  <div className="books-row-actions">
                    <button type="button" onClick={() => { setCurrentBook(book); setFormMessage(''); setFormMessageType('success'); setModalOpen(true); }} className="admin-icon-btn" title="Editar"><Edit2 size={16} /></button>
                    <button type="button" onClick={() => void handleDelete(book.id)} className="admin-icon-btn danger" title="Excluir"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="books-modal-overlay" onClick={(event) => event.target === event.currentTarget && setModalOpen(false)}>
          <div className="books-modal" role="dialog" aria-modal="true">
            <div className="books-modal-header">
              <div>
                <span className="books-modal-kicker">Cadastro editorial</span>
                <h3>{currentBook.id ? 'Editar livro' : 'Cadastrar novo livro'}</h3>
                <p>Preencha dados publicos, links de compra e opcoes de exibicao.</p>
              </div>
              <button type="button" className="books-modal-close" onClick={() => setModalOpen(false)}><X size={22} /></button>
            </div>

            <form onSubmit={handleSave} className="books-form">
              <aside className="books-cover-panel">
                <span className="books-panel-label">Capa do livro</span>
                <div className="books-cover-preview">
                  {currentBook.coverImage ? (
                    <img src={currentBook.coverImage} alt={currentBook.title ? `Capa de ${currentBook.title}` : 'Preview da capa'} />
                  ) : (
                    <div className="books-cover-placeholder"><ImageIcon size={24} /><span>Adicione uma capa</span></div>
                  )}
                </div>
                <select
                  value={media.find((item) => item.url === (currentBook.coverImage || ''))?.id || ''}
                  onChange={(event) => {
                    const selected = media.find((item) => item.id === Number(event.target.value));
                    updateCurrentBook('coverImage', selected?.url || '');
                  }}
                >
                  <option value="">Selecionar da biblioteca de midia</option>
                  {media.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title || item.url}
                    </option>
                  ))}
                </select>
                <input type="url" placeholder="URL da capa" value={currentBook.coverImage || ''} onChange={(event) => updateCurrentBook('coverImage', event.target.value)} />
                <input type="file" accept="image/*" onChange={handleCoverChange} />
              </aside>

              <div className="books-form-content">
                {formMessage && (
                  <div className={`books-form-notice books-form-notice--${formMessageType}`} role="alert">
                    {formMessage}
                  </div>
                )}

                <section className="books-form-section">
                  <div className="books-form-grid books-form-grid--two">
                    <div className="form-group"><label>Titulo *</label><input type="text" value={currentBook.title || ''} onChange={(event) => updateCurrentBook('title', event.target.value)} required /></div>
                    <div className="form-group"><label>Slug</label><input type="text" value={currentBook.slug || ''} onChange={(event) => updateCurrentBook('slug', event.target.value)} /></div>
                    <div className="form-group"><label>Ano</label><input type="text" value={currentBook.year || ''} onChange={(event) => updateCurrentBook('year', event.target.value)} /></div>
                    <div className="form-group"><label>Categoria</label><input type="text" value={currentBook.category || ''} onChange={(event) => updateCurrentBook('category', event.target.value)} /></div>
                    <div className="form-group books-form-grid-span-full"><label>Subtitulo</label><input type="text" value={currentBook.subtitle || ''} onChange={(event) => updateCurrentBook('subtitle', event.target.value)} /></div>
                    <div className="form-group books-form-grid-span-full"><label>Sinopse</label><textarea rows={6} value={currentBook.synopsis || ''} onChange={(event) => updateCurrentBook('synopsis', event.target.value)} /></div>
                  </div>
                </section>

                <section className="books-form-section">
                  <div className="books-form-grid books-form-grid--two">
                    <div className="form-group"><label>ISBN</label><input type="text" value={currentBook.isbn || ''} onChange={(event) => updateCurrentBook('isbn', event.target.value)} /></div>
                    <div className="form-group"><label>Status</label><select value={currentBook.status || 'draft'} onChange={(event) => updateCurrentBook('status', event.target.value as Book['status'])}><option value="published">Publicado</option><option value="draft">Rascunho</option></select></div>
                    <div className="form-group"><label>Link do livro fisico</label><input type="url" value={currentBook.physicalPurchaseLink || ''} onChange={(event) => updateCurrentBook('physicalPurchaseLink', event.target.value)} /></div>
                    <div className="form-group"><label>Link do e-book</label><input type="url" value={currentBook.ebookPurchaseLink || ''} onChange={(event) => updateCurrentBook('ebookPurchaseLink', event.target.value)} /></div>
                  </div>
                  <label className="books-checkbox-field"><input type="checkbox" checked={Boolean(currentBook.isFeatured)} onChange={(event) => updateCurrentBook('isFeatured', event.target.checked)} /><span><strong>Destaque na home</strong><small>Prioriza o livro na pagina inicial.</small></span></label>
                  <label className="books-checkbox-field"><input type="checkbox" checked={Boolean(currentBook.showPurchaseLinks)} onChange={(event) => updateCurrentBook('showPurchaseLinks', event.target.checked)} /><span><strong>Exibir links de compra</strong><small>Controla a visibilidade dos botoes de compra no site.</small></span></label>
                  <label className="books-checkbox-field"><input type="checkbox" checked={Boolean(currentBook.showReviewSection)} onChange={(event) => updateCurrentBook('showReviewSection', event.target.checked)} /><span><strong>Exibir critica</strong><small>Mostra ou oculta a secao critica.</small></span></label>
                  <label className="books-checkbox-field"><input type="checkbox" checked={Boolean(currentBook.showTechnicalDetails)} onChange={(event) => updateCurrentBook('showTechnicalDetails', event.target.checked)} /><span><strong>Exibir detalhes tecnicos</strong><small>Mostra ou oculta a ficha tecnica.</small></span></label>
                </section>

                <section className="books-form-section">
                  <div className="books-form-grid books-form-grid--two">
                    <div className="form-group books-form-grid-span-full"><label>Texto da critica</label><textarea rows={4} value={currentBook.reviewText || ''} onChange={(event) => updateCurrentBook('reviewText', event.target.value)} /></div>
                    <div className="form-group books-form-grid-span-full"><label>Fonte da critica</label><input type="text" value={currentBook.reviewSource || ''} onChange={(event) => updateCurrentBook('reviewSource', event.target.value)} /></div>
                    <div className="form-group"><label>Editora</label><input type="text" value={currentBook.publisher || ''} onChange={(event) => updateCurrentBook('publisher', event.target.value)} /></div>
                    <div className="form-group"><label>Paginas</label><input type="text" value={currentBook.pageCount || ''} onChange={(event) => updateCurrentBook('pageCount', event.target.value)} /></div>
                    <div className="form-group"><label>Ano tecnico</label><input type="text" value={currentBook.technicalYear || ''} onChange={(event) => updateCurrentBook('technicalYear', event.target.value)} /></div>
                    <div className="form-group"><label>Formato</label><input type="text" value={currentBook.format || ''} onChange={(event) => updateCurrentBook('format', event.target.value)} /></div>
                    <div className="form-group books-form-grid-span-full"><label>Outros detalhes tecnicos</label><textarea rows={4} value={currentBook.technicalDetailsExtra || ''} onChange={(event) => updateCurrentBook('technicalDetailsExtra', event.target.value)} /></div>
                  </div>
                </section>
              </div>

              <div className="books-form-footer">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline" disabled={isSaving}>Cancelar</button>
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={isSaving}
                  onClick={() => {
                    updateCurrentBook('status', 'draft');
                    void persistBook('draft');
                  }}
                >
                  {isSaving && (currentBook.status || 'draft') === 'draft' ? 'Salvando...' : 'Salvar rascunho'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isSaving}
                  onClick={() => {
                    updateCurrentBook('status', 'published');
                    void persistBook('published');
                  }}
                >
                  {isSaving && currentBook.status === 'published' ? 'Publicando...' : 'Publicar livro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
