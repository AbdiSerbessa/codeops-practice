import PropTypes from 'prop-types';
import './Dish.css'

export default function Dish({ name, price, currency = 'ETB', spicy }) {
  const isSpicy = Boolean(spicy);

  return (
    <div className="dish-card">
      <h3>
        {name} {isSpicy && <span className="spicy-badge">🌶️ Spicy</span>}
      </h3>
      <p>
        {price} {currency}
      </p>
    </div>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  currency: PropTypes.string,
  spicy: PropTypes.bool
};