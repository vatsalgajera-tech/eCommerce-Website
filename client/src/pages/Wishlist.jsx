import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { selectWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const items = useSelector(selectWishlist);
  return (
    <>
      <Helmet><title>Wishlist – Shree Vastra</title></Helmet>
      <div style={{ background: 'var(--color-cream)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '2.2rem', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Heart fill="var(--color-primary)" color="var(--color-primary)" /> My Wishlist ({items.length})
          </h1>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px' }}>
              <Heart size={64} color="var(--color-border)" style={{ marginBottom: '20px' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', marginBottom: '12px' }}>Your wishlist is empty</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '28px' }}>Save your favourite pieces here.</p>
              <Link to="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Collections</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
              {items.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
