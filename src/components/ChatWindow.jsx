import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import useStore from '../store/useStore';
import { sendMessage, updateChatStatus } from '../services/socket';

const ChatWindow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeChats, currentChat, selectChat, finishChat } = useStore();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const chatExists = activeChats.some((chat) => chat.id === id);

    if (!chatExists) {
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
    updateChatStatus(id, 'finished');
    finishChat(id);
    navigate('/history');
  };

  const handleSubmit = (values, { resetForm }) => {
    if (!values.content.trim()) return;
    sendMessage(id, values.content);
    resetForm();
  };

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-text-secondary">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-t-lg shadow-chat p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            {currentChat.contactName || 'Contato'}
          </h2>
          <p className="text-text-secondary">{currentChat.phoneNumber}</p>
        </div>
        <div>
          <button
            onClick={handleFinishChat}
            className="bg-success text-white font-bold py-2 px-6 rounded-md hover:opacity-90 transition-opacity shadow-sm"
          >
            Concluir Atendimento
          </button>
        </div>
      </div>

      <div className="flex-1 bg-secondary p-4 overflow-y-auto">
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
                  className={`max-w-md p-3 rounded-lg shadow-sm ${
                    message.sender === 'agent'
                      ? 'bg-primary-light text-text-primary'
                      : 'bg-white text-text-primary'
                  }`}
                >
                  <p className="mb-1">{message.content}</p>
                  <p className="text-xs text-text-secondary text-right">
                    {message.formattedTimestamp}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-text-secondary">
                Nenhuma mensagem ainda. Comece a conversa!
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-white rounded-b-lg shadow-chat p-4">
        <Formik initialValues={{ content: '' }} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Field
                  type="text"
                  name="content"
                  placeholder="Digite sua mensagem..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                className="bg-primary text-white h-12 px-6 rounded-md hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
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
