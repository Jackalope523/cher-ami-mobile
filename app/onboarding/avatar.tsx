import PlusIcon from '@/assets/icons/plus.svg';
import { useAuth } from '@/components/AuthProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useUpdateUserMutation } from '@/lib/hooks';
import { Image } from 'expo-image';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function Avatar() {
  const { updateOnboarded } = useAuth();
  const showToastMessage = useToastMessage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { firstName, lastName, birthday } = useLocalSearchParams();
  const userMutation = useUpdateUserMutation(
    () => {
      showToastMessage(
        'Successfully created account!',
        ToastMessageType.Success,
      );
      updateOnboarded(true);
      router.replace('/feed');
    },
    (error) => {
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
      console.log(error.message);
    },
  );

  async function pickImageAsync() {
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const image = await ImageManipulator.manipulate(
        result.assets[0].uri,
      ).renderAsync();
      const jpgImage = await image.saveAsync({
        format: SaveFormat.JPEG,
      });

      setSelectedImage(jpgImage.uri);
    }
  }

  async function handleCreateUser() {
    userMutation.mutate({
      firstName: firstName as string,
      lastName: lastName as string,
      dateOfBirth: new Date(birthday as string),
      avatarPath: selectedImage as string,
    });
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
          Add an avatar.
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
                height: Dimensions.get('window').width - 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PlusIcon height={96} width={96} color={'#868581'} />
            </View>
          )}
        </Pressable>
      </View>
      <PopPressable
        onPress={handleCreateUser}
        disabled={!selectedImage || userMutation.isPending}
        style={[
          styles.button,
          (!selectedImage || userMutation.isPending) && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            (!selectedImage || userMutation.isPending) && { color: '#A8ABB3' },
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

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width - 40,
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
