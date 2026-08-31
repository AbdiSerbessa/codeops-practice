import { useState } from 'react';
import PropTypes from 'prop-types';
import DishImage from './DishImage';
import './Dish.css';

export default function Dish({ name, price, currency = 'ETB', spicy, imageUrl, onAddToCart }) {
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    setCount((prev) => prev + 1);
    onAddToCart(price);
  };

  return (
    <div className="dish-card">
      {imageUrl && <DishImage url={imageUrl} altText={name} />}
      <div className="dish-info">
        <h3>
          {name} {spicy && <span className="spicy-badge">🌶️ Spicy</span>}
        </h3>
        <p className="price">
          {price} {currency}
        </p>
      </div>
      <div className="dish-action">
        {count > 0 && <span className="count-badge">Qty: {count}</span>}
        <button className="add-btn" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  currency: PropTypes.string,
  spicy: PropTypes.bool,
  imageUrl: PropTypes.string,
  onAddToCart: PropTypes.func.isRequired
};