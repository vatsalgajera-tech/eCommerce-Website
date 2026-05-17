import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Heart, Search, Menu, X, User, ChevronDown, Package, LogOut } from 'lucide-react';
import { selectCartCount } from '../store/slices/cartSlice';
import { selectUser, logout } from '../store/slices/authSlice';
import { selectWishlist } from '../store/slices/wishlistSlice';

const CATEGORIES = [
  { name: 'Sarees',          slug: 'sarees',        emoji: '🥻' },
  { name: 'Kurti',           slug: 'kurti',         emoji: '👘' },
  { name: 'Kurta',           slug: 'kurta',         emoji: '🎽' },
  { name: 'Dresses',         slug: 'dress',         emoji: '👗' },
  { name: 'Top-Bottom Sets', slug: 'top-bottom-set',emoji: '✨' },
  { name: 'Tops & Tunics',   slug: 'tops-tunics',   emoji: '👚' },
  { name: 'Jumpsuits',       slug: 'jumpsuits',     emoji: '💫' },
  { name: 'Gowns',           slug: 'gowns',         emoji: '🌟' },
  { name: 'Lenghas',         slug: 'lenghas',       emoji: '🌸' },
  { name: 'Dupatta',         slug: 'dupatta',       emoji: '🎀' },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shopOpen, setShopOpen]       = useState(false);
  const cartCount = useSelector(selectCartCount);
  const wishlist  = useSelector(selectWishlist);
  const user      = useSelector(selectUser);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const userMenuRef = useRef(null);
  const shopRef     = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); setSearchQuery(''); }
  };

  const handleLogout = () => { dispatch(logout()); navigate('/'); setUserMenuOpen(false); };

  // Profile icon: if logged out → go to login; if logged in → show dropdown
  const handleProfileClick = () => {
    if (!user) { navigate('/login'); return; }
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <>
      {/* Main Navbar — NO top strip */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: scrolled ? 'rgba(253,246,236,0.97)' : 'var(--color-cream)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: scrolled ? 'var(--shadow-soft)' : 'none',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px', padding: '14px 20px', maxWidth: '1400px', margin: '0 auto' }}>

          {/* Logo — left */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Shree Vastra</span>
            <span style={{ fontSize: '0.6rem', color: 'var(--color-accent)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>Elegance in Every Thread</span>
          </Link>

          {/* Center nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="hidden-mobile">
            <NavLink to="/" className="nav-link" style={navStyle}>Home</NavLink>
            <NavLink to="/shop" className="nav-link" style={navStyle}>Shop</NavLink>

            {/* Categories dropdown */}
            <div style={{ position: 'relative' }} ref={shopRef}>
              <button
                onClick={() => setShopOpen(o => !o)}
                style={{ ...navStyle, display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Categories <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: shopOpen ? 'rotate(180deg)' : 'none' }} />
              </button>
              {shopOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: 'white', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', padding: '16px', minWidth: '380px', zIndex: 200 }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '4px' }}>All Categories</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    {CATEGORIES.map(c => (
                      <Link key={c.slug} to={`/shop/${c.slug}`} onClick={() => setShopOpen(false)}
                        style={{ padding: '9px 10px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.15s', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-cream)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <span>{c.emoji}</span> {c.name}
                      </Link>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '10px', paddingTop: '10px' }}>
                    <Link to="/shop" onClick={() => setShopOpen(false)}
                      style={{ display: 'block', textAlign: 'center', padding: '9px', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem', borderRadius: '10px', background: 'var(--color-cream)' }}>
                      View All Collections →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/about"   className="nav-link" style={navStyle}>About</NavLink>
            <NavLink to="/contact" className="nav-link" style={navStyle}>Contact</NavLink>
          </div>

          {/* Right: Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <button id="search-btn" onClick={() => setSearchOpen(!searchOpen)} style={iconBtn} aria-label="Search">
              <Search size={20} />
            </button>

            <Link to="/wishlist" id="wishlist-btn" style={{ ...iconBtn, position: 'relative', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }} aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && <span style={badge}>{wishlist.length}</span>}
            </Link>

            <Link to="/cart" id="cart-btn" style={{ ...iconBtn, position: 'relative', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }} aria-label="Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span style={badge}>{cartCount}</span>}
            </Link>

            {/* Profile icon — no dropdown for guests, dropdown for logged-in */}
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button onClick={handleProfileClick} style={iconBtn} aria-label="Account" id="profile-btn">
                {user ? (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                ) : <User size={20} />}
              </button>

              {/* Dropdown only for logged-in users */}
              {user && userMenuOpen && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'white', borderRadius: '14px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', padding: '8px', minWidth: '210px', zIndex: 200 }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                  </div>
                  {[
                    { to: '/account',           label: 'My Dashboard', icon: <User size={14}/> },
                    { to: '/account/orders',    label: 'My Orders',    icon: <Package size={14}/> },
                    { to: '/account/wishlist',  label: 'Wishlist',     icon: <Heart size={14}/> },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)} style={dropdownItem}
                      onMouseEnter={e => e.currentTarget.style.background='var(--color-cream)'}
                      onMouseLeave={e => e.currentTarget.style.background='none'}>
                      {item.icon} {item.label}
                    </Link>
                  ))}
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                      style={{ ...dropdownItem, color: 'var(--color-primary)', fontWeight: 700 }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--color-cream)'}
                      onMouseLeave={e => e.currentTarget.style.background='none'}>
                      🛡️ Admin Panel
                    </Link>
                  )}
                  <hr style={{ margin: '6px 0', borderColor: 'var(--color-border)' }} />
                  <button onClick={handleLogout} style={{ ...dropdownItem, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ ...iconBtn, display: 'none' }} className="show-mobile" aria-label="Menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ background: 'white', borderTop: '1px solid var(--color-border)', padding: '16px 20px' }}>
            <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '12px' }}>
              <input id="search-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search sarees, kurtis, gowns..." autoFocus
                style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '2px solid var(--color-border)', fontSize: '0.95rem', outline: 'none', fontFamily: 'var(--font-body)' }}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor='var(--color-border)'} />
              <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>Search</button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: 'white', borderTop: '1px solid var(--color-border)', padding: '16px 20px', maxHeight: '80vh', overflowY: 'auto' }}>
            {[{path:'/',label:'Home'},{path:'/shop',label:'Shop'},{path:'/about',label:'About'},{path:'/contact',label:'Contact'}].map((item,i,arr) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '12px 0', color: 'var(--color-text)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, borderBottom: i < arr.length-1 ? '1px solid var(--color-border)' : 'none' }}>
                {item.label}
              </Link>
            ))}
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '16px 0 8px' }}>Categories</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {CATEGORIES.map(c => (
                <Link key={c.slug} to={`/shop/${c.slug}`} onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.85rem', borderRadius: '8px', background: 'var(--color-cream)' }}>
                  {c.emoji} {c.name}
                </Link>
              ))}
            </div>
            {user ? (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <Link to="/account" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '10px 0', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 600 }}>My Account</Link>
                <button onClick={handleLogout} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', fontWeight: 600 }}>Logout</button>
              </div>
            ) : (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '10px' }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } .show-mobile { display: flex !important; } }
        .nav-link { color: var(--color-text); text-decoration: none; font-size: 0.9rem; font-weight: 500; padding: 6px 12px; border-radius: 6px; transition: all 0.2s; }
        .nav-link:hover, .nav-link.active { background: var(--color-cream-dark); color: var(--color-primary); }
      `}</style>
    </>
  );
}

const navStyle = { color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '6px 12px', borderRadius: '6px', transition: 'all 0.2s' };
const iconBtn  = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', padding: '8px', borderRadius: '8px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' };
const badge    = { position: 'absolute', top: '2px', right: '2px', background: 'var(--color-primary)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 };
const dropdownItem = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.875rem', borderRadius: '8px', transition: 'background 0.2s' };
