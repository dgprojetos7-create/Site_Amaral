import { useEffect, useRef, useState } from 'react';
import type { Article } from '../types/cms';
import {
  type EditableArticleDraft,
  createEmptyArticleDraft,
  formatDisplayDate,
  getDraftStorageKey,
  normalizeArticleDraft,
  parseTagsInput,
  slugifyArticleTitle,
  stringifyTags,
} from '../services/article-editor';

const parseStoredDraft = (value: string | null) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as EditableArticleDraft;
  } catch {
    return null;
  }
};

export const useArticleEditor = (article: Partial<Article> | null, isOpen: boolean) => {
  const [draft, setDraft] = useState<EditableArticleDraft>(createEmptyArticleDraft());
  const [tagsInput, setTagsInput] = useState('');
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const autosaveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const baseDraft = normalizeArticleDraft(article || undefined);
    const storedDraft = parseStoredDraft(window.localStorage.getItem(getDraftStorageKey(article?.id)));
    const nextDraft = article?.id ? baseDraft : storedDraft ? normalizeArticleDraft(storedDraft) : baseDraft;

    setDraft(nextDraft);
    setTagsInput(stringifyTags(nextDraft.tags));
    setAutosaveStatus('idle');
    setIsSlugManuallyEdited(Boolean(nextDraft.slug && nextDraft.slug !== slugifyArticleTitle(nextDraft.title)));
  }, [article, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    setAutosaveStatus('saving');
    autosaveTimerRef.current = window.setTimeout(() => {
      window.localStorage.setItem(getDraftStorageKey(draft.id), JSON.stringify(draft));
      setAutosaveStatus('saved');
    }, 900);

    return () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [draft, isOpen]);

  const updateDraft = <K extends keyof EditableArticleDraft>(field: K, value: EditableArticleDraft[K]) => {
    setDraft((previous) => {
      if (field === 'title') {
        const nextTitle = String(value);
        const nextSlug = isSlugManuallyEdited ? previous.slug : slugifyArticleTitle(nextTitle);
        return {
          ...previous,
          title: nextTitle,
          slug: nextSlug,
          metaTitle: previous.metaTitle || nextTitle,
        };
      }

      if (field === 'slug') {
        setIsSlugManuallyEdited(Boolean(String(value).trim()));
      }

      if (field === 'publishedAt') {
        const nextDate = String(value);
        return {
          ...previous,
          publishedAt: nextDate,
          displayDate: previous.displayDate || formatDisplayDate(nextDate),
        };
      }

      return { ...previous, [field]: value };
    });
  };

  const updateTags = (value: string) => {
    setTagsInput(value);
    setDraft((previous) => ({ ...previous, tags: parseTagsInput(value) }));
  };

  const resetDraft = () => {
    const nextDraft = createEmptyArticleDraft();
    setDraft(nextDraft);
    setTagsInput('');
    setAutosaveStatus('idle');
    setIsSlugManuallyEdited(false);
    window.localStorage.removeItem(getDraftStorageKey(article?.id));
  };

  const clearStoredDraft = () => {
    window.localStorage.removeItem(getDraftStorageKey(draft.id));
    setAutosaveStatus('idle');
  };

  return {
    draft,
    tagsInput,
    autosaveStatus,
    updateDraft,
    updateTags,
    resetDraft,
    clearStoredDraft,
  };
};
