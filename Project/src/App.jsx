import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import NotFound from './pages/NotFound/NotFound';

// Lazy loaded page components
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Home = lazy(() => import('./pages/Home/Home'));
const Menu = lazy(() => import('./pages/Menu/Menu'));
const DishDetail = lazy(() => import('./pages/DishDetail/DishDetail'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const Confirmation = lazy(() => import('./pages/Confirmation/Confirmation'));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: '#8b0000', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading Mesob House...</div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              
              {/* Routes for Dish details (Home specials & Menu items) */}
              <Route path="/dish/:slug" element={<DishDetail />} />
              <Route path="/dish/:id" element={<DishDetail />} />
              <Route path="/menu/:slug" element={<DishDetail />} />
              <Route path="/menu/:id" element={<DishDetail />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* Protected Routes */}
              <Route
                path="/confirmation"
                element={
                  <ProtectedRoute>
                    <Confirmation />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all for unknown routes */}
              <Route path="*" element={<NotFound />} />

            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}