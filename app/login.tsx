import { GlobalStyles } from '@/constants/GlobalStyles';
import {
  Dimensions,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import PhoneNumberImage from '@/assets/images/mouse.png';
import Button from '@/components/Button';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PhoneNumberInput from '@/components/PhoneNumberInput';
import { Spacings } from '@/constants/Spacings';
import { useEmailAuthMutation } from '@/lib/hooks';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';

export default function Login() {
  const showToastMessage = useToastMessage();

  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const mutation = useEmailAuthMutation(
    () => {
      router.push({
        pathname: '/verify',
        params: { phoneNumber },
      });
    },
    (error) => {
      console.error('Login failed: ', error.message);
      showToastMessage('Login failed.', ToastMessageType.Error);
    },
  );

  function handleLogin() {
    mutation.mutate({ phoneNumber });
  }

  function handleHelp() {
    if (validPhoneNumber) {
      showToastMessage(
        'If this account has an email address attached, a recovery link will be sent.',
        ToastMessageType.Success,
      );
    } else {
      showToastMessage(
        'Please enter a valid phone number.',
        ToastMessageType.Alert,
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable
        style={[styles.container, GlobalStyles.baseContainer]}
        onPress={Keyboard.dismiss}>
        <View style={styles.headerContainer}>
          <Image source={PhoneNumberImage} style={styles.header} />
        </View>

        <View style={styles.contentContainer}>
          <PhoneNumberInput
            setValid={setValidPhoneNumber}
            setNumber={setPhoneNumber}
            required
          />
          <View style={styles.buttonContainer}>
            <View style={{ alignSelf: 'stretch' }}>
              <Button
                text={'Log in'}
                onPress={handleLogin}
                disabled={!validPhoneNumber || mutation.isPending}
              />
            </View>

            <TouchableOpacity onPress={handleHelp} style={styles.pressable}>
              <Text style={GlobalStyles.textDark}>{"Can't log in?"}</Text>
            </TouchableOpacity>
          </View>
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

  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    width: Dimensions.get('window').height * 0.3,
    height: Dimensions.get('window').height * 0.3,
  },

  contentContainer: {
    rowGap: Spacings.lg,
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
