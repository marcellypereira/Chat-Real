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

  // Animações mais sutis
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Atendimentos em Andamento</h2>

      {activeChats.length === 0 ? (
        <motion.div className="p-8" variants={itemVariants}>
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-text-primary-400 mb-4"
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
            <p className="text-text-primary-400 mb-2">
              Não há atendimentos em andamento no momento.
            </p>
            <p className="text-text-primary-400 mt-2 mb-4">
              Vá para a aba "Solicitações" para atender novas mensagens.
            </p>
            <button
              onClick={() => navigate('/pending')}
              className="bg-primary text-white py-2 px-6 rounded-md hover:opacity-90 transition-opacity"
            >
              Ver Solicitações
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              className="bg-white rounded-lg shadow-chat p-4 border-l-4 border-primary"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">
                    {chat.contactName || 'Contato sem nome'}
                  </h3>
                  <p className="text-text-secondary">{chat.phoneNumber}</p>
                </div>
                <div className="bg-primary/20 text-primary font-medium px-3 py-1 rounded-full text-sm">
                  Em atendimento
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle
                      className={`h-4 w-4 ${
                        selectedServices[chat.id]?.chat
                          ? 'text-primary'
                          : 'text-text-secondary'
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
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone
                      className={`h-4 w-4 ${
                        selectedServices[chat.id]?.voice
                          ? 'text-primary'
                          : 'text-text-secondary'
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
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video
                      className={`h-4 w-4 ${
                        selectedServices[chat.id]?.video
                          ? 'text-primary'
                          : 'text-text-secondary'
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
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <button
                onClick={() => handleStartChat(chat.id)}
                disabled={!isServiceSelected(chat.id)}
                className={`w-full flex items-center justify-center py-2 rounded-lg transition-opacity ${
                  isServiceSelected(chat.id)
                    ? 'bg-primary text-white hover:opacity-90'
                    : 'bg-gray-200 text-text-secondary cursor-not-allowed'
                }`}
              >
                <Check className="mr-2 h-5 w-5" />
                Iniciar Atendimento
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ActiveChats;
