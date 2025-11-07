import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function Birthday() {
  const { firstName, lastName } = useLocalSearchParams();
  const showToastMessage = useToastMessage();
  const [dateText, setDateText] = useState('');
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

  function parseDate() {
    const [month, day, year] = dateText.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  function handleContinue() {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

    if (!regex.test(dateText)) {
      showToastMessage(
        'Date is not properly formatted.',
        ToastMessageType.Error,
      );
    } else {
      router.push({
        pathname: '/onboarding/avatar',
        params: {
          firstName,
          lastName,
          birthday: parseDate().toISOString(),
        },
      });
    }
  }

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
          When were you born?
        </Text>
        <TextInput
          placeholder="MM/DD/YYYY"
          maxLength={10}
          value={dateText}
          onChangeText={setDateText}
          containerStyle={{ marginBottom: Spacings.md }}
        />
      </View>
      <PopPressable
        onPress={handleContinue}
        disabled={dateText === ''}
        style={[
          styles.button,
          dateText === '' && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            dateText === '' && { color: '#A8ABB3' },
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
