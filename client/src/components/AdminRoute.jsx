import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../store/slices/authSlice';

export default function AdminRoute({ children }) {
  const isAdmin = useSelector(selectIsAdmin);
  return isAdmin ? children : <Navigate to="/" replace />;
}
