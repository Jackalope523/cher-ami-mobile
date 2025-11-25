import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useReportPostMutation } from '@/lib/hooks';
import { StyleSheet, Text, View } from 'react-native';
import PopPressable from './PopPressable';
import { useDialogueModal } from './modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';

interface ReportPostContentsProps {
  postId: number;
}

export default function ReportPostContents({
  postId,
}: ReportPostContentsProps) {
  const showToast = useToastMessage();
  const { dismissDialogue } = useDialogueModal();
  const mutation = useReportPostMutation(
    () => {
      showToast('Report submitted.', ToastMessageType.Alert);
      dismissDialogue();
    },
    () => {
      showToast('Network error. Try again.', ToastMessageType.Error);
      dismissDialogue();
    },
  );

  function handleReport() {
    mutation.mutate({ Id: postId });
  }

  return (
    <View>
      <Text
        style={[
          textStyles.heading3,
          { textAlign: 'center', marginBottom: Spacings.md },
        ]}>
        Report Post?
      </Text>
      <Text
        style={[
          textStyles.body,
          { textAlign: 'center', marginBottom: Spacings.xxl },
        ]}>
        Once you submit, our team will review the reported post within 24h and
        take appropriate action. We will let you know our decision by email.
      </Text>
      <PopPressable
        disabled={mutation.isPending}
        onPress={handleReport}
        style={{
          backgroundColor: mutation.isPending ? '#ECEDEF' : '#F6CE4B',
          paddingVertical: Spacings.md,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: mutation.isPending ? '#ECEDEF' : '#F6CE4B',
          marginBottom: Spacings.mdsm,
        }}>
        <Text style={textStyles.buttonTextBlack}>Report</Text>
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
