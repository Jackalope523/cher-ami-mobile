import MenuIcon from '@/assets/icons/ellipsis-vertical.svg';
import UserIcon from '@/assets/icons/user.svg';
import Placeholder from '@/assets/images/placeholder.png';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetSelfQuery, useGetUserQuery } from '@/lib/hooks';
import { FeedPost } from '@/lib/responses';
import { formatPhotoDate } from '@/lib/utility';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import AnimatedLoadingIcon from './AnimatedLoadingIcon';
import { useAuth } from './AuthProvider';
import DeletePostContents from './DeletePostContents';
import PhotoViewer from './PhotoViewer';
import PopPressable from './PopPressable';
import PostOptionsContents from './PostOptionsContents';
import ReportPostContents from './ReportPostContents';
import { useDialogueModal } from './modals/DialogueModalProvider';

type PostProps = {
  post: FeedPost;
  loading?: boolean;
  /** Whether the post belongs to a magazine that is still open for changes. */
  editable?: boolean;
  issueStartDate?: Date | null;
};

export default function Post({
  post,
  loading = false,
  editable = false,
  issueStartDate = null,
}: PostProps) {
  const { displayDialogue } = useDialogueModal();
  const [viewing, setViewing] = useState(false);
  const userQuery = useGetUserQuery(post.authorId);
  const selfQuery = useGetSelfQuery();
  const { getToken } = useAuth();

  function handlePostSettings(postId: number) {
    if (post.authorId === selfQuery.data?.id) {
      if (editable) {
        displayDialogue(
          <PostOptionsContents post={post} issueStartDate={issueStartDate} />,
        );
      } else {
        displayDialogue(<DeletePostContents postId={postId} />);
      }
    } else {
      displayDialogue(<ReportPostContents postId={postId} />);
    }
  }

  if (!userQuery.data || !selfQuery.data) {
    return null;
  }

  const aspectRatio =
    (post.imageWidth !== undefined ? post.imageWidth : 372) /
    (post.imageHeight !== undefined ? post.imageHeight : 259);

  const openViewer = Gesture.Tap()
    .maxDistance(10)
    .onEnd(() => {
      if (!loading) scheduleOnRN(setViewing, true);
    });

  return (
    <View>
      {viewing && (
        <PhotoViewer
          uri={post.photoUrl}
          token={getToken()}
          aspectRatio={aspectRatio}
          onClose={() => setViewing(false)}
        />
      )}
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
          <PopPressable
            onPress={() =>
              router.push({
                pathname: '/profile/[id]',
                params: { id: post.authorId },
              })
            }>
            {userQuery.data.avatarUrl ? (
              <Image
                style={{ height: 48, width: 48, borderRadius: 24 }}
                placeholder={Placeholder}
                placeholderContentFit="fill"
                source={{
                  headers: {
                    Authorization: `Bearer ${getToken()}`,
                  },
                  uri: userQuery.data.avatarUrl,
                }}
              />
            ) : (
              <View
                style={{
                  height: 48,
                  width: 48,
                  borderRadius: 24,
                  backgroundColor: '#F4F1EA',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <UserIcon height={24} width={24} color={'#868581'} />
              </View>
            )}
          </PopPressable>
          <View style={{ flexShrink: 1 }}>
            <PopPressable
              onPress={() =>
                router.push({
                  pathname: '/profile/[id]',
                  params: { id: post.authorId },
                })
              }>
              <Text
                style={
                  textStyles.labelLargeBlack
                }>{`${userQuery.data.firstName} ${userQuery.data.lastName}`}</Text>
            </PopPressable>
            <Text style={[textStyles.captionMedium, { color: '#868581' }]}>
              {formatPhotoDate(post.photoDate)}
            </Text>
          </View>
        </View>

        {!loading ? (
          <PopPressable
            onPress={() => handlePostSettings(post.id)}
            style={{ padding: Spacings.mdsm }}>
            <MenuIcon width={24} height={24} />
          </PopPressable>
        ) : (
          <AnimatedLoadingIcon height={24} width={24} />
        )}
      </View>

      <View style={{ marginBottom: Spacings.md }}>
        {/* A tap with a movement threshold rather than a Pressable: a press
            has no distance limit, so starting a scroll on the photo and not
            dragging far still counted as a tap and opened the viewer. */}
        <GestureDetector gesture={openViewer}>
          <Image
            style={{
              width: Dimensions.get('window').width - 40,
              aspectRatio,
              borderRadius: 32,
              marginHorizontal: 20,
            }}
            placeholder={Placeholder}
            placeholderContentFit="fill"
            source={{
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
              uri: post.photoUrl,
            }}
          />
        </GestureDetector>

        {post.caption && (
          <View style={{ paddingHorizontal: 20, marginTop: Spacings.lg }}>
            <Text style={textStyles.body}>{post.caption}</Text>
          </View>
        )}
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

const styles = StyleSheet.create({
  issueStateContainer: {
    paddingHorizontal: 20,
    rowGap: Spacings.sm,
    paddingBottom: Spacings.md,
  },
  issueStateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  loadingBar: {
    backgroundColor: '#C4C6CC',
    height: Spacings.sm,
    borderRadius: Spacings.sm,
  },
});
