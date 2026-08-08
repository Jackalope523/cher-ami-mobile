import { useAuth } from '@/components/AuthProvider';
import PhotoDateRow from '@/components/PhotoDateRow';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useUpdatePostMutation } from '@/lib/hooks';
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

export default function Edit() {
  const {
    id,
    caption: captionParam,
    photoDate: photoDateParam,
    issueStartDate,
    photoUrl,
    imageWidth,
    imageHeight,
  } = useLocalSearchParams();
  const { getToken } = useAuth();

  const [caption, setCaption] = useState((captionParam as string) ?? '');
  const [photoDate, setPhotoDate] = useState<Date>(() => {
    const parsed = new Date(photoDateParam as string);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const issueStart = issueStartDate
    ? new Date(issueStartDate as string)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const updatePostMutation = useUpdatePostMutation(() => {
    router.back();
  });

  const aspectRatio = Number(imageWidth) / Number(imageHeight) || 1;
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

  function handleSave() {
    updatePostMutation.mutate({
      id: Number(id),
      caption,
      photoDate: photoDate.toISOString(),
    });
  }

  function buttonDisabled() {
    return updatePostMutation.isPending;
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
          <View style={styles.imageContainer}>
            <View style={[styles.imageWrapper, imageStyle]}>
              <Image
                source={{
                  headers: {
                    Authorization: `Bearer ${getToken()}`,
                  },
                  uri: photoUrl as string,
                }}
                style={imageStyle}
                contentFit="cover"
              />
            </View>
          </View>
        )}

        <PhotoDateRow
          value={photoDate}
          issueStart={issueStart}
          onChange={setPhotoDate}
        />

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
        onPress={handleSave}
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
          Save
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
