/** Quản lý bài viết blog — list + create/edit với TipTap editor. */
import { useEffect, useRef, useState } from 'react';
import { Loader2, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { adminBlogApi, BlogPost } from '../../api/client';
import RichEditor from '../../components/ui/RichEditor';
import { useToast } from '../../components/common/Toast';

const Spinner = () => (
  <div className="adm-center" style={{ minHeight: 200 }}>
    <Loader2 className="adm-spin" /> Đang tải...
  </div>
);

/* ---- Slugify tiếng Việt ---- */
function slugify(str: string): string {
  const map: Record<string, string> = {
    à:'a',á:'a',ả:'a',ã:'a',ạ:'a',â:'a',ầ:'a',ấ:'a',ẩ:'a',ẫ:'a',ậ:'a',ă:'a',ằ:'a',ắ:'a',ẳ:'a',ẵ:'a',ặ:'a',
    è:'e',é:'e',ẻ:'e',ẽ:'e',ẹ:'e',ê:'e',ề:'e',ế:'e',ể:'e',ễ:'e',ệ:'e',
    ì:'i',í:'i',ỉ:'i',ĩ:'i',ị:'i',
    ò:'o',ó:'o',ỏ:'o',õ:'o',ọ:'o',ô:'o',ồ:'o',ố:'o',ổ:'o',ỗ:'o',ộ:'o',ơ:'o',ờ:'o',ớ:'o',ở:'o',ỡ:'o',ợ:'o',
    ù:'u',ú:'u',ủ:'u',ũ:'u',ụ:'u',ư:'u',ừ:'u',ứ:'u',ử:'u',ữ:'u',ự:'u',
    ỳ:'y',ý:'y',ỷ:'y',ỹ:'y',ỵ:'y',
    đ:'d',
    À:'a',Á:'a',Â:'a',Ă:'a',È:'e',É:'e',Ê:'e',Ì:'i',Í:'i',Ò:'o',Ó:'o',Ô:'o',Ơ:'o',Ù:'u',Ú:'u',Ư:'u',Ý:'y',Đ:'d',
  };
  return str
    .split('')
    .map((c) => map[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const CATEGORIES = [
  { value: 'cam-nang', label: 'Cẩm nang' },
  { value: 'so-sanh', label: 'So sánh' },
  { value: 'huong-dan', label: 'Hướng dẫn' },
  { value: 'song-ngu', label: 'Song ngữ' },
  { value: 'xu-huong', label: 'Xu hướng' },
];

function statusBadge(status?: string) {
  if (status === 'published') return <span className="adm-badge adm-badge--done">Đã đăng</span>;
  if (status === 'scheduled') return <span className="adm-badge adm-badge--contacted">Lên lịch</span>;
  return <span className="adm-badge adm-badge--pending">Nháp</span>;
}

/* =============== LIST VIEW =============== */
function BlogList({ onNew, onEdit }: { onNew: () => void; onEdit: (p: BlogPost) => void }) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  const load = () => adminBlogApi.list().then((r) => r.success && setPosts(r.data ?? []));
  useEffect(() => { load(); }, []);

  const del = async (p: BlogPost) => {
    if (!confirm(`Xoá bài "${p.title}"?`)) return;
    await adminBlogApi.delete(p.id);
    load();
  };

  if (!posts) return <Spinner />;

  const total = posts.length;
  const published = posts.filter((p) => p.status === 'published').length;
  const draft = posts.filter((p) => p.status !== 'published').length;

  return (
    <div className="adm-blog-list">
      {/* Header */}
      <div className="adm-blog-list-header">
        <h2 className="adm-blog-title">Bài viết</h2>
        <button className="adm-mini-btn" onClick={onNew}>
          <Plus size={14} /> Viết bài mới
        </button>
      </div>

      {/* Stats */}
      <div className="adm-blog-stats">
        <div className="adm-blog-stat"><span className="adm-blog-stat-val">{total}</span><span>Tổng bài</span></div>
        <div className="adm-blog-stat"><span className="adm-blog-stat-val adm-blog-stat-val--green">{published}</span><span>Đã đăng</span></div>
        <div className="adm-blog-stat"><span className="adm-blog-stat-val adm-blog-stat-val--gray">{draft}</span><span>Nháp</span></div>
      </div>

      {/* Table */}
      {posts.length === 0 ? (
        <p className="adm-empty">Chưa có bài viết nào.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Lượt đọc</th>
                <th>Ngày đăng</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="adm-row-click" onClick={() => onEdit(p)}>
                  <td>
                    <div className="adm-blog-row-title">{p.title}</div>
                    {p.excerpt && <div className="adm-sub adm-blog-row-excerpt">{p.excerpt}</div>}
                  </td>
                  <td>
                    <span className="adm-blog-cat">
                      {CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category}
                    </span>
                  </td>
                  <td>{statusBadge(p.status)}</td>
                  <td>{p.viewCount ?? 0}</td>
                  <td className="adm-sub">
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="adm-mini-btn adm-mini-btn--ghost" style={{ marginRight: 4 }} onClick={() => onEdit(p)}>
                      <Pencil size={13} />
                    </button>
                    <button className="adm-mini-btn adm-mini-btn--danger" onClick={() => del(p)}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* =============== EDIT / CREATE VIEW =============== */
function BlogEditor({ post, onBack }: { post: BlogPost | null; onBack: () => void }) {
  const { toast } = useToast();
  const isNew = !post;
  const [title, setTitle] = useState(post?.title ?? '');
  const [contentHtml, setContentHtml] = useState(post?.contentHtml ?? '');
  const [contentJson, setContentJson] = useState(post?.contentJson ?? '');
  const [category, setCategory] = useState(post?.category ?? 'cam-nang');
  const [status, setStatus] = useState<string>(post?.status ?? 'draft');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? '');
  const [metaDesc, setMetaDesc] = useState(post?.metaDesc ?? '');
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title when creating new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) setSlug(slugify(val));
    if (isNew && !metaTitle) setMetaTitle(val.slice(0, 60));
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const res = await adminBlogApi.uploadImage(file);
    return res.data?.url ?? '';
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleImageUpload(file);
    if (url) setCoverImage(url);
    e.target.value = '';
  };

  const save = async () => {
    if (!title.trim()) { toast('Vui lòng nhập tiêu đề.', 'error'); return; }
    setSaving(true);
    const payload = {
      title, slug, category, status, excerpt, contentHtml, contentJson,
      metaTitle, metaDesc, coverImage,
    };
    if (isNew) {
      await adminBlogApi.create(payload);
    } else {
      await adminBlogApi.update(post!.id, payload);
    }
    setSaving(false);
    setSaved(true);
    toast('Đã lưu bài viết.', 'success');
    setTimeout(() => setSaved(false), 2500);
  };

  const del = async () => {
    if (!post) return;
    if (!confirm(`Xoá bài "${post.title}"?`)) return;
    await adminBlogApi.delete(post.id);
    onBack();
  };

  return (
    <div className="adm-blog-editor">
      {/* Back */}
      <button className="adm-blog-back" onClick={onBack}>← Danh sách</button>

      <div className="adm-blog-layout">
        {/* Left: title + content */}
        <div className="adm-blog-left">
          <input
            className="adm-input adm-blog-title-input"
            placeholder="Tiêu đề bài viết..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <RichEditor
            value={contentHtml}
            onChange={(html, json) => { setContentHtml(html); setContentJson(json); }}
            onImageUpload={handleImageUpload}
            placeholder="Bắt đầu viết nội dung bài viết..."
          />
        </div>

        {/* Right: settings panel */}
        <aside className="adm-blog-panel">
          {/* Thông tin */}
          <div className="adm-blog-panel-section">
            <h4 className="adm-blog-panel-heading">Thông tin bài viết</h4>

            <label className="adm-field">
              Danh mục
              <select className="adm-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </label>

            <label className="adm-field" style={{ marginTop: 10 }}>
              Trạng thái
              <select className="adm-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">Nháp</option>
                <option value="published">Đã đăng</option>
                <option value="scheduled">Lên lịch</option>
              </select>
            </label>

            {/* Cover image */}
            <div className="adm-field" style={{ marginTop: 10 }}>
              <span>Ảnh bìa</span>
              <div className="adm-blog-cover-upload" onClick={() => coverRef.current?.click()}>
                {coverImage ? (
                  <img src={coverImage} alt="Cover" className="adm-blog-cover-preview" />
                ) : (
                  <div className="adm-blog-cover-placeholder">
                    <span>+ Tải ảnh lên</span>
                  </div>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} />
            </div>

            <label className="adm-field" style={{ marginTop: 10 }}>
              Mô tả ngắn
              <textarea
                className="adm-input"
                rows={3}
                placeholder="Tóm tắt ngắn bài viết..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </label>
          </div>

          {/* SEO (collapsible) */}
          <div className="adm-blog-panel-section">
            <button
              type="button"
              className="adm-blog-panel-collapse"
              onClick={() => setSeoOpen((o) => !o)}
            >
              <h4 className="adm-blog-panel-heading" style={{ margin: 0 }}>SEO</h4>
              {seoOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {seoOpen && (
              <div className="adm-blog-seo-fields">
                <label className="adm-field">
                  <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Meta title <span className="adm-blog-counter">{metaTitle.length}/60</span>
                  </span>
                  <input
                    className="adm-input"
                    value={metaTitle}
                    maxLength={60}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Tiêu đề SEO..."
                  />
                </label>

                <label className="adm-field" style={{ marginTop: 10 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Meta description <span className="adm-blog-counter">{metaDesc.length}/160</span>
                  </span>
                  <textarea
                    className="adm-input"
                    rows={3}
                    value={metaDesc}
                    maxLength={160}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    placeholder="Mô tả SEO..."
                    style={{ resize: 'vertical' }}
                  />
                </label>

                <label className="adm-field" style={{ marginTop: 10 }}>
                  Slug (URL)
                  <input
                    className="adm-input"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="tieu-de-bai-viet"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="adm-blog-panel-actions">
            <button className="adm-btn" style={{ width: '100%' }} onClick={save} disabled={saving}>
              {saving ? 'Đang lưu...' : isNew ? 'Tạo bài viết' : 'Lưu thay đổi'}
            </button>
            {saved && <p className="adm-saved" style={{ textAlign: 'center', marginTop: 6 }}>✓ Đã lưu</p>}
            {!isNew && (
              <button
                className="adm-mini-btn adm-mini-btn--danger"
                style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
                onClick={del}
              >
                <Trash2 size={14} /> Xoá bài viết
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =============== ROOT EXPORT =============== */
export default function AdminBlog() {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const openNew = () => { setEditing(null); setView('edit'); };
  const openEdit = (p: BlogPost) => { setEditing(p); setView('edit'); };
  const back = () => { setView('list'); setEditing(null); };

  if (view === 'edit') return <BlogEditor post={editing} onBack={back} />;
  return <BlogList onNew={openNew} onEdit={openEdit} />;
}
