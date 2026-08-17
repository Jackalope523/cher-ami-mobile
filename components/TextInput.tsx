import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { Ref } from 'react';
import {
  TextInput as ReactNativeTextInput,
  TextInputProps as ReactNativeTextInputProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

interface TextInputProps extends ReactNativeTextInputProps {
  title?: string;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<ReactNativeTextInput>;
}

export default function TextInput({
  title,
  required = false,
  containerStyle,
  ref,
  ...props
}: TextInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {title && <Text style={textStyles.labelLargeBlack}>{title}</Text>}

      <ReactNativeTextInput
        ref={ref}
        style={[textStyles.body, styles.textInput]}
        placeholderTextColor="#868581"
        underlineColorAndroid="transparent"
        {...props}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
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
