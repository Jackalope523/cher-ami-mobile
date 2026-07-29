import UserIcon from '@/assets/icons/user.svg';
import { useImagePicker } from '@/components/ImagePickerProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetCircleQuery, useUpdateUserMutation } from '@/lib/hooks';
import { circleStepHref } from '@/lib/onboarding';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function About() {
  const circleQuery = useGetCircleQuery();
  const showToastMessage = useToastMessage();
  const pickImageAsync = useImagePicker();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const userMutation = useUpdateUserMutation(
    () => {
      router.push(circleStepHref(circleQuery.data));
    },
    (error) => {
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
      console.log(error.message);
    },
  );

  function pickAvatar() {
    pickImageAsync({
      height: 96,
      width: 96,
      cropping: true,
    }).then((x) => {
      if (x !== null) {
        setAvatar(x.uri);
      }
    });
  }

  function handleContinue() {
    Keyboard.dismiss();
    userMutation.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      avatarUrl: avatar,
    });
  }

  function buttonDisabled() {
    return !firstName.trim() || !lastName.trim() || userMutation.isPending;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
        <Text style={[textStyles.heading1, { marginBottom: Spacings.md }]}>
          About you
        </Text>
        <Text style={[textStyles.body, { marginBottom: Spacings.xl }]}>
          This is how your family will see you when you add photos.
        </Text>

        <PopPressable onPress={pickAvatar} style={styles.avatarContainer}>
          {avatar ? (
            <Image source={avatar} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <UserIcon height={32} width={32} color={'#868581'} />
            </View>
          )}
        </PopPressable>
        <PopPressable onPress={pickAvatar}>
          <Text style={[textStyles.buttonTextOrange, styles.changeAvatar]}>
            {avatar ? 'Change photo' : 'Add a photo (optional)'}
          </Text>
        </PopPressable>

        <Text style={styles.label}>First name</Text>
        <TextInput
          placeholder="Your first name"
          maxLength={100}
          value={firstName}
          onChangeText={setFirstName}
          containerStyle={{ marginBottom: Spacings.md }}
          autoCapitalize="words"
          textContentType="givenName"
          autoComplete="name-given"
        />

        <Text style={styles.label}>Last name</Text>
        <TextInput
          placeholder="Your last name"
          maxLength={100}
          value={lastName}
          onChangeText={setLastName}
          containerStyle={{ marginBottom: Spacings.md }}
          autoCapitalize="words"
          textContentType="familyName"
          autoComplete="name-family"
        />

      </ScrollView>

      <PopPressable
        onPress={handleContinue}
        disabled={buttonDisabled()}
        style={[
          styles.button,
          buttonDisabled() && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            buttonDisabled() && { color: '#A8ABB3' },
          ]}>
          Continue
        </Text>
      </PopPressable>
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

  avatarContainer: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: Spacings.sm,
  },

  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
  },

  avatarPlaceholder: {
    backgroundColor: '#F4F1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  changeAvatar: {
    textAlign: 'center',
    marginBottom: Spacings.xl,
  },

  label: {
    ...textStyles.labelLargeBlack,
    marginBottom: Spacings.xs,
  },

  birthdayRow: {
    flexDirection: 'row',
    columnGap: Spacings.sm,
    marginBottom: Spacings.md,
  },

  error: {
    color: '#F47A70',
    marginBottom: Spacings.md,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    marginVertical: Spacings.lgmd,
  },
});
