import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import './Header.css';

export default function Header() {
const user = useAuthStore((state) => state.user);
const logout = useAuthStore((state) => state.logout);

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          Mesob House
        </Link>

        {/* Center Navigation Links */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          {/* <Link to="/featured-dish">Featured Dish</Link> */}
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </nav>

        {/* User Account / Auth Action Section */}
        <div className="auth-section">
          {user ? (
            <div className="user-profile-badge">
              <span className="welcome-message">
                Welcome, <strong className="user-name-highlight">{user.fullName || 'Guest'}</strong> ✨
              </span>
              <button onClick={logout} className="btn-logout">
                Log Out
              </button>
            </div>
          ) : (
            <div className="guest-actions">
              <Link to="/login" className="btn-login">Sign In</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}