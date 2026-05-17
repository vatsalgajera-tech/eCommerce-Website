import { Link, NavLink } from 'react-router-dom';
import { User, Package, MapPin, Heart, Star, RotateCcw, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const NAV = [
  { to: '/account', label: 'Dashboard', icon: User },
  { to: '/account/profile', label: 'My Profile', icon: User },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/orders', label: 'My Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/returns', label: 'Returns', icon: RotateCcw },
  { to: '/account/reviews', label: 'My Reviews', icon: Star },
];

export default function AccountLayout({ children }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div style={{ background: 'var(--color-cream)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '28px', alignItems: 'start' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-soft)', position: 'sticky', top: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, margin: '0 auto 12px' }}>{user?.name?.[0]}</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/account'} style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, background: isActive ? 'var(--color-cream)' : 'none', color: isActive ? 'var(--color-primary)' : 'var(--color-text)', transition: 'all 0.2s' })}>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
            <button onClick={() => { dispatch(logout()); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 500, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
