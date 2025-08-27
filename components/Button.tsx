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
  Icon?: React.FC<SvgProps>;

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

  // Active styles
  let btnActiveStyle: ViewStyle[] = [];
  let btnActiveTextStyle: TextStyle[] = [];
  let btnActiveIconStyle: string;

  // Disabled styles
  let btnDisabledStyle: ViewStyle[] = [];
  let btnDisabledTextStyle: TextStyle[] = [];
  let btnDisabledIconStyle: string = '';

  // Shadow
  let shadowStyle: ViewStyle = {};
  let shadowBorderRadiusStyle: ViewStyle = {};
  let shadowSize: ShadowSize = ShadowSize.Large;

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                      Type                                      ||
  // ! ||--------------------------------------------------------------------------------||
  //#region Type

  switch (type) {
    // TODO 08.05 change to PrimaryLight from PrimaryDark
    case ButtonType.PrimaryLight:
      // Rest
      btnStyle = [buttonStyles.buttonPrimaryLight];
      btnTextStyle = [globalStyles.textLight];
      btnIconStyle = Colors.canarySand;

      // Active
      btnActiveStyle = [buttonStyles.buttonPrimaryLightSelected];
      btnActiveTextStyle = [globalStyles.textLight];
      btnActiveIconStyle = Colors.canarySand;

      // Disabled
      btnDisabledStyle = [buttonStyles.buttonPrimaryLightDisabled];
      btnDisabledTextStyle = [globalStyles.textLight];
      btnDisabledIconStyle = Colors.canarySand;

      shadowStyle = buttonStyles.shadowPrimaryLight;
      break;

    case ButtonType.SecondaryDark:
      // Rest
      btnStyle = [buttonStyles.buttonSecondaryDark];
      btnTextStyle = [globalStyles.textLight];
      btnIconStyle = Colors.canarySand;

      // Active
      btnActiveStyle = [buttonStyles.buttonSecondaryDarkSelected];
      btnActiveTextStyle = [globalStyles.textLight];
      btnActiveIconStyle = Colors.canarySand;

      // Disabled
      btnDisabledStyle = [buttonStyles.buttonSecondaryDisabled];
      btnDisabledTextStyle = [globalStyles.textDisabled];
      btnDisabledIconStyle = Colors.brown300;
      break;

    case ButtonType.SecondaryLight:
      // Rest
      btnStyle = [buttonStyles.buttonSecondaryLight];
      btnTextStyle = [globalStyles.textDark];
      btnIconStyle = Colors.brown800;

      // Active
      btnActiveStyle = [buttonStyles.buttonSecondaryLightSelected];
      btnActiveTextStyle = [globalStyles.textDark];
      btnActiveIconStyle = Colors.brown800;

      // Disabled
      btnDisabledStyle = [buttonStyles.buttonSecondaryDisabled];
      btnDisabledTextStyle = [globalStyles.textDisabled];
      btnDisabledIconStyle = Colors.brown300;
      break;

    case ButtonType.Success:
      // Rest
      btnStyle = [buttonStyles.buttonSuccess];
      btnTextStyle = [buttonStyles.buttonSuccessText];
      btnIconStyle = Colors.canaryGreen700;

      // Active
      btnActiveStyle = [buttonStyles.buttonSuccess];
      btnActiveTextStyle = [buttonStyles.buttonSuccessText];
      btnActiveIconStyle = Colors.canaryGreen700;

      // Disabled
      btnDisabledStyle = [buttonStyles.buttonSuccessDisabled];
      btnDisabledTextStyle = [buttonStyles.buttonSuccessDisabledText];
      btnDisabledIconStyle = Colors.canaryGreen300;

      shadowStyle = buttonStyles.shadowSuccess;
      break;

    case ButtonType.Warning:
      // Rest
      btnStyle = [buttonStyles.buttonWarning];
      btnTextStyle = [buttonStyles.buttonWarningText];
      btnIconStyle = Colors.orange700;

      // Active
      btnActiveStyle = [buttonStyles.buttonWarning];
      btnActiveTextStyle = [buttonStyles.buttonWarningText];
      btnActiveIconStyle = Colors.orange700;

      // Disabled
      btnDisabledStyle = [buttonStyles.buttonWarningDisabled];
      btnDisabledTextStyle = [buttonStyles.buttonWarningDisabledText];
      btnDisabledIconStyle = Colors.orange300;

      shadowStyle = buttonStyles.shadowWarning;
      break;

    case ButtonType.Error:
      // Rest
      btnStyle = [buttonStyles.buttonError];
      btnTextStyle = [buttonStyles.buttonErrorText];
      btnIconStyle = Colors.red700;

      // Active
      btnActiveStyle = [buttonStyles.buttonError];
      btnActiveTextStyle = [buttonStyles.buttonErrorText];
      btnActiveIconStyle = Colors.red700;

      // Disabled
      btnDisabledStyle = [buttonStyles.buttonErrorDisabled];
      btnDisabledTextStyle = [buttonStyles.buttonErrorDisabledText];
      btnDisabledIconStyle = Colors.red300;

      shadowStyle = buttonStyles.shadowError;
      break;

    case ButtonType.Function:
      // Rest
      btnStyle = [buttonStyles.buttonFunction];
      btnTextStyle = [buttonStyles.buttonFunctionText];
      btnIconStyle = Colors.turqoise700;

      // Active
      btnActiveStyle = [buttonStyles.buttonFunction];
      btnActiveTextStyle = [buttonStyles.buttonFunctionText];
      btnActiveIconStyle = Colors.turqoise700;

      // Disabled
      btnDisabledStyle = [buttonStyles.buttonFunctionDisabled];
      btnDisabledTextStyle = [buttonStyles.buttonFunctionDisabledText];
      btnDisabledIconStyle = Colors.turqoise300;

      shadowStyle = buttonStyles.shadowFunction;
      break;
  }
  //#endregion

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                      Size                                      ||
  // ! ||--------------------------------------------------------------------------------||
  //#region Size

  switch (size) {
    case ButtonSize.ExtraSmall:
      // Rest
      btnStyle = [
        ...btnStyle,
        buttonStyles.textButtonExtraSmall,
        Gap.gapMedium,
      ];
      btnTextStyle = [...btnTextStyle, globalStyles.buttonTextThree];

      // Active
      btnActiveStyle = [
        ...btnActiveStyle,
        buttonStyles.textButtonExtraSmall,
        Gap.gapMedium,
      ];
      btnActiveTextStyle = [
        ...btnActiveTextStyle,
        globalStyles.buttonTextThree,
      ];

      // Disabled
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
      //Rest
      btnStyle = [...btnStyle, buttonStyles.textButtonSmall, Gap.gapMedium];
      btnTextStyle = [...btnTextStyle, globalStyles.buttonTextTwo];

      // Active
      btnActiveStyle = [
        ...btnActiveStyle,
        buttonStyles.textButtonSmall,
        Gap.gapMedium,
      ];
      btnActiveTextStyle = [...btnActiveTextStyle, globalStyles.buttonTextTwo];

      // Disabled
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
      // Rest
      btnStyle = [...btnStyle, buttonStyles.textButtonMedium, Gap.gapMedium];
      btnTextStyle = [...btnTextStyle, globalStyles.buttonTextOne];

      // Active
      btnActiveStyle = [
        ...btnActiveStyle,
        buttonStyles.textButtonMedium,
        Gap.gapMedium,
      ];
      btnActiveTextStyle = [...btnActiveTextStyle, globalStyles.buttonTextOne];

      // Disabled
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
      // Rest
      btnStyle = [...btnStyle, buttonStyles.textButtonLarge, Gap.gapMedium];
      btnTextStyle = [...btnTextStyle, globalStyles.buttonTextOne];

      // Active
      btnActiveStyle = [
        ...btnActiveStyle,
        buttonStyles.textButtonLarge,
        Gap.gapMedium,
      ];
      btnActiveTextStyle = [...btnActiveTextStyle, globalStyles.buttonTextOne];

      // Disabled
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
  //#endregion

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                     Display                                    ||
  // ! ||--------------------------------------------------------------------------------||
  //#region Display

  switch (display) {
    case ButtonDisplay.Contained:
      btnStyle = [...btnStyle, buttonStyles.buttonContained];
      btnActiveStyle = [...btnActiveStyle, buttonStyles.buttonContained];
      btnDisabledStyle = [...btnDisabledStyle, buttonStyles.buttonContained];
      break;

    case ButtonDisplay.Flex:
      btnStyle = [...btnStyle, buttonStyles.buttonContained];
      btnActiveStyle = [...btnActiveStyle, buttonStyles.buttonContained];
      btnDisabledStyle = [...btnDisabledStyle, buttonStyles.buttonContained];
      break;
    case ButtonDisplay.Full:
      btnStyle = [...btnStyle, buttonStyles.buttonFull];
      btnActiveStyle = [...btnActiveStyle, buttonStyles.buttonFull];
      btnDisabledStyle = [...btnDisabledStyle, buttonStyles.buttonFull];
      break;
  }
  //#endregion

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
