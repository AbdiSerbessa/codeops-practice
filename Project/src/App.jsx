import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Menu from './pages/Menu/Menu';
import FeaturedDish from './pages/FeaturedDish/FeaturedDish';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="menu" element={<Menu />} />
          <Route path="featured-dish" element={<FeaturedDish />} />
          <Route path="cart" element={<div className="container" style={{ padding: '40px 0' }}><h1>Cart Screen</h1></div>} />
          <Route path="checkout" element={<div className="container" style={{ padding: '40px 0' }}><h1>Checkout Screen</h1></div>} />
          <Route path="*" element={<div className="container" style={{ padding: '40px 0' }}><h1>404 Not Found</h1></div>} />
        </Route>
      </Routes>

      {/* Mobile Navigation Bar with 6 Items */}
      <div className="mobile-bottom-bar">
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => `mobile-nav-btn ${isActive ? 'active' : ''}`}
        >
          <span className="icon">🏠</span>
          <span className="label">Home</span>
        </NavLink>

        <NavLink 
          to="/menu" 
          className={({ isActive }) => `mobile-nav-btn ${isActive ? 'active' : ''}`}
        >
          <span className="icon">🍽️</span>
          <span className="label">Menu</span>
        </NavLink>

        <NavLink 
          to="/featured-dish" 
          className={({ isActive }) => `mobile-nav-btn ${isActive ? 'active' : ''}`}
        >
          <span className="icon">⭐</span>
          <span className="label">Featured</span>
        </NavLink>

        <NavLink 
          to="/cart" 
          className={({ isActive }) => `mobile-nav-btn ${isActive ? 'active' : ''}`}
        >
          <span className="icon">🛒</span>
          <span className="label">Cart</span>
        </NavLink>

        <NavLink 
          to="/checkout" 
          className={({ isActive }) => `mobile-nav-btn ${isActive ? 'active' : ''}`}
        >
          <span className="icon">💳</span>
          <span className="label">Checkout</span>
        </NavLink>

        <NavLink 
          to="/login" 
          className={({ isActive }) => `mobile-nav-btn ${isActive ? 'active' : ''}`}
        >
          <span className="icon">👤</span>
          <span className="label">Account</span>
        </NavLink>
      </div>
    </BrowserRouter>
  );
}