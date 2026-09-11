import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    diningPreference: 'All Heritage Delicacies',
    agreeToTerms: false,
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
    console.log('Register Submitted:', formData);
  };

  return (
    <div className="register-container container">
      <div className="breadcrumb">
        Account / <span>Join the Mesob Family</span>
      </div>

      <div className="register-main">
        {/* Left Column Section */}
<div className="register-banner-column">
  {/* Top Main Banner Card */}
  <div className="register-banner-card">
    <div className="member-circle-badge">
      <span className="badge-star-icon">★</span>
      <span className="badge-bars">||||||||</span>
      <span className="badge-text-val">• MEMBER CIRCLE</span>
    </div>

    <h2 className="banner-title">Become an Honored Table Guest</h2>
    <p className="banner-desc">
      Immerse yourself in authentic highland hospitality, where every shared meal honors community, connection, and craft.
    </p>

    <div className="banner-cards">
      <div className="perk-card">
        <div className="perk-icon-bg icon-wine">🍷</div>
        <div>
          <h4>Welcome Gift: Pure Tej or Buna</h4>
          <p>
            Enjoy a complimentary flask of house-fermented Tej (pure honey wine) or a personalized Jebena Buna coffee ceremony with your inaugural banquet booking.
          </p>
        </div>
      </div>

      <div className="perk-card transparent-card">
        <div className="perk-icon-bg icon-green">🏅</div>
        <div>
          <h4>Communal Gursha Points</h4>
          <p>
            Earn generous loyalty points redeemable for hand-poured pure Teff injera, prime Siga Tibs, and bespoke banquet upgrades.
          </p>
        </div>
      </div>

      <div className="perk-card transparent-card">
        <div className="perk-icon-bg icon-teal">🔔</div>
        <div>
          <h4>Fasting Calendar Alerts</h4>
          <p>
            Timely seasonal notifications for Tsom fasting periods, Chef's Bayaynetu spreads, and lenten specialties.
          </p>
        </div>
      </div>

      <div className="perk-card transparent-card">
        <div className="perk-icon-bg icon-yellow">🛵</div>
        <div>
          <h4>Express Addis Delivery</h4>
          <p>
            Save Bole, Kazanchis, Old Airport, or Sarbet drop-offs for fast clay-pot temperature delivery straight to your doorstep.
          </p>
        </div>
      </div>

      <div className="perk-card transparent-card">
        <div className="perk-icon-bg icon-red">🏛️</div>
        <div>
          <h4>Priority Mesob Table Reservations</h4>
          <p>
            Skip standard waitlists for weekend live Kirar acoustic sets and evening green-coffee roasting ceremonies.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Separate Bottom Quote Card */}
  <div className="quote-box-standalone">
    <img 
      src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=200" 
      alt="Traditional Mesob Feast" 
      className="quote-img"
    />
    <div className="quote-content">
      <div className="quote-badge">TRADITION IN EVERY BITE</div>
      <p className="quote-text">
        "Sharing from the same mesob is the ancient covenant of love and trust."
      </p>
      <span className="quote-author">— Habesha Proverb</span>
    </div>
  </div>
</div>

        {/* Right Form Card */}
        <div className="register-card">
          <h3>Create Your Mesob House Account</h3>
          <p className="card-subtext">Join our culinary heritage circle in less than a minute.</p>

          <div className="social-login-group">
            <button type="button" className="btn-social">📱 Telebirr Quick Sign</button>
            <button type="button" className="btn-social">G Continue with Google</button>
          </div>

          <div className="divider-text">Or register with your details</div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. Abebe Bikila or Gennet Tadesse"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Ethiopian Mobile Number</label>
              <div className="phone-input-wrapper">
                <span className="phone-code">🇪🇹 +251</span>
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="911 234 567"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>
              <span className="input-helper-text">
                💬 We will send a 4-digit code to verify your Ethiopian mobile number.
              </span>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="guest@mesobhouse.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="section-sublabel">Primary Dining Preference (Optional)</label>
              <span className="preference-hint">Helps our chefs customize your banquet platters and fasting recommendations.</span>
              
              <div className="preference-chips">
                {['All Heritage Delicacies', 'Fasting & Vegan (Tsom)', 'Halal Certified Meat', '100% Pure Teff (Gluten-Free)'].map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    className={`chip-btn ${formData.diningPreference === pref ? 'active' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, diningPreference: pref }))}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <div className="terms-checkbox-group">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeToTerms">
                I agree to the <a href="#terms" className="terms-link">Mesob House Hospitality Terms</a> and <a href="#privacy" className="terms-link">Privacy Guidelines</a>.
              </label>
            </div>

            <button type="submit" className="btn-submit-register">
              Create Account & Receive Welcome Gursha →
            </button>
          </form>

          <p className="login-redirect-text">
            Already part of our dining family? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}