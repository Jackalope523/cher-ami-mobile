import PlusIcon from '@/assets/icons/plus.svg';
import { useImagePicker } from '@/components/ImagePickerProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useCreateCircleMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

export default function CircleHeader() {
  const { circleName } = useLocalSearchParams();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const pickImageAsync = useImagePicker();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const circleMutation = useCreateCircleMutation(
    () => {
      showToastMessage('Family circle created!', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
      router.replace('/feed');
    },
    (error) => {
      console.log(error);
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
    },
  );

  function pickImage() {
    pickImageAsync({
      width: 2 * 186,
      height: 186,
      cropping: true,
    }).then((x) => {
      setSelectedImage(x?.uri ?? null);
    });
  }

  function handleCreateCircle() {
    if (!selectedImage) {
      throw new Error('Selected image is null.');
    }

    circleMutation.mutate({
      title: circleName as string,
      imageUri: selectedImage,
    });
  }

  function buttonDisabled() {
    return !selectedImage || circleMutation.isPending;
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
          Add a cover photo.
        </Text>
        <Text
          style={[
            textStyles.body,
            {
              marginBottom: Spacings.lg,
            },
          ]}>
          Pick a favorite family photo — it will sit at the top of your family
          circle.
        </Text>
        <PopPressable style={styles.imageContainer} onPress={pickImage}>
          {selectedImage ? (
            <Image source={selectedImage} style={styles.image} />
          ) : (
            <View
              style={{
                backgroundColor: '#F4F1EA',
                borderRadius: 32,
                width: Dimensions.get('window').width - 40,
                aspectRatio: 2 / 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PlusIcon height={96} width={96} color={'#868581'} />
            </View>
          )}
        </PopPressable>
      </View>
      <PopPressable
        onPress={handleCreateCircle}
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
          Create Family Circle
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
    aspectRatio: 2 / 1,
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
