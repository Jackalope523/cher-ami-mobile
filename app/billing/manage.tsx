import CreditCardIcon from '@/assets/icons/credit-card.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import RemovePaymentMethodContents from '@/components/RemovePaymentMethodContents';
import UserItem from '@/components/UserItem';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  useAddPaymentMethodMutation,
  useGetPaymentMethodQuery,
  useGetPriceQuery,
  useGetSelfQuery,
  useUpdatePaymentMethodMutation,
} from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function Manage() {
  const { displayDialogue, dismissDialogue } = useDialogueModal();
  const showToastMessage = useToastMessage();
  const getSelfQuery = useGetSelfQuery();
  const getPriceQuery = useGetPriceQuery();
  const getPaymentMethodQuery = useGetPaymentMethodQuery();
  const queryClient = useQueryClient();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const addPaymentMethodMutation = useAddPaymentMethodMutation(
    (gotPaymentDetails) => {
      setButtonDisabled(false);
      if (gotPaymentDetails) {
        queryClient.invalidateQueries({ queryKey: ['PaymentMethod'] });
      }
    },
    (_) => {
      setButtonDisabled(false);
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
    },
  );
  const updatePaymentMethodMutation = useUpdatePaymentMethodMutation(
    (gotPaymentDetails) => {
      setButtonDisabled(false);
      if (gotPaymentDetails) {
        queryClient.invalidateQueries({ queryKey: ['PaymentMethod'] });
      }
    },
    (_) => {
      setButtonDisabled(false);
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
    },
  );

  if (
    getSelfQuery.isError ||
    getPriceQuery.isError ||
    getPaymentMethodQuery.isError
  ) {
    return <Error />;
  }

  if (
    getSelfQuery.isLoading ||
    getPriceQuery.isLoading ||
    getPaymentMethodQuery.isLoading
  ) {
    return <Loading />;
  }

  if (!getSelfQuery.data || !getPriceQuery.data || !getPaymentMethodQuery) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}>
      <Text style={[textStyles.heading3, { marginBottom: Spacings.md }]}>
        Billing summary
      </Text>
      <Text style={textStyles.body}>
        {"You're currently paying for the following recipients."}
      </Text>
      <View style={styles.userList}>
        {getSelfQuery.data.recipients.map((x) => (
          <UserItem
            key={x.id}
            text={`${x.firstName} ${x.lastName}`}
            imageSource={x.avatarPath + `?timestamp=${x.avatarTimestamp}`}
            tagRight={`$${getPriceQuery.data / 100}.00`}
          />
        ))}
      </View>
      <View style={styles.divider} />
      <View style={styles.priceTotal}>
        <Text style={textStyles.labelSmall}>Total</Text>
        <Text style={textStyles.labelSmall}>
          ${(getSelfQuery.data.recipients.length * getPriceQuery.data) / 100}.00
        </Text>
      </View>
      <Text style={textStyles.heading3}>Billing details</Text>
      {getPaymentMethodQuery.data && (
        <View style={styles.paymentMethod}>
          <View
            style={{
              flexDirection: 'row',
              columnGap: Spacings.sm,
              alignItems: 'center',
            }}>
            <CreditCardIcon height={24} width={24} color={'#242832'} />
            <Text style={textStyles.buttonTextBlack}>
              {`${getPaymentMethodQuery.data.displayBrand
                .charAt(0)
                .toUpperCase()}${getPaymentMethodQuery.data.displayBrand.slice(
                1,
              )} ending in ${getPaymentMethodQuery.data.last4}`}
            </Text>
          </View>
          <PopPressable
            onPress={() => {
              displayDialogue(<RemovePaymentMethodContents />);
            }}>
            <TrashIcon height={24} width={24} color={'#B05637'} />
          </PopPressable>
        </View>
      )}
      {getPaymentMethodQuery.data ? (
        <PopPressable
          disabled={buttonDisabled}
          onPress={() => {
            setButtonDisabled(true);
            updatePaymentMethodMutation.mutate();
          }}
          style={styles.button}>
          <Text style={textStyles.buttonTextOrange}>Update Payment Method</Text>
          <PlusIcon height={24} width={24} color={'#B05637'} />
        </PopPressable>
      ) : (
        <PopPressable
          disabled={buttonDisabled}
          onPress={() => {
            setButtonDisabled(true);
            addPaymentMethodMutation.mutate();
          }}
          style={styles.button}>
          <Text style={textStyles.buttonTextOrange}>Add Payment Method</Text>
          <PlusIcon height={24} width={24} color={'#B05637'} />
        </PopPressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: 20,
  },

  userList: {
    marginTop: Spacings.lg,
    rowGap: Spacings.lg,
  },

  divider: {
    marginVertical: Spacings.lg,
    borderWidth: 1.5,
    borderColor: '#DEDBD5',
  },

  priceTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacings.xl,
  },

  paymentMethod: {
    flexDirection: 'row',
    paddingVertical: Spacings.mdsm,
    paddingHorizontal: Spacings.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    columnGap: Spacings.sm,
    borderWidth: 2,
    borderColor: '#242832',
    marginTop: Spacings.md,
  },

  button: {
    flexDirection: 'row',
    paddingVertical: Spacings.mdsm,
    paddingHorizontal: Spacings.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    columnGap: Spacings.sm,
    borderWidth: 2,
    borderColor: '#B05637',
    marginTop: Spacings.md,
  },
});
