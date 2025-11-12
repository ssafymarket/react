import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { ProductNewPage } from '@/pages/ProductNewPage';
import { MyPage } from '@/pages/MyPage';
import { ChatListPage } from '@/pages/ChatListPage';
import { AdminPage } from '@/pages/AdminPage';
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Product Routes - 중요: /products/new를 /products/:id보다 먼저! */}
        <Route path="/products/new" element={<PrivateRoute><ProductNewPage /></PrivateRoute>} />
        <Route path="/products/:id/edit" element={<PrivateRoute><ProductNewPage /></PrivateRoute>} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/* Private Routes */}
        <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatListPage /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
};
