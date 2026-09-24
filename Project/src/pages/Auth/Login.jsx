import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/useAuthStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import './Login.css';

// 1. Define Zod Validation Schema for form fields
const loginSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.phone || data.email, {
  message: 'Please provide either a phone number or email address',
  path: ['phone'],
});

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login || state.handleLogin);

  // State Management (Preserving original logic states)
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+251');
  const [errorMessage, setErrorMessage] = useState('');

  // Telebirr Modal State
  const [showTelebirrModal, setShowTelebirrModal] = useState(false);
  const [telebirrPhone, setTelebirrPhone] = useState('');

  // React Hook Form Setup with Zod Resolver
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      email: '',
      password: '',
    },
  });

  // Google OAuth Handler (Unchanged working logic)
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();
        login({ fullName: googleUser.name, email: googleUser.email, authType: 'google' });
        navigate('/');
      } catch (err) {
        console.error('Google Auth Error:', err);
        setErrorMessage('Failed to sign in with Google. Please try again.');
      }
    },
    onError: () => setErrorMessage('Google Login failed or was cancelled.'),
  });

  // Credential Submit Handler integrated with Zod data output
  const onSubmit = (formData) => {
    setErrorMessage('');

    // Fetch registered accounts array
    const storedUsers = JSON.parse(
      localStorage.getItem('registered_users') || '[]'
    );

    // Helper to strip non-digit characters and country code prefixes
    const cleanPhone = (numStr) => {
      if (!numStr) return '';
      let cleaned = String(numStr).replace(/\D/g, '');
      if (cleaned.startsWith('251')) cleaned = cleaned.slice(3);
      if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
      return cleaned;
    };

    const targetInput = authMethod === 'phone' ? (formData.phone || '').trim() : (formData.email || '').trim();

    if (!targetInput) {
      setErrorMessage(authMethod === 'phone' ? 'Please enter your mobile number.' : 'Please enter your email address.');
      return;
    }

    // Find account by matching normalized phone or email
    const foundUser = storedUsers.find((u) => {
      if (!u) return false;

      if (authMethod === 'phone') {
        const inputPhoneClean = cleanPhone(`${selectedCode}${targetInput}`);
        const userPhoneClean = cleanPhone(u.phone || u.mobile || '');
        return userPhoneClean && userPhoneClean === inputPhoneClean;
      }

      return (u.email || '').toLowerCase() === targetInput.toLowerCase();
    });

    if (!foundUser) {
      setErrorMessage('No account found with these credentials. Please check or register.');
      return;
    }

    if (foundUser.password !== formData.password) {
      setErrorMessage('Incorrect password. Please try again.');
      return;
    }

    login(foundUser);
    navigate('/');
  };

  const handleTabSwitch = (method) => {
    setAuthMethod(method);
    setValue('phone', '');
    setValue('email', '');
    setValue('password', '');
    setErrorMessage('');
  };

  const handleTelebirrSubmit = () => {
    if (!telebirrPhone.trim()) {
      alert('Please enter your Telebirr mobile number.');
      return;
    }
    login({
      fullName: 'Telebirr Member',
      phone: `+251${telebirrPhone.trim()}`,
      authType: 'telebirr',
    });
    setShowTelebirrModal(false);
    navigate('/');
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2 className="login-title">Sign In to Mesob House</h2>

        {/* Dynamic Error Alert */}
        {errorMessage && <div className="auth-error-alert">{errorMessage}</div>}

        {/* Social Authentication */}
        <div className="social-buttons">
          <button
            type="button"
            className="btn-social"
            onClick={() => setShowTelebirrModal(true)}
          >
            📱 Telebirr
          </button>
          <button
            type="button"
            className="btn-social"
            onClick={() => handleGoogleLogin()}
          >
            🌐 Google
          </button>
        </div>

        <div className="divider">
          <span>OR SIGN IN WITH CREDENTIALS</span>
        </div>

        {/* Tab Selection */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${authMethod === 'phone' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('phone')}
          >
            Phone Number
          </button>
          <button
            type="button"
            className={`tab-btn ${authMethod === 'email' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('email')}
          >
            Email Address
          </button>
        </div>

        {/* Credentials Form managed via React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" autoComplete="off">
          {authMethod === 'phone' ? (
            <div className="form-group">
              <label>Mobile Number</label>
              <div className="phone-input-row">
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                >
                  <option value="+251">+251 (Ethiopia)</option>
                  <option value="+1">+1 (US)</option>
                </select>
                <input
                  type="tel"
                  placeholder="0911234567"
                  {...register('phone')}
                  autoComplete="off"
                />
              </div>
              {errors.phone && <span className="error-text" style={{ color: 'red', fontSize: '0.8rem' }}>{errors.phone.message}</span>}
            </div>
          ) : (
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                autoComplete="off"
              />
              {errors.email && <span className="error-text" style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email.message}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="error-text" style={{ color: 'red', fontSize: '0.8rem' }}>{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn-submit">
            Sign In
          </button>
        </form>

        <div className="login-footer-row">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>

      {/* Telebirr Modal Window */}
      {showTelebirrModal && (
        <div className="telebirr-modal-overlay">
          <div className="telebirr-modal-card">
            <h3 className="telebirr-modal-title">Telebirr Quick Sign-In</h3>
            <div className="telebirr-form-group">
              <label>Enter Telebirr Phone Number</label>
              <div className="telebirr-phone-input-group">
                <span className="telebirr-phone-prefix">+251</span>
                <input
                  type="tel"
                  className="telebirr-input"
                  placeholder="911234567"
                  value={telebirrPhone}
                  onChange={(e) => setTelebirrPhone(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="telebirr-modal-actions">
              <button
                type="button"
                className="btn-telebirr-cancel"
                onClick={() => setShowTelebirrModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-telebirr-submit"
                onClick={handleTelebirrSubmit}
              >
                Authenticate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}