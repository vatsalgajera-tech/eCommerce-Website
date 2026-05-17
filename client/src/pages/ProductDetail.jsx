import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Star, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../store/slices/wishlistSlice';
import { selectUser } from '../store/slices/authSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/ui/Loader';
import api from '../lib/api';
import toast from 'react-hot-toast';

function Stars({ value, onChange, size = 14 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size}
          fill={(hover||value)>=i ? 'var(--color-accent)' : 'none'}
          color="var(--color-accent)"
          style={{ cursor: onChange ? 'pointer' : 'default' }}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(i)}
        />
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [rf, setRf] = useState({ rating: 0, title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const isWishlisted = useSelector(selectIsWishlisted(product?._id));

  const loadReviews = async (productId) => {
    const rev = await api.get(`/reviews/product/${productId}`);
    setReviews(rev.data.reviews || []);
    if (user) setHasReviewed(!!rev.data.reviews?.find(r => r.user?._id === user.id));
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.product);
        setSelectedSize(data.product.sizes?.[0] || '');
        setSelectedColor(data.product.colors?.[0]?.name || '');
        const rel = await api.get(`/products?category=${data.product.category}&limit=5`);
        setRelated(rel.data.products.filter(p => p._id !== data.product._id).slice(0, 4));
        await loadReviews(data.product._id);
      } catch {} finally { setLoading(false); }
    })();
    window.scrollTo(0, 0);
  }, [slug]);

  const addCart = () => {
    if (!selectedSize) return toast.error('Please select a size');
    dispatch(addToCart({ product, qty, size: selectedSize, color: selectedColor }));
    toast.success('Added to cart! 🛍️');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rf.rating) return toast.error('Please select a rating');
    if (!rf.body.trim()) return toast.error('Please write your review');
    setSubmitting(true);
    try {
      await api.post('/reviews', { productId: product._id, ...rf });
      toast.success('Review submitted! 🌸');
      setHasReviewed(true);
      await loadReviews(product._id);
      setRf({ rating: 0, title: '', body: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Loader fullPage />;
  if (!product) return <div style={{ textAlign: 'center', padding: '80px' }}>Product not found</div>;

  const discount = product.discountPercent || (product.price && product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0);
  const price = product.discountPrice || product.price;
  const img = product.images?.[selectedImage]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600';

  return (
    <>
      <Helmet>
        <title>{product.seoTitle || `${product.name} – Shree Vastra`}</title>
        <meta name="description" content={product.seoDescription || product.description?.slice(0,150)} />
      </Helmet>
      <div style={{ background: 'var(--color-cream)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px' }}>
          <nav style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '28px' }}>
            <a href="/" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Home</a> /&nbsp;
            <a href="/shop" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Shop</a> /&nbsp;
            <a href={`/shop/${product.category}`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>{product.category}</a> / {product.name}
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
            {/* Gallery */}
            <div>
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: 'white', aspectRatio: '3/4', boxShadow: 'var(--shadow-card)' }}>
                <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {discount > 0 && <span className="badge badge-sale" style={{ position: 'absolute', top: '16px', left: '16px' }}>{discount}% OFF</span>}
                <button onClick={() => dispatch(toggleWishlist(product))} style={{ position: 'absolute', top: '16px', right: '16px', width: '42px', height: '42px', borderRadius: '50%', background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)' }}>
                  <Heart size={18} fill={isWishlisted ? '#7B1C2E' : 'none'} color={isWishlisted ? '#7B1C2E' : '#6B4F4F'} />
                </button>
                {product.images?.length > 1 && <>
                  <button onClick={() => setSelectedImage(p => Math.max(0, p-1))} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={18}/></button>
                  <button onClick={() => setSelectedImage(p => Math.min(product.images.length-1, p+1))} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={18}/></button>
                </>}
              </div>
              {product.images?.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px', overflowX: 'auto' }}>
                  {product.images.map((im, i) => (
                    <img key={i} src={im.url} alt="" onClick={() => setSelectedImage(i)} style={{ width: '72px', height: '88px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer', border: selectedImage===i ? '2px solid var(--color-primary)' : '2px solid transparent', flexShrink: 0 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '8px' }}>{product.category}</p>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: 'var(--color-text)', marginBottom: '12px', lineHeight: 1.2 }}>{product.name}</h1>

              {product.ratings?.count > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Stars value={Math.round(product.ratings.average)} />
                  <span style={{ fontWeight: 600 }}>{product.ratings.average.toFixed(1)}</span>
                  <button onClick={() => setActiveTab('reviews')} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>({reviews.length} reviews)</button>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>₹{price.toLocaleString('en-IN')}</span>
                {discount > 0 && <>
                  <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="badge badge-sale">{discount}% off</span>
                </>}
              </div>

              {product.fabric && <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Fabric: <b style={{ color: 'var(--color-text)' }}>{product.fabric}</b></p>}

              {product.colors?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '10px', display: 'block' }}>Color: <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>{selectedColor}</span></label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {product.colors.map(c => (
                      <button key={c.name} title={c.name} onClick={() => setSelectedColor(c.name)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.hex, border: selectedColor===c.name ? '3px solid var(--color-primary)' : '2px solid rgba(0,0,0,0.1)', cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '10px', display: 'block' }}>Size: <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>{selectedSize}</span></label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => setSelectedSize(s)} style={{ padding: '8px 18px', borderRadius: '8px', border: '1.5px solid', borderColor: selectedSize===s ? 'var(--color-primary)' : 'var(--color-border)', background: selectedSize===s ? 'var(--color-primary)' : 'white', color: selectedSize===s ? 'white' : 'var(--color-text)', cursor: 'pointer', fontWeight: selectedSize===s ? 700 : 400, transition: 'all 0.2s', fontSize: '0.875rem' }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1,q-1))} style={{ width: '40px', height: '48px', border: 'none', background: 'var(--color-cream)', cursor: 'pointer', fontSize: '1.2rem' }}>-</button>
                  <span style={{ width: '50px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                  <button onClick={() => setQty(q => q+1)} style={{ width: '40px', height: '48px', border: 'none', background: 'var(--color-cream)', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                </div>
                <button onClick={addCart} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={product.stockQty===0}>
                  <ShoppingBag size={18}/> {product.stockQty===0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
              <button onClick={addCart} className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>Buy Now</button>

              <div style={{ marginTop: '24px', background: 'var(--color-cream)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[{Icon:Truck,text:'Free delivery on orders above ₹999'},{Icon:RotateCcw,text:'7-day easy returns & exchanges'}].map(({Icon,text}) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}><Icon size={16} color="var(--color-primary)"/> {text}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginTop: '60px', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
              {['description','care','reviews'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '18px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: activeTab===tab ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab===tab ? '2px solid var(--color-primary)' : '2px solid transparent', textTransform: 'capitalize', transition: 'all 0.2s' }}>
                  {tab==='reviews' ? `Reviews (${reviews.length})` : tab}
                </button>
              ))}
            </div>
            <div style={{ padding: '28px' }}>
              {activeTab==='description' && <p style={{ lineHeight: 1.8, color: 'var(--color-text)', fontSize: '0.95rem' }}>{product.description}</p>}
              {activeTab==='care' && <p style={{ lineHeight: 1.8, color: 'var(--color-text)', fontSize: '0.95rem' }}>{product.careInstructions || 'Dry clean recommended. Store in a cool, dry place.'}</p>}
              {activeTab==='reviews' && (
                <div>
                  {/* Rating bars */}
                  {reviews.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px', padding: '20px', background: 'var(--color-cream)', borderRadius: '14px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{product.ratings?.average?.toFixed(1)}</div>
                        <Stars value={Math.round(product.ratings?.average||0)} size={16}/>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{reviews.length} reviews</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[5,4,3,2,1].map(n => {
                          const cnt = reviews.filter(r => r.rating===n).length;
                          const pct = reviews.length ? Math.round((cnt/reviews.length)*100) : 0;
                          return (
                            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span style={{ fontSize: '0.8rem', width: '8px', fontWeight: 600 }}>{n}</span>
                              <Star size={11} fill="var(--color-accent)" color="var(--color-accent)"/>
                              <div style={{ flex: 1, height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '4px' }}/>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', width: '20px' }}>{cnt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Write review */}
                  {user && !hasReviewed && (
                    <form onSubmit={submitReview} style={{ background: 'var(--color-cream)', borderRadius: '14px', padding: '24px', marginBottom: '28px' }}>
                      <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '16px' }}>Write a Review</h4>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Rating *</label>
                        <Stars value={rf.rating} onChange={r => setRf(f=>({...f,rating:r}))} size={30}/>
                      </div>
                      <input value={rf.title} onChange={e => setRf(f=>({...f,title:e.target.value}))} placeholder="Review title (optional)"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}/>
                      <textarea value={rf.body} onChange={e => setRf(f=>({...f,body:e.target.value}))} placeholder="Share your experience with this product..." rows={4} required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: '16px' }}/>
                      <button type="submit" disabled={submitting} className="btn-primary" style={{ opacity: submitting ? 0.7 : 1 }}>
                        <Star size={15}/> {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                  {user && hasReviewed && <div style={{ background: '#D1FAE5', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#065F46', fontWeight: 600, fontSize: '0.9rem' }}>✅ You have already reviewed this product</div>}
                  {!user && <div style={{ background: 'var(--color-cream)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}><a href="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Login</a> to write a review</div>}

                  {reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>No reviews yet — be the first! 🌸</div>
                  ) : reviews.map(r => (
                    <div key={r._id} style={{ padding: '20px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>{r.user?.name?.[0]?.toUpperCase()||'U'}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.user?.name||'Customer'}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Stars value={r.rating} size={13}/>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                            {r.isVerifiedPurchase && <span style={{ fontSize: '0.7rem', background: '#D1FAE5', color: '#065F46', padding: '1px 7px', borderRadius: '20px', fontWeight: 600 }}>✓ Verified</span>}
                          </div>
                        </div>
                      </div>
                      {r.title && <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{r.title}</div>}
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.7, margin: 0 }}>{r.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ marginTop: '60px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '28px' }}>You May Also Like</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px,1fr))', gap: '24px' }}>
                {related.map(p => <ProductCard key={p._id} product={p}/>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
