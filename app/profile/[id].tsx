import CalendarIcon from '@/assets/icons/calendar.svg';
import MenuIcon from '@/assets/icons/ellipsis-vertical.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import PersonIcon from '@/assets/icons/user-round.svg';
import Placeholder from '@/assets/images/placeholder.png';
import { useAuth } from '@/components/AuthProvider';
import BlockUserContents from '@/components/BlockUserContents';
import Error from '@/components/Error';
import { useImagePicker } from '@/components/ImagePickerProvider';
import Loading from '@/components/Loading';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetUserQuery, useUpdateAvatarMutation } from '@/lib/hooks';
import { UserDTO } from '@/lib/responses';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Profile() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const pickImageAsync = useImagePicker();
  const isSelf =
    queryClient.getQueryData<UserDTO>(['User', 'Self'])?.id === Number(id);
  const { data, status } = useGetUserQuery(Number(id));
  const { displayDialogue } = useDialogueModal();

  const uploadMutation = useUpdateAvatarMutation();

  useEffect(() => {
    if (!isSelf) {
      navigation.setOptions({
        headerRight: () => (
          <PopPressable
            onPress={() => {
              displayDialogue(<BlockUserContents userId={Number(id)} />);
            }}>
            <MenuIcon height={24} width={24} color={'#C15F3C'} />
          </PopPressable>
        ),
      });
    }
  }, [data, displayDialogue, id, isSelf, navigation]);

  function pickImage() {
    pickImageAsync({
      height: 96,
      width: 96,
      cropping: true,
    }).then((x) => {
      if (x) {
        uploadMutation.mutate({
          imageUri: x,
        });
      }
    });
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
        <PopPressable
          style={styles.avatarContainer}
          onPress={pickImage}
          disabled={!isSelf}>
          {data.avatarPath ? (
            <Image
              style={styles.avatar}
              placeholder={Placeholder}
              placeholderContentFit="fill"
              source={{
                headers: {
                  Authorization: `Bearer ${getToken()}`,
                },
                uri: uploadMutation.isPending
                  ? uploadMutation.variables.imageUri
                  : `https://app-cherami-prod.azurewebsites.net${data.avatarPath}?timestamp=${data.avatarTimestamp}`,
              }}
            />
          ) : (
            <View style={[styles.avatar, { backgroundColor: '#F4F1EA' }]}>
              {isSelf ? (
                <PlusIcon height={48} width={48} color={'#868581'} />
              ) : (
                <PersonIcon height={48} width={48} color={'#868581'} />
              )}
            </View>
          )}
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

  avatarContainer: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: Spacings.sm,
    marginTop: Spacings.xxl,
  },

  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
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
