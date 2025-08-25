// store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface del Customer - coincide exactamente con tu respuesta de API
interface Customer {
  id: number; 
  name: string;
  lastname: string;
  email: string;
  email_verified_at?: string | null;
  id_document_type: number;
  document_number: string;
  phone: string;
  address: string;
  department: string;
  province: string;
  district: string;
  // ✅ Agregar códigos de ubigeo
  department_code: string;
  province_code: string;
  district_code: string;
  //password?:string;
  //password_confirmation?: string;
  status?: number;
  google_id?: string | null;

}


interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  customer: Customer | null;

  fullName: string | null;
  displayName: string | null;
  initials: string;
}

interface LoginPayload {
  customer: Customer;
  token: string;
}

// Estado inicial
const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  customer: null,
  // ✅ NUEVOS: Estados iniciales para campos derivados
  fullName: null,
  displayName: null,
  initials: '',
};

// ✅ Helper functions para calcular campos derivados
const calculateFullName = (customer: Customer): string => {
  return `${customer.name} ${customer.lastname}`.trim();
};

const calculateDisplayName = (customer: Customer): string => {
  return customer.name || customer.email.split('@')[0];
};

const calculateInitials = (customer: Customer): string => {
  const firstInitial = customer.name?.charAt(0).toUpperCase() || '';
  const lastInitial = customer.lastname?.charAt(0).toUpperCase() || '';
  const initials = firstInitial + lastInitial;
  
  // Si no hay nombre/apellido, tomar primera letra del email
  return initials || customer.email.charAt(0).toUpperCase();
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ MEJORADO: Acción principal para login exitoso - calcula y persiste campos derivados
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      const { customer, token } = action.payload;
      
      state.isAuthenticated = true;
      state.token = token;
      state.customer = customer;
      
      // ✅ NUEVOS: Calcular y guardar campos derivados
      state.fullName = calculateFullName(customer);
      state.displayName = calculateDisplayName(customer);
      state.initials = calculateInitials(customer);
    },

    // ✅ MEJORADO: Acción para logout - limpia todo
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.customer = null;
      // ✅ NUEVOS: Limpiar campos derivados
      state.fullName = null;
      state.displayName = null;
      state.initials = '';
    },

    // ✅ MEJORADO: Acción para actualizar datos del customer - recalcula campos derivados
    updateCustomer: (state, action: PayloadAction<Partial<Customer>>) => {
      if (state.customer) {
        // Actualizar customer
        state.customer = { ...state.customer, ...action.payload };
        
        // ✅ NUEVOS: Recalcular campos derivados después de actualizar
        state.fullName = calculateFullName(state.customer);
        state.displayName = calculateDisplayName(state.customer);
        state.initials = calculateInitials(state.customer);
      }
    },

    // Acción para actualizar solo el token
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateCustomer, updateToken } = authSlice.actions;
export default authSlice.reducer;

// Exportar tipos para usar en otros archivos
export type { Customer, AuthState };