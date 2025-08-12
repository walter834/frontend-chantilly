// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from "./slices/authSlice";
import chatbotReducer from './slices/chatbotSlice';

const chatbotPersistConfig = {
  key: 'chatbot',
  storage,
  whitelist: ['messages', 'unreadCount'], // solo persiste estos campos
};

const persistedChatbotReducer = persistReducer(chatbotPersistConfig, chatbotReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatbot: persistedChatbotReducer,  // importante que sea el persistido
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
