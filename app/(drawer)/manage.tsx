import CreditCardIcon from '@/assets/icons/credit-card.svg';
import PlusIcon from '@/assets/icons/plus-orange.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import UserIcon from '@/assets/icons/user-round.svg';
import InviteModalContents from '@/components/InviteModalContents';
import LeaveCircleContents from '@/components/LeaveCircleContents';
import { useBottomSheetModal } from '@/components/modals/BottomSheetModalProvider';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import NetworkImage from '@/components/NetworkImage';
import PopPressable from '@/components/PopPressable';
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
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { v4 } from 'uuid';

export default function Manage() {
  const showToastMessage = useToastMessage();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const userQuery = useGetSelfQuery();
  const circleQuery = useGetCircleQuery();
  const { displayBottomSheet, dismissBottomSheetModal } = useBottomSheetModal();
  const { displayDialogue, dismissDialogue } = useDialogueModal();
  const [scrolling, setScrolling] = useState(false);

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
    <View style={{ flex: 1, backgroundColor: '#FCFBF8' }}>
      <ScrollView
        overScrollMode="never"
        onScrollBeginDrag={() => setScrolling(true)}
        onScrollEndDrag={() => setScrolling(false)}
        onMomentumScrollEnd={() => setScrolling(false)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <PopPressable onPress={pickImageAsync}>
          <NetworkImage
            source={
              circleQuery.data.headerPath +
              `?timestamp=${circleQuery.data.headerTimestamp}`
            }
            style={{
              height: 186,
              width: Dimensions.get('window').width - 40,
              borderRadius: 32,
              marginHorizontal: 20,
              marginVertical: Spacings.xl,
            }}
          />
        </PopPressable>

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
              backgroundColor: '#FCFBF8',
              borderRadius: 10,
            }}>
            <UserIcon height={24} width={24} />
            <Text style={textStyles.labelLargeGrey}>
              {circleQuery.data.contributors.length}
            </Text>
          </View>
        </View>

        <PopPressable
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
        </PopPressable>

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

        <PopPressable
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
        </PopPressable>

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
                  router.push({
                    pathname: '/circle/recipients/[id]/edit',
                    params: { id: x.id },
                  });
              }}
              tag={'(Edit)'}
              showTag={x.managerId === userQuery.data.id}
            />
          ))}
        </View>
      </ScrollView>
      {!scrolling && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            flexDirection: 'row',
            columnGap: Spacings.md,
            justifyContent: 'center',
            padding: Spacings.lgmd,
          }}>
          <PopPressable
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
            <CreditCardIcon height={24} width={24} color={'#FFFFFF'} />
            <Text style={textStyles.buttonTextWhite}>Manage Billing</Text>
          </PopPressable>
          <PopPressable
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
            <SettingsIcon height={24} width={24} color={'#FFFFFF'} />
            <Text style={textStyles.buttonTextWhite}>Circle Settings</Text>
          </PopPressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
