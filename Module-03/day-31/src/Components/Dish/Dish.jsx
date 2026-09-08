import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DishImage from './DishImage';
import { useCart } from '../../cart/CartProvider';
import './Dish.css';

export default function Dish({ id, name, price, currency = 'ETB', spicy, imageUrl }) {
  const { addItem, decrementItem, items } = useCart();

  const cartItem = items.find((item) => item.id === id);
  const count = cartItem ? cartItem.quantity : 0;

  return (
    <div className="dish-card">
      <Link to={`/menu/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {imageUrl && <DishImage url={imageUrl} altText={name} />}
        <div className="dish-info">
          <h3>
            {name} {spicy && <span className="spicy-badge">🌶️ Spicy</span>}
          </h3>
          <p className="price">{price} {currency}</p>
        </div>
      </Link>
      <div className="dish-action">
        {count > 0 && (
          <>
            <button className="remove-btn" onClick={() => decrementItem(id)}>−</button>
            <span className="count-badge">Qty: {count}</span>
          </>
        )}
        <button className="add-btn" onClick={() => addItem({ id, name, price, spicy, imageUrl })}>
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