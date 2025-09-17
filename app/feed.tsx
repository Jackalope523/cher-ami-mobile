import Button, { ButtonType } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { useCurrentIssueQuery, useUserCircleQuery } from '@/lib/hooks';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Feed() {
  const circleQuery = useUserCircleQuery();
  const currentIssueQuery = useCurrentIssueQuery(circleQuery.data !== null);

  function handleCreatePost() {
    router.push('/post/create');
  }

  if (circleQuery.isError || currentIssueQuery.isError) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={GlobalStyles.bodyTextOne}>Error</Text>
      </SafeAreaView>
    );
  }

  if (!circleQuery.isSuccess || !currentIssueQuery.isSuccess) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={GlobalStyles.bodyTextOne}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (circleQuery.data === null) {
    return (
      <SafeAreaView style={styles.noCircleContainer}>
        <Text style={GlobalStyles.headingTextThree}>
          Join or create a circle to start uploading!
        </Text>
        <View style={styles.buttonsContainer}>
          <Button
            type={ButtonType.Function}
            text={'Create a Circle'}
            onPress={() => router.push('/circle/create')}
          />
          <Button
            type={ButtonType.Success}
            text={'Join a Circle'}
            onPress={() => router.push('/circle/join')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={GlobalStyles.headingTextThree}>THIS IS FEED</Text>

      <View style={styles.buttonsContainer}>
        <Button
          type={ButtonType.Success}
          text={'Make a Post'}
          onPress={handleCreatePost}
          disabled={!currentIssueQuery.isSuccess}
        />
        <Button
          type={ButtonType.Warning}
          text={'Manage Circle'}
          onPress={() => router.push('/circle/manage')}
          disabled={!currentIssueQuery.isSuccess}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canarySand,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: Spacings.sm,
  },

  noCircleContainer: {
    flex: 1,
    backgroundColor: Colors.canarySand,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: Spacings.sm,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.canarySand,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonsContainer: {
    rowGap: Spacings.sm,
    alignSelf: 'stretch',
    paddingHorizontal: Spacings.lg,
  },
});
