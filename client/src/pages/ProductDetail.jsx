import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Star, Truck, RotateCcw, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../store/slices/wishlistSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/ui/Loader';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const isWishlisted = useSelector(selectIsWishlisted(product?._id));

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.product);
        setSelectedSize(data.product.sizes?.[0] || '');
        setSelectedColor(data.product.colors?.[0]?.name || '');
        // Fetch related
        const rel = await api.get(`/products?category=${data.product.category}&limit=4`);
        setRelated(rel.data.products.filter(p => p._id !== data.product._id).slice(0, 4));
      } catch { } finally { setLoading(false); }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error('Please select a size');
    dispatch(addToCart({ product, qty, size: selectedSize, color: selectedColor }));
    toast.success('🛍️ Added to cart!');
  };

  if (loading) return <Loader fullPage />;
  if (!product) return <div style={{ textAlign: 'center', padding: '80px' }}>Product not found</div>;

  const discount = product.discountPercent || (product.price && product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0);
  const price = product.discountPrice || product.price;

  return (
    <>
      <Helmet>
        <title>{product.seoTitle || `${product.name} – Shree Vastra`}</title>
        <meta name="description" content={product.seoDescription || product.description?.slice(0, 150)} />
      </Helmet>

      <div style={{ background: 'var(--color-cream)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Breadcrumb */}
          <nav style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '28px' }}>
            <a href="/" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Home</a> / <a href="/shop" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Shop</a> / <a href={`/shop/${product.category}`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>{product.category}</a> / {product.name}
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
            {/* Image Gallery */}
            <div>
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: 'white', aspectRatio: '3/4', boxShadow: 'var(--shadow-card)' }}>
                <img src={product.images?.[selectedImage]?.url || '/placeholder-product.jpg'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
                {discount > 0 && <span className="badge badge-sale" style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '0.85rem', padding: '4px 14px' }}>{discount}% OFF</span>}
                <button onClick={() => dispatch(toggleWishlist(product))} style={{ position: 'absolute', top: '16px', right: '16px', width: '42px', height: '42px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)' }}>
                  <Heart size={18} fill={isWishlisted ? '#7B1C2E' : 'none'} color={isWishlisted ? '#7B1C2E' : '#6B4F4F'} />
                </button>
                {product.images?.length > 1 && (
                  <>
                    <button onClick={() => setSelectedImage(p => Math.max(0, p - 1))} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)' }}><ChevronLeft size={18} /></button>
                    <button onClick={() => setSelectedImage(p => Math.min(product.images.length - 1, p + 1))} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)' }}><ChevronRight size={18} /></button>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px', overflowX: 'auto' }}>
                  {product.images.map((img, i) => (
                    <img key={i} src={img.url} alt="" onClick={() => setSelectedImage(i)} style={{ width: '72px', height: '88px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer', border: selectedImage === i ? '2px solid var(--color-primary)' : '2px solid transparent', transition: 'border-color 0.2s', flexShrink: 0 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '8px' }}>{product.category}</p>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--color-text)', marginBottom: '12px', lineHeight: 1.2 }}>{product.name}</h1>

              {/* Rating */}
              {product.ratings?.count > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < Math.round(product.ratings.average) ? 'var(--color-accent)' : 'none'} color="var(--color-accent)" />)}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{product.ratings.average.toFixed(1)}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>({product.ratings.count} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>₹{price.toLocaleString('en-IN')}</span>
                {discount > 0 && <>
                  <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="badge badge-sale">{discount}% off</span>
                </>}
              </div>

              {/* Fabric */}
              {product.fabric && <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Fabric: <b style={{ color: 'var(--color-text)' }}>{product.fabric}</b></p>}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '10px', display: 'block' }}>Color: <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>{selectedColor}</span></label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {product.colors.map(c => (
                      <button key={c.name} title={c.name} onClick={() => setSelectedColor(c.name)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.hex, border: selectedColor === c.name ? '3px solid var(--color-primary)' : '2px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.2s', outline: selectedColor === c.name ? '2px solid white' : 'none', outlineOffset: '-5px' }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Size: <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>{selectedSize}</span></label>
                    <a href="/size-guide" style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textDecoration: 'none' }}>Size Guide</a>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => setSelectedSize(s)} style={{ padding: '8px 18px', borderRadius: '8px', border: '1.5px solid', borderColor: selectedSize === s ? 'var(--color-primary)' : 'var(--color-border)', background: selectedSize === s ? 'var(--color-primary)' : 'white', color: selectedSize === s ? 'white' : 'var(--color-text)', cursor: 'pointer', fontWeight: selectedSize === s ? 700 : 400, transition: 'all 0.2s', fontSize: '0.875rem' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Qty + CTA */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '40px', height: '48px', border: 'none', background: 'var(--color-cream)', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                  <span style={{ width: '50px', textAlign: 'center', fontWeight: 600, fontSize: '1rem' }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: '40px', height: '48px', border: 'none', background: 'var(--color-cream)', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>
                <button id="add-to-cart" onClick={handleAddToCart} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px 24px', fontSize: '0.95rem' }} disabled={product.stockQty === 0}>
                  <ShoppingBag size={18} /> {product.stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
              <button id="buy-now" onClick={() => { handleAddToCart(); }} className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>Buy Now</button>

              {/* Delivery info */}
              <div style={{ marginTop: '24px', background: 'var(--color-cream)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[{ Icon: Truck, text: 'Free delivery on orders above ₹999' }, { Icon: RotateCcw, text: '7-day easy returns & exchanges' }].map(({ Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <Icon size={16} color="var(--color-primary)" /> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginTop: '60px', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
              {['description', 'care', 'reviews'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent', textTransform: 'capitalize', transition: 'all 0.2s' }}>
                  {tab === 'reviews' ? `Reviews (${product.ratings?.count || 0})` : tab}
                </button>
              ))}
            </div>
            <div style={{ padding: '28px' }}>
              {activeTab === 'description' && <p style={{ lineHeight: 1.8, color: 'var(--color-text)', fontSize: '0.95rem' }}>{product.description}</p>}
              {activeTab === 'care' && <p style={{ lineHeight: 1.8, color: 'var(--color-text)', fontSize: '0.95rem' }}>{product.careInstructions || 'Dry clean recommended. Store in a cool, dry place.'}</p>}
              {activeTab === 'reviews' && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>
                  {product.ratings?.count === 0 ? 'No reviews yet. Be the first to review!' : `${product.ratings?.count} customer reviews`}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div style={{ marginTop: '60px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '28px' }}>You May Also Like</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
                {related.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .product-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
