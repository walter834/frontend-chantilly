// store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface del Customer - coincide exactamente con tu respuesta de API
interface Customer {
  id: number; // ✅ OBLIGATORIO - siempre viene en la respuesta
  name: string;
  lastname: string;
  email: string;
  email_verified_at?: string | null;
  id_document_type: number;
  document_number: string;
  phone: string;
  address: string;
  deparment: string;
  province: string;
  district: string;
  status?: number;
  google_id?: string | null;
}

// Estado de autenticación - AMPLIADO para incluir todos los datos
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  customer: Customer | null; // ✅ Agregamos todos los datos del customer
}

interface LoginPayload {
  customer: Customer;
  token: string;
}

// Estado inicial
const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  customer: null, // ✅ Inicializar customer como null
};

/* const initials = (customer: Customer): string => {
  const firstNameInitial = customer.name?.trim().charAt(0).toUpperCase() || "";
  const lastNameInitial = customer.lastname?.trim().charAt(0).toUpperCase() || "";

  const initials = `${firstNameInitial}${lastNameInitial}`;

  // Si no hay nombre/apellido, tomar primera letra antes del @
  return initials || customer.email.charAt(0).toUpperCase();
}; */

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Acción principal para login exitoso
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.customer = action.payload.customer; // ✅ Guardar todos los datos del customer
      // Extraer y guardar el nombre o iniciales
    },

    // Acción para logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.customer = null; // ✅ Limpiar datos del customer
    },

    // Acción para actualizar datos del customer
    updateCustomer: (state, action: PayloadAction<Partial<Customer>>) => {
      if (state.customer) {
        state.customer = { ...state.customer, ...action.payload };
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