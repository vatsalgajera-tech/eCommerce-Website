import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser } from '../store/slices/authSlice';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, Star, Settings, LogOut, Menu, X } from 'lucide-react';

const NAV = [
  { to: '/admin',           label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products',  label: 'Products',  icon: Package },
  { to: '/admin/orders',    label: 'Orders',    icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/coupons',   label: 'Coupons',   icon: Tag },
  { to: '/admin/reviews',   label: 'Reviews',   icon: Star },
  { to: '/admin/settings',  label: 'Settings',  icon: Settings },
];

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F4F0', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? '240px' : '64px', background: 'var(--color-primary)', transition: 'width 0.3s ease', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Shree Vastra</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin Panel</div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'white', display: 'flex', flexShrink: 0 }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px',
                textDecoration: 'none', color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                marginBottom: '4px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                fontWeight: isActive ? 600 : 400, fontSize: '0.875rem',
              })}
              onMouseEnter={e => { if (!e.currentTarget.style.background.includes('0.15')) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { if (!e.currentTarget.style.background.includes('0.15')) e.currentTarget.style.background = 'transparent'; }}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              {sidebarOpen && label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: '16px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {sidebarOpen && user && (
            <div style={{ padding: '8px 12px', marginBottom: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px' }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            </div>
          )}
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', color: 'rgba(255,255,255,0.65)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: '0.875rem', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color='#FCA5A5'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.65)'}>
            <LogOut size={18} style={{ flexShrink: 0 }} /> {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content — NO footer */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '18px 28px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.4rem', margin: 0 }}>{title || 'Admin Panel'}</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', background: 'var(--color-cream)', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>👑 Administrator</span>
        </div>
        <div style={{ flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}
