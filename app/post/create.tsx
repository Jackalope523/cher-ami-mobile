import PlusIcon from '@/assets/icons/plus-grey.svg';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PostCounter from '@/components/PostCounter';
import { Colors } from '@/constants/Colors';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useAddPostMutation } from '@/lib/hooks';
import { formatPhotoDate } from '@/lib/utility';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { v4 } from 'uuid';

export default function Create() {
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const { issueTitle, postCount } = useLocalSearchParams();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const uploadMutation = useAddPostMutation(
    () => {
      showToastMessage('Upload success!', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['FeedPages'] });
      router.back();
    },
    (error) => {
      console.error('Upload failed:', error);
      showToastMessage('Upload failed.', ToastMessageType.Error);
    },
  );

  function handlePost() {
    if (selectedImage) {
      uploadMutation.mutate({
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
      aspect: [Dimensions.get('window').width - 40, 259],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  function buttonDisabled() {
    return selectedImage === null || uploadMutation.isPending;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <PostCounter
          issueTitle={issueTitle as string}
          numberOfPosts={parseInt(postCount as string, 10)}
        />
        <Pressable style={styles.imageContainer} onPress={pickImageAsync}>
          {selectedImage ? (
            <Image source={selectedImage} style={styles.image} />
          ) : (
            <View
              style={{
                backgroundColor: '#F4F1EA',
                borderRadius: 32,
                width: Dimensions.get('window').width - 40,
                height: 259,
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
          {formatPhotoDate(new Date())}
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
            Post
          </Text>
        </Pressable>
      </Pressable>
    </KeyboardAvoidingView>
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
    height: 259,
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
