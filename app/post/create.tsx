import PlaceholderImage from '@/assets/images/placeholder.jpg';
import { BannerMessageType } from '@/components/BannerMessage';
import Button, { ButtonType } from '@/components/Button';
import LizardTextInput, { InputType } from '@/components/LizardTextInput';
import { useToastMessage } from '@/components/modals/ToastMessageProvider';
import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { useAddPostMutation, useCurrentIssueQuery } from '@/lib/hooks';
import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 } from 'uuid';

export default function Create() {
  const showToastMessage = useToastMessage();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [validCaption, setValidCaption] = useState(true);

  const currentIssueQuery = useCurrentIssueQuery();
  const uploadMutation = useAddPostMutation(
    (_) => {
      showToastMessage('Upload success!', BannerMessageType.Success);
      setSelectedImage(null);
      setCaption('');
    },
    (error) => {
      console.error('Upload failed:', error);
      showToastMessage('Upload failed.', BannerMessageType.Error);
    },
  );

  function handlePost() {
    if (selectedImage && currentIssueQuery.data) {
      uploadMutation.mutate({
        issueId: currentIssueQuery.data.id,
        time: new Date().toISOString(),
        caption: caption,
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

  if (!currentIssueQuery.isSuccess) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={GlobalStyles.bodyTextOne}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (currentIssueQuery.isError) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={GlobalStyles.bodyTextOne}>Error</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={GlobalStyles.headingTextThree}>
        Upload to {currentIssueQuery.data?.title}
      </Text>

      <Pressable style={styles.imageContainer} onPress={pickImageAsync}>
        <Image
          source={selectedImage ?? PlaceholderImage}
          style={styles.image}
        />
      </Pressable>
      <LizardTextInput
        type={InputType.Caption}
        label="Caption"
        valid={validCaption}
        setValid={setValidCaption}
        text={caption}
        setText={setCaption}
        inputMode="text"
        maxLength={200}
      />
      <View style={styles.buttonsContainer}>
        <Button
          type={ButtonType.Success}
          text={'Post'}
          onPress={handlePost}
          disabled={
            uploadMutation.isPending ||
            !selectedImage ||
            !validCaption ||
            !currentIssueQuery.isSuccess
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canarySand,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: Spacings.sm,
    paddingHorizontal: Spacings.lg,
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
  },
});
