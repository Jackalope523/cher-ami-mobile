import MenuIcon from '@/assets/icons/ellipsis-vertical.svg';
import { Colors } from '@/constants/Colors';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetSelfQuery, useGetUserQuery } from '@/lib/hooks';
import { FeedPost } from '@/lib/responses';
import { formatPhotoDate } from '@/lib/utility';
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
  const { displayDialogue, dismissDialogue } = useDialogueModal();
  const userQuery = useGetUserQuery(post.authorId);
  const selfQuery = useGetSelfQuery();

  function handlePostSettings(postId: number) {
    if (post.authorId === selfQuery.data?.id) {
      displayDialogue(
        <DeletePostContents dismissModal={dismissDialogue} postId={postId} />,
      );
    } else {
      displayDialogue(
        <ReportPostContents dismissModal={dismissDialogue} postId={postId} />,
      );
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
          <NetworkImage
            source={
              userQuery.data.avatarPath +
              `?timestamp=${userQuery.data.avatarTimestamp}`
            }
            style={{ height: 48, width: 48, borderRadius: 24 }}
          />
          <View>
            <Text
              style={
                textStyles.labelLargeBlack
              }>{`${userQuery.data.firstName} ${userQuery.data.lastName}`}</Text>
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
            height: 259,
            width: Dimensions.get('window').width - 40,
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
    backgroundColor: Colors.charcoal100,
    height: Spacings.sm,
    borderRadius: Spacings.sm,
  },
});
