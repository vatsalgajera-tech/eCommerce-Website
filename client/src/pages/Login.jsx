import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { setCredentials, selectUser } from '../store/slices/authSlice';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = useSelector(selectUser);
  const from = location.state?.from?.pathname || '/';

  // If already logged in, redirect
  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/account', { replace: true });
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await api.post('/auth/login', { email: data.email.trim().toLowerCase(), password: data.password });
      dispatch(setCredentials(res.data));
      toast.success(`Welcome back, ${res.data.user.name}! 🌸`);
      if (res.data.user.role === 'admin') navigate('/admin', { replace: true });
      else navigate(from === '/login' ? '/account' : from, { replace: true });
    } catch (e) {
      const msg = e.response?.data?.message || 'Login failed. Please try again.';
      const status = e.response?.status;
      // Specific errors for invalid credentials
      if (status === 401 || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('invalid')) {
        setError('password', { message: 'Incorrect password' });
        setServerError('Invalid email or password. Please check your credentials.');
      } else if (status === 404 || msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no account')) {
        setError('email', { message: 'No account found with this email' });
        setServerError('No account found. Would you like to register?');
      } else {
        setServerError(msg);
      }
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet>
        <title>Login – Shree Vastra</title>
        <meta name="description" content="Sign in to your Shree Vastra account to track orders and shop ethnic wear."/>
      </Helmet>

      <div style={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, var(--color-cream) 0%, #F5E8D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(123,28,46,0.12)' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', color: 'var(--color-text)', margin: '0 0 6px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Sign in to your Shree Vastra account</p>
          </div>

          {/* Server error alert */}
          {serverError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '20px', animation: 'slideUp 0.3s ease' }}>
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

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label style={labelStyle} htmlFor="login-email">Email Address</label>
              <div style={{ ...inputWrap, borderColor: errors.email ? '#DC2626' : 'var(--color-border)', background: errors.email ? '#FFF5F5' : '#FAFAF8' }}>
                <Mail size={16} color={errors.email ? '#DC2626' : 'var(--color-text-muted)'} />
                <input id="login-email" type="email" placeholder="your@email.com" autoComplete="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' }
                  })}
                  style={inputStyle} />
              </div>
              {errors.email && (
                <span style={errStyle}>
                  <AlertCircle size={11} style={{ display: 'inline', marginRight: '4px' }}/>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }} htmlFor="login-password">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</Link>
              </div>
              <div style={{ ...inputWrap, borderColor: errors.password ? '#DC2626' : 'var(--color-border)', background: errors.password ? '#FFF5F5' : '#FAFAF8' }}>
                <Lock size={16} color={errors.password ? '#DC2626' : 'var(--color-text-muted)'} />
                <input id="login-password" type={showPass ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  style={inputStyle} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', flexShrink: 0 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span style={errStyle}>
                  <AlertCircle size={11} style={{ display: 'inline', marginRight: '4px' }}/>
                  {errors.password.message}
                </span>
              )}
            </div>

            <button id="login-submit" type="submit" disabled={loading} className="btn-primary"
              style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem', opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
              {loading ? 'Signing in...' : <><ArrowRight size={18} /> Sign In</>}
            </button>
          </form>

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

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px' };
const inputWrap  = { display: 'flex', alignItems: 'center', gap: '10px', border: '1.5px solid var(--color-border)', borderRadius: '10px', padding: '11px 14px', transition: 'border-color 0.2s, background 0.2s' };
const inputStyle = { flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: '0.9rem', fontFamily: 'var(--font-body)', color: 'var(--color-text)', minWidth: 0 };
const errStyle   = { color: '#DC2626', fontSize: '0.75rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 500 };
