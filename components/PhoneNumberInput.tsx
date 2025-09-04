import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';

import ErrorIcon from '@/assets/icons/error-fill.svg';
import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import countryCodeOptions, { attachAction } from './CountryCodeOptions';
import LizardTextInput, { InputType } from './LizardTextInput';
import RequiredAsterisk from './RequiredAsterisk';
import SparrowIcon from './SparrowIcon';
import { useBottomSheetModal } from './modals/BottomSheetModalProvider';

interface PhoneNumberInputProps {
  textRef?: RefObject<TextInput>;
  setNumber: Dispatch<SetStateAction<string>>;
  setValid: Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
}

function PhoneNumberInput({
  textRef,
  setNumber,
  setValid,
  disabled = false,
  required = false,
  description,
  onSubmitEditing,
}: PhoneNumberInputProps) {
  const { dismissBottomSheetModals, displayOptionsBottomSheet } =
    useBottomSheetModal();

  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [validCountryCode, setValidCountryCode] = useState(true);
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);

  const [error, setError] = useState('');

  function handleCountryCode() {
    let countryCodes = attachAction(countryCodeOptions, (country) => {
      setCountryCode(country);
      dismissBottomSheetModals();
    });
    displayOptionsBottomSheet(
      countryCodes,
      'Country Code',
      undefined,
      styles.flagIcon,
    );
  }

  useEffect(() => {
    setError('');

    if (phoneNumber.length === 0) {
      setValid(false);
    } else if (phoneNumber.length < 7) {
      setValid(false);
      setError('Too few numbers');
    } else {
      setValid(true);
      setNumber(countryCode + phoneNumber);
    }
  }, [countryCode, validPhoneNumber]);

  function onBlur() {
    setNumber(countryCode + phoneNumber);
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text
          style={[
            GlobalStyles.labelTextTwoAsTyped,
            GlobalStyles.textDark,
            disabled
              ? GlobalStyles.textDisabled
              : error
              ? GlobalStyles.textError
              : GlobalStyles.textDark,
          ]}>
          Phone Number
        </Text>
        <RequiredAsterisk disabled={disabled} required={required} />
      </View>
      <View style={styles.inputContainer}>
        <Pressable style={{ flex: 3 }} onPress={handleCountryCode}>
          <LizardTextInput
            valid={validCountryCode}
            setValid={setValidCountryCode}
            text={countryCode}
            setText={setCountryCode}
            inputMode="none"
            editable={false}
            maxLength={5}
            hideErrors
            clearButton={false}
            pointerEvents="none"
          />
        </Pressable>
        <View style={{ flex: 10 }}>
          <LizardTextInput
            ref={textRef}
            type={InputType.PhoneNumber}
            valid={validPhoneNumber}
            setValid={setValidPhoneNumber}
            onBlur={onBlur}
            text={phoneNumber}
            setText={setPhoneNumber}
            inputMode="tel"
            maxLength={17}
            keyboardType="phone-pad"
            placeholder="(000) 000-0000"
            hideErrors
            onSubmitEditing={onSubmitEditing}
          />
        </View>
      </View>
      {error && !disabled ? (
        <View style={styles.errorContainer}>
          <SparrowIcon
            Icon={ErrorIcon}
            fill={Colors.red400}
            style={styles.icon}
          />
          <Text
            style={[GlobalStyles.bodyTextTwo, GlobalStyles.textErrorDarker]}>
            {error}
          </Text>
        </View>
      ) : disabled ? (
        <Text
          style={[
            GlobalStyles.bodyTextTwo,
            GlobalStyles.textDisabled,
            styles.description,
          ]}>
          You cannot modify your phone number.
        </Text>
      ) : (
        description && (
          <Text
            style={[
              GlobalStyles.bodyTextTwo,
              GlobalStyles.textDark,
              styles.description,
              error ? GlobalStyles.textError : GlobalStyles.textDark,
            ]}>
            {description}
          </Text>
        )
      )}
    </View>
  );
}

export default PhoneNumberInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    rowGap: Spacings.xs,
  },

  labelContainer: {
    flexDirection: 'row',
  },

  inputContainer: {
    flexDirection: 'row',
    columnGap: Spacings.mdsm,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacings.xs,
    columnGap: Spacings.sm,
  },

  icon: {
    flex: 0,
  },

  flagIcon: {
    borderWidth: 2,
    borderRadius: borderRadius.xs,
    borderColor: Colors.brown800,
    aspectRatio: 640 / 500,
    justifyContent: 'center',
  },

  description: {
    paddingTop: Spacings.xs,
  },
});
