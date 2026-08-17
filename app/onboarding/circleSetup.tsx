import PlusIcon from '@/assets/icons/plus.svg';
import { useImagePicker } from '@/components/ImagePickerProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useCreateCircleMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function CircleSetup() {
  const { onboarding } = useLocalSearchParams();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const pickImageAsync = useImagePicker();

  const [circleName, setCircleName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isOnboarding = onboarding === '1';
  const circleMutation = useCreateCircleMutation(
    async () => {
      showToastMessage('Family circle created!', ToastMessageType.Success);
      await queryClient.invalidateQueries({ queryKey: ['Circle'] });

      if (isOnboarding) {
        router.push('/onboarding/setup');
      } else {
        router.replace('/feed');
      }
    },
    async (error) => {
      if (error.response?.status === 409) {
        showToastMessage(
          "You're already in a family circle.",
          ToastMessageType.Informational,
        );
        await queryClient.invalidateQueries({ queryKey: ['Circle'] });
        router.replace(isOnboarding ? '/onboarding/setup' : '/feed');
        return;
      }

      console.log(error);
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
    },
  );

  function pickImage() {
    pickImageAsync({
      width: 1200,
      height: 600,
      cropping: true,
    }).then((x) => {
      if (x !== null) {
        setSelectedImage(x.uri);
      }
    });
  }

  function handleCreateCircle() {
    Keyboard.dismiss();
    circleMutation.mutate({
      title: circleName.trim(),
      imageUri: selectedImage,
    });
  }

  function buttonDisabled() {
    return !circleName.trim() || circleMutation.isPending;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
        <Text style={[textStyles.heading1, { marginBottom: Spacings.md }]}>
          Name your family circle.
        </Text>
        <Text style={[textStyles.body, { marginBottom: Spacings.lg }]}>
          This is the name your family will see in the app — something like
          &ldquo;The Harper Family.&rdquo;
        </Text>
        <TextInput
          placeholder="Family circle name"
          maxLength={100}
          value={circleName}
          onChangeText={setCircleName}
          autoCapitalize="words"
          containerStyle={{ marginBottom: Spacings.xl }}
        />

        <Text style={[textStyles.heading4, { marginBottom: Spacings.sm }]}>
          Add a cover photo (optional)
        </Text>
        <Text style={[textStyles.body, { marginBottom: Spacings.md }]}>
          Pick a favorite family photo — it will sit at the top of your family
          circle. You can always add one later.
        </Text>
        <PopPressable style={styles.imageContainer} onPress={pickImage}>
          {selectedImage ? (
            <Image source={selectedImage} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <PlusIcon height={64} width={64} color={'#868581'} />
            </View>
          )}
        </PopPressable>
      </ScrollView>

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
    marginBottom: Spacings.lg,
  },

  imagePlaceholder: {
    backgroundColor: '#F4F1EA',
    borderRadius: 32,
    width: Dimensions.get('window').width - 2 * Spacings.lgmd,
    aspectRatio: 2 / 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: Dimensions.get('window').width - 2 * Spacings.lgmd,
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
    marginVertical: Spacings.lgmd,
  },
});
