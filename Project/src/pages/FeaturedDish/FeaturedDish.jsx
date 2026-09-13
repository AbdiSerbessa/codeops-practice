import { useState } from 'react';
import dishData from '../../data/featuredDish.json';
import './FeaturedDish.css';

// Helper function to resolve dynamic image paths from src/assets/images
const getImageUrl = (imageName) => {
  return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
};

export default function FeaturedDish() {
  // 1. Default spice level set to 'Mild'
  const [spiceLevel, setSpiceLevel] = useState('Mild');
  const [injeraBase, setInjeraBase] = useState('Standard');
  
  // 2. Multi-select state for up to 2 side accents
  const [selectedAccents, setSelectedAccents] = useState(['Fresh Ayib']);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);

  // Toggle accents with 2-item maximum limit
  const toggleAccent = (accentId) => {
    setSelectedAccents((prev) => {
      if (prev.includes(accentId)) {
        return prev.filter((item) => item !== accentId);
      }
      if (prev.length < 2) {
        return [...prev, accentId];
      }
      return prev;
    });
  };

  return (
    <div className="featured-dish-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          Home &gt; Menu &gt; Traditional Stews &gt; <span>{dishData.title}</span>
        </div>

        {/* Two-Column Showcase Grid */}
        <div className="dish-showcase-grid">
          
          {/* LEFT COLUMN */}
          <div className="left-column">
            <div className="hero-image-container">
              <span className="badge badge-primary">HOUSE SIGNATURE</span>
              <span className="badge badge-secondary">100% TEFF OPTION</span>
              <img
                src={getImageUrl(dishData.gallery[activeThumb] || dishData.heroImage)}
                alt={dishData.title}
                className="hero-image"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="thumbnail-gallery">
              {dishData.gallery.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  className={idx === activeThumb ? 'active' : ''}
                  onClick={() => setActiveThumb(idx)}
                />
              ))}
            </div>

            {/* Cultural Backstory Card */}
            <div className="cultural-card">
              <span className="cultural-tag">{dishData.heritage.tag}</span>
              <h3>{dishData.heritage.title}</h3>
              <p>{dishData.heritage.description}</p>
              
              <div className="dish-specs-strip">
                <div><strong>PREPARATION</strong><br />{dishData.heritage.prep}</div>
                <div><strong>ORIGIN</strong><br />{dishData.heritage.origin}</div>
                <div><strong>ALLERGENS</strong><br />{dishData.heritage.allergens}</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-column">
            
            {/* Header & Amharic Subtitle */}
            <div className="dish-header-row">
              <div>
                <h1 className="dish-title">
                  {dishData.title} <span className="amharic-text">(የዶሮ ወጥ)</span>
                </h1>
              </div>
              <div className="price-badge">
                <span className="currency">ETB</span>
                <span className="amount">{dishData.price}</span>
              </div>
            </div>

            <p className="dish-description">{dishData.description}</p>

            {/* Feature Highlights Strip */}
            <div className="dish-highlights-strip">
              <div className="highlight-item">👥 Serves 1–2 generously</div>
              <div className="dot-separator">•</div>
              <div className="highlight-item">Unlimited table injera refill included</div>
              <div className="dot-separator">•</div>
              <div className="highlight-item green-text">Taxes included</div>
            </div>

            {/* Section 1: Heat & Spice Level */}
            <div className="custom-section">
              <div className="section-header">
                <label>1. Heat &amp; Spice Level 🔥</label>
                <span className="meta-tag required">Required</span>
              </div>

              <div className="spice-grid">
                <div
                  className={`spice-card ${spiceLevel === 'Mild' ? 'active' : ''}`}
                  onClick={() => setSpiceLevel('Mild')}
                >
                  <div className="card-top">
                    <strong className="spice-name">Mild</strong>
                    <span className="spice-num">1/3</span>
                  </div>
                  <p className="spice-desc">Alicha touch, fragrant cardamoms</p>
                </div>

                <div
                  className={`spice-card ${spiceLevel === 'Traditional' ? 'active' : ''}`}
                  onClick={() => setSpiceLevel('Traditional')}
                >
                  <div className="card-top">
                    <strong className="spice-name">Traditional</strong>
                    <span className="spice-num">2/3</span>
                  </div>
                  <p className="spice-desc">Berbere warmth (Recommended)</p>
                </div>

                <div
                  className={`spice-card ${spiceLevel === 'Fiery Awaze' ? 'active' : ''}`}
                  onClick={() => setSpiceLevel('Fiery Awaze')}
                >
                  <div className="card-top">
                    <strong className="spice-name">Fiery Awaze</strong>
                    <span className="spice-num red">3/3</span>
                  </div>
                  <p className="spice-desc">Served with Awaze &amp; Mitmita dip</p>
                </div>
              </div>
            </div>

            {/* Section 2: Traditional Injera Base */}
            <div className="custom-section">
              <div className="section-header">
                <label>2. Traditional Injera Base 🫓</label>
                <span className="meta-tag">Choose 1</span>
              </div>

              <div className="injera-list">
                <div
                  className={`injera-card ${injeraBase === 'Standard' ? 'active' : ''}`}
                  onClick={() => setInjeraBase('Standard')}
                >
                  <div className="injera-info">
                    <strong>Standard Teff &amp; Barley Blend</strong>
                    <p>Spongy, tart sourdough, naturally soft (Traditional)</p>
                  </div>
                  <span className="injera-price">Included</span>
                </div>

                <div
                  className={`injera-card ${injeraBase === 'Organic Teff' ? 'active' : ''}`}
                  onClick={() => setInjeraBase('Organic Teff')}
                >
                  <div className="injera-info">
                    <strong>100% Pure Organic Brown Teff</strong>
                    <p>Naturally 100% Gluten-Free, iron-rich nutty grain</p>
                  </div>
                  <span className="injera-price">+ETB 60</span>
                </div>
              </div>
            </div>

            {/* Section 3: Complimentary Side Accents */}
            <div className="custom-section">
              <div className="section-header">
                <div>
                  <label>3. Complimentary Side Accents</label>
                  <p className="sub-label">Select up to 2 artisanal palate companions</p>
                </div>
                <span className="meta-badge-count">{selectedAccents.length}/2 selected</span>
              </div>

              <div className="accent-grid">
                {[
                  { id: 'Fresh Ayib', title: 'Fresh Ayib', desc: 'Mild fresh cottage curd', price: 'Free' },
                  { id: 'Stewed Gomen', title: 'Stewed Gomen', desc: 'Garlic infused collard greens', price: 'Free' },
                  { id: 'House Awaze Paste', title: 'House Awaze Paste', desc: 'Aged tej and berbere sauce', price: 'Free' },
                  { id: 'Extra Braised Egg', title: 'Extra Braised Egg', desc: 'Slow cooked in the wat broth', price: '+ETB 40' }
                ].map((item) => {
                  const isSelected = selectedAccents.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`accent-checkbox-card ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleAccent(item.id)}
                    >
                      <div className={`checkbox-box ${isSelected ? 'checked' : ''}`} />
                      <div className="accent-text">
                        <strong>{item.title}</strong>
                        <p>{item.desc}</p>
                      </div>
                      <span className="accent-price">{item.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add to Order Controls */}
            <div className="cart-action-row">
              <div className="quantity-stepper">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button className="btn-primary-order">
                🛍️ Add to Order • ETB {dishData.price * quantity}
              </button>
            </div>

            {/* Secondary Link Actions */}
            <div className="secondary-actions-row">
              <button className="btn-link">♡ Save to Favorites</button>
              <button className="btn-link brown-link">🏺 Order as Group Mesob Feast</button>
            </div>

          </div>
        </div>

        {/* Gursha Pairings Section */}
        <div className="cross-sell-section">
          <span className="section-tag">GURSHA PAIRINGS</span>
          <h3>Pairs Wonderfully With {dishData.title}</h3>

          <div className="cross-sell-grid">
            {dishData.crossSells.map((item) => (
              <div key={item.id} className="cross-sell-card">
                <div className="card-image-wrap">
                  <span className={`card-badge ${item.badgeClass}`}>{item.badge}</span>
                  <img src={getImageUrl(item.image)} alt={item.name} />
                </div>

                <div className="card-info">
                  <div className="card-header-row">
                    <h4>{item.name}</h4>
                    <span className="card-price">ETB {item.price}</span>
                  </div>
                  <p className="card-desc">{item.description}</p>
                </div>

                <div className="card-footer-row">
                  <span className="card-subtext">{item.volume}</span>
                  <button className="btn-add-sm">+ Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spirit of Gursha Banner */}
        <div className="gursha-banner">
          <div className="gursha-banner-content">
            <span className="gursha-icon">🏺</span>
            <div>
              <h4>The Spirit of Gursha</h4>
              <p>Sharing a bite directly into a companion's mouth is an act of deep hospitality and bond. Ask your server for communal Mesob presentation.</p>
            </div>
          </div>
          <button className="btn-explore-feast">Explore Full Feast Menu</button>
        </div>

      </div>
      {/* Sticky Bottom Mobile Navigation Bar */}
<div className="mobile-bottom-bar">
  <button className="mobile-nav-btn active">
    <span className="icon">🏠</span>
    <span className="label">Home</span>
  </button>
  <button className="mobile-nav-btn">
    <span className="icon">🍽️</span>
    <span className="label">Menu</span>
  </button>
  <button className="mobile-nav-btn">
    <span className="icon">🛒</span>
    <span className="label">Cart</span>
  </button>
  <button className="mobile-nav-btn">
    <span className="icon">👤</span>
    <span className="label">Account</span>
  </button>
</div>
    </div>
  );
}