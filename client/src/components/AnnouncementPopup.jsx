import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementPopup() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Show only ONCE per browser session (clears when tab is closed)
    if (sessionStorage.getItem('sv_popup_shown')) return;
    const timer = setTimeout(() => {
      const defaultMsg = "🎁 Free shipping on orders above ₹999! Use code FESTIVE30 for 30% off. Limited time offer — Shop Now!";
      setMessage(defaultMsg);
      setShow(true);
      sessionStorage.setItem('sv_popup_shown', '1');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      background: 'rgba(45, 26, 26, 0.45)',
      animation: 'fadeIn 0.35s ease',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '0',
        maxWidth: '480px',
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(123,28,46,0.3)',
        animation: 'scaleIn 0.35s ease',
        position: 'relative',
      }}>
        {/* Top gradient banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #9E2438 100%)',
          padding: '28px 32px 24px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <button onClick={() => setShow(false)} style={{
            position: 'absolute', top: '14px', right: '14px',
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
            <X size={16} />
          </button>
          <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🎉</div>
          <h2 style={{
            fontFamily: 'var(--font-heading)', color: 'white',
            fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px',
          }}>Special Offer!</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>Limited time announcement</p>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px 32px', textAlign: 'center' }}>
          <p style={{
            fontSize: '1.05rem', color: 'var(--color-text)', lineHeight: 1.7,
            marginBottom: '24px', fontWeight: 500,
          }}>{message}</p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => setShow(false)} className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>
              Maybe Later
            </button>
            <a href="/shop" onClick={() => setShow(false)} className="btn-primary" style={{ flex: 1.5, justifyContent: 'center', textDecoration: 'none' }}>
              Shop Now →
            </a>
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '16px' }}>
            *Terms and conditions apply
          </p>
        </div>
      </div>
    </div>
  );
}
