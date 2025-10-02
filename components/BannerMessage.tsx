import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { FC } from 'react';
import {
  ColorValue,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import {
  default as AlertIcon,
  default as ErrorIcon,
} from '../assets/icons/error-fill.svg';
import InfoIcon from '../assets/icons/info-fill.svg';
import SuccessIcon from '../assets/icons/success-fill.svg';
import SparrowIcon from './SparrowIcon';

type BannerMessageProps = {
  bannerContainerStyle?: ViewStyle[];
  bannerStyle?: ViewStyle[];
  bannerShadowStyle?: ViewStyle[];
  bannerTextStyle?: TextStyle[];
  buttonStyle?: ViewStyle[];
  buttonTextStyle?: TextStyle[];
  iconColor?: ColorValue;
  Icon?: FC<SvgProps> | string | any;
  showIcon?: boolean;
  type: BannerMessageType | null;
  size: BannerMessageSize | null;
  display: BannerMessageDisplay;
  title?: string;
  description: string;
  buttonText?: string;
  showButton?: boolean;

  onMessagePress?: () => void;
  onButtonPress?: () => void;
};

const BannerMessage = ({
  bannerContainerStyle = [],
  bannerStyle = [],
  bannerShadowStyle = [],
  bannerTextStyle = [],
  buttonStyle = [],
  buttonTextStyle = [],
  iconColor,
  Icon,
  showIcon = true,
  type = null,
  size = null,
  display,
  title = 'NULL',
  description = 'NULL',
  showButton = false,
  buttonText,

  onMessagePress = () => {},
  onButtonPress = () => {},
}: BannerMessageProps) => {
  switch (type) {
    case BannerMessageType.Error:
      bannerContainerStyle = [styles.error];
      bannerShadowStyle = [styles.errorShadow];
      bannerTextStyle = [styles.errorText, ...bannerTextStyle];
      buttonStyle = [
        buttonText ? styles.errorTextButton : styles.errorIconButton,
      ];
      buttonTextStyle = [styles.errorText];
      iconColor = Colors.red50;
      Icon = ErrorIcon;
      break;

    case BannerMessageType.Alert:
      bannerContainerStyle = [styles.alert];
      bannerShadowStyle = [styles.alertShadow];
      bannerTextStyle = [styles.alertText, ...bannerTextStyle];
      buttonStyle = [
        buttonText ? styles.alertTextButton : styles.alertIconButton,
      ];
      buttonTextStyle = [styles.alertText];
      iconColor = Colors.orange50;
      Icon = AlertIcon;
      break;

    case BannerMessageType.Informational:
      bannerContainerStyle = [styles.informational];
      bannerShadowStyle = [styles.informationalShadow];
      bannerTextStyle = [styles.informationalText, ...bannerTextStyle];
      buttonStyle = [
        buttonText
          ? styles.informationalTextButton
          : styles.informationalIconButton,
      ];
      buttonTextStyle = [styles.informationalText];
      iconColor = Colors.picton50;
      Icon = InfoIcon;
      break;

    case BannerMessageType.Success:
      bannerContainerStyle = [styles.success];
      bannerShadowStyle = [styles.successShadow];
      bannerTextStyle = [styles.successText, ...bannerTextStyle];
      buttonStyle = [
        buttonText ? styles.successTextButton : styles.successIconButton,
      ];
      buttonTextStyle = [styles.successText];
      iconColor = Colors.canaryGreen50;
      Icon = SuccessIcon;
      break;
  }

  switch (size) {
    case BannerMessageSize.Small:
      bannerContainerStyle = [...bannerContainerStyle, styles.smallContainer];
      bannerStyle = [...bannerStyle, styles.smallBanner];
      break;

    case BannerMessageSize.Medium:
      bannerContainerStyle = [...bannerContainerStyle, styles.mediumContainer];
      bannerStyle = [...bannerStyle, styles.mediumBanner];
      break;
  }

  switch (display) {
    case BannerMessageDisplay.Alert:
      bannerContainerStyle = [
        ...bannerContainerStyle,
        styles.alertBannerContainer,
      ];
      bannerShadowStyle = [...bannerShadowStyle, styles.alertBannerShadow];
      break;

    case BannerMessageDisplay.Toast:
      bannerContainerStyle = [
        ...bannerContainerStyle,
        styles.toastBannerContainer,
      ];
      bannerShadowStyle = [...bannerShadowStyle, styles.toastBannerShadow];
      if (size === BannerMessageSize.Small) {
        bannerShadowStyle = [
          ...bannerShadowStyle,
          styles.smallToastBannerShadow,
        ];
      } else {
        bannerShadowStyle = [
          ...bannerShadowStyle,
          styles.mediumToastBannerShadow,
        ];
      }
      break;
  }

  return (
    <Pressable onPress={onMessagePress}>
      <View style={[bannerShadowStyle]}>
        <View style={[styles.bannerContainer, bannerContainerStyle]}>
          <View style={[styles.bannerMessage, bannerStyle]}>
            {size === BannerMessageSize.Small ? (
              <>
                {showIcon && Icon && (
                  <SparrowIcon
                    Icon={Icon}
                    fill={iconColor}
                    style={{ alignSelf: 'flex-start' }}
                  />
                )}
              </>
            ) : (
              <View style={styles.title}>
                {showIcon && Icon && (
                  <SparrowIcon Icon={Icon} fill={iconColor} />
                )}
                <Text
                  style={[GlobalStyles.labelTextOneUppercase, bannerTextStyle]}>
                  {title}
                </Text>
              </View>
            )}
            <Text
              style={[
                GlobalStyles.bodyTextTwo,
                styles.description,
                bannerTextStyle,
              ]}>
              {description}
            </Text>
          </View>
          {showButton &&
            (buttonText ? (
              <Pressable
                style={[styles.textButton, buttonStyle]}
                onPress={onButtonPress}>
                <Text style={[GlobalStyles.buttonTextThree, buttonTextStyle]}>
                  {buttonText}
                </Text>
              </Pressable>
            ) : (
              <SparrowIcon
                Icon={ActionIcon}
                style={[styles.iconButton, buttonStyle]}
                onPress={onButtonPress}
                fill={iconColor}
              />
            ))}
        </View>
      </View>
    </Pressable>
  );
};

// ! ||--------------------------------------------------------------------------------||
// ! ||                                 Exported Enums                                 ||
// ! ||--------------------------------------------------------------------------------||
//#region Exported Enums
export enum BannerMessageDisplay {
  Alert,
  Toast,
}

export enum BannerMessageType {
  Error,
  Alert,
  Informational,
  Success,
}

export enum BannerMessageSize {
  Medium,
  Small,
}
//#endregion

const styles = StyleSheet.create({
  bannerContainer: {
    borderWidth: 2,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  alertBannerContainer: {},

  toastBannerContainer: {
    borderRadius: borderRadius.md,
  },

  alertBannerShadow: {
    padding: Spacings.xxs,
  },

  toastBannerShadow: {
    padding: Spacings.xxs,
    borderRadius: borderRadius.mdsm - 2, // -2 necessary for border offset
  },

  smallToastBannerShadow: {
    paddingBottom: 4,
  },

  mediumToastBannerShadow: {
    paddingBottom: 6,
  },

  bannerMessage: {
    padding: Spacings.md,
    rowGap: Spacings.xs,
    flexDirection: 'column',
    flex: 1,
  },

  title: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.md,
  },

  description: {
    flex: 1,
  },

  textButton: {
    marginRight: Spacings.sm,
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.sm,
    borderWidth: 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  iconButton: {
    marginVertical: Spacings.sm,
    paddingHorizontal: Spacings.mdsm,
    borderLeftWidth: 2,
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Type
  error: {
    borderColor: Colors.red400,
    backgroundColor: Colors.red600,
  },

  errorShadow: {
    backgroundColor: Colors.red700,
  },

  errorText: {
    color: Colors.red50,
  },

  errorTextButton: {
    borderColor: Colors.red50,
  },

  errorIconButton: {
    borderColor: Colors.red400,
  },

  alert: {
    borderColor: Colors.orange400,
    backgroundColor: Colors.orange600,
  },

  alertShadow: {
    backgroundColor: Colors.orange700,
  },

  alertText: {
    color: Colors.orange50,
  },

  alertTextButton: {
    borderColor: Colors.orange50,
  },

  alertIconButton: {
    borderColor: Colors.orange400,
  },

  informational: {
    borderColor: Colors.picton400,
    backgroundColor: Colors.picton600,
  },

  informationalShadow: {
    backgroundColor: Colors.picton700,
  },

  informationalText: {
    color: Colors.picton50,
  },

  informationalTextButton: {
    borderColor: Colors.picton50,
  },

  informationalIconButton: {
    borderColor: Colors.picton400,
  },

  success: {
    borderColor: Colors.canaryGreen400,
    backgroundColor: Colors.canaryGreen600,
  },

  successShadow: {
    backgroundColor: Colors.canaryGreen700,
  },

  successText: {
    color: Colors.canaryGreen50,
  },

  successTextButton: {
    borderColor: Colors.canaryGreen50,
  },

  successIconButton: {
    borderColor: Colors.canaryGreen400,
  },

  // Size
  smallContainer: {},

  mediumContainer: {},

  smallBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.md,
    paddingLeft: Spacings.sm,
  },

  mediumBanner: {},
});

export default BannerMessage;
