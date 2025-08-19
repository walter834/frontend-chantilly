// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from "./slices/authSlice";
import localSlice from "./slices/localSlice";
import chatbotReducer from './slices/chatbotSlice';

// ✅ AMPLIADA: Configuración de persistencia para auth (incluye más campos)
const authPersistConfig = {
  key: 'auth',
  storage,
  // ✅ Ahora persiste todo lo necesario para el perfil y navbar
  whitelist: ['isAuthenticated', 'customer','initials'], // Persiste customer completo
};

// Configuración de persistencia para chatbot (mantienes tu configuración actual)
const chatbotPersistConfig = {
  key: 'chatbot',
  storage,
  whitelist: ['messages', 'unreadCount'], // solo persiste estos campos
};

// Configuración de persistencia para locals (opcional, solo si quieres cache)
const localPersistConfig = {
  key: 'local',
  storage,
  whitelist: ['currentLocation'], // Solo persistir la ubicación actual
  blacklist: ['loading', 'error'], // No persistir estados temporales
};

// Crear los reducers persistidos
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedChatbotReducer = persistReducer(chatbotPersistConfig, chatbotReducer);
const persistedLocalReducer = persistReducer(localPersistConfig, localSlice);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,        
    chatbot: persistedChatbotReducer, 
    local: persistedLocalReducer 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'persist/PERSIST', 
          'persist/REHYDRATE'
        ],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;