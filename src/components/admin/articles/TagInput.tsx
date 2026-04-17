import React from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string;
  tags: string[];
  onChange: (value: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ value, tags, onChange }) => (
  <div className="article-tag-input">
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Ex.: literatura, ensaio, historia"
    />
    {tags.length > 0 && (
      <div className="article-tag-input__chips">
        {tags.map((tag) => (
          <span key={tag} className="article-tag-input__chip">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter((item) => item !== tag).join(', '))} aria-label={`Remover tag ${tag}`}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    )}
  </div>
);

export default TagInput;
