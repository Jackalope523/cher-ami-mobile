import PlusIcon from '@/assets/icons/plus.svg';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import PostCounter from '@/components/PostCounter';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useAddPostMutation } from '@/lib/hooks';
import { formatPhotoDate } from '@/lib/utility';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default function Create() {
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const { issueTitle, postCount } = useLocalSearchParams();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const uploadMutation = useAddPostMutation(
    () => {
      showToastMessage('Upload success!', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['FeedPages'] });
      queryClient.invalidateQueries({ queryKey: ['Count'] });
    },
    (error) => {
      console.error('Upload failed:', error);
      showToastMessage('Upload failed.', ToastMessageType.Error);
    },
  );

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function handlePost() {
    if (selectedImage) {
      uploadMutation.mutate({
        time: new Date().toISOString(),
        caption: caption,
        imageUri: selectedImage,
        imageName: 'image.jpg',
      });
      router.back();
    }
  }

  async function pickImageAsync() {
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [372, 259],
      quality: 1,
    });

    if (!result.canceled) {
      const image = await ImageManipulator.manipulate(
        result.assets[0].uri,
      ).renderAsync();
      const jpgImage = await image.saveAsync({
        format: SaveFormat.JPEG,
      });

      setSelectedImage(jpgImage.uri);
    }
  }

  function buttonDisabled() {
    return selectedImage === null || uploadMutation.isPending;
  }

  return (
    <Pressable
      style={[
        styles.container,
        keyboardVisible && { justifyContent: 'flex-start' },
      ]}
      onPress={Keyboard.dismiss}>
      <View>
        {!keyboardVisible && (
          <View>
            <PostCounter
              issueTitle={issueTitle as string}
              numberOfPosts={parseInt(postCount as string, 10)}
            />
            <PopPressable
              style={styles.imageContainer}
              onPress={pickImageAsync}>
              {selectedImage ? (
                <Image source={selectedImage} style={styles.image} />
              ) : (
                <View
                  style={{
                    backgroundColor: '#F4F1EA',
                    borderRadius: 32,
                    width: Dimensions.get('window').width - 40,
                    aspectRatio: 744 / 496,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <PlusIcon height={96} width={96} color={'#868581'} />
                </View>
              )}
            </PopPressable>

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
          </View>
        )}

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
      </View>

      <PopPressable
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
      </PopPressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    justifyContent: 'space-between',
  },

  image: {
    width: Dimensions.get('window').width - 40,
    aspectRatio: 744 / 496,
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
