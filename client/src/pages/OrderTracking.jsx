import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Package, Search } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function OrderTracking() {
  const [orderNum, setOrderNum] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const STATUS_STEPS = ['placed', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered'];
  const STATUS_LABELS = { placed: 'Order Placed', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', 'out-for-delivery': 'Out for Delivery', delivered: 'Delivered' };

  const track = async () => {
    if (!orderNum.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${orderNum}`);
      setOrder(data.order);
    } catch { toast.error('Order not found'); } finally { setLoading(false); }
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <>
      <Helmet><title>Track Order – Shree Vastra</title></Helmet>
      <div style={{ minHeight: '80vh', background: 'var(--color-cream)', padding: '60px 20px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', textAlign: 'center', fontSize: '2.4rem', marginBottom: '8px' }}>Track Your Order</h1>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '40px' }}>Enter your Order ID to get real-time status</p>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-card)', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input id="order-number-input" value={orderNum} onChange={e => setOrderNum(e.target.value)} placeholder="e.g. SV123456" style={{ flex: 1, padding: '12px 18px', borderRadius: '10px', border: '1.5px solid var(--color-border)', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--color-primary)'} onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
              <button onClick={track} disabled={loading} className="btn-primary"><Search size={18} />{loading ? 'Tracking...' : 'Track'}</button>
            </div>
          </div>
          {order && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: 'var(--shadow-card)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '24px' }}>Order #{order.orderNumber}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', height: '3px', background: 'var(--color-border)', zIndex: 0 }}>
                  <div style={{ height: '100%', background: 'var(--color-primary)', width: `${currentStep >= 0 ? (currentStep / (STATUS_STEPS.length - 1)) * 100 : 0}%`, transition: 'width 0.5s ease' }} />
                </div>
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: i <= currentStep ? 'var(--color-primary)' : 'white', border: `3px solid ${i <= currentStep ? 'var(--color-primary)' : 'var(--color-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.3s' }}>
                      {i <= currentStep ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: i <= currentStep ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: i <= currentStep ? 700 : 400, textAlign: 'center', maxWidth: '60px' }}>{STATUS_LABELS[step]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
