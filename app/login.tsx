import { globalStyles } from '@/constants/GlobalStyles';
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

import PhoneNumberImage from '@/assets/illustrations/phone-number-illustration.png';
import { BannerMessageType } from '@/components/BannerMessage';
import Button, {
  ButtonDisplay,
  ButtonSize,
  ButtonType,
} from '@/components/Button';
import PhoneNumberInput from '@/components/PhoneNumberInput';
import { Spacings } from '@/constants/Spacings';
import { handleCuratorError } from '@/lib/errorHandler';
import { Modals } from '@/lib/modalCurator';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';

export default function Login() {
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(true);

  function handleLogin() {
    setButtonEnabled(false);

    login({ phoneNumber })
      .then(navigate)
      .catch(handleCuratorError)
      .finally(() => setButtonEnabled(true));
  }

  function navigate() {
    router.push({
      pathname: '/verify',
      params: { phoneNumber },
    });
  }

  function handleHelp() {
    if (validPhoneNumber) {
      Modals.toastMiniMessage(
        'If this account has an email address attached, a recovery link will be sent.',
        BannerMessageType.Success,
      );
    } else {
      Modals.toastMiniMessage(
        'Please enter a valid phone number.',
        BannerMessageType.Alert,
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable
        style={[styles.container, globalStyles.baseContainer]}
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
            <Button
              type={ButtonType.Success}
              size={ButtonSize.Medium}
              display={ButtonDisplay.Full}
              text={'Log in'}
              onPress={handleLogin}
              disabled={!validPhoneNumber || !buttonEnabled}
            />
            <TouchableOpacity onPress={handleHelp} style={styles.pressable}>
              <Text style={globalStyles.textDark}>{"Can't log in?"}</Text>
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

