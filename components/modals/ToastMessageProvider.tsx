import BannerMessage, {
  BannerMessageDisplay,
  BannerMessageSize,
  BannerMessageType,
} from '@/components/BannerMessage';
import { Spacings } from '@/constants/Spacings';
import { useInterval } from '@/lib/hooks';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastMessageProviderProps {
  children: ReactNode;
}

interface ToastMessageInterface {
  showToastMessage(
    message?: string,
    type?: BannerMessageType,
    timeout?: number,
    title?: string,
  ): void;
}

const ToastMessageContext = createContext<ToastMessageInterface | null>(null);

export const useToastMessage = () => {
  const context = useContext(ToastMessageContext);

  if (!context) {
    throw new Error(
      'useToastMessage must be used within a ToastMessageProvider',
    );
  }

  return context.showToastMessage;
};

export default function ToastMessageProvider({
  children,
}: ToastMessageProviderProps) {
  const [toastSize, setToastSize] = useState(BannerMessageSize.Small);
  const [toastType, setToastType] = useState(BannerMessageType.Informational);

  const [toastTitle, setToastTitle] = useState('');
  const [toastTitleCache, setToastTitleCache] = useState<string>('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastMessageCache, setToastMessageCache] = useState<string>('');

  const [count, setCount] = useState(4);

  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 50;

  useEffect(() => {
    if (toastTitle) {
      setToastTitleCache(toastTitle);
    }
    if (toastMessage) {
      setToastMessageCache(toastMessage);
    }
  }, [toastTitle, toastMessage]);

  useInterval(
    () => {
      if (count === 1) {
        setToastTitle('');
        setToastMessage('');
      } else {
        setCount(count - 1);
      }
    },
    count > 0 && (toastTitle !== '' || toastMessage !== '') ? 1000 : null,
  );

  function showToastMessage(
    message: string,
    type?: BannerMessageType,
    timeout?: number,
    title?: string,
  ) {
    setToastSize(BannerMessageSize.Small);
    setToastMessage(message);
    type !== undefined && setToastType(type);
    timeout !== undefined && setCount(timeout);
    title !== undefined && setToastTitle(title);
  }

  return (
    <ToastMessageContext.Provider value={{ showToastMessage }}>
      {(toastTitle || toastMessage) && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            top: headerHeight + Spacings.md,
            zIndex: 9,
          }}>
          <Animated.View
            style={{ width: '85%' }}
            entering={FadeInUp.duration(250)}
            exiting={FadeOutUp.duration(250)}>
            <BannerMessage
              display={BannerMessageDisplay.Toast}
              type={toastType}
              size={toastSize}
              title={toastTitleCache}
              description={toastMessageCache}
              onMessagePress={() => {
                setToastTitle('');
                setToastMessage('');
              }}
            />
          </Animated.View>
        </View>
      )}
      {children}
    </ToastMessageContext.Provider>
  );
}
