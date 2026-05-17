import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Users, Package, TrendingUp, ArrowUp, Clock, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../lib/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { label: 'Total Revenue', value: `₹${(data.stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: TrendingUp, color: '#059669', bg: '#D1FAE5' },
    { label: 'Total Orders', value: data.stats.totalOrders, icon: ShoppingBag, color: '#7B1C2E', bg: '#FCE7F3' },
    { label: 'Products', value: data.stats.totalProducts, icon: Package, color: '#C6973F', bg: '#FEF3C7' },
    { label: 'Customers', value: data.stats.totalCustomers, icon: Users, color: '#6366F1', bg: '#EDE9FE' },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      <Helmet><title>Admin Dashboard – Shree Vastra</title></Helmet>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '24px', height: '110px', boxShadow: 'var(--shadow-soft)', animation: 'pulse 1.5s infinite' }} />
        )) : stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-soft)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={24} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-soft)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} /> Recent Orders
          </h3>
          {!loading && data?.recentOrders?.map(o => (
            <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>#{o.orderNumber}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{o.user?.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>₹{o.totalAmount?.toLocaleString('en-IN')}</div>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', background: '#FEF3C7', color: '#D97706', fontWeight: 600 }}>{o.status}</span>
              </div>
            </div>
          ))}
          {(!data?.recentOrders?.length && !loading) && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No orders yet.</p>}
        </div>

        {/* Low Stock */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-soft)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: '#D97706', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> Low Stock Alert
          </h3>
          {!loading && data?.lowStock?.map(p => (
            <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{p.category}</div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: p.stockQty === 0 ? '#DC2626' : '#D97706', background: p.stockQty === 0 ? '#FEE2E2' : '#FEF3C7', padding: '3px 10px', borderRadius: '8px' }}>
                {p.stockQty === 0 ? 'Out of Stock' : `${p.stockQty} left`}
              </span>
            </div>
          ))}
          {(!data?.lowStock?.length && !loading) && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>All products in stock ✅</p>}
        </div>
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </AdminLayout>
  );
}
