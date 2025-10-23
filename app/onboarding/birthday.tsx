import ChevronIcon from '@/assets/icons/chevron.svg';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function Birthday() {
  const { firstName, lastName } = useLocalSearchParams();
  const today = new Date();
  const [birthday, setBirthday] = useState(today);
  const [show, setShow] = useState(false);

  const onChange = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate;
    setShow(false);
    setBirthday(currentDate ?? today);
  };

  function isToday(date: Date) {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function renderDate() {
    if (isToday(birthday)) {
      return 'Select';
    }

    const month = String(birthday.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(birthday.getDate()).padStart(2, '0');
    const year = birthday.getFullYear();

    return `${month}/${day}/${year}`;
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
        <Pressable
          onPress={() => setShow(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: Spacings.mdsm,
            paddingHorizontal: Spacings.md,
            borderRadius: borderRadius.mdsm,
            borderWidth: 2,
            borderColor: '#DEDBD5',
          }}>
          <Text style={[textStyles.body]}>{renderDate()}</Text>
          <ChevronIcon height={24} width={24} />
        </Pressable>
        {show && (
          <DateTimePicker
            value={birthday}
            mode="date"
            display="calendar"
            onChange={onChange}
            maximumDate={new Date()} // optional
          />
        )}
      </View>
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/onboarding/avatar',
            params: { firstName, lastName, birthday: birthday.toISOString() },
          });
        }}
        disabled={isToday(birthday)}
        style={[
          styles.button,
          isToday(birthday) && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            isToday(birthday) && { color: '#A8ABB3' },
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
