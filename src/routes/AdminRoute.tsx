import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
