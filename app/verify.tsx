import VerificationImage from '@/assets/illustrations/verification-illustration-transparent.png';
import { useAPI } from '@/components/APIProvider';
import { BannerMessageType } from '@/components/BannerMessage';
import Button, {
  ButtonDisplay,
  ButtonSize,
  ButtonType,
} from '@/components/Button';
import { useToastMessage } from '@/components/modals/ToastMessageProvider';
import OTPInput from '@/components/OTPInput/OTPInput';
import { globalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { useMutation } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function Verify() {
  const showToastMessage = useToastMessage();
  const api = useAPI();

  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const shortNumber = phoneNumber.substring(phoneNumber.length - 4);

  const codeLength = 6;
  const resendTimeoutSeconds = 30;

  const [code, setCode] = useState('');
  const [codeReady, setCodeReady] = useState(false);
  const [activeResendTimeout, setActiveResendTimeout] = useState(0);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/account/verify', { phoneNumber, code });
      const { token } = response.data;

      await SecureStore.setItemAsync('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    },
    onSuccess: () => {
      router.replace('/(tabs)/upload');
    },
    onError: (err) => {
      console.error('Login failed:', err);
      showToastMessage('Login failed.', BannerMessageType.Error);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => api.post('/account/login', { phoneNumber }),
    onSuccess: () => {
      showToastMessage(
        `Verification code re-sent to ${phoneNumber}.`,
        BannerMessageType.Success,
      );
    },
    onError: (err) => {
      console.error('Resend failed:', err);
      showToastMessage('Resend failed.', BannerMessageType.Error);
    },
  });

  function handleVerify() {
    verifyMutation.mutate();
  }

  function handleResend() {
    if (activeResendTimeout === 0) {
      resendMutation.mutate();
      setActiveResendTimeout(resendTimeoutSeconds);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable
        style={[styles.container, globalStyles.baseContainer]}
        onPress={Keyboard.dismiss}>
        <View style={styles.contentContainer}>
          <Image
            source={VerificationImage}
            style={[globalStyles.illustrationLarge, styles.illustration]}
          />
          <Text
            style={[
              globalStyles.bodyTextOne,
              globalStyles.textDark,
              styles.text,
            ]}>
            Enter the {codeLength}-digit code we sent to your number ending in{' '}
            {shortNumber}.
          </Text>
          <OTPInput
            codeLength={codeLength}
            code={code}
            setCode={setCode}
            setCodeReady={setCodeReady}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            type={ButtonType.Success}
            size={ButtonSize.Medium}
            display={ButtonDisplay.Full}
            text={'Verify & Continue'}
            onPress={handleVerify}
            disabled={!codeReady || verifyMutation.isPending}
          />

          <TouchableOpacity onPress={handleResend} style={styles.pressable}>
            <Text style={globalStyles.textDark}>
              {activeResendTimeout <= 0
                ? "I haven't received a code"
                : `Resend again in ${activeResendTimeout} s`}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  contentContainer: {
    alignItems: 'center',
    rowGap: Spacings.lg,
  },

  illustration: {
    marginBottom: Spacings.sm,
  },

  text: {
    textAlign: 'center',
    // paddingBottom: Spacing.lg,
  },

  buttonContainer: {
    alignItems: 'center',
    rowGap: Spacings.md,
  },

  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.sm,
  },
});
