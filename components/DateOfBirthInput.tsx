import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import ErrorIcon from '@/assets/icons/error-fill.svg';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import LizardTextInput, { InputType } from './LizardTextInput';
import RequiredAsterisk from './RequiredAsterisk';

/*

Use this input field component (DateOfBirthInput2) instead of DateOfBirthInput, in case DateOfBirthInput
fails after user testing. This input is pretty solid UX-wise and should fit on all screens.

*/

// ! ||--------------------------------------------------------------------------------||
// ! ||                                     Types                                      ||
// ! ||--------------------------------------------------------------------------------||
interface DateOfBirthInputProps {
  textRef?: RefObject<TextInput>;
  setDate: Dispatch<SetStateAction<Date>>;
  setValid: Dispatch<SetStateAction<boolean>>;
  initialDate?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function DateOfBirthInput({
  textRef,
  setDate,
  setValid,
  initialDate,
  disabled = false,
  required = false,
}: DateOfBirthInputProps) {
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const [Day, setDay] = useState(initialDate ? initialDate.split(' ')[0] : '');
  const [Month, setMonth] = useState(
    initialDate ? initialDate.split(' ')[1] : '',
  );
  const [Year, setYear] = useState(
    initialDate ? initialDate.split(' ')[2] : '',
  );

  const [validDay, setValidDay] = useState(false);
  const [validMonth, setValidMonth] = useState(false);
  const [validYear, setValidYear] = useState(false);

  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState(-1);

  const badAtTyping: boolean =
    // Unfocused: true if any of Day, Month, or Year are non-empty
    (focusedInput === -1 && (Day !== '' || Month !== '' || Year !== '')) ||
    // Day focused: true if Month or Year is non-empty and invalid,
    // or if Day is invalid
    (focusedInput === 0 &&
      ((Month !== '' && !validMonth) ||
        (Year !== '' && !validYear) ||
        (Day.length > 0 && !validDay))) ||
    // Month focused: true if Day is empty or invalid, or if Year is non-empty and invalid,
    // or if Month is invalid
    (focusedInput === 1 &&
      (Day === '' ||
        !validDay ||
        (Year !== '' && !validYear) ||
        (Month.length > 0 && !validMonth))) ||
    // Year focused: true if Day or Month is empty, or if Day or Month is invalid,
    // or if Year has length 4 and is invalid
    (focusedInput === 2 &&
      (Day === '' ||
        !validDay ||
        Month === '' ||
        !validMonth ||
        (Year.length === 4 && !validYear)));

  useEffect(() => {
    let dayIsValid: boolean =
      Day === '' ||
      Month === '' ||
      isValidDayOfTheMonth(Number(Day), Number(Month), Number(Year));
    let isValid = validDay && validMonth && validYear && dayIsValid;
    setError('');

    if (isValid) {
      const dob = new Date(
        Date.UTC(Number(Year), Number(Month) - 1, Number(Day), 0, 0, 0),
      );

      if (badAtTyping) {
        if (isNotAlive(dob)) {
          setValid(false);
          setError('Uh huh... sure.');
        } else if (is18OrOlder(dob)) {
          setValid(true);
          setDate(dob);
        } else {
          setValid(false);
          setError('You are too young to join, sorry!');
        }
      }
    } else if (badAtTyping || !dayIsValid) {
      setError('Please enter a valid date of birth.');
    }
  }, [validDay, validMonth, validYear, focusedInput]);

  function isValidDayOfTheMonth(day: number, month: number, year?: number) {
    const isLeapYear = (year: number) =>
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    console.log(`Checking ${day}/${month}/${new Date().getFullYear()}`);
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap year in February
    if (month === 2 && year ? isLeapYear(year) : false) {
      daysInMonth[1] = 29;
    }

    // Check if day is valid for the month
    return day <= daysInMonth[month - 1];
  }

  function isNotAlive(birthDate: Date): boolean {
    const today = new Date(Date.now());
    const manyManyYearsAgo = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate(),
    );

    return today <= birthDate || birthDate <= manyManyYearsAgo;
  }

  function is18OrOlder(birthDate: Date): boolean {
    const today = new Date(Date.now());
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );

    return birthDate <= eighteenYearsAgo;
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
          Date of Birth
        </Text>
        <RequiredAsterisk disabled={disabled} required={required} />
      </View>
      <View style={styles.inputContainer}>
        <View style={{ flex: 5 }}>
          <LizardTextInput
            ref={textRef}
            type={InputType.Day}
            valid={validDay}
            setValid={setValidDay}
            text={Day}
            setText={setDay}
            inputMode="numeric"
            maxLength={2}
            clearButton={false}
            placeholder="DD"
            hideErrors
            onSubmitEditing={() => monthRef.current?.focus()}
            onFocus={() => setFocusedInput(0)}
            onEndEditing={() => setFocusedInput(-1)}
            disabled={disabled}
          />
        </View>
        <View style={{ flex: 5 }}>
          <LizardTextInput
            ref={monthRef}
            type={InputType.Month}
            valid={validMonth}
            setValid={setValidMonth}
            text={Month}
            setText={setMonth}
            inputMode="numeric"
            maxLength={2}
            clearButton={false}
            placeholder="MM"
            hideErrors
            onSubmitEditing={() => yearRef.current?.focus()}
            onFocus={() => setFocusedInput(1)}
            onEndEditing={() => setFocusedInput(-1)}
            disabled={disabled}
          />
        </View>
        <View style={{ flex: 8 }}>
          <LizardTextInput
            ref={yearRef}
            type={InputType.Year}
            valid={validYear}
            setValid={setValidYear}
            text={Year}
            setText={setYear}
            inputMode="numeric"
            maxLength={4}
            clearButton={false}
            placeholder="YYYY"
            hideErrors
            onFocus={() => setFocusedInput(2)}
            onEndEditing={() => setFocusedInput(-1)}
            disabled={disabled}
          />
        </View>
      </View>
      {error && !disabled ? (
        <View style={styles.errorContainer}>
          <ErrorIcon
            width={24}
            height={24}
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
          You cannot modify your date of birth.
        </Text>
      ) : (
        <Text
          style={[
            GlobalStyles.bodyTextTwo,
            GlobalStyles.textDark,
            styles.description,
            error ? GlobalStyles.textError : GlobalStyles.textDark,
          ]}>
          You must be 18 years or older to join.
        </Text>
      )}
    </View>
  );
}

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

  description: {
    paddingTop: Spacings.xs,
  },
});
