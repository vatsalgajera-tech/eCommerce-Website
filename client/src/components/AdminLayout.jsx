import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, Image, Star, FileText, BarChart2, Settings, LogOut, Menu, X, ChevronDown } from 'lucide-react';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F4F0', fontFamily: 'var(--font-body)' }}>
      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? '240px' : '64px', background: 'var(--color-primary)', transition: 'width 0.3s ease', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {sidebarOpen && <div style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Shree Vastra</div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'white', display: 'flex', flexShrink: 0 }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/admin'} style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', textDecoration: 'none', color: isActive ? 'white' : 'rgba(255,255,255,0.65)', background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent', marginBottom: '4px', transition: 'all 0.2s', whiteSpace: 'nowrap', fontWeight: isActive ? 600 : 400, fontSize: '0.875rem' })}
              onMouseEnter={e => { if (!e.currentTarget.style.background.includes('0.15')) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { if (!e.currentTarget.style.background.includes('0.15')) e.currentTarget.style.background = 'transparent'; }}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              {sidebarOpen && label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', color: 'rgba(255,255,255,0.65)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
            <LogOut size={18} style={{ flexShrink: 0 }} /> {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: 'white', padding: '20px 28px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.4rem' }}>{title}</h1>
          <Link to="/" target="_blank" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>View Store →</Link>
        </div>
        <div style={{ padding: '28px' }}>{children}</div>
      </main>
    </div>
  );
}
