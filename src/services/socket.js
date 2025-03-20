import { io } from 'socket.io-client';
import useStore from '../store/useStore';

// URL do servidor WebSocket
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Configuração do socket
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

// Objeto para rastrear eventos processados recentemente
const eventTracker = {
  chats: {},
  messages: {},
};

// Função para verificar e registrar evento
const processEvent = (type, event, callback) => {
  // Chave única para o evento
  const key =
    type === 'chat'
      ? `${event.phoneNumber}-${event.id}`
      : `${event.chatId}-${event.sender}-${event.content}`;

  const now = Date.now();

  // Limpar eventos antigos
  Object.keys(eventTracker[type + 's']).forEach((k) => {
    if (now - eventTracker[type + 's'][k] > 2000) {
      delete eventTracker[type + 's'][k];
    }
  });

  // Verificar se já processamos este evento recentemente
  if (eventTracker[type + 's'][key]) {
    console.log(`🔄 Evento ${type} duplicado ignorado:`, key);
    return false;
  }

  // Registrar o evento
  eventTracker[type + 's'][key] = now;

  // Executar callback
  callback(event);
  return true;
};

// Inicializar conexão com o WebSocket
export const initializeSocket = () => {
  // Obter funções do store
  const storeState = useStore.getState();
  const addPendingChat = storeState.addPendingChat;
  const addMessage = storeState.addMessage;
  const moveToRequests = storeState.moveToRequests;

  // Conectar ao servidor
  if (!socket.connected) {
    socket.connect();
  }

  // Receber nova solicitação de chat
  socket.on('new_chat_request', (data) => {
    console.log('📩 Nova solicitação de chat recebida:', data);

    // Validar dados do chat
    if (!data || !data.id || !data.phoneNumber) {
      console.error(
        '❌ Dados inválidos recebidos para nova solicitação de chat',
      );
      return;
    }

    // Processar com verificação de duplicata
    processEvent('chat', data, addPendingChat);
  });

  // Receber novas mensagens
  socket.on('new_message', (data) => {
    console.log('📨 Nova mensagem recebida:', data);

    // Validar dados da mensagem
    if (!data || !data.chatId || !data.content || !data.sender) {
      console.error('❌ Dados de mensagem inválidos ou incompletos:', data);
      return;
    }

    // Processar com verificação de duplicata
    processEvent('message', data, (message) => {
      addMessage(message.chatId, {
        content: message.content,
        sender: message.sender,
      });
    });
  });

  // Receber evento de chat movido para pendentes
  socket.on('chat_moved_to_pending', (data) => {
    console.log('🔄 Chat movido para pendentes recebido:', data);

    // Validar dados
    if (!data || !data.chatId || !data.chat) {
      console.error(
        '❌ Dados inválidos recebidos para mover chat para pendentes',
      );
      return;
    }

    // Processar o evento
    moveToRequests(data.chatId, data.chat);
  });

  // Tratamento de eventos de conexão
  socket.on('connect', () => {
    console.log('🔌 Conectado ao servidor WebSocket');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Desconectado do servidor WebSocket');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Erro na conexão WebSocket:', error);
  });

  return socket;
};

// Enviar mensagem via WebSocket
export const sendMessage = (chatId, message) => {
  if (!socket.connected) {
    console.warn('⚠️ Socket não está conectado. Tentando reconectar...');
    socket.connect();
  }

  // Validar mensagem
  if (!message || message.trim() === '') {
    console.warn('⚠️ Tentativa de enviar mensagem vazia ignorada');
    return;
  }

  // Verificar duplicata antes de enviar
  const key = `${chatId}-${message}`;
  const now = Date.now();

  // Limpar chaves antigas
  Object.keys(eventTracker.messages).forEach((k) => {
    if (now - eventTracker.messages[k] > 2000) {
      delete eventTracker.messages[k];
    }
  });

  // Verificar se já enviamos esta mensagem recentemente
  if (eventTracker.messages[key]) {
    console.warn('⚠️ Tentativa de enviar mensagem duplicada ignorada');
    return;
  }

  // Registrar envio
  eventTracker.messages[key] = now;

  // Enviar a mensagem para o servidor
  socket.emit('send_message', {
    chatId,
    content: message,
    sender: 'agent',
  });

  // Também adiciona a mensagem localmente para atualização da UI
  useStore.getState().addMessage(chatId, {
    content: message,
    sender: 'agent',
  });
};

// Enviar status de atendimento
export const updateChatStatus = (chatId, status) => {
  if (!socket.connected) {
    console.warn('⚠️ Socket não está conectado. Tentando reconectar...');
    socket.connect();
  }

  socket.emit('update_chat_status', {
    chatId,
    status,
  });
};

export default socket;
