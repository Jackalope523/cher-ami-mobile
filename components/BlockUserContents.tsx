import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useBlockUserMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import PopPressable from './PopPressable';
import { useDialogueModal } from './modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';

interface BlockUserContentsProps {
  userId: number;
}

export default function BlockUserContents({ userId }: BlockUserContentsProps) {
  const showToast = useToastMessage();
  const { dismissDialogue } = useDialogueModal();
  const queryClient = useQueryClient();
  const mutation = useBlockUserMutation(
    () => {
      queryClient.invalidateQueries({ queryKey: ['FeedPages'] });
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
      showToast('User blocked.', ToastMessageType.Success);
      dismissDialogue();
      router.back();
    },
    (error) => {
      showToast('Network error. Try again.', ToastMessageType.Error);
      dismissDialogue();
    },
  );

  function handleBlock() {
    mutation.mutate({ Id: userId });
  }

  return (
    <View>
      <Text
        style={[
          textStyles.heading3,
          { textAlign: 'center', marginBottom: Spacings.md },
        ]}>
        Block User?
      </Text>
      <Text
        style={[
          textStyles.body,
          { textAlign: 'center', marginBottom: Spacings.xxl },
        ]}>
        {
          "Once a user is blocked, you will no longer see each other's posts in your feeds or magazines. Blocked posts will still count towards the total."
        }
      </Text>
      <PopPressable
        disabled={mutation.isPending}
        onPress={handleBlock}
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
        <Text style={textStyles.buttonTextBlack}>Block</Text>
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
