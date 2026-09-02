import PropTypes from 'prop-types';
import DishImage from './DishImage';
import { useCart } from '../../cart/CartProvider';
import './Dish.css';

export default function Dish({ id, name, price, currency = 'ETB', spicy, imageUrl }) {
  const { addItem, decrementItem, items } = useCart();

  // Find current item quantity in cart context
  const cartItem = items.find((item) => item.id === id);
  const count = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addItem({ id, name, price, spicy, imageUrl });
  };

  const handleRemove = () => {
    decrementItem(id);
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
        {count > 0 && (
          <>
            <button className="remove-btn" onClick={handleRemove}>
              −
            </button>
            <span className="count-badge">Qty: {count}</span>
          </>
        )}
        <button className="add-btn" onClick={handleAdd}>
          + Add
        </button>
      </div>
    </div>
  );
}

Dish.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  currency: PropTypes.string,
  spicy: PropTypes.bool,
  imageUrl: PropTypes.string
};