import InfoIcon from '@/assets/icons/info.svg';
import Button from '@/components/Button';
import PhotoDateRow from '@/components/PhotoDateRow';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useUploadImageDetailsMutation } from '@/lib/hooks';
import { useLayout } from '@/lib/layout';
import { printSharpness } from '@/lib/utility';
import { useHeaderHeight } from '@react-navigation/elements';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

export default function Caption() {
  const {
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

  const headerHeight = useHeaderHeight();
  const { contentWidth, height: screenHeight, isTablet } = useLayout();
  // Same 20pt inset as the date row and caption, so the photo lines up with them.
  const columnWidth = contentWidth - 40;
  const scrollRef = useRef<ScrollView>(null);
  const captionFocused = useRef(false);

  const [caption, setCaption] = useState('');
  const [photoDate, setPhotoDate] = useState<Date>(() => {
    const parsed = new Date(photoDateParam as string);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  });

  const issueStart = issueStartDate
    ? new Date(issueStartDate as string)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const uploadImageDetailsMutation = useUploadImageDetailsMutation();

  const aspectRatio = Number(width) / Number(height) || 1;
  // Width first, so a landscape photo takes only the height it needs and a
  // Feature fills the column. Only genuinely tall photos are capped.
  const maxImageWidth = columnWidth;
  // A landscape tablet is wide but short, so a Vertical sized from width alone
  // fills the screen. Phones are unchanged.
  const maxImageHeight = isTablet
    ? Math.min(columnWidth * 1.1, screenHeight * 0.5)
    : columnWidth * 1.1;
  const displayWidth = Math.min(maxImageWidth, maxImageHeight * aspectRatio);
  const displayHeight = displayWidth / aspectRatio;

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

  // The scroll view shrinks as the keyboard starts to rise, so scrolling on that
  // resize moves the caption up with the keyboard instead of after it.
  function revealCaption() {
    if (captionFocused.current) scrollRef.current?.scrollToEnd({ animated: true });
  }

  // Backstop in case the resize lands before focus is recorded.
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', revealCaption);
    return () => show.remove();
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}>
      <ScrollView
        ref={scrollRef}
        onLayout={revealCaption}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={[styles.column, { width: contentWidth }]}>
        <View
          style={[
            styles.imageContainer,
            sharpness && { marginBottom: Spacings.md },
          ]}>
          <View style={[styles.imageWrapper, imageStyle]}>
            <Image source={imageUri} style={imageStyle} contentFit="cover" />
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

        <PhotoDateRow
          value={photoDate}
          issueStart={issueStart}
          onChange={setPhotoDate}
        />

        <View style={styles.captionLabelRow}>
          <Text style={textStyles.labelLargeBlack}>Caption</Text>
          <Text style={textStyles.labelLargeBlack}>{caption.length}/200</Text>
        </View>

        <TextInput
          style={[textStyles.body, styles.captionInput]}
          placeholder="Give your post a caption..."
          placeholderTextColor="#868581"
          maxLength={200}
          value={caption}
          onChangeText={setCaption}
          onFocus={() => {
            captionFocused.current = true;
          }}
          onBlur={() => {
            captionFocused.current = false;
          }}
          multiline
        />
      </ScrollView>

      <View style={[styles.buttonRow, { width: contentWidth }]}>
        <Button
          label="Post"
          loadingLabel="Posting…"
          loading={uploadImageDetailsMutation.isPending}
          onPress={handlePost}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    alignItems: 'center',
  },

  column: {
    alignSelf: 'center',
    paddingBottom: Spacings.lg,
  },

  buttonRow: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  imageWrapper: {
    backgroundColor: '#EAE8E4',
    overflow: 'hidden',
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacings.lg,
    marginBottom: Spacings.lg,
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

  captionLabelRow: {
    // PhotoDateRow brings 16 of its own; this makes 24, matching the gap above it.
    marginTop: Spacings.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  captionInput: {
    paddingHorizontal: 20,
    textAlignVertical: 'top',
    minHeight: 80,
  },
});
