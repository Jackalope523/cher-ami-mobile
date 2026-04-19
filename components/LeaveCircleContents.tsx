import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetCircleQuery, useLeaveCircleMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useDialogueModal } from './modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';
import PopPressable from './PopPressable';

export default function LeaveCircleContents() {
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const { data } = useGetCircleQuery();
  const { dismissDialogue } = useDialogueModal();
  const mutation = useLeaveCircleMutation(
    async () => {
      await queryClient.invalidateQueries({ queryKey: ['Circle'] });
      router.replace('/feed');
      showToastMessage('Left circle.', ToastMessageType.Success);
    },
    (error) => {
      console.log(error);
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
    },
  );

  function handleDelete() {
    mutation.mutate();
    dismissDialogue();
  }

  return (
    <View>
      <Text
        style={[
          textStyles.heading3,
          { textAlign: 'center', marginBottom: Spacings.md },
        ]}>
        Leave Circle?
      </Text>
      <Text
        style={[
          textStyles.body,
          { textAlign: 'center', marginBottom: Spacings.xxl },
        ]}>
        If you leave
        <Text style={{ fontWeight: 'bold' }}> {data?.title} </Text>
        {"you'll lose access to its posts and updates."}
      </Text>
      <PopPressable
        onPress={handleDelete}
        style={{
          backgroundColor: '#F47A70',
          paddingVertical: Spacings.md,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#F47A70',
          marginBottom: Spacings.mdsm,
        }}>
        <Text style={textStyles.buttonTextBlack}>Leave</Text>
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
