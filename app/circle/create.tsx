import PlaceholderImage from '@/assets/images/placeholder.jpg';
import { useAPI } from '@/components/APIProvider';
import { BannerMessageType } from '@/components/BannerMessage';
import Button, { ButtonType } from '@/components/Button';
import LizardTextInput, { InputType } from '@/components/LizardTextInput';
import { useToastMessage } from '@/components/modals/ToastMessageProvider';
import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { Spacings } from '@/constants/Spacings';
import { useMutation } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { v4 } from 'uuid';

enum IssueSchedule {
  Monthly,
}

interface CreateCircleRequest {
  title: string;
  schedule: IssueSchedule;
  imageUri: string;
  imageName: string;
}

export default function Create() {
  const api = useAPI();
  const showToastMessage = useToastMessage();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [validTitle, setValidTitle] = useState(false);

  const createCircleMutation = useMutation({
    mutationFn: async (request: CreateCircleRequest) => {
      const formData = new FormData();

      formData.append('Title', request.title);
      formData.append('Schedule', request.schedule.toString());
      formData.append('Image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: request.imageName,
      } as any);

      const response = await api.post('/circle', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: () => {
      showToastMessage('Circle created!', BannerMessageType.Success);
      router.replace('/upload');
    },
    onError: (err) => {
      console.error('Circle creation failed: ', err);
      showToastMessage('Circle creation failed.', BannerMessageType.Error);
    },
  });

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
