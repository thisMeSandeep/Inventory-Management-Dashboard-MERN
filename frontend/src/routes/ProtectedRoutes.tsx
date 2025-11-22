import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/user.store';

const ProtectedRoute = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
