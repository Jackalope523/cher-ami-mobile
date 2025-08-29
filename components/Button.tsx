import { buttonStyles } from '@/constants/ButtonStyles';
import { Colors } from '@/constants/Colors';
import { globalStyles } from '@/constants/GlobalStyles';
import { Gap, Spacings } from '@/constants/Spacings';
import { FC } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import SparrowIcon from './SparrowIcon';
import WickedCreamyPressable, { ShadowSize } from './WickedCreamyPressable';

// Types
export interface ButtonProps {
  onPress?: () => void;
  text?: string;
  Icon?: FC<SvgProps>;

  disabled?: boolean;
  type?: ButtonType;
  size?: ButtonSize;
  display?: ButtonDisplay;
  hideIcon?: boolean;
}

const Button: FC<ButtonProps> = ({
  onPress = () => {},
  text = 'NULL',
  Icon = null,

  disabled = false,
  type = null,
  size = null,
  display = null,
  hideIcon = false,
}) => {
  // Rest styles
  let btnStyle: ViewStyle[] = [];
  let btnTextStyle: TextStyle[] = [];
  let btnIconStyle: string = '';

  // Disabled styles
  let btnDisabledStyle: ViewStyle[] = [];
  let btnDisabledTextStyle: TextStyle[] = [];
  let btnDisabledIconStyle: string = '';

  // Shadow
  let shadowStyle: ViewStyle = {};
  let shadowBorderRadiusStyle: ViewStyle = {};
  let shadowSize: ShadowSize = ShadowSize.Large;

  switch (type) {
    case ButtonType.PrimaryLight:
      btnStyle = [buttonStyles.buttonPrimaryLight];
      btnTextStyle = [globalStyles.textLight];
      btnIconStyle = Colors.canarySand;

      btnDisabledStyle = [buttonStyles.buttonPrimaryLightDisabled];
      btnDisabledTextStyle = [globalStyles.textLight];
      btnDisabledIconStyle = Colors.canarySand;

      shadowStyle = buttonStyles.shadowPrimaryLight;
      break;

    case ButtonType.SecondaryDark:
      btnStyle = [buttonStyles.buttonSecondaryDark];
      btnTextStyle = [globalStyles.textLight];
      btnIconStyle = Colors.canarySand;

      btnDisabledStyle = [buttonStyles.buttonSecondaryDisabled];
      btnDisabledTextStyle = [globalStyles.textDisabled];
      btnDisabledIconStyle = Colors.brown300;
      break;

    case ButtonType.SecondaryLight:
      btnStyle = [buttonStyles.buttonSecondaryLight];
      btnTextStyle = [globalStyles.textDark];
      btnIconStyle = Colors.brown800;

      btnDisabledStyle = [buttonStyles.buttonSecondaryDisabled];
      btnDisabledTextStyle = [globalStyles.textDisabled];
      btnDisabledIconStyle = Colors.brown300;
      break;

    case ButtonType.Success:
      btnStyle = [buttonStyles.buttonSuccess];
      btnTextStyle = [buttonStyles.buttonSuccessText];
      btnIconStyle = Colors.canaryGreen700;

      btnDisabledStyle = [buttonStyles.buttonSuccessDisabled];
      btnDisabledTextStyle = [buttonStyles.buttonSuccessDisabledText];
      btnDisabledIconStyle = Colors.canaryGreen300;

      shadowStyle = buttonStyles.shadowSuccess;
      break;

    case ButtonType.Warning:
      btnStyle = [buttonStyles.buttonWarning];
      btnTextStyle = [buttonStyles.buttonWarningText];
      btnIconStyle = Colors.orange700;

      btnDisabledStyle = [buttonStyles.buttonWarningDisabled];
      btnDisabledTextStyle = [buttonStyles.buttonWarningDisabledText];
      btnDisabledIconStyle = Colors.orange300;

      shadowStyle = buttonStyles.shadowWarning;
      break;

    case ButtonType.Error:
      btnStyle = [buttonStyles.buttonError];
      btnTextStyle = [buttonStyles.buttonErrorText];
      btnIconStyle = Colors.red700;

      btnDisabledStyle = [buttonStyles.buttonErrorDisabled];
      btnDisabledTextStyle = [buttonStyles.buttonErrorDisabledText];
      btnDisabledIconStyle = Colors.red300;

      shadowStyle = buttonStyles.shadowError;
      break;

    case ButtonType.Function:
      btnStyle = [buttonStyles.buttonFunction];
      btnTextStyle = [buttonStyles.buttonFunctionText];
      btnIconStyle = Colors.turqoise700;

      btnDisabledStyle = [buttonStyles.buttonFunctionDisabled];
      btnDisabledTextStyle = [buttonStyles.buttonFunctionDisabledText];
      btnDisabledIconStyle = Colors.turqoise300;

      shadowStyle = buttonStyles.shadowFunction;
      break;
  }

  switch (size) {
    case ButtonSize.ExtraSmall:
      btnStyle = [
        ...btnStyle,
        buttonStyles.textButtonExtraSmall,
        Gap.gapMedium,
      ];
      btnTextStyle = [...btnTextStyle, globalStyles.buttonTextThree];

      btnDisabledStyle = [
        ...btnDisabledStyle,
        buttonStyles.textButtonExtraSmall,
        Gap.gapMedium,
      ];
      btnDisabledTextStyle = [
        ...btnDisabledTextStyle,
        globalStyles.buttonTextThree,
      ];

      shadowBorderRadiusStyle = buttonStyles.buttonShadowBorderRadius;
      shadowSize = ShadowSize.ExtraSmall;

      break;

    case ButtonSize.Small:
      btnStyle = [...btnStyle, buttonStyles.textButtonSmall, Gap.gapMedium];
      btnTextStyle = [...btnTextStyle, globalStyles.buttonTextTwo];

      btnDisabledStyle = [
        ...btnDisabledStyle,
        buttonStyles.textButtonSmall,
        Gap.gapMedium,
      ];
      btnDisabledTextStyle = [
        ...btnDisabledTextStyle,
        globalStyles.buttonTextTwo,
      ];

      shadowBorderRadiusStyle = buttonStyles.buttonShadowBorderRadius;
      shadowSize = ShadowSize.Small;

      break;

    case ButtonSize.Medium:
      btnStyle = [...btnStyle, buttonStyles.textButtonMedium, Gap.gapMedium];
      btnTextStyle = [...btnTextStyle, globalStyles.buttonTextOne];

      btnDisabledStyle = [
        ...btnDisabledStyle,
        buttonStyles.textButtonMedium,
        Gap.gapMedium,
      ];
      btnDisabledTextStyle = [
        ...btnDisabledTextStyle,
        globalStyles.buttonTextOne,
      ];

      shadowBorderRadiusStyle = buttonStyles.buttonShadowBorderRadius;
      shadowSize = ShadowSize.Medium;

      break;

    case ButtonSize.Large:
      btnStyle = [...btnStyle, buttonStyles.textButtonLarge, Gap.gapMedium];
      btnTextStyle = [...btnTextStyle, globalStyles.buttonTextOne];

      btnDisabledStyle = [
        ...btnDisabledStyle,
        buttonStyles.textButtonLarge,
        Gap.gapMedium,
      ];
      btnDisabledTextStyle = [
        ...btnDisabledTextStyle,
        globalStyles.buttonTextOne,
      ];

      shadowBorderRadiusStyle = buttonStyles.buttonShadowBorderRadius;
      shadowSize = ShadowSize.Large;

      break;
  }

  switch (display) {
    case ButtonDisplay.Contained:
      btnStyle = [...btnStyle, buttonStyles.buttonContained];
      btnDisabledStyle = [...btnDisabledStyle, buttonStyles.buttonContained];
      break;

    case ButtonDisplay.Flex:
      btnStyle = [...btnStyle, buttonStyles.buttonContained];
      btnDisabledStyle = [...btnDisabledStyle, buttonStyles.buttonContained];
      break;
    case ButtonDisplay.Full:
      btnStyle = [...btnStyle, buttonStyles.buttonFull];
      btnDisabledStyle = [...btnDisabledStyle, buttonStyles.buttonFull];
      break;
  }

  return (
    <WickedCreamyPressable
      onPress={onPress}
      disabled={disabled}
      shadowStyle={[shadowStyle, shadowBorderRadiusStyle]}
      size={shadowSize}>
      <View style={[styles.btnBase, disabled ? btnDisabledStyle : btnStyle]}>
        {Icon && !hideIcon && (
          <SparrowIcon
            Icon={Icon}
            fill={disabled ? btnDisabledIconStyle : btnIconStyle}
            style={{ marginLeft: -Spacings.sm }}
          />
        )}
        <Text style={disabled ? btnDisabledTextStyle : btnTextStyle}>
          {text}
        </Text>
      </View>
    </WickedCreamyPressable>
  );
};
//#endregion

// ! ||--------------------------------------------------------------------------------||
// ! ||                                 Exported Enums                                 ||
// ! ||--------------------------------------------------------------------------------||
//#region Exported Enums

export enum ButtonType {
  PrimaryLight,
  SecondaryDark,
  SecondaryLight,
  Success,
  Warning,
  Error,
  Function,
}

export enum ButtonSize {
  Large,
  Medium,
  Small,
  ExtraSmall,
}

export enum ButtonDisplay {
  Contained,
  Full,
  Flex,
}
//#endregion

const styles = StyleSheet.create({
  btnBase: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.sm,
    zIndex: 1,
  },
});

export default Button;
