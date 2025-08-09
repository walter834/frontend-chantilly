import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "@/lib/utils/localStorage";
import { getCookie } from "@/lib/utils/cookies";
import { removeCookie } from "@/lib/utils/cookies";
import { getSessionStorage, removeSessionStorage, setSessionStorage } from "@/lib/utils/sessionStorage";

interface Auth {
  user: User | null;
  isAuthenticated: boolean;
}

// Helper function to safely parse JSON
const safeJSONParse = (value: string | null): any => {
  if (!value || value === "null" || value === "undefined") {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("Failed to parse JSON:", value);
    return null;
  }
};

// Helper function to get user from storage safely
const getUserFromStorage = (): User | null => {
  // Try localStorage first
  const localUser = getLocalStorage("user");
  if (localUser) {
    const parsedLocalUser = safeJSONParse(localUser);
    if (parsedLocalUser) return parsedLocalUser;
  }

  // Try sessionStorage if localStorage fails
  const sessionUser = getSessionStorage("user");
  if (sessionUser) {
    const parsedSessionUser = safeJSONParse(sessionUser);
    if (parsedSessionUser) return parsedSessionUser;
  }

  return null;
};

// Helper function to check if authenticated
const getAuthStatus = (): boolean => {
  const hasToken = !!getCookie("token");
  const localAuth = getLocalStorage("isAuthenticated") === "true";
  const sessionAuth = getSessionStorage("isAuthenticated") === "true";
  
  return hasToken && (localAuth || sessionAuth);
};

const initialState: Auth = {
  isAuthenticated: getAuthStatus(),
  user: getUserFromStorage(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; remember: boolean }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;

      if (action.payload.remember) {
        // Clear session storage first
        removeSessionStorage("isAuthenticated");
        removeSessionStorage("user");
        
        // Set localStorage
        setLocalStorage("isAuthenticated", "true");
        setLocalStorage("user", JSON.stringify(action.payload.user));
      } else {
        // Clear localStorage first
        removeLocalStorage("isAuthenticated");
        removeLocalStorage("user");
        
        // Set sessionStorage
        setSessionStorage("isAuthenticated", "true");
        setSessionStorage("user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      // Limpiar todo el almacenamiento y cookies
      removeSessionStorage("isAuthenticated");
      removeSessionStorage("user");
      removeLocalStorage("isAuthenticated");
      removeLocalStorage("user");
      removeCookie("token");
      removeLocalStorage("vite-ui-theme");
    },
    
    // NUEVA ACCIÓN: Para limpiar solo el estado sin tocar almacenamiento
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;