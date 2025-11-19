import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/public/Login';
import RegisterForm from './pages/public/Register';
import EmailVerification from './pages/public/EmailVerification';
import Otp from './pages/public/Otp';
import ResetPassword from './pages/public/ResetPassword';
import ForgotPassword from './pages/public/ForgotPassword';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;