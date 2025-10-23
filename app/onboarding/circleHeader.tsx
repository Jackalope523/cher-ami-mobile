import PlusIcon from '@/assets/icons/plus-grey.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useCreateCircleMutation, useUpdateUserMutation } from '@/lib/hooks';
import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function CircleHeader() {
  const { firstName, lastName, birthday, avatar, circleName } =
    useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const userMutation = useUpdateUserMutation(
    () => {
      router.replace('/onboarding/circleCode');
    },
    () => {},
  );
  const circleMutation = useCreateCircleMutation(
    async (circle) => {
      userMutation.mutate({
        firstName: firstName as string,
        lastName: lastName as string,
        dateOfBirth: new Date(birthday as string),
        avatarPath: avatar as string,
        inviteCode: circle.inviteCode,
      });
    },
    () => {},
  );

  async function pickImageAsync() {
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [Dimensions.get('window').width - 40, 186],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  function handleCreateCircleAndUpdateUser() {
    circleMutation.mutate({
      title: circleName as string,
      imageUri: selectedImage as string,
    });
  }

  function buttonDisabled() {
    return !selectedImage || circleMutation.isPending || userMutation.isPending;
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
          Add a header image for your circle.
        </Text>
        <Pressable style={styles.imageContainer} onPress={pickImageAsync}>
          {selectedImage ? (
            <Image source={selectedImage} style={styles.image} />
          ) : (
            <View
              style={{
                backgroundColor: '#F4F1EA',
                borderRadius: 32,
                width: Dimensions.get('window').width - 40,
                height: 186,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PlusIcon height={96} width={96} />
            </View>
          )}
        </Pressable>
      </View>
      <Pressable
        onPress={handleCreateCircleAndUpdateUser}
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
          Create Circle
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

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: Dimensions.get('window').width - 40,
    height: 186,
    borderRadius: 32,
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
