import PopPressable from '@/components/PopPressable';
import PostCounter from '@/components/PostCounter';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useUploadImageDetailsMutation } from '@/lib/hooks';
import { Image } from 'expo-image';
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

const { width: windowWidth } = Dimensions.get('window');
const IMAGE_CONTAINER_SIZE = windowWidth - 80;

export default function Caption() {
  const { issueTitle, issueCloseDate, imageUri, width, height, x, y, uploadId } =
    useLocalSearchParams();

  const [caption, setCaption] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const uploadImageDetailsMutation = useUploadImageDetailsMutation();

  const aspectRatio = Number(width) / Number(height) || 1;
  const MAX_SIZE = IMAGE_CONTAINER_SIZE;
  let displayWidth, displayHeight;

  if (aspectRatio >= 1) {
    displayWidth = MAX_SIZE;
    displayHeight = MAX_SIZE / aspectRatio;
  } else {
    displayHeight = MAX_SIZE;
    displayWidth = MAX_SIZE * aspectRatio;
  }

  const imageStyle = {
    width: displayWidth,
    height: displayHeight,
    borderRadius: aspectRatio > 1.5 ? 24 : 32,
  };

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
    uploadImageDetailsMutation.mutate({
      uploadId: uploadId as string,
      caption,
      x: Number(x),
      y: Number(y),
      width: Number(width),
      height: Number(height),
      imageUri: imageUri as string,
    });

    router.replace('/feed');
  }

  function buttonDisabled() {
    return uploadImageDetailsMutation.isPending;
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
              issueCloseDate={issueCloseDate as string}
            />
            <View style={styles.imageContainer}>
              <View style={[styles.imageWrapper, imageStyle]}>
                <Image
                  source={imageUri}
                  style={imageStyle}
                  contentFit="cover"
                />
              </View>
            </View>
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

  imageWrapper: {
    backgroundColor: '#EAE8E4',
    overflow: 'hidden',
  },

  image: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
  },

  imageContainer: {
    height: IMAGE_CONTAINER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacings.xl,
    marginBottom: Spacings.xxl,
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
