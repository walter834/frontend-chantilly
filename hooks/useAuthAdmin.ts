"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

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
  
  // Obtener datos de las cookies si estamos en el cliente
  const getAuthFromCookies = () => {
    if (!isClient) return { token: null, user: null };
    
    const token = Cookies.get('auth_token') || null;
    const userStr = Cookies.get('user_data');
    let user = null;
    
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error al analizar los datos del usuario desde cookies:', error);
      // Limpiar cookies inválidas
      Cookies.remove('auth_token');
      Cookies.remove('user_data');
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
  
  const { isAuthenticated, token, user } = getAuthState();

  return {
    isAuthenticated,
    token,
    user,
    id: user?.id,
    username: user?.username,
    email: user?.email,
  };
};
