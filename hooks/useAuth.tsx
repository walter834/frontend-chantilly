// hooks/useAuth.ts
"use client";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { loginSuccess, logout, updateCustomer, Customer } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // ✅ OPTIMIZADO: Ahora obtiene todos los datos incluyendo los campos derivados persistentes
  const { 
    isAuthenticated, 
    token, 
    customer,
    fullName,
    displayName, 
    initials 
  } = useSelector((state: RootState) => state.auth);
  
  // Función para login
  const loginUser = (customerData: Customer, authToken: string) => {
    dispatch(loginSuccess({ customer: customerData, token: authToken }));
  };
  
  // Función para logout
  const logoutUser = () => {
    dispatch(logout());
  };

  const updateCustomerData = (updates: Partial<Customer>) => {
    dispatch(updateCustomer(updates));
  };

  return {
    isAuthenticated,
    token,
    customer,
    
    fullName,           
    displayName,        
    initials,          
    
    id: customer?.id,
    name: customer?.name,
    lastname: customer?.lastname,
    email: customer?.email,
    phone: customer?.phone,
    address: customer?.address,
    documentNumber: customer?.document_number,
    documentType: customer?.id_document_type,
    department: customer?.department,
    province: customer?.province,
    district: customer?.district,
    departmentCode: customer?.department_code,
    provinceCode: customer?.province_code,
    districtCode: customer?.district_code,
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