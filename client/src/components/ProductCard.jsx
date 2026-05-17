import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(product._id));
  const discount = product.discountPercent || (product.price && product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0);

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

  return (
    <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="product-card" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-card)', transition: 'all 0.35s ease', cursor: 'pointer', position: 'relative' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>

        {/* Image */}
        <div style={{ position: 'relative', paddingBottom: '125%', overflow: 'hidden', background: 'var(--color-cream)' }}>
          <img src={product.images?.[0]?.url || '/placeholder-product.jpg'} alt={product.name}
            loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'} />

          {/* Badges */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {product.isNewArrival && <span className="badge badge-new">NEW</span>}
            {discount > 0 && <span className="badge badge-sale">{discount}% OFF</span>}
            {product.stockQty === 0 && <span className="badge" style={{ background: '#e5e7eb', color: '#6b7280' }}>SOLD OUT</span>}
          </div>

          {/* Wishlist btn */}
          <button onClick={handleWishlist} aria-label="Wishlist"
            style={{ position: 'absolute', top: '12px', right: '12px', width: '36px', height: '36px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', transition: 'all 0.2s' }}>
            <Heart size={16} fill={isWishlisted ? '#7B1C2E' : 'none'} color={isWishlisted ? '#7B1C2E' : '#6B4F4F'} />
          </button>

          {/* Add to Cart overlay */}
          <div className="cart-overlay" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', opacity: 0, transition: 'opacity 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
            <button onClick={handleAddToCart} style={{ width: '100%', padding: '10px', background: 'white', color: 'var(--color-primary)', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--color-primary)'; }}>
              <ShoppingBag size={14} /> Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{product.category}</p>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>

          {/* Rating */}
          {product.ratings?.count > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
              <Star size={12} fill="var(--color-accent)" color="var(--color-accent)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)' }}>{product.ratings.average.toFixed(1)}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({product.ratings.count})</span>
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
              {product.colors.slice(0, 4).map(c => (
                <div key={c.name} title={c.name} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
              ))}
              {product.colors.length > 4 && <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>+{product.colors.length - 4}</span>}
            </div>
          )}
        </div>
      </div>

      <style>{`.product-card:hover .cart-overlay { opacity: 1 !important; }`}</style>
    </Link>
  );
}
