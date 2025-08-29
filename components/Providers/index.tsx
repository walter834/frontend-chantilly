"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/store/store";
import AuthCallbackHandler from "../AuthCallbackHandler";
import { PasswordRecoveryProvider } from "@/contexts/PasswordRecoveryContext";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PasswordRecoveryProvider>
          <AuthCallbackHandler/>
          {children}
        </PasswordRecoveryProvider>
      </PersistGate>
    </Provider>
  );
}


