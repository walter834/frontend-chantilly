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
import chatbotReducer from './slices/chatbotSlice';

// Configuración de persistencia para auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'name', 'token', 'id'], // Solo persiste estos campos
};

// Configuración de persistencia para chatbot (mantienes tu configuración actual)
const chatbotPersistConfig = {
  key: 'chatbot',
  storage,
  whitelist: ['messages', 'unreadCount'], // solo persiste estos campos
};

// Crear los reducers persistidos
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedChatbotReducer = persistReducer(chatbotPersistConfig, chatbotReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,        // Ahora también persistido
    chatbot: persistedChatbotReducer,  // Tu configuración actual
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Agregar todas las acciones de redux-persist para evitar warnings
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          // También mantener las anteriores por compatibilidad
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