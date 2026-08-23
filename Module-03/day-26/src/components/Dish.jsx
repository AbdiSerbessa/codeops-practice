import './Dish.css';

export default function Dish({ name, price }) {
  return (
    <div className="dish-card">
      <h3 className="dish-name">{name}</h3>
      <span className="dish-price">${price.toFixed(2)}</span>
    </div>
  );
}