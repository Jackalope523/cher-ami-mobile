import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthInterface {
  getToken: () => Promise<string | null>;
  updateToken: (freshToken: string) => Promise<void>;
  deleteToken: () => Promise<void>;
  getIsNewUser: () => Promise<boolean | null>;
  updateIsNewUser: (isNewUser: boolean) => Promise<void>;
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
    getIsNewUser: context.getIsNewUser,
    updateIsNewUser: context.updateIsNewUser,
  };
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

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

  async function getIsNewUser() {
    if (isNewUser === null) {
      let freshValue = (await getItemAsync('isNewUser')) === 'true';
      setIsNewUser(freshValue);
      return freshValue;
    }
    return isNewUser;
  }

  async function updateIsNewUser(value: boolean) {
    setIsNewUser(value);
    await setItemAsync('isNewUser', value.toString());
  }

  return (
    <AuthContext.Provider
      value={{
        getToken,
        updateToken,
        deleteToken,
        getIsNewUser,
        updateIsNewUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
