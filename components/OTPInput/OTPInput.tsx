import { Spacings } from '@/constants/Spacings';
import { Dispatch, RefObject, SetStateAction, useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import OTPSquare from './OTPSquare';

interface OTPInputProps {
  codeLength: number;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}

export default function OTPInput({ codeLength, code, setCode }: OTPInputProps) {
  const textInputRef: RefObject<TextInput | null> = useRef(null);

  const handlePress = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleChangeText = (text: string) => {
    setCode(text);
  };

  return (
    <View>
      <Pressable onPress={handlePress} style={styles.container}>
        {Array.from({ length: codeLength }).map((_, index) => (
          <OTPSquare
            key={index}
            value={index < code.length ? code.charAt(index) : ' '}
            focused={code.length !== codeLength && code.length - 1 === index}
          />
        ))}
      </Pressable>
      <TextInput
        ref={textInputRef}
        style={styles.hiddenTextInput}
        value={code}
        maxLength={codeLength}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        onChangeText={handleChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    columnGap: Spacings.sm,
  },

  hiddenTextInput: {
    position: 'absolute',
    height: 1,
    width: 1,
    opacity: 0,
    bottom: 0,
    left: 0,
  },
});
