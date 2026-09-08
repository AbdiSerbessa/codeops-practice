import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import Menu from './Components/Menu/Menu';
import DishDetail from './DishDetail';
import OrderForm from './Components/OrderForm/OrderForm';
import RequireAuth from './auth/RequireAuth';
import { CartProvider } from './cart/CartProvider';

function Home() {
  return (
    <div style={{ color: '#fff', textAlign: 'center', padding: '40px' }}>
      <h2>Welcome to Addis Eats</h2>
      <p>Authentic Ethiopian cuisine delivered directly to your doorstep.</p>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/checkout';

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    navigate(from, { replace: true });
  };

  return (
    <div style={{ color: '#fff', textAlign: 'center', padding: '40px' }}>
      <h2>Sign In Required</h2>
      <p>Please log in to proceed to TeleBirr checkout.</p>
      <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Log In
      </button>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ color: '#fff', textAlign: 'center', padding: '40px' }}>
      <h2>404 - Screen Not Found</h2>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="menu/:id" element={<DishDetail />} />
            <Route
              path="checkout"
              element={
                <RequireAuth>
                  <OrderForm />
                </RequireAuth>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}