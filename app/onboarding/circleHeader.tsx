import PlusIcon from '@/assets/icons/plus.svg';
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
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function CircleHeader() {
  const { circleName } = useLocalSearchParams();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const circleMutation = useCreateCircleMutation(
    () => {
      showToastMessage('Circle created.', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
      router.replace('/feed');
    },
    (error) => {
      console.log(error);
      showToastMessage('Failed to create circle.', ToastMessageType.Error);
    },
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
              <PlusIcon height={96} width={96} color={'#868581'} />
            </View>
          )}
        </Pressable>
      </View>
      <PopPressable
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
