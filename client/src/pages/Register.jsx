import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Phone, Info } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [userId, setUserId] = useState(null);
  const [devOTP, setDevOTP] = useState(''); // OTP shown in dev mode
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onRegister = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      setUserId(res.data.userId);
      // In dev mode, server returns OTP directly — auto-fill it
      if (res.data.devOTP) {
        setDevOTP(res.data.devOTP);
        setOtp(res.data.devOTP);
        toast.success(`📧 OTP auto-filled for development: ${res.data.devOTP}`, { duration: 6000 });
      } else {
        toast.success('OTP sent to your email!');
      }
      setStep(2);
    } catch (e) {
      const msg = e.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const onVerifyOTP = async () => {
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { userId, otp });
      dispatch(setCredentials(res.data));
      toast.success('Account created! Welcome to Shree Vastra 🎉');
      navigate('/account');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Create Account – Shree Vastra</title></Helmet>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--color-cream) 0%, #F5E8D0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '48px', width: '100%', maxWidth: '440px', boxShadow: '0 8px 40px rgba(123,28,46,0.12)' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-primary)', fontWeight: 700 }}>Shree Vastra</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--color-text)', margin: '12px 0 6px' }}>
              {step === 1 ? 'Create Account' : 'Verify Your Email'}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              {step === 1 ? 'Join thousands of happy customers' : devOTP ? 'OTP auto-filled (dev mode)' : 'Enter the 6-digit OTP sent to your email'}
            </p>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ width: s === step ? '24px' : '8px', height: '8px', borderRadius: '4px', background: s <= step ? 'var(--color-primary)' : 'var(--color-border)', transition: 'all 0.3s' }} />
            ))}
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit(onRegister)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name *</label>
                <div style={inputWrap}>
                  <User size={16} color="var(--color-text-muted)" />
                  <input id="register-name" type="text" placeholder="Priya Sharma" autoComplete="name"
                    {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })}
                    style={inputStyle} />
                </div>
                {errors.name && <span style={errStyle}>{errors.name.message}</span>}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address *</label>
                <div style={inputWrap}>
                  <Mail size={16} color="var(--color-text-muted)" />
                  <input id="register-email" type="email" placeholder="your@email.com" autoComplete="email"
                    {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
                    style={inputStyle} />
                </div>
                {errors.email && <span style={errStyle}>{errors.email.message}</span>}
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Mobile Number *</label>
                <div style={inputWrap}>
                  <Phone size={16} color="var(--color-text-muted)" />
                  <input id="register-phone" type="tel" placeholder="98765 43210" autoComplete="tel"
                    {...register('phone', { required: 'Phone number is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit Indian mobile number' } })}
                    style={inputStyle} />
                </div>
                {errors.phone && <span style={errStyle}>{errors.phone.message}</span>}
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password *</label>
                <div style={inputWrap}>
                  <Lock size={16} color="var(--color-text-muted)" />
                  <input id="register-password" type={showPass ? 'text' : 'password'} placeholder="Minimum 6 characters" autoComplete="new-password"
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                    style={inputStyle} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', flexShrink: 0 }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span style={errStyle}>{errors.password.message}</span>}
              </div>

              <button id="register-submit" type="submit" disabled={loading}
                style={{ background: loading ? 'var(--color-text-muted)' : 'var(--color-primary)', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', marginTop: '4px', fontFamily: 'var(--font-body)', transition: 'all 0.3s' }}>
                {loading ? 'Creating Account...' : 'Create Account →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
              </p>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Dev mode banner */}
              {devOTP && (
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Info size={16} color="#3B82F6" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.8rem', color: '#1D4ED8' }}>
                    <strong>Development Mode:</strong> OTP is <strong style={{ letterSpacing: '0.15em' }}>{devOTP}</strong>.<br />
                    In production, it'll be sent to your email.
                  </div>
                </div>
              )}

              <div>
                <label style={{ ...labelStyle, textAlign: 'center', display: 'block' }}>Enter 6-Digit OTP</label>
                <input id="otp-input" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" maxLength={6}
                  style={{ width: '100%', textAlign: 'center', letterSpacing: '0.4em', fontSize: '2rem', padding: '16px', border: `2px solid ${otp.length === 6 ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: '12px', fontWeight: 700, fontFamily: 'var(--font-body)', outline: 'none', color: 'var(--color-primary)', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
              </div>

              <button id="otp-submit" onClick={onVerifyOTP} disabled={loading || otp.length !== 6}
                style={{ background: otp.length === 6 && !loading ? 'var(--color-primary)' : 'var(--color-text-muted)', color: 'white', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: otp.length === 6 && !loading ? 'pointer' : 'not-allowed', fontSize: '1rem', fontFamily: 'var(--font-body)', transition: 'all 0.3s' }}>
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <button onClick={() => { setStep(1); setOtp(''); setDevOTP(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'underline' }}>
                ← Go back & edit details
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px' };
const inputWrap = { display: 'flex', alignItems: 'center', gap: '10px', border: '1.5px solid var(--color-border)', borderRadius: '10px', padding: '11px 14px', background: '#FAFAF8', transition: 'border-color 0.2s' };
const inputStyle = { flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: '0.9rem', fontFamily: 'var(--font-body)', color: 'var(--color-text)', minWidth: 0 };
const errStyle = { color: '#DC2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' };
