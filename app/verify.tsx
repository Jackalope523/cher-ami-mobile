import { useAuth } from '@/components/AuthProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import OTPInput from '@/components/OTPInput/OTPInput';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useEmailVerifyMutation } from '@/lib/hooks';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function Verify() {
  const showToast = useToastMessage();
  const [code, setCode] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { email } = useLocalSearchParams();
  const { updateToken, updateOnboarded } = useAuth();
  const emailVerifyMutation = useEmailVerifyMutation(
    (response) => {
      showToast('Successfully logged in!', ToastMessageType.Success);
      updateToken(response.token);
      updateOnboarded(response.onboarded);
    },
    (_) => {
      showToast('Network error. Try again.', ToastMessageType.Error);
    },
  );

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function buttonDisabled() {
    return code.length !== 6 || emailVerifyMutation.isPending;
  }

  return (
    <View
      style={[
        styles.container,
        keyboardVisible && {
          justifyContent: 'flex-start',
        },
      ]}>
      <View style={{ marginBottom: Spacings.md }}>
        <Pressable onPress={Keyboard.dismiss}>
          <Text style={[textStyles.heading1, { marginBottom: Spacings.md }]}>
            Verification
          </Text>
          <Text style={[textStyles.body, { marginBottom: Spacings.xxl }]}>
            Please enter the code we sent to your email{' '}
            <Text style={{ fontWeight: 'bold' }}>{email}</Text>
          </Text>
        </Pressable>

        <OTPInput codeLength={6} code={code} setCode={setCode} />
      </View>

      <PopPressable
        onPress={() => {
          emailVerifyMutation.mutate({ email: email as string, code });
        }}
        disabled={buttonDisabled()}
        style={[
          styles.button,
          buttonDisabled() && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            buttonDisabled() && { color: '#A8ABB3' },
          ]}>
          Continue
        </Text>
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacings.lgmd,
    justifyContent: 'space-between',
    backgroundColor: '#FCFBF8',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    marginBottom: Spacings.lgmd,
  },
});
