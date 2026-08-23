import Header from './components/Header';
import Dish from './components/Dish';
import './App.css';

export default function App() {
  const menuItems = [
    { id: 1, name: 'Doro Wat', price: 15.99 },
    { id: 2, name: 'Kitfo', price: 14.50 },
    { id: 3, name: 'Tibs', price: 13.99 },
    { id: 4, name: 'Shiro Wat', price: 10.50 },
    { id: 5, name: 'Veggie Combo', price: 12.00 },
  ];

  return (
    <div className="app-container">
      <Header />
      <main>
        <h2 className="section-title">Menu</h2>
        {menuItems.map((dish) => (
          <Dish key={dish.id} name={dish.name} price={dish.price} />
        ))}
      </main>
    </div>
  );
}