import { useAuth } from '@/components/AuthProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useUpdateUserMutation } from '@/lib/hooks';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function LastName() {
  const [lastName, setLastName] = useState('');
  const { firstName } = useLocalSearchParams();
  const { updateOnboarded } = useAuth();
  const showToastMessage = useToastMessage();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const userMutation = useUpdateUserMutation(
    () => {
      showToastMessage('Created account!', ToastMessageType.Success);
      updateOnboarded(true);
    },
    (error) => {
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
      console.log(error.message);
    },
  );

  async function handleUpdateUser() {
    userMutation.mutate({
      firstName: firstName as string,
      lastName: lastName as string,
      avatarPath: null,
    });
  }

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
          autoCapitalize="words"
          autoCorrect={true}
          textContentType="familyName"
          autoComplete="name-family"
        />
      </View>

      <PopPressable
        onPress={handleUpdateUser}
        disabled={!lastName || userMutation.isPending}
        style={[
          styles.button,
          (!lastName || userMutation.isPending) && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            (!lastName || userMutation.isPending) && { color: '#A8ABB3' },
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
