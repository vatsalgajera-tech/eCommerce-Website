import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCart, updateQty, clearCart } from '../store/slices/cartSlice';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, ChevronLeft } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const SHIPPING = total >= 999 ? 0 : 99;
  const GST = Math.round((total - discount) * 0.05);
  const grandTotal = total - discount + SHIPPING + GST;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: coupon, orderAmount: total });
      setDiscount(data.discount);
      toast.success(`✅ Coupon applied! You save ₹${data.discount}`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid coupon');
    } finally { setCouponLoading(false); }
  };

  if (items.length === 0) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
      <ShoppingBag size={64} color="var(--color-border)" style={{ marginBottom: '20px' }} />
      <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '12px' }}>Your Cart is Empty</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Looks like you haven't added anything yet.</p>
      <Link to="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>Start Shopping <ArrowRight size={16} /></Link>
    </div>
  );

  return (
    <>
      <Helmet><title>Cart – Shree Vastra</title></Helmet>
      <div style={{ background: 'var(--color-cream)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <ChevronLeft size={16} /> Continue Shopping
            </button>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '2rem' }}>Shopping Cart</h1>
            <span style={{ background: 'var(--color-primary)', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>{items.length}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: 'var(--shadow-soft)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <Link to={`/product/${item.product.slug}`}>
                    <img src={item.product.images?.[0]?.url || '/placeholder-product.jpg'} alt={item.product.name} style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item.product.slug}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)', fontSize: '1.1rem', marginBottom: '6px' }}>{item.product.name}</h3>
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                      {item.size && <span>Size: <b>{item.size}</b> &nbsp;|&nbsp;</span>}
                      {item.color && <span>Color: <b>{item.color}</b></span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                      {/* Qty stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                        <button onClick={() => { if (item.qty > 1) dispatch(updateQty({ productId: item.product._id, size: item.size, color: item.color, qty: item.qty - 1 })); }} style={{ width: '34px', height: '34px', border: 'none', background: 'var(--color-cream)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                        <button onClick={() => dispatch(updateQty({ productId: item.product._id, size: item.size, color: item.color, qty: item.qty + 1 }))} style={{ width: '34px', height: '34px', border: 'none', background: 'var(--color-cream)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                        ₹{((item.product.discountPrice || item.product.price) * item.qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => dispatch(removeFromCart({ productId: item.product._id, size: item.size, color: item.color }))}
                    style={{ background: '#FEE2E2', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#DC2626', transition: 'all 0.2s' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-card)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.4rem', marginBottom: '24px' }}>Order Summary</h3>

              {/* Coupon */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Tag size={14} color="var(--color-accent)" /> Have a coupon?
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input id="coupon-input" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Enter code" style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '0.875rem', fontFamily: 'var(--font-body)', outline: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }} />
                  <button onClick={applyCoupon} disabled={couponLoading} style={{ padding: '10px 16px', background: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', opacity: couponLoading ? 0.7 : 1 }}>
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--color-border)', marginBottom: '20px' }} />

              {[
                { label: 'Subtotal', value: `₹${total.toLocaleString('en-IN')}` },
                { label: 'Discount', value: discount > 0 ? `-₹${discount.toLocaleString('en-IN')}` : '—', color: '#059669' },
                { label: 'Shipping', value: SHIPPING === 0 ? 'FREE 🎉' : `₹${SHIPPING}`, color: SHIPPING === 0 ? '#059669' : undefined },
                { label: 'GST (5%)', value: `₹${GST.toLocaleString('en-IN')}` },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                  <span style={{ fontWeight: 500, color: color || 'var(--color-text)' }}>{value}</span>
                </div>
              ))}

              <hr style={{ borderColor: 'var(--color-border)', margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text)' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-primary)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <Link to="/checkout" state={{ coupon, discount, shipping: SHIPPING, gst: GST, grandTotal }}
                className="btn-primary" style={{ width: '100%', textDecoration: 'none', justifyContent: 'center', fontSize: '1rem' }}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              {total < 999 && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textAlign: 'center', marginTop: '12px' }}>
                  Add ₹{(999 - total).toLocaleString('en-IN')} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
