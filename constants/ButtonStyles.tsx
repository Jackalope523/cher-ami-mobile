import { Colors } from '@/constants/Colors';
import { Spacings } from '@/constants/Spacings';
import { StyleSheet } from 'react-native';
import { borderRadius } from './Borders';

export const buttonStyles = StyleSheet.create({
  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                     Buttons                                    ||
  // ! ||--------------------------------------------------------------------------------||
  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                      Types                                     ||
  // ! ||--------------------------------------------------------------------------------||

  // Primary
  // TODO 08.05 change from dark to light
  buttonPrimaryLight: {
    backgroundColor: Colors.brown800,
    borderColor: Colors.canaryDark,
    borderWidth: 2,
  },

  buttonPrimaryLightSelected: {
    backgroundColor: Colors.brown700,
    borderColor: Colors.canaryDark,
    borderWidth: 2,
  },

  buttonPrimaryLightDisabled: {
    backgroundColor: Colors.brown200,
    borderColor: Colors.canaryDark,
    borderWidth: 2,
  },

  // Secondary
  buttonSecondaryDark: {
    backgroundColor: Colors.brown700,
    borderColor: Colors.brown800,
  },

  buttonSecondaryDarkSelected: {
    backgroundColor: Colors.brown800,
    borderColor: Colors.brown800,
  },

  buttonSecondaryLight: {
    backgroundColor: Colors.canarySand,
    borderColor: Colors.brown800,
  },

  buttonSecondaryLightSelected: {
    backgroundColor: Colors.canarySand,
    borderColor: Colors.canarySand,
  },

  /*
  
  Used for both Dark and Light Secondary buttons

  */

  buttonSecondaryDisabled: {
    backgroundColor: Colors.brown100,
    borderColor: Colors.brown300,
  },

  // Button Tertiary
  buttonTertiary: {
    backgroundColor: Colors.brown700,
    borderColor: Colors.brown700,
  },

  buttonTertiarySelected: {
    backgroundColor: Colors.brown800,
    borderColor: Colors.brown800,
  },

  buttonTertiaryDisabled: {
    backgroundColor: Colors.brown200,
    borderColor: Colors.brown300,
  },

  // Success
  buttonSuccess: {
    backgroundColor: Colors.canaryGreen400,
    borderColor: Colors.canaryGreen700,
  },

  buttonSuccessText: {
    color: Colors.canaryGreen700,
  },

  buttonSuccessDisabled: {
    backgroundColor: Colors.canaryGreen100,
    borderColor: Colors.canaryGreen300,
  },

  buttonSuccessDisabledText: {
    color: Colors.canaryGreen300,
  },

  // Warning
  buttonWarning: {
    backgroundColor: Colors.orange400,
    borderColor: Colors.orange700,
  },

  buttonWarningText: {
    color: Colors.orange700,
  },

  buttonWarningDisabled: {
    backgroundColor: Colors.orange100,
    borderColor: Colors.orange300,
  },

  buttonWarningDisabledText: {
    color: Colors.orange300,
  },

  // Error
  buttonError: {
    backgroundColor: Colors.red400,
    borderColor: Colors.red700,
  },

  buttonErrorText: {
    color: Colors.red700,
  },

  buttonErrorDisabled: {
    backgroundColor: Colors.red100,
    borderColor: Colors.red300,
  },

  buttonErrorDisabledText: {
    color: Colors.red300,
  },

  // Function
  buttonFunction: {
    backgroundColor: Colors.turqoise300,
    borderColor: Colors.turqoise700,
  },

  buttonFunctionText: {
    color: Colors.turqoise700,
  },

  buttonFunctionDisabled: {
    backgroundColor: Colors.turqoise100,
    borderColor: Colors.turqoise300,
  },

  buttonFunctionDisabledText: {
    color: Colors.turqoise300,
  },

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                     Display                                    ||
  // ! ||--------------------------------------------------------------------------------||

  // Makes the button width the size of the contents
  buttonContained: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Makes the button full-width
  buttonFull: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Icon buttons - buttons with icons
  // These styles currently work in conjuction
  iconButtonSmall: {
    flexDirection: 'row',
    // TODO going to use spacing.sm instead of md for now cause I think it looks better, update Figma later if this is the final setting
    columnGap: Spacings.sm,
  },

  // Sizes
  // Large
  // Pair with buttonTextOne
  textButtonLarge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacings.lg,
    paddingHorizontal: Spacings.xl,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },

  actionButtonLarge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 2,
    padding: Spacings.lg,
  },

  // Medium
  // Pair with buttonTextOne
  textButtonMedium: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacings.md,
    paddingHorizontal: Spacings.lg,
    borderWidth: 2,
    borderRadius: borderRadius.md,
  },

  actionButtonMedium: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.md,
    padding: Spacings.md,
  },

  // MediumSmall
  // Pair with buttonTextOne
  textButtonMediumSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacings.mdsm,
    paddingHorizontal: Spacings.lg,
    borderWidth: 2,
    borderRadius: borderRadius.md,
  },

  actionButtonMediumSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.md,
    height: 48,
    width: 48,
  },

  // Small
  // Pair with buttonTextTwo
  textButtonSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacings.sm,
    paddingHorizontal: Spacings.md,
    borderWidth: 2,
    borderRadius: borderRadius.md,
  },

  actionButtonSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: borderRadius.md,
    height: 40,
    width: 40,
  },

  // Extra small
  // Pair with buttonTextThree
  textButtonExtraSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacings.sm,
    paddingHorizontal: Spacings.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },

  // TODO move to ICON STYLES file?
  // Button icons
  // Small
  buttonIconSmallLight: {
    fontSize: 24,
    // Fix for icon being cut off
    height: 24,
    color: Colors.canarySand,
  },

  buttonIconSmallDark: {
    fontSize: 24,
    height: 24,
    color: Colors.brown800,
  },

  // Medium
  buttonIconMediumLight: {
    fontSize: 32,
    // Fix for icon being cut off
    height: 32,
    color: Colors.canarySand,
  },

  buttonIconMediumDark: {
    fontSize: 32,
    height: 32,
    color: Colors.brown800,
  },

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                    Shadows                                     ||
  // ! ||--------------------------------------------------------------------------------||
  shadowPrimaryLight: {
    backgroundColor: Colors.brown850,
    borderColor: Colors.brown850,
  },

  shadowSuccess: {
    backgroundColor: Colors.canaryGreen700,
    borderColor: Colors.canaryGreen700,
  },

  shadowWarning: {
    backgroundColor: Colors.orange700,
    borderColor: Colors.orange700,
  },

  shadowError: {
    backgroundColor: Colors.red700,
    borderColor: Colors.red700,
  },

  shadowFunction: {
    backgroundColor: Colors.turqoise700,
    borderColor: Colors.turqoise700,
  },

  // Border radius
  buttonShadowBorderRadius: {
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },

  mergeLeft: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 1,
  },
  mergeRight: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 1,
  },
});
