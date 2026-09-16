import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State Management
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+251');
  const [errorMessage, setErrorMessage] = useState('');

  // Telebirr Modal State
  const [showTelebirrModal, setShowTelebirrModal] = useState(false);
  const [telebirrPhone, setTelebirrPhone] = useState('');

  // Google OAuth Handler
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
  });// Credential Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
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

    const targetInput = authMethod === 'phone' ? phone.trim() : email.trim();

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

    if (foundUser.password !== password) {
      setErrorMessage('Incorrect password. Please try again.');
      return;
    }

    login(foundUser);
    navigate('/');
  };
  const handleTabSwitch = (method) => {
    setAuthMethod(method);
    setPhone('');
    setEmail('');
    setPassword('');
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

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
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