import CreditCardIcon from '@/assets/icons/credit-card.svg';
import ImageIcon from '@/assets/icons/image.svg';
import SettingsIcon from '@/assets/icons/log-out.svg';
import EditIcon from '@/assets/icons/pencil.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import UserIcon from '@/assets/icons/user-round.svg';
import Placeholder from '@/assets/images/placeholder.png';
import { useAuth } from '@/components/AuthProvider';
import Error from '@/components/Error';
import InviteModalContents from '@/components/InviteModalContents';
import LeaveCircleContents from '@/components/LeaveCircleContents';
import Loading from '@/components/Loading';
import { useBottomSheetModal } from '@/components/modals/BottomSheetModalProvider';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import PopPressable from '@/components/PopPressable';
import UserItem from '@/components/UserItem';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  useGetCircleQuery,
  useGetPaymentMethodQuery,
  useGetSelfQuery,
} from '@/lib/hooks';
import { RecipientRequest, UpdateCircleRequest } from '@/lib/requests';
import { RecipientItem } from '@/lib/responses';
import { useMutationState } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

export default function Manage() {
  const navigation = useNavigation();
  const { getToken } = useAuth();
  const userQuery = useGetSelfQuery();
  const circleQuery = useGetCircleQuery();
  const getPaymentMethodQuery = useGetPaymentMethodQuery();
  const { displayBottomSheet, dismissBottomSheetModal } = useBottomSheetModal();
  const { displayDialogue } = useDialogueModal();
  const updateCircleVariables = useMutationState<UpdateCircleRequest>({
    filters: { mutationKey: ['UpdateCircle'], status: 'pending' },
    select: (mutation) => mutation.state.variables as UpdateCircleRequest,
  });
  const variables = useMutationState<RecipientItem>({
    filters: { mutationKey: ['AddRecipient'], status: 'pending' },
    select: (mutation) => {
      const request = mutation.state.variables as RecipientRequest;

      return {
        id: -1,
        managerId: userQuery.data?.id ?? -1,
        name: request.name,
        avatarUrl: request.avatarUri,
        avatarTimestamp: new Date(),
        isVeteran: request.isVeteran,
      };
    },
  });
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title:
        updateCircleVariables.length > 0
          ? updateCircleVariables[0].title
          : circleQuery.data?.title ?? '',
      headerRight: () => (
        <PopPressable onPress={() => router.push('/circle/edit')}>
          <EditIcon
            height={24}
            width={24}
            color={'#C15F3C'}
            style={{ marginRight: 10 }}
          />
        </PopPressable>
      ),
    });
  }, [circleQuery.data, navigation, updateCircleVariables]);

  function handleInvite() {
    displayBottomSheet(
      <InviteModalContents dismissModal={dismissBottomSheetModal} />,
    );
  }

  function handleAddRecipient() {
    if (getPaymentMethodQuery.data || userQuery.data?.isBillingExempt) {
      router.push('/circle/recipients/add');
    } else {
      router.push('/billing/add');
    }
  }

  function handleCircleSettings() {
    displayDialogue(<LeaveCircleContents />);
  }

  if (
    circleQuery.isError ||
    userQuery.isError ||
    getPaymentMethodQuery.isError
  ) {
    return <Error />;
  }

  if (
    circleQuery.isLoading ||
    userQuery.isLoading ||
    getPaymentMethodQuery.isLoading
  ) {
    return <Loading />;
  }

  if (
    !circleQuery.data ||
    !userQuery.data ||
    getPaymentMethodQuery.data === undefined
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
        {circleQuery.data.headerUrl ? (
          <Image
            style={styles.header}
            placeholder={Placeholder}
            placeholderContentFit="fill"
            source={{
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
              uri:
                updateCircleVariables.length > 0 &&
                updateCircleVariables[0].headerUrl
                  ? updateCircleVariables[0].headerUrl
                  : circleQuery.data.headerUrl,
            }}
          />
        ) : (
          <View style={[styles.header, { backgroundColor: '#F4F1EA' }]}>
            <ImageIcon height={48} width={48} color={'#868581'} />
          </View>
        )}

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

        <Text
          style={[
            textStyles.body,
            { marginBottom: Spacings.md, marginHorizontal: 20 },
          ]}>
          Invite family and friends to view and post to the circle!
        </Text>

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
            marginBottom: Spacings.lg,
          }}>
          <Text style={textStyles.buttonTextOrange}>Invite to Circle</Text>
          <PlusIcon height={24} width={24} color={'#B05637'} />
        </PopPressable>

        <View
          style={{
            rowGap: Spacings.lg,
            marginHorizontal: 20,
            marginBottom: Spacings.xl,
          }}>
          {circleQuery.data.contributors.map((x) => (
            <UserItem
              key={x.id}
              text={x.firstName}
              imageSource={x.avatarUrl ? x.avatarUrl : null}
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
            alignItems: 'center',
            marginBottom: Spacings.md,
          }}>
          <Text style={textStyles.heading3}>Recipients</Text>
        </View>

        <Text
          style={[
            textStyles.body,
            { marginBottom: Spacings.md, marginHorizontal: 20 },
          ]}>
          Recipients will recieve a physical magazine each month.
        </Text>

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
              text={x.name}
              imageSource={x.avatarUrl ? x.avatarUrl : null}
              onPress={
                x.managerId === userQuery.data.id
                  ? () => {
                      router.push({
                        pathname: '/circle/recipients/[id]/edit',
                        params: { id: x.id },
                      });
                    }
                  : undefined
              }
              tagRight={
                x.managerId === userQuery.data.id ? '(Edit)' : undefined
              }
            />
          ))}
          {variables.length >= 1 && (
            <UserItem
              key={variables[0].id}
              text={variables[0].name}
              imageSource={
                variables[0].avatarUrl ? variables[0].avatarUrl : null
              }
            />
          )}
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

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get('window').width - 40,
    aspectRatio: 2 / 1,
    borderRadius: 32,
    marginHorizontal: 20,
    marginVertical: Spacings.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
