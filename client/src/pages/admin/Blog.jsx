import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Eye, EyeOff, X, Save, Globe } from 'lucide-react';

const EMPTY = { title: '', excerpt: '', content: '', coverImage: { url: '' }, author: 'Shree Vastra Team', tags: '', category: 'Fashion', isPublished: false };

function BlogModal({ data, onSave, onClose }) {
  const [form, setForm] = useState(data ? { ...data, tags: data.tags?.join(', ') || '' } : EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) return toast.error('Title, excerpt and content are required');
    setSaving(true);
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
    await onSave(payload);
    setSaving(false);
  };

  const inp = (label, key, placeholder = '', full = false) => (
    <div style={{ marginBottom: '14px', gridColumn: full ? '1/-1' : 'auto' }}>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>{label}</label>
      <input value={form[key]||''} onChange={e => set(key, e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}/>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}/>
      <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '680px', position: 'relative', maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.3rem' }}>{data ? 'Edit Post' : 'New Blog Post'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
        </div>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {inp('Post Title *', 'title', 'e.g. Top 5 Saree Trends 2025', true)}
            {inp('Author', 'author', 'Shree Vastra Team')}
            {inp('Category', 'category', 'Fashion')}
            {inp('Tags', 'tags', 'fashion, saree, tips (comma separated)')}
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>Cover Image URL</label>
            <input value={form.coverImage?.url||''} onChange={e => set('coverImage',{url:e.target.value})} placeholder="https://..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}/>
            {form.coverImage?.url && <img src={form.coverImage.url} alt="" style={{ marginTop: '8px', width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} onError={e=>e.target.style.display='none'}/>}
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>Excerpt * <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(short summary)</span></label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Write a short description..." rows={3} required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}/>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>Full Content *</label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)} placeholder="Write the full blog post here..." rows={10} required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}/>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={form.isPublished} onChange={e => set('isPublished',e.target.checked)} style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}/>
            Publish immediately (visible on blog page)
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
              <Save size={15}/> {saving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => api.get('/blogs/admin/all').then(r=>setPosts(r.data.blogs||[])).catch(()=>{}).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const handleSave = async (form) => {
    try {
      if (modal==='add') { await api.post('/blogs',form); toast.success('Post created ✅'); }
      else { await api.put(`/blogs/${modal._id}`,form); toast.success('Post updated ✅'); }
      setModal(null); load();
    } catch(err) { toast.error(err.response?.data?.message||'Save failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete post?')) return;
    try { await api.delete(`/blogs/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const togglePublish = async (p) => {
    try { await api.put(`/blogs/${p._id}`,{...p,isPublished:!p.isPublished}); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.8rem' }}>Blog Posts</h1>
          <button onClick={() => setModal('add')} className="btn-primary"><Plus size={16}/> New Post</button>
        </div>

        {loading ? <Loader/> : posts.length===0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
            <Globe size={48} color="var(--color-border)" style={{ marginBottom: '16px' }}/>
            <p style={{ marginBottom: '16px' }}>No blog posts yet</p>
            <button onClick={() => setModal('add')} className="btn-primary"><Plus size={15}/> Create First Post</button>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-soft)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-cream)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Post','Category','Author','Status','Views','Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      {p.coverImage?.url && <img src={p.coverImage.url} alt="" style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '6px', marginRight: '10px', verticalAlign: 'middle' }}/>}
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.title}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{p.category}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{p.author}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: p.isPublished ? '#D1FAE5' : '#F3F4F6', color: p.isPublished ? '#065F46' : '#6B7280' }}>
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem' }}>{p.views}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => togglePublish(p)} title={p.isPublished?'Unpublish':'Publish'} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer' }}>
                          {p.isPublished ? <EyeOff size={14}/> : <Eye size={14}/>}
                        </button>
                        <button onClick={() => setModal(p)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer' }}><Edit2 size={14}/></button>
                        <button onClick={() => del(p._id)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal && <BlogModal data={modal==='add'?null:modal} onSave={handleSave} onClose={()=>setModal(null)}/>}
    </AdminLayout>
  );
}
