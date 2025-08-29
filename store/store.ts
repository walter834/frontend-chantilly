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
import authAdminReducer from './slices/authAdminSlice';
import passwordRecoveryReducer from './slices/passwordRecoverySlice';

const authPersistConfig = {
  key: 'auth',
  storage,

  whitelist: ['isAuthenticated', 'customer','initials'], 
};

const authAdminPersistConfig = {
  key: 'authAdmin',
  storage,
  whitelist: ['isAuthenticated','user'],
}

const chatbotPersistConfig = {
  key: 'chatbot',
  storage,
  whitelist: ['messages', 'unreadCount'], 
};


const localPersistConfig = {
  key: 'local',
  storage,
  whitelist: ['currentLocation'], 
  blacklist: ['loading', 'error'], 
};

const passwordRecoveryPersistConfig = {
  key: 'passwordRecovery',
  storage,
  whitelist: ['phone', 'code', 'isVerified'], 
  blacklist: ['isInitialized'], 
};

// Crear los reducers persistidos
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedChatbotReducer = persistReducer(chatbotPersistConfig, chatbotReducer);
const persistedLocalReducer = persistReducer(localPersistConfig, localSlice);
const persistedAuthAdminReducer = persistReducer(authAdminPersistConfig, authAdminReducer);
const persistedPasswordRecoveryReducer = persistReducer(passwordRecoveryPersistConfig, passwordRecoveryReducer);


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,        
    chatbot: persistedChatbotReducer, 
    local: persistedLocalReducer,
    authAdmin: persistedAuthAdminReducer,
    passwordRecovery: persistedPasswordRecoveryReducer
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