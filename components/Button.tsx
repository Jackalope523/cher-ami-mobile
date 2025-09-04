import { borderRadius } from '@/constants/Borders';
import { buttonStyles } from '@/constants/ButtonStyles';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import WickedCreamyPressable, { ShadowSize } from './WickedCreamyPressable';

export interface ButtonProps {
  onPress?: () => void;
  text?: string;
  type?: ButtonType;
  disabled?: boolean;
}

export default function Button({
  onPress = () => {},
  text = 'NULL',
  type = ButtonType.Success,
  disabled = false,
}: ButtonProps) {
  let buttonStyle;
  let buttonDisabledStyle;
  let textStyle;
  let textDisabledStyle;
  let shadowStyle;

  switch (type) {
    case ButtonType.PrimaryLight:
      buttonStyle = buttonStyles.buttonPrimaryLight;
      buttonDisabledStyle = buttonStyles.buttonPrimaryLightDisabled;
      textStyle = { color: Colors.canaryDark };
      textDisabledStyle = { color: Colors.canaryDark };
      shadowStyle = buttonStyles.shadowPrimaryLight;
      break;

    case ButtonType.SecondaryDark:
      buttonStyle = buttonStyles.buttonSecondaryDark;
      buttonDisabledStyle = buttonStyles.buttonSecondaryLight;
      textStyle = { color: Colors.canaryDark };
      textDisabledStyle = { color: Colors.canaryDark };
      shadowStyle = buttonStyles.shadowPrimaryLight;
      break;

    case ButtonType.SecondaryLight:
      buttonStyle = buttonStyles.buttonSecondaryDark;
      buttonDisabledStyle = buttonStyles.buttonSecondaryLight;
      textStyle = { color: Colors.canaryDark };
      textDisabledStyle = { color: Colors.canaryDark };
      shadowStyle = buttonStyles.shadowPrimaryLight;
      break;

    case ButtonType.Success:
      buttonStyle = buttonStyles.buttonSuccess;
      buttonDisabledStyle = buttonStyles.buttonSuccessDisabled;
      textStyle = buttonStyles.buttonSuccessText;
      textDisabledStyle = buttonStyles.buttonSuccessDisabledText;
      shadowStyle = buttonStyles.shadowSuccess;
      break;

    case ButtonType.Warning:
      buttonStyle = buttonStyles.buttonWarning;
      buttonDisabledStyle = buttonStyles.buttonWarningDisabled;
      textStyle = buttonStyles.buttonWarningText;
      textDisabledStyle = buttonStyles.buttonWarningDisabledText;
      shadowStyle = buttonStyles.shadowWarning;
      break;

    case ButtonType.Error:
      buttonStyle = buttonStyles.buttonError;
      buttonDisabledStyle = buttonStyles.buttonErrorDisabled;
      textStyle = buttonStyles.buttonErrorText;
      textDisabledStyle = buttonStyles.buttonErrorDisabledText;
      shadowStyle = buttonStyles.shadowError;
      break;

    case ButtonType.Function:
      buttonStyle = buttonStyles.buttonFunction;
      buttonDisabledStyle = buttonStyles.buttonFunctionDisabled;
      textStyle = buttonStyles.buttonFunctionText;
      textDisabledStyle = buttonStyles.buttonFunctionDisabledText;
      shadowStyle = buttonStyles.shadowSuccess;
      break;
  }

  return (
    <WickedCreamyPressable
      onPress={onPress}
      disabled={disabled}
      shadowStyle={shadowStyle}
      size={ShadowSize.Small}>
      <View
        style={[styles.btnBase, disabled ? buttonDisabledStyle : buttonStyle]}>
        <Text
          style={[
            GlobalStyles.headingTextThree,
            disabled ? textDisabledStyle : textStyle,
          ]}>
          {text}
        </Text>
      </View>
    </WickedCreamyPressable>
  );
}

export enum ButtonType {
  PrimaryLight,
  SecondaryDark,
  SecondaryLight,
  Success,
  Warning,
  Error,
  Function,
}

const styles = StyleSheet.create({
  btnBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacings.md,

    borderWidth: 2,
    borderRadius: borderRadius.md,
    columnGap: Spacings.sm,
  },
});
