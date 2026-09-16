import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 1. State Declarations
  const [showTelebirrModal, setShowTelebirrModal] = useState(false);
  const [telebirrPhone, setTelebirrPhone] = useState('');
  const [telebirrOtp, setTelebirrOtp] = useState('');
  const [telebirrStep, setTelebirrStep] = useState(1);

  const [countries, setCountries] = useState([]);
  const [selectedCode, setSelectedCode] = useState('+251');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    diningPreference: 'All Heritage Delicacies',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  

  // 2. Fetch World Country Calling Codes via API
  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/codes')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((result) => {
        if (result && result.data) {
          const list = result.data
            .map((c) => ({
              code: c.dial_code.startsWith('+') ? c.dial_code : `+${c.dial_code}`,
              name: c.name,
              cca2: c.code,
            }))
            .filter((c) => c.code && c.name)
            .sort((a, b) => a.name.localeCompare(b.name));

          setCountries(list);
        }
      })
      .catch((err) => {
        console.error('Error fetching country codes via primary API:', err);
        fetch('https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json')
          .then((res) => res.json())
          .then((data) => {
            const fallbackList = data
              .map((c) => ({
                code: `${c.idd?.root || ''}${c.idd?.suffixes ? c.idd.suffixes[0] : ''}`,
                name: c.name?.common,
                cca2: c.cca2,
              }))
              .filter((c) => c.code && c.name)
              .sort((a, b) => a.name.localeCompare(b.name));

            setCountries(fallbackList);
          })
          .catch((fallbackErr) => console.error('Fallback fetch error:', fallbackErr));
      });
  }, []);

  // 3. Telebirr Handler
  const handleTelebirrSubmit = (e) => {
    e.preventDefault();
    if (telebirrStep === 1) {
      if (!telebirrPhone.trim()) {
        alert('Please enter your Telebirr phone number');
        return;
      }
      alert('Demo SMS Sent! Use code: 123456');
      setTelebirrStep(2);
    } else {
      if (!telebirrOtp.trim()) {
        alert('Please enter the verification code sent via Telebirr SMS');
        return;
      }

      login({
        fullName: `Telebirr User (${telebirrPhone})`,
        phone: `+251${telebirrPhone}`,
        email: `${telebirrPhone}@telebirr.et`,
        authType: 'telebirr',
      });

      alert('Successfully logged in with Telebirr!');
      setShowTelebirrModal(false);
      navigate('/');
    }
  };

  // 4. Google OAuth Trigger
  const handleGoogleLogin = useGoogleLogin({
    override_scope: true,
    prompt: 'select_account',
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();

        login({
          fullName: googleUser.name,
          email: googleUser.email,
          phone: '',
          authType: 'google',
        });

        alert(`Welcome, ${googleUser.name}! Account created via Google.`);
        navigate('/');
      } catch (err) {
        console.error('Google User Fetch Error:', err);
      }
    },
    onError: (error) => console.error('Google Sign-In Failed:', error),
  });

  // 5. Form Input Change Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 6. Validation Logic
  const validateForm = () => {
    const newErrors = {};

    // Full Name
    const nameRegex = /^[A-Za-z\s]{4,}$/;
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (!nameRegex.test(formData.fullName.trim())) {
      newErrors.fullName = 'Name must be at least 4 characters and contain only letters.';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone
    const phoneRegex = /^[0-9]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must contain digits only.';
    }

    // Password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Must be at least 8 characters long with 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).';
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 7. Standard Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newUserData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: `${selectedCode}${formData.phone.trim()}`,
      password: formData.password,
    };

    // 1. Fetch existing users array from localStorage
    const existingUsers = JSON.parse(
      localStorage.getItem('registered_users') || '[]'
    );

    // 2. Add new user and store back in localStorage
    existingUsers.push(newUserData);
    localStorage.setItem('registered_users', JSON.stringify(existingUsers));

    // 3. Log user in and redirect
    login(newUserData);
    alert('Account created successfully!');
    navigate('/');
  };

  return (
    <div className="container register-container">
      <div className="breadcrumb">
        ACCOUNT / <span>JOIN THE MESOB FAMILY</span>
      </div>

      <div className="register-main">
        {/* Left Side Banner */}
        <div className="register-banner">
          <div className="member-badge">
            <span className="badge-star">★</span> MEMBER CIRCLE
          </div>
          <h2>Become an Honored Table Guest</h2>

          <div className="perk-card">
            <span className="perk-icon">🎁</span>
            <div>
              <h4>Welcome Gift: Pure Tej or Buna</h4>
              <p>Enjoy a complimentary 100ml of aged honey wine or personalized coffee ceremony.</p>
            </div>
          </div>

          <div className="perk-card">
            <span className="perk-icon">🌾</span>
            <div>
              <h4>Communal Gursha Points</h4>
              <p>Earn generous loyalty points redeemable for hand-poured Teff injera platters.</p>
            </div>
          </div>

          <div className="perk-card">
            <span className="perk-icon">🥗</span>
            <div>
              <h4>Fasting Calendar Alerts</h4>
              <p>Timely seasonal notifications for Tsom fasting periods and Chef specials.</p>
            </div>
          </div>

          <div className="perk-card">
            <span className="perk-icon">🚚</span>
            <div>
              <h4>Express Addis Delivery</h4>
              <p>Save Bole, Kazanchis, or Old Airport drop-offs for fast clay-pot temperature delivery.</p>
            </div>
          </div>
        </div>

        {/* Right Side Register Card */}
        <div className="register-card">
          <h2 className="card-title">Create Your Mesob House Account</h2>

          {/* Social Sign In Options */}
          <div className="social-buttons">
            <button
              className="btn-social"
              type="button"
              onClick={() => {
                setTelebirrStep(1);
                setShowTelebirrModal(true);
              }}
            >
              📱 Telebirr Quick Sign
            </button>
            <button
              className="btn-social"
              type="button"
              onClick={() => handleGoogleLogin()}
            >
              🌐 Continue with Google
            </button>
          </div>

          <div className="divider">
            <span>OR REGISTER WITH YOUR DETAILS</span>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g., Abebe Bikila"
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            {/* Mobile Number */}
            <div className="form-group">
              <label>Mobile Number</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  style={{ width: '130px', padding: '8px', borderRadius: '4px' }}
                >
                  <option value="+251">+251 (Ethiopia)</option>
                  {countries.map((c) => (
                    <option key={c.cca2} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0911234567"
                  style={{ flex: 1 }}
                />
              </div>
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="abdi@example.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Password & Confirm Password */}
            <div className="form-row" style={{ display: 'flex', gap: '12px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* Dining Preference */}
            <div className="form-group">
              <label>Primary Dining Preference (Optional)</label>
              <select
                name="diningPreference"
                value={formData.diningPreference}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
              >
                <option value="All Heritage Delicacies">All Heritage Delicacies</option>
                <option value="Fasting & Vegan (Tsom)">Fasting &amp; Vegan (Tsom)</option>
                <option value="Meat Lover's Feast">Meat Lover's Feast</option>
              </select>
            </div>

            {/* Terms Checkbox */}
            <div className="form-group">
              <label className="checkbox-label" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                I agree to the Mesob House Terms and Privacy Guidelines
              </label>
            </div>

            <button type="submit" className="btn-submit">
              Create Account &amp; Receive Welcome Gursha →
            </button>
          </form>

          <div className="login-footer-row" style={{ marginTop: '16px' }}>
            <p>Already part of our dining family? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
      </div>

      {/* Telebirr Modal */}
      {showTelebirrModal && (
        <div className="telebirr-modal-overlay">
          <div className="telebirr-modal-card">
            <h3 className="telebirr-modal-title">Telebirr Quick Sign-In</h3>
            <form onSubmit={handleTelebirrSubmit}>
              {telebirrStep === 1 ? (
                <div className="telebirr-form-group">
                  <label>Telebirr Phone Number</label>
                  <div className="telebirr-phone-input-group">
                    <span className="telebirr-phone-prefix">+251</span>
                    <input
                      type="tel"
                      placeholder="911234567"
                      value={telebirrPhone}
                      onChange={(e) => setTelebirrPhone(e.target.value)}
                      className="telebirr-input"
                    />
                  </div>
                </div>
              ) : (
                <div className="telebirr-form-group">
                  <label>Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={telebirrOtp}
                    onChange={(e) => setTelebirrOtp(e.target.value)}
                    className="telebirr-input"
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              <div className="telebirr-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowTelebirrModal(false)}
                  className="btn-telebirr-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-telebirr-submit"
                >
                  {telebirrStep === 1 ? 'Send Code' : 'Verify & Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}