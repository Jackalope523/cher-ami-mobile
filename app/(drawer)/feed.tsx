import MenuIcon from '@/assets/icons/kebab-fill.svg';
import PlusIcon from '@/assets/icons/plus-white.svg';
import Button, { ButtonType } from '@/components/Button';
import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { useCurrentIssueQuery, useUserCircleQuery } from '@/lib/hooks';
import { Image } from 'expo-image';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';

import CameraImage from '@/assets/images/camera.png';
import PlaceholderImage from '@/assets/images/placeholder.jpg';
import PostCounter from '@/components/PostCounter';
import { textStyles } from '@/constants/TextStyles';
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Pressable } from 'react-native-gesture-handler';

export default function Feed() {
  const navigation = useNavigation();
  const circleQuery = useUserCircleQuery();
  const currentIssueQuery = useCurrentIssueQuery(
    circleQuery.isSuccess && circleQuery.data !== null,
  );

  function handleCreatePost() {
    router.push('/post/create');
  }

  useEffect(() => {
    if (circleQuery.data) {
      navigation.setOptions({
        title: circleQuery.data.title,
      });
    }
  }, [circleQuery.data, navigation]);

  function renderIssueHeader() {
    return (
      <View>
        <View style={styles.issueStateContainer}>
          <View style={styles.issueStateInfo}>
            <Text style={textStyles.labelLarge}>Issue 2</Text>
            <Text
              style={[
                textStyles.captionMedium,
                {
                  textAlign: 'right',
                },
              ]}>
              August 2025
            </Text>
          </View>
          <View
            style={{
              paddingBottom: Spacings.md,
              alignItems: 'center',
            }}>
            <View
              style={{
                paddingHorizontal: Spacings.mdsm,
                paddingVertical: Spacings.xs,
                borderRadius: borderRadius.sm,
                backgroundColor: '#F4F1EA',
              }}>
              <Text
                style={[
                  textStyles.labelSmall,
                  {
                    textAlign: 'center',
                  },
                ]}>
                Last Month
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function renderPost() {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            paddingVertical: Spacings.md,
            columnGap: Spacings.sm,
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              columnGap: Spacings.md,
              alignItems: 'center',
            }}>
            <Image
              source={PlaceholderImage}
              style={{ height: 48, width: 48, borderRadius: 24 }}
            />
            <View>
              <Text style={textStyles.labelLarge}>Kimi Neumann</Text>
              <Text style={textStyles.captionMedium}>
                Photo taken on Aug 29th, 2025
              </Text>
            </View>
          </View>
          <View style={{ padding: Spacings.mdsm }}>
            <MenuIcon width={24} height={24} />
          </View>
        </View>

        <Image
          source={PlaceholderImage}
          style={{
            height: Dimensions.get('window').width - 40,
            width: Dimensions.get('window').width - 40,
            borderRadius: 32,
            marginHorizontal: 20,
            marginBottom: Spacings.lg,
          }}
        />

        <View style={{ paddingHorizontal: 20, marginBottom: Spacings.md }}>
          <Text style={textStyles.body}>
            Went on a long hike with mike and Lauren to set up a tripod and
            snapped this amazing pic by the lake.
          </Text>
        </View>
        <View
          style={{
            borderWidth: 1.5 / 2,
            borderColor: '#DEDBD5',
            marginVertical: Spacings.md,
          }}
        />
      </View>
    );
  }

  if (circleQuery.isError || currentIssueQuery.isError) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={GlobalStyles.bodyTextOne}>Error</Text>
      </SafeAreaView>
    );
  }

  if (
    !(
      circleQuery.isSuccess &&
      (currentIssueQuery.isSuccess || !currentIssueQuery.isEnabled)
    )
  ) {
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
    <View style={styles.container}>
      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false}>
        <PostCounter numberOfPosts={5} />
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#9AD47C',
            borderRadius: borderRadius.lg,
            marginHorizontal: 20,
            marginBottom: Spacings.md,
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: Spacings.sm,
            columnGap: Spacings.mdsm,
            alignItems: 'center',
          }}>
          <Text
            style={[
              textStyles.heading5,
              {
                flexShrink: 1,
              },
            ]}>
            {"Be the first to upload to this month's issue!"}
          </Text>
          <Image source={CameraImage} style={{ height: 64, width: 64 }} />
        </View>

        {renderIssueHeader()}
        {renderPost()}
        {renderPost()}
        {renderPost()}
        {renderPost()}
        {renderIssueHeader()}
        {renderPost()}
        {renderPost()}
        {renderPost()}
        {renderPost()}
      </ScrollView>

      <Pressable
        onPress={handleCreatePost}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: '#C15F3C',
          borderRadius: 20,
          borderWidth: 2,
          padding: 24,
          borderColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <PlusIcon height={24} width={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
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

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: Spacings.md,
  },

  menuIcon: {
    padding: Spacings.md,
  },

  circleTitle: {
    alignItems: 'center',
    paddingVertical: Spacings.md,
  },

  issueStateContainer: {
    paddingHorizontal: 20,
    rowGap: Spacings.sm,
  },

  issueStateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
