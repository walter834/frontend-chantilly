// lib/utils/debug.ts - Utilidades para debugging del sistema de autenticación

const DEBUG_PREFIX = "🔍 [AUTH_DEBUG]";
const isDevelopment = process.env.NODE_ENV === 'development';

export const debugLog = {
  // Logging para el flujo de autenticación
  auth: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`${DEBUG_PREFIX} 🔐 ${message}`, data || '');
    }
  },
  
  // Logging para Redux
  redux: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`${DEBUG_PREFIX} 🔄 ${message}`, data || '');
    }
  },
  
  // Logging para API
  api: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`${DEBUG_PREFIX} 🌐 ${message}`, data || '');
    }
  },
  
  // Logging para persistencia
  persist: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`${DEBUG_PREFIX} 💾 ${message}`, data || '');
    }
  },
  
  // Logging para errores
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`${DEBUG_PREFIX} ❌ ${message}`, error || '');
    }
  },
  
  // Logging para warnings
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`${DEBUG_PREFIX} ⚠️ ${message}`, data || '');
    }
  },
  
  // Logging para información general
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.info(`${DEBUG_PREFIX} ℹ️ ${message}`, data || '');
    }
  }
};

// Función para verificar el estado del localStorage
export const checkLocalStorage = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem('persist:auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      debugLog.persist('localStorage auth encontrado:', parsed);
      return parsed;
    }
  } catch (error) {
    debugLog.error('Error parseando localStorage auth:', error);
  }
  
  return null;
};

// Función para verificar el estado del sessionStorage
export const checkSessionStorage = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const redirectData = sessionStorage.getItem('redirectAfterLogin');
    debugLog.persist('sessionStorage redirect encontrado:', redirectData);
    return redirectData;
  } catch (error) {
    debugLog.error('Error leyendo sessionStorage:', error);
  }
  
  return null;
};

// Función para hacer dump completo del estado de autenticación
export const dumpAuthState = () => {
  if (typeof window === 'undefined') return;
  
  debugLog.info('=== DUMP COMPLETO DEL ESTADO DE AUTENTICACIÓN ===');
  
  // Verificar localStorage
  const localStorageData = checkLocalStorage();
  
  // Verificar sessionStorage
  const sessionStorageData = checkSessionStorage();
  
  // Verificar cookies
  const cookies = document.cookie;
  debugLog.info('Cookies disponibles:', cookies);
  
  // Verificar si hay store global
  if ((window as any).store) {
    try {
      const storeState = (window as any).store.getState();
      debugLog.redux('Estado del store global:', storeState);
    } catch (error) {
      debugLog.error('Error accediendo al store global:', error);
    }
  }
  
  debugLog.info('=== FIN DEL DUMP ===');
};
