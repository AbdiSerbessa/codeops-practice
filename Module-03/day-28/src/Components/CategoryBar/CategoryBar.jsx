import './CategoryBar.css';

export default function CategoryBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="category-bar">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`chip ${selectedCategory === category ? 'active' : ''}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}