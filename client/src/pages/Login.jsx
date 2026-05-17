import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { setCredentials, selectUser } from '../store/slices/authSlice';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [serverError, setServerError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user     = useSelector(selectUser);
  const from     = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/account', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setServerError('Please enter your email address'); return; }
    if (!password)     { setServerError('Please enter your password'); return; }
    setLoading(true);
    setServerError('');
    try {
      const { data } = await api.post('/auth/login', { email: email.trim().toLowerCase(), password });
      dispatch(setCredentials(data));
      toast.success(`Welcome back, ${data.user.name}! 🌸`);
      navigate(data.user.role === 'admin' ? '/admin' : (from === '/login' ? '/account' : from), { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setServerError(msg);
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet>
        <title>Login – Shree Vastra</title>
        <meta name="description" content="Sign in to your Shree Vastra account to access orders, wishlist and more."/>
      </Helmet>

      <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, var(--color-cream) 0%, #F5E8D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(123,28,46,0.12)' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '4px' }}>Welcome Back</div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Sign in to your Shree Vastra account</p>
          </div>

          {/* Error */}
          {serverError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <span style={{ fontSize: '0.875rem', color: '#DC2626', display: 'block', fontWeight: 600 }}>{serverError}</span>
                {(serverError.includes('No account') || serverError.includes('register')) && (
                  <Link to="/register" style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 700, textDecoration: 'underline', marginTop: '4px', display: 'inline-block' }}>
                    Create a free account →
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label style={lblSt} htmlFor="login-email">Email Address</label>
              <div style={{ ...inputWrap, borderColor: serverError && !password ? '#DC2626' : 'var(--color-border)' }}>
                <Mail size={16} color="var(--color-text-muted)" />
                <input
                  id="login-email" type="email" placeholder="your@email.com" autoComplete="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setServerError(''); }}
                  style={inputSt}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ ...lblSt, marginBottom: 0 }} htmlFor="login-password">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ ...inputWrap, borderColor: serverError && password ? '#DC2626' : 'var(--color-border)' }}>
                <Lock size={16} color="var(--color-text-muted)" />
                <input
                  id="login-password" type={showPw ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setServerError(''); }}
                  style={inputSt}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text-muted)', display: 'flex' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem', marginTop: '4px', opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Register CTA */}
          <div style={{ marginTop: '28px', padding: '18px', background: 'var(--color-cream)', borderRadius: '14px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              New to Shree Vastra?
            </p>
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
