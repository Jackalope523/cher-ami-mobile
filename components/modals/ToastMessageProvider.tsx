import AlertIcon from '@/assets/icons/alert.svg';
import CheckIcon from '@/assets/icons/check.svg';
import InfoIcon from '@/assets/icons/info.svg';
import ErrorIcon from '@/assets/icons/x.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastMessageProviderProps {
  children: ReactNode;
}

interface ToastMessageInterface {
  showToastMessage(
    message?: string,
    type?: ToastMessageType,
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
  const insets = useSafeAreaInsets();
  const [toastType, setToastType] = useState(ToastMessageType.Success);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setToastMessage(''), 2000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  function showToastMessage(message: string, type?: ToastMessageType) {
    setToastMessage(message);
    type !== undefined && setToastType(type);
  }

  function mapColor() {
    switch (toastType) {
      case ToastMessageType.Success:
        return '#9AD47C';
      case ToastMessageType.Error:
        return '#F47A70';
      case ToastMessageType.Alert:
        return '#F6CE4B';
      case ToastMessageType.Informational:
        return '#83C4F1';
      default:
        return '#9AD47C';
    }
  }

  function mapIcon() {
    switch (toastType) {
      case ToastMessageType.Success:
        return <CheckIcon height={24} width={24} />;
      case ToastMessageType.Error:
        return <ErrorIcon height={24} width={24} />;
      case ToastMessageType.Alert:
        return <AlertIcon height={24} width={24} />;
      case ToastMessageType.Informational:
        return <InfoIcon height={24} width={24} />;
      default:
        return <CheckIcon height={24} width={24} />;
    }
  }

  return (
    <ToastMessageContext.Provider value={{ showToastMessage }}>
      {toastMessage && (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            top: insets.top,
            bottom: insets.bottom,
            left: insets.left,
            right: insets.right,
            zIndex: 11,
            pointerEvents: 'box-none',
          }}>
          <Animated.View
            style={{
              flexDirection: 'row',
              backgroundColor: mapColor(),
              padding: Spacings.lgmd,
              columnGap: Spacings.mdsm,
              borderRadius: 20,
            }}
            entering={FadeInUp.duration(250)}
            exiting={FadeOutUp.duration(250)}>
            {mapIcon()}
            <Text style={textStyles.heading5}>{toastMessage}</Text>
          </Animated.View>
        </View>
      )}
      {children}
    </ToastMessageContext.Provider>
  );
}

export enum ToastMessageType {
  Error,
  Alert,
  Informational,
  Success,
}
