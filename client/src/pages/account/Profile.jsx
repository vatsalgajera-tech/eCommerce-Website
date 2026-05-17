import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AccountLayout from '../../components/AccountLayout';
import { selectUser, setUser } from '../../store/slices/authSlice';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { User, Phone, Mail, Save } from 'lucide-react';

export default function Profile() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', { name: form.name.trim(), phone: form.phone.trim() });
      dispatch(setUser(data.user));
      toast.success('Profile updated successfully! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1.5px solid var(--color-border)', fontSize: '0.95rem',
    fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text)' };

  return (
    <AccountLayout>
      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-soft)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '8px' }}>My Profile</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '32px' }}>Manage your personal information</p>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', padding: '20px', background: 'var(--color-cream)', borderRadius: '14px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{user?.email}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', marginTop: '4px', fontWeight: 600 }}>{user?.role === 'admin' ? '👑 Admin' : '🛍️ Customer'}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}><User size={13} style={{ marginRight: 5 }} />Full Name *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                placeholder="Your full name" required />
            </div>
            <div>
              <label style={labelStyle}><Phone size={13} style={{ marginRight: 5 }} />Mobile Number</label>
              <input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                placeholder="10-digit mobile" type="tel" maxLength={10} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}><Mail size={13} style={{ marginRight: 5 }} />Email Address</label>
              <input style={{ ...inputStyle, background: 'var(--color-cream)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }}
                value={user?.email || ''} disabled />
              <p style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Email cannot be changed</p>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
            <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
