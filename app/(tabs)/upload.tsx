import PlaceholderImage from '@/assets/images/placeholder.jpg';
import { useAPI } from '@/components/APIProvider';
import { BannerMessageType } from '@/components/BannerMessage';
import Button, { ButtonType } from '@/components/Button';
import { useToastMessage } from '@/components/modals/ToastMessageProvider';
import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 } from 'uuid';

interface AddPostRequest {
  issueId: number;
  time: string;
  caption: string;
  imageUri: string;
  imageName: string;
}

export default function Upload() {
  const api = useAPI();
  const showToastMessage = useToastMessage();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const circleQuery = useQuery({
    queryKey: ['userCircle'],
    queryFn: async () => (await api.get('/circle')).data,
  });

  const uploadMutation = useMutation({
    mutationFn: async (request: AddPostRequest) => {
      const formData = new FormData();

      formData.append('IssueId', request.issueId.toString());
      formData.append('Time', request.time);
      formData.append('Caption', request.caption);
      formData.append('Image', {
        uri: request.imageUri,
        type: 'image/jpeg',
        name: request.imageName,
      } as any);

      const response = await api.post(
        `/issues/${request.issueId}/posts`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data;
    },
    onSuccess: () => {
      showToastMessage('Upload success!', BannerMessageType.Success);
      setSelectedImage(null);
    },
    onError: (err) => {
      console.error('Upload failed:', err);
      showToastMessage('Upload failed.', BannerMessageType.Error);
    },
  });

  function handleUpload() {
    if (selectedImage) {
      uploadMutation.mutate({
        issueId: 1,
        time: new Date().toISOString(),
        caption: 'Sugaring',
        imageUri: selectedImage,
        imageName: `${v4()}.jpg`,
      });
    }
  }

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

  if (circleQuery.isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={GlobalStyles.bodyTextOne}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (circleQuery.isError) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={GlobalStyles.bodyTextOne}>Error</Text>
      </SafeAreaView>
    );
  }

  if (!circleQuery.data) {
    return (
      <SafeAreaView style={styles.noCircleContainer}>
        <Text style={GlobalStyles.headingTextThree}>
          Join or create a circle to start uploading!
        </Text>
        <View style={styles.buttonsContainer}>
          <Button
            type={ButtonType.Function}
            text={'Create a Circle'}
            onPress={() => router.push('/createCircle')}
          />
          <Button
            type={ButtonType.Success}
            text={'Join a Circle'}
            onPress={() => router.push('/joinCircle')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.uploadContainer}>
      <Text style={GlobalStyles.headingTextThree}>Upload</Text>

      <View style={styles.imageContainer}>
        <Image
          source={selectedImage ?? PlaceholderImage}
          style={styles.image}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          type={ButtonType.Function}
          text={'Choose a Photo'}
          onPress={pickImageAsync}
        />
        <Button
          type={ButtonType.Success}
          text={'Use this Photo'}
          onPress={handleUpload}
          disabled={uploadMutation.isPending || !selectedImage}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  uploadContainer: {
    flex: 1,
    backgroundColor: Colors.canarySand,
    alignItems: 'center',
    justifyContent: 'flex-end',
    rowGap: Spacings.sm,
  },

  noCircleContainer: {
    flex: 1,
    backgroundColor: Colors.canarySand,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: Spacings.sm,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.canarySand,
    alignItems: 'center',
    justifyContent: 'center',
  },

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

  buttonsContainer: {
    rowGap: Spacings.sm,
    alignSelf: 'stretch',
    paddingHorizontal: Spacings.lg,
  },
});
