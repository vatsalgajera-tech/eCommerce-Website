import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';

export default function ProtectedRoute({ children }) {
  const user = useSelector(selectUser);
  const location = useLocation();
  // Pass current location so login can redirect back after success
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}
