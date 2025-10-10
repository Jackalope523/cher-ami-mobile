import CreditCardIcon from '@/assets/icons/credit-card-white.svg';
import PlusIcon from '@/assets/icons/plus-orange.svg';
import SettingsIcon from '@/assets/icons/settings-white.svg';
import UserIcon from '@/assets/icons/user-round.svg';
import Placeholder from '@/assets/images/placeholder.jpg';
import InviteModalContents from '@/components/InviteModalContents';
import { useBottomSheetModal } from '@/components/modals/BottomSheetModalProvider';
import NetworkImage from '@/components/NetworkImage';
import UserItem from '@/components/UserItem';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetCircleQuery } from '@/lib/hooks';
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Pressable, ScrollView } from 'react-native-gesture-handler';

export default function Manage() {
  const navigation = useNavigation();
  const circleQuery = useGetCircleQuery();
  const { displayBottomSheet, dismissBottomSheetModal } = useBottomSheetModal();

  useEffect(() => {
    if (circleQuery.data) {
      navigation.setOptions({
        title: circleQuery.data.title,
      });
    }
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <NetworkImage
          source={circleQuery.data?.headerPath}
          placeholder={Placeholder}
          style={{
            height: 186,
            width: Dimensions.get('window').width - 40,
            borderRadius: 32,
            marginHorizontal: 20,
            marginVertical: Spacings.xl,
          }}
        />

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
              {circleQuery.data?.contributors.length}
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
          {circleQuery.data?.contributors.map((x) => (
            <UserItem
              key={x.id}
              text={x.firstName}
              imageSource={x.avatarPath}
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
          {circleQuery.data?.recipients.map((x) => (
            <UserItem
              key={x.id}
              text={x.firstName}
              imageSource={x.avatarPath}
              onPress={() => router.push('/circle/recipients/edit')}
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
        <View
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
