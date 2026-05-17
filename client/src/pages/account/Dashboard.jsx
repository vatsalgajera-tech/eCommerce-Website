import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { selectWishlist } from '../../store/slices/wishlistSlice';
import AccountLayout from '../../components/AccountLayout';
import { Package, Heart, Star, MapPin } from 'lucide-react';
import api from '../../lib/api';

export default function Dashboard() {
  const user = useSelector(selectUser);
  const [orders, setOrders] = useState([]);
  const [addrCount, setAddrCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data.orders || [])).catch(() => {});
    api.get('/auth/addresses').then(r => setAddrCount(r.data.addresses?.length || 0)).catch(() => {});
    api.get('/products?wishlist=true&limit=1').catch(() => {});
    // Wishlist is in Redux (local)
  }, []);

  const wishlistItems = useSelector(selectWishlist);

  const stats = [
    { label: 'Total Orders',  value: orders.length, icon: Package, to: '/account/orders', color: '#7B1C2E', bg: '#FCE7F3' },
    { label: 'Loyalty Points',value: user?.loyaltyPoints || 0, icon: Star, to: '/account', color: '#C6973F', bg: '#FEF3C7' },
    { label: 'Wishlist Items',  value: wishlistItems.length, icon: Heart, to: '/account/wishlist', color: '#EC4899', bg: '#FCE7F3' },
    { label: 'Saved Addresses',value: addrCount, icon: MapPin, to: '/account/addresses', color: '#6366F1', bg: '#EDE9FE' },
  ];
  return (
    <AccountLayout>
      <Helmet><title>My Account – Shree Vastra</title></Helmet>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.8rem', marginBottom: '24px' }}>Welcome back, {user?.name?.split(' ')[0]}! 🌸</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map(({ label, value, icon: Icon, to, color, bg }) => (
          <Link key={label} to={to} style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-soft)', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', display: 'block' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-card)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-soft)'; }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Icon size={22} color={color} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: color, marginBottom: '4px', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</div>
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
