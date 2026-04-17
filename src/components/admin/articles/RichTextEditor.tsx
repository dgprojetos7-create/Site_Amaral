import React, { useEffect } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, Heading3, Italic, List, ListOrdered, Quote, Redo2, Undo2 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface ToolbarItem {
  label: string;
  icon: React.ComponentType<{ size?: string | number }>;
  action: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}

const toolbarItems: ToolbarItem[] = [
  { icon: Bold, label: 'Negrito', action: (editor) => editor.chain().focus().toggleBold().run(), isActive: (editor) => editor.isActive('bold') },
  { icon: Italic, label: 'Italico', action: (editor) => editor.chain().focus().toggleItalic().run(), isActive: (editor) => editor.isActive('italic') },
  { icon: Heading2, label: 'Titulo 2', action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (editor) => editor.isActive('heading', { level: 2 }) },
  { icon: Heading3, label: 'Titulo 3', action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: (editor) => editor.isActive('heading', { level: 3 }) },
  { icon: List, label: 'Lista', action: (editor) => editor.chain().focus().toggleBulletList().run(), isActive: (editor) => editor.isActive('bulletList') },
  { icon: ListOrdered, label: 'Lista numerada', action: (editor) => editor.chain().focus().toggleOrderedList().run(), isActive: (editor) => editor.isActive('orderedList') },
  { icon: Quote, label: 'Citacao', action: (editor) => editor.chain().focus().toggleBlockquote().run(), isActive: (editor) => editor.isActive('blockquote') },
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Escreva o artigo como em um CMS profissional. Use subtitulos, listas e citacoes para organizar a leitura.',
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'article-rich-editor__content',
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className="article-rich-editor">
      <div className="article-rich-editor__toolbar">
        {toolbarItems.map(({ icon: Icon, label, action, isActive }) => (
          <button
            key={label}
            type="button"
            className={`article-rich-editor__tool ${isActive(editor) ? 'is-active' : ''}`}
            onClick={() => action(editor)}
            aria-label={label}
            title={label}
          >
            <Icon size={16} />
          </button>
        ))}
        <div className="article-rich-editor__divider" />
        <button type="button" className="article-rich-editor__tool" onClick={() => editor.chain().focus().undo().run()} aria-label="Desfazer" title="Desfazer">
          <Undo2 size={16} />
        </button>
        <button type="button" className="article-rich-editor__tool" onClick={() => editor.chain().focus().redo().run()} aria-label="Refazer" title="Refazer">
          <Redo2 size={16} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
