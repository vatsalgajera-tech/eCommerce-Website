import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Package, ShoppingBag, MapPin } from 'lucide-react';
import api from '../lib/api';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data.order)).catch(() => {});
  }, [id]);

  return (
    <>
      <Helmet><title>Order Confirmed – Shree Vastra</title></Helmet>
      <div style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          {/* Success animation */}
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'pop 0.5s ease', boxShadow: '0 8px 32px rgba(5,150,105,0.3)' }}>
            <CheckCircle size={52} color="white" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', color: 'var(--color-primary)', marginBottom: '8px' }}>Order Confirmed! 🎉</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px', fontSize: '1rem' }}>Thank you for shopping with Shree Vastra</p>
          {order && <p style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '1.1rem', marginBottom: '32px' }}>Order #{order.orderNumber}</p>}

          {order && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-card)', marginBottom: '28px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Payment</div>
                  <div style={{ fontWeight: 600, color: order.paymentStatus === 'paid' ? '#059669' : 'var(--color-text)' }}>{order.paymentStatus === 'paid' ? '✅ Paid' : '💵 Cash on Delivery'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Total Amount</div>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.2rem' }}>₹{order.totalAmount?.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Delivery</div>
                  <div style={{ fontWeight: 600 }}>4-7 business days</div>
                </div>
              </div>
              <div style={{ background: 'var(--color-cream)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>
                  {order.shippingAddress?.fullName}, {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
                </div>
              </div>
              {/* Items */}
              <div style={{ marginTop: '16px' }}>
                {order.items?.slice(0, 3).map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <img src={item.image || '/placeholder-product.jpg'} alt={item.name} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: 'var(--color-cream)' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Qty: {item.qty} {item.size && `· ${item.size}`}</div>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.875rem' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/account/orders" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} /> Track Order
            </Link>
            <Link to="/shop" className="btn-outline" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes pop { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }`}</style>
    </>
  );
}
