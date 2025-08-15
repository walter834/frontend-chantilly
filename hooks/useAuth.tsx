// hooks/useAuth.ts
"use client";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { loginSuccess, logout, updateCustomer, Customer } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // ✅ Obtener todos los datos del estado
  const { isAuthenticated, token, customer } = useSelector((state: RootState) => state.auth);
  
  // Función para login
  const loginUser = (customerData: Customer, authToken: string) => {
    dispatch(loginSuccess({ customer: customerData, token: authToken }));
  };
  
  // Función para logout
  const logoutUser = () => {
    dispatch(logout());
  };

  // Función para actualizar datos del customer
  const updateCustomerData = (updates: Partial<Customer>) => {
    dispatch(updateCustomer(updates));
  };

  // ✅ Funciones helper para acceder fácilmente a datos específicos
  const getFullName = () => {
    if (!customer) return null;
    return `${customer.name} ${customer.lastname}`.trim();
  };

  const getInitials = () => {
    if (!customer) return '';
    const firstInitial = customer.name?.charAt(0).toUpperCase() || '';
    const lastInitial = customer.lastname?.charAt(0).toUpperCase() || '';
    return firstInitial + lastInitial;
  };

  const getDisplayName = () => {
    if (!customer) return null;
    return customer.name || customer.email.split('@')[0];
  };

  return {
    // ✅ Estados principales
    isAuthenticated,
    token,
    customer, // Todos los datos del customer
    
    // ✅ Datos específicos fáciles de usar
    fullName: getFullName(),
    displayName: getDisplayName(),
    initials: getInitials(),
    name: customer?.name,
    lastname: customer?.lastname,
    email: customer?.email,
    phone: customer?.phone,
    address: customer?.address,
    documentNumber: customer?.document_number,
    documentType: customer?.id_document_type,
    department: customer?.deparment,
    province: customer?.province,
    district: customer?.district,
    status: customer?.status,
    customerId: customer?.id,
    
    // ✅ Funciones
    loginUser,
    logoutUser,
    updateCustomerData,
    
    // ✅ Helpers
    isEmailVerified: customer?.email_verified_at !== null,
    isActive: customer?.status === 1,
    hasGoogleAuth: customer?.google_id !== null,
  };
};

// ✅ Exportar tipos para usar en componentes
export type { Customer };