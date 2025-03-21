import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const Layout = ({ children, isConnected }) => {
  const pendingChats = useStore((state) => state.pendingChats);
  const activeChats = useStore((state) => state.activeChats);
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen bg-secondary">
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <NavLink to="/" className="text-xl font-bold flex items-center">
            <div className="flex items-center">
              <img
                src="/logo-chat.png"
                alt="Chat Real Logo"
                className="h-8 mr-2"
              />
              Chat Real
            </div>
          </NavLink>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                isConnected ? 'bg-success' : 'bg-danger'
              }`}
            />
            <span className="text-sm">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>
      </header>

      <nav>
        <div className="container mx-auto">
          <ul className="flex flex-wrap">
            <li className="relative">
              <NavLink
                to="/pending"
                className={({ isActive }) =>
                  `block px-6 py-4 font-medium transition-colors relative ${
                    isActive
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Solicitações
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                        layoutId="activeTab"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    {pendingChats.length > 0 && (
                      <span className="absolute top-2 right-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingChats.length}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
            <li className="relative">
              <NavLink
                to="/active"
                className={({ isActive }) =>
                  `block px-6 py-4 font-medium transition-colors relative ${
                    isActive
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Em Atendimento
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                        layoutId="activeTab"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    {activeChats.length > 0 && (
                      <span className="absolute top-2 right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeChats.length}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `block px-6 py-4 font-medium transition-colors relative ${
                    isActive
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Histórico
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                        layoutId="activeTab"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex-1 overflow-auto bg-secondary p-4">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-primary text-white p-3 text-center text-sm">
        <div className="container mx-auto font-bold">
          Chat &copy; {new Date().getFullYear()} <br />
          Feito por: Marcelly Pereira.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
