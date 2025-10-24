import CreditCardIcon from '@/assets/icons/credit-card-white.svg';
import PlusIcon from '@/assets/icons/plus-orange.svg';
import SettingsIcon from '@/assets/icons/settings-white.svg';
import UserIcon from '@/assets/icons/user-round.svg';
import Placeholder from '@/assets/images/placeholder.jpg';
import InviteModalContents from '@/components/InviteModalContents';
import LeaveCircleContents from '@/components/LeaveCircleContents';
import { useBottomSheetModal } from '@/components/modals/BottomSheetModalProvider';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import NetworkImage from '@/components/NetworkImage';
import UserItem from '@/components/UserItem';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  useGetCircleQuery,
  useGetSelfQuery,
  useUpdateHeaderMutation,
} from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Pressable, ScrollView } from 'react-native-gesture-handler';
import { v4 } from 'uuid';

export default function Manage() {
  const showToastMessage = useToastMessage();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const userQuery = useGetSelfQuery();
  const circleQuery = useGetCircleQuery();
  const { displayBottomSheet, dismissBottomSheetModal } = useBottomSheetModal();
  const { displayDialogue, dismissDialogue } = useDialogueModal();

  const uploadMutation = useUpdateHeaderMutation(
    () => {
      showToastMessage('Upload success!', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
    },
    (error) => {
      console.error('Upload failed:', error);
      showToastMessage('Upload failed.', ToastMessageType.Error);
    },
  );

  useEffect(() => {
    navigation.setOptions({
      title: circleQuery.data?.title ?? '',
    });
  }, [circleQuery.data, navigation]);

  if (circleQuery.isLoading) {
    return <Text style={GlobalStyles.bodyTextOne}>Loading...</Text>;
  }
  if (circleQuery.isError) {
    return <Text style={GlobalStyles.bodyTextOne}>Error</Text>;
  }

  function handleInvite() {
    displayBottomSheet(
      <InviteModalContents dismissModal={dismissBottomSheetModal} />,
    );
  }

  function handleCircleSettings() {
    displayDialogue(<LeaveCircleContents dismissModal={dismissDialogue} />);
  }

  async function pickImageAsync() {
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [Dimensions.get('window').width - 40, 186],
      quality: 1,
    });

    if (!result.canceled) {
      uploadMutation.mutate({
        imageUri: result.assets[0].uri,
        imageName: `${v4()}.jpg`,
      });
    }
  }

  if (!circleQuery.data || !userQuery.data) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <Pressable onPress={pickImageAsync}>
          <NetworkImage
            source={
              circleQuery.data.headerPath +
              `?timestamp=${circleQuery.data.headerTimestamp}`
            }
            placeholder={Placeholder}
            style={{
              height: 186,
              width: Dimensions.get('window').width - 40,
              borderRadius: 32,
              marginHorizontal: 20,
              marginVertical: Spacings.xl,
            }}
          />
        </Pressable>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            alignItems: 'center',
            marginBottom: Spacings.md,
          }}>
          <Text style={textStyles.heading3}>Members</Text>
          <View
            style={{
              flexDirection: 'row',
              columnGap: Spacings.sm,
              paddingVertical: Spacings.sm,
              paddingHorizontal: Spacings.mdsm,
              backgroundColor: '#F4F1EA',
              borderRadius: 10,
            }}>
            <UserIcon height={24} width={24} />
            <Text style={textStyles.labelLargeGrey}>
              {circleQuery.data.contributors.length}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleInvite}
          style={{
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#B05637',
            paddingVertical: Spacings.mdsm,
            paddingRight: Dimensions.get('window').width / 3.5,
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            columnGap: Spacings.sm,
            marginHorizontal: 20,
          }}>
          <Text style={textStyles.buttonTextOrange}>Invite to Circle</Text>
          <PlusIcon height={24} width={24} />
        </Pressable>

        <View
          style={{
            rowGap: Spacings.lg,
            marginVertical: Spacings.lg,
            marginHorizontal: 20,
          }}>
          {circleQuery.data.contributors.map((x) => (
            <UserItem
              key={x.id}
              text={x.firstName}
              imageSource={x.avatarPath + `?timestamp=${x.avatarTimestamp}`}
              tag={'(You)'}
              showTag={x.id === userQuery.data.id}
              onPress={() =>
                router.push({
                  pathname: '/profile/[id]',
                  params: { id: x.id },
                })
              }
            />
          ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            paddingVertical: Spacings.sm,
            alignItems: 'center',
            marginBottom: Spacings.md,
          }}>
          <Text style={textStyles.heading3}>Recipients</Text>
        </View>

        <Pressable
          onPress={() => router.push('/circle/recipients/add')}
          style={{
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#B05637',
            paddingVertical: Spacings.mdsm,
            paddingRight: Dimensions.get('window').width / 3.5,
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            columnGap: Spacings.sm,
            marginHorizontal: 20,
          }}>
          <Text style={textStyles.buttonTextOrange}>Add Recipient</Text>
          <PlusIcon height={24} width={24} />
        </Pressable>

        <View
          style={{
            rowGap: Spacings.lg,
            marginVertical: Spacings.lg,
            marginHorizontal: 20,
          }}>
          {circleQuery.data.recipients.map((x) => (
            <UserItem
              key={x.id}
              text={x.firstName}
              imageSource={x.avatarPath + `?timestamp=${x.avatarTimestamp}`}
              onPress={() => {
                if (x.managerId === userQuery.data.id)
                  router.push('/circle/recipients/edit');
              }}
              tag={'(Edit)'}
              showTag={x.managerId === userQuery.data.id}
            />
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          flexDirection: 'row',
          columnGap: Spacings.md,
          justifyContent: 'center',
        }}>
        <Pressable
          onPress={() => router.push('/billing/manage')}
          style={{
            flexDirection: 'row',
            backgroundColor: '#B05637',
            paddingVertical: Spacings.mdsm,
            paddingHorizontal: Spacings.md,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            columnGap: Spacings.sm,
          }}>
          <CreditCardIcon height={24} width={24} />
          <Text style={textStyles.buttonTextWhite}>Manage Billing</Text>
        </Pressable>
        <Pressable
          onPress={handleCircleSettings}
          style={{
            flexDirection: 'row',
            backgroundColor: '#B05637',
            paddingVertical: Spacings.mdsm,
            paddingHorizontal: Spacings.md,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            columnGap: Spacings.sm,
          }}>
          <SettingsIcon height={24} width={24} />
          <Text style={textStyles.buttonTextWhite}>Circle Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
