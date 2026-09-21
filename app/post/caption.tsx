import InfoIcon from '@/assets/icons/info.svg';
import Button from '@/components/Button';
import PhotoDateRow from '@/components/PhotoDateRow';
import PostCounter from '@/components/PostCounter';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useUploadImageDetailsMutation } from '@/lib/hooks';
import { printSharpness } from '@/lib/utility';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { useLayout } from '@/lib/layout';

export default function Caption() {
  const {
    issueTitle,
    issueCloseDate,
    issueStartDate,
    photoDate: photoDateParam,
    imageUri,
    width,
    height,
    x,
    y,
    uploadId,
    next,
    targetWidth,
    targetHeight,
  } = useLocalSearchParams();

  const { contentWidth } = useLayout();
  const imageContainerSize = contentWidth - 80;

  const [caption, setCaption] = useState('');
  const [photoDate, setPhotoDate] = useState<Date>(() => {
    const parsed = new Date(photoDateParam as string);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const issueStart = issueStartDate
    ? new Date(issueStartDate as string)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const uploadImageDetailsMutation = useUploadImageDetailsMutation();

  const aspectRatio = Number(width) / Number(height) || 1;
  const MAX_SIZE = imageContainerSize;
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

  const sharpness = printSharpness(
    Number(width),
    Number(height),
    Number(targetWidth),
    Number(targetHeight),
  );

  useEffect(() => {
    // `will` fires alongside the keyboard's own animation; `did` fires after it
    // finishes, which is what made the photo vanish in a second, separate jump.
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(show, () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hide, () => {
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
      photoDate: photoDate.toISOString(),
      x: Number(x),
      y: Number(y),
      width: Number(width),
      height: Number(height),
      imageUri: imageUri as string,
    });

    if (next === '/onboarding/setup') {
      router.dismissTo(next);
    } else {
      router.replace('/feed');
    }
  }

  return (
    <Pressable
      style={[
        styles.container,
        keyboardVisible && { justifyContent: 'flex-start' },
      ]}
      onPress={Keyboard.dismiss}>
      <Animated.View
        layout={LinearTransition.duration(200)}
        style={[styles.column, { width: contentWidth }]}>
        {!keyboardVisible && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(100)}>
            <PostCounter
              issueTitle={issueTitle as string}
              issueCloseDate={issueCloseDate as string}
            />
            <View
              style={[
                styles.imageContainer,
                { height: imageContainerSize },
                sharpness && { marginBottom: Spacings.md },
              ]}>
              <View style={[styles.imageWrapper, imageStyle]}>
                <Image
                  source={imageUri}
                  style={imageStyle}
                  contentFit="cover"
                />
              </View>
            </View>

            {sharpness && (
              <View
                style={[
                  styles.sharpnessNote,
                  sharpness.level === 'poor' && { borderColor: '#F0C9A8' },
                ]}>
                <InfoIcon height={20} width={20} color="#B05637" />
                <Text style={[textStyles.caption, { flexShrink: 1 }]}>
                  {sharpness.message}
                </Text>
              </View>
            )}
          </Animated.View>
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
      </Animated.View>

      <Animated.View
        layout={LinearTransition.duration(200)}
        style={[styles.buttonRow, { width: contentWidth }]}>
        <Button
          label="Post"
          loadingLabel="Posting…"
          loading={uploadImageDetailsMutation.isPending}
          onPress={handlePost}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  column: {
    alignSelf: 'center',
  },

  buttonRow: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacings.xl,
    marginBottom: Spacings.xxl,
  },

  sharpnessNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: Spacings.sm,
    marginHorizontal: 20,
    marginBottom: Spacings.lg,
    padding: Spacings.mdsm,
    borderWidth: 1.5,
    borderColor: '#DEDBD5',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

});
