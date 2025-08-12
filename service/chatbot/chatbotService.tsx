import axios from 'axios';
import type { ChatbotRequest, ChatbotResponse } from '@/types/chatbot';

const chatbotApi = axios.create({
  baseURL: process.env.CHATBOT_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Función para validar si la respuesta es JSON válido
const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// Función para validar si la respuesta es HTML
const isHTMLResponse = (str: string): boolean => {
  return str.trim().toLowerCase().startsWith('<!doctype html') || 
         str.trim().toLowerCase().startsWith('<html');
};

chatbotApi.interceptors.request.use(
  (config) => {
    console.log("Enviando mensaje al chatbot:", config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

chatbotApi.interceptors.response.use(
  (response) => {
    console.log("Respuesta del chatbot:", response.data);
    
    // Verificar si la respuesta es HTML cuando esperamos JSON
    if (typeof response.data === 'string' && isHTMLResponse(response.data)) {
      console.error("Recibida respuesta HTML cuando se esperaba JSON");
      throw new Error('El servidor devolvió HTML en lugar de JSON. Verifica la configuración del webhook.');
    }
    
    return response;
  },
  (error) => {
    console.error("Error en chatbot API:", error.response?.data || error.message);
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('El chatbot tardó demasiado en responder'));
    }
    
    if (error.response?.status === 503) {
      return Promise.reject(new Error('El chatbot no está disponible'));
    }

    if (error.response?.status === 404) {
      return Promise.reject(new Error('Webhook no encontrado. Verifica la URL del webhook.'));
    }

    if (error.response?.status === 405) {
      return Promise.reject(new Error('Método no permitido. Verifica la configuración del webhook.'));
    }
    
    return Promise.reject(error);
  }
);

export const chatbotService = {
  async sendMessage(mensaje: string): Promise<ChatbotResponse> {
    try {
      const requestData: ChatbotRequest = {
        message: mensaje,
        timestamp: new Date().toISOString(),
      };

      console.log("Enviando a URL:", process.env.CHATBOT_API_URL);
      
      const response = await axios.post(
        process.env.CHATBOT_API_URL || "",
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      // Validación adicional de la respuesta
      if (typeof response.data === 'string') {
        if (isHTMLResponse(response.data)) {
          throw new Error('El servidor devolvió HTML. Verifica la configuración del webhook en n8n.');
        }
        
        if (isValidJSON(response.data)) {
          const parsedData = JSON.parse(response.data);
          return parsedData;
        }
        
        // Si es string pero no HTML ni JSON, asumimos que es el mensaje directo
        return { message: response.data };
      }

      // Si ya es un objeto, lo devolvemos directamente
      if (typeof response.data === 'object' && response.data !== null) {
        return response.data;
      }

      // Fallback: crear respuesta con el contenido recibido
      return { message: String(response.data) };
      
    } catch (error: any) {
      console.error("Error detallado del chatbot:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: process.env.CHATBOT_API_URL,
      });
      
      if (error.response?.data && typeof error.response.data === 'string' && isHTMLResponse(error.response.data)) {
        throw new Error('El webhook devolvió una página HTML. Verifica que el webhook esté configurado correctamente en n8n.');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Error al enviar mensaje');
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      // Cambiar a hacer el health check a la URL base de n8n
      const baseUrl = process.env.CHATBOT_API_URL?.split('/webhook')[0] || 'http://192.168.18.28:5678';
      const response = await axios.get(`${baseUrl}/healthz`, { 
        timeout: 5000 
      });
      return response.status === 200;
    } catch (error) {
      console.warn("Health check falló:", error);
      return false;
    }
  }
};