// hooks/useChatControl.ts
import { useCallback } from 'react';

export const useChatControl = () => {
  // Función para cerrar el chat manualmente
  const closeChat = useCallback(() => {
    const chatContainer = document.querySelector("#n8n-chat");
    const chatWindow = document.querySelector(".chat-window");
    const chatToggle = document.querySelector(".chat-toggle");
    
    if (chatWindow && chatWindow.classList.contains("open")) {
      if (chatToggle) {
        (chatToggle as HTMLElement).click();
      }
    }
  }, []);

  // Función para emitir eventos personalizados que cerrarán el chat
  const triggerChatClose = useCallback((reason?: string) => {
    const event = new CustomEvent('chatShouldClose', { 
      detail: { reason } 
    });
    document.dispatchEvent(event);
    
    // También cerrar directamente
    closeChat();
  }, [closeChat]);

  // Funciones específicas para diferentes acciones
  const closeChatOnCartOpen = useCallback(() => {
    const event = new CustomEvent('cartOpened');
    document.dispatchEvent(event);
    closeChat();
  }, [closeChat]);

  const closeChatOnModalOpen = useCallback(() => {
    const event = new CustomEvent('modalOpened');
    document.dispatchEvent(event);
    closeChat();
  }, [closeChat]);

  const closeChatOnDrawerOpen = useCallback(() => {
    const event = new CustomEvent('drawerOpened');
    document.dispatchEvent(event);
    closeChat();
  }, [closeChat]);

  return {
    closeChat,
    triggerChatClose,
    closeChatOnCartOpen,
    closeChatOnModalOpen,
    closeChatOnDrawerOpen,
  };
};