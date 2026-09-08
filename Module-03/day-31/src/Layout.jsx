import { Link, NavLink, Outlet } from 'react-router-dom';
import { useCart } from './cart/CartProvider';
import './Layout.css';

export default function Layout() {
  const { itemCount, totalETB } = useCart();

  return (
    <div className="layout-container">
      <header className="main-header">
        <Link to="/" className="brand-link">
          <h2>Addis Eats</h2>
        </Link>
        
        <nav className="nav-links">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Home
          </NavLink>
          <NavLink 
            to="/menu" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Menu
          </NavLink>
          <NavLink 
            to="/checkout" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Checkout
          </NavLink>
        </nav>

        <div className="total-badge">
          🛒 {itemCount} items ({totalETB} ETB)
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}