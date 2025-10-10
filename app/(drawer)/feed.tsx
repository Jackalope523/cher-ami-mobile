import MenuIcon from '@/assets/icons/kebab-fill.svg';
import PlusIcon from '@/assets/icons/plus-white.svg';
import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { Spacings } from '@/constants/Spacings';
import { useFeedPostsInfiniteQuery, useGetCircleQuery } from '@/lib/hooks';
import { Image } from 'expo-image';
import { Dimensions, SectionList, StyleSheet, Text, View } from 'react-native';
import 'react-native-get-random-values';

import CameraImage from '@/assets/images/camera.png';
import NetworkImage from '@/components/NetworkImage';
import PostCounter from '@/components/PostCounter';
import { textStyles } from '@/constants/TextStyles';
import { FeedPost } from '@/lib/responses';
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Pressable } from 'react-native-gesture-handler';

export default function Feed() {
  const navigation = useNavigation();
  const circleQuery = useGetCircleQuery();

  const { data, error, status, fetchNextPage } = useFeedPostsInfiniteQuery();

  function handleCreatePost() {
    router.push({
      pathname: '/post/create',
      params: {
        issueTitle: data?.pages[0].issueTitle,
        postCount: data?.pages[0].posts.length,
      },
    });
  }

  useEffect(() => {
    if (circleQuery.data) {
      navigation.setOptions({
        title: circleQuery.data.title,
      });
    }
  }, [circleQuery.data, navigation]);

  function renderIssueHeader(title: string | null, date: Date | null) {
    if (title === null || date === null) return <View />;

    return (
      <View style={styles.issueStateContainer}>
        <View style={styles.issueStateInfo}>
          <Text style={textStyles.labelLargeBlack}>{title}</Text>
          <Text
            style={[
              textStyles.captionMedium,
              {
                textAlign: 'right',
              },
            ]}>
            {date.toLocaleString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
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
    );
  }

  function renderPost(post: FeedPost) {
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
            <NetworkImage
              source={post.authorAvatarPath}
              style={{ height: 48, width: 48, borderRadius: 24 }}
            />
            <View>
              <Text style={textStyles.labelLargeBlack}>{post.authorName}</Text>
              <Text style={textStyles.captionMedium}>
                Photo taken on Aug {post.photoDate.getDate()},{' '}
                {post.photoDate.getFullYear()}
              </Text>
            </View>
          </View>
          <View style={{ padding: Spacings.mdsm }}>
            <MenuIcon width={24} height={24} />
          </View>
        </View>

        <NetworkImage
          source={post.photoPath}
          style={{
            height: Dimensions.get('window').width - 40,
            width: Dimensions.get('window').width - 40,
            borderRadius: 32,
            marginHorizontal: 20,
            marginBottom: Spacings.lg,
          }}
        />

        <View style={{ paddingHorizontal: 20, marginBottom: Spacings.md }}>
          <Text style={textStyles.body}>{post.caption}</Text>
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

  function renderListHeader() {
    return (
      <View>
        <PostCounter
          numberOfPosts={data?.pages[0].posts.length}
          issueTitle={data?.pages[0].issueTitle}
        />
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
      </View>
    );
  }

  function renderListFooter() {
    return <View></View>;
  }

  function handleOnEndReached() {
    fetchNextPage();
  }

  if (status === 'pending') {
    return <Text>Loading</Text>;
  }

  return (
    <View style={styles.container}>
      <SectionList
        overScrollMode="never"
        sections={
          data?.pages.map((page) => ({
            title: page.issueTitle,
            date: page.issueDate,
            data: page.posts,
          })) ?? []
        }
        renderItem={({ item }) => renderPost(item)}
        renderSectionHeader={({ section }) =>
          renderIssueHeader(section.title, section.date)
        }
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        onEndReached={handleOnEndReached}
        ListEmptyComponent={() => (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>No posts available.</Text>
          </View>
        )}
      />

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
