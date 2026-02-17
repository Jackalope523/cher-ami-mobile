import LoadingIcon from '@/assets/icons/loader.svg';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { router, useLocalSearchParams } from 'expo-router';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { openCropper } from 'react-native-image-crop-picker';

export default function PickSize() {
  const { issueTitle, imageUri } = useLocalSearchParams();

  function cropImage(width: number, height: number) {
    openCropper({
      mediaType: 'photo',
      path: imageUri as string,
      width,
      height,
    }).then((image) => {
      router.replace({
        pathname: '/post/create',
        params: {
          issueTitle,
          imageUri: image.path,
          width,
          height,
        },
      });
    });
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <PopPressable onPress={() => cropImage(1088, 756)}>
            <LoadingIcon height={48} width={48} color="#B05637" />
            <Text>Landscape</Text>
          </PopPressable>
        </View>

        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <PopPressable onPress={() => cropImage(300, 300)}>
            <LoadingIcon height={48} width={48} color="#B05637" />
            <Text>Portrait</Text>
          </PopPressable>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <PopPressable onPress={() => cropImage(300, 300)}>
            <LoadingIcon height={48} width={48} color="#B05637" />
            <Text>Full Page</Text>
          </PopPressable>
        </View>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <PopPressable onPress={() => cropImage(400, 300)}>
            <LoadingIcon height={48} width={48} color="#B05637" />
            <Text>Spread</Text>
          </PopPressable>
        </View>
      </View>
    </View>
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
    aspectRatio: 372 / 259,
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
