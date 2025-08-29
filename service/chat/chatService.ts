import api from "../api";

interface MessagePayload {
  session_id: string;
  message: string;
}

interface SaveMessageResponse {
  success: boolean;
  data?: any;
  message: string;
}
export async function saveMessage(
  payload: MessagePayload
): Promise<SaveMessageResponse> {
  try {
    if (payload.message.trim() === "") {
      throw new Error("El mensaje no puede estar vacio");
    }

    const response = await api.post("/messages-customer-bot", payload);

    console.log("Mensaje enviado exitosamente:", {
      session_id: payload.session_id,
      message: payload.message,
      response: response.data,
    });
    return {
      success: true,
      data: response.data,
      message: "Mensaje guardado exitosamente",
    };
  } catch (error) {
    throw error;
  }
}

export function generateSessionId():string{
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2,9);
    return `session_${timestamp}_${randomString}`
}

export function setSessionId(sessionId:string):void{
    if(typeof window !== 'undefined'){
        localStorage.setItem('n8n-chat-session-id', sessionId)
    }
}