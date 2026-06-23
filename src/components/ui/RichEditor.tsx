/** Rich text editor dùng TipTap — dùng trong AdminBlog. */
import { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Link2, Image as ImageIcon, Youtube as YoutubeIcon,
  AlignLeft, AlignCenter, AlignRight, Quote, Undo2, Redo2,
} from 'lucide-react';
import './RichEditor.css';

interface Props {
  value: string;
  onChange: (html: string, json: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  placeholder?: string;
}

export default function RichEditor({ value, onChange, onImageUpload, placeholder }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? 'Bắt đầu viết nội dung...' }),
      CharacterCount,
      Youtube.configure({ controls: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML(), JSON.stringify(editor.getJSON()));
    },
  });

  if (!editor) return null;

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onImageUpload(file);
    editor.chain().focus().setImage({ src: url }).run();
    e.target.value = '';
  };

  const handleLink = () => {
    const url = prompt('Nhập URL liên kết:');
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  const handleYoutube = () => {
    const url = prompt('Nhập URL YouTube:');
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url });
  };

  const Btn = ({
    onClick, active, title, children,
  }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      className={`tiptap-btn${active ? ' is-active' : ''}`}
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );

  const Sep = () => <span className="tiptap-sep" />;

  const chars = editor.storage.characterCount?.characters?.() ?? 0;
  const words = editor.storage.characterCount?.words?.() ?? 0;

  return (
    <div className="tiptap-wrap">
      <div className="tiptap-toolbar">
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Đậm">
          <Bold size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Nghiêng">
          <Italic size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Gạch chân">
          <UnderlineIcon size={14} />
        </Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Tiêu đề 1">
          <Heading1 size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Tiêu đề 2">
          <Heading2 size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Tiêu đề 3">
          <Heading3 size={14} />
        </Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Danh sách">
          <List size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Danh sách số">
          <ListOrdered size={14} />
        </Btn>
        <Sep />
        <Btn onClick={handleLink} active={editor.isActive('link')} title="Liên kết">
          <Link2 size={14} />
        </Btn>
        <Btn onClick={() => fileRef.current?.click()} active={false} title="Chèn ảnh">
          <ImageIcon size={14} />
        </Btn>
        <Btn onClick={handleYoutube} active={false} title="Chèn YouTube">
          <YoutubeIcon size={14} />
        </Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Căn trái">
          <AlignLeft size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Căn giữa">
          <AlignCenter size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Căn phải">
          <AlignRight size={14} />
        </Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Trích dẫn">
          <Quote size={14} />
        </Btn>
        <Sep />
        <Btn onClick={() => editor.chain().focus().undo().run()} active={false} title="Hoàn tác">
          <Undo2 size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} active={false} title="Làm lại">
          <Redo2 size={14} />
        </Btn>
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />

      <EditorContent editor={editor} className="tiptap-content" />

      <div className="tiptap-footer">
        <span />
        <span>{chars} ký tự · {words} từ</span>
      </div>
    </div>
  );
}
