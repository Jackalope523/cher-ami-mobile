import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Pressable, ScrollView } from 'react-native-gesture-handler';

import { BannerMessageType } from '@/components/BannerMessage';
import { useToastMessage } from '@/components/modals/ToastMessageProvider';
import NetworkImage from '@/components/NetworkImage';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useAddRecipientMutation } from '@/lib/hooks';
import { SetupParams, useStripe } from '@stripe/stripe-react-native';

export default function AddRecipient() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const showToastMessage = useToastMessage();

  const addRecipientMutation = useAddRecipientMutation(
    (_) => {
      showToastMessage('Recipient added!', BannerMessageType.Success);
    },
    (error) => {
      console.error('Failed to add recipient:', error);
      showToastMessage('Failed to add recipient.', BannerMessageType.Error);
    },
  );

  useEffect(() => {
    const initializePaymentSheet = async () => {
      const params: SetupParams = {
        paymentIntentClientSecret: '',
        returnURL: 'stripe-example://payment-sheet',
        allowsDelayedPaymentMethods: true,
        merchantDisplayName: 'Hollow Inc',
      };

      const { error } = await initPaymentSheet(params);
      if (error) {
        // Handle error
      }
    };

    initializePaymentSheet();
  }, [initPaymentSheet]);

  function handleAdd() {
    addRecipientMutation.mutate({});
  }

  return (
    <ScrollView
      style={styles.container}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}>
      <NetworkImage style={styles.avatar} />
      <Text style={[textStyles.labelLargeBlack, styles.changeAvatar]}>
        Change avatar
      </Text>
      <Text style={[textStyles.heading3, styles.sectionHeader]}>
        Mailing address
      </Text>
      <View style={styles.textInputs}>
        <TextInput title={'First name'} />
        <TextInput title={'Last name'} />
        <TextInput title={'Address line 1'} />
        <TextInput title={'Address line 2'} />
        <TextInput title={'City'} />
        <View style={{ flexDirection: 'row', columnGap: 20 }}>
          <TextInput title={'State'} />
          <TextInput title={'ZIP code'} />
        </View>
        <TextInput title={'Country'} />
      </View>
      <Text style={[textStyles.heading3, styles.sectionHeader]}>Summary</Text>
      <View style={styles.summaryItemList}>
        <View style={styles.summaryItem}>
          <Text style={textStyles.labelLargeBlack}>Renewal</Text>
          <Text style={textStyles.labelSmall}>Monthly</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={textStyles.labelLargeBlack}>1 Magazine</Text>
          <Text style={textStyles.labelSmall}>Monthly</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={textStyles.labelLargeBlack}>Delivery</Text>
          <Text style={textStyles.labelSmall}>FREE</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={textStyles.labelLargeBlack}>Estimated sales tax</Text>
          <Text style={textStyles.labelSmall}>---</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={textStyles.labelSmall}>Total</Text>
          <Text style={textStyles.labelSmall}>$12,00</Text>
        </View>
        <Text style={[textStyles.caption, styles.disclaimer]}>
          *Monthly subscription that charges you every month, starting October
          1.
        </Text>
      </View>
      <Pressable
        onPress={() => {}}
        disabled={false}
        style={[
          styles.button,
          false && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[textStyles.buttonTextWhite, false && { color: '#A8ABB3' }]}>
          Add Recipient
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#FCFBF8',
  },

  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: Spacings.sm,
    marginTop: Spacings.xxl,
  },

  changeAvatar: {
    alignSelf: 'center',
    marginBottom: Spacings.xxxl,
  },

  sectionHeader: {
    marginBottom: Spacings.md,
  },

  textInputs: {
    rowGap: 20,
    marginBottom: Spacings.xl,
  },

  summaryItemList: {
    rowGap: Spacings.sm,
  },

  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  divider: {
    borderWidth: 1.5,
    borderColor: '#DEDBD5',
    marginVertical: Spacings.lg,
  },

  disclaimer: {
    marginTop: Spacings.mdsm,
    marginBottom: Spacings.xl,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    marginBottom: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    paddingVertical: Spacings.md,
    paddingHorizontal: Spacings.lg,
  },
});
