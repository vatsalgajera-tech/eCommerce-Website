import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { setCredentials } from '../store/slices/authSlice';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await api.post('/auth/login', { email: data.email.trim(), password: data.password });
      dispatch(setCredentials(res.data));
      toast.success(`Welcome back, ${res.data.user.name}! 🌸`);
      // Redirect to admin if admin, else to original page
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/account' : from);
      }
    } catch (e) {
      const msg = e.response?.data?.message || 'Login failed. Please try again.';
      setServerError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Login – Shree Vastra</title></Helmet>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--color-cream) 0%, #F5E8D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(123,28,46,0.12)' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-primary)', fontWeight: 700 }}>Shree Vastra</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--color-text)', margin: '12px 0 6px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Sign in to your account</p>
          </div>

          {/* Server error alert */}
          {serverError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
              <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: '#DC2626' }}>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email */}
            <div>
              <label style={labelStyle} htmlFor="login-email">Email Address</label>
              <div style={{ ...inputWrap, borderColor: errors.email ? '#DC2626' : 'var(--color-border)' }}>
                <Mail size={16} color="var(--color-text-muted)" />
                <input id="login-email" type="email" placeholder="your@email.com" autoComplete="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } })}
                  style={inputStyle} />
              </div>
              {errors.email && <span style={errStyle}>{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }} htmlFor="login-password">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
              </div>
              <div style={{ ...inputWrap, borderColor: errors.password ? '#DC2626' : 'var(--color-border)' }}>
                <Lock size={16} color="var(--color-text-muted)" />
                <input id="login-password" type={showPass ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                  style={inputStyle} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', flexShrink: 0 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span style={errStyle}>{errors.password.message}</span>}
            </div>

            <button id="login-submit" type="submit" disabled={loading}
              style={{ background: loading ? 'var(--color-text-muted)' : 'var(--color-primary)', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', fontFamily: 'var(--font-body)', transition: 'all 0.3s', letterSpacing: '0.02em' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
          </p>

          {/* Demo credentials hint */}
          <div style={{ marginTop: '20px', background: 'var(--color-cream)', borderRadius: '10px', padding: '12px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Admin: <strong>admin@shreevastra.com</strong> / <strong>Admin@ShreeVastra@123</strong>
            <br/><small style={{color:'var(--color-text-muted)'}}>📧 Need help? support.shreevastra@gmail.com</small>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px' };
const inputWrap = { display: 'flex', alignItems: 'center', gap: '10px', border: '1.5px solid var(--color-border)', borderRadius: '10px', padding: '11px 14px', background: '#FAFAF8', transition: 'border-color 0.2s' };
const inputStyle = { flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: '0.9rem', fontFamily: 'var(--font-body)', color: 'var(--color-text)', minWidth: 0 };
const errStyle = { color: '#DC2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' };
