import PlusIcon from '@/assets/icons/plus.svg';
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
import { useFeedPostsInfiniteQuery } from '@/lib/hooks';
import { useMutationState } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import Error from './Error';
import { useImagePicker } from './ImagePickerProvider';
import Loading from './Loading';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';

export default function FeedContents() {
  const { data, status, fetchNextPage } = useFeedPostsInfiniteQuery();
  const showToastMessage = useToastMessage();
  const pickImageAsync = useImagePicker();
  const variables = useMutationState({
    filters: { mutationKey: ['AddPost'], status: 'pending' },
    select: (mutation) => mutation.state.variables,
  });

  function handleCreatePost() {
    if (data?.pages[0].posts.length === 20) {
      showToastMessage(
        "This month's issue is complete!",
        ToastMessageType.Informational,
      );
    } else {
      // router.push('/post/create');
      router.push('/post/pickSize');
    }
  }

  useEffect(() => {
    if (data) {
      for (const page of data.pages) {
        if (page.posts.length >= 2) return;
      }
      fetchNextPage();
    }
  }, [data, fetchNextPage]);

  function mapDateToText(date: Date): string {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just Now';
    if (diffMinutes < 60) return `${diffMinutes} Minutes Ago`;
    if (diffHours < 24) return `${diffHours} Hours Ago`;

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} Days Ago`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return 'Last Week';
    if (diffWeeks < 4) return `${diffWeeks} Weeks Ago`;

    let diffMonths =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());
    if (diffMonths === 0) return 'This Month';
    if (diffMonths === 1) return 'Last Month';
    if (diffMonths < 12) return `${diffMonths} Months Ago`;

    const diffYears = now.getFullYear() - date.getFullYear();
    if (diffYears === 1) return 'Last Year';
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
              style={{
                aspectRatio: 160 / 223,
                width: '100%',
                maxHeight: 223,
                maxWidth: 160,
              }}
            />
          </View>

          <Text style={[textStyles.fancyText, { marginBottom: Spacings.xxl }]}>
            {'Nothing to see here :('}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Image
            source={Mouse}
            style={{
              aspectRatio: 71 / 73,
              width: '100%',
              maxHeight: 73,
              maxWidth: 71,
            }}
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
                timeZone: 'UTC',
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
        <PostCounter issueTitle={data?.pages[0].issueTitle} />
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
        {/* {variables.length >= 1 && (
          <>
            <Post post={variables[0]} />
            <View
              style={{
                paddingVertical: Spacings.md,
                justifyContent: 'center',
              }}>
              <Loading />
            </View>
          </>
        )} */}
      </View>
    );
  }

  function handleOnEndReached() {
    fetchNextPage();
  }

  if (status === 'error') {
    return <Error />;
  }

  if (status === 'pending') {
    return <Loading />;
  }

  if (!data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SectionList
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        sections={
          data.pages.map((page) => ({
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
          onPress={handleCreatePost}>
          <PlusIcon height={24} width={24} color={'#FFFFFF'} />
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
    backgroundColor: '#FCFBF8',
    paddingHorizontal: 20,
    rowGap: Spacings.sm,
  },

  issueStateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
