import { useState } from 'react';
import CategoryBar from '../CategoryBar/CategoryBar';
import Dish from '../Dish/Dish';
import OrderForm from '../OrderForm/OrderForm';
import { dishesData } from '../../data';
import './Menu.css';

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [totalETB, setTotalETB] = useState(0);

  const categories = ['All', 'Mains', 'Vegan', 'Drinks', 'Desserts'];

  const handleAddToCart = (price) => {
    setTotalETB((prevTotal) => prevTotal + price);
  };

  // Reset order total back to zero after successful submit
  const handleResetOrder = () => {
    setTotalETB(0);
  };

  const filteredDishes =
    selectedCategory === 'All'
      ? dishesData
      : dishesData.filter((dish) => dish.category === selectedCategory);

  return (
    <div className="menu-container">
      <header className="menu-header">
        <h2>Addis Eats Menu</h2>
        <div className="total-badge">Order Total: {totalETB} ETB</div>
      </header>

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {filteredDishes.length === 0 ? (
        <p className="empty-state">No dishes available in this category.</p>
      ) : (
        <div className="dish-grid">
          {filteredDishes.map((dish) => (
            <Dish
              key={dish.id}
              name={dish.name}
              price={dish.price}
              spicy={dish.spicy}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Pass handleResetOrder to OrderForm */}
      <OrderForm totalETB={totalETB} onResetOrder={handleResetOrder} />
    </div>
  );
}