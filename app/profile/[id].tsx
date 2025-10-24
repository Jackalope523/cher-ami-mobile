import BirthdayIcon from '@/assets/icons/cake.svg';
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
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { v4 } from 'uuid';

export default function Profile() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const isSelf =
    queryClient.getQueryData<UserDTO>(['User', 'Self'])?.id === Number(id);
  const { data } = useGetUserQuery(Number(id));
  const showToastMessage = useToastMessage();

  const uploadMutation = useUpdateAvatarMutation(
    () => {
      showToastMessage('Upload success!', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['User', 'Self'] });
      queryClient.invalidateQueries({ queryKey: ['User', Number(id)] });
      queryClient.invalidateQueries({ queryKey: ['FeedPages'] });
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
        uploadMutation.mutate({
          imageUri: result.assets[0].uri,
          imageName: `${v4()}.jpg`,
        });
      }
    }
  }

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
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
        <BirthdayIcon height={24} width={24} />
        <Text style={[textStyles.body, styles.about]}>
          {`Born on ${data.dateOfBirth.getDate()} ${data.dateOfBirth.toLocaleString(
            'default',
            { month: 'short' },
          )} ${data.dateOfBirth.getFullYear()}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FCFBF8',
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
