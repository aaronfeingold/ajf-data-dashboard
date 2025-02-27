"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { store, persistor } from "@/store/store";
import { AuthSyncComponent } from "@/components/Providers/AuthSync";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <Provider store={store}>
        <AuthSyncComponent />
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </NextAuthSessionProvider>
  );
}
