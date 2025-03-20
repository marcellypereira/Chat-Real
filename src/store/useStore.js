import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const useStore = create(
  devtools((set, get) => ({
    // Listas de atendimentos
    pendingChats: [],
    activeChats: [],
    historyChats: [],

    // Chat atual selecionado
    currentChat: null,

    // Timestamps para controle de tempo
    timers: {},

    // Conjunto para rastrear IDs de chats já processados
    processedChatIds: new Set(),

    // Conjunto para rastrear mensagens duplicadas
    processedMessageIds: new Set(),

    // Verificar se já existe um chat com o mesmo número de telefone
    findChatByPhoneNumber: (phoneNumber, list) => {
      return list.find((chat) => chat.phoneNumber === phoneNumber);
    },

    // Selecionar chat
    selectChat: (chat) => {
      // Se for passado um ID, encontrar o chat correspondente
      if (typeof chat === 'string') {
        console.log('Selecionando chat por ID:', chat);

        const activeChat = get().activeChats.find((c) => c.id === chat);
        if (activeChat) {
          set({ currentChat: activeChat });
          return activeChat;
        }

        const pendingChat = get().pendingChats.find((c) => c.id === chat);
        if (pendingChat) {
          set({ currentChat: pendingChat });
          return pendingChat;
        }

        console.error('Chat não encontrado:', chat);
        return null;
      }

      // Se for passado o objeto do chat diretamente
      console.log('Selecionando chat por objeto:', chat);
      set({ currentChat: chat });
      return chat;
    },

    // Concluir um atendimento
    finishChat: (chatId) => {
      console.log('🚨 Iniciando finishChat para:', chatId);
      console.log('📋 Chats ativos antes:', get().activeChats);

      // Tentar encontrar o chat em ativos primeiro
      let chat = get().activeChats.find((c) => c.id === chatId);

      // Se não encontrar em ativos, procurar em pendentes
      if (!chat) {
        chat = get().pendingChats.find((c) => c.id === chatId);
      }

      // Se ainda não encontrar
      if (!chat) {
        console.error('❌ Chat não encontrado em nenhuma lista:', chatId);
        console.log('📊 Chats ativos:', get().activeChats);
        console.log('📊 Chats pendentes:', get().pendingChats);

        // Forçar criação de um chat de histórico com informações mínimas
        chat = {
          id: chatId,
          status: 'finished',
          contactName: 'Chat Desconhecido',
          phoneNumber: 'Número não disponível',
          finishedAt: new Date(),
          formattedTime: {
            finished: format(new Date(), 'HH:mm:ss', { locale: ptBR }),
          },
        };
      }

      // Parar o timer
      const timers = get().timers;
      if (timers[chatId]?.interval) {
        clearInterval(timers[chatId].interval);
      }

      const finishedAt = new Date();

      // Criar uma cópia do chat com o status atualizado
      const updatedChat = {
        ...chat,
        status: 'finished',
        finishedAt,
        formattedTime: {
          ...chat.formattedTime,
          finished: format(finishedAt, 'HH:mm:ss', { locale: ptBR }),
        },
        attendTime: timers[chatId]?.elapsedTime || 0, // Tempo de atendimento em segundos
      };

      delete timers[chatId];

      console.log('✅ Chat atualizado:', updatedChat);

      const result = set((state) => {
        const newActiveChats = state.activeChats.filter((c) => c.id !== chatId);
        const newPendingChats = state.pendingChats.filter(
          (c) => c.id !== chatId,
        );
        const newHistoryChats = [...state.historyChats, updatedChat];

        console.log('🔄 Novos chats ativos:', newActiveChats);
        console.log('🔄 Novos chats pendentes:', newPendingChats);
        console.log('🔄 Novos chats no histórico:', newHistoryChats);

        return {
          activeChats: newActiveChats,
          pendingChats: newPendingChats,
          historyChats: newHistoryChats,
          currentChat: null,
          timers,
        };
      });

      console.log('🏁 Resultado do finishChat:', result);
      return updatedChat;
    },

    // Resto do código permanece igual ao anterior
    // (addPendingChat, attendChat, addMessage, formatSeconds, etc.)
    // Copiar o resto do código original aqui...

    // Adicionar nova solicitação pendente
    addPendingChat: (chat) => {
      const state = get();

      // Verificar duplicatas com base em número de telefone e timestamp
      const chatIdentifier = `${chat.phoneNumber}-${chat.receivedAt}`;

      if (state.processedChatIds.has(chatIdentifier)) {
        console.log('🚫 Chat duplicado ignorado:', chatIdentifier);
        return;
      }

      // Adicionar ao conjunto de chats processados
      state.processedChatIds.add(chatIdentifier);

      // Limpar IDs processados após 5 minutos
      setTimeout(() => {
        state.processedChatIds.delete(chatIdentifier);
      }, 5 * 60 * 1000);

      const newChat = {
        ...chat,
        status: 'pending',
        receivedAt: chat.receivedAt || new Date(),
        formattedTime: {
          received: format(chat.receivedAt || new Date(), 'HH:mm:ss', {
            locale: ptBR,
          }),
          ...chat.formattedTime,
        },
      };

      // Verificar duplicatas nas listas existentes
      const isDuplicate =
        state.pendingChats.some((c) => c.phoneNumber === newChat.phoneNumber) ||
        state.activeChats.some((c) => c.phoneNumber === newChat.phoneNumber) ||
        state.historyChats.some((c) => c.phoneNumber === newChat.phoneNumber);

      if (isDuplicate) {
        console.log('🚫 Chat com este número já existe:', newChat.phoneNumber);
        return;
      }

      // Iniciar timer para este chat
      const timers = get().timers;
      if (!timers[newChat.id]) {
        timers[newChat.id] = {
          startTime: new Date(),
          elapsedTime: 0,
          interval: setInterval(() => {
            const currentTimers = get().timers;
            const startTime = currentTimers[newChat.id]?.startTime;
            if (startTime) {
              const elapsedTime = Math.floor((new Date() - startTime) / 1000);
              set((state) => ({
                timers: {
                  ...state.timers,
                  [newChat.id]: {
                    ...state.timers[newChat.id],
                    elapsedTime,
                  },
                },
              }));
            }
          }, 1000),
        };
      }

      set((state) => ({
        pendingChats: [...state.pendingChats, newChat],
        timers,
      }));
    },

    // Atender um chat
    attendChat: (chatId) => {
      const chat = get().pendingChats.find((c) => c.id === chatId);
      if (!chat) return;

      // Parar o timer anterior e iniciar um novo
      const timers = get().timers;
      if (timers[chatId]?.interval) {
        clearInterval(timers[chatId].interval);
      }

      const attendedAt = new Date();

      // Criar uma cópia do chat com o status atualizado
      const updatedChat = {
        ...chat,
        status: 'active',
        attendedAt,
        formattedTime: {
          ...chat.formattedTime,
          attended: format(attendedAt, 'HH:mm:ss', { locale: ptBR }),
        },
        waitTime: timers[chatId]?.elapsedTime || 0, // Tempo de espera em segundos
      };

      // Iniciar novo timer para contabilizar tempo de atendimento
      timers[chatId] = {
        startTime: new Date(),
        elapsedTime: 0,
        interval: setInterval(() => {
          const currentTimers = get().timers;
          const startTime = currentTimers[chatId]?.startTime;
          if (startTime) {
            const elapsedTime = Math.floor((new Date() - startTime) / 1000);
            set((state) => ({
              timers: {
                ...state.timers,
                [chatId]: {
                  ...state.timers[chatId],
                  elapsedTime,
                },
              },
            }));
          }
        }, 1000),
      };

      set((state) => ({
        pendingChats: state.pendingChats.filter((c) => c.id !== chatId),
        activeChats: [...state.activeChats, updatedChat],
        currentChat: updatedChat,
        timers,
      }));
    },

    // Adicionar mensagem ao chat
    addMessage: (chatId, message) => {
      const state = get();
      const timestamp = new Date();
      const formattedTimestamp = format(timestamp, 'HH:mm', { locale: ptBR });

      // Criar identificador único para a mensagem
      const messageIdentifier = `${chatId}-${message.sender}-${
        message.content
      }-${timestamp.getTime()}`;

      // Verificar se a mensagem já foi processada
      if (state.processedMessageIds.has(messageIdentifier)) {
        console.log('🚫 Mensagem duplicada ignorada:', messageIdentifier);
        return;
      }

      // Adicionar ao conjunto de mensagens processadas
      state.processedMessageIds.add(messageIdentifier);

      // Limpar identificador após 5 minutos
      setTimeout(() => {
        state.processedMessageIds.delete(messageIdentifier);
      }, 5 * 60 * 1000);

      const newMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content: message.content,
        sender: message.sender,
        timestamp,
        formattedTimestamp,
      };

      // Verificar se o chat está na lista de ativos
      const activeChat = state.activeChats.find((c) => c.id === chatId);

      if (activeChat) {
        // Atualizar chat ativo
        set((state) => ({
          activeChats: state.activeChats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...(chat.messages || []), newMessage],
                  lastMessage: message.content,
                }
              : chat,
          ),
          currentChat:
            state.currentChat?.id === chatId
              ? {
                  ...state.currentChat,
                  messages: [...(state.currentChat.messages || []), newMessage],
                  lastMessage: message.content,
                }
              : state.currentChat,
        }));
      } else {
        // Verificar se o chat está na lista de pendentes
        const pendingChat = state.pendingChats.find((c) => c.id === chatId);

        if (pendingChat) {
          // Atualizar chat pendente
          set((state) => ({
            pendingChats: state.pendingChats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: [...(chat.messages || []), newMessage],
                    lastMessage: message.content,
                  }
                : chat,
            ),
          }));
        }
      }
    },

    // Função auxiliar para formatação de tempo
    formatSeconds: (seconds) => {
      if (!seconds && seconds !== 0) return '--:--';
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    },
  })),
);

export default useStore;
