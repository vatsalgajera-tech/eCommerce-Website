import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, UserX, UserCheck } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const load = (s = '') => { api.get(`/admin/customers?search=${s}`).then(r => { setCustomers(r.data.customers || []); setTotal(r.data.total || 0); }).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const toggleBlock = async (id) => {
    try { const { data } = await api.put(`/admin/customers/${id}/block`); toast.success(data.isBlocked ? 'User blocked' : 'User unblocked'); load(search); } catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout title="Customers">
      <Helmet><title>Customers – Admin – Shree Vastra</title></Helmet>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); load(e.target.value); }} placeholder="Search customers..." style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total: {total} customers</span>
      </div>
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-soft)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-cream)', borderBottom: '2px solid var(--color-border)' }}>
              {['Customer', 'Phone', 'Verified', 'Joined', 'Status', 'Action'].map(h => (<th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</td></tr> :
              customers.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>{c.name?.[0]}</div>
                      <div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</div><div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{c.email}</div></div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem' }}>{c.phone || '—'}</td>
                  <td style={{ padding: '14px 16px' }}><span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, background: c.isVerified ? '#D1FAE5' : '#FEE2E2', color: c.isVerified ? '#059669' : '#DC2626' }}>{c.isVerified ? 'Verified' : 'Unverified'}</span></td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '14px 16px' }}><span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, background: c.isBlocked ? '#FEE2E2' : '#D1FAE5', color: c.isBlocked ? '#DC2626' : '#059669' }}>{c.isBlocked ? 'Blocked' : 'Active'}</span></td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => toggleBlock(c._id)} title={c.isBlocked ? 'Unblock' : 'Block'} style={{ background: c.isBlocked ? '#D1FAE5' : '#FEE2E2', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: c.isBlocked ? '#059669' : '#DC2626', transition: 'all 0.2s' }}>
                      {c.isBlocked ? <UserCheck size={15} /> : <UserX size={15} />}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
