import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function TrustBadges() {
  const badges = [
    { icon: '🛡️', title: 'ENCRYPTED SECURITY', subtitle: 'Telebirr PIN & CBE Birr verified' },
    { icon: '🌿', title: 'FASTING FEASTS', subtitle: 'Tsom Beyaynetu on Wed & Fri' },
    { icon: '💨', title: 'FRESH INJERA STEAM', subtitle: 'Baked three times each day' },
    { icon: '📞', title: 'BOLE CONCIERGE', subtitle: '+251 909090909' },
  ];

  return (
    <div className="trust-badges-wrapper">
      <div className="trust-badges-grid">
        {badges.map((item, index) => (
          <div className="trust-badge-item" key={index}>
            <span className="badge-icon">{item.icon}</span>
            <div className="badge-text">
              <span className="badge-title">{item.title}</span>
              <span className="badge-subtitle">{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Retrieve registered user from local storage
    const storedUserRaw = localStorage.getItem('mesob_registered_user');

    if (!storedUserRaw) {
      alert('No registered account found. Please create an account first.');
      return;
    }

    const storedUser = JSON.parse(storedUserRaw);

    // 2. Validate identifier (Phone or Email)
    if (loginMethod === 'phone') {
      const inputPhone = formData.phone.trim();
      if (!inputPhone) {
        alert('Please enter your Ethiopian mobile number.');
        return;
      }
      if (inputPhone !== storedUser.phone) {
        alert('Mobile number not recognized. Please check your input or register.');
        return;
      }
    } else {
      const inputEmail = formData.email.trim().toLowerCase();
      if (!inputEmail) {
        alert('Please enter your email address.');
        return;
      }
      if (inputEmail !== storedUser.email) {
        alert('Email address not recognized. Please check your input or register.');
        return;
      }
    }

    // 3. Validate Password Length (8 characters minimum)
    if (!formData.password) {
      alert('Please enter your password.');
      return;
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    // 4. Compare Password against stored registration credential
    if (formData.password !== storedUser.password) {
      alert('Incorrect password. Please try again.');
      return;
    }

    // 5. Store authentication status
    localStorage.setItem('mesob_is_authenticated', 'true');

    alert(`Welcome back, ${storedUser.fullName}!`);

    // Redirect to Home page
    navigate('/');
  };

  return (
    <div className="container register-container">
      <div className="breadcrumb">
        HOME / ACCOUNT / <span>SIGN IN</span>
      </div>

      <div className="register-main">
        {/* Left Side Banner */}
        <div className="register-banner">
          <div className="member-badge">
            <span className="badge-star">★</span> MESOB FEAST CIRCLE & PERKS
          </div>
          <h2>A table shared is a bond celebrated.</h2>
          <div className="banner-divider">« |||| |||| |||| »</div>

          <p className="banner-subtitle">
            Sign in to your culinary sanctuary. Track your seasonal fasting platters, express your Jebena preferences, and summon traditional Addis feasts straight to your door.
          </p>

          <div className="banner-image-card">
            <img 
              src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80" 
              alt="Sunday Jebena Buna Circle" 
            />
            <div className="image-card-caption">
              <h4>Sunday Jebena Buna Circle</h4>
              <p>Exclusive roasting access for verified members</p>
            </div>
          </div>

          <div className="perk-card">
            <span className="perk-icon">🎁</span>
            <div>
              <h4>10 Gursha Points / ETB 100</h4>
              <p>Redeem against rare honey tej batches or special communal platters.</p>
            </div>
          </div>

          <div className="perk-card">
            <span className="perk-icon">🚚</span>
            <div>
              <h4>Free Bole & Kazanchis Delivery</h4>
              <p>Priority courier dispatch with heat-insulated clay-stone trays.</p>
            </div>
          </div>

          <div className="perk-card">
            <span className="perk-icon">⚡</span>
            <div>
              <h4>Instant Telebirr & CBE Birr</h4>
              <p>Zero-fee instant table settlement and 1-tap reordering.</p>
            </div>
          </div>

          <div className="banner-quote">
            <p className="quote-text">
              "The table ordering is as seamless as eating from our grandmother's mesob."
            </p>
            <p className="quote-author">Dr. Tola — BOLE MEMBER</p>
          </div>
        </div>

        {/* Right Side Login Card */}
        <div className="register-card">
          <div className="card-header-badge">MEMBER PORTAL</div>
          <h2 className="card-title">Welcome to the Mesob Table</h2>
          <p className="card-subtitle">
            Sign in to manage your feasts, Telebirr rewards, and reserved dining mesobs.
          </p>

          <div className="social-buttons">
            <button className="btn-social" type="button">
              <span>📱</span> Telebirr SuperApp
            </button>
            <button className="btn-social" type="button">
              <span>G</span> Google Sign-In
            </button>
          </div>

          <div className="divider">
            <span>OR WITH PHONE / EMAIL</span>
          </div>

          {/* Toggle Tabs */}
          <div className="login-tabs">
            <button
              type="button"
              className={`tab-btn ${loginMethod === 'phone' ? 'active' : ''}`}
              onClick={() => setLoginMethod('phone')}
            >
              Ethiopian Mobile (+251)
            </button>
            <button
              type="button"
              className={`tab-btn ${loginMethod === 'email' ? 'active' : ''}`}
              onClick={() => setLoginMethod('email')}
            >
              Email Address
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {loginMethod === 'phone' ? (
              <div className="form-group">
                <div className="label-row">
                  <label>Ethiopian Mobile Number</label>
                  <span className="subtle-hint">SMS OTP Supported</span>
                </div>
                <div className="phone-input-group">
                  <span className="country-code">🇪🇹 +251</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0909090909"
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@mesobhouse.com"
                />
              </div>
            )}

            <div className="form-group">
              <div className="label-row">
                <label>Password</label>
                <a href="#forgot" className="forgot-link">Forgot Password?</a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="🔒 Enter your confidential password (min 8 chars)"
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Keep me signed in on this device
              </label>
              <span className="subtle-hint">🔒 Remember Addis address</span>
            </div>

            <button type="submit" className="btn-submit">
              Sign in to Mesob House →
            </button>
          </form>

          <div className="login-footer-row">
            <div className="login-footer-text">
              <p>New to our dining family?</p>
              <Link to="/register">
                Join the Mesob Table &amp; Register ›
              </Link>
            </div>

            <Link to="/guest" className="btn-guest-continue">
              <span>🛍️</span> Continue as Guest
            </Link>
          </div>
        </div>
      </div>

      <TrustBadges />
    </div>
  );
}