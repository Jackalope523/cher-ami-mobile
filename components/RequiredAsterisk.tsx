import { globalStyles } from '@/constants/GlobalStyles';
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
            globalStyles.labelTextTwoAsTyped,
            globalStyles.textError,
            styles.labelRequired,
            disabled && globalStyles.textDisabled,
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
