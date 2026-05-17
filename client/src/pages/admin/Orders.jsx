import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['placed', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'returned'];
const STATUS_COLORS = { placed: ['#FEF3C7', '#D97706'], confirmed: ['#DBEAFE', '#2563EB'], processing: ['#EDE9FE', '#7C3AED'], shipped: ['#CFFAFE', '#0891B2'], 'out-for-delivery': ['#FEF3C7', '#D97706'], delivered: ['#D1FAE5', '#059669'], cancelled: ['#FEE2E2', '#DC2626'], returned: ['#F3F4F6', '#6B7280'] };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    api.get(`/orders/admin?${params}`).then(r => { setOrders(r.data.orders || []); setTotal(r.data.total || 0); }).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, [page, statusFilter]);

  const updateStatus = async (id, status) => {
    try { await api.put(`/orders/${id}/status`, { status }); toast.success('Status updated'); load(); }
    catch { toast.error('Failed to update'); }
  };

  return (
    <AdminLayout title="Orders">
      <Helmet><title>Orders – Admin – Shree Vastra</title></Helmet>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none', background: 'white' }}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total: {total} orders</span>
      </div>
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-soft)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-cream)', borderBottom: '2px solid var(--color-border)' }}>
              {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</td></tr> :
              orders.length === 0 ? <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No orders found</td></tr> :
              orders.map(o => {
                const [bg, color] = STATUS_COLORS[o.status] || ['#F3F4F6', '#6B7280'];
                return (
                  <tr key={o._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-primary)' }}>#{o.orderNumber}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{o.user?.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{o.user?.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{o.items?.length} items</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: o.paymentStatus === 'paid' ? '#D1FAE5' : '#FEE2E2', color: o.paymentStatus === 'paid' ? '#059669' : '#DC2626', fontWeight: 600 }}>{o.paymentStatus}</span></td>
                    <td style={{ padding: '14px 16px' }}><span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', background: bg, color, fontWeight: 600 }}>{o.status}</span></td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.78rem', fontFamily: 'var(--font-body)', outline: 'none', cursor: 'pointer' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
