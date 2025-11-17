import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useReportPostMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';
import PopPressable from './PopPressable';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';

interface ReportPostContentsProps {
  postId: number;
  dismissModal?: () => void;
}

export default function ReportPostContents({
  postId,
  dismissModal = () => {},
}: ReportPostContentsProps) {
  const showToast = useToastMessage();
  const queryClient = useQueryClient();
  const mutation = useReportPostMutation(
    () => {
      showToast('Report submitted.', ToastMessageType.Alert);
      dismissModal();
    },
    () => {
      showToast('Network error. Try again.', ToastMessageType.Error);
      dismissModal();
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
        Once the report is filed, our team will review the post and take
        appropriate action.
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
        onPress={dismissModal}
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
