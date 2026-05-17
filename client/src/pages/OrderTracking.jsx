import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Search, MapPin, LogIn } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import api from '../lib/api';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['placed','confirmed','processing','shipped','out-for-delivery','delivered'];
const STATUS_META  = {
  placed:            { label: 'Order Placed',      icon: '📦', color: '#7B1C2E' },
  confirmed:         { label: 'Confirmed',          icon: '✅', color: '#059669' },
  processing:        { label: 'Processing',         icon: '⚙️', color: '#D97706' },
  shipped:           { label: 'Shipped',            icon: '🚚', color: '#2563EB' },
  'out-for-delivery':{ label: 'Out for Delivery',   icon: '🛵', color: '#7C3AED' },
  delivered:         { label: 'Delivered',          icon: '🎉', color: '#059669' },
};

export default function OrderTracking() {
  const user    = useSelector(selectUser);
  const navigate = useNavigate();
  const [orderNum, setOrderNum] = useState('');
  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const track = async () => {
    const num = orderNum.trim().toUpperCase();
    if (!num) { toast.error('Please enter your order number'); return; }
    setLoading(true);
    setOrder(null);
    setForbidden(false);
    try {
      const { data } = await api.get(`/orders/track/${num}`);
      setOrder(data.order);
    } catch (e) {
      const status = e.response?.status;
      if (status === 401) {
        toast.error('Please login to track your order');
        navigate('/login', { state: { from: { pathname: '/track-order' } } });
      } else if (status === 403) {
        setForbidden(true);
        toast.error('This order does not belong to your account.');
      } else {
        toast.error(e.response?.data?.message || 'Order not found. Please check the order number.');
      }
    } finally { setLoading(false); }
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <>
      <Helmet>
        <title>Track Order – Shree Vastra</title>
        <meta name="description" content="Track your Shree Vastra order in real-time. Enter your order number to see the latest status."/>
      </Helmet>

      <div style={{ minHeight: '80vh', background: 'var(--color-cream)', padding: '60px 20px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: 'clamp(2rem,5vw,2.8rem)', marginBottom: '8px' }}>Track Your Order</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Enter your Order ID (e.g., SV123456) to get real-time status</p>
          </div>

          {/* Login gate — shown when not authenticated */}
          {!user ? (
            <div style={{ background: 'white', borderRadius: '20px', padding: '48px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
              <LogIn size={44} color="var(--color-primary)" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '10px' }}>Login Required</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '28px', lineHeight: 1.7 }}>
                You must be signed in to track your order.<br/>This keeps your order information private and secure.
              </p>
              <Link to="/login" state={{ from: { pathname: '/track-order' } }} className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                <LogIn size={18} /> Sign In to Track Order
              </Link>
            </div>
          ) : (
          <>
          {/* Forbidden error */}
          {forbidden && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔒</div>
              <h3 style={{ color: '#DC2626', fontFamily: 'var(--font-heading)', marginBottom: '6px' }}>Access Denied</h3>
              <p style={{ color: '#DC2626', fontSize: '0.9rem' }}>This order does not belong to your account. You can only track your own orders.</p>
            </div>
          )}

          {/* Search box */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-card)', marginBottom: '28px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                id="order-number-input"
                value={orderNum}
                onChange={e => setOrderNum(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && track()}
                placeholder="Enter order number (SV123456)"
                style={{ flex: 1, padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none', letterSpacing: '0.05em' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              />
              <button onClick={track} disabled={loading} className="btn-primary" style={{ padding: '13px 24px', flexShrink: 0 }}>
                <Search size={18}/> {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '10px' }}>
              💡 Your order number is in your order confirmation email and My Orders page.
            </p>
          </div>

          {/* Order result */}
          {order && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-card)', animation: 'slideUp 0.4s ease' }}>
              {/* Order header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.4rem', marginBottom: '4px' }}>#{order.orderNumber}</h2>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13}/> {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                  <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, background: order.status === 'delivered' ? '#D1FAE5' : '#FEF3C7', color: order.status === 'delivered' ? '#059669' : '#D97706' }}>
                    {STATUS_META[order.status]?.icon} {STATUS_META[order.status]?.label || order.status}
                  </span>
                </div>
              </div>

              {/* Progress tracker */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', color: 'var(--color-text)' }}>Delivery Progress</h3>
                <div style={{ position: 'relative', padding: '0 16px' }}>
                  {/* Track line */}
                  <div style={{ position: 'absolute', top: '18px', left: '32px', right: '32px', height: '3px', background: 'var(--color-border)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', width: `${currentStep >= 0 ? (currentStep / (STATUS_STEPS.length - 1)) * 100 : 0}%`, borderRadius: '2px', transition: 'width 0.6s ease' }}/>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    {STATUS_STEPS.map((step, i) => {
                      const done  = i <= currentStep;
                      const active = i === currentStep;
                      const meta  = STATUS_META[step];
                      return (
                        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%', zIndex: 1,
                            background: done ? 'var(--color-primary)' : 'white',
                            border: `3px solid ${done ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: done ? 'white' : 'var(--color-text-muted)',
                            fontSize: done ? '0.85rem' : '0.75rem', fontWeight: 700,
                            boxShadow: active ? '0 0 0 4px rgba(123,28,46,0.15)' : 'none',
                            transition: 'all 0.3s',
                          }}>
                            {done ? (active ? meta.icon : '✓') : i + 1}
                          </div>
                          <span style={{ fontSize: '0.62rem', textAlign: 'center', color: done ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: done ? 700 : 400, maxWidth: '64px', lineHeight: 1.3 }}>
                            {meta.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Shipping address */}
              {order.shippingAddress && (
                <div style={{ background: 'var(--color-cream)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    <MapPin size={14} color="var(--color-primary)"/> Delivering to
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
                    {order.shippingAddress.fullName} · {order.shippingAddress.phone}<br/>
                    {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br/>
                    {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                  </div>
                </div>
              )}

              {/* Items */}
              {order.items?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text)' }}>Items ({order.items.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', background: 'var(--color-cream)', borderRadius: '10px' }}>
                        <img src={item.image || item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=60'}
                          alt={item.name} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}/>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Qty: {item.qty} {item.size && `· Size: ${item.size}`}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          </> /* end user logged-in branch */
          )} {/* end user ternary */}
        </div>
      </div>
    </>
  );
}
