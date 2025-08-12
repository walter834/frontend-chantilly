
// hooks/useAuth.ts
"use client"
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { loginSuccess, logout } from '@/store/slices/authSlice';

// ✅ CORREGIDA para coincidir con la respuesta de la API
interface User {
  id?: number;
  name: string;        // ✅ Cambiado de 'nombres' a 'name'
  lastname: string;    // ✅ Cambiado de 'apellidos' a 'lastname'
  email: string;
  id_document_type?: number; // ✅ Cambiado para coincidir con la respuesta
  document_number?: string;
  phone?: string;      // ✅ Cambiado de 'celular' a 'phone'
  address?: string;    // ✅ Cambiado de 'direccion' a 'address'
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