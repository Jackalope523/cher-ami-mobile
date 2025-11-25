import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useDeletePostMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';
import PopPressable from './PopPressable';
import { useDialogueModal } from './modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';

interface DeletePostContentsProps {
  postId: number;
}

export default function DeletePostContents({
  postId,
}: DeletePostContentsProps) {
  const showToast = useToastMessage();
  const { dismissDialogue } = useDialogueModal();
  const queryClient = useQueryClient();
  const mutation = useDeletePostMutation(
    () => {
      showToast('Post deleted.', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['FeedPages'] });
      queryClient.invalidateQueries({ queryKey: ['PostCount'] });
      dismissDialogue();
    },
    () => {
      showToast('Failed to delete post.', ToastMessageType.Error);
      dismissDialogue();
    },
  );

  function handleDelete() {
    mutation.mutate({ Id: postId });
  }

  return (
    <View>
      <Text
        style={[
          textStyles.heading3,
          { textAlign: 'center', marginBottom: Spacings.md },
        ]}>
        Delete Post?
      </Text>
      <Text
        style={[
          textStyles.body,
          { textAlign: 'center', marginBottom: Spacings.xxl },
        ]}>
        Once you delete the post, it will be gone for good and cannot be
        restored.
      </Text>
      <PopPressable
        disabled={mutation.isPending}
        onPress={handleDelete}
        style={{
          backgroundColor: mutation.isPending ? '#ECEDEF' : '#F47A70',
          paddingVertical: Spacings.md,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: mutation.isPending ? '#ECEDEF' : '#F47A70',
          marginBottom: Spacings.mdsm,
        }}>
        <Text style={textStyles.buttonTextBlack}>Delete</Text>
      </PopPressable>
      <PopPressable
        onPress={dismissDialogue}
        style={{
          paddingVertical: Spacings.md,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#242832',
        }}>
        <Text style={textStyles.buttonTextBlack}>Cancel</Text>
      </PopPressable>
    </View>
  );
}
const styles = StyleSheet.create({});
