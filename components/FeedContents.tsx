import XIcon from '@/assets/icons/circle-x.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import CameraImage from '@/assets/images/camera.png';
import Hedgehog from '@/assets/images/hedgehog.png';
import MailboxImage from '@/assets/images/mailbox.png';
import Mouse from '@/assets/images/mouse.png';

import bannerImage from '@/assets/images/banner.png';
import PopPressable from '@/components/PopPressable';
import Post from '@/components/Post';
import PostCounter from '@/components/PostCounter';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { IssueStatus } from '@/lib/enums';
import {
  useFeedPostsInfiniteQuery,
  useGetCircleQuery,
  useGetSelfQuery,
  useUploadImageMutation,
} from '@/lib/hooks';
import { UploadImageDetailsRequest } from '@/lib/requests';
import { FeedPost } from '@/lib/responses';
import { defaultPhotoDate } from '@/lib/utility';
import { useMutationState } from '@tanstack/react-query';
import { Image, ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Error from './Error';
import { useImagePicker } from './ImagePickerProvider';
import Loading from './Loading';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';

/** Stand-in id for the photo currently uploading, which has no server id yet. */
const PENDING_POST_ID = -1;

export default function FeedContents() {
  const { data, status, fetchNextPage } = useFeedPostsInfiniteQuery();
  const circleQuery = useGetCircleQuery();
  const userQuery = useGetSelfQuery();
  const showToastMessage = useToastMessage();
  const [hideBanner, setHideBanner] = useState(false);
  const pickImageAsync = useImagePicker();
  const uploadImageMutation = useUploadImageMutation();
  const variables = useMutationState<UploadImageDetailsRequest>({
    filters: { mutationKey: ['ImageDetails'], status: 'pending' },
    select: (mutation) => mutation.state.variables as UploadImageDetailsRequest,
  });

  const pendingPost: FeedPost | null = variables[0]
    ? {
        id: PENDING_POST_ID,
        authorId: userQuery.data?.id ?? 0,
        photoDate: variables[0].photoDate
          ? new Date(variables[0].photoDate)
          : new Date(),
        photoUrl: variables[0].imageUri,
        photoPath: '',
        imageWidth: variables[0].width,
        imageHeight: variables[0].height,
        caption: variables[0].caption,
      }
    : null;

  function handleAddRecipient() {
    router.push('/circle/recipients/add');
  }

  async function handleCreatePost() {
    if (data?.pages[0].posts.length === 20) {
      showToastMessage(
        "This month's magazine is full!",
        ToastMessageType.Informational,
      );
    } else {
      const uploadId = uuidv4();

      pickImageAsync().then(async (x) => {
        if (x !== null) {
          uploadImageMutation.mutate({
            uploadId,
            imageUri: x.uri,
          });

          const issueStartDate = data?.pages[0].issueDate
            ? new Date(data.pages[0].issueDate)
            : null;

          router.push({
            pathname: '/post/size',
            params: {
              issueTitle: data?.pages[0].issueTitle,
              issueCloseDate: data?.pages[0].issueCloseDate
                ? new Date(data.pages[0].issueCloseDate).toISOString()
                : undefined,
              issueStartDate: issueStartDate?.toISOString(),
              photoDate: defaultPhotoDate(
                x.takenAt,
                issueStartDate,
              ).toISOString(),
              imageUri: x.uri,
              uploadId,
            },
          });
        }
      });
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

  function renderEmptyComponent(isCurrentIssue: boolean = true) {
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

          <Text style={textStyles.fancyText}>{'No photos yet'}</Text>
          {isCurrentIssue && (
            <Text
              style={[
                textStyles.body,
                {
                  textAlign: 'center',
                  color: '#868581',
                  marginBottom: Spacings.xxl,
                },
              ]}>
              Tap the + button to add the first one!
            </Text>
          )}
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

  /**
   * Each issue's header pins while you scroll that issue, and the next one
   * pushes it up and takes its place.
   *
   * The current issue keeps the post counter's shape — title on the left with
   * the progress bar beneath it, "x% full" and the chevron on the right — so
   * its close date has no room and is left out. Past issues are closed, so they
   * get a single compact row with how long ago they went out instead. Both are
   * opaque: they sit over the feed while pinned.
   */
  function renderIssueHeader(
    id: number | null,
    title: string | null,
    date: Date | null,
  ) {
    if (!title || !date) return null;

    if (id === data?.pages[0].id) {
      return (
        <View style={styles.currentIssueHeader}>
          <PostCounter
            issueTitle={title}
            issueCloseDate={data?.pages[0].issueCloseDate}
          />
        </View>
      );
    }

    return (
      <View style={styles.issueHeader}>
        <Text style={textStyles.labelLargeBlack}>{title}</Text>
        <View style={styles.issueHeaderChip}>
          <Text style={textStyles.labelSmall}>{mapDateToText(date)}</Text>
        </View>
      </View>
    );
  }

  function renderListHeader() {
    return (
      <View>
        {/* The post counter lives in the pinned issue header, not here. */}
        <View style={{ rowGap: Spacings.lg }}>
          {circleQuery.data?.recipients.length === 0 && !hideBanner && (
            <ImageBackground
              source={bannerImage}
              contentFit="cover"
              imageStyle={{
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: '#DEDBD5',
              }}
              style={{
                marginHorizontal: Spacings.lgmd,
                padding: Spacings.md,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  columnGap: Spacings.sm,
                  marginBottom: Spacings.xs,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: 18,
                    color: '#242832',
                    flexShrink: 1,
                  }}>
                  Who is this magazine for?
                </Text>
                <Pressable
                  onPress={() => setHideBanner(true)}
                  hitSlop={Spacings.sm}>
                  <XIcon height={24} width={24} color="#868581" />
                </Pressable>
              </View>
              <Text style={[textStyles.body, { marginBottom: Spacings.md }]}>
                Add the person who should get it in the mail.
              </Text>

              <PopPressable onPress={handleAddRecipient} style={styles.button}>
                <Text style={textStyles.buttonTextWhite}>Add a recipient</Text>
              </PopPressable>
            </ImageBackground>
          )}
          {data?.pages[0].posts.length === 0 && (
            <PopPressable onPress={handleCreatePost} style={styles.toast}>
              <Text
                style={[
                  textStyles.heading5,
                  {
                    flexShrink: 1,
                  },
                ]}>
                {"Be the first to add a photo to this month's magazine!"}
              </Text>
              <Image source={CameraImage} style={{ height: 64, width: 64 }} />
            </PopPressable>
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
                {"This month's magazine is full!"}
              </Text>
              <Image source={MailboxImage} style={{ height: 64, width: 64 }} />
            </View>
          )}
        </View>
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
        stickySectionHeadersEnabled
        sections={
          data.pages.map((page, index) => ({
            id: page.id,
            title: page.issueTitle,
            date: page.issueDate,
            status: page.status,
            // The photo being uploaded belongs under the current issue's
            // header, not above it.
            data:
              index === 0 && pendingPost ? [pendingPost, ...page.posts] : page.posts,
          })) ?? []
        }
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, section }) => (
          <Post
            post={item}
            loading={item.id === PENDING_POST_ID}
            editable={
              item.id !== PENDING_POST_ID &&
              section.status === IssueStatus.Drafting
            }
            issueStartDate={section.date}
          />
        )}
        renderSectionHeader={({ section }) =>
          renderIssueHeader(section.id, section.title, section.date)
        }
        // The empty-state art belongs to the issue but must scroll with it —
        // section footers are never pinned, unlike headers.
        renderSectionFooter={({ section }) =>
          // A page past the last issue comes back with everything null and no
          // posts — it isn't a real issue, so it gets no empty state.
          section.id !== null && section.data.length === 0
            ? renderEmptyComponent(section.id === data.pages[0].id)
            : null
        }
        ListHeaderComponent={renderListHeader()}
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

  currentIssueHeader: {
    // Opaque: this sits over the feed while pinned.
    backgroundColor: '#FCFBF8',
    paddingTop: Spacings.sm,
    borderBottomWidth: 1.5 / 2,
    borderBottomColor: '#DEDBD5',
  },

  issueHeader: {
    // Opaque: this sits over the feed while pinned.
    backgroundColor: '#FCFBF8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: Spacings.sm,
    columnGap: Spacings.sm,
    borderBottomWidth: 1.5 / 2,
    borderBottomColor: '#DEDBD5',
  },

  issueHeaderChip: {
    paddingHorizontal: Spacings.mdsm,
    paddingVertical: Spacings.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F4F1EA',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    marginBottom: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    paddingVertical: Spacings.mdsm,
    paddingHorizontal: Spacings.md,
  },
});
