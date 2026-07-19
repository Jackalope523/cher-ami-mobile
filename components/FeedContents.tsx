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
import {
  useFeedPostsInfiniteQuery,
  useGetCircleQuery,
  useGetPaymentMethodQuery,
  useGetSelfQuery,
  useUploadImageMutation,
} from '@/lib/hooks';
import { UploadImageDetailsRequest } from '@/lib/requests';
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

export default function FeedContents() {
  const { data, status, fetchNextPage } = useFeedPostsInfiniteQuery();
  const circleQuery = useGetCircleQuery();
  const userQuery = useGetSelfQuery();
  const getPaymentMethodQuery = useGetPaymentMethodQuery();
  const showToastMessage = useToastMessage();
  const [hideBanner, setHideBanner] = useState(false);
  const pickImageAsync = useImagePicker();
  const uploadImageMutation = useUploadImageMutation();
  const variables = useMutationState<UploadImageDetailsRequest>({
    filters: { mutationKey: ['ImageDetails'], status: 'pending' },
    select: (mutation) => mutation.state.variables as UploadImageDetailsRequest,
  });

  function handleAddRecipient() {
    if (getPaymentMethodQuery.data || userQuery.data?.isBillingExempt) {
      router.push('/circle/recipients/add');
    } else {
      router.push('/billing/add');
    }
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
            imageUri: x,
          });
          router.push({
            pathname: '/post/size',
            params: {
              issueTitle: data?.pages[0].issueTitle,
              issueCloseDate: data?.pages[0].issueCloseDate
                ? new Date(data.pages[0].issueCloseDate).toISOString()
                : undefined,
              imageUri: x,
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

  function renderIssueHeader(
    id: number | null,
    title: string | null,
    date: Date | null,
    postCount: number | null,
  ) {
    if (!title || !date) return <View />;

    if (data?.pages[0].id === id) {
      if (postCount === 0) {
        return renderEmptyComponent(true);
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
        {postCount === 0 && renderEmptyComponent(false)}
      </View>
    );
  }

  function renderListHeader() {
    return (
      <View>
        <PostCounter
          issueTitle={data?.pages[0].issueTitle}
          issueCloseDate={data?.pages[0].issueCloseDate}
        />
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
                padding: Spacings.lgmd,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginBottom: 56,
                }}>
                <Pressable onPress={() => setHideBanner(true)}>
                  <XIcon height={24} width={24} color="#868581" />
                </Pressable>
              </View>

              <Text
                style={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: 20,
                  color: '#242832',
                  marginBottom: Spacings.sm,
                }}>
                Who is this magazine for?
              </Text>
              <Text style={[textStyles.body, { marginBottom: Spacings.lg }]}>
                Add the name and address of the person you&apos;d like to
                surprise — we&apos;ll mail them this month&apos;s magazine at
                the end of the month.
              </Text>

              <PopPressable onPress={handleAddRecipient} style={styles.button}>
                <Text style={textStyles.buttonTextWhite}>Add a recipient</Text>
              </PopPressable>
            </ImageBackground>
          )}
          {data?.pages[0].posts.length === 0 && (
            <View style={styles.toast}>
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
            </View>
          )}
          {variables[0] && (
            <Post
              loading={variables[0] !== undefined}
              post={{
                id: -1,
                authorId: userQuery.data?.id ?? 0,
                photoDate: new Date(),
                photoUrl: variables[0].imageUri,
                photoPath: '',
                imageWidth: variables[0].width,
                imageHeight: variables[0].height,
                caption: variables[0].caption,
              }}
            />
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

  issueStateContainer: {
    backgroundColor: '#FCFBF8',
    paddingHorizontal: 20,
    rowGap: Spacings.sm,
  },

  issueStateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
