import CreditCardIcon from '@/assets/icons/credit-card.svg';
import SettingsIcon from '@/assets/icons/log-out.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import UserIcon from '@/assets/icons/user-round.svg';
import Error from '@/components/Error';
import { useImagePicker } from '@/components/ImagePickerProvider';
import InviteModalContents from '@/components/InviteModalContents';
import LeaveCircleContents from '@/components/LeaveCircleContents';
import Loading from '@/components/Loading';
import { useBottomSheetModal } from '@/components/modals/BottomSheetModalProvider';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import NetworkImage from '@/components/NetworkImage';
import PopPressable from '@/components/PopPressable';
import UserItem from '@/components/UserItem';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  useCheckPaymentMethodsQuery,
  useGetCircleQuery,
  useGetSelfQuery,
  useUpdateHeaderMutation,
} from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

export default function Manage() {
  const showToastMessage = useToastMessage();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const pickImageAsync = useImagePicker();
  const userQuery = useGetSelfQuery();
  const circleQuery = useGetCircleQuery();
  const checkPaymentMethodsQuery = useCheckPaymentMethodsQuery();
  const { displayBottomSheet, dismissBottomSheetModal } = useBottomSheetModal();
  const { displayDialogue } = useDialogueModal();
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

  function handleInvite() {
    displayBottomSheet(
      <InviteModalContents dismissModal={dismissBottomSheetModal} />,
    );
  }

  function handleAddRecipient() {
    if (checkPaymentMethodsQuery.data) {
      router.push('/circle/recipients/add');
    } else {
      router.push('/billing/add');
    }
  }

  function handleCircleSettings() {
    displayDialogue(<LeaveCircleContents />);
  }

  function pickImage() {
    pickImageAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [2, 1],
    }).then((x) => {
      if (x) {
        uploadMutation.mutate({
          imageUri: x,
        });
      }
    });
  }

  if (
    circleQuery.isError ||
    userQuery.isError ||
    checkPaymentMethodsQuery.isError
  ) {
    return <Error />;
  }

  if (
    circleQuery.isLoading ||
    userQuery.isLoading ||
    checkPaymentMethodsQuery.isLoading
  ) {
    return <Loading />;
  }

  if (
    !circleQuery.data ||
    !userQuery.data ||
    checkPaymentMethodsQuery.data === undefined
  ) {
    return null;
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
        <PopPressable onPress={pickImage}>
          <NetworkImage
            source={
              circleQuery.data.headerPath +
              `?timestamp=${circleQuery.data.headerTimestamp}`
            }
            style={{
              width: Dimensions.get('window').width - 40,
              aspectRatio: 2 / 1,
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
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            columnGap: Spacings.sm,
            marginHorizontal: 20,
          }}>
          <Text style={textStyles.buttonTextOrange}>Invite to Circle</Text>
          <PlusIcon height={24} width={24} color={'#B05637'} />
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
              imageSource={
                x.avatarPath
                  ? x.avatarPath + `?timestamp=${x.avatarTimestamp}`
                  : undefined
              }
              tagLeft={x.id === userQuery.data.id ? '(You)' : undefined}
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
          onPress={handleAddRecipient}
          style={{
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#B05637',
            paddingVertical: Spacings.mdsm,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            columnGap: Spacings.sm,
            marginHorizontal: 20,
          }}>
          <Text style={textStyles.buttonTextOrange}>Add Recipient</Text>
          <PlusIcon height={24} width={24} color={'#B05637'} />
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
              tagRight={
                x.managerId === userQuery.data.id ? '(Edit)' : undefined
              }
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
            <Text style={textStyles.buttonTextWhite}>Billing</Text>
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
            <Text style={textStyles.buttonTextWhite}>Leave</Text>
          </PopPressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
