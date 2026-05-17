import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/ui/Loader';
import api from '../lib/api';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState(query);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    api.get(`/products?search=${encodeURIComponent(query)}&limit=24`)
      .then(({ data }) => { setProducts(data.products || []); setTotal(data.total || 0); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) setSearchParams({ q: inputVal.trim() });
  };

  return (
    <>
      <Helmet>
        <title>{query ? `"${query}" – Search – Shree Vastra` : 'Search – Shree Vastra'}</title>
      </Helmet>

      {/* Search Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-primary), #9E2438)', padding: '48px 20px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', marginBottom: '20px' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Search sarees, kurtis, gowns..."
              style={{ flex: 1, padding: '14px 20px', borderRadius: '10px', border: 'none', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
            />
            <button type="submit" style={{ padding: '14px 24px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} />
            </button>
          </form>
          {query && !loading && (
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '14px', fontSize: '0.9rem' }}>
              {total > 0 ? `${total} results for "${query}"` : `No results for "${query}"`}
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 20px', minHeight: '50vh' }}>
        {!query.trim() ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '8px' }}>Search Our Collection</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Type something above to discover your perfect ethnic wear</p>
          </div>
        ) : loading ? <Loader fullPage /> : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😔</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '8px' }}>No results found</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>We couldn't find anything for "{query}"</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>Browse All Products</Link>
              <Link to="/shop/sarees" className="btn-outline" style={{ textDecoration: 'none' }}>Shop Sarees</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
}
