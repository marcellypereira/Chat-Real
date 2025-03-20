import { initializeSocket } from '../services/socket';
import useStore from '../store/useStore';

// Função para simular novas solicitações de chat
export const simulateNewChatRequest = () => {
  // Garantir que o socket está inicializado
  const socket = initializeSocket();
  const addPendingChat = useStore.getState().addPendingChat;

  // Lista de nomes para simulação
  const names = [
    'Maria Silva',
    'João Santos',
    'Ana Oliveira',
    'Pedro Almeida',
    'Carla Sousa',
    'Roberto Lima',
  ];

  // Mensagens iniciais para simulação
  const initialMessages = [
    'Olá, preciso de ajuda com meu pedido.',
    'Bom dia, gostaria de saber sobre o produto X.',
    'Oi, tive um problema com a entrega.',
    'Preciso de informações sobre pagamento.',
    'Quero fazer uma reclamação.',
    'Estou com dúvidas sobre o uso do aplicativo.',
  ];

  // Gerar número de telefone aleatório
  const generatePhone = () => {
    const ddd = Math.floor(Math.random() * 90) + 10;
    const part1 = Math.floor(Math.random() * 9000) + 1000;
    const part2 = Math.floor(Math.random() * 9000) + 1000;
    return `+55${ddd}9${part1}${part2}`;
  };

  // Selecionar aleatoriamente um nome e mensagem
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomMessage =
    initialMessages[Math.floor(Math.random() * initialMessages.length)];
  const phone = generatePhone();

  // Criar dados do chat
  const chatData = {
    id: `chat-${Date.now()}`,
    contactName: randomName,
    phoneNumber: phone,
    lastMessage: randomMessage,
    messages: [
      {
        id: `msg-${Date.now()}`,
        content: randomMessage,
        sender: 'user',
        timestamp: new Date(),
        formattedTimestamp: new Date().toLocaleTimeString('pt-BR'),
      },
    ],
  };

  // Simular evento de nova solicitação
  if (socket.connected) {
    socket.emit('new_chat_request', chatData);
  } else {
    // Se o socket não estiver conectado, adicionar diretamente
    addPendingChat(chatData);
  }

  console.log('Nova solicitação simulada:', chatData);
  return chatData;
};

// Função para simular uma nova mensagem para um chat ativo
export const simulateNewMessage = (chatId) => {
  if (!chatId) return;

  // Garantir que o socket está inicializado
  const socket = initializeSocket();
  const addMessage = useStore.getState().addMessage;

  // Mensagens para simulação
  const messages = [
    'Ainda estou aguardando uma solução.',
    'Preciso de mais informações, por favor.',
    'Quando isso será resolvido?',
    'Obrigado pela ajuda!',
    'Entendi, vou verificar aqui.',
    'Pode me dar mais detalhes?',
  ];

  // Selecionar aleatoriamente uma mensagem
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  // Criar dados da mensagem
  const messageData = {
    chatId,
    content: randomMessage,
    sender: 'user',
  };

  // Simular evento de nova mensagem
  if (socket.connected) {
    socket.emit('new_message', messageData);
  } else {
    // Se o socket não estiver conectado, adicionar diretamente
    addMessage(chatId, {
      content: randomMessage,
      sender: 'user',
    });
  }

  console.log('Nova mensagem simulada:', messageData);
  return messageData;
};

// Função para iniciar simulação automática
export const startSimulation = (interval = 30000) => {
  // Simular uma solicitação inicial
  simulateNewChatRequest();

  // Configurar intervalo para simular novas solicitações periodicamente
  const requestInterval = setInterval(() => {
    simulateNewChatRequest();
  }, interval);

  // Configurar intervalo para simular novas mensagens em chats ativos
  const messageInterval = setInterval(() => {
    const { activeChats } = useStore.getState();

    if (activeChats.length > 0) {
      // Selecionar aleatoriamente um chat ativo
      const randomChat =
        activeChats[Math.floor(Math.random() * activeChats.length)];
      simulateNewMessage(randomChat.id);
    }
  }, interval / 2);

  return {
    stop: () => {
      clearInterval(requestInterval);
      clearInterval(messageInterval);
    },
  };
};

// Exportar funções para uso no desenvolvimento
export default {
  simulateNewChatRequest,
  simulateNewMessage,
  startSimulation,
};
