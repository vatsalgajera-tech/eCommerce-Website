import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '../store/slices/cartSlice';
import { selectUser } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { MapPin, CreditCard, Truck, ChevronRight, Plus } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { STATE_LIST, getCities } from '../data/indiaCities';

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', sub: '4–7 business days', price: 99 },
  { id: 'express',  label: 'Express Delivery',  sub: '2–3 business days', price: 199 },
];

const PAYMENT_METHODS = [
  { id: 'cod',      label: 'Cash on Delivery', sub: 'Pay at doorstep', icon: '💵' },
  { id: 'razorpay', label: 'Pay Online',        sub: 'Cards, UPI, Net Banking', icon: '💳' },
];

export default function Checkout() {
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const user     = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep]         = useState(1); // 1=address, 2=delivery, 3=payment
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment]   = useState('cod');
  const [loading, setLoading]   = useState(false);
  const [selectedState, setSelectedState] = useState(''); // for cascade city dropdown

  // Saved addresses
  const [savedAddresses, setSavedAddresses]     = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { fullName: user?.name || '', phone: user?.phone || '', country: 'India' },
  });

  // Load saved addresses on mount
  useEffect(() => {
    if (user) {
      api.get('/auth/addresses')
        .then(r => {
          const addrs = r.data.addresses || [];
          setSavedAddresses(addrs);
          const def = addrs.find(a => a.isDefault);
          if (def) {
            setSelectedAddressId(def._id);
            prefillForm(def);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const prefillForm = (addr) => {
    ['fullName','phone','addressLine1','addressLine2','city','state','pincode'].forEach(k => {
      setValue(k, addr[k] || '');
    });
    if (addr.state) setSelectedState(addr.state);
  };

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
    if (id !== 'new') {
      const addr = savedAddresses.find(a => a._id === id);
      if (addr) prefillForm(addr);
    } else {
      ['fullName','phone','addressLine1','addressLine2','city','state','pincode'].forEach(k => setValue(k,''));
      setSelectedState('');
    }
  };

  const shipping = total >= 999 ? 0 : DELIVERY_OPTIONS.find(d => d.id === delivery)?.price || 99;
  const gst      = Math.round(total * 0.05);
  const grand    = total + shipping + gst;

  const placeOrder = async (addressData) => {
    // Guard against demo products
    const invalidItem = items.find(i => !i.product?._id || i.product._id.length < 10);
    if (invalidItem) {
      toast.error('Your cart has invalid items. Please remove them and add real products.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: items.map(i => ({ product: i.product._id, qty: i.qty, size: i.size, color: i.color })),
        shippingAddress: addressData,
        billingAddress:  addressData,
        paymentMethod:   payment,
        deliveryOption:  delivery,
      };
      const { data } = await api.post('/orders', orderPayload);
      const orderId  = data.order._id;

      if (payment === 'cod') {
        dispatch(clearCart());
        toast.success('Order placed successfully! 🎉');
        navigate(`/order-success/${orderId}`);
        return;
      }

      // Razorpay flow
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
            dispatch(clearCart()); toast.success('Payment successful! 🎉');
            navigate(`/order-success/${orderId}`);
          } catch { toast.error('Payment verification failed'); }
        },
        modal: { ondismiss: () => toast.error('Payment cancelled') },
      };
      new window.Razorpay(options).open();
    } catch (e) { toast.error(e.response?.data?.message || 'Order failed'); }
    finally { setLoading(false); }
  };

  const STEPS = ['Shipping Address', 'Delivery', 'Payment'];

  const inputSt = (hasErr) => ({
    width: '100%', padding: '10px 14px', borderRadius: '10px', boxSizing: 'border-box',
    border: `1.5px solid ${hasErr ? '#DC2626' : 'var(--color-border)'}`,
    fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
  });

  return (
    <>
      <Helmet><title>Checkout – Shree Vastra</title></Helmet>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div style={{ background: 'var(--color-cream)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '32px' }}>Checkout</h1>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step > i+1 ? 'var(--color-accent)' : step === i+1 ? 'var(--color-primary)' : 'var(--color-border)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.3s' }}>
                    {step > i+1 ? '✓' : i+1}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: step===i+1?700:400, color: step===i+1?'var(--color-primary)':'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
                </div>
                {i < STEPS.length-1 && <div style={{ flex: 1, height: '2px', background: step > i+1 ? 'var(--color-accent)' : 'var(--color-border)', margin: '0 12px', transition: 'background 0.3s' }}/>}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-card)' }}>

              {/* ── STEP 1: Address ── */}
              {step === 1 && (
                <form onSubmit={handleSubmit(() => setStep(2))}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20}/> Shipping Address
                  </h2>

                  {/* Saved address selector */}
                  {savedAddresses.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '12px' }}>Select a saved address:</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {savedAddresses.map(addr => (
                          <label key={addr._id} style={{ display: 'flex', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: `2px solid ${selectedAddressId===addr._id ? 'var(--color-primary)' : 'var(--color-border)'}`, cursor: 'pointer', background: selectedAddressId===addr._id ? 'var(--color-cream)' : 'white', transition: 'all 0.2s' }}>
                            <input type="radio" name="savedAddr" value={addr._id} checked={selectedAddressId===addr._id}
                              onChange={() => handleAddressSelect(addr._id)}
                              style={{ accentColor: 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }}/>
                            <div style={{ fontSize: '0.875rem' }}>
                              <div style={{ fontWeight: 700, marginBottom: '2px' }}>{addr.label} — {addr.fullName} {addr.isDefault && <span style={{ background: 'var(--color-primary)', color: 'white', fontSize: '0.68rem', padding: '1px 7px', borderRadius: '10px', marginLeft: '6px' }}>Default</span>}</div>
                              <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}
                              </div>
                              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>📞 {addr.phone}</div>
                            </div>
                          </label>
                        ))}
                        <label style={{ display: 'flex', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: `2px solid ${selectedAddressId==='new' ? 'var(--color-primary)' : 'var(--color-border)'}`, cursor: 'pointer', background: selectedAddressId==='new' ? 'var(--color-cream)' : 'white', transition: 'all 0.2s', alignItems: 'center' }}>
                          <input type="radio" name="savedAddr" value="new" checked={selectedAddressId==='new'}
                            onChange={() => handleAddressSelect('new')}
                            style={{ accentColor: 'var(--color-primary)', flexShrink: 0 }}/>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
                            <Plus size={16} color="var(--color-primary)"/> Enter a new address
                          </div>
                        </label>
                      </div>
                      {selectedAddressId !== 'new' && (
                        <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
                          Continue to Delivery <ChevronRight size={16}/>
                        </button>
                      )}
                      {selectedAddressId === 'new' && <hr style={{ borderColor: 'var(--color-border)', margin: '20px 0' }}/>}
                    </div>
                  )}

                  {/* Address form — show when no saved addresses or 'new' selected */}
                  {(savedAddresses.length === 0 || selectedAddressId === 'new') && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Full Name */}
                        <div>
                          <label style={lblSt}>Full Name *</label>
                          <input {...register('fullName', { required: 'Full name is required' })} style={inputSt(errors.fullName)} placeholder="Priya Sharma"/>
                          {errors.fullName && <span style={errSt}>{errors.fullName.message}</span>}
                        </div>
                        {/* Phone */}
                        <div>
                          <label style={lblSt}>Phone *</label>
                          <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile' } })} style={inputSt(errors.phone)} placeholder="98765 43210" type="tel"/>
                          {errors.phone && <span style={errSt}>{errors.phone.message}</span>}
                        </div>
                        {/* Address Line 1 */}
                        <div style={{ gridColumn: '1/-1' }}>
                          <label style={lblSt}>Address Line 1 *</label>
                          <input {...register('addressLine1', { required: 'Address is required' })} style={inputSt(errors.addressLine1)} placeholder="House no., Street, Area"/>
                          {errors.addressLine1 && <span style={errSt}>{errors.addressLine1.message}</span>}
                        </div>
                        {/* Address Line 2 */}
                        <div style={{ gridColumn: '1/-1' }}>
                          <label style={lblSt}>Address Line 2 (Landmark)</label>
                          <input {...register('addressLine2')} style={inputSt(false)} placeholder="Near temple, landmark..."/>
                        </div>
                        {/* State cascade */}
                        <div>
                          <label style={lblSt}>State *</label>
                          <select
                            {...register('state', { required: 'State is required' })}
                            value={selectedState}
                            onChange={e => { setSelectedState(e.target.value); setValue('state', e.target.value); setValue('city', ''); }}
                            style={{ ...inputSt(errors.state), cursor: 'pointer' }}>
                            <option value="">Select State</option>
                            {STATE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          {errors.state && <span style={errSt}>{errors.state.message}</span>}
                        </div>
                        {/* City cascade — depends on selected state */}
                        <div>
                          <label style={lblSt}>City *</label>
                          <select
                            {...register('city', { required: 'City is required' })}
                            disabled={!selectedState}
                            style={{ ...inputSt(errors.city), cursor: selectedState ? 'pointer' : 'not-allowed', opacity: selectedState ? 1 : 0.6, background: selectedState ? 'white' : 'var(--color-cream)' }}
                            onChange={e => setValue('city', e.target.value)}>
                            <option value="">{selectedState ? 'Select City' : 'Select State first'}</option>
                            {getCities(selectedState).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          {errors.city && <span style={errSt}>{errors.city.message}</span>}
                        </div>
                        {/* Pincode */}
                        <div style={{ gridColumn: '1/-1' }}>
                          <label style={lblSt}>Pincode *</label>
                          <input {...register('pincode', { required: 'Pincode is required', pattern: { value: /^\d{6}$/, message: '6-digit pincode required' } })} style={inputSt(errors.pincode)} placeholder="360001" maxLength={6} type="tel"/>
                          {errors.pincode && <span style={errSt}>{errors.pincode.message}</span>}
                        </div>
                      </div>
                      <button type="submit" className="btn-primary" style={{ marginTop: '24px' }}>
                        Continue to Delivery <ChevronRight size={16}/>
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* ── STEP 2: Delivery ── */}
              {step === 2 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={20}/> Delivery Option
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                    {DELIVERY_OPTIONS.map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderRadius: '12px', border: `2px solid ${delivery===opt.id?'var(--color-primary)':'var(--color-border)'}`, cursor: 'pointer', background: delivery===opt.id?'var(--color-cream)':'white', transition: 'all 0.2s' }}>
                        <input type="radio" name="delivery" value={opt.id} checked={delivery===opt.id} onChange={() => setDelivery(opt.id)} style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }}/>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{opt.label}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{opt.sub}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{total >= 999 ? 'FREE' : `₹${opt.price}`}</div>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(1)} className="btn-outline">← Back</button>
                    <button onClick={() => setStep(3)} className="btn-primary">Continue to Payment <ChevronRight size={16}/></button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Payment ── */}
              {step === 3 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={20}/> Payment Method
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                    {PAYMENT_METHODS.map(m => (
                      <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderRadius: '12px', border: `2px solid ${payment===m.id?'var(--color-primary)':'var(--color-border)'}`, cursor: 'pointer', background: payment===m.id?'var(--color-cream)':'white', transition: 'all 0.2s' }}>
                        <input type="radio" name="payment" value={m.id} checked={payment===m.id} onChange={() => setPayment(m.id)} style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }}/>
                        <span style={{ fontSize: '1.4rem' }}>{m.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{m.label}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{m.sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {payment === 'cod' && (
                    <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.875rem', color: '#92400E' }}>
                      💵 You will pay <strong>₹{grand.toLocaleString('en-IN')}</strong> in cash when your order arrives.
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(2)} className="btn-outline">← Back</button>
                    <button id="place-order-btn" onClick={handleSubmit(placeOrder)} disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                      {loading ? 'Placing Order...' : `Place Order · ₹${grand.toLocaleString('en-IN')}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-card)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '20px' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img src={item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80'} alt=""
                      style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: 'var(--color-cream)', flexShrink: 0 }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Qty: {item.qty} {item.size && `· ${item.size}`}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-primary)', flexShrink: 0 }}>
                      ₹{((item.product.discountPrice || item.product.price) * item.qty).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
              <hr style={{ borderColor: 'var(--color-border)', marginBottom: '16px' }}/>
              {[['Subtotal', `₹${total.toLocaleString('en-IN')}`], ['Shipping', shipping===0?'FREE':`₹${shipping}`], ['GST (5%)', `₹${gst.toLocaleString('en-IN')}`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{l}</span><span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <hr style={{ borderColor: 'var(--color-border)', margin: '12px 0' }}/>
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

const lblSt = { display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text)' };
const errSt = { color: '#DC2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' };
