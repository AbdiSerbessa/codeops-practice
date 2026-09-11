import { NavLink } from 'react-router-dom';
import './MobileNav.css';

export default function MobileNav() {
  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" className="mobile-nav-item">
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </NavLink>

      <NavLink to="/menu" className="mobile-nav-item">
        <span className="nav-icon">📋</span>
        <span className="nav-label">Menu</span>
      </NavLink>

      <NavLink to="/cart" className="mobile-nav-item">
        <span className="nav-icon">🛒</span>
        <span className="nav-label">Cart</span>
      </NavLink>

      <NavLink to="/login" className="mobile-nav-item">
        <span className="nav-icon">👤</span>
        <span className="nav-label">Account</span>
      </NavLink>
    </nav>
  );
}