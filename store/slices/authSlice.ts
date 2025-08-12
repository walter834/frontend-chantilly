// store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interfaces - CORREGIDAS para coincidir con la respuesta de la API
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

interface AuthState {
  isAuthenticated: boolean;
  name: string | null;
  token: string | null;
}

interface LoginPayload {
  customer: User; // ✅ Mantenemos customer como es consistente
  token: string;
}

// Función helper para extraer el nombre completo del usuario - CORREGIDA
const extractUserName = (user: User): string => {
  const firstName = user.name?.trim() || '';      // ✅ Cambiado de 'nombres' a 'name'
  const lastName = user.lastname?.trim() || '';   // ✅ Cambiado de 'apellidos' a 'lastname'
  const fullName = `${firstName} ${lastName}`.trim();
  
  // Si no hay nombres/apellidos, usar la parte antes del @ del email
  return fullName || user.email.split('@')[0];
};

// Estado inicial - Redux Persist se encarga de restaurar desde localStorage
const initialState: AuthState = {
  isAuthenticated: false,
  name: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Acción principal para login exitoso
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.isAuthenticated = true;
      state.name = extractUserName(action.payload.customer); // ✅ Usar customer
      state.token = action.payload.token;
      // Redux Persist automáticamente guarda esto en localStorage
    },
    
    // Acción para logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = null;
      state.token = null;
      // Redux Persist automáticamente limpia localStorage
    },
    
    // Acción para actualizar solo el nombre (si necesitas)
    updateUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    
    // Acción para actualizar solo el token (si necesitas)
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    }
  },
});

export const { loginSuccess, logout, updateUserName, updateToken } = authSlice.actions;
export default authSlice.reducer;