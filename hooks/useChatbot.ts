import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { 
  sendMessageAsync, 
  toggleChat, 
  closeChat, 
  openChat, 
  clearMessages, 
  markAsRead 
} from '@/store/slices/chatbotSlice';

export const useChatbot = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chatbot = useSelector((state: RootState) => state.chatbot);

  const sendMessage = (mensaje: string) => {
    dispatch(sendMessageAsync(mensaje));
  };

  const toggleChatWindow = () => {
    dispatch(toggleChat());
  };

  const closeChatWindow = () => {
    dispatch(closeChat());
  };

  const openChatWindow = () => {
    dispatch(openChat());
  };

  const clearChatHistory = () => {
    dispatch(clearMessages());
  };

  const markMessagesAsRead = () => {
    dispatch(markAsRead());
  };

  return {
    // State
    messages: chatbot.messages,
    isLoading: chatbot.isLoading,
    error: chatbot.error,
    isOpen: chatbot.isOpen,
    unreadCount: chatbot.unreadCount,
    
    // Actions
    sendMessage,
    toggleChatWindow,
    closeChatWindow,
    openChatWindow,
    clearChatHistory,
    markMessagesAsRead,
  };
};