import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useStore from '../store/useStore';
import { sendMessage, updateChatStatus } from '../services/socket';

const messageSchema = Yup.object().shape({
  content: Yup.string()
    .required('Digite uma mensagem')
    .max(1000, 'Mensagem muito longa (máx. 1000 caracteres)'),
});

const ChatWindow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    activeChats,
    currentChat,
    selectChat,
    finishChat,
    formatSeconds,
    timers,
  } = useStore();
  const messagesEndRef = useRef(null);

  // Scroll para o final da conversa quando novas mensagens são adicionadas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Selecionar o chat correto ao abrir a página
  useEffect(() => {
    // Verificar se o chat existe nos ativos
    const chatExists = activeChats.some((chat) => chat.id === id);

    if (!chatExists) {
      // Redirecionar para a página de chats ativos se não encontrado
      navigate('/active');
      return;
    }

    if (!currentChat || currentChat.id !== id) {
      selectChat(id);
    }
  }, [id, activeChats, currentChat, selectChat, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleFinishChat = () => {
    // Atualizar status no servidor
    updateChatStatus(id, 'finished');

    // Atualizar estado local
    finishChat(id);

    // Redirecionar para histórico
    navigate('/history');
  };

  const handleSubmit = (values, { resetForm }) => {
    if (!values.content.trim()) return;

    // Enviar mensagem
    sendMessage(id, values.content);

    // Limpar formulário
    resetForm();
  };

  // Renderizar mensagem de carregamento se não tiver chat
  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-secondary-600">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white rounded-t-lg shadow-md p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">
            {currentChat.contactName || 'Contato'}
          </h2>
          <p className="text-secondary-500">{currentChat.phoneNumber}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-secondary-600">
            <p>Recebido: {currentChat.formattedTime?.received}</p>
            <p>Atendido: {currentChat.formattedTime?.attended}</p>
            <p>
              Tempo de atendimento: {formatSeconds(timers[id]?.elapsedTime)}
            </p>
          </div>
          <button onClick={handleFinishChat} className="btn btn-success">
            Concluir Atendimento
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-secondary-50 p-4 overflow-y-auto">
        <div className="space-y-4">
          {currentChat.messages && currentChat.messages.length > 0 ? (
            currentChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'agent' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-md p-3 rounded-lg ${
                    message.sender === 'agent'
                      ? 'bg-primary-100 text-primary-900'
                      : 'bg-white text-secondary-900 shadow-sm'
                  }`}
                >
                  <p className="mb-1">{message.content}</p>
                  <p className="text-xs text-secondary-500 text-right">
                    {message.formattedTimestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary-500">
                Nenhuma mensagem ainda. Comece a conversa!
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white rounded-b-lg shadow-md p-4">
        <Formik
          initialValues={{ content: '' }}
          validationSchema={messageSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Field
                  type="text"
                  name="content"
                  placeholder="Digite sua mensagem..."
                  className="input w-full px-4 py-3"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="absolute text-sm text-danger mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary h-12 px-6"
              >
                Enviar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChatWindow;
