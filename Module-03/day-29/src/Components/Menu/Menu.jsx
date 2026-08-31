import { useState, useEffect, useRef } from 'react';
import CategoryBar from '../CategoryBar/CategoryBar';
import DishList from '../DishList/DishList';
import OrderForm from '../OrderForm/OrderForm';
import { loadDishes } from '../../api';
import './Menu.css';

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalETB, setTotalETB] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchInputRef = useRef(null);
  const categories = ['All', 'Mains', 'Vegan', 'Drinks', 'Desserts'];

  // Auto-focus search field on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Fetch dishes with category dependency & abort cleanup
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    loadDishes(controller.signal)
      .then((data) => {
        setDishes(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Could not load dishes.');
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [selectedCategory]);

  const handleAddToCart = (price) => {
    setTotalETB((prev) => prev + price);
  };

  const handleResetOrder = () => {
    setTotalETB(0);
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-container">
      <header className="menu-header">
        <h2>Addis Eats Menu</h2>
        <div className="total-badge">Order Total: {totalETB} ETB</div>
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

      {loading && <p className="loading-state">Loading dishes...</p>}
      {error && <p className="error-state">Error: {error}</p>}

      {!loading && !error && (
        <DishList dishes={filteredDishes} onAddToCart={handleAddToCart} />
      )}

      <OrderForm totalETB={totalETB} onResetOrder={handleResetOrder} />
    </div>
  );
}