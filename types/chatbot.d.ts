export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface ChatbotResponse {
  message: string;
  status?: string;
  data?: any;
}

export interface ChatbotRequest {
  message: string;
  timestamp?: string;
}

export interface ChatbotState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
  unreadCount: number;
}