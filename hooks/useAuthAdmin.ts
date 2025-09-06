"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCookie, deleteCookie } from "@/lib/cookies";

interface User {
  id: number;
  username: string;
  email: string;
}

export const useAuthAdmin = () => {
  const { isAuthenticated: reduxIsAuthenticated, token: reduxToken, user: reduxUser } = useSelector(
    (state: RootState) => state.authAdmin
  );
  
  const [isClient, setIsClient] = useState(false);
  
  // Verificar si estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Obtener datos de las cookies
  const getAuthFromCookies = () => {
    if (!isClient) return { token: null, user: null };
    
    const token = getCookie('auth_token') || null;
    const userStr = getCookie('user_data');
    
    let user = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error('Error al analizar los datos del usuario desde cookies:', error);
        // Limpiar cookies inválidas
        deleteCookie('auth_token');
        deleteCookie('user_data');
      }
    }
    
    return { token, user };
  };
  
  // Obtener el estado de autenticación
  const getAuthState = () => {
    const { token, user } = getAuthFromCookies();
    
    // Si hay datos en Redux, usarlos, de lo contrario usar cookies
    const isAuth = reduxIsAuthenticated || Boolean(token);
    const authToken = reduxToken || token;
    const authUser = reduxUser || user;
    
    return {
      isAuthenticated: isAuth,
      token: authToken,
      user: authUser as User | null,
    };
  };
  
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null as string | null,
    user: null as User | null
  });

  useEffect(() => {
    if (isClient) {
      const state = getAuthState();
      setAuthState({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user
      });
    }
  }, [isClient]);

  return {
    isAuthenticated: authState.isAuthenticated,
    token: authState.token,
    user: authState.user,
    id: authState.user?.id,
    username: authState.user?.username,
    email: authState.user?.email,
  };
};
