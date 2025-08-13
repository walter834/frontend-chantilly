
// hooks/useAuth.ts
"use client"
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { loginSuccess, logout } from '@/store/slices/authSlice';

interface User {
  id?: number;
  name: string;       
  lastname: string;    
  email: string;
  id_document_type?: number; 
  document_number?: string;
  phone?: string;
  address?: string;    
  deparment?: string;
  province?: string;
  district?: string;
  status?: number;
  google_id?: string | null;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, name, token } = useSelector((state: RootState) => state.auth);
  
  // ✅ CORRECCIÓN: Cambiar parámetro de user a customer
  const loginUser = (customerData: User, token: string) => {
    dispatch(loginSuccess({ customer: customerData, token }));
  };
  
  // Función para logout (normalmente usarás el service directamente)
  const logoutUser = () => {
    dispatch(logout());
  };
  
  return {
    // Estados
    isAuthenticated,
    name,
    token,
    
    // Funciones (por si las necesitas usar directamente desde componentes)
    loginUser,
    logoutUser
  };
};