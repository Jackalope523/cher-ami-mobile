import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
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
  isLoaded: () => boolean;
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
    isLoaded: context.isLoaded,
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
      setToken(await getItemAsync('token'));
      setOnboarded((await getItemAsync('Onboarded')) === 'true');
      setLoaded(true);
    }

    loadAsync();
  }, []);

  function isLoaded() {
    return loaded;
  }

  function getToken() {
    return token;
  }

  function updateToken(token: string) {
    setToken(token);
    setItemAsync('token', token);
  }

  function deleteToken() {
    setToken(null);
    deleteItemAsync('token');
  }

  function getOnboarded() {
    return onboarded;
  }

  function updateOnboarded(value: boolean) {
    setOnboarded(value);
    setItemAsync('Onboarded', value.toString());
  }

  return (
    <AuthContext.Provider
      value={{
        isLoaded,
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
