import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage, ChatbotState } from '@/types/chatbot';
import { chatbotService } from '@/service/chatbot/chatbotService';

interface SendMessagePayload {
  userMessage: string;
  botResponse: string;
}

interface AddMessagePayload {
  text: string;
  isUser: boolean;
}

// Async thunk para enviar mensajes
export const sendMessageAsync = createAsyncThunk<
  SendMessagePayload,
  string,
  {
    rejectValue: string;
  }
>(
  'chatbot/sendMessage',
  async (mensaje: string, { rejectWithValue }) => {
    try {
      const response = await chatbotService.sendMessage(mensaje);
      
      // Mejorar el manejo de la respuesta
      let botMessage = '';
      
      if (typeof response === 'string') {
        botMessage = response;
      } else if (response && typeof response === 'object') {
        // Intentar extraer el mensaje de diferentes posibles campos
        botMessage = response.message || 
                   
                    JSON.stringify(response);
      } else {
        botMessage = 'Respuesta recibida del chatbot';
      }
      
      return { 
        userMessage: mensaje, 
        botResponse: botMessage
      };
    } catch (error: any) {
      console.error('Error en sendMessageAsync:', error);
      return rejectWithValue(error.message || 'Error desconocido al enviar mensaje');
    }
  }
);

const initialState: ChatbotState = {
  messages: [
    {
      id: 1,
      text: '¡Hola! ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date().toISOString(),
    }
  ],
  isLoading: false,
  error: null,
  isOpen: false,
  unreadCount: 0,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
      if (state.isOpen) {
        state.unreadCount = 0;
      }
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    openChat: (state) => {
      state.isOpen = true;
      state.unreadCount = 0;
    },
    clearMessages: (state) => {
      state.messages = [
        {
          id: 1,
          text: '¡Hola! ¿En qué puedo ayudarte hoy?',
          isUser: false,
          timestamp: new Date().toISOString(),
        }
      ];
      state.error = null;
    },
    markAsRead: (state) => {
      state.unreadCount = 0;
    },
    addMessage: (state, action: PayloadAction<AddMessagePayload>) => {
      const message: ChatMessage = {
        id: Date.now() + Math.random(),
        text: action.payload.text,
        isUser: action.payload.isUser,
        timestamp: new Date().toISOString(),
      };
      state.messages.push(message);
      
      if (!action.payload.isUser && !state.isOpen) {
        state.unreadCount += 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        
        // Agregar mensaje del usuario inmediatamente
        const userMessage: ChatMessage = {
          id: Date.now(),
          text: state.messages.length > 0 ? '' : 'Enviando mensaje...', // Temporal
          isUser: true,
          timestamp: new Date().toISOString(),
        };
        // No agregamos el mensaje aquí, lo haremos en fulfilled/rejected
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        
        // Agregar mensaje del usuario
        const userMessage: ChatMessage = {
          id: Date.now(),
          text: action.payload.userMessage,
          isUser: true,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(userMessage);
        
        // Agregar respuesta del bot
        const botMessage: ChatMessage = {
          id: Date.now() + Math.random(),
          text: action.payload.botResponse,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(botMessage);
        
        if (!state.isOpen) {
          state.unreadCount += 1;
        }
      })
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error al enviar mensaje';
        
        // Agregar el mensaje del usuario aunque haya fallado
        const userMessage: ChatMessage = {
          id: Date.now(),
          text: action.meta.arg, // El mensaje original que se intentó enviar
          isUser: true,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(userMessage);
        
        // Agregar mensaje de error
        const errorMessage: ChatMessage = {
          id: Date.now() + Math.random(),
          text: `Error: ${action.payload}. Por favor, intenta de nuevo.`,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(errorMessage);
      });
  },
});

export const {
  toggleChat,
  closeChat,
  openChat,
  clearMessages,
  markAsRead,
  addMessage,
  clearError,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;