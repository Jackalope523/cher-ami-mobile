import { readSecure, removeSecure, writeSecure } from '@/lib/storage';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthInterface {
  loaded: boolean;
  getToken: () => string | null;
  updateToken: (token: string) => void;
  deleteToken: () => void;
  getOnboarded: () => boolean | null;
  updateOnboarded: (onboarded: boolean) => void;
}

const AuthContext = createContext<AuthInterface | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    loaded: context.loaded,
    getToken: context.getToken,
    updateToken: context.updateToken,
    deleteToken: context.deleteToken,
    getOnboarded: context.getOnboarded,
    updateOnboarded: context.updateOnboarded,
  };
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadAsync() {
      const token = await readSecure('token');
      const onboarded = (await readSecure('Onboarded')) === 'true';

      setToken(token);
      setOnboarded(onboarded);
      setLoaded(true);
    }

    loadAsync();
  }, []);

  function getToken() {
    return token;
  }

  function updateToken(token: string) {
    setToken(token);
    writeSecure('token', token);
  }

  function deleteToken() {
    setToken(null);
    removeSecure('token');
  }

  function getOnboarded() {
    return onboarded;
  }

  function updateOnboarded(value: boolean) {
    setOnboarded(value);
    writeSecure('Onboarded', value.toString());
  }

  return (
    <AuthContext.Provider
      value={{
        loaded,
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
