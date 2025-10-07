import PlusIcon from '@/assets/icons/plus-grey.svg';
import { BannerMessageType } from '@/components/BannerMessage';
import { useToastMessage } from '@/components/modals/ToastMessageProvider';
import PostCounter from '@/components/PostCounter';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useAddPostMutation, useCurrentIssueQuery } from '@/lib/hooks';
import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
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
    <View style={styles.container}>
      <PostCounter />

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
            <PlusIcon height={96} width={96} />
          </View>
        )}
      </Pressable>

      <Text
        style={[
          textStyles.captionMedium,
          {
            paddingLeft: 20,
            paddingBottom: 32,
          },
        ]}>
        Photo taken on Jul 28th, 2024
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          alignItems: 'center',
        }}>
        <Text style={textStyles.labelLargeBlack}>Caption</Text>
        <Text style={textStyles.labelLargeBlack}>{caption.length}/200</Text>
      </View>

      <TextInput
        style={[
          textStyles.body,
          {
            paddingHorizontal: 20,
            flex: 1,
            textAlignVertical: 'top',
          },
        ]}
        placeholder="Give your post a caption..."
        placeholderTextColor="#868581"
        maxLength={200}
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <Pressable
        onPress={handlePost}
        disabled={selectedImage === null}
        style={[
          styles.button,
          selectedImage === null && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            selectedImage === null && { color: '#A8ABB3' },
          ]}>
          Post
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
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
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width - 40,
    borderRadius: 32,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacings.mdsm,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    margin: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
  },
});
