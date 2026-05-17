import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountLayout from '../../components/AccountLayout';
import api from '../../lib/api';
import Loader from '../../components/ui/Loader';
import { Package } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/orders/my').then(r => setOrders(r.data.orders || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  return (
    <AccountLayout>
      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-soft)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '20px' }}>My Orders</h2>
        {loading ? <Loader /> : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><Package size={48} color="var(--color-border)" style={{ marginBottom: '16px' }} /><p style={{ color: 'var(--color-text-muted)' }}>No orders yet.</p><Link to="/shop" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Start Shopping</Link></div>
        ) : orders.map(o => (
          <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>#{o.orderNumber}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{o.items?.length} item(s) · {new Date(o.createdAt).toLocaleDateString('en-IN')}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>₹{o.totalAmount?.toLocaleString('en-IN')}</div>
              <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: '#FEF3C7', color: '#D97706' }}>{o.status}</span>
            </div>
          </div>
        ))}
      </div>
    </AccountLayout>
  );
}
