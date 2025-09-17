import { useAPI } from '@/components/APIProvider';
import NetworkImage from '@/components/NetworkImage';
import { borderRadius } from '@/constants/Borders';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { useContributorsQuery, useRecipientsQuery } from '@/lib/hooks';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

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
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={GlobalStyles.headingTextTwo}>Contributors</Text>
      </View>
      {renderContributors()}
      <View style={styles.section}>
        <Text style={GlobalStyles.headingTextTwo}>Recipients</Text>
        <Pressable onPress={() => router.push('/circle/recipients/add')}>
          <Text style={GlobalStyles.bodyTextOne}>Add+</Text>
        </Pressable>
      </View>
      {renderRecipients()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacings.lg,
    rowGap: Spacings.lg,
  },

  contributorContainer: {
    flexDirection: 'row',
    columnGap: Spacings.mdsm,
    alignItems: 'center',
  },

  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  image: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
  },
});
