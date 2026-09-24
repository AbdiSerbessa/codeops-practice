import { useState } from 'react';
import { Link, useNavigate,useLocation} from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import './Checkout.css';


// 1. REUSABLE DYNAMIC STEPPER COMPONENT
export function Stepper() {
  const location = useLocation();
  const currentPath = location.pathname;

  const steps = [
    { number: 1, label: 'STEP 1', title: 'Review Order', path: '/cart' },
    { number: 2, label: 'STEP 2', title: 'Delivery & Payment', path: '/checkout' },
    { number: 3, label: 'STEP 3', title: 'Confirmation', path: '' },
  ];

  const activeIndex = steps.findIndex((step) => step.path === currentPath);
  const currentStep = activeIndex !== -1 ? activeIndex : 0;

  // Calculate progress bar fill percentage
  const progressPercentage =
    currentPath === '/confirmation'
      ? 100
      : currentPath === '/checkout'
      ? 50
      : 0; // 0% when on /cart page

  return (
    <div className="stepper-section" style={{ marginBottom: '30px' }}>
      <div className="stepper-line-track">
        <div
          className="stepper-line-progress"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="stepper-items-container">
        {steps.map((step, index) => {
          const isConfirmationPage = currentPath === '/confirmation';
          const isCompleted = isConfirmationPage ? true : index < currentStep;
          const isActive = index === currentStep;

          return (
            <Link
              key={step.number}
              to={step.path}
              className={`stepper-item ${
                isCompleted ? 'completed' : isActive ? 'active' : 'pending'
              }`}
            >
              <div
                className={`badge-icon ${
                  isCompleted
                    ? 'green-badge'
                    : isActive
                    ? 'red-badge active-glow'
                    : 'muted-badge'
                }`}
              >
                {/* Shows ✓ ONLY if completed, otherwise shows step number (1, 2, 3) */}
                {isCompleted ? '✓' : step.number}
              </div>

              <span
                className={`step-label ${
                  isCompleted
                    ? 'green-text'
                    : isActive
                    ? 'red-text'
                    : 'muted-text'
                }`}
              >
                {step.label}
              </span>

              <span
                className={`step-title ${
                  isCompleted
                    ? 'green-text'
                    : isActive
                    ? 'red-title'
                    : 'muted-text'
                }`}
              >
                {step.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}// 2. MAIN CHECKOUT PAGE COMPONENT
export default function Checkout() {
  // 1. Pull state from Zustand store right here:
  const cartItems = useCartStore((state) => state.cart || state.cartItems || []);
  const itemsSubtotal = useCartStore((state) => state.subtotal || state.itemsSubtotal || 0);
  const injeraUpgradeFee = useCartStore((state) => state.injeraUpgradeFee || 0);
  const clayPakFee = useCartStore((state) => state.clayPakFee || 0);
  const vatAndLevy = useCartStore((state) => state.vatAndLevy || 0);
  const deliveryFee = useCartStore((state) => state.deliveryFee || 0);
  const grandTotal = useCartStore((state) => state.grandTotal || state.total || 0);
  const handleClearBasket = useCartStore((state) => state.clearCart || state.handleClearBasket);
  const setDeliveryFee = useCartStore((state) => state.setDeliveryFee);

  const navigate = useNavigate();
 

  // 2. State hooks
  const [errorMessage, setErrorMessage] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('delivery');
  const [dispatchType, setDispatchType] = useState('immediate');
  const [paymentMethod, setPaymentMethod] = useState('televirr');

  const [formData, setFormData] = useState({
    recipientName: 'Abdi Serbessa',
    phone: '+251 909090909',
    email: 'abdi.s@example.com',
    deliveryArea: 'Bole Medhanialem (Near Meskel Square)',
    houseNo: 'Building 2, Edna Mall, House No. 102, 2nd Floor',
    landmark: 'Opposite to Boston Day Spa, entrance through dark green gate',
  });

  // 3. Handlers
  const handleDeliveryModeChange = (mode) => {
    setDeliveryMode(mode);
    setDeliveryFee(mode === 'delivery' ? 150 : 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmOrder = () => {
    setErrorMessage('');

    if (!cartItems || cartItems.length === 0) {
      setErrorMessage('Your basket is empty! Please add dishes to your cart before proceeding.');
      return;
    }

    const orderSummary = {
      orderId: `MH-${Math.floor(100000 + Math.random() * 900000)}`,
      amountPaid: grandTotal,
      items: cartItems,
    };

    handleClearBasket();
    navigate('/confirmation', { state: { orderSummary } });
  };

  
  return (
    <div className="checkout-page-container">
     {/* STEPPER SECTION */}
     {/* Simply render the Stepper component here */}
      <Stepper />
      <div className="checkout-main-grid">
        {/* LEFT COLUMN: CHECKOUT INFORMATION FORM */}
        <div className="checkout-form-column">
          {/* Fulfillment Toggle Header */}
         <div className="fulfillment-toggle-card">
  <button
    type="button"
    className={`toggle-btn ${deliveryMode === 'delivery' ? 'active' : ''}`}
    onClick={() => handleDeliveryModeChange('delivery')}
  >
    🚲 Prompt Delivery across Addis
  </button>
  <button
    type="button"
    className={`toggle-btn ${deliveryMode === 'pickup' ? 'active' : ''}`}
    onClick={() => handleDeliveryModeChange('pickup')}
  >
    🛍️ Dine-In Pickup (Bole)
  </button>
</div>

          {/* Section 1: Contact & Guest Details */}
          <div className="checkout-card">
            <div className="card-header">
              <h3>1. Contact &amp; Guest Details</h3>
              <span className="badge-subtle">HABESHA HOSPITALITY</span>
            </div>
            <div className="form-grid-2">
              <div className="input-group">
                <label>RECIPIENT NAME</label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>PHONE (CALLS &amp; TELEGRAM SMS)</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="input-group margin-top-sm">
              <label>RECEIPT EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Section 2: Delivery Location in Addis Ababa */}
          {deliveryMode === 'delivery' && (
            <div className="checkout-card">
              <div className="card-header">
                <h3>2. Delivery Location in Addis Ababa</h3>
                <span className="badge-subtle">INSULATED MESOB CARRIER</span>
              </div>
              
              <div className="input-group">
                <label>SUB-CITY / NEIGHBORHOOD</label>
                <select
                  name="deliveryArea"
                  value={formData.deliveryArea}
                  onChange={handleInputChange}
                >
                  <option value="Bole Medhanialem (Near Meskel Square)">
                    Bole Medhanialem (Near Meskel Square)
                  </option>
                  <option value="Kazanchis / ECA Area">Kazanchis / ECA Area</option>
                  <option value="Old Airport / Bisrate Gabriel">Old Airport / Bisrate Gabriel</option>
                  <option value="Piassa / Arat Kilo">Piassa / Arat Kilo</option>
                </select>
              </div>

              <div className="input-group margin-top-sm">
                <label>STREET ADDRESS, CONDO / BUILDING NO, FLOOR, SUITE</label>
                <input
                  type="text"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group margin-top-sm">
                <label>SPECIFIC LANDMARK / GATE INSTRUCTIONS</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>

              {/* Dispatch Timing Options */}
              <div className="dispatch-options-grid margin-top-md">
                <label
                  className={`radio-card ${dispatchType === 'immediate' ? 'selected' : ''}`}
                  onClick={() => setDispatchType('immediate')}
                >
                  <input
                    type="radio"
                    name="dispatchType"
                    checked={dispatchType === 'immediate'}
                    onChange={() => {}}
                  />
                  <div>
                    <strong>Immediate Dispatch</strong>
                    <p>Fresh &amp; hot off clay stove (~35–45 min)</p>
                  </div>
                </label>

                <label
                  className={`radio-card ${dispatchType === 'schedule' ? 'selected' : ''}`}
                  onClick={() => setDispatchType('schedule')}
                >
                  <input
                    type="radio"
                    name="dispatchType"
                    checked={dispatchType === 'schedule'}
                    onChange={() => {}}
                  />
                  <div>
                    <strong>Schedule for Dinner</strong>
                    <p>Set for evening feast (e.g., 7:30 PM)</p>
                  </div>
                </label>
              </div>

              {/* Route Guarantee Banner */}
              <div className="kitchen-route-banner margin-top-md">
                <span className="route-icon">🔥</span>
                <div>
                  <strong>Direct Kitchen-to-Door Route</strong>
                  <p>Dispatched with heated earthen tray covers</p>
                </div>
                <span className="priority-badge">Bole Zone Priority</span>
              </div>
            </div>
          )}

          {/* Section 3: Payment Method */}
          <div className="checkout-card">
            <div className="card-header">
              <h3>3. Payment Method</h3>
              <span className="badge-subtle">ENCRYPTED &amp; DIRECT</span>
            </div>

            <div className="payment-options-list">
              {/* Telebirr Option */}
              <div className={`payment-option-item ${paymentMethod === 'telebirr' ? 'active' : ''}`}>
                <label className="payment-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="telebirr"
                    checked={paymentMethod === 'telebirr'}
                    onChange={() => setPaymentMethod('telebirr')}
                  />
                  <div>
                    <strong>Telebirr <span className="popular-tag">Popular</span></strong>
                    <p>Instant SuperApp QR prompt or USSD confirmation</p>
                  </div>
                </label>

                {paymentMethod === 'telebirr' && (
                  <div className="payment-expanded-box">
                    <div className="qr-preview-placeholder">
                      <div className="qr-box">QR Code</div>
                      <div>
                        <strong>Telebirr Quick Merchant Pay</strong>
                        <p>Merchant Code: 7751 | Scan via Telebirr or enter mobile number below</p>
                        <div className="inline-verify-input">
                          <input type="text" defaultValue="0909090909" />
                          <button type="button">Verify</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CBE Birr Option */}
              <div className={`payment-option-item ${paymentMethod === 'cbe' ? 'active' : ''}`}>
                <label className="payment-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cbe"
                    checked={paymentMethod === 'cbe'}
                    onChange={() => setPaymentMethod('cbe')}
                  />
                  <div>
                    <strong>CBE Birr / CBE Mobile Banking</strong>
                    <p>Direct settlement via Commercial Bank of Ethiopia</p>
                  </div>
                </label>
              </div>

              {/* Cash or Card on Delivery Option */}
              <div className={`payment-option-item ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <label className="payment-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div>
                    <strong>Cash or Card on Delivery</strong>
                    <p>Rider delivers with wireless POS card terminal + change for cash</p>
                  </div>
                </label>
              </div>

              {/* Amole / Awash Birr Option */}
              <div className={`payment-option-item ${paymentMethod === 'amole' ? 'active' : ''}`}>
                <label className="payment-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="amole"
                    checked={paymentMethod === 'amole'}
                    onChange={() => setPaymentMethod('amole')}
                  />
                  <div>
                    <strong>Amole / Awash Birr</strong>
                    <p>Dashen Amole wallet or Awash Birr direct integration</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Mesob House Promise Footer Banner */}
          <div className="promise-banner">
            <span className="promise-icon">📜</span>
            <div>
              <strong>The Mesob House Promise</strong>
              <p>
                Each communal platter arrives with four extra folds of authentic 100% pure teff injera, warm wet towels, and our hand-blended Mitmita spice on the side.
              </p>
            </div>
          </div>
        </div>

       {/* RIGHT COLUMN: ORDER SUMMARY & STICKY PANEL */}
<div className="checkout-summary-column">
  <div className="summary-card-sticky">
    <div className="summary-header">
      <div>
        <span className="category-subtitle">HABESHA FEAST</span>
        <h2>Order Summary</h2>
      </div>
      <button 
        type="button" 
        className="edit-cart-link"
        onClick={() => navigate('/cart')}
      >
        Edit Cart
      </button>
    </div>

    {/* Dynamic Cart Items List */}
    <div className="summary-items-list">
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.id} className="summary-item-row">
            <img
              src={
                item.image
                  ? new URL(`../../assets/images/${item.image}`, import.meta.url).href
                  : 'https://via.placeholder.com/60'
              }
              alt={item.nameEn || item.name}
            />
            <div className="summary-item-details">
              <div className="item-title-row">
                <h4>{item.nameEn || item.name}</h4>
                <span className="item-price">
                  ETB {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
              <p className="item-subtext">{item.description}</p>
              <span className="item-qty">Qty: {item.quantity}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-summary-message" style={{ padding: '16px 0', color: '#6B7280' }}>
          Your basket is currently empty.
        </div>
      )}
    </div>

    {/* Delivery Corridor Tag */}
    {deliveryMode === 'delivery' && (
      <div className="destination-preview-box">
        {/* 1. Header Banner */}
        <div className="delivering-to-banner">
          <div>
            <span className="label-sm">DELIVERING TO</span> <br />
            <strong>{formData.deliveryArea || 'Bole Sub-city, Edna Mall Area'}</strong><br /><br />
            <p className="est-arrival">Estimated arrival: ~35–45 mins from clay oven sealing</p>
          </div>
          <span className="status-dot-active"> Active Corridor</span>
        </div>

        {/* Ledger Breakdown inside checkout-summary-column */}
<div className="ledger-breakdown">
  <div className="ledger-row">
    <span>Items Subtotal</span>
    <span>ETB {itemsSubtotal.toLocaleString()}</span>
  </div>

  <div className="ledger-row">
    <span>100% Teff Injera Upgrade</span>
    <span>ETB {injeraUpgradeFee.toLocaleString()}</span>
  </div>

  <div className="ledger-row">
    <span>Insulated Traditional Clay-Pak</span>
    <span>ETB {clayPakFee.toLocaleString()}</span>
  </div>

  <div className="ledger-row">
    <span>City VAT &amp; Tourism Levy (15%)</span>
    <span>ETB {vatAndLevy.toLocaleString()}</span>
  </div>

  <div className="ledger-row">
    <span>Express Delivery Fee</span>
    <span>{deliveryFee > 0 ? `ETB ${deliveryFee.toLocaleString()}` : 'FREE'}</span>
  </div>
</div>
      </div>
    )}

    {/* Grand Total Banner */}
    <div className="grand-total-banner">
      <div>
        <span className="total-label">TOTAL AMOUNT DUE</span>
        <h3>Grand Total</h3>
      </div>
      <div className="total-amount-display">
        <span className="currency">ETB</span>
        <span className="num">{grandTotal.toLocaleString()}</span>
        <span className="tax-subtext">VAT Inclusive</span>
      </div>
    </div>

    <div className="quality-guarantee-note">
      🛡️ Guaranteed steaming hot in woven sealed carriers or 100% remade.
    </div>

 {/* Error Alert Banner */}
{errorMessage && (
  <div className="checkout-error-banner">
    <span>⚠️</span>
    <span>{errorMessage}</span>
  </div>
)}

{/* Confirm Order Button */}
<button
  type="button"
  className="confirm-order-btn"
  onClick={handleConfirmOrder}
>
  ✓ Confirm Order &amp; Pay ETB {grandTotal.toLocaleString()}
</button>
    {/* Secondary Navigation Links */}
    <div className="secondary-return-links">
      <button 
        type="button" 
        className="link-action-btn"
        onClick={() => navigate('/cart')}
      >
        ← Return to Cart
      </button>
      <span className="separator-dot">•</span>
      <button 
        type="button" 
        className="link-action-btn"
        onClick={() => navigate('/menu')}
      >
        Add More Dishes
      </button>
    </div>
  </div>

  {/* Need Assistance Concierge Box */}
  <div className="support-card">
    <div className="support-info">
      <div className="support-icon-box">🎧</div>
      <div className="support-text-details">
        <strong>Need Phone Support?</strong>
        <p>Direct kitchen desk: +251 909090909</p>
      </div>
    </div>
    <a href="tel:+251909090909" className="btn-call-link">
      Call Now
    </a>
  </div>
</div>
      </div>
    </div>
  );
}