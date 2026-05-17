import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, ArrowRight, AlertCircle, Info, RotateCcw } from 'lucide-react';
import { setCredentials, selectUser } from '../store/slices/authSlice';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [step, setStep]           = useState(1); // 1=email, 2=otp
  const [email, setEmail]         = useState('');
  const [userId, setUserId]       = useState(null);
  const [otp, setOtp]             = useState('');
  const [devOTP, setDevOTP]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [serverError, setServerError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = useSelector(selectUser);
  const from = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/account', { replace: true });
  }, [user, navigate]);

  // Resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Step 1: Send OTP ─────────────────────────────────
  const sendOTP = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setServerError('Please enter a valid email address'); return;
    }
    setLoading(true);
    setServerError('');
    try {
      const { data } = await api.post('/auth/login/send-otp', { email: trimmed });
      setUserId(data.userId);
      setStep(2);
      setCountdown(60); // 60s before resend allowed
      if (data.devOTP) {
        setDevOTP(data.devOTP);
        setOtp(data.devOTP);
        toast.success(`📧 Dev mode — OTP: ${data.devOTP}`, { duration: 8000 });
      } else {
        toast.success('OTP sent to your email! Check your inbox 📬');
      }
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to send OTP';
      setServerError(msg);
      if (msg.toLowerCase().includes('register') || e.response?.status === 404) {
        // unknown email
      }
    } finally { setLoading(false); }
  };

  // ── Step 2: Verify OTP & Login ────────────────────────
  const verifyOTP = async () => {
    if (otp.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setLoading(true);
    setServerError('');
    try {
      const { data } = await api.post('/auth/login/verify-otp', { userId, otp });
      dispatch(setCredentials(data));
      toast.success(`Welcome back, ${data.user.name}! 🌸`);
      navigate(data.user.role === 'admin' ? '/admin' : (from === '/login' ? '/account' : from), { replace: true });
    } catch (e) {
      const msg = e.response?.data?.message || 'Invalid OTP. Try again.';
      setServerError(msg);
    } finally { setLoading(false); }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;
    setOtp('');
    setDevOTP('');
    setServerError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login/send-otp', { email });
      setCountdown(60);
      if (data.devOTP) { setDevOTP(data.devOTP); setOtp(data.devOTP); toast.success(`Dev OTP: ${data.devOTP}`); }
      else toast.success('New OTP sent! Check your inbox.');
    } catch { toast.error('Failed to resend OTP'); } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet>
        <title>Login – Shree Vastra</title>
        <meta name="description" content="Sign in to your Shree Vastra account using OTP verification."/>
      </Helmet>

      <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, var(--color-cream) 0%, #F5E8D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(123,28,46,0.12)' }}>

          {/* Logo + title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', color: 'var(--color-text)', margin: '0 0 6px' }}>
              {step === 1 ? 'Welcome Back' : 'Enter OTP'}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {step === 1 ? 'Sign in with your email — we\'ll send you an OTP' : `OTP sent to ${email}`}
            </p>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ width: s === step ? '24px' : '8px', height: '8px', borderRadius: '4px', background: s <= step ? 'var(--color-primary)' : 'var(--color-border)', transition: 'all 0.3s' }} />
            ))}
          </div>

          {/* Error banner */}
          {serverError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <span style={{ fontSize: '0.875rem', color: '#DC2626', display: 'block', fontWeight: 600 }}>{serverError}</span>
                {(serverError.includes('register') || serverError.includes('No account')) && (
                  <Link to="/register" style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 700, textDecoration: 'underline', marginTop: '4px', display: 'inline-block' }}>
                    Create a free account →
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 1: Email ── */}
          {step === 1 && (
            <form onSubmit={sendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={lblSt} htmlFor="login-email">Email Address</label>
                <div style={inputWrap}>
                  <Mail size={16} color="var(--color-text-muted)" />
                  <input
                    id="login-email" type="email" placeholder="your@email.com" autoComplete="email"
                    value={email} onChange={e => { setEmail(e.target.value); setServerError(''); }}
                    style={inputSt}
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary"
                style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem', opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Sending OTP...' : <><ArrowRight size={18} /> Send OTP</>}
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Dev mode banner */}
              {devOTP && (
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Info size={16} color="#3B82F6" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.8rem', color: '#1D4ED8' }}>
                    <strong>Dev Mode:</strong> OTP auto-filled — <strong style={{ letterSpacing: '0.15em' }}>{devOTP}</strong><br/>
                    In production, it's sent to your email.
                  </div>
                </div>
              )}

              {/* OTP input */}
              <div>
                <label style={{ ...lblSt, textAlign: 'center', display: 'block' }}>Enter 6-Digit OTP</label>
                <input
                  id="otp-input"
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setServerError(''); }}
                  placeholder="000000"
                  maxLength={6}
                  type="tel"
                  style={{ width: '100%', textAlign: 'center', letterSpacing: '0.4em', fontSize: '2rem', padding: '16px', border: `2px solid ${otp.length === 6 ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: '12px', fontWeight: 700, fontFamily: 'var(--font-body)', outline: 'none', color: 'var(--color-primary)', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                />
              </div>

              <button id="otp-submit" onClick={verifyOTP} disabled={loading || otp.length !== 6}
                className="btn-primary"
                style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem', opacity: loading || otp.length !== 6 ? 0.7 : 1, cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Verifying...' : '✓ Verify & Sign In'}
              </button>

              {/* Resend + back */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => { setStep(1); setOtp(''); setDevOTP(''); setServerError(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ← Change email
                </button>
                <button onClick={resendOTP} disabled={countdown > 0 || loading}
                  style={{ background: 'none', border: 'none', cursor: countdown > 0 ? 'not-allowed' : 'pointer', color: countdown > 0 ? 'var(--color-text-muted)' : 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RotateCcw size={13} />
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Register CTA */}
          <div style={{ marginTop: '28px', padding: '18px', background: 'var(--color-cream)', borderRadius: '14px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>New to Shree Vastra?</p>
            <Link to="/register" className="btn-outline"
              style={{ display: 'inline-flex', justifyContent: 'center', padding: '10px 28px', fontSize: '0.9rem', textDecoration: 'none' }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

const lblSt    = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px' };
const inputWrap = { display: 'flex', alignItems: 'center', gap: '10px', border: '1.5px solid var(--color-border)', borderRadius: '10px', padding: '11px 14px', background: '#FAFAF8', transition: 'border-color 0.2s' };
const inputSt  = { flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: '0.9rem', fontFamily: 'var(--font-body)', color: 'var(--color-text)', minWidth: 0 };
