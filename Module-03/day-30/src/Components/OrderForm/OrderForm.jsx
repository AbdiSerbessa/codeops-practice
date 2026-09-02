import { useState } from 'react';
import { useCart } from '../../cart/CartProvider';
import './OrderForm.css';

export default function OrderForm() {
  const { totalETB, clearCart, items } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Helper validation function for individual fields
  const validateField = (name, value) => {
    let error = '';

    if (name === 'fullName') {
      if (!value.trim()) {
        error = 'Full Name is required';
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        error = 'Name can only contain letters and spaces';
      } else if (value.trim().length < 3) {
        error = 'Name must be at least 3 characters';
      }
    }

    if (name === 'phone') {
      const phoneRegex = /^(09|07)\d{8}$/;
      if (!value.trim()) {
        error = 'TeleBirr phone number is required';
      } else if (!phoneRegex.test(value.trim())) {
        error = 'Must start with 09 or 07 and be 10 digits (e.g. 0912345678)';
      }
    }

    if (name === 'address') {
      if (!value.trim()) {
        error = 'Delivery address is required';
      } else if (value.trim().length < 5) {
        error = 'Please enter a valid detailed address';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset confirmation badge when user starts editing fields again
    if (isSubmitted) {
      setIsSubmitted(false);
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation as user types
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({ fullName: true, phone: true, address: true });

    const newErrors = {
      fullName: validateField('fullName', formData.fullName),
      phone: validateField('phone', formData.phone),
      address: validateField('address', formData.address)
    };

    setErrors(newErrors);

    if (items.length === 0) {
      alert('Your cart is empty. Add items before placing an order!');
      return;
    }

    const hasErrors = Object.values(newErrors).some((err) => err !== '');
    if (!hasErrors) {
      setIsSubmitted(true);
      clearCart();

      // Clear input fields and validation warnings
      setFormData({ fullName: '', phone: '', address: '' });
      setErrors({});
      setTouched({});
    }
  };

  // Optional: Auto-clear confirmation banner if user adds new items to an empty cart
  const handleFormFocus = () => {
    if (isSubmitted && items.length > 0) {
      setIsSubmitted(false);
    }
  };

  return (
    <form className="order-form" onSubmit={handleSubmit} onFocus={handleFormFocus}>
      <h3>TeleBirr Delivery Details</h3>

      <div className="form-group">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.fullName && errors.fullName ? 'input-error' : ''}
        />
        {touched.fullName && errors.fullName && (
          <span className="error-text">{errors.fullName}</span>
        )}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="phone"
          placeholder="TeleBirr Phone (09... or 07...)"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.phone && errors.phone ? 'input-error' : ''}
        />
        {touched.phone && errors.phone && (
          <span className="error-text">{errors.phone}</span>
        )}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="address"
          placeholder="Delivery Area / Address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          className={touched.address && errors.address ? 'input-error' : ''}
        />
        {touched.address && errors.address && (
          <span className="error-text">{errors.address}</span>
        )}
      </div>

      <button type="submit" disabled={items.length === 0} className="submit-btn">
        Place Order ({totalETB} ETB)
      </button>

      {isSubmitted && (
        <p className="success-message">Order confirmed! Delivering to your address.</p>
      )}
    </form>
  );
}