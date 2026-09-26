import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import NotFound from '../NotFound/NotFound'; // ✅ Fixed: Imported NotFound component
import menuResponse from '../../data/menu.json';
import specialsData from '../../data/specials.json';
import './DishDetail.css';

const menuItems = Array.isArray(menuResponse) 
  ? menuResponse 
  : (menuResponse?.menu || menuResponse?.dishes || Object.values(menuResponse || {}).find(Array.isArray) || []);

const specialsItems = Array.isArray(specialsData) ? specialsData : (specialsData?.specials || []);

const allDishes = [...menuItems, ...specialsItems];

const PAIRING_ITEMS = [
  {
    id: 'tej-1',
    nameEn: 'House Traditional Tej',
    priceETB: 350,
    tag: 'Signature Sip',
    tagClass: 'amber',
    desc: 'Pure golden fermented highland honey wine infused with gesho leaves.',
    subtext: '500ml Flask (12% ABV)',
    image: 'https://placehold.co/400x250/e0a020/ffffff?text=Traditional+Tej',
  },
  {
    id: 'timatim-1',
    nameEn: 'Fresh Timatim Fitfit',
    priceETB: 180,
    tag: 'Vegan / Tsom',
    tagClass: 'green',
    desc: 'Crisp ripe heirloom tomatoes, minced red shallots, and sliced green peppers.',
    subtext: 'Palate Cleanser',
    image: 'https://placehold.co/400x250/2e8b57/ffffff?text=Timatim+Fitfit',
  },
  {
    id: 'coffee-1',
    nameEn: 'Jebena Spiced Coffee',
    priceETB: 70,
    tag: 'Fresh Roast',
    tagClass: 'blue',
    desc: 'Addis-style freshly pan-roasted Yirgacheffe arabica beans boiled in clay Jebena.',
    subtext: 'Ceremonial Cup',
    image: 'https://placehold.co/400x250/8b4513/ffffff?text=Jebena+Coffee',
  },
];

export default function DishDetail() {
  // 1. ALL HOOKS FIRST
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [addedItemId, setAddedItemId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('Mild');
  const [injeraBase, setInjeraBase] = useState('Standard');
  const [selectedAccents, setSelectedAccents] = useState(['Fresh Ayib']);
  const [quantity, setQuantity] = useState(1);

  // 2. DATA LOOKUP ACROSS ALL DATASETS
  const searchKey = (slug || id || '').toLowerCase().trim();

const dish = allDishes.find((item) => {
    const itemSlug = (item.slug || '').toLowerCase();
    const itemId = (item.id || '').toLowerCase();
    const itemName = (item.nameEn || '').toLowerCase().replace(/\s+/g, '-');
    
    return (
      itemSlug === searchKey || 
      itemId === searchKey || 
      itemName === searchKey ||
      itemSlug.includes(searchKey) ||
      searchKey.includes(itemSlug)
    );
  });

  console.log("Searching for:", searchKey, "Found dish:", dish);

  // 3. Safe early return AFTER all hooks have executed
  if (!dish) {
    return <NotFound />;
  }

  const extraInjeraPrice = injeraBase === '100% Pure Teff' ? 60 : 0;
  const basePrice = dish.priceETB || dish.price || 0;
  const unitPrice = basePrice + extraInjeraPrice;

  const toggleAccent = (accentName) => {
    setSelectedAccents((prev) =>
      prev.includes(accentName)
        ? prev.filter((a) => a !== accentName)
        : [...prev, accentName]
    );
  };

  const handleAddMainDish = () => {
    // 1. Add item to global cart context
    addToCart({
      id: `${dish.id}-${spiceLevel}-${injeraBase}-${selectedAccents.sort().join('-')}`,
      nameEn: dish.nameEn,
      nameAm: dish.nameAm || '',
      price: unitPrice,
      quantity: quantity,
      slug: dish.slug,
      description: `Spice: ${spiceLevel} | Base: ${injeraBase} | Sides: ${selectedAccents.join(', ') || 'None'}`,
    });

    // 2. Trigger Pop-up Toast Message
    setToastMsg(`Added ${quantity}x ${dish.nameEn} to your Gursha Basket!`);
    setShowToast(true);

    // 3. Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // ✅ Safe image fallback handling for Vite
  let dishImage = 'https://placehold.co/500x350?text=Habesha+Dish';
  try {
    if (dish?.slug) {
      dishImage = new URL(`../../assets/images/${dish.slug}.jpg`, import.meta.url).href;
    }
  } catch (err) {
    console.warn(`Local image not found for slug: ${dish?.slug}, using fallback placeholder.`);
  }

  const handleAddPairing = (e, item) => {
    e.stopPropagation();

    if (addToCart) {
      addToCart({
        id: item.id,
        nameEn: item.nameEn,
        price: item.priceETB,
        quantity: 1,
        description: item.desc || item.subtext,
      });
    }

    // Trigger visual feedback on button
    setAddedItemId(item.id);

    // Reset button back to "+ Add" after 1.5 seconds
    setTimeout(() => {
      setAddedItemId(null);
    }, 1500);
  };

  return (
    <div className="dish-detail-page">
      {/* Pop-up Notification Toast */}
      {showToast && (
        <div className="toast-popup">
          <div className="toast-content">
            <span className="toast-icon">✅</span>
            <span className="toast-message">{toastMsg}</span>
            <button className="toast-action" onClick={() => navigate('/cart')}>
              View Cart &rarr;
            </button>
          </div>
        </div>
      )}

      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <Link to="/menu">Menu</Link> &gt; <span>{dish.nameEn}</span>
        </div>

        <div className="dish-showcase-grid">
          {/* Left Column - Image */}
          <div className="dish-image-section">
            {dish.isSpecial && <span className="badge badge-primary">CHEF SPECIAL</span>}
            {dish.isFasting && <span className="badge badge-secondary">TSOM / VEGAN</span>}
            <img
              src={dishImage}
              alt={dish.nameEn}
              className="dish-main-image"
              onError={(e) => {
                e.target.src = 'https://placehold.co/500x350?text=Habesha+Dish';
              }}
            />
          </div>

          {/* Right Column - Product Information & Customization */}
          <div className="dish-info-section">
            <div className="dish-header-row">
              <h1 className="dish-title">
                {dish.nameEn} {dish.nameAm && <span className="amharic-text">({dish.nameAm})</span>}
              </h1>
              <div className="price-badge">
                <span className="currency">ETB </span>
                <span className="amount">{basePrice}</span>
              </div>
            </div>

            <p className="dish-description">{dish.description}</p>

            {/* Customization 1: Spice Level */}
            <div className="custom-section">
              <label className="section-label">1. Heat &amp; Spice Level 🔥</label>
              <div className="option-grid">
                {['Mild', 'Traditional', 'Fiery Awaze'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`option-card ${spiceLevel === level ? 'active' : ''}`}
                    onClick={() => setSpiceLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Customization 2: Injera Base */}
            <div className="custom-section">
              <label className="section-label">2. Injera Base Preference 🌾</label>
              <div className="option-grid">
                {[
                  { label: 'Standard Mixed', value: 'Standard' },
                  { label: '100% Pure Teff (+60 ETB)', value: '100% Pure Teff' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`option-card ${injeraBase === option.value ? 'active' : ''}`}
                    onClick={() => setInjeraBase(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Customization 3: Complimentary Sides */}
            <div className="custom-section">
              <label className="section-label">3. Complimentary Sides 🧀</label>
              <div className="option-grid">
                {['Fresh Ayib', 'House Mitmita', 'Gomen Sides'].map((accent) => (
                  <button
                    key={accent}
                    type="button"
                    className={`option-card ${selectedAccents.includes(accent) ? 'active' : ''}`}
                    onClick={() => toggleAccent(accent)}
                  >
                    {accent}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper and Add to Basket Button */}
            <div className="cart-action-row">
              <div className="quantity-stepper">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button type="button" className="btn-primary-order" onClick={handleAddMainDish}>
                🛍️ Add to Order • ETB {(unitPrice * quantity).toLocaleString()}
              </button>
            </div>

          </div>
        </div>

        {/* --- Cross-Sell Section --- */}
        <section className="pairs-with-section">
          <div className="pairs-header-row">
            <div>
              <span className="pairs-eyebrow">GURSHA PAIRINGS</span>
              <h2 className="pairs-title">
                Pairs Wonderfully With {dish?.nameEn || 'This Dish'}
              </h2>
            </div>
            <p className="pairs-subtitle">
              Harmonize rich, spicy berbere with the cooling sweetness of golden honey wine, refreshing salads, and ceremonial Jebena buna.
            </p>
          </div>

          <div className="pairs-cards-grid">
            {PAIRING_ITEMS.map((item) => {
              const isAdded = addedItemId === item.id;

              return (
                <div key={item.id} className="pair-card">
                  <div className="pair-card-img-wrapper">
                    <span className={`pair-badge ${item.tagClass}`}>{item.tag}</span>
                    <img src={item.image} alt={item.nameEn} className="pair-card-img" />
                  </div>

                  <div className="pair-card-body">
                    <div className="pair-card-title-row">
                      <h3 className="pair-card-title">{item.nameEn}</h3>
                      <span className="pair-card-price">ETB {item.priceETB}</span>
                    </div>

                    <p className="pair-card-desc">{item.desc}</p>

                    <div className="pair-card-footer">
                      <span className="pair-card-subtext">{item.subtext}</span>
                      <button 
                        type="button" 
                        className={`btn-add-mini ${isAdded ? 'added' : ''}`}
                        onClick={(e) => handleAddPairing(e, item)}
                        disabled={isAdded}
                      >
                        {isAdded ? '✓ Added to Order' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner */}
          <div className="gursha-banner">
            <div className="gursha-banner-left">
              <div className="gursha-icon-badge">🤲</div>
              <div>
                <h4 className="gursha-title">The Spirit of Gursha</h4>
                <p className="gursha-text">
                  Sharing a bite directly into a companion's mouth is an act of deep hospitality and bond. Ask your server for communal Mesob presentation.
                </p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-explore-menu"
              onClick={() => navigate('/menu')}
            >
              Explore Full Feast Menu
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}