import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/public/Login';
import RegisterForm from './pages/public/Register';
import EmailVerification from './pages/public/EmailVerification';
import ResetPassword from './pages/public/ResetPassword';
import ForgotPassword from './pages/public/ForgotPassword';
import Products from './pages/dashboard/Products';
import ProductDetails from './pages/dashboard/ProductDetails';
import ProtectedRoute from './routes/ProtectedRoutes';
import PublicRoute from './routes/PublicRoutes';
import Spinner from './components/UI/Spinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCurrentUser } from './hooks/useAuth';

const App = () => {
  const { isLoading, data: user } = useCurrentUser();

  // Show loading spinner during auto login check
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={user ? <Navigate to="/products" replace /> : <Navigate to="/login" replace />} />
        <Route path="*" element={user ? <Navigate to="/products" replace /> : <Navigate to="/login" replace />} />
      </Routes>

      {/* Toast Container - Renders on all pages */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;