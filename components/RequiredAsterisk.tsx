import { GlobalStyles } from '@/constants/GlobalStyles';
import { StyleSheet, Text, TextStyle } from 'react-native';

type RequiredAsteriskProps = {
  required: boolean;
  disabled: boolean;
  style?: TextStyle;
};

export default function RequiredAsterisk({
  required,
  disabled,
  style,
}: RequiredAsteriskProps) {
  return (
    <>
      {required ? (
        <Text
          style={[
            GlobalStyles.labelTextTwoAsTyped,
            GlobalStyles.textError,
            styles.labelRequired,
            disabled && GlobalStyles.textDisabled,
            style,
          ]}>
          {' '}
          *
        </Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  labelRequired: {
    left: -2,
  },
});
