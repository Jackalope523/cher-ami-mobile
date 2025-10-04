import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  TextInput as ReactNativeTextInput,
  TextInputProps as ReactNativeTextInputProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface TextInputProps extends ReactNativeTextInputProps {
  title?: string;
  required?: boolean;
}

export default function TextInput({
  title,
  required = false,
  ...props
}: TextInputProps) {
  return (
    <View style={styles.container}>
      {title && <Text style={textStyles.labelLarge}>{title}</Text>}
      <View>
        <ReactNativeTextInput
          style={[textStyles.body, styles.textInput]}
          placeholderTextColor="#868581"
          maxLength={200}
          multiline
          {...props}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: Spacings.smxs,
  },

  textInput: {
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.mdsm,
    borderWidth: 2,
    borderColor: '#DEDBD5',
    borderRadius: 12,
  },
});
