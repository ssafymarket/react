import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Router } from './routes/Router';
import { WebSocketProvider } from './contexts/WebSocketContext';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <Router />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </WebSocketProvider>
    </QueryClientProvider>
  );
}

export default App;
