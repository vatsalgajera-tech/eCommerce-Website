import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Heart, Search, Menu, X, User, ChevronDown, Package, LogOut } from 'lucide-react';
import { selectCartCount } from '../store/slices/cartSlice';
import { selectUser, logout } from '../store/slices/authSlice';
import { selectWishlist } from '../store/slices/wishlistSlice';

const CATEGORIES = [
  { name: 'Sarees', slug: 'sarees' },
  { name: 'Kurti', slug: 'kurti' },
  { name: 'Kurta', slug: 'kurta' },
  { name: 'Dresses', slug: 'dress' },
  { name: 'Dupatta', slug: 'dupatta' },
  { name: 'Top-Bottom Sets', slug: 'top-bottom-set' },
  { name: 'Tops & Tunics', slug: 'tops-tunics' },
  { name: 'Jumpsuits', slug: 'jumpsuits' },
  { name: 'Gowns', slug: 'gowns' },
  { name: 'Lenghas', slug: 'lenghas' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const cartCount = useSelector(selectCartCount);
  const wishlist = useSelector(selectWishlist);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); setSearchQuery(''); }
  };

  const handleLogout = () => { dispatch(logout()); navigate('/'); setUserMenuOpen(false); };

  return (
    <>
      {/* Top strip */}
      <div style={{ background: 'var(--color-primary)', color: 'white', fontSize: '0.78rem', textAlign: 'center', padding: '6px 16px' }}>
        🎁 Free shipping on orders above ₹999 &nbsp;|&nbsp; 💳 COD available &nbsp;|&nbsp; 📞 +91 97231 40922
      </div>

      {/* Main Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: scrolled ? 'rgba(253,246,236,0.97)' : 'var(--color-cream)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: scrolled ? 'var(--shadow-soft)' : 'none',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '14px 20px', maxWidth: '1280px', margin: '0 auto' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
              Shree Vastra
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-accent)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>
              Elegance in Every Thread
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '32px', flex: 1 }} className="hidden-mobile">
            <NavLink to="/" className="nav-link" style={navStyle}>Home</NavLink>
            
            {/* Shop with dropdown */}
            <div style={{ position: 'relative' }} onMouseEnter={() => setShopMenuOpen(true)} onMouseLeave={() => setShopMenuOpen(false)}>
              <button style={{ ...navStyle, display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
                Shop <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: shopMenuOpen ? 'rotate(180deg)' : 'none' }} />
              </button>
              {shopMenuOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-card)', padding: '12px', minWidth: '200px', zIndex: 200, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  {CATEGORIES.map(c => (
                    <Link key={c.slug} to={`/shop/${c.slug}`} style={{ padding: '8px 12px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.875rem', borderRadius: '8px', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.target.style.background = 'var(--color-cream)'} onMouseLeave={e => e.target.style.background = 'none'}>
                      {c.name}
                    </Link>
                  ))}
                  <Link to="/shop" style={{ gridColumn: '1/-1', padding: '8px 12px', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', borderRadius: '8px', textAlign: 'center', background: 'var(--color-cream)' }}>
                    View All Collections →
                  </Link>
                </div>
              )}
            </div>
            <NavLink to="/blog" style={navStyle}>Blog</NavLink>
            <NavLink to="/about" style={navStyle}>About</NavLink>
            <NavLink to="/contact" style={navStyle}>Contact</NavLink>
          </div>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
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

            {/* User menu */}
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={iconBtn} aria-label="Account">
                <User size={20} />
              </button>
              {userMenuOpen && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-card)', padding: '8px', minWidth: '200px', zIndex: 200 }}>
                  {user ? (
                    <>
                      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)', marginBottom: '6px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</div>
                      </div>
                      {[{ to: '/account', label: 'My Dashboard', icon: <User size={14} /> }, { to: '/account/orders', label: 'My Orders', icon: <Package size={14} /> }, { to: '/account/wishlist', label: 'My Wishlist', icon: <Heart size={14} /> }].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)} style={dropdownItem}>
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} style={{ ...dropdownItem, color: 'var(--color-primary)', fontWeight: 600 }}>
                          🛡️ Admin Panel
                        </Link>
                      )}
                      <hr style={{ margin: '6px 0', borderColor: 'var(--color-border)' }} />
                      <button onClick={handleLogout} style={{ ...dropdownItem, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>
                        <LogOut size={14} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setUserMenuOpen(false)} style={dropdownItem}>Login</Link>
                      <Link to="/register" onClick={() => setUserMenuOpen(false)} style={{ ...dropdownItem, color: 'var(--color-primary)', fontWeight: 600 }}>Create Account</Link>
                    </>
                  )}
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
              <input id="search-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search sarees, kurtis, gowns..."
                autoFocus style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '2px solid var(--color-border)', fontSize: '0.95rem', outline: 'none', fontFamily: 'var(--font-body)' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'} onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
              <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>Search</button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: 'white', borderTop: '1px solid var(--color-border)', padding: '16px 20px' }}>
            {['/', '/shop', '/blog', '/about', '/contact'].map((path, i) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '12px 0', color: 'var(--color-text)', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, borderBottom: i < 4 ? '1px solid var(--color-border)' : 'none' }}>
                {['Home', 'Shop', 'Blog', 'About', 'Contact'][i]}
              </Link>
            ))}
            {CATEGORIES.map(c => (
              <Link key={c.slug} to={`/shop/${c.slug}`} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '10px 16px', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                → {c.name}
              </Link>
            ))}
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
const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', padding: '8px', borderRadius: '8px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' };
const badge = { position: 'absolute', top: '2px', right: '2px', background: 'var(--color-primary)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 };
const dropdownItem = { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.875rem', borderRadius: '8px', transition: 'background 0.2s' };
