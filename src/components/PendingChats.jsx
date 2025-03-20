import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { updateChatStatus } from '../services/socket';

const PendingChats = () => {
  const navigate = useNavigate();
  const { pendingChats, attendChat, formatSeconds, timers } = useStore();

  const handleAttendChat = (chatId) => {
    // Atualizar status do chat no servidor
    updateChatStatus(chatId, 'active');

    // Atualizar estado local
    attendChat(chatId);

    // Navegar para a tela de chats ativos
    navigate('/active');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        Solicitações Pendentes
      </h2>

      {pendingChats.length === 0 ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </motion.div>
            <p className="text-gray-600 mb-4">
              Não há solicitações pendentes no momento.
            </p>
            <p className="text-gray-700 mb-4">
              Para receber mensagens, conecte seu WhatsApp através do QR code na
              página inicial.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Ir para página inicial
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">
                    {chat.contactName || 'Contato sem nome'}
                  </h3>
                  <p className="text-gray-500">{chat.phoneNumber}</p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                  className="bg-amber-100 text-amber-700 font-medium px-3 py-1 rounded-full text-sm"
                >
                  Aguardando
                </motion.div>
              </div>

              <div className="mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Tempo de espera:
                  </span>
                  <motion.span
                    className="font-mono bg-gray-100 px-2 py-1 rounded text-sm"
                    animate={{
                      color:
                        timers[chat.id]?.elapsedTime > 60
                          ? '#ef4444'
                          : '#6b7280',
                    }}
                  >
                    {formatSeconds(timers[chat.id]?.elapsedTime)}
                  </motion.span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAttendChat(chat.id)}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex-grow flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  Atender
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PendingChats;
