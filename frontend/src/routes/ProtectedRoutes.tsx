import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';
import Spinner from '../components/UI/Spinner';

const ProtectedRoute = () => {
  const { data: user, isLoading } = useCurrentUser();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner size={40} />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
