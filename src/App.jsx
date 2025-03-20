import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeSocket } from './services/socket';
import { AnimatePresence } from 'framer-motion';

// Componentes
import Layout from './components/Layout';
import PendingChats from './components/PendingChats';
import ActiveChats from './components/ActiveChats';
import ChatHistory from './components/ChatHistory';
import ChatWindow from './components/ChatWindow';
import Welcome from './components/Welcome';

// Criar cliente React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Componente para envolver as rotas com AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Welcome />} />
        <Route path="/pending" element={<PendingChats />} />
        <Route path="/active" element={<ActiveChats />} />
        <Route path="/history" element={<ChatHistory />} />
        <Route path="/chat/:id" element={<ChatWindow />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Inicializar WebSocket
    const socket = initializeSocket();

    // Monitorar estado da conexão
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout isConnected={isConnected}>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
