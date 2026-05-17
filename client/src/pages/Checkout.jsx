import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../store/slices/cartSlice';
import { selectUser } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { MapPin, CreditCard, Truck, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const DELIVERY_OPTIONS = [{ id: 'standard', label: 'Standard Delivery', sub: '4-7 business days', price: 99 }, { id: 'express', label: 'Express Delivery', sub: '2-3 business days', price: 199 }];
const PAYMENT_METHODS = [{ id: 'razorpay', label: 'Pay Online', sub: 'Cards, UPI, Net Banking, Wallets', icon: '💳' }, { id: 'cod', label: 'Cash on Delivery', sub: 'Pay at doorstep', icon: '💵' }];

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { coupon, discount = 0, shipping: locationShipping, gst: locationGst, grandTotal: locationGrandTotal } = location.state || {};

  const [step, setStep] = useState(1); // 1=address, 2=delivery, 3=payment
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ defaultValues: { fullName: user?.name || '', phone: user?.phone || '', country: 'India' } });

  const shipping = total - discount >= 999 ? 0 : DELIVERY_OPTIONS.find(d => d.id === delivery)?.price || 99;
  const gst = Math.round((total - discount) * 0.05);
  const grand = total - discount + shipping + gst;

  const placeOrder = async (addressData) => {
    setLoading(true);
    try {
      const orderPayload = {
        items: items.map(i => ({ product: i.product._id, qty: i.qty, size: i.size, color: i.color })),
        shippingAddress: addressData, billingAddress: addressData,
        paymentMethod: payment, deliveryOption: delivery,
        couponCode: coupon || undefined,
      };
      const { data } = await api.post('/orders', orderPayload);
      const orderId = data.order._id;

      if (payment === 'cod') {
        dispatch(clearCart());
        toast.success('Order placed successfully! 🎉');
        navigate(`/order-success/${orderId}`);
        return;
      }

      // Razorpay
      const { data: rzpData } = await api.post('/payment/create-order', { orderId });
      const options = {
        key: rzpData.key, amount: rzpData.amount, currency: rzpData.currency,
        name: 'Shree Vastra', description: 'Order Payment',
        order_id: rzpData.rzpOrderId,
        prefill: { name: addressData.fullName, email: user?.email, contact: addressData.phone },
        theme: { color: '#7B1C2E' },
        handler: async (response) => {
          try {
            await api.post('/payment/verify', { ...response, orderId });
            dispatch(clearCart());
            toast.success('Payment successful! 🎉');
            navigate(`/order-success/${orderId}`);
          } catch { toast.error('Payment verification failed'); }
        },
        modal: { ondismiss: () => toast.error('Payment cancelled') },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) { toast.error(e.response?.data?.message || 'Order failed'); }
    finally { setLoading(false); }
  };

  const STEPS = ['Shipping Address', 'Delivery', 'Payment'];

  return (
    <>
      <Helmet><title>Checkout – Shree Vastra</title></Helmet>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div style={{ background: 'var(--color-cream)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '32px' }}>Checkout</h1>

          {/* Steps indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '0' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step > i + 1 ? 'var(--color-accent)' : step === i + 1 ? 'var(--color-primary)' : 'var(--color-border)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0, transition: 'all 0.3s' }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? 'var(--color-primary)' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: '2px', background: step > i + 1 ? 'var(--color-accent)' : 'var(--color-border)', margin: '0 12px', transition: 'background 0.3s' }} />}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
            {/* Main area */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-card)' }}>
              {/* Step 1 — Address */}
              {step === 1 && (
                <form onSubmit={handleSubmit((d) => setStep(2))} id="address-form">
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={20} /> Shipping Address</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[{ label: 'Full Name *', key: 'fullName', full: false, rules: { required: 'Required' } }, { label: 'Phone *', key: 'phone', full: false, rules: { required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid phone' } } }, { label: 'Address Line 1 *', key: 'addressLine1', full: true, rules: { required: 'Required' } }, { label: 'Address Line 2', key: 'addressLine2', full: true }, { label: 'City *', key: 'city', rules: { required: 'Required' } }, { label: 'State *', key: 'state', rules: { required: 'Required' } }, { label: 'Pincode *', key: 'pincode', rules: { required: 'Required', pattern: { value: /^\d{6}$/, message: '6-digit pincode' } } }, { label: 'Country', key: 'country' }].map(({ label, key, full, rules }) => (
                      <div key={key} style={{ gridColumn: full ? '1/-1' : 'auto' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text)' }}>{label}</label>
                        <input {...register(key, rules)} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${errors[key] ? '#DC2626' : 'var(--color-border)'}`, fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                        {errors[key] && <span style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '3px', display: 'block' }}>{errors[key].message}</span>}
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '24px' }}>Continue to Delivery <ChevronRight size={16} /></button>
                </form>
              )}

              {/* Step 2 — Delivery */}
              {step === 2 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={20} /> Delivery Options</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                    {DELIVERY_OPTIONS.map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderRadius: '12px', border: `2px solid ${delivery === opt.id ? 'var(--color-primary)' : 'var(--color-border)'}`, cursor: 'pointer', background: delivery === opt.id ? 'var(--color-cream)' : 'white', transition: 'all 0.2s' }}>
                        <input type="radio" name="delivery" value={opt.id} checked={delivery === opt.id} onChange={() => setDelivery(opt.id)} style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{opt.label}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{opt.sub}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{total - discount >= 999 ? 'FREE' : `₹${opt.price}`}</div>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(1)} className="btn-outline">← Back</button>
                    <button onClick={() => setStep(3)} className="btn-primary">Continue to Payment <ChevronRight size={16} /></button>
                  </div>
                </div>
              )}

              {/* Step 3 — Payment */}
              {step === 3 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={20} /> Payment Method</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                    {PAYMENT_METHODS.map(m => (
                      <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderRadius: '12px', border: `2px solid ${payment === m.id ? 'var(--color-primary)' : 'var(--color-border)'}`, cursor: 'pointer', background: payment === m.id ? 'var(--color-cream)' : 'white', transition: 'all 0.2s' }}>
                        <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }} />
                        <span style={{ fontSize: '1.4rem' }}>{m.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{m.label}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{m.sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(2)} className="btn-outline">← Back</button>
                    <button id="place-order-btn" onClick={handleSubmit(placeOrder)} disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                      {loading ? 'Placing Order...' : `Place Order · ₹${grand.toLocaleString('en-IN')}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary sidebar */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-card)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '20px' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img src={item.product.images?.[0]?.url || '/placeholder-product.jpg'} alt="" style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: 'var(--color-cream)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Qty: {item.qty} {item.size && `· ${item.size}`}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-primary)', flexShrink: 0 }}>₹{((item.product.discountPrice || item.product.price) * item.qty).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
              <hr style={{ borderColor: 'var(--color-border)', marginBottom: '16px' }} />
              {[['Subtotal', `₹${total.toLocaleString('en-IN')}`], ['Discount', discount > 0 ? `-₹${discount.toLocaleString('en-IN')}` : '—'], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ['GST (5%)', `₹${gst.toLocaleString('en-IN')}`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{l}</span><span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <hr style={{ borderColor: 'var(--color-border)', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)' }}>₹{grand.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
