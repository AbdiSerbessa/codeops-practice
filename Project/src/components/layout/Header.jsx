import { Link, NavLink } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="main-header">
      <div className="container header-content">
        <Link to="/" className="brand-logo">
          <h2>Mesob House</h2>
        </Link>

        <nav className="header-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => (isActive ? 'active' : '')}>
            Featured Menu
          </NavLink>
          <NavLink to="/checkout" className={({ isActive }) => (isActive ? 'active' : '')}>
            Checkout
          </NavLink>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-badge">
            🛒 12 items <span className="cart-price">(4,200 ETB)</span>
          </Link>
          <Link to="/login" className="btn-signin">Sign In</Link>
          <Link to="/register" className="btn-register">Register</Link>
        </div>
      </div>
    </header>
  );
}