import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const Layout = ({ children, isConnected }) => {
  const pendingChats = useStore((state) => state.pendingChats);
  const activeChats = useStore((state) => state.activeChats);
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <NavLink to="/" className="text-xl font-bold flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              Chat Real
            </motion.div>
          </NavLink>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-400' : 'bg-red-500'
              }`}
            />
            <span className="text-sm">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </motion.div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto">
          <ul className="flex flex-wrap">
            <li className="relative">
              <NavLink
                to="/pending"
                className={({ isActive }) =>
                  `block px-6 py-4 font-medium transition-colors relative ${
                    isActive
                      ? 'text-indigo-700'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Solicitações
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"
                        layoutId="activeTab"
                      />
                    )}
                    {pendingChats.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {pendingChats.length}
                      </motion.span>
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
                      ? 'text-indigo-700'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Em Atendimento
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"
                        layoutId="activeTab"
                      />
                    )}
                    {activeChats.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {activeChats.length}
                      </motion.span>
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
                      ? 'text-indigo-700'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Histórico
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"
                        layoutId="activeTab"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 p-4">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 p-3 text-center text-sm">
        <div className="container mx-auto">
          Chat Real &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
