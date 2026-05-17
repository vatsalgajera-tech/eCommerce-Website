import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ShoppingBag, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found</title></Helmet>
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--color-cream)', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px' }}>
          {/* Big decorative number */}
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(6rem, 20vw, 10rem)', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, opacity: 0.12, userSelect: 'none', marginBottom: '-20px' }}>
            404
          </div>
          {/* Saree icon */}
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🥻</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
            Page Not Found
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '36px' }}>
            Oops! This page seems to have gone out of stock. Let's take you back to our beautiful collection.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Home size={16} /> Back to Home
            </Link>
            <Link to="/shop" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={16} /> Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
