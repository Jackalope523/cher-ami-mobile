import MenuIcon from '@/assets/icons/ellipsis-vertical.svg';
import UserIcon from '@/assets/icons/user.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetSelfQuery, useGetUserQuery } from '@/lib/hooks';
import { FeedPost } from '@/lib/responses';
import { formatPhotoDate } from '@/lib/utility';
import { router } from 'expo-router';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import DeletePostContents from './DeletePostContents';
import { useDialogueModal } from './modals/DialogueModalProvider';
import NetworkImage from './NetworkImage';
import PopPressable from './PopPressable';
import ReportPostContents from './ReportPostContents';

type PostProps = {
  post: FeedPost;
};

export default function Post({ post }: PostProps) {
  const { displayDialogue } = useDialogueModal();
  const userQuery = useGetUserQuery(post.authorId);
  const selfQuery = useGetSelfQuery();

  function handlePostSettings(postId: number) {
    if (post.authorId === selfQuery.data?.id) {
      displayDialogue(<DeletePostContents postId={postId} />);
    } else {
      displayDialogue(<ReportPostContents postId={postId} />);
    }
  }

  if (!userQuery.data || !selfQuery.data) {
    return null;
  }

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
          <PopPressable
            onPress={() =>
              router.push({
                pathname: '/profile/[id]',
                params: { id: post.authorId },
              })
            }>
            {userQuery.data.avatarPath ? (
              <NetworkImage
                style={{ height: 48, width: 48, borderRadius: 24 }}
                source={
                  userQuery.data.avatarPath +
                  `?timestamp=${userQuery.data.avatarTimestamp}`
                }
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
          <View>
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
            <Text style={textStyles.captionMedium}>
              {formatPhotoDate(post.photoDate)}
            </Text>
          </View>
        </View>

        <PopPressable
          onPress={() => handlePostSettings(post.id)}
          style={{ padding: Spacings.mdsm }}>
          <MenuIcon width={24} height={24} />
        </PopPressable>
      </View>

      <View style={{ marginBottom: Spacings.md }}>
        <NetworkImage
          source={post.photoPath}
          style={{
            width: Dimensions.get('window').width - 40,
            aspectRatio: 744 / 496,
            borderRadius: 32,
            marginHorizontal: 20,
          }}
        />

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
