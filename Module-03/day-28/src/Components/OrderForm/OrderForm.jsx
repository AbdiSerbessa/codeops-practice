import { useState } from 'react';
import './OrderForm.css';

export default function OrderForm({ totalETB, onResetOrder }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: ''
  });

  const [submittedArea, setSubmittedArea] = useState('');

  const isNameValid =
    formData.name.trim().length > 2 && /^[A-Za-z\s]+$/.test(formData.name.trim());
  const isPhoneValid = /^(09|07)\d{8}$/.test(formData.phone.trim());
  const isAreaValid = formData.area.trim().length > 2;

  const isFormValid = isNameValid && isPhoneValid && isAreaValid && totalETB > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submittedArea) setSubmittedArea('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setSubmittedArea(formData.area.trim());
      
      // Clear form inputs
      setFormData({
        name: '',
        phone: '',
        area: ''
      });

      // Reset the order total state in Menu.jsx
      onResetOrder();
    }
  };

  return (
    <div className="order-form-card">
      <h3>TeleBirr Delivery Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          {formData.name && !isNameValid && (
            <span className="error">Name must be &gt; 2 chars (letters only)</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="phone"
            placeholder="TeleBirr Phone (09... or 07...)"
            value={formData.phone}
            onChange={handleChange}
          />
          {formData.phone && !isPhoneValid && (
            <span className="error">Valid 10-digit TeleBirr number required</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="area"
            placeholder="Delivery Area / Address"
            value={formData.area}
            onChange={handleChange}
          />
          {formData.area && !isAreaValid && (
            <span className="error">Address must be greater than 2 characters</span>
          )}
        </div>

        <button type="submit" disabled={!isFormValid}>
          Place Order ({totalETB} ETB)
        </button>
      </form>

      {submittedArea && (
        <p className="success-msg">Order confirmed! Delivering to {submittedArea}.</p>
      )}
    </div>
  );
}