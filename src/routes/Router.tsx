import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { ProductNewPage } from '@/pages/ProductNewPage';
import { MyPage } from '@/pages/MyPage';
import { MySellingPage } from '@/pages/MySellingPage';
import { MyLikedPage } from '@/pages/MyLikedPage';
import { MyTransactionsPage } from '@/pages/MyTransactionsPage';
import { ChatListPage } from '@/pages/ChatListPage';
import { AdminPage } from '@/pages/AdminPage';
import { TeamPage } from '@/pages/TeamPage';
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
        <Route path="/team" element={<TeamPage />} />

        {/* Product Routes - 중요: /products/new를 /products/:id보다 먼저! */}
        <Route path="/products/new" element={<PrivateRoute><ProductNewPage /></PrivateRoute>} />
        <Route path="/products/:id/edit" element={<PrivateRoute><ProductNewPage /></PrivateRoute>} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/* Private Routes */}
        <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
        <Route path="/my/selling" element={<PrivateRoute><MySellingPage /></PrivateRoute>} />
        <Route path="/my/liked" element={<PrivateRoute><MyLikedPage /></PrivateRoute>} />
        <Route path="/my/transactions" element={<PrivateRoute><MyTransactionsPage /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatListPage /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
};
