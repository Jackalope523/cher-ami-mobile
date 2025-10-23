import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthInterface {
  getToken: () => Promise<string | null>;
  updateToken: (freshToken: string) => Promise<void>;
  deleteToken: () => Promise<void>;
  getOnboarded: () => Promise<boolean | null>;
  updateOnboarded: (onboarded: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthInterface | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    getToken: context.getToken,
    updateToken: context.updateToken,
    deleteToken: context.deleteToken,
    getOnboarded: context.getOnboarded,
    updateOnboarded: context.updateOnboarded,
  };
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  async function getToken() {
    if (token === null) {
      let freshToken = await getItemAsync('token');
      setToken(freshToken);
      return freshToken;
    }
    return token;
  }

  async function updateToken(token: string) {
    setToken(token);
    await setItemAsync('token', token);
  }

  async function deleteToken() {
    setToken(null);
    await deleteItemAsync('token');
  }

  async function getOnboarded() {
    if (onboarded === null) {
      let freshValue = (await getItemAsync('Onboarded')) === 'true';
      setOnboarded(freshValue);
      return freshValue;
    }
    return onboarded;
  }

  async function updateOnboarded(value: boolean) {
    setOnboarded(value);
    await setItemAsync('Onboarded', value.toString());
  }

  return (
    <AuthContext.Provider
      value={{
        getToken,
        updateToken,
        deleteToken,
        getOnboarded,
        updateOnboarded,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
