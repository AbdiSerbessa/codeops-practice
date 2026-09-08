import { useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryBar from '../CategoryBar/CategoryBar';
import DishList from '../DishList/DishList';
import { useFetch } from '../../hooks/useFetch';
import './Menu.css';

export default function Menu() {
  const { data: dishes, loading, error } = useFetch('/dishes.json');
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const searchInputRef = useRef(null);
  const categories = ['All', 'Mains', 'Vegan', 'Drinks', 'Desserts'];

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleCategorySelect = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (val) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

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
      <div className="search-container">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {loading && <p className="loading-state">Loading menu...</p>}
      {error && <p className="error-state">Error: {error}</p>}

      {!loading && !error && <DishList dishes={filteredDishes} />}
    </div>
  );
}