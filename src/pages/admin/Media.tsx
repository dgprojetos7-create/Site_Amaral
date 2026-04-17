import React, { useEffect, useState } from 'react';
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '../../components/Button';
import { cmsApi } from '../../api/cms';
import type { MediaItem } from '../../types/cms';

const emptyMedia = {
  title: '',
  altText: '',
  url: '',
  mediaType: 'image' as const,
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Nao foi possivel ler o arquivo selecionado.'));
    reader.readAsDataURL(file);
  });

const AdminMedia: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [currentMedia, setCurrentMedia] = useState<Partial<MediaItem>>(emptyMedia);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const loadMedia = async () => {
    const items = await cmsApi.getMedia();
    setMedia(items);
  };

  useEffect(() => {
    void loadMedia();
  }, []);

  const resetForm = () => {
    setCurrentMedia(emptyMedia);
    setIsEditing(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (currentMedia.id) {
        await cmsApi.updateMedia(currentMedia.id, currentMedia);
        setMessage('Mídia atualizada com sucesso.');
      } else {
        await cmsApi.createMedia(currentMedia);
        setMessage('Mídia cadastrada com sucesso.');
      }
      resetForm();
      await loadMedia();
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : 'Não foi possível salvar a mídia.');
    }
  };

  const handleDelete = async (mediaId: number) => {
    if (!window.confirm('Deseja excluir esta mídia?')) {
      return;
    }

    await cmsApi.deleteMedia(mediaId);
    await loadMedia();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setCurrentMedia((previous) => ({
        ...previous,
        title: previous.title || file.name.replace(/\.[^.]+$/, ''),
        altText: previous.altText || file.name.replace(/\.[^.]+$/, ''),
        url: dataUrl,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      }));
      setMessage('');
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : 'Nao foi possivel carregar o arquivo.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="admin-media-container" style={{ display: 'grid', gap: '1.5rem' }}>
      {message && <div className="card" style={{ padding: '1rem' }}>{message}</div>}

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="text-navy">Biblioteca de Mídia</h3>
          <Button onClick={resetForm} variant="secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Plus size={18} /> Nova Mídia
          </Button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <input type="text" placeholder="Título" value={currentMedia.title || ''} onChange={(event) => setCurrentMedia({ ...currentMedia, title: event.target.value })} />
          <input type="text" placeholder="Texto alternativo" value={currentMedia.altText || ''} onChange={(event) => setCurrentMedia({ ...currentMedia, altText: event.target.value })} />
          <input type="url" placeholder="https://..." value={currentMedia.url || ''} onChange={(event) => setCurrentMedia({ ...currentMedia, url: event.target.value })} required />
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
          <select value={currentMedia.mediaType || 'image'} onChange={(event) => setCurrentMedia({ ...currentMedia, mediaType: event.target.value as MediaItem['mediaType'] })}>
            <option value="image">Imagem</option>
            <option value="video">Vídeo</option>
            <option value="external">Externo</option>
          </select>
          <Button type="submit">{isEditing ? 'Atualizar Mídia' : 'Salvar Mídia'}</Button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {media.map((item) => (
          <div key={item.id} className="card" style={{ padding: '0.75rem' }}>
            <div style={{ height: '150px', backgroundColor: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <img src={item.url} alt={item.altText || item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <strong style={{ display: 'block', marginBottom: '0.35rem' }}>{item.title || 'Sem título'}</strong>
            <span style={{ display: 'block', color: 'var(--color-gray-light)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{item.mediaType}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => {
                  setCurrentMedia(item);
                  setIsEditing(true);
                  setMessage('');
                }}
              >
                <Pencil size={16} />
              </button>
              <a href={item.url} target="_blank" rel="noreferrer" className="admin-icon-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <ExternalLink size={16} />
              </a>
              <button type="button" className="admin-icon-btn danger" onClick={() => void handleDelete(item.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .admin-icon-btn { background: #f1f5f9; border: none; color: var(--color-navy); padding: 0.5rem; border-radius: 6px; cursor: pointer; }
        .admin-icon-btn.danger { color: #ef4444; }
        input, select { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--color-border); }
      `}</style>
    </div>
  );
};

export default AdminMedia;
