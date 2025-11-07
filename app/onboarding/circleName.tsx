import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function CircleName() {
  const [circleName, setCircleName] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Pressable
      style={[
        styles.container,
        keyboardVisible && {
          justifyContent: 'flex-start',
        },
      ]}
      onPress={Keyboard.dismiss}>
      <View>
        <Text
          style={[
            textStyles.heading1,
            {
              marginBottom: Spacings.md,
            },
          ]}>
          Name your circle.
        </Text>
        <TextInput
          placeholder="Circle name"
          maxLength={100}
          value={circleName}
          onChangeText={setCircleName}
          containerStyle={{ marginBottom: Spacings.md }}
        />
      </View>
      <PopPressable
        onPress={() => {
          router.push({
            pathname: '/onboarding/circleHeader',
            params: { circleName },
          });
        }}
        disabled={!circleName}
        style={[
          styles.button,
          !circleName && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            !circleName && { color: '#A8ABB3' },
          ]}>
          Continue
        </Text>
      </PopPressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: Spacings.lgmd,
    justifyContent: 'space-between',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    marginBottom: Spacings.lgmd,
  },
});
