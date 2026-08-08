import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { FeedPost } from '@/lib/responses';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import DeletePostContents from './DeletePostContents';
import { useDialogueModal } from './modals/DialogueModalProvider';
import PopPressable from './PopPressable';

interface PostOptionsContentsProps {
  post: FeedPost;
  issueStartDate: Date | null;
}

export default function PostOptionsContents({
  post,
  issueStartDate,
}: PostOptionsContentsProps) {
  const { displayDialogue, dismissDialogue } = useDialogueModal();

  function handleEdit() {
    dismissDialogue();
    router.push({
      pathname: '/post/edit',
      params: {
        id: post.id,
        caption: post.caption ?? '',
        photoDate: new Date(post.photoDate).toISOString(),
        issueStartDate: issueStartDate
          ? new Date(issueStartDate).toISOString()
          : undefined,
        photoUrl: post.photoUrl,
        imageWidth: post.imageWidth,
        imageHeight: post.imageHeight,
      },
    });
  }

  function handleDelete() {
    displayDialogue(<DeletePostContents postId={post.id} />);
  }

  return (
    <View>
      <Text
        style={[
          textStyles.heading3,
          { textAlign: 'center', marginBottom: Spacings.xxl },
        ]}>
        Your photo
      </Text>
      <PopPressable onPress={handleEdit} style={styles.primaryButton}>
        <Text style={textStyles.buttonTextWhite}>Edit caption or date</Text>
      </PopPressable>
      <PopPressable onPress={handleDelete} style={styles.deleteButton}>
        <Text style={textStyles.buttonTextBlack}>Delete photo</Text>
      </PopPressable>
      <PopPressable onPress={dismissDialogue} style={styles.cancelButton}>
        <Text style={textStyles.buttonTextBlack}>Cancel</Text>
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    marginBottom: Spacings.mdsm,
  },

  deleteButton: {
    backgroundColor: '#F47A70',
    paddingVertical: Spacings.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#F47A70',
    marginBottom: Spacings.mdsm,
  },

  cancelButton: {
    paddingVertical: Spacings.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#242832',
  },
});
