import UserIcon from '@/assets/icons/user-round.svg';
import PlaceholderImage from '@/assets/images/placeholder.jpg';
import { useAPI } from '@/components/APIProvider';
import NetworkImage from '@/components/NetworkImage';
import { borderRadius } from '@/constants/Borders';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { useContributorsQuery, useRecipientsQuery } from '@/lib/hooks';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

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
        <View key={x.id} style={styles.contributorContainer}>
          <NetworkImage
            source={`${api.defaults.baseURL}${x.avatarPath}`}
            style={styles.image}
            onError={(error) => {
              console.log('Failed to load image', error);
            }}
          />
          <Text style={GlobalStyles.bodyTextOne}>{x.firstName}</Text>
        </View>
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
      if (recipientsQuery.data.length === 0) {
        return (
          <Text style={GlobalStyles.bodyTextOne}>There are no recipients.</Text>
        );
      } else {
        return recipientsQuery.data?.map((x) => (
          <Text key={x.id} style={GlobalStyles.bodyTextOne}>
            {x.firstName}
          </Text>
        ));
      }
    }
  }

  return (
    <ScrollView>
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
          }}>
          <UserIcon height={24} width={24} />
          <Text>1</Text>
        </View>
      </View>

      <View
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
        <UserIcon height={24} width={24} />
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

      <View
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
        <UserIcon height={24} width={24} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contributorContainer: {
    flexDirection: 'row',
    columnGap: Spacings.mdsm,
    alignItems: 'center',
  },

  image: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
  },
});
