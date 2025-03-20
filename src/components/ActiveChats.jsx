import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { MessageCircle, Phone, Video, Check } from 'lucide-react';

const ActiveChats = () => {
  const navigate = useNavigate();
  const { activeChats, selectChat } = useStore();
  const [selectedServices, setSelectedServices] = useState({});

  // Alterna o serviço selecionado para um chat específico
  const toggleService = (chatId, service) => {
    setSelectedServices((prev) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        [service]: !prev[chatId]?.[service],
      },
    }));
  };

  // Verifica se pelo menos um serviço está selecionado
  const isServiceSelected = (chatId) => {
    const services = selectedServices[chatId] || {};
    return Object.values(services).some((value) => value);
  };

  // Iniciar atendimento
  const handleStartChat = (chatId) => {
    // Localizar o chat na lista de chats ativos
    const chatToSelect = activeChats.find((chat) => chat.id === chatId);

    if (chatToSelect) {
      console.log('Selecionando chat:', chatToSelect);
      selectChat(chatToSelect);
      navigate(`/chat/${chatId}`);
    } else {
      console.error('Chat não encontrado:', chatId);
      navigate('/active');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        Atendimentos em Andamento
      </h2>

      {activeChats.length === 0 ? (
        <motion.div
          className="bg-white rounded-lg shadow-md p-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="text-center">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </motion.div>
            <p className="text-gray-600 mb-2">
              Não há atendimentos em andamento no momento.
            </p>
            <p className="text-gray-600 mt-2 mb-4">
              Vá para a aba "Solicitações" para atender novas mensagens.
            </p>
            <button
              onClick={() => navigate('/pending')}
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Ver Solicitações
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeChats.map((chat, index) => (
            <div
              key={chat.id}
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">
                    {chat.contactName || 'Contato sem nome'}
                  </h3>
                  <p className="text-gray-500">{chat.phoneNumber}</p>
                </div>
                <div className="bg-indigo-100 text-indigo-700 font-medium px-3 py-1 rounded-full text-sm">
                  Em atendimento
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle
                      className={`h-4 w-4 ${
                        selectedServices[chat.id]?.chat
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <span className="text-sm">Conversar</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!selectedServices[chat.id]?.chat}
                      onChange={() => toggleService(chat.id, 'chat')}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone
                      className={`h-4 w-4 ${
                        selectedServices[chat.id]?.voice
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <span className="text-sm">Ligação</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!selectedServices[chat.id]?.voice}
                      onChange={() => toggleService(chat.id, 'voice')}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video
                      className={`h-4 w-4 ${
                        selectedServices[chat.id]?.video
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <span className="text-sm">Vídeo</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!selectedServices[chat.id]?.video}
                      onChange={() => toggleService(chat.id, 'video')}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <button
                onClick={() => handleStartChat(chat.id)}
                disabled={!isServiceSelected(chat.id)}
                className={`w-full flex items-center justify-center py-2 rounded-lg transition-colors ${
                  isServiceSelected(chat.id)
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Check className="mr-2 h-5 w-5" />
                Iniciar Atendimento
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ActiveChats;
