import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['sarees', 'kurti', 'kurta', 'dress', 'dupatta', 'top-bottom-set', 'tops-tunics', 'jumpsuits', 'gowns', 'lenghas'];
const empty = { name: '', category: 'sarees', price: '', discountPrice: '', description: '', fabric: '', stockQty: '', sizes: '', colors: '', occasion: '', tags: '', isFeatured: false, isNewArrival: false, isBestSeller: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = () => { api.get('/products?limit=100').then(r => setProducts(r.data.products || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, sizes: p.sizes?.join(',') || '', colors: p.colors?.map(c => c.name).join(',') || '', occasion: p.occasion?.join(',') || '', tags: p.tags?.join(',') || '' });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), discountPrice: Number(form.discountPrice), stockQty: Number(form.stockQty), sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean), colors: form.colors.split(',').map(c => ({ name: c.trim(), hex: '#888' })).filter(c => c.name), occasion: form.occasion.split(',').map(s => s.trim()).filter(Boolean), tags: form.tags.split(',').map(s => s.trim()).filter(Boolean) };
      if (editing) { await api.put(`/products/${editing}`, payload); toast.success('Product updated!'); }
      else { await api.post('/products', payload); toast.success('Product created!'); }
      setModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error saving product'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed to delete'); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Products">
      <Helmet><title>Products – Admin – Shree Vastra</title></Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button id="add-product-btn" onClick={openNew} className="btn-primary"><Plus size={16} /> Add Product</button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-soft)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-cream)', borderBottom: '2px solid var(--color-border)' }}>
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</td></tr>
            )) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No products found</td></tr>
            ) : filtered.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#FFFBF6'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={p.images?.[0]?.url || '/placeholder-product.jpg'} alt={p.name} style={{ width: '44px', height: '54px', objectFit: 'cover', borderRadius: '8px', background: 'var(--color-cream)' }} onError={e => e.target.style.display = 'none'} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>SKU: {p.sku}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{p.category}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>₹{(p.discountPrice || p.price)?.toLocaleString('en-IN')}</div>
                  {p.discountPrice && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>₹{p.price?.toLocaleString('en-IN')}</div>}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontWeight: 600, color: p.stockQty === 0 ? '#DC2626' : p.stockQty <= 5 ? '#D97706' : '#059669', fontSize: '0.875rem' }}>{p.stockQty}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, background: p.status === 'active' ? '#D1FAE5' : '#FEE2E2', color: p.status === 'active' ? '#059669' : '#DC2626' }}>{p.status}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEdit(p)} style={{ background: 'var(--color-cream)', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: 'var(--color-primary)', transition: 'all 0.2s' }}><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(p._id)} style={{ background: '#FEE2E2', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#DC2626', transition: 'all 0.2s' }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'auto', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Product Name *', key: 'name', full: true }, { label: 'Category *', key: 'category', type: 'select' },
                { label: 'Price (₹) *', key: 'price', type: 'number' }, { label: 'Discount Price (₹)', key: 'discountPrice', type: 'number' },
                { label: 'Stock Qty', key: 'stockQty', type: 'number' }, { label: 'Fabric', key: 'fabric' },
                { label: 'Sizes (comma separated)', key: 'sizes', full: true }, { label: 'Colors (comma separated)', key: 'colors', full: true },
                { label: 'Occasions (comma separated)', key: 'occasion', full: true }, { label: 'Tags', key: 'tags', full: true },
                { label: 'Description *', key: 'description', type: 'textarea', full: true },
              ].map(({ label, key, type, full }) => (
                <div key={key} style={{ gridColumn: full ? '1/-1' : 'auto' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px' }}>{label}</label>
                  {type === 'select' ? (
                    <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputSt}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : type === 'textarea' ? (
                    <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} rows={4} style={{ ...inputSt, resize: 'vertical' }} />
                  ) : (
                    <input type={type || 'text'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputSt} />
                  )}
                </div>
              ))}
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: '20px' }}>
                {[{ key: 'isFeatured', label: 'Featured' }, { key: 'isNewArrival', label: 'New Arrival' }, { key: 'isBestSeller', label: 'Best Seller' }].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                    <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} style={{ accentColor: 'var(--color-primary)' }} /> {label}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(false)} className="btn-outline">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const inputSt = { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', background: 'white' };
