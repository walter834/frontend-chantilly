import api from "../api";

export class LocalService {
  /**
   * Obtiene la ubicación actual del usuario usando la API de geolocalización
   */
  static getCurrentLocation(): Promise<LocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalización no soportada por este navegador"));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = "Error desconocido";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Permiso de ubicación denegado por el usuario";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Información de ubicación no disponible";
              break;
            case error.TIMEOUT:
              errorMessage =
                "Tiempo de espera agotado para obtener la ubicación";
              break;
          }

          reject(new Error(errorMessage));
        },
        options
      );
    });
  }

  static async getLocalsAll(): Promise<Local[]> {
    try {
      const response = await api.get(`/locals`);
      return response.data;
    } catch (error) {
      throw new Error("Error al obtener los locales");
    }
  }

  /**
   * Obtiene los locales cercanos basándose en las coordenadas
   */
  static async getLocalsByLocation(
    latitude: number,
    longitude: number
  ): Promise<Local[]> {
    try {
      const response = await api.get("/locals/location", {
        params: {
          latitud: latitude,
          longitud: longitude,
        },
      });

      return response.data;
    } catch (error) {
      
      throw new Error("Error al obtener los locales cercanos");
    }
  }

  /**
   * Función principal que combina geolocalización y búsqueda de locales
   */
  static async findNearbyLocals(): Promise<Local[]> {
    try {
      const location = await this.getCurrentLocation();
      const locals = await this.getLocalsByLocation(
        location.latitude,
        location.longitude
      );
      return locals;
    } catch (error) {
      throw error;
    }
  }
}
