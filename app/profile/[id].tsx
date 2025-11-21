import CalendarIcon from '@/assets/icons/calendar.svg';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import NetworkImage from '@/components/NetworkImage';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetUserQuery, useUpdateAvatarMutation } from '@/lib/hooks';
import { UserDTO } from '@/lib/responses';
import { useQueryClient } from '@tanstack/react-query';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Profile() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const isSelf =
    queryClient.getQueryData<UserDTO>(['User', 'Self'])?.id === Number(id);
  const { data, status } = useGetUserQuery(Number(id));
  const showToastMessage = useToastMessage();

  const uploadMutation = useUpdateAvatarMutation(
    () => {
      showToastMessage('Upload success!', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['User', 'Self'] });
      queryClient.invalidateQueries({ queryKey: ['User', Number(id)] });
    },
    (error) => {
      console.error('Upload failed:', error);
      showToastMessage('Upload failed.', ToastMessageType.Error);
    },
  );

  async function pickImageAsync() {
    if (isSelf) {
      let result = await launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const image = await ImageManipulator.manipulate(
          result.assets[0].uri,
        ).renderAsync();
        const jpgImage = await image.saveAsync({
          format: SaveFormat.JPEG,
        });

        uploadMutation.mutate({
          imageUri: jpgImage.uri,
        });
      }
    }
  }

  if (status === 'error') {
    return <Error />;
  }

  if (status === 'pending') {
    return <Loading />;
  }

  if (!data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View>
        <PopPressable onPress={pickImageAsync}>
          <NetworkImage
            style={styles.avatar}
            source={data.avatarPath + `?timestamp=${data.avatarTimestamp}`}
          />
        </PopPressable>
        <Text style={[textStyles.heading2, styles.name]}>
          {`${data.firstName} ${data.lastName}`}
        </Text>
        <Text style={[textStyles.heading3, styles.about]}>About</Text>
        <View style={styles.birthdayContainer}>
          <CalendarIcon height={24} width={24} color={'#242832'} />
          <Text style={[textStyles.body, styles.about]}>
            {`Joined on ${data.joinDate.getDate()} ${data.joinDate.toLocaleString(
              'default',
              { month: 'short' },
            )} ${data.joinDate.getFullYear()}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FCFBF8',
    justifyContent: 'space-between',
    paddingBottom: Spacings.xl,
  },

  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: Spacings.sm,
    marginTop: Spacings.xxl,
  },

  name: {
    alignSelf: 'center',
    marginBottom: Spacings.xxxl,
  },

  about: {
    marginBottom: Spacings.md,
  },

  birthdayContainer: {
    flexDirection: 'row',
    columnGap: Spacings.mdsm,
  },
});
