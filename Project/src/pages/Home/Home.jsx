import './Home.css';
import specialsData from '../../data/specials.json';
import { useRef,useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';


export default function Home() {
  const navigate = useNavigate();
  const specialsRef = useRef(null);
  const [addedMessage, setAddedMessage] = useState(null);
 
  const [activeTab, setActiveTab] = useState('chef');
  const addToCart = useCartStore((state) => state.addToCart);
  const handleAddToCart = (item) => {
  const price = Number(item.priceETB || item.price || item.unitPrice || 0);
  const name = item.nameEn || item.name || item.title || 'Special Item';
  
  addToCart({
    id: item.id || item.slug || `item-${Date.now()}`,
    nameEn: name,
    name: name,
    title: name,
    priceETB: price,
    price: price,
    unitPrice: price,
    image: item.image || '/assets/images/default.jpg',
    quantity: 1
  });
  
  setAddedMessage(`Added "${name}" to your table!`);
  setTimeout(() => setAddedMessage(null), 3000);
};
  return (
    
    
    <div className="home-page">
      {addedMessage && (
  <div className="cart-toast-banner" style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    background: '#1a1a1a',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    animation: 'fadeIn 0.3s ease'
  }}>
    ✓ {addedMessage}
  </div>
)}
      {/* 1. Fasting Observance Banner */}
      <div className="fasting-banner">
        <span>🥦 Tsom / Fasting Observance: 12-item Royal Beyaynetu Vegan Platter simmered fresh all day.</span>
        <a href='/menu' className="banner-link">100% Pure Teff Injera Available • See Fasting Specialties →</a>
      </div>

      {/* 2. Hero Section */}
      <section className="hero-section">
        
        <div className="hero-container">
          
          <div className="hero-text-content">
            <span className="section-badge">||||| ||||| TRADITIONAL HABESHA HEARTH</span>
            <h1 className="hero-title">
              Communal Warmth,<br />
              <span className="italic-title">Slow-Cooked Heritage.</span>
            </h1>
            <p className="hero-description">
              Handcrafted wats, ancient stone-ground teff injera, and velvety kitfo 
              simmered in 72-hour infused niter kibbeh and heirloom berbere 
              harvested from the Ethiopian highlands.
            </p>
<div className="hero-actions">
  
  <button 
  type="button" 
  className="btn-primary"
  onClick={() => {
    specialsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }}
>
  Explore Today's Specials ↓
</button>
  
  <Link to="/menu" className="btn-secondary">
    Full Banquet Menu
  </Link>
              <span className="hero-note">☕ Buna Ceremony 4:00 PM Daily</span>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <strong>100%</strong>
                <span>Brown & White Teff</span>
              </div>
              <div className="stat-item">
                <strong>6+ Hours</strong>
                <span>Slow Stew Caramels</span>
              </div>
              <div className="stat-item">
                <strong>Gursha</strong>
                <span>Hospitality Shared</span>
              </div>
            </div>
          </div>
<Link to="/dish/great-mesob-feast" style={{ textDecoration: 'none', display: 'block' }}>

<div className="hero-image-card">
            <div className="image-wrapper">
              <img src={new URL('../../assets/images/doro-wat.jpg', import.meta.url).href} alt="Great Mesob Feast" />
              <div className="floating-badge">
                <span>🌾 Stone Ground</span>
                <small>Fresh Berbere Pepper</small>
              </div>
            </div>
            <div className="hero-card-footer">
              <div>
                <span className="card-subtitle">CENTERPIECE</span>
                <h3 className="card-title">Great Mesob Feast</h3>
              </div>
              <span className="card-price">ETB 1000</span>
            </div>
          </div>
          
          </Link>
          
        </div>
      </section>

      {/* 3. Today's Curated Chef Specials */}
      <section ref={specialsRef} className="specials-section">
        <div className="specials-header">
          <div className="header-text">
            <span className="section-subtitle">FROM THE CLAY POTS</span>
            <h2 className="section-title">Today's Curated Chef Specials</h2>
            <p className="section-desc">
              Carefully balanced stews prepared at dawn using our matriarch's 40-spice blend, served piping hot on hand-stretched injera.
            </p>
          </div>

          <div className="filter-tabs">
  <button 
    type="button" 
    className={`tab-btn ${activeTab === 'chef' ? 'active' : ''}`}
    onClick={() => setActiveTab('chef')}
  >
    Chef's Special Today
  </button>
  <button 
    type="button" 
    className={`tab-btn ${activeTab === 'tibs' ? 'active' : ''}`}
    onClick={() => setActiveTab('tibs')}
  >
    Tibs & Grills
  </button>
  <button 
    type="button" 
    className={`tab-btn ${activeTab === 'fasting' ? 'active' : ''}`}
    onClick={() => setActiveTab('fasting')}
  >
    Fasting / Tsom
  </button>
</div>

        </div>

        {/* Dynamic Card Grid Mapping */}
        <div className="specials-grid">
          {specialsData
  .filter((item) => {
    const cat = (item.category || '').toLowerCase();
    if (activeTab === 'chef') return cat.includes('traditional') || cat.includes('raw') || item.isSpecial;
    if (activeTab === 'tibs') return cat.includes('tibs') || cat.includes('grills');
    if (activeTab === 'fasting') return cat.includes('fasting') || cat.includes('vegan') || cat.includes('tsom') || item.isFasting;
    return true;
  })
  .map((item) => (
    <div key={item.id} className="special-card">
      <div 
        className="card-image-wrap" 
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(`/dish/${item.slug || item.id}`)}
      >
        <img src={new URL(`../../assets/images/${item.slug}.jpg`, import.meta.url).href} alt={item.nameEn} />
        {item.isFasting ? (
          <span className="badge-tag green">Fasting / Tsom</span>
        ) : (
          <span className="badge-tag">House Special</span>
        )}
      </div>

      <div className="card-body">
        <div 
          className="card-title-row" 
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/dish/${item.slug || item.id}`)}
        >
          <h3>{item.nameEn}</h3>
          <span className="amharic-title">{item.nameAm}</span>
        </div>

        <p>{item.description}</p>

        <div className="card-meta">
          <span className="spice-tag">🌶️ {item.spiceLevel}</span>
          <span className="servings-tag">👥 {item.servings}</span>
        </div>

        <div className="card-action">
          <span className="price">ETB {item.priceETB.toLocaleString()}</span>
          <button 
            className="add-btn"
            onClick={() => handleAddToCart(item)}
          >
            + Add to Table
          </button>
        </div>
      </div>
    </div>
  ))}
        </div>
      </section>
     {/* --- 4. GURSHA & BEVERAGE SECTION --- */}
<section className="gursha-section">
  <div className="container gursha-grid">
    {/* Left Column */}
    <div className="gursha-content">
      <span className="section-subtitle">THE SPIRIT OF GURSHA</span>
      <h2 className="quote-title">“Those Who Share a Mesob Never Walk Alone.”</h2>
      <p className="quote-desc">
        Gursha is the cherished act of honoring a companion by rolling choice morsels of wat within warm injera and feeding them directly by hand. At Mesob House, every table is configured for communal warmth and slow gratitude.
      </p>
      <div className="jebena-box">
        <h4>Authentic Clay Jebena Buna Ceremony</h4>
        <p>Every day at 4:00 PM, frankincense fills our courtyard as green Sidama beans are hand-roasted on iron pans, ground fresh, and brewed in traditional clay Jebenas with popped sorghum snack (Fendisha).</p>
        <a href="#reserve-buna" className="jebena-link">Reserve Ceremony Seating ↗</a>
      </div>
    </div>

    {/* Right Column */}
    <div className="beverage-highlights">
      <div className="bev-cards-row">
        {/* Golden Tej */}
        <div className="bev-card">
          <div className="bev-card-header">
            <span className="bev-tag yellow-tag">HOUSE-FERMENTED</span>
            <span className="bev-price">ETB 380</span>
          </div>
          <h3>Golden Tej (Honey Wine)</h3>
          <p>Crafted in-house using raw Ethiopian wild honey and dried Gesho (indigenous hops), cold-aged for 21 days in glass carafes (Berele).</p>
          <div className="bev-card-footer">
            <span className="bev-meta">500ml Carafe • 11% ABV</span>
            <button 
  type="button" 
  className="btn-add-sm"
onClick={() => handleAddToCart({
  id: 'tej-1',
  nameEn: 'Golden Tej (Honey Wine)',
  priceETB: 380,
  image: '/assets/images/house-tej-carafe.jpg'
})}
>
  + Add Carafe
</button>
          </div>
        </div>

        {/* Highland Spiced Shai */}
        <div className="bev-card">
          <div className="bev-card-header">
            <span className="bev-tag green-tag">DAILY INFUSION</span>
            <span className="bev-price">ETB 100</span>
          </div>
          <h3>Highland Spiced Shai</h3>
          <p>Slow-simmered highland black tea leaves infused with crushed cinnamon bark, fragrant cardamom pods, cloves, and a hint of wild ginger.</p>
          <div className="bev-card-footer">
            <span className="bev-meta">Served with Raw Sugar</span>
            <button 
  type="button" 
  className="btn-add-sm"
 onClick={() => handleAddToCart({
  id: 'coffee-1',
  nameEn: 'Highland Spiced Shai',
  priceETB: 100,
  image: '/assets/images/shai.jpg'
})}
>
  + Add Cup
</button>
          </div>
        </div>
      </div>

      {/* Extra Teff Injera Full Banner */}
      <div className="injera-banner">
        <div className="injera-info">
          <h4>Extra Teff Injera Rolls (Basket of 3)</h4>
          <p>Naturally gluten-friendly ancient grain, fermented 3 days for airy eyes (Ayn).</p>
        </div>
        <div className="injera-action">
          <span className="bev-price">ETB 100</span>
          <button 
  type="button" 
  className="btn-add-dark"
 onClick={() => handleAddToCart({
  id: 'injera-extra-3',
  nameEn: 'Extra Teff Injera Rolls (Basket of 3)',
  priceETB: 100,
  image: '/assets/images/injera.jpg'
})}
>
  + Add Extra
</button>
        </div>
      </div>
    </div>
  </div>
</section>

{/* --- 5. TESTIMONIALS SECTION --- */}
<section className="testimonials-section">
  <div className="container text-center">
    <span className="section-subtitle">VOICES AROUND THE MESOB</span>
    <h2 className="section-title">Honored Guest Reflections</h2>
    
    <div className="testimonials-grid">
      <div className="testimonial-card">
        <div className="stars">★★★★★</div>
        <p>“The Doro Wat was so reminiscent of my grandmother’s cooking in Gondar. The berbere depth and the slow-simmered onion sweet finish are impossible to find elsewhere.”</p>
        <div className="author-info">
          <div className="author-avatar">AM</div>
          <div>
            <h4>Nohi Tesfaye</h4>
            <span>Bole Resident & Food Patron</span>
          </div>
        </div>
      </div>

      <div className="testimonial-card">
        <div className="stars">★★★★★</div>
        <p>“Their Fasting Beyaynetu is unmatched on Wednesdays. 12 vibrant dishes, and the Shiro tagamino came out bubbling in clay. True culinary devotion.”</p>
        <div className="author-info">
          <div className="author-avatar">ST</div>
          <div>
            <h4>Jara Tesfaye</h4>
            <span>Plant-Based Dining Advocate</span>
          </div>
        </div>
      </div>

      <div className="testimonial-card">
        <div className="stars">★★★★★</div>
        <p>“We hosted a 10-person family reunion around their large handcrafted mesobs. The coffee ceremony with fresh frankincense made the evening unforgettable.”</p>
        <div className="author-info">
          <div className="author-avatar">DK</div>
          <div>
            <h4>Kebede Wolde</h4>
            <span>Diaspora Homecoming Guest</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* --- 6. CTA BANNER --- */}
<section className="cta-section">
  <div className="container">
    <div className="cta-banner">
      <div className="cta-content">
        <span className="cta-tag">JOIN OUR TABLE</span>
        <h2>Experience Authentic Habesha Warmth Tonight</h2>
        <p>Whether gathering around our circular mesobs for communal dining or ordering freshly baked injera to your home in Addis Ababa.</p>
      </div>
      <div className="cta-buttons">
  <Link to="/menu" className="btn-cta-cream">Book a Mesob Table</Link>
  <Link to="/menu" className="btn-cta-outline">View Complete Menu</Link>
</div>
    </div>
  </div>
</section>

      
    </div>
    
  );
}