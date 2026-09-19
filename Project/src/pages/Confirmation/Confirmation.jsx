import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stepper } from '../Checkout/Checkout';
import { useCart } from '../../context/CartContext';

export default function Confirmation() {
  const location = useLocation();
  const { cartItems, grandTotal } = useCart();

  // Retrieve passed order details
  const orderSummary = location.state?.orderSummary;
  const displayTotal = orderSummary?.amountPaid ?? grandTotal;
  const displayItems = orderSummary?.items ?? cartItems;

  // Initialize order ID lazily in state to avoid calling Math.random during render
  const [orderId] = useState(
    () => orderSummary?.orderId || `MH-${Math.floor(100000 + Math.random() * 900000)}`
  );

  // Reset scroll position to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '60px', maxWidth: '900px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
      {/* Stepper Progress Bar */}
      <Stepper />

      {/* Confirmation Content */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ color: '#1E4620', fontSize: '28px', marginBottom: '12px', fontWeight: 'bold' }}>
          Thank You for Your Order!
        </h2>
        <p style={{ color: '#555', fontSize: '16px', marginBottom: '24px' }}>
          Your order has been placed successfully and is being prepared.
        </p>

        {/* Order Details Receipt Box */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          margin: '0 auto 32px auto',
          textAlign: 'left',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', display: 'block' }}>Order Reference</span>
              <strong style={{ fontSize: '16px', color: '#111827' }}>#{orderId}</strong>
            </div>
            <span style={{ backgroundColor: '#DEF7EC', color: '#03543F', fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>
              Payment Confirmed
            </span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '16px 0' }} />

          {/* Itemized Purchased List */}
          {displayItems && displayItems.length > 0 && (
            <>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '12px' }}>
                Summary
              </div>
              {displayItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B5563', marginBottom: '8px' }}>
                  <span>{item.title} x {item.quantity}</span>
                  <span>ETB {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '16px 0' }} />
            </>
          )}

          {/* Amount Paid Highlight */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>Total Amount Paid</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#8B2613' }}>
              ETB {displayTotal ? displayTotal.toLocaleString() : '0'}
            </span>
          </div>
        </div>

        <Link
          to="/menu"
          style={{
            display: 'inline-block',
            backgroundColor: '#8B2613',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}