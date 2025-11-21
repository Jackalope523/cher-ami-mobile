import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function LastName() {
  const [lastName, setLastName] = useState('');
  const { firstName } = useLocalSearchParams();
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
          What’s your last name?
        </Text>
        <TextInput
          placeholder="Your last name"
          maxLength={100}
          value={lastName}
          onChangeText={setLastName}
          containerStyle={{ marginBottom: Spacings.md }}
        />
      </View>

      <PopPressable
        onPress={() => {
          router.push({
            pathname: '/onboarding/avatar',
            params: { firstName, lastName },
          });
        }}
        disabled={!lastName}
        style={[
          styles.button,
          !lastName && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            !lastName && { color: '#A8ABB3' },
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
