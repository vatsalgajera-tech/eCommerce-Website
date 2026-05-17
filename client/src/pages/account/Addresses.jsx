import { useState, useEffect } from 'react';
import AccountLayout from '../../components/AccountLayout';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { MapPin, Plus, Trash2, Star, Edit2, X, Check } from 'lucide-react';
import { STATE_LIST, getCities, getCityPincode } from '../../data/indiaCities';

const EMPTY_FORM = { label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', isDefault: false };

function AddressModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.addressLine1 || !form.city || !form.state || !form.pincode)
      return toast.error('Please fill all required fields');
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inp = (key, label, opts = {}) => (
    <div style={{ gridColumn: opts.full ? '1/-1' : 'auto' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>{label}{opts.req ? ' *' : ''}</label>
      <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={opts.placeholder || label}
        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
      />
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '540px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.4rem' }}>
            {initial ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Label tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {['Home', 'Office', 'Other'].map(l => (
            <button key={l} type="button" onClick={() => setForm(f => ({ ...f, label: l }))}
              style={{ padding: '6px 18px', borderRadius: '20px', border: '1.5px solid', borderColor: form.label === l ? 'var(--color-primary)' : 'var(--color-border)', background: form.label === l ? 'var(--color-primary)' : 'white', color: form.label === l ? 'white' : 'var(--color-text)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}>
              {l === 'Home' ? '🏠' : l === 'Office' ? '🏢' : '📍'} {l}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            {inp('fullName', 'Full Name', { req: true })}
            {inp('phone', 'Phone', { req: true })}
            {inp('addressLine1', 'Address Line 1', { req: true, full: true })}
            {inp('addressLine2', 'Address Line 2 (Landmark)', { full: true })}

            {/* State dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>State *</label>
              <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value, city: '' }))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', background: 'white', cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor='var(--color-border)'}>
                <option value="">Select State</option>
                {STATE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* City dropdown — only shows after state selected */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>City *</label>
              <select value={form.city} onChange={e => {
                  const city = e.target.value;
                  const pin  = getCityPincode(city);
                  setForm(f => ({ ...f, city, ...(pin ? { pincode: pin } : {}) }));
                }}
                disabled={!form.state}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', background: form.state ? 'white' : 'var(--color-cream)', cursor: form.state ? 'pointer' : 'not-allowed', opacity: form.state ? 1 : 0.6 }}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor='var(--color-border)'}>
                <option value="">{form.state ? 'Select City' : 'Select State first'}</option>
                {getCities(form.state).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {inp('pincode', 'Pincode', { req: true })}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }} />
            Set as default address
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
              <Check size={16} /> {saving ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | {address object for edit}

  const load = () => api.get('/auth/addresses').then(r => setAddresses(r.data.addresses || [])).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    try {
      if (modal === 'add') {
        await api.post('/auth/addresses', form);
        toast.success('Address added! ✅');
      } else {
        await api.put(`/auth/addresses/${modal._id}`, form);
        toast.success('Address updated! ✅');
      }
      setModal(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      await api.delete(`/auth/addresses/${id}`);
      toast.success('Address removed');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/auth/addresses/${id}/default`);
      load();
      toast.success('Default address set ✅');
    } catch { toast.error('Failed'); }
  };

  const labelIcon = { Home: '🏠', Office: '🏢', Other: '📍' };

  return (
    <AccountLayout>
      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-soft)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Address Book</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>Manage your saved addresses</p>
          </div>
          <button onClick={() => setModal('add')} className="btn-primary">
            <Plus size={16} /> Add Address
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>Loading...</div>
        ) : addresses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <MapPin size={48} color="var(--color-border)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '8px' }}>No addresses saved</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Add your first delivery address</p>
            <button onClick={() => setModal('add')} className="btn-primary"><Plus size={16} /> Add Address</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {addresses.map(addr => (
              <div key={addr._id} style={{ borderRadius: '14px', border: `2px solid ${addr.isDefault ? 'var(--color-primary)' : 'var(--color-border)'}`, padding: '20px', position: 'relative', background: addr.isDefault ? 'var(--color-cream)' : 'white', transition: 'all 0.2s' }}>
                {addr.isDefault && (
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--color-primary)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>DEFAULT</span>
                )}
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {labelIcon[addr.label] || '📍'} {addr.label}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{addr.fullName}</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                  {addr.city}, {addr.state} – {addr.pincode}<br />
                  📞 {addr.phone}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr._id)} style={{ fontSize: '0.75rem', padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', background: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={12} /> Set Default
                    </button>
                  )}
                  <button onClick={() => setModal(addr)} style={{ fontSize: '0.75rem', padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', color: 'var(--color-text)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(addr._id)} style={{ fontSize: '0.75rem', padding: '5px 12px', borderRadius: '6px', border: '1px solid #FCA5A5', color: '#DC2626', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <AddressModal
          initial={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </AccountLayout>
  );
}
