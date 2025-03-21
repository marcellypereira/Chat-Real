import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ChatHistory = () => {
  const { historyChats, formatSeconds } = useStore();
  const [expandedRow, setExpandedRow] = useState(null);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Animações mais sutis
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const rowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Histórico de Atendimentos</h2>

      {historyChats.length === 0 ? (
        <motion.div className="p-8" variants={rowVariants}>
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-text-primary-400">
              Não há atendimentos concluídos no histórico.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={rowVariants}
          className="overflow-hidden rounded-lg shadow-chat bg-white"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Data
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Contato
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Telefone
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Tempo de Espera
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Tempo de Atendimento
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Detalhes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyChats.map((chat) => (
                  <React.Fragment key={chat.id}>
                    <tr
                      className={`cursor-pointer ${
                        expandedRow === chat.id ? '' : ''
                      }`}
                      onClick={() => toggleRowExpansion(chat.id)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                        {formatDate(chat.receivedAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                        {chat.contactName || 'Sem nome'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                        {chat.phoneNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            chat.waitTime > 120
                              ? 'bg-danger/10 text-danger'
                              : 'bg-success/10 text-success'
                          }`}
                        >
                          {formatSeconds(chat.waitTime)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            chat.attendTime > 300
                              ? 'bg-warning/10 text-warning'
                              : 'bg-success/10 text-success'
                          }`}
                        >
                          {formatSeconds(chat.attendTime)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-primary font-medium">
                        {expandedRow === chat.id
                          ? 'Ocultar detalhes'
                          : 'Ver detalhes'}
                      </td>
                    </tr>

                    <AnimatePresence>
                      {expandedRow === chat.id && (
                        <motion.tr
                          variants={expandVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <td colSpan={6} className="px-4 py-4">
                            <div className="rounded-md">
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className=" p-3">
                                  <p className="text-xs mb-1">Recebido às:</p>
                                  <p className="font-medium text-text-primary">
                                    {chat.formattedTime?.received}
                                  </p>
                                </div>
                                <div className=" p-3">
                                  <p className="text-xs mb-1">Atendido às:</p>
                                  <p className="font-medium text-text-primary">
                                    {chat.formattedTime?.attended}
                                  </p>
                                </div>
                                <div className=" p-3">
                                  <p className="text-xs mb-1">Concluído às:</p>
                                  <p className="font-medium text-text-primary">
                                    {chat.formattedTime?.finished}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatHistory;
