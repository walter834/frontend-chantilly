"use client";
import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export default function N8nChat() {
  useEffect(() => {
    let observer: MutationObserver | null = null;
    let titleProcessed = false;
    
    createChat({
      webhookUrl:
          process.env.NEXT_PUBLIC_CHATBOT_API_URL,
      target: "#n8n-chat",
      mode: "window",
      showWelcomeScreen: false,
      initialMessages: ['¡Hola! 😊 Soy María, tu asistente de "La Casa del Chantilly". ¿En qué puedo ayudarte hoy? Estoy aquí para brindarte información sobre nuestros deliciosos productos, precios y promociones. 🍰🧁🍪'],
      i18n: {
        en: {
          title: "María",
          subtitle: "Comienza una conversación. Estoy aquí para ayudarte.",
          footer: "",
          getStarted: "Nueva conversación",
          inputPlaceholder: "Escribe tu pregunta...",
          closeButtonTooltip: "Cerrar chat",
        },
      },
      defaultLanguage: "en",
      metadata: {
        platform: "web",
        userAgent: navigator.userAgent,
      },
      loadPreviousSession: true,
    });

    // Función optimizada para modificar título
    const modifyTitle = () => {
      if (titleProcessed) return;
      
      const titleElement = document.querySelector(".chat-heading h1");
      if (titleElement && !titleElement.querySelector("img")) {
        titleElement.innerHTML = `
          <img src="/avatar.jpeg" alt="María" style="width:35px;height:35px;border-radius:50%;margin-right:8px" />
          María
        `;
        titleProcessed = true;
      }
    };

    // Función optimizada para agregar avatares
    const addBotAvatars = () => {
      // Procesar inmediatamente sin setTimeout
      const botMessages = document.querySelectorAll<HTMLElement>(".chat-message-from-bot:not([data-avatar-added])");
      
      botMessages.forEach((msg: HTMLElement) => {
        // Marcar como procesado inmediatamente
        msg.setAttribute('data-avatar-added', 'true');

        // Guardar el contenido original del mensaje
        const originalContent = msg.innerHTML;

        // Aplicar estilo flex al mensaje
        msg.setAttribute('style', `
          display: flex !important;
          align-items: flex-start !important;
          gap: 8px !important;
          margin-top: 8px !important;
          margin-bottom: 8px !important;
          z-index: 1000 !important;
        `);

        // Crear imagen del avatar
        const img = document.createElement("img");
        img.src = "/avatar.jpeg";
        img.alt = "María";
        img.className = "bot-avatar";
        img.style.cssText = `
          width: 35px;
          height: 35px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-right: 0;
        `;

        // Crear contenedor para el texto del mensaje
        const messageContent = document.createElement("div");
        messageContent.className = "message-content";
        messageContent.innerHTML = originalContent;
        messageContent.style.cssText = `
          flex: 1;
          word-wrap: break-word;
        `;

        // Limpiar el mensaje y agregar avatar + contenido
        msg.innerHTML = "";
        msg.appendChild(img);
        msg.appendChild(messageContent);
      });
    };

    // Observer mejorado con procesamiento más rápido
    const setupObserver = () => {
      const chatContainer = document.querySelector("#n8n-chat");
      if (!chatContainer) {
        // Reducir el intervalo de reintento
        setTimeout(setupObserver, 100);
        return;
      }

      observer = new MutationObserver((mutations) => {
        let shouldProcessMessages = false;
        let shouldProcessTitle = false;

        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                // Verificar mensajes del bot
                if (
                  (element.classList && element.classList.contains("chat-message-from-bot")) ||
                  (element.querySelector && element.querySelector(".chat-message-from-bot"))
                ) {
                  shouldProcessMessages = true;
                }
                
                // Verificar título
                if (
                  (element.classList && element.classList.contains("chat-heading")) ||
                  (element.querySelector && element.querySelector(".chat-heading h1"))
                ) {
                  shouldProcessTitle = true;
                }
              }
            });
          }
        });

        // Procesar inmediatamente cuando se detectan cambios
        if (shouldProcessMessages) {
          addBotAvatars();
        }
        
        if (shouldProcessTitle) {
          modifyTitle();
        }
      });

      observer.observe(chatContainer, {
        childList: true,
        subtree: true,
      });

      // Procesar contenido existente inmediatamente
      addBotAvatars();
      modifyTitle();
    };

    // Inicialización más rápida
    // Reducir el timeout inicial
    setTimeout(setupObserver, 300);

    // Cleanup
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return <div id="n8n-chat" />;
}