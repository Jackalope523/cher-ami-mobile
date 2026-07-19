import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { getStringAsync } from 'expo-clipboard';
import { Dispatch, RefObject, SetStateAction, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
    // Keep only digits so pasted text like "Your code is 123456" still works.
    setCode(text.replace(/\D/g, '').slice(0, codeLength));
  };

  const handlePasteFromClipboard = async () => {
    const text = await getStringAsync();
    const digits = text.replace(/\D/g, '').slice(0, codeLength);

    if (digits.length > 0) {
      setCode(digits);
    }
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
      <Pressable
        onPress={handlePasteFromClipboard}
        style={styles.pasteButton}
        hitSlop={Spacings.sm}>
        <Text style={[textStyles.buttonTextOrange, { textAlign: 'center' }]}>
          Paste code
        </Text>
      </Pressable>
      <TextInput
        ref={textInputRef}
        style={styles.hiddenTextInput}
        value={code}
        maxLength={codeLength}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
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

  pasteButton: {
    alignSelf: 'center',
    paddingVertical: Spacings.mdsm,
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
