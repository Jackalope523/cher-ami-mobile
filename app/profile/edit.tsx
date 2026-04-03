import PlusIcon from '@/assets/icons/plus.svg';
import Placeholder from '@/assets/images/placeholder.png';
import { useAuth } from '@/components/AuthProvider';
import Error from '@/components/Error';
import { useImagePicker } from '@/components/ImagePickerProvider';
import Loading from '@/components/Loading';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetSelfQuery, useUpdateUserMutation } from '@/lib/hooks';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function EditProfile() {
  const { getToken } = useAuth();
  const selfQuery = useGetSelfQuery();
  const updateUserMutation = useUpdateUserMutation();
  const pickImageAsync = useImagePicker();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (selfQuery.data) {
      setAvatar(selfQuery.data.avatarUrl);
      setFirstName(selfQuery.data.firstName);
      setLastName(selfQuery.data.lastName);
    }
  }, [selfQuery.data]);

  function pickImage() {
    pickImageAsync({
      height: 96,
      width: 96,
      cropping: true,
    }).then((x) => {
      if (x !== null) {
        setAvatar(x);
      }
    });
  }

  function buttonDisabled() {
    if (selfQuery.data) {
      return (
        (avatar === selfQuery.data.avatarUrl &&
          firstName === selfQuery.data.firstName &&
          lastName === selfQuery.data.lastName) ||
        updateUserMutation.isPending
      );
    }

    return true;
  }

  function handleSaveChanges() {
    if (selfQuery.data) {
      updateUserMutation.mutate({
        firstName,
        lastName,
        avatarUrl: avatar !== selfQuery.data.avatarUrl ? avatar : null,
      });
      router.back();
    }
  }

  if (selfQuery.isError) {
    return <Error />;
  }

  if (selfQuery.isLoading) {
    return <Loading />;
  }

  if (!selfQuery.data) {
    return null;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}>
      <PopPressable onPress={pickImage}>
        {avatar === null ? (
          <View style={[styles.avatar, { backgroundColor: '#F4F1EA' }]}>
            <PlusIcon height={48} width={48} color={'#868581'} />
          </View>
        ) : (
          <Image
            style={styles.avatar}
            placeholder={Placeholder}
            placeholderContentFit="fill"
            source={{
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
              uri:
                avatar !== selfQuery.data.avatarUrl
                  ? avatar
                  : selfQuery.data.avatarUrl,
            }}
          />
        )}
      </PopPressable>
      <Text style={[textStyles.labelLargeBlack, styles.changeAvatar]}>
        Change Avatar
      </Text>
      <View style={styles.textInputs}>
        <TextInput
          title="First Name*"
          maxLength={100}
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          textContentType="givenName"
          autoComplete="name-given"
        />
        <TextInput
          title="Last Name*"
          maxLength={100}
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
          textContentType="familyName"
          autoComplete="name-family"
        />
      </View>
      <PopPressable
        onPress={handleSaveChanges}
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
          Save Changes
        </Text>
      </PopPressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#FCFBF8',
  },

  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacings.sm,
    marginTop: Spacings.xxl,
  },

  changeAvatar: {
    alignSelf: 'center',
    marginBottom: Spacings.xxxl,
  },

  sectionHeader: {
    marginBottom: Spacings.md,
  },

  textInputs: {
    rowGap: 20,
    marginBottom: Spacings.xl,
  },

  summaryItemList: {
    rowGap: Spacings.sm,
  },

  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  divider: {
    borderWidth: 1.5,
    borderColor: '#DEDBD5',
    marginVertical: Spacings.lg,
  },

  disclaimer: {
    marginTop: Spacings.mdsm,
    marginBottom: Spacings.xl,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    marginBottom: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    paddingVertical: Spacings.md,
    paddingHorizontal: Spacings.lg,
  },
});
