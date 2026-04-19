import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetSelfQuery, useRemovePaymentMethodMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';
import Error from './Error';
import Loading from './Loading';
import { useDialogueModal } from './modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';
import PopPressable from './PopPressable';

export default function RemovePaymentMethodContents() {
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const { dismissDialogue } = useDialogueModal();
  const getSelfQuery = useGetSelfQuery();
  const removePaymentMethodMutation = useRemovePaymentMethodMutation(
    async () => {
      await queryClient.invalidateQueries({ queryKey: ['PaymentMethod'] });
      showToastMessage('Card removed.', ToastMessageType.Success);
    },
    (error) => {
      console.log(error);
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
    },
  );

  function handleDelete() {
    removePaymentMethodMutation.mutate();
    dismissDialogue();
  }

  if (getSelfQuery.isError) {
    return <Error />;
  }

  if (getSelfQuery.isLoading) {
    return <Loading />;
  }

  if (!getSelfQuery.data) {
    return null;
  }

  return (
    <View>
      <Text
        style={[
          textStyles.heading3,
          { textAlign: 'center', marginBottom: Spacings.md },
        ]}>
        {getSelfQuery.data.recipients.length === 0 ||
        getSelfQuery.data.isBillingExempt
          ? 'Remove Card?'
          : 'Removal Blocked'}
      </Text>
      <Text
        style={[
          textStyles.body,
          { textAlign: 'center', marginBottom: Spacings.xxl },
        ]}>
        {getSelfQuery.data.recipients.length === 0 ||
        getSelfQuery.data.isBillingExempt
          ? 'Are you sure you want to remove this card?'
          : 'Unable to remove card while you have active recipients. Please remove them first.'}
      </Text>
      {(getSelfQuery.data.recipients.length === 0 ||
        getSelfQuery.data.isBillingExempt) && (
        <PopPressable
          onPress={handleDelete}
          style={{
            backgroundColor: '#C15F3C',
            paddingVertical: Spacings.md,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 14,
            borderWidth: 2,
            borderColor: '#C15F3C',
            marginBottom: Spacings.mdsm,
          }}>
          <Text style={textStyles.buttonTextWhite}>Remove</Text>
        </PopPressable>
      )}
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
