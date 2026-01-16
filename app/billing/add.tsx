import Mouse from '@/assets/images/mouse.png';
import Error from '@/components/Error';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useAddPaymentMethodMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddBilling() {
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const createSetupIntentMutation = useAddPaymentMethodMutation(
    (gotPaymentDetails) => {
      setButtonDisabled(false);
      if (gotPaymentDetails) {
        queryClient.invalidateQueries({ queryKey: ['HasPaymentMethod'] });
        router.replace('/circle/recipients/add');
      }
    },
    (_) => {
      setButtonDisabled(false);
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
    },
  );

  if (createSetupIntentMutation.isError) {
    return <Error />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={[textStyles.heading1, styles.screenHeader]}>
          Add Payment Method
        </Text>

        <View style={{ alignItems: 'center', paddingVertical: Spacings.xxl }}>
          <Image
            source={Mouse}
            style={{
              aspectRatio: 71 / 73,
              width: '100%',
              maxHeight: 73,
              maxWidth: 71,
            }}
          />
        </View>

        <Text style={textStyles.body}>
          In order to add recipients to your circle you must provide a payment
          method.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <PopPressable
          disabled={buttonDisabled}
          onPress={() => {
            setButtonDisabled(true);
            createSetupIntentMutation.mutate();
          }}
          style={[styles.removeButton]}>
          <Text style={textStyles.buttonTextBlack}>Add</Text>
        </PopPressable>
        <PopPressable
          onPress={() => {
            router.back();
          }}
          disabled={false}
          style={styles.cancelButton}>
          <Text style={textStyles.buttonTextWhite}>Cancel</Text>
        </PopPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FCFBF8',
    justifyContent: 'space-between',
  },

  screenHeader: {
    alignSelf: 'center',
  },

  recipientName: {
    alignSelf: 'center',
    marginBottom: Spacings.xxxl,
  },

  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: Spacings.sm,
    marginTop: Spacings.xxl,
  },

  buttonContainer: {
    rowGap: Spacings.mdsm,
  },

  removeButton: {
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
