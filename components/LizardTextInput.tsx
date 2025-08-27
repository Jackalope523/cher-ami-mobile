import {
  Dispatch,
  forwardRef,
  Ref,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { globalStyles } from '@/constants/GlobalStyles';

import RequiredAsterisk from './RequiredAsterisk';

import CloseOutline from '@/assets/icons/close-outline.svg';
import ErrorFill from '@/assets/icons/error-fill.svg';
import MultilineIcon from '@/assets/icons/multi-line-indicator.svg';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import SparrowIcon from './SparrowIcon';

// ! ||--------------------------------------------------------------------------------||
// ! ||                                     Types                                      ||
// ! ||--------------------------------------------------------------------------------||
interface LizardTextInputProps extends TextInputProps {
  type?: InputType;
  containerStyle?: ViewStyle[];
  label?: string;
  description?: string;
  recommended?: boolean;
  required?: boolean;
  disabled?: boolean;
  counter?: boolean;
  hideErrors?: boolean;
  clearButton?: boolean;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  valid: boolean;
  setValid: Dispatch<SetStateAction<boolean>>;
  shadow?: boolean;
}

function LizardTextInput(
  {
    type = InputType.GivenName,
    containerStyle = [],
    label,
    description,
    recommended = false,
    required = false,
    disabled = false,
    counter = false,
    hideErrors = false,
    clearButton = true,
    text,
    setText,
    valid,
    setValid,
    shadow = false,

    style,
    multiline,
    numberOfLines,
    onFocus = () => {},
    onBlur = () => {},
    returnKeyType = 'done',
    editable,
    enablesReturnKeyAutomatically = true,
    onSubmitEditing = (e: any) => {},
    ...props
  }: LizardTextInputProps,
  ref: Ref<TextInput>,
) {
  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                   Text input                                   ||
  // ! ||--------------------------------------------------------------------------------||
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef<TextInput>(null);
  const locked = useRef<boolean>(false);

  useImperativeHandle(ref, () => internalRef.current as TextInput);

  const bw = useSharedValue(2);

  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      borderWidth: bw.value,
    };
  });

  useEffect(() => {
    bw.value = withTiming(isFocused ? 4 : 2, {
      duration: 800,
    });
  }, [isFocused]);

  const customOnFocus = () => {
    setIsFocused(true);
  };

  const customOnBlur = () => {
    locked.current ? internalRef.current?.focus() : setIsFocused(false);
    locked.current = false;
    handleSubmit();
  };

  const handleSubmit = () => {
    validateInput();
  };

  const handleChangeText = (formatted: string) => {
    setText(formatted);
  };

  const iconOpacity = useDerivedValue(() =>
    withTiming(isFocused ? 1 : 0, { duration: 200 }),
  );

  const animatedIconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
  }));

  const handleClear = () => {
    locked.current = true;
    setText('');
  };

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                   Validation                                   ||
  // ! ||--------------------------------------------------------------------------------||
  const [error, setError] = useState('');

  const validateInput = () => {
    let currentValidity = false;
    let currentError = '';

    const nameRegex = /^[\p{L}\p{M}]+(['’\-][\p{L}\p{M}]+)*$/u;

    switch (type) {
      case InputType.Time24h:
        // TODO don't even let the USER input whatever's not in the regex
        const time24hRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (text.length === 0) {
          currentError = 'Time field cannot be empty.';
        } else if (!time24hRegex.test(text)) {
          currentError = 'Invalid.';
        } else {
          currentValidity = true;
        }
        break;

      case InputType.Time12h:
        const time12hRegex = /^(0[1-9]|1[0-2]):([0-5]\d)/;

        if (text.length === 0) {
          currentError = 'Time field cannot be empty.';
        } else if (!time12hRegex.test(text)) {
          currentError = 'Invalid.';
        } else {
          currentValidity = true;
        }
        break;

      case InputType.CircleTitle:
        if (text.length === 0) {
          currentError = 'Circle title field cannot be empty.';
        } else {
          currentValidity = true;
        }
        break;

      case InputType.Title:
        currentValidity = true;
        break;

      case InputType.GivenName:
        if (text.length === 0) {
          currentError = 'Given name cannot be empty.';
        } else if (!nameRegex.test(text)) {
          currentError = 'First name can only contain letters.';
        } else {
          currentValidity = true;
        }
        break;

      case InputType.FamilyName:
        if (text.length === 0) {
          currentError = 'Family name cannot be empty.';
        } else if (!nameRegex.test(text)) {
          currentError = 'First name can only contain letters.';
        } else {
          currentValidity = true;
        }
        break;

      case InputType.PhoneNumber:
        if (text.length === 0) {
          currentError = 'Phone number field cannot be empty.';
        } else if (text.length < 7) {
          currentError = 'Too few numbers';
        } else {
          currentValidity = true;
        }
        break;

      case InputType.Email:
        currentValidity = true;
        break;

      case InputType.Day:
        const dayRegex = /^(0?[1-9]|[12][0-9]|3[01])$/;

        if (!dayRegex.test(text)) {
          currentError = 'Invalid.';
        } else {
          currentValidity = true;
        }
        break;

      case InputType.Month:
        const monthRegex = /^(0?[1-9]|1[0-2])$/;

        if (!monthRegex.test(text)) {
          currentError = 'Invalid.';
        } else {
          currentValidity = true;
        }
        break;

      case InputType.Year:
        const yearRegex = /^\d{4}$/;

        if (!yearRegex.test(text)) {
          currentError = 'Invalid.';
        } else {
          currentValidity = true;
        }
        break;

      case InputType.Feedback:
        if (text.length === 0) {
          currentError = 'Nothing??';
        } else if (text.length <= 5) {
          currentError = 'You gotta put a little something!';
        } else {
          currentValidity = true;
        }
        break;

      // Default
      default:
        props.maxLength = undefined;
        currentValidity = false;
    }

    setValid(currentValidity);
    setError(currentError);
  };

  return (
    <View style={styles.container}>
      {(label || recommended || counter) && (
        <View style={styles.labelContainer}>
          <View style={styles.labelWrapper}>
            {label && (
              <Text
                style={[
                  globalStyles.labelTextTwoAsTyped,
                  disabled
                    ? globalStyles.textDisabled
                    : error
                    ? globalStyles.textError
                    : globalStyles.textDark,
                ]}>
                {label}
              </Text>
            )}

            <RequiredAsterisk disabled={disabled} required={required} />

            {recommended && (
              <Text
                style={[
                  globalStyles.labelTextTwoItalic,
                  globalStyles.textDark,
                  styles.labelRecommended,
                  disabled
                    ? globalStyles.textDisabled
                    : error
                    ? globalStyles.textError
                    : globalStyles.textDark,
                ]}>
                {' '}
                (recommended)
              </Text>
            )}
          </View>

          {counter && (
            <Text
              style={[
                styles.counter,
                globalStyles.labelTextTwoAsTyped,
                disabled
                  ? globalStyles.textDisabled
                  : error
                  ? globalStyles.textError
                  : globalStyles.textDark,
              ]}>
              {text.length}
              {'/'}
              {props.maxLength}
            </Text>
          )}
        </View>
      )}

      <View>
        <Animated.View
          style={[
            styles.inputContainer,
            containerStyle,
            animatedInputStyle,
            disabled
              ? styles.inputContainerDisabled
              : error
              ? styles.inputContainerInvalid
              : styles.inputContainerEnabled,
          ]}
          layout={LinearTransition}>
          <TextInput
            ref={internalRef}
            placeholderTextColor={error ? globalStyles.textError.color : 'grey'}
            value={text}
            onChangeText={handleChangeText}
            onFocus={(e) => {
              customOnFocus();
              onFocus && onFocus(e);
            }}
            onBlur={(e) => {
              customOnBlur();
              onBlur && onBlur(e);
            }}
            style={[
              styles.defaultStyle,
              globalStyles.bodyTextOne,
              disabled
                ? globalStyles.textDisabled
                : error
                ? globalStyles.textError
                : globalStyles.textDark,
              {
                width: '100%',
                flexShrink: 1,
                minHeight: numberOfLines
                  ? numberOfLines * Spacings.lg
                  : Spacings.lg,
              },
              style,
            ]}
            selectionColor={Colors.brown800}
            editable={!disabled && editable}
            returnKeyType={returnKeyType}
            enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
            hitSlop={{
              right: clearButton || multiline ? 100 : 0,
            }}
            onSubmitEditing={(e) => {
              onSubmitEditing(e);
              handleSubmit();
            }}
            testID="input"
            numberOfLines={numberOfLines}
            multiline={multiline}
            {...props}
          />

          {((clearButton && isFocused) || multiline) && (
            <View style={styles.iconContainer}>
              {clearButton && isFocused && (
                <Pressable
                  onTouchEndCapture={handleClear}
                  pointerEvents={text.length > 0 ? 'auto' : 'none'}
                  style={{
                    flex: 1,
                    paddingTop: multiline ? Spacings.md : 0,
                    justifyContent: multiline ? 'flex-start' : 'center',
                  }}>
                  <Animated.View style={animatedIconStyle}>
                    <SparrowIcon
                      Icon={CloseOutline}
                      fill={error ? Colors.red400 : Colors.brown800}
                    />
                  </Animated.View>
                </Pressable>
              )}

              {multiline && !(clearButton && isFocused) && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    paddingBottom: Spacings.md,
                  }}>
                  <MultilineIcon
                    height={9}
                    width={9}
                    fill={error ? Colors.red400 : Colors.brown800}
                  />
                </View>
              )}
            </View>
          )}
        </Animated.View>

        {shadow && !disabled && (
          <Animated.View style={styles.shadow} layout={LinearTransition} />
        )}
      </View>

      {!hideErrors && error ? (
        <View style={styles.errorContainer}>
          <SparrowIcon
            Icon={ErrorFill}
            fill={Colors.red400}
            style={styles.icon}
          />
          <Text
            style={[globalStyles.bodyTextTwo, globalStyles.textErrorDarker]}>
            {error}
          </Text>
        </View>
      ) : (
        description && (
          <Text
            style={[
              globalStyles.bodyTextTwo,
              styles.description,
              disabled
                ? globalStyles.textDisabled
                : error
                ? globalStyles.textError
                : globalStyles.textDark,
            ]}
            testID="error">
            {description}
          </Text>
        )
      )}
    </View>
  );
}

// ! ||--------------------------------------------------------------------------------||
// ! ||                                     Styles                                     ||
// ! ||--------------------------------------------------------------------------------||
const styles = StyleSheet.create({
  container: {
    rowGap: Spacings.xs,
    // width: '100%',
    // flex: 1,
  },

  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  labelWrapper: {
    flexDirection: 'row',
  },

  labelRecommended: {
    paddingLeft: Spacings.xs,
  },

  labelRequired: {
    left: -2,
  },

  counter: {
    alignSelf: 'flex-end',
  },

  description: {
    paddingTop: Spacings.xs,
  },

  inputContainer: {
    borderRadius: 8,
    backgroundColor: Colors.canarySand,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputContainerEnabled: {
    borderColor: Colors.brown800,
  },

  inputContainerDisabled: {
    borderColor: Colors.brown300,
  },

  inputContainerInvalid: {
    borderColor: Colors.red400,
  },

  defaultStyle: {
    color: Colors.brown850,
    paddingHorizontal: Spacings.md,
    paddingTop: Spacings.md,
    paddingBottom: Spacings.md,
  },

  iconContainer: {
    flexDirection: 'column',
    marginRight: Spacings.md,
    position: 'relative',
  },

  icon: {
    flex: 0,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacings.xs,
    columnGap: Spacings.sm,
  },

  shadow: {
    height: 22,
    bottom: 18,
    marginBottom: -18,
    backgroundColor: Colors.canaryDark,
    zIndex: -1,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,

    // since the biggest value we have is 32, this should be 32 in case we round it with borderRadius BUT it seems to mess up the UI since it's hardcoded with these numbers in mind; change sometime later
    // height: 38,
  },
});

export enum TextInputSize {
  Medium,
  MediumSmall,
}

export enum InputType {
  // Time
  Time24h,
  Time12h,

  // Circle
  CircleTitle,

  // User
  Title,
  GivenName,
  FamilyName,
  PhoneNumber,
  Email,
  Day,
  Month,
  Year,

  // Feedback
  Feedback,

  // Chat
  Message,
}

export default forwardRef(LizardTextInput);
