import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import AccountLayout from '../../components/AccountLayout';
import { Package, Heart, Star, MapPin } from 'lucide-react';
import api from '../../lib/api';

export default function Dashboard() {
  const user = useSelector(selectUser);
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders/my').then(r => setOrders(r.data.orders || [])).catch(() => {}); }, []);
  const stats = [{ label: 'Total Orders', value: orders.length, icon: Package, to: '/account/orders' }, { label: 'Loyalty Points', value: user?.loyaltyPoints || 0, icon: Star, to: '/account' }, { label: 'Saved Items', value: 0, icon: Heart, to: '/account/wishlist' }, { label: 'Addresses', value: user?.addresses?.length || 0, icon: MapPin, to: '/account/addresses' }];
  return (
    <AccountLayout>
      <Helmet><title>My Account – Shree Vastra</title></Helmet>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.8rem', marginBottom: '24px' }}>Welcome back, {user?.name?.split(' ')[0]}! 🌸</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow-soft)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', display: 'block' }}>
            <Icon size={24} color="var(--color-primary)" style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{label}</div>
          </Link>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-soft)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '16px' }}>Recent Orders</h2>
        {orders.length === 0 ? (<p style={{ color: 'var(--color-text-muted)' }}>No orders yet. <Link to="/shop" style={{ color: 'var(--color-accent)' }}>Start shopping!</Link></p>) :
          orders.slice(0, 3).map(o => (<div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}><div><div style={{ fontWeight: 600 }}>#{o.orderNumber}</div><div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</div></div><div style={{ textAlign: 'right' }}><span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: o.status === 'delivered' ? '#D1FAE5' : '#FEF3C7', color: o.status === 'delivered' ? '#059669' : '#D97706' }}>{o.status}</span><div style={{ fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>₹{o.totalAmount?.toLocaleString('en-IN')}</div></div></div>))}
      </div>
    </AccountLayout>
  );
}
