interface ChatResponse {
  message?: string;
  response?: string;
  error?: string;
}

interface ChatPayload {
  message: string;
  sessionId: string;
  timestamp?: string;
  metadata?: {
    platform: string;
    userAgent: string;
  };
}

export async function sendMessageToChat(message: string): Promise<ChatResponse | null> {
  // Recuperar o generar el sessionId
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    // Generar ID más robusto
    sessionId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("sessionId", sessionId);
    
    // Opcional: Guardar fecha de creación para analytics
    localStorage.setItem("sessionCreated", new Date().toISOString());
  }

  // Construir el payload con más metadatos
  const payload: ChatPayload = {
    message: message.trim(),
    sessionId,
    timestamp: new Date().toISOString(),
    metadata: {
      platform: "web",
      userAgent: navigator.userAgent.slice(0, 100), // Limitado para no ser muy largo
    }
  };

  console.log("📤 Enviando mensaje:", { message, sessionId });

  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK_URL || 
      "http://192.168.18.28:5678/webhook/84328b06-1473-4e77-b100-9fb12b6abace/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
        // Timeout para evitar que se cuelgue
        signal: AbortSignal.timeout(30000), // 30 segundos
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("📨 Respuesta del chat:", result);
    
    return result;
  } catch (error) {
    console.error("❌ Error al enviar mensaje al chat:", error);
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        return { error: "El chat tardó demasiado en responder. Intenta de nuevo." };
      }
      if (error.message.includes('fetch')) {
        return { error: "No se pudo conectar con el chat. Verifica tu conexión." };
      }
    }
    
    return { error: "Error inesperado. Intenta de nuevo en unos momentos." };
  }
}

// Función adicional para limpiar sesión (opcional)
export function clearChatSession() {
  localStorage.removeItem("sessionId");
  localStorage.removeItem("sessionCreated");
  console.log("🗑️ Sesión de chat eliminada");
}

// Función para obtener info de la sesión
export function getChatSessionInfo() {
  const sessionId = localStorage.getItem("sessionId");
  const sessionCreated = localStorage.getItem("sessionCreated");
  
  return {
    sessionId,
    sessionCreated: sessionCreated ? new Date(sessionCreated) : null,
    hasSession: !!sessionId,
  };
}