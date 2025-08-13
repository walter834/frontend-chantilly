// components/N8nChat.tsx
"use client";
import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export default function N8nChat() {
  useEffect(() => {
    createChat({
      webhookUrl: "http://192.168.18.28:5678/webhook/84328b06-1473-4e77-b100-9fb12b6abace/chat",
      target: "#n8n-chat",
      mode: "window", // o "embedded" si quieres que esté dentro del layout
      showWelcomeScreen: false,
      initialMessages: [
        "¡Hola! 👋",
        "Soy Nathan, ¿en qué puedo ayudarte hoy?"
      ],
      metadata: {
        platform: "web",
        userAgent: navigator.userAgent,
      },
      loadPreviousSession: true,
    });
  }, []);

  return <div id="n8n-chat" />;
}
