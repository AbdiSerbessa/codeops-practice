import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore'; // Use Zustand store

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user); // Get user from Zustand
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