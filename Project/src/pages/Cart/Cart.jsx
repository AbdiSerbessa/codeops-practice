import { useState } from 'react';
import { Link, useNavigate,NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Stepper } from '../Checkout/Checkout';
import './Cart.css';



const getDishImage = (slug) => {
  try {
    return new URL(`../../assets/images/${slug}.jpg`, import.meta.url).href;
  } catch {
    return 'https://via.placeholder.com/100?text=Gursha+Dish';
  }
};

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, handleQuantityChange, handleRemoveItem, handleClearBasket } = useCart();
// State for error feedback
  const [errorMessage, setErrorMessage] = useState('');

  // Click Handler for Checkout Button
  const handleProceedToCheckout = () => {
    setErrorMessage('');

    if (!cartItems || cartItems.length === 0) {
      setErrorMessage('Your Gursha basket is empty! Please add dishes from our menu before proceeding.');
      return;
    }

    navigate('/checkout');
  };

  
  const [includeHandwash, setIncludeHandwash] = useState(true);
  const [noCutlery, setNoCutlery] = useState(false);
  const [kitchenNote, setKitchenNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Subtotal Calculations
  const itemsSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const teffUpgradeFee = cartItems.length > 0 ? 60 : 0;
  const clayPakFee = cartItems.length > 0 ? 40 : 0;
  const vatAndTax = Math.round(itemsSubtotal * 0.15);
  const grandTotal = Math.max(0, itemsSubtotal + teffUpgradeFee + clayPakFee + vatAndTax - (cartItems.length > 0 ? discount : 0));

  return (
    <div className="cart-page">
      
      <div className="announce-ribbon">
        <p>🚚 <strong>Free Highland Delivery:</strong> Complimentary delivery across Bole, Hawassa, and Sarbet on orders over ETB 1,200.</p>
        <span className="threshold-tag">✓ THRESHOLD UNLOCKED</span>
      </div>
      <div style={{ marginTop: '24px', marginBottom: '32px' }}>
    <Stepper />
  </div>

      <main className="cart-container">
        <section className="left-column">
          <div className="section-heading-with-count">
            <div className="heading-title-group">
              <span className="sub-tag">COMMUNAL FEASTING</span>
              <h2>Your Gursha Basket</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    <NavLink
      to="/cart"
      style={({ isActive }) => ({
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        textDecoration: 'none',
        backgroundColor: isActive ? '#8B261D' : '#EFECE6',
        color: isActive ? '#FFFFFF' : '#666666',
      })}
    >
      1 Review Basket
    </NavLink>

    <NavLink
      to="/checkout"
      style={({ isActive }) => ({
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        textDecoration: 'none',
        backgroundColor: isActive ? '#8B261D' : '#EFECE6',
        color: isActive ? '#FFFFFF' : '#666666',
      })}
    >
      2 Delivery Details
    </NavLink>

    <NavLink
      to="/confirmation"
      style={({ isActive }) => ({
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600',
        textDecoration: 'none',
        backgroundColor: isActive ? '#8B261D' : '#EFECE6',
        color: isActive ? '#FFFFFF' : '#666666',
      })}
    >
      3 Confirmation
    </NavLink>
  </div>
          </div>

          <div className="basket-header-bar">
            <span>Clay Pot Stews & Provisions <em>({cartItems.length} handcrafted selections)</em></span>
            {cartItems.length > 0 && (
              <button className="clear-btn" onClick={handleClearBasket}>🗑 Clear Basket</button>
            )}
          </div>

          <div className="items-stack">
            {cartItems.length === 0 ? (
              <div className="empty-cart-msg">
                <p>Your Gursha basket is empty.</p>
                <Link to="/menu" className="browse-btn">Explore Menu</Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img 
                    src={getDishImage(item.slug)} 
                    alt={item.title} 
                    className="item-thumbnail" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Gursha+Dish'; }}
                  />
                  
                  <div className="item-details">
                    <span className="item-tagline">{item.tagline}</span>
                    <h3 className="item-title">{item.title} {item.nameAm && <small>({item.nameAm})</small>}</h3>
                    <p className="item-desc">{item.description}</p>
                  </div>

                  <div className="item-pricing-action">
                    <span className="item-price">ETB {item.price}</span>

                    <div className="quantity-and-remove">
                      <div className="quantity-controls">
                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                      </div>

                      <button
                        className="delete-item-btn"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove selection"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="habesha-preferences">
            <h4>🤝 Gursha Hospitality & Dining Etiquette</h4>
            <div className="preference-checkboxes">
              <label className="checkbox-card">
                <input type="checkbox" checked={includeHandwash} onChange={(e) => setIncludeHandwash(e.target.checked)} />
                <div>
                  <strong>Include Traditional Handwash Basin</strong>
                  <p>Warm rosewater and water pitcher brought prior to service presentation.</p>
                </div>
              </label>

              <label className="checkbox-card">
                <input type="checkbox" checked={noCutlery} onChange={(e) => setNoCutlery(e.target.checked)} />
                <div>
                  <strong>No Cutlery Needed (True Gursha)</strong>
                  <p>We embrace the communal joy of eating with fresh injera only.</p>
                </div>
              </label>
            </div>

            <div className="kitchen-note-box">
              <label>Kitchen Chef Note / Injera Separation Preference <span>Optional</span></label>
              <input
                type="text"
                placeholder="E.g. Please wrap extra Teff rolls in net-retaining food foil separately from the Doro Wat pot..."
                value={kitchenNote}
                onChange={(e) => setKitchenNote(e.target.value)}
              />
            </div>
          </div>
        </section>

        <aside className="right-column">
          <div className="basket-ledger">
            <h3>Basket Ledger</h3>

            <div className="ledger-rows">
              <div className="ledger-row">
                <span>Items Subtotal ({cartItems.length} Items)</span>
                <strong>ETB {itemsSubtotal}</strong>
              </div>
              <div className="ledger-row">
                <span>100% Teff Injera Upgrades ({cartItems.length})</span>
                <span>ETB {teffUpgradeFee}</span>
              </div>
              <div className="ledger-row">
                <span>Insulated Traditional Clay-Pak</span>
                <span>ETB {clayPakFee}</span>
              </div>
              <div className="ledger-row highlight-green">
                <span>Delivery Fee (Bole Zone)</span>
                <span>FREE</span>
              </div>
              <div className="ledger-row">
                <span>City VAT & Tourism Levy (15%)</span>
                <span>ETB {vatAndTax}</span>
              </div>
              
              {discount > 0 && cartItems.length > 0 && (
                <div className="ledger-row discount-row">
                  <span>Discount Applied</span>
                  <span className="discount-amount">-ETB {discount}</span>
                </div>
              )}
            </div>

            <div className="coupon-box">
              <input
                type="text"
                placeholder="Have coupon code?"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={() => setDiscount(200)}>Apply</button>
            </div>

            <div className="ledger-total">
              <span>GRAND TOTAL</span>
              <h2>ETB {grandTotal}</h2>
            </div>

            {errorMessage && (
  <div className="cart-error-banner">
    ⚠️ {errorMessage}
  </div>
)}

<button
  type="button"
  className="checkout-btn"
  onClick={handleProceedToCheckout}
>
  Proceed to Delivery Checkout ➔
</button>

            <Link to="/menu" className="more-dishes-link">
              + Add more dishes from our Menu
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}