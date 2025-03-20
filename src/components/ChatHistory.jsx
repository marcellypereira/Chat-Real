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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <motion.h2
        className="text-2xl font-bold text-gray-800"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        Histórico de Atendimentos
      </motion.h2>

      {historyChats.length === 0 ? (
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            <p className="text-gray-600">
              Não há atendimentos concluídos no histórico.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-lg shadow-md bg-white"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contato
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Telefone
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tempo de Espera
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tempo de Atendimento
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Detalhes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyChats.map((chat, index) => (
                  <React.Fragment key={chat.id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        expandedRow === chat.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => toggleRowExpansion(chat.id)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(chat.receivedAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {chat.contactName || 'Sem nome'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {chat.phoneNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            chat.waitTime > 120
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {formatSeconds(chat.waitTime)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            chat.attendTime > 300
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {formatSeconds(chat.attendTime)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
                        {expandedRow === chat.id
                          ? 'Ocultar detalhes'
                          : 'Ver detalhes'}
                      </td>
                    </motion.tr>

                    <AnimatePresence>
                      {expandedRow === chat.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <td colSpan={6} className="px-4 py-4 bg-gray-50">
                            <motion.div
                              className="rounded-md"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="bg-white p-3 rounded-md shadow-sm">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Recebido às:
                                  </p>
                                  <p className="font-medium">
                                    {chat.formattedTime?.received}
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-md shadow-sm">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Atendido às:
                                  </p>
                                  <p className="font-medium">
                                    {chat.formattedTime?.attended}
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-md shadow-sm">
                                  <p className="text-xs text-gray-500 mb-1">
                                    Concluído às:
                                  </p>
                                  <p className="font-medium">
                                    {chat.formattedTime?.finished}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
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
