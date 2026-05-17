import { useState, useEffect } from 'react';
import AccountLayout from '../../components/AccountLayout';
import api from '../../lib/api';
import Loader from '../../components/ui/Loader';
import { Star, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

function StarDisplay({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < rating ? 'var(--color-accent)' : 'none'} color="var(--color-accent)" />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reviews/my').then(r => setReviews(r.data.reviews || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusBadge = (isApproved) => ({
    background: isApproved ? '#D1FAE5' : '#FEF3C7',
    color: isApproved ? '#065F46' : '#92400E',
    label: isApproved ? 'Published' : 'Pending Approval',
  });

  return (
    <AccountLayout>
      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-soft)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '6px' }}>My Reviews</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '28px' }}>Reviews you've written for products you purchased</p>

        {loading ? <Loader /> : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Star size={48} color="var(--color-border)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '8px' }}>No reviews yet</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Purchase products and share your experience!</p>
            <Link to="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map(r => {
              const badge = statusBadge(r.isApproved);
              return (
                <div key={r._id} style={{ border: '1px solid var(--color-border)', borderRadius: '14px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <img src={r.product?.images?.[0]?.url || '/placeholder-product.jpg'} alt={r.product?.name}
                    style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, background: 'var(--color-cream)' }} />
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${r.product?.slug}`} style={{ fontWeight: 700, color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.95rem' }}>
                      {r.product?.name}
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                      <StarDisplay rating={r.rating} />
                      <span style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '0.9rem' }}>{r.rating}.0</span>
                      <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, background: badge.background, color: badge.color }}>
                        {badge.label}
                      </span>
                    </div>
                    {r.title && <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{r.title}</div>}
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>{r.body}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
