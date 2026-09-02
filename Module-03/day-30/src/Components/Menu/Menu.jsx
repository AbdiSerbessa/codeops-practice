import { useState, useMemo, useRef, useEffect } from 'react';
import CategoryBar from '../CategoryBar/CategoryBar';
import DishList from '../DishList/DishList';
import OrderForm from '../OrderForm/OrderForm';
import { useFetch } from '../../hooks/useFetch';
import { useCart } from '../../cart/CartProvider';
import './Menu.css';

export default function Menu() {
  const { data: dishes, loading, error } = useFetch('/dishes.json');
  const { itemCount, totalETB, clearCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const categories = ['All', 'Mains', 'Vegan', 'Drinks', 'Desserts'];

  // Auto-focus search field on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Memoized filter logic for category & search
  const filteredDishes = useMemo(() => {
    if (!dishes) return [];
    return dishes.filter((dish) => {
      const matchesCat = selectedCategory === 'All' || dish.category === selectedCategory;
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [dishes, selectedCategory, searchQuery]);

  return (
    <div className="menu-container">
      <header className="menu-header">
        <h2>Addis Eats Menu</h2>
        <div className="total-badge">Cart: {itemCount} items ({totalETB} ETB)</div>
        {itemCount > 0 && (
          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        )}
      </header>

      <div className="search-container">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading && <p className="loading-state">Loading menu...</p>}
      {error && <p className="error-state">Error: {error}</p>}

      {!loading && !error && (
        <DishList dishes={filteredDishes} />
      )}

      <OrderForm />
    </div>
  );
}