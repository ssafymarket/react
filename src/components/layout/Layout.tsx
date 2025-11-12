import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingWriteButton } from '../common/FloatingWriteButton';
import { useAuthStore } from '@/store/authStore';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="w-full flex-1">
        {children}
      </main>
      <Footer />
      {isLoggedIn && <FloatingWriteButton />}
    </div>
  );
};
