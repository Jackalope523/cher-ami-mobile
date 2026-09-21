import AnimatedLoadingIcon from '@/components/AnimatedLoadingIcon';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  label,
  onPress,
  loading = false,
  loadingLabel,
  disabled = false,
  variant = 'primary',
  icon,
  style,
}: ButtonProps) {
  const secondary = variant === 'secondary';
  const inactive = disabled || loading;

  // Loading keeps the button's own colours: greying it out reads as "you can't
  // do this", when what's true is "we're doing it".
  const showInactive = disabled && !loading;

  return (
    <PopPressable
      onPress={onPress}
      disabled={inactive}
      style={[
        styles.button,
        secondary && styles.secondary,
        showInactive && styles.inactive,
        style,
      ]}>
      <View style={styles.content}>
        {loading && (
          <AnimatedLoadingIcon
            height={20}
            width={20}
            color={secondary ? '#B05637' : '#FFFFFF'}
          />
        )}
        <Text
          style={[
            secondary ? textStyles.buttonTextOrange : textStyles.buttonTextWhite,
            showInactive && styles.inactiveText,
          ]}>
          {loading ? (loadingLabel ?? label) : label}
        </Text>
        {!loading && icon}
      </View>
    </PopPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
  },

  secondary: {
    backgroundColor: 'transparent',
    borderColor: '#C15F3C',
  },

  inactive: {
    backgroundColor: '#ECEDEF',
    borderColor: '#ECEDEF',
  },

  inactiveText: {
    color: '#A8ABB3',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.sm,
  },
});
