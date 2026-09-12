import './Footer.css';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        {/* Brand Col */}
        <div className="footer-col brand-col">
          <h3 className="footer-logo">Mesob House</h3>
          <p className="footer-tagline">
            Sharing traditions from the Ethiopian highlands — one Gursha at a time.
          </p>
          <div className="coffee-card">
            <span className="coffee-icon">☕</span>
            <p>Traditional Coffee Ceremony daily at 4:00 PM</p>
          </div>
        </div>

        {/* Hours Col */}
        <div className="footer-col">
          <h4>HOSPITALITY HOURS</h4>
          <p><strong>Tuesday – Sunday:</strong> 11:30 AM – 11:00 PM</p>
          <p><strong>Monday:</strong> Reserved for Private Banquets</p>
          <p className="accent-text">Jebena Buna & Fresh Roasting All Evening</p>
        </div>

        {/* Links Col */}
        <div className="footer-col">
          <h4>GUEST ACCOUNT & TRADITIONS</h4>
          <ul>
            <li><a href="#rewards">Sign In to Mesob Rewards</a></li>
            <li><a href="#profile">Create Member Profile</a></li>
            <li><a href="#fasting">Vegan Fasting (Beyaynetu / Tsom)</a></li>
            <li><a href="#tej">House Tej (Pure Honey Wine)</a></li>
          </ul>
        </div>

        {/* Location Col */}
        <div className="footer-col">
          <h4>ADDIS LOCATION</h4>
          <p>Bole Medhanialem, Addis Ababa & express delivery across town.</p>
          <p className="phone-number">+251 909090909</p>
          <div className="social-icons">
            <span>🍽️</span> <span>☕</span> <span>🔗</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>© 2026 Mesob House Habesha Dining. Authentic Ethiopian & Eritrean Heritage.</p>
          <div className="footer-legal">
            <a href="#gursha">Gursha Hospitality</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Table</a>
          </div>
        </div>
      </div>
    </footer>
  );
}