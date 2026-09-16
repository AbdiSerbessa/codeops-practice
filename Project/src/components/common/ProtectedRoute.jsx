import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login and pass redirect state message
    return (
      <Navigate 
        to="/login" 
        state={{ message: 'Please log in to your account to view your cart or complete your order.' }} 
        replace 
      />
    );
  }

  return children;
}