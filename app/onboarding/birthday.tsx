import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function Birthday() {
  const { firstName, lastName } = useLocalSearchParams();
  const today = new Date();
  const [dateText, setDateText] = useState('');

  function isToday(date: Date) {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function parseDate() {
    const [month, day, year] = dateText.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  return (
    <View style={styles.container}>
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
        />
      </View>
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/onboarding/avatar',
            params: {
              firstName,
              lastName,
              birthday: parseDate().toISOString(),
            },
          });
        }}
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
      </Pressable>
    </View>
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
