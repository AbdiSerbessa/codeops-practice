
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* Top Graphic / Mesob Icon */}
        <div className="empty-mesob-badge">Empty Mesob</div>
        
        {/* Big 404 Title */}
        <h1 className="error-code">404</h1>
        <h2 className="error-subtitle">TABLE NOT SET • ERROR</h2>
        
        <p className="error-message">
          Looks like this dish has already been enjoyed or never made it to the kitchen!
        </p>
        
        <p className="error-description">
          Even the best Gursha sometimes slips! Don't let your appetite wait — our Addis kitchen has hot clay pot wats and freshly rolled teff injera ready for your table right now.
        </p>

        {/* Action Buttons */}
        <div className="error-actions">
          <button onClick={() => navigate('/')} className="btn-primary-red">
            ✕ Return to Today's Specials
          </button>
          <button onClick={() => navigate('/menu')} className="btn-secondary">
            📖 Explore Full Menu
          </button>
          <button onClick={() => navigate('/cart')} className="btn-secondary">
            🛒 Check Current Order
          </button>
        </div>

        {/* House Favorites Section (Featured Dishes preview) */}
        <div className="house-favorites-section">
          <h3>Hungry? Here's What Our Guests Love Today</h3>
          {/* You can map or render your featured dishes preview cards here */}
        </div>

        {/* Concierge Footer Bar */}
        <div className="concierge-bar">
          <div>
            <strong>Lost your table or need personalized dietary recommendations?</strong>
            <span>Our concierge in Bole Medhanialem is delighted to prepare your banquet.</span>
          </div>
          <div className="concierge-contact">
            <a href="tel:+251909090909">📞 +251 909090909</a>
            <button onClick={() => navigate('/reserve')} className="btn-reserve">Reserve</button>
          </div>
        </div>
      </div>
    </div>
  );
}