import PlaceholderImage from '@/assets/images/placeholder.jpg';
import Button, { ButtonType } from '@/components/Button';
import LizardTextInput, { InputType } from '@/components/LizardTextInput';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { Spacings } from '@/constants/Spacings';
import { IssueSchedule } from '@/lib/enums';
import { useCreateCircleMutation } from '@/lib/hooks';
import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { v4 } from 'uuid';

export default function CreateCircle() {
  const showToastMessage = useToastMessage();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [validTitle, setValidTitle] = useState(false);

  const createCircleMutation = useCreateCircleMutation(
    () => {
      showToastMessage('Circle created!', ToastMessageType.Success);
      router.replace('/circle/create');
    },
    (error) => {
      console.error('Circle creation failed: ', error);
      showToastMessage('Circle creation failed.', ToastMessageType.Error);
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
      setSelectedImage(result.assets[0].uri);
    }
  }

  function handleSubmit() {
    if (selectedImage) {
      createCircleMutation.mutate({
        title: title,
        schedule: IssueSchedule.Monthly,
        imageUri: selectedImage,
        imageName: `${v4()}.jpg`,
      });
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacings.lg,
        rowGap: Spacings.lg,
      }}>
      <Pressable style={styles.imageContainer} onPress={pickImageAsync}>
        <Image
          source={selectedImage ?? PlaceholderImage}
          style={styles.image}
        />
      </Pressable>
      <LizardTextInput
        type={InputType.CircleTitle}
        label="Circle Title"
        valid={validTitle}
        setValid={setValidTitle}
        text={title}
        setText={setTitle}
        autoComplete="name"
        inputMode="text"
        maxLength={100}
        required
      />
      <Button
        text={'Create Circle'}
        onPress={handleSubmit}
        type={ButtonType.Success}
        disabled={
          !validTitle ||
          selectedImage === null ||
          createCircleMutation.isPending
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width - Spacings.lg * 2,
    height: Dimensions.get('window').width - Spacings.lg * 2,
    borderRadius: borderRadius.lg,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.canaryDark,
    borderRadius: borderRadius.lg,
  },
});
