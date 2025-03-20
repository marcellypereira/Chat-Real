import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import twilio from 'twilio';

const app = express();

// Configuração CORS mais segura que funciona tanto em dev quanto em produção
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || '*']
        : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Importante para processar dados de formulário do Twilio

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || '*']
        : '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'], // Suporta polling como fallback
});

// Conjunto para rastrear mensagens já processadas com mais detalhes
const processedMessageIds = new Set();

// Verificar se as variáveis de ambiente do Twilio estão definidas
if (
  !process.env.TWILIO_ACCOUNT_SID ||
  !process.env.TWILIO_AUTH_TOKEN ||
  !process.env.TWILIO_PHONE_NUMBER
) {
  console.error(
    '⚠️ Variáveis de ambiente do Twilio não definidas. Por favor, configure seu arquivo .env',
  );
}

// Inicializar cliente Twilio
let twilioClient;
try {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );
  console.log('✅ Cliente Twilio inicializado com sucesso');
} catch (error) {
  console.error('❌ Erro ao inicializar cliente Twilio:', error);
}

// Armazenar chats ativos (em produção, use um banco de dados)
const chats = new Map();

// Função para encontrar chat existente por número de telefone
const findChatByPhoneNumber = (phoneNumber) => {
  for (const [id, chat] of chats.entries()) {
    if (chat.phoneNumber === phoneNumber) {
      return { id, chat };
    }
  }
  return null;
};

// Conexão WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Quando o agente envia uma mensagem
  socket.on('send_message', async (data) => {
    try {
      console.log('Recebida solicitação para enviar mensagem:', data);

      // Obter dados do chat
      const chat = chats.get(data.chatId);

      if (!chat) {
        socket.emit('error', { message: 'Chat não encontrado' });
        return;
      }

      // Validar mensagem
      if (!data.content || data.content.trim() === '') {
        socket.emit('error', { message: 'Mensagem inválida' });
        return;
      }

      // Criar ID único para mensagem
      const messageId = `outgoing-${data.chatId}-${data.content}-${Date.now()}`;

      // Verificar duplicatas
      if (processedMessageIds.has(messageId)) {
        console.warn('🚫 Tentativa de enviar mensagem duplicada');
        return;
      }

      // Marcar como processada
      processedMessageIds.add(messageId);
      setTimeout(() => processedMessageIds.delete(messageId), 5000);

      // Formatar número para o formato Twilio
      const to = chat.phoneNumber.startsWith('whatsapp:')
        ? chat.phoneNumber
        : `whatsapp:${chat.phoneNumber}`;

      console.log('Enviando mensagem via Twilio para:', to);

      // Enviar mensagem via Twilio
      await twilioClient.messages.create({
        body: data.content,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to,
      });

      // Emitir confirmação de envio
      socket.emit('message_sent', {
        chatId: data.chatId,
        status: 'sent',
      });

      // Emitir nova mensagem para todos os clientes
      io.emit('new_message', {
        chatId: data.chatId,
        content: data.content,
        sender: 'agent',
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      socket.emit('error', {
        message: 'Erro ao enviar mensagem',
        error: error.message,
      });
    }
  });

  // Quando o status do chat é atualizado
  socket.on('update_chat_status', (data) => {
    if (chats.has(data.chatId)) {
      const chat = chats.get(data.chatId);
      chat.status = data.status;
      chats.set(data.chatId, chat);

      // Emitir atualização de status para todos os clientes
      io.emit('chat_status_updated', data);
    }
  });

  // Desconexão
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Webhook para receber mensagens do Twilio
app.post('/webhook/whatsapp', (req, res) => {
  const { From, Body, ProfileName, MessageSid, SmsSid } = req.body;

  // Log detalhado de entrada
  console.log('📥 Webhook recebido:', {
    from: From,
    body: Body,
    profileName: ProfileName,
    messageSid: MessageSid || SmsSid,
    timestamp: new Date().toISOString(),
  });

  // Criar ID de mensagem mais específico
  const messageId = `${From}-${Body}-${MessageSid || SmsSid || Date.now()}`;

  // Verificar duplicatas com mais precisão
  if (processedMessageIds.has(messageId)) {
    console.log('🔄 Mensagem duplicada detectada e ignorada:', {
      messageId,
      from: From,
      body: Body,
    });
    return res.status(200).send('Duplicata ignorada');
  }

  // Marcar como processada
  processedMessageIds.add(messageId);
  setTimeout(() => {
    processedMessageIds.delete(messageId);
    console.log('🗑️ ID de mensagem removido do cache:', messageId);
  }, 10 * 60 * 1000); // 10 minutos

  if (!From || !Body) {
    console.error('❌ Dados incompletos na mensagem:', req.body);
    return res.status(400).send('Parâmetros incompletos');
  }

  // Verificar se já existe um chat para este número
  const existingChat = findChatByPhoneNumber(From);
  let chatId;

  if (existingChat) {
    // Atualizar chat existente
    const chat = existingChat.chat;
    chatId = existingChat.id;
    console.log(
      `📝 Atualizando chat existente: ${chatId}, status atual: ${chat.status}`,
    );

    // Adicionar nova mensagem ao chat existente
    const message = {
      id: `msg-${Date.now()}`,
      content: Body,
      sender: 'user',
      timestamp: new Date(),
      formattedTimestamp: new Date().toLocaleTimeString('pt-BR'),
    };

    chat.messages.push(message);
    chat.lastMessage = Body;

    // IMPORTANTE: Só mova para pendentes se o status for 'finished'
    // Se já estiver em atendimento ('active'), NUNCA mova para pendentes
    if (chat.status === 'finished') {
      console.log(
        `🔄 Movendo chat concluído de volta para solicitações: ${chatId}`,
      );

      // Mudar status para pendente
      chat.status = 'pending';

      // Atualizar timestamp
      chat.receivedAt = new Date();
      if (chat.formattedTime) {
        chat.formattedTime.received = new Date().toLocaleTimeString('pt-BR');
      } else {
        chat.formattedTime = {
          received: new Date().toLocaleTimeString('pt-BR'),
        };
      }

      // Emitir eventos
      io.emit('chat_moved_to_pending', { chatId, chat });
      io.emit('new_chat_request', chat);
    } else {
      console.log(
        `📌 Chat ${chatId} permanece no status atual: ${chat.status}`,
      );
    }

    // Salvar o chat
    chats.set(chatId, chat);

    // Sempre emitir o evento de nova mensagem
    io.emit('new_message', {
      chatId,
      content: Body,
      sender: 'user',
    });
  } else {
    // Criar um novo chat com ID único incluindo timestamp
    chatId = `chat-${From.replace(/\D/g, '')}-${Date.now()}`;

    const newChat = {
      id: chatId,
      contactName: ProfileName || 'Cliente',
      phoneNumber: From,
      status: 'pending',
      messages: [
        {
          id: `msg-${Date.now()}`,
          content: Body,
          sender: 'user',
          timestamp: new Date(),
          formattedTimestamp: new Date().toLocaleTimeString('pt-BR'),
        },
      ],
      lastMessage: Body,
      receivedAt: new Date(),
      formattedTime: {
        received: new Date().toLocaleTimeString('pt-BR'),
      },
    };

    chats.set(chatId, newChat);

    console.log(`✅ Novo chat criado: ${chatId}`);

    // Emitir evento de nova solicitação de chat
    io.emit('new_chat_request', newChat);
  }

  console.log('✅ Resposta enviada ao Twilio');
  res.status(200).send('OK');
});

// Rota para verificar a saúde do servidor
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    twilioConfigured: !!twilioClient,
    activeChats: chats.size,
    processedMessages: processedMessageIds.size,
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rota para validar o webhook do Twilio (necessário para confirmação)
app.get('/webhook/whatsapp', (req, res) => {
  res.status(200).send('Webhook configurado corretamente');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
🚀 Servidor rodando na porta ${PORT}
🌐 Ambiente: ${process.env.NODE_ENV || 'development'}
🔗 Use http://localhost:${PORT}/health para verificar a saúde do servidor
  `);
});
