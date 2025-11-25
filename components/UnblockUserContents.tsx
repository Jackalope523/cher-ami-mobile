import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useUnblockUserMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import PopPressable from './PopPressable';
import { useDialogueModal } from './modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';

interface UnblockUserContentsProps {
  userId: number;
}

export default function UnblockUserContents({
  userId,
}: UnblockUserContentsProps) {
  const showToast = useToastMessage();
  const { dismissDialogue } = useDialogueModal();
  const queryClient = useQueryClient();
  const mutation = useUnblockUserMutation(
    () => {
      queryClient.invalidateQueries({ queryKey: ['FeedPages'] });
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
      showToast('User unblocked.', ToastMessageType.Success);
      dismissDialogue();
      router.back();
    },
    (_) => {
      showToast('Network error. Try again.', ToastMessageType.Error);
      dismissDialogue();
    },
  );

  function handleUnblock() {
    mutation.mutate({ Id: userId });
  }

  return (
    <View>
      <Text
        style={[
          textStyles.heading3,
          { textAlign: 'center', marginBottom: Spacings.md },
        ]}>
        Unblock User?
      </Text>
      <Text
        style={[
          textStyles.body,
          { textAlign: 'center', marginBottom: Spacings.xxl },
        ]}>
        {
          "Once a user is unblocked, you will see each other's posts in your feeds and magazines."
        }
      </Text>
      <PopPressable
        disabled={mutation.isPending}
        onPress={handleUnblock}
        style={[
          styles.unblockButton,
          {
            marginBottom: Spacings.mdsm,
          },
        ]}>
        <Text style={textStyles.buttonTextBlack}>Unblock</Text>
      </PopPressable>
      <PopPressable onPress={dismissDialogue} style={styles.cancelButton}>
        <Text style={textStyles.buttonTextWhite}>Cancel</Text>
      </PopPressable>
    </View>
  );
}
const styles = StyleSheet.create({
  unblockButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#242832',
    paddingVertical: Spacings.md,
    paddingHorizontal: Spacings.lg,
  },

  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    paddingVertical: Spacings.md,
    paddingHorizontal: Spacings.lg,
  },
});
