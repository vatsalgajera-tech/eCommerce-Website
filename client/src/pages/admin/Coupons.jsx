import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Plus, X, Trash2 } from 'lucide-react';

const empty = { code: '', discountType: 'percent', discountValue: '', minOrderValue: '', maxDiscount: '', usageLimit: 1, expiry: '', description: '', isActive: true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/coupons').then(r => setCoupons(r.data.coupons || [])).catch(() => {});
  useEffect(load, []);

  const save = async () => {
    setSaving(true);
    try { await api.post('/coupons', form); toast.success('Coupon created!'); setModal(false); setForm(empty); load(); }
    catch (e) { toast.error(e.response?.data?.message || 'Error'); } finally { setSaving(false); }
  };
  const del = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/coupons/${id}`); load(); toast.success('Deleted'); };
  const toggle = async (c) => { await api.put(`/coupons/${c._id}`, { isActive: !c.isActive }); load(); };

  return (
    <AdminLayout title="Coupons">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={16} /> Create Coupon</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {coupons.map(c => (
          <div key={c._id} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-soft)', borderLeft: `4px solid ${c.isActive ? 'var(--color-accent)' : 'var(--color-border)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)', letterSpacing: '0.08em' }}>{c.code}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => toggle(c)} style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600, background: c.isActive ? '#D1FAE5' : '#F3F4F6', color: c.isActive ? '#059669' : '#6B7280' }}>{c.isActive ? 'Active' : 'Inactive'}</button>
                <button onClick={() => del(c._id)} style={{ background: '#FEE2E2', border: 'none', borderRadius: '8px', padding: '4px 6px', cursor: 'pointer', color: '#DC2626' }}><Trash2 size={13} /></button>
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text)', marginBottom: '6px' }}>
              {c.discountType === 'flat' ? `₹${c.discountValue} off` : `${c.discountValue}% off`} {c.maxDiscount ? `(max ₹${c.maxDiscount})` : ''}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Min order: ₹{c.minOrderValue || 0} · Used: {c.usedCount}/{c.usageLimit}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Expires: {new Date(c.expiry).toLocaleDateString('en-IN')}</div>
          </div>
        ))}
        {coupons.length === 0 && <p style={{ color: 'var(--color-text-muted)', gridColumn: '1/-1' }}>No coupons yet.</p>}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Create Coupon</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[{ label: 'Coupon Code', key: 'code', placeholder: 'SAVE20' }, { label: 'Description', key: 'description', placeholder: 'Optional' }, { label: 'Discount Value', key: 'discountValue', type: 'number' }, { label: 'Min Order (₹)', key: 'minOrderValue', type: 'number' }, { label: 'Max Discount (₹)', key: 'maxDiscount', type: 'number' }, { label: 'Usage Limit', key: 'usageLimit', type: 'number' }, { label: 'Expiry Date', key: 'expiry', type: 'date' }].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>{label}</label>
                  <input type={type || 'text'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>Discount Type</label>
                <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none' }}>
                  <option value="percent">Percentage</option>
                  <option value="flat">Flat Amount</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(false)} className="btn-outline">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Creating...' : 'Create Coupon'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
