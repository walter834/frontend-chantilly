import api from "../api";

// Types para type safety
export interface SendRecoveryCodeRequest {
  phone: string;
}

export interface VerifyRecoveryCodeRequest {
  phone: string;
  code: string;
}

export interface ResetPasswordRequest {
  phone: string;
  code: string;
  password: string;
  password_confirmation: string;
}

export interface ApiResponse {
  message: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class PasswordRecoveryService {
  private readonly baseRoute = "/recovery";

  /**
   * Envía código de recuperación por SMS
   */
  async sendRecoveryCode(data: SendRecoveryCodeRequest): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        `${this.baseRoute}/send-code`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Verifica el código de recuperación
   */
  async verifyRecoveryCode(
    data: VerifyRecoveryCodeRequest
  ): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        `${this.baseRoute}/verify-code`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Restablece la contraseña con el código verificado
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        `${this.baseRoute}/reset-password`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Maneja errores de la API de forma consistente
   */
  private handleError(error: any): ApiError {
    if (error.response?.data) {
      return {
        message: error.response.data.message || "Error en la solicitud",
        errors: error.response.data.errors,
      };
    }

    return {
      message: error.message || "Error de conexión",
    };
  }
}

// Instancia singleton del servicio
export const passwordRecoveryService = new PasswordRecoveryService();

// Export por defecto para mayor flexibilidad
export default passwordRecoveryService;
