import CreditCardIcon from '@/assets/icons/credit-card-white.svg';
import PlusIcon from '@/assets/icons/plus-orange.svg';
import SettingsIcon from '@/assets/icons/settings-white.svg';
import UserIcon from '@/assets/icons/user-round.svg';
import PlaceholderImage from '@/assets/images/placeholder.jpg';
import { useAPI } from '@/components/APIProvider';
import UserItem from '@/components/UserItem';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { useContributorsQuery, useRecipientsQuery } from '@/lib/hooks';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Pressable, ScrollView } from 'react-native-gesture-handler';

export default function Manage() {
  const api = useAPI();
  const contributorsQuery = useContributorsQuery();
  const recipientsQuery = useRecipientsQuery();

  function renderContributors() {
    if (recipientsQuery.isLoading) {
      return <Text style={GlobalStyles.bodyTextOne}>Loading...</Text>;
    }
    if (recipientsQuery.isError) {
      return <Text style={GlobalStyles.bodyTextOne}>Error</Text>;
    }
    if (recipientsQuery.isSuccess) {
      return contributorsQuery.data?.map((x) => (
        <UserItem
          key={x.id}
          text={x.firstName}
          imageSource="`${api.defaults.baseURL}${x.avatarPath}`"
        />
      ));
    }
  }

  function renderRecipients() {
    if (recipientsQuery.isLoading) {
      return <Text style={GlobalStyles.bodyTextOne}>Loading...</Text>;
    }
    if (recipientsQuery.isError) {
      return <Text style={GlobalStyles.bodyTextOne}>Error</Text>;
    }
    if (recipientsQuery.isSuccess) {
      return contributorsQuery.data?.map((x) => (
        <UserItem
          key={x.id}
          text={x.firstName}
          imageSource="`${api.defaults.baseURL}${x.avatarPath}`"
          onPress={() => router.push('/circle/recipients/edit')}
        />
      ));
    }
  }

  return (
    <View>
      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false}>
        <Image
          source={PlaceholderImage}
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
          <Text style={{ fontSize: 24, fontWeight: 500, color: '#242832' }}>
            Members
          </Text>
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
            <Text style={{ color: '#868581', fontSize: 16, fontWeight: 600 }}>
              1
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => {}}
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
          <Text style={{ color: '#B05637', fontWeight: 500, fontSize: 16 }}>
            Invite to Circle
          </Text>
          <PlusIcon height={24} width={24} />
        </Pressable>

        <View
          style={{
            rowGap: Spacings.lg,
            marginVertical: Spacings.lg,
            marginHorizontal: 20,
          }}>
          {renderContributors()}
          {renderContributors()}
          {renderContributors()}
          {renderContributors()}
          {renderContributors()}
          {renderContributors()}
          {renderContributors()}
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            paddingVertical: Spacings.sm,
            alignItems: 'center',
            marginBottom: Spacings.md,
          }}>
          <Text style={{ fontSize: 24, fontWeight: 500, color: '#242832' }}>
            Recipients
          </Text>
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
          <Text style={{ color: '#B05637', fontWeight: 500, fontSize: 16 }}>
            Add Recipient
          </Text>
          <PlusIcon height={24} width={24} />
        </Pressable>

        <View
          style={{
            rowGap: Spacings.lg,
            marginVertical: Spacings.lg,
            marginHorizontal: 20,
          }}>
          {renderRecipients()}
          {renderRecipients()}
          {renderRecipients()}
          {renderRecipients()}
          {renderRecipients()}
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
          <Text style={{ color: '#FFFFFF', fontWeight: 500, fontSize: 16 }}>
            Manage Billing
          </Text>
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
          <Text style={{ color: '#FFFFFF', fontWeight: 500, fontSize: 16 }}>
            Circle Settings
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
