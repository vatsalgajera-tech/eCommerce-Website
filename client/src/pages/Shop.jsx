import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

const CATEGORIES = ['sarees', 'kurti', 'kurta', 'dress', 'dupatta', 'top-bottom-set', 'tops-tunics', 'jumpsuits', 'gowns', 'lenghas'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const OCCASIONS = ['Casual', 'Festive', 'Wedding', 'Party', 'Office', 'Daily Wear'];
const PRICE_RANGES = [{ label: 'Under ₹500', min: 0, max: 500 }, { label: '₹500–₹1000', min: 500, max: 1000 }, { label: '₹1000–₹2000', min: 1000, max: 2000 }, { label: '₹2000–₹5000', min: 2000, max: 5000 }, { label: 'Above ₹5000', min: 5000, max: 99999 }];
const SORT_OPTIONS = [{ value: 'newest', label: 'Newest' }, { value: 'popular', label: 'Popularity' }, { value: 'rated', label: 'Best Rated' }, { value: 'price-asc', label: 'Price: Low to High' }, { value: 'price-desc', label: 'Price: High to Low' }];

export default function Shop() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({ categories: category ? [category] : [], minPrice: '', maxPrice: '', size: [], occasion: [], sort: 'newest' });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sort: filters.sort });
      if (filters.categories.length) params.set('category', filters.categories.join(','));
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.size.length) params.set('size', filters.size.join(','));
      if (filters.occasion.length) params.set('occasion', filters.occasion.join(','));
      const q = searchParams.get('q');
      if (q) params.set('search', q);
      if (searchParams.get('featured')) params.set('featured', 'true');
      if (searchParams.get('newArrival')) params.set('newArrival', 'true');

      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch { setProducts([]); } finally { setLoading(false); }
  }, [filters, page, searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { if (category) setFilters(f => ({ ...f, categories: [category] })); }, [category]);

  const toggleArray = (key, val) => setFilters(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val] }));
  const setPrice = (min, max) => setFilters(f => ({ ...f, minPrice: String(min), maxPrice: String(max) }));

  const FilterSection = ({ title, children }) => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '20px' }}>
        <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>{title}</span>
          <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
        </button>
        {open && <div style={{ marginTop: '14px' }}>{children}</div>}
      </div>
    );
  };

  const sidebar = (
    <div style={{ width: '260px', flexShrink: 0, background: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-soft)', height: 'fit-content', position: 'sticky', top: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary)' }}>Filters</h3>
        <button onClick={() => setFilters({ categories: [], minPrice: '', maxPrice: '', size: [], occasion: [], sort: 'newest' })}
          style={{ fontSize: '0.75rem', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Clear All
        </button>
      </div>

      <FilterSection title="Category">
        {CATEGORIES.map(c => (
          <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '0.875rem', color: filters.categories.includes(c) ? 'var(--color-primary)' : 'var(--color-text)' }}>
            <input type="checkbox" checked={filters.categories.includes(c)} onChange={() => toggleArray('categories', c)} style={{ accentColor: 'var(--color-primary)', width: '15px', height: '15px' }} />
            {c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, ' ')}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Price Range">
        {PRICE_RANGES.map(r => (
          <label key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type="radio" name="price" checked={filters.minPrice === String(r.min) && filters.maxPrice === String(r.max)} onChange={() => setPrice(r.min, r.max)} style={{ accentColor: 'var(--color-primary)' }} />
            {r.label}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Size">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SIZES.map(s => (
            <button key={s} onClick={() => toggleArray('size', s)} style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid', borderColor: filters.size.includes(s) ? 'var(--color-primary)' : 'var(--color-border)', background: filters.size.includes(s) ? 'var(--color-primary)' : 'transparent', color: filters.size.includes(s) ? 'white' : 'var(--color-text)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500 }}>
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Occasion">
        {OCCASIONS.map(o => (
          <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '0.875rem' }}>
            <input type="checkbox" checked={filters.occasion.includes(o)} onChange={() => toggleArray('occasion', o)} style={{ accentColor: 'var(--color-primary)' }} />
            {o}
          </label>
        ))}
      </FilterSection>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)} – Shree Vastra` : 'Shop – Shree Vastra'}</title>
        <meta name="description" content="Shop premium women's ethnic wear at Shree Vastra. Browse sarees, kurtis, gowns, and more with easy filtering and sorting." />
      </Helmet>

      <div style={{ background: 'var(--color-cream)', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--color-primary), #9E2438)', padding: '48px 20px', textAlign: 'center', color: 'white' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700 }}>
            {category ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ') : 'All Collections'}
          </h1>
          <p style={{ opacity: 0.85, marginTop: '8px' }}>{total} products found</p>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Toolbar — sort only, filter sidebar is always shown on desktop */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginRight: 'auto' }}>
              {total} product{total !== 1 ? 's' : ''} found
              {(filters.categories.length + filters.size.length + filters.occasion.length) > 0 &&
                <span style={{ marginLeft: '8px', background: 'var(--color-primary)', color: 'white', fontSize: '0.72rem', padding: '1px 8px', borderRadius: '20px', fontWeight: 700 }}>
                  {filters.categories.length + filters.size.length + filters.occasion.length} filters active
                </span>
              }
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Sort by:</span>
            <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.875rem', fontFamily: 'var(--font-body)', background: 'white', cursor: 'pointer', outline: 'none' }}>
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
            {/* Desktop sidebar */}
            <div className="shop-sidebar">{sidebar}</div>

            {/* Products grid */}
            <div style={{ flex: 1 }}>
              {loading ? <Loader /> : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>No products found</h3>
                  <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>Try adjusting your filters</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
                    {products.map(p => <ProductCard key={p._id} product={p} />)}
                  </div>
                  {pages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px', flexWrap: 'wrap' }}>
                      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)} style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid', borderColor: page === p ? 'var(--color-primary)' : 'var(--color-border)', background: page === p ? 'var(--color-primary)' : 'white', color: page === p ? 'white' : 'var(--color-text)', cursor: 'pointer', fontWeight: page === p ? 700 : 400, transition: 'all 0.2s' }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 500 }}>
            <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '280px', background: 'white', overflowY: 'auto', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Filters</h3>
                <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              {sidebar}
            </div>
          </div>
        )}
      </div>
      <style>{`@media (max-width: 768px) { .shop-sidebar { display: none !important; } }`}</style>
    </>
  );
}
