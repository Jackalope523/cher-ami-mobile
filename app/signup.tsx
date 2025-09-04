import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Button, { ButtonType } from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import DateOfBirthInput from '@/components/DateOfBirthInput';
import LizardTextInput, { InputType } from '@/components/LizardTextInput';
import PhoneNumberInput from '@/components/PhoneNumberInput';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { ScrollView } from 'react-native-gesture-handler';

import PhoneNumberImage from '@/assets/illustrations/phone-number-illustration.png';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Signup() {
  const [validName, setValidName] = useState(false);
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validDateOfBirth, setValidDateOfBirth] = useState(false);

  const [agreementsAgreed, setAgreementsAgreed] = useState(false);

  const [Name, setName] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(0));

  const [isButtonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    setButtonEnabled(
      validPhoneNumber && validName && validDateOfBirth && agreementsAgreed,
    );
  }, [validName, validPhoneNumber, validDateOfBirth, agreementsAgreed]);

  function handleContinue() {}

  ///////
  // Autoscrolling
  //////////////////

  const nameRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const dateOfBirthRef = useRef<TextInput>(null);

  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.container, GlobalStyles.baseContainer]}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}>
        <Image
          source={PhoneNumberImage}
          style={[GlobalStyles.illustrationMedium, styles.image]}
          resizeMode="contain"
        />

        <View style={styles.inputSection}>
          <LizardTextInput
            ref={nameRef}
            type={InputType.GivenName}
            label="First name"
            valid={validName}
            setValid={setValidName}
            text={Name}
            setText={setName}
            inputMode="text"
            maxLength={256}
            required
            description="Your name will be public and visible to all users."
            returnKeyType="next"
            onSubmitEditing={() => phoneNumberRef.current?.focus()}
          />
          <PhoneNumberInput
            textRef={phoneNumberRef}
            setValid={setValidPhoneNumber}
            setNumber={setPhoneNumber}
            required
            description="This will be your primary identifier."
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <LizardTextInput
            ref={emailRef}
            type={InputType.Email}
            label="Email"
            valid={validEmail}
            setValid={setValidEmail}
            text={Email}
            setText={setEmail}
            autoComplete="email"
            inputMode="email"
            maxLength={256}
            recommended
            description="We recommend binding an email address to your account in case you change your phone number."
            returnKeyType="next"
            onSubmitEditing={() => dateOfBirthRef.current?.focus()}
          />
          <DateOfBirthInput
            textRef={dateOfBirthRef}
            setDate={setDateOfBirth}
            setValid={setValidDateOfBirth}
            required
          />
        </View>
        <View style={styles.legalSection}>
          <Checkbox
            text={["I agree to CANARY's Terms of Service and Privacy Policy"]}
            onPress={() => {
              setAgreementsAgreed(!agreementsAgreed);
            }}
          />
          <View style={styles.legalText}>
            <Text
              style={GlobalStyles.hyperlink}
              onPress={() =>
                Linking.openURL(
                  'https://almostcanary.com/legal/terms?utm_source=app&utm_medium=internal&utm_campaign=onboarding',
                )
              }>
              Terms of Service
            </Text>
            <Text
              style={GlobalStyles.hyperlink}
              onPress={() =>
                Linking.openURL(
                  'https://almostcanary.com/legal/privacy?utm_source=app&utm_medium=internal&utm_campaign=onboarding',
                )
              }>
              Privacy Policy
            </Text>

            <Text style={GlobalStyles.textDark}>
              By providing your phone number, you agree to receive SMS messages
              for authentication purposes. Message and data rates may apply.
            </Text>
          </View>
        </View>

        <Button
          type={ButtonType.Success}
          text={'Continue'}
          onPress={handleContinue}
          disabled={isButtonEnabled}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ! ||--------------------------------------------------------------------------------||
// ! ||                                     Styles                                     ||
// ! ||--------------------------------------------------------------------------------||
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },

  image: {
    marginBottom: Spacings.xl,
    alignSelf: 'center',
  },

  inputSection: {
    rowGap: Spacings.sm,
  },

  legalSection: {
    paddingVertical: Spacings.lg,
    rowGap: Spacings.md,
    alignSelf: 'stretch',
  },

  legalText: {
    rowGap: Spacings.sm,
  },
});
