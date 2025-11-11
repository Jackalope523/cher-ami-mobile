import { Colors } from '@/constants/Colors';
import { Spacings } from '@/constants/Spacings';
import { Dispatch, RefObject, SetStateAction, useRef } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import OTPSquare from './OTPSquare';

interface OTPInputProps {
  codeLength: number;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}

const OTPInput: React.FC<OTPInputProps> = ({ codeLength, code, setCode }) => {
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
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    columnGap: Spacings.sm,
  },

  inputContainer: {
    borderRadius: 8,
    backgroundColor: Colors.canarySand,
    alignItems: 'center',
    justifyContent: 'center',
    height: (Dimensions.get('window').width * 0.8) / 6,
    width: (Dimensions.get('window').width * 0.8) / 6,
    borderColor: Colors.brown800,
  },

  hiddenTextInput: {
    height: 0,
    width: 0,
    opacity: 0,
  },

  text: {
    color: Colors.brown800,
  },
});

export default OTPInput;
