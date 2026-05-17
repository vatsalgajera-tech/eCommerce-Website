import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Eye, EyeOff, X, Save } from 'lucide-react';

const EMPTY = { title: '', subtitle: '', image: { url: '' }, linkUrl: '', buttonText: 'Shop Now', position: 'hero', order: 0, isActive: true };

function Modal({ data, onSave, onClose }) {
  const [form, setForm] = useState(data || EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image?.url) return toast.error('Title and image URL are required');
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inp = (label, key, placeholder = '') => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>{label}</label>
      <input value={form[key]||''} onChange={e => set(key, e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}/>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}/>
      <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '520px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.3rem' }}>{data ? 'Edit Banner' : 'Add Banner'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
        </div>
        <form onSubmit={handleSave}>
          {inp('Title *', 'title', 'e.g. New Festive Collection')}
          {inp('Subtitle', 'subtitle', 'Optional tagline')}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>Image URL *</label>
            <input value={form.image?.url||''} onChange={e => set('image', { url: e.target.value })} placeholder="https://..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}/>
            {form.image?.url && <img src={form.image.url} alt="" style={{ marginTop: '8px', width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }} onError={e => e.target.style.display='none'}/>}
          </div>
          {inp('Link URL', 'linkUrl', '/shop/sarees')}
          {inp('Button Text', 'buttonText', 'Shop Now')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>Position</label>
              <select value={form.position} onChange={e => set('position', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', background: 'white', outline: 'none' }}>
                {['hero','mid','sidebar','popup'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>Display Order</label>
              <input type="number" value={form.order} onChange={e => set('order', Number(e.target.value))} min={0}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}/>
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}/>
            Active (visible on site)
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
              <Save size={15}/> {saving ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => api.get('/banners/all').then(r => setBanners(r.data.banners||[])).catch(()=>{}).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const handleSave = async (form) => {
    try {
      if (modal === 'add') { await api.post('/banners', form); toast.success('Banner created ✅'); }
      else { await api.put(`/banners/${modal._id}`, form); toast.success('Banner updated ✅'); }
      setModal(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  const del = async (id) => {
    if (!confirm('Delete banner?')) return;
    try { await api.delete(`/banners/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const toggleActive = async (b) => {
    try { await api.put(`/banners/${b._id}`, { ...b, isActive: !b.isActive }); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.8rem' }}>Banners</h1>
          <button onClick={() => setModal('add')} className="btn-primary"><Plus size={16}/> Add Banner</button>
        </div>

        {loading ? <Loader/> : banners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
            <p style={{ marginBottom: '16px' }}>No banners yet</p>
            <button onClick={() => setModal('add')} className="btn-primary"><Plus size={15}/> Add Banner</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: '20px' }}>
            {banners.map(b => (
              <div key={b._id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-soft)', border: `2px solid ${b.isActive ? 'var(--color-primary)' : 'var(--color-border)'}` }}>
                {b.image?.url ? (
                  <img src={b.image.url} alt={b.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }}/>
                ) : (
                  <div style={{ width: '100%', height: '160px', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No Image</div>
                )}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{b.title}</div>
                      {b.subtitle && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{b.subtitle}</div>}
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: b.isActive ? '#D1FAE5' : '#F3F4F6', color: b.isActive ? '#065F46' : '#6B7280' }}>
                      {b.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                    Position: <b>{b.position}</b> · Order: <b>{b.order}</b>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => toggleActive(b)} style={{ flex: 1, padding: '7px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      {b.isActive ? <><EyeOff size={13}/> Hide</> : <><Eye size={13}/> Show</>}
                    </button>
                    <button onClick={() => setModal(b)} style={{ flex: 1, padding: '7px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Edit2 size={13}/> Edit
                    </button>
                    <button onClick={() => del(b._id)} style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modal && <Modal data={modal==='add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)}/>}
    </AdminLayout>
  );
}
