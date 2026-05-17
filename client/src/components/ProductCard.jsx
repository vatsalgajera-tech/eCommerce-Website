import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch     = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(product._id));

  const discount = product.discountPercent ||
    (product.price && product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0);

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, qty: 1, size: product.sizes?.[0], color: product.colors?.[0]?.name }));
    toast.success('🛍️ Added to cart!');
  };

  const finalPrice = product.discountPrice || product.price;

  return (
    <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        className="product-card"
        style={{
          background: 'white', borderRadius: '14px', overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(123,28,46,0.08)',
          transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative',
          display: 'flex', flexDirection: 'column',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(123,28,46,0.18)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(123,28,46,0.08)'; }}
      >
        {/* ── Image ── */}
        <div style={{ position: 'relative', paddingBottom: '120%', overflow: 'hidden', background: 'var(--color-cream)' }}>
          <img
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80'}
            alt={product.name}
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {product.isNewArrival && (
              <span style={{ background: 'var(--color-primary)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', letterSpacing: '0.05em' }}>NEW</span>
            )}
            {discount > 0 && (
              <span style={{ background: '#DC2626', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>{discount}% OFF</span>
            )}
            {product.stockQty === 0 && (
              <span style={{ background: '#9CA3AF', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>SOLD OUT</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'all 0.2s',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Heart size={15} fill={isWishlisted ? '#7B1C2E' : 'none'} color={isWishlisted ? '#7B1C2E' : '#6B4F4F'} />
          </button>
        </div>

        {/* ── Info ── */}
        <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Category */}
          <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            {product.category}
          </p>

          {/* Name */}
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600,
            color: 'var(--color-text)', margin: 0, lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          {/* Rating */}
          {product.ratings?.count > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11}
                  fill={i <= Math.round(product.ratings.average) ? 'var(--color-accent)' : 'none'}
                  color="var(--color-accent)" />
              ))}
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: '2px' }}>({product.ratings.count})</span>
            </div>
          )}

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <span style={{ fontSize: '0.8rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Color swatches */}
          {product.colors?.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
              {product.colors.slice(0, 5).map(c => (
                <div key={c.name} title={c.name}
                  style={{ width: '13px', height: '13px', borderRadius: '50%', background: c.hex, border: '1.5px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
              ))}
              {product.colors.length > 5 && (
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>+{product.colors.length - 5}</span>
              )}
            </div>
          )}

          {/* Add to Cart — always visible at bottom */}
          <button
            onClick={handleAddToCart}
            disabled={product.stockQty === 0}
            style={{
              marginTop: '10px', width: '100%', padding: '9px 12px',
              background: product.stockQty === 0 ? '#E5E7EB' : 'var(--color-primary)',
              color: product.stockQty === 0 ? '#9CA3AF' : 'white',
              border: 'none', borderRadius: '8px', fontWeight: 600, cursor: product.stockQty === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s', fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => { if (product.stockQty !== 0) e.currentTarget.style.background = 'var(--color-primary-dark)'; }}
            onMouseLeave={e => { if (product.stockQty !== 0) e.currentTarget.style.background = 'var(--color-primary)'; }}
          >
            <ShoppingBag size={13} />
            {product.stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
