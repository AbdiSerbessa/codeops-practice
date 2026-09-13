import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';
import menuResponse from '../../data/menu.json';

// Get items array safely from the JSON response object
const menuItems = menuResponse.data || [];

// Extract unique categories dynamically
const CATEGORIES = [
  'All Dishes',
  ...new Set(menuItems.map((item) => item.category)),
];

export default function Menu() {
  const navigate = useNavigate();  
  const [activeCategory, setActiveCategory] = useState('All Dishes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Filter menu items by category and search term
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'All Dishes' || item.category === activeCategory;
    const matchesSearch =
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nameAm && item.nameAm.includes(searchQuery)) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-page">
      <div className="container">
        {/* --- Header Section --- */}
        <header className="menu-header-card">
          <span className="section-eyebrow">HANDCRAFTED SPICES & AGED SPICES</span>
          <h1 className="menu-title">Our Complete Culinary Heritage</h1>
          <p className="menu-subtitle">
            Every dish is crafted daily from scratch using sun-dried spices, stone-ground legume flours,
            and clarified herbal butter sourced directly from highland farm cooperatives.
          </p>
        </header>

        {/* --- Search & Dietary Bar --- */}
        <div className="search-dietary-container">
          <div className="search-input-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search dishes by name (e.g. Kitfo, Shiro, Tibs, Doro Wat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search-input"
            />
          </div>
          <div className="dietary-pills-wrapper">
            <button className="dietary-pill-btn">🌾 100% Pure Teff Injera</button>
            <button className="dietary-pill-btn">🌿 Fasting / Tsom Friendly</button>
            <button className="dietary-pill-btn">🌶️ Berbere Spiced</button>
          </div>
        </div>

        {/* --- Category Filter Pills --- */}
        <div className="category-filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- Food Menu Grid --- */}
        <div className="food-menu-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="food-card">
              <div className="food-image-wrapper">
                <img
  src={new URL(`../../assets/images/${item.slug}.jpg`, import.meta.url).href}
  alt={item.nameEn}
  className="food-image"
  onError={(e) => {
    e.target.src = 'https://placehold.co/400x250?text=Habesha+Dish';
  }}
/>
                {item.isSpecial && (
                  <span className="food-tag amber">CHEF SPECIAL</span>
                )}
                {item.isFasting && !item.isSpecial && (
                  <span className="food-tag green">TSOM / VEGAN</span>
                )}
              </div>

              <div className="food-card-body">
                <div className="food-card-title-row">
                  <h3 className="food-card-title">{item.nameEn}</h3>
                  {item.nameAm && (
                    <span className="food-card-amharic">{item.nameAm}</span>
                  )}
                </div>

                <p className="food-card-desc">{item.description}</p>

                {item.spiceLevel && (
                  <span className="food-spice-level">🌶️ {item.spiceLevel}</span>
                )}

                <div className="food-card-footer">
                  <span className="food-price">ETB {item.priceETB}</span>
                  <button
                    className="btn-add-item"
                    onClick={() => {
                      setSelectedCount((prev) => prev + 1);
                      setTotalPrice((prev) => prev + item.priceETB);
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

         {/* Communal Dining Banner  */}
        
        <div className="communal-banner">
    <div className="communal-banner-content">
      <div className="communal-icon-box">
        <span>🍽️</span>
      </div>
      <div className="communal-text">
        <h4>Experience Communal Dining Around the Mesob</h4>
        <p>All platters served with unlimited warm Teff Injera rolls and fresh house-made Ayib.</p>
      </div>
    </div>
    <button className="btn-reserve-mesob">
      Reserve a Group Mesob Table
    </button>
  </div>
      </div>
      

      {/* --- Sticky Bottom Tray --- */}
      {selectedCount > 0 && (
        <div className="sticky-order-tray">
          <div className="tray-container container">
            <div className="tray-info">
              <span className="tray-badge">Selected: {selectedCount} items</span>
              <span className="tray-total">ETB {totalPrice.toLocaleString()}</span>
            </div>
            <button 
              className="btn-proceed-cart"
              onClick={() => navigate('/cart')}
            >
              Proceed to Cart →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}