import { Spacings } from '@/constants/Spacings';
import { Dispatch, RefObject, SetStateAction, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import OTPSquare from './OTPSquare';

interface OTPInputProps {
  codeLength: number;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}

export default function OTPInput({ codeLength, code, setCode }: OTPInputProps) {
  const textInputRef: RefObject<TextInput | null> = useRef(null);
  const [focused, setFocused] = useState(false);

  const handleChangeText = (text: string) => {
    // Keep only digits so pasted text like "Your code is 123456" still works.
    setCode(text.replace(/\D/g, '').slice(0, codeLength));
  };

  // The square being filled next — or the last one once the code is complete.
  const activeIndex = Math.min(code.length, codeLength - 1);

  return (
    <View style={styles.container}>
      <View style={styles.squares} pointerEvents="none">
        {Array.from({ length: codeLength }).map((_, index) => (
          <OTPSquare
            key={index}
            value={index < code.length ? code.charAt(index) : ' '}
            focused={focused && index === activeIndex}
          />
        ))}
      </View>

      {/*
        A real text field laid over the squares rather than hidden off-screen:
        that way a long press raises the system menu in the right place, so the
        code can be pasted the way any other field would be. Its own text is
        transparent — the squares underneath do the drawing.
      */}
      <TextInput
        ref={textInputRef}
        style={styles.overlayInput}
        value={code}
        maxLength={codeLength}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        caretHidden
        selectionColor="transparent"
        onChangeText={handleChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },

  squares: {
    flexDirection: 'row',
    columnGap: Spacings.sm,
  },

  overlayInput: {
    ...StyleSheet.absoluteFillObject,
    // Invisible, but not `opacity: 0` — the field has to stay a real, hit-
    // testable input for the paste menu to appear over it.
    color: 'transparent',
    textAlign: 'center',
    fontSize: 24,
  },
});
