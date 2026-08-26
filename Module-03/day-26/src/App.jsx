import Header from './components/Header/Header';
import Dish from './components/Dish/Dish';

export default function App() {
  // Static array of menu items
  const dishes = [
    { id: 1, name: 'Doro Wat', price: 15.99 },
    { id: 2, name: 'Kitfo', price: 14.50 },
    { id: 3, name: 'Tibs', price: 13.99 },
    { id: 4, name: 'Shiro Wat', price: 10.50 },
    { id: 5, name: 'Veggie Combo', price: 12.00 },
  ];

  return (
    <div className="app-container">
      <Header />
      <main className="menu-list">
        {dishes.map((dish) => (
          <Dish key={dish.id} name={dish.name} price={dish.price} />
        ))}
      </main>
    </div>
  );
}