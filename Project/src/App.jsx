import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div className="container" style={{ padding: '40px 0' }}><h1>Home Screen</h1></div>} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="menu" element={<div className="container" style={{ padding: '40px 0' }}><h1>Menu Screen</h1></div>} />
          <Route path="cart" element={<div className="container" style={{ padding: '40px 0' }}><h1>Cart Screen</h1></div>} />
          <Route path="checkout" element={<div className="container" style={{ padding: '40px 0' }}><h1>Checkout Screen</h1></div>} />
          <Route path="*" element={<div className="container" style={{ padding: '40px 0' }}><h1>404 Not Found</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}