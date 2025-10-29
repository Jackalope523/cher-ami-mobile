import PlusIcon from '@/assets/icons/plus-white.svg';
import CameraImage from '@/assets/images/camera.png';
import Hedgehog from '@/assets/images/hedgehog.png';
import MailboxImage from '@/assets/images/mailbox.png';
import Mouse from '@/assets/images/mouse.png';

import PopPressable from '@/components/PopPressable';
import Post from '@/components/Post';
import PostCounter from '@/components/PostCounter';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useFeedPostsInfiniteQuery, useGetCircleQuery } from '@/lib/hooks';
import { Image } from 'expo-image';
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

export default function Feed() {
  const navigation = useNavigation();
  const circleQuery = useGetCircleQuery();
  const { data, status, fetchNextPage } = useFeedPostsInfiniteQuery();

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
    if (data) {
      for (const page of data.pages) {
        if (page.posts.length >= 2) return;
      }
      fetchNextPage();
    }
  }, [data, fetchNextPage]);

  useEffect(() => {
    navigation.setOptions({
      title: circleQuery.data?.title ?? '',
    });
  }, [circleQuery.data, navigation]);

  function mapDateToText(date: Date): string {
    const now = new Date();

    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Days
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';

    // Weeks
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 0) return 'This Week';
    if (diffWeeks === 1) return 'Last Week';

    // Months
    const diffMonths =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());
    if (diffMonths === 0) return 'This Month';
    if (diffMonths === 1) return 'Last Month';
    if (diffMonths === 2) return 'Two Months Ago';
    if (diffMonths === 3) return 'Three Months Ago';
    if (diffMonths === 4) return 'Four Months Ago';
    if (diffMonths === 5) return 'Five Months Ago';
    if (diffMonths === 6) return 'Six Months Ago';
    if (diffMonths === 7) return 'Seven Months Ago';
    if (diffMonths === 8) return 'Eight Months Ago';
    if (diffMonths === 9) return 'Nine Months Ago';
    if (diffMonths === 10) return 'Ten Months Ago';
    if (diffMonths === 11) return 'Eleven Months Ago';

    // Years
    const diffYears = now.getFullYear() - date.getFullYear();
    if (diffYears === 1) return 'Last Year';
    if (diffYears === 2) return 'Two Years Ago';
    if (diffYears === 3) return 'Three Years Ago';
    if (diffYears === 4) return 'Four Years Ago';
    if (diffYears === 5) return 'Five Years Ago';

    return `${diffYears} Years Ago`;
  }

  function renderEmptyComponent() {
    return (
      <View style={{ paddingVertical: 100 }}>
        <View
          style={{
            rowGap: Spacings.md,
            alignItems: 'center',
            marginHorizontal: 94,
          }}>
          <View
            style={{
              marginHorizontal: 126 - 94,
            }}>
            <Image
              source={Hedgehog}
              style={{ aspectRatio: 160 / 223, width: '100%' }}
            />
          </View>

          <Text style={[textStyles.fancyText, { marginBottom: Spacings.xxl }]}>
            {'Nothing to see here :('}
          </Text>
        </View>
        <View
          style={{
            marginLeft: 320,
            marginRight: 21,
          }}>
          <Image
            source={Mouse}
            style={{ aspectRatio: 71 / 73, width: '100%' }}
          />
        </View>
      </View>
    );
  }

  function renderIssueHeader(
    id: number | null,
    title: string | null,
    date: Date | null,
    postCount: number | null,
  ) {
    if (!title || !date) return <View />;

    if (data?.pages[0].id === id) {
      if (postCount === 0) {
        return renderEmptyComponent();
      } else {
        return <View />;
      }
    }

    return (
      <View>
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
                {mapDateToText(date)}
              </Text>
            </View>
          </View>
        </View>
        {postCount === 0 && renderEmptyComponent()}
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
        {data?.pages[0].posts.length === 0 && (
          <View style={styles.toast}>
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
        )}
        {data?.pages[0].posts.length === 20 && (
          <View style={styles.toast}>
            <Text
              style={[
                textStyles.heading5,
                {
                  flexShrink: 1,
                },
              ]}>
              {"This month's issue is full!"}
            </Text>
            <Image source={MailboxImage} style={{ height: 64, width: 64 }} />
          </View>
        )}
      </View>
    );
  }

  function handleOnEndReached() {
    fetchNextPage();
  }

  if (status === 'pending' && circleQuery.isPending) {
    return <Text>Loading</Text>;
  }

  return (
    <View style={styles.container}>
      <SectionList
        overScrollMode="never"
        sections={
          data?.pages.map((page) => ({
            id: page.id,
            title: page.issueTitle,
            date: page.issueDate,
            data: page.posts,
          })) ?? []
        }
        renderItem={({ item }) => <Post post={item} />}
        renderSectionHeader={({ section }) =>
          renderIssueHeader(
            section.id,
            section.title,
            section.date,
            section.data.length,
          )
        }
        ListHeaderComponent={renderListHeader}
        onEndReached={handleOnEndReached}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}>
        <PopPressable
          style={{
            backgroundColor: '#C15F3C',
            borderRadius: 20,
            borderWidth: 2,
            padding: 24,
            borderColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleCreatePost}
          disabled={data?.pages[0].posts.length === 20}>
          <PlusIcon height={24} width={24} />
        </PopPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
  },

  toast: {
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
