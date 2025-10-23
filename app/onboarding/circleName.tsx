import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function CircleName() {
  const { firstName, lastName, birthday, avatar } = useLocalSearchParams();
  const [circleName, setCircleName] = useState('');

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
          Name your circle.
        </Text>
        <TextInput
          placeholder="Circle name"
          maxLength={100}
          value={circleName}
          onChangeText={setCircleName}
        />
      </View>
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/onboarding/circleHeader',
            params: { firstName, lastName, birthday, avatar, circleName },
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
