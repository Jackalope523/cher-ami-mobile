import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from './Colors';
import { Spacings } from './Spacings';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const globalStyles = StyleSheet.create({
  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                     Layout                                     ||
  // ! ||--------------------------------------------------------------------------------||
  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                   Containers                                   ||
  // ! ||--------------------------------------------------------------------------------||

  // Used for navigation container, tab navigator
  mainContainer: {
    backgroundColor: Colors.canarySand,
  },

  // Used for screens
  baseContainer: {
    padding: 24,
  },

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                   Typography                                   ||
  // ! ||--------------------------------------------------------------------------------||

  // Base text
  baseText: {
    fontFamily: 'UncutSans-Regular',
  },

  // Display text
  displayTextOne: {
    fontSize: 72,
    fontFamily: 'UncutSans-Bold',
  },

  displayTextTwo: {
    fontSize: 44,
    fontFamily: 'UncutSans-Bold',
  },

  // Heading text
  headingTextOne: {
    fontSize: 36,
    fontFamily: 'UncutSans-Bold',
  },

  headingTextTwo: {
    fontSize: 28,
    fontFamily: 'UncutSans-Bold',
  },

  headingTextThree: {
    fontSize: 22,
    fontFamily: 'UncutSans-Bold',
  },

  headingTextFour: {
    fontSize: 18,
    fontFamily: 'UncutSans-Bold',
  },

  headingTextFive: {
    fontSize: 16,
    fontFamily: 'UncutSans-Bold',
  },

  // Body text
  bodyTextOne: {
    fontSize: 16,
    fontFamily: 'UncutSans-Regular',
  },

  bodyTextOneBold: {
    fontSize: 16,
    fontFamily: 'UncutSans-Bold',
  },

  bodyTextTwo: {
    fontSize: 14,
    fontFamily: 'UncutSans-Regular',
  },

  bodyTextTwoBold: {
    fontSize: 14,
    fontFamily: 'UncutSans-Bold',
  },

  // Small text
  smallText: {
    fontSize: 16,
    fontFamily: 'UncutSans-Regular',
  },

  // Button text
  buttonTextOne: {
    fontSize: 18,
    fontFamily: 'UncutSans-Medium',
  },

  buttonTextTwo: {
    fontSize: 18,
    fontFamily: 'UncutSans-Bold',
  },

  buttonTextThree: {
    fontSize: 16,
    fontFamily: 'UncutSans-Bold',
  },

  buttonTextFour: {
    fontSize: 14,
    fontFamily: 'UncutSans-Bold',
    textTransform: 'uppercase',
  },

  // Label text
  // One
  labelTextOneAsTyped: {
    fontSize: 16,
    fontFamily: 'UncutSans-Bold',
  },

  labelTextOneUppercase: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontFamily: 'UncutSans-Bold',
  },

  labelTextOneTitlecase: {
    fontSize: 16,
    textTransform: 'capitalize',
    fontFamily: 'UncutSans-Bold',
  },

  labelTextOneItalic: {
    fontSize: 16,
    fontFamily: 'UncutSans-BoldItalic',
  },

  // Two
  labelTextTwoAsTyped: {
    fontSize: 14,
    fontFamily: 'UncutSans-Semibold',
  },

  labelTextTwoUppercase: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: 'UncutSans-Semibold',
  },

  labelTextTwoItalic: {
    fontSize: 14,
    fontFamily: 'UncutSans-SemiboldItalic',
  },

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                      Text                                      ||
  // ! ||--------------------------------------------------------------------------------||

  // Hyperlink
  hyperlink: {
    color: Colors.red500,
    textDecorationLine: 'underline',
  },

  // Alignment
  textAlignCenter: {
    textAlign: 'center',
  },

  textAlignRight: {
    textAlign: 'right',
  },

  textAlignLeft: {
    textAlign: 'left',
  },

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                 Color variants                                 ||
  // ! ||--------------------------------------------------------------------------------||

  // Dark
  textDark: {
    color: Colors.brown850,
  },

  // Light
  textLight: {
    color: Colors.canarySand,
  },

  // Primary
  textPrimary: {
    color: Colors.brown800,
  },

  // Secondary
  textSecondary: {
    color: Colors.canarySand,
  },

  // Success
  textSuccess: {
    color: Colors.canaryGreen500,
  },

  textSuccessDarker: {
    color: Colors.canaryGreen700,
  },

  // Warning
  textWarning: {
    color: Colors.orange500,
  },

  textWarningDarker: {
    color: Colors.orange700,
  },

  // Error
  textError: {
    color: Colors.red500,
  },

  textErrorDarker: {
    color: Colors.red700,
  },

  // Function
  textFunction: {
    color: Colors.turqoise500,
  },

  textFunctionDarker: {
    color: Colors.turqoise700,
  },

  // Disabled
  // TODO test usability, this was previously sand400
  textDisabled: {
    color: Colors.brown300,
  },

  // Placeholder
  textPlaceholder: {
    color: Colors.brown400,
  },

  // ! ||--------------------------------------------------------------------------------||

  // Highlights

  // Dark
  highlightDark: {
    color: Colors.brown850,
    fontFamily: 'UncutSans-Bold',
  },

  // Light
  highlightLight: {
    color: Colors.canarySand,
    fontFamily: 'UncutSans-Bold',
  },

  // Yellow
  highlightYellow: {
    color: Colors.yellow500,
  },

  // Orange
  highlightOrange: {
    color: Colors.orange500,
  },

  // Red
  highlightRed: {
    color: Colors.red500,
  },

  // Rose
  highlightRose: {
    color: Colors.rose500,
  },

  // Fuchsia
  highlightFuchsia: {
    color: Colors.fuchsia500,
  },

  // Lavender
  highlightLavender: {
    color: Colors.lavender500,
  },

  // Green
  highlightGreen: {
    color: Colors.canaryGreen500,
  },

  // Turqoise
  highlightTurqoise: {
    color: Colors.turqoise500,
  },

  // Picton
  highlightPicton: {
    color: Colors.picton500,
  },

  // Azure
  highlightAzure: {
    color: Colors.azure500,
  },

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                  Illustrations                                 ||
  // ! ||--------------------------------------------------------------------------------||

  // Large
  illustrationLarge: {
    alignSelf: 'center',
    resizeMode: 'center',
    height: 280,
    width: 280,
  },

  // Medium
  illustrationMedium: {
    alignSelf: 'center',
    resizeMode: 'center',
    height: 200,
    width: 200,
  },

  // Full
  illustrationFull: {
    maxWidth: windowWidth - Spacings.lg * 2,
    maxHeight: windowWidth,
    aspectRatio: 1,
  },
});
