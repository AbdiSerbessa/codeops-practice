import { useState } from "react";
import Dish from "../Dish/Dish";      
import Card from "../Card/Card";      
import { dishesData } from "../../data"; 
import './Menu.css'

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('All');

 
  const filteredDishes =
    selectedCategory === 'All'
      ? dishesData
      : dishesData.filter((dish) => dish.category === selectedCategory);

  const categories = ['All', 'Mains', 'Vegan', 'Drinks', 'Desserts'];

  return (
    <div className="menu-container">
      <h2>Addis Eats Menu</h2>

      
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredDishes.length === 0 ? (
        <div className="empty-state">
          <p>No dishes available in the "{selectedCategory}" category.</p>
        </div>
      ) : (
        <div className="dish-list">
          {filteredDishes.map((dish) => (
            <Card key={dish.id}>
              <Dish
                name={dish.name}
                price={dish.price}
                spicy={dish.spicy}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}