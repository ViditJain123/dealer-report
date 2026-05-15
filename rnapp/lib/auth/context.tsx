import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { dealerLogout, dealerMe, type DealerInfo } from "@/lib/api/client";

/**
 * Dealer auth state. The session bearer token lives in the secure keystore; on
 * launch it is validated against `GET /api/dealer/me`.
 */

const TOKEN_KEY = "dealer_session_token";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  dealer: DealerInfo | null;
  signIn: (token: string, dealer: DealerInfo) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [dealer, setDealer] = useState<DealerInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!stored) {
        if (active) setStatus("unauthenticated");
        return;
      }
      const me = await dealerMe(stored);
      if (!active) return;
      if (me) {
        setToken(stored);
        setDealer(me);
        setStatus("authenticated");
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setStatus("unauthenticated");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (newToken: string, newDealer: DealerInfo) => {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    setToken(newToken);
    setDealer(newDealer);
    setStatus("authenticated");
  }, []);

  const signOut = useCallback(async () => {
    if (token) {
      await dealerLogout(token);
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
    setDealer(null);
    setStatus("unauthenticated");
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, dealer, signIn, signOut }),
    [status, dealer, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Access the dealer auth state. Must be used within an `AuthProvider`. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
