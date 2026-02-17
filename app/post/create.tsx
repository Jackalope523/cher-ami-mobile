import { useImagePicker } from '@/components/ImagePickerProvider';
import { useToastMessage } from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import PostCounter from '@/components/PostCounter';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useAddPostMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

export default function Create() {
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const pickImageAsync = useImagePicker();
  const { issueTitle, imageUri, width, height } = useLocalSearchParams();
  const [caption, setCaption] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const uploadMutation = useAddPostMutation();

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

  function pickImage() {
    pickImageAsync({}).then((imageUri) => {
      router.push({
        pathname: '/post/pickSize',
        params: {
          issueTitle,
          imageUri,
        },
      });
    });
  }

  function handlePost() {
    uploadMutation.mutate({
      time: new Date().toISOString(),
      caption: caption,
      imageUri: imageUri as string,
      imageName: 'image.jpg',
    });
    router.back();
  }

  return (
    <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false}>
      <View>
        {!keyboardVisible && (
          <View>
            <PostCounter issueTitle={issueTitle as string} />
            <PopPressable style={styles.imageContainer} onPress={pickImage}>
              <Image
                source={imageUri}
                style={[
                  styles.image,
                  { aspectRatio: Number(width) / Number(height) },
                ]}
              />
            </PopPressable>
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
        disabled={uploadMutation.isPending}
        style={[
          styles.button,
          uploadMutation.isPending && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            uploadMutation.isPending && { color: '#A8ABB3' },
          ]}>
          Post
        </Text>
      </PopPressable>
    </ScrollView>
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
    borderRadius: 32,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacings.mdsm,
    paddingBottom: 32,
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
