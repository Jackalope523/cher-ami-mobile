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
import { useHeaderHeight } from '@react-navigation/elements';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLayout } from '@/lib/layout';
import { ScrollView } from 'react-native-gesture-handler';

export default function CircleSetup() {
  const headerHeight = useHeaderHeight();
  const { contentWidth } = useLayout();
  const headerImageWidth = contentWidth - 2 * Spacings.lgmd;
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
        router.push({
          pathname: '/onboarding/setup',
          params: { joined: '0' },
        });
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
    // Stored square, shown as the middle 2:1 band. The magazine may want a
    // different crop later, and we can't ask every circle for a new photo.
    pickImageAsync({
      width: 2400,
      height: 2400,
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: Spacings.lg }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
        <Text style={[textStyles.heading2, { marginBottom: Spacings.md }]}>
          Set up your family circle
        </Text>
        <Text style={[textStyles.body, { marginBottom: Spacings.lg }]}>
          This is the name your family will see in the app and on the front cover
          of your magazine. Anything from
          &ldquo;The Harper Family&rdquo; to &ldquo;William&apos;s Bunch&rdquo;!
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
          Pick a favorite family photo to sit at the top of your family
          circle. It won&apos;t appear in the magazine and you can change it later.
        </Text>
        <PopPressable style={styles.imageContainer} onPress={pickImage}>
          {selectedImage ? (
            <Image
              source={selectedImage}
              style={[styles.image, { width: headerImageWidth }]}
            />
          ) : (
            <View
              style={[styles.imagePlaceholder, { width: headerImageWidth }]}>
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
    </KeyboardAvoidingView>
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
    aspectRatio: 2 / 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
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
