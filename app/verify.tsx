import { useAuth } from '@/components/AuthProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import OTPInput from '@/components/OTPInput/OTPInput';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useEmailAuthMutation, useEmailVerifyMutation } from '@/lib/hooks';
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
      updateToken(response.token);
      updateOnboarded(response.onboarded);
    },
    (_) => {
      showToast(
        "That code didn't work. Please try again.",
        ToastMessageType.Error,
      );
    },
  );
  const resendCodeMutation = useEmailAuthMutation(
    () => {
      setCode('');
      showToast('We sent you a new code!', ToastMessageType.Success);
    },
    (_) => {
      showToast("Couldn't send a new code. Try again.", ToastMessageType.Error);
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
            Check your email
          </Text>
          <Text style={[textStyles.body, { marginBottom: Spacings.lg }]}>
            We sent a 6-digit code to{' '}
            <Text style={{ fontWeight: 'bold' }}>{email}</Text>. Enter it below
            to continue.
          </Text>
          <Text style={[textStyles.caption, { marginBottom: Spacings.xxl }]}>
            Can&apos;t find it? Check your spam or junk folder.
          </Text>
        </Pressable>

        <OTPInput codeLength={6} code={code} setCode={setCode} />

        <Pressable
          onPress={() => {
            if (!resendCodeMutation.isPending) {
              resendCodeMutation.mutate({ email: email as string });
            }
          }}
          style={{ paddingVertical: Spacings.mdsm }}>
          <Text style={[textStyles.caption, { textAlign: 'center' }]}>
            Didn&apos;t get an email?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>
              Send a new code
            </Text>
          </Text>
        </Pressable>
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
