import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading2,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * RichTextEditor Component
 *
 * WYSIWYG editor built on Tiptap with formatting toolbar.
 * Supports: Bold, Italic, Headings, Lists, Quotes, Code blocks, Links
 */

export interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  minHeight?: string;
}

export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ content = '', onChange, placeholder = 'Write something...', editable = true, className, minHeight = '200px' }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [2, 3],
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-primary-600 underline hover:text-primary-700',
          },
        }),
      ],
      content,
      editable,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: cn(
            'prose prose-sm max-w-none focus:outline-none',
            'p-4 text-neutral-900',
            'prose-headings:font-semibold prose-headings:text-neutral-900',
            'prose-p:text-neutral-700 prose-p:leading-relaxed',
            'prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline',
            'prose-code:text-primary-700 prose-code:bg-primary-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
            'prose-pre:bg-neutral-900 prose-pre:text-neutral-100',
            'prose-blockquote:border-l-primary-500 prose-blockquote:text-neutral-700',
            'prose-ul:text-neutral-700 prose-ol:text-neutral-700'
          ),
        },
      },
    });

    React.useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }, [content, editor]);

    const setLink = React.useCallback(() => {
      if (!editor) return;

      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);

      if (url === null) return;

      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
      return null;
    }

    return (
      <div ref={ref} className={cn('rounded-md border border-neutral-300 bg-white', className)}>
        {editable && (
          <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              icon={<Bold className="h-4 w-4" />}
              title="Bold"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              icon={<Italic className="h-4 w-4" />}
              title="Italic"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              icon={<Code className="h-4 w-4" />}
              title="Inline Code"
            />

            <div className="mx-1 h-6 w-px bg-neutral-300" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              icon={<Heading2 className="h-4 w-4" />}
              title="Heading 2"
            />

            <div className="mx-1 h-6 w-px bg-neutral-300" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              icon={<List className="h-4 w-4" />}
              title="Bullet List"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              icon={<ListOrdered className="h-4 w-4" />}
              title="Numbered List"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              icon={<Quote className="h-4 w-4" />}
              title="Quote"
            />

            <div className="mx-1 h-6 w-px bg-neutral-300" />

            <ToolbarButton
              onClick={setLink}
              isActive={editor.isActive('link')}
              icon={<LinkIcon className="h-4 w-4" />}
              title="Link"
            />

            <div className="mx-1 h-6 w-px bg-neutral-300" />

            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              icon={<Undo className="h-4 w-4" />}
              title="Undo"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              icon={<Redo className="h-4 w-4" />}
              title="Redo"
            />
          </div>
        )}

        <div style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

// Toolbar Button Component
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  title: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, isActive, disabled, icon, title }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded transition-colors',
        'hover:bg-neutral-200',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        isActive && 'bg-primary-100 text-primary-700 hover:bg-primary-200'
      )}
    >
      {icon}
    </button>
  );
};

export default RichTextEditor;
