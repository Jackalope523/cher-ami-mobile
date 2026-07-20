import PlusIcon from '@/assets/icons/plus.svg';
import Error from '@/components/Error';
import { useImagePicker } from '@/components/ImagePickerProvider';
import Loading from '@/components/Loading';
import MilitaryQuestion from '@/components/MilitaryQuestion';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  useAddPaymentMethodMutation,
  useAddRecipientMutation,
  useGetPaymentMethodQuery,
  useGetPriceQuery,
  useGetSelfQuery,
} from '@/lib/hooks';
import { getNextMonthName } from '@/lib/utility';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function AddRecipient() {
  const pickImageAsync = useImagePicker();
  const queryClient = useQueryClient();
  const showToastMessage = useToastMessage();
  const getPriceQuery = useGetPriceQuery();
  const getPaymentMethodQuery = useGetPaymentMethodQuery();
  const userQuery = useGetSelfQuery();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [provinceOrState, setProvinceOrState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [isVeteran, setIsVeteran] = useState(false);

  const addRecipientMutation = useAddRecipientMutation();
  const addPaymentMethodMutation = useAddPaymentMethodMutation(
    (gotPaymentDetails) => {
      if (gotPaymentDetails) {
        queryClient.invalidateQueries({ queryKey: ['PaymentMethod'] });
        submitRecipient();
      } else {
        showToastMessage(
          'A payment method is needed to add a recipient.',
          ToastMessageType.Informational,
        );
      }
    },
    (_) => {
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
    },
  );

  const needsBilling =
    !getPaymentMethodQuery.data && !userQuery.data?.isBillingExempt;

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function buttonDisabled() {
    return (
      name === '' ||
      addressLine1 === '' ||
      city === '' ||
      provinceOrState === '' ||
      postalCode === '' ||
      country === '' ||
      addRecipientMutation.isPending ||
      addPaymentMethodMutation.isPending
    );
  }

  function pickImage() {
    pickImageAsync({
      height: 96,
      width: 96,
      cropping: true,
    }).then((x) => {
      setAvatar(x?.uri ?? null);
    });
  }

  function submitRecipient() {
    addRecipientMutation.mutate({
      avatarUri: avatar,
      avatarName: 'avatar.jpg',
      name,
      addressLine1,
      addressLine2,
      city,
      provinceOrState,
      postalCode,
      country,
      isVeteran,
    });
    router.back();
  }

  function handleAdd() {
    if (needsBilling) {
      addPaymentMethodMutation.mutate();
    } else {
      submitRecipient();
    }
  }

  if (getPriceQuery.isError || getPaymentMethodQuery.isError) {
    return <Error />;
  }

  if (
    getPriceQuery.isLoading ||
    getPaymentMethodQuery.isLoading ||
    userQuery.isLoading
  ) {
    return <Loading />;
  }

  if (getPriceQuery.data === undefined) {
    return null;
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        keyboardVisible && {
          paddingBottom: Dimensions.get('window').height / 2,
        },
      ]}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}>
      <PopPressable style={styles.avatarContainer} onPress={pickImage}>
        {avatar ? (
          <Image source={avatar} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: '#F4F1EA' }]}>
            <PlusIcon height={48} width={48} color={'#868581'} />
          </View>
        )}
      </PopPressable>

      <Text style={[textStyles.labelLargeBlack, styles.changeAvatar]}>
        Add a photo of them
      </Text>
      <Text style={[textStyles.heading3, styles.sectionHeader]}>
        Mailing address
      </Text>
      <Text style={[textStyles.body, { marginBottom: Spacings.md }]}>
        This is where we&apos;ll mail the magazine each month.
      </Text>
      <View style={styles.textInputs}>
        <TextInput
          title="Name*"
          maxLength={60}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          textContentType="givenName"
          autoComplete="name-given"
        />
        <TextInput
          title="Address Line 1*"
          maxLength={100}
          value={addressLine1}
          onChangeText={setAddressLine1}
          keyboardType="default"
          autoCapitalize="words"
          autoCorrect={true}
          textContentType="streetAddressLine1"
          autoComplete="street-address"
        />
        <TextInput
          title="Address Line 2"
          maxLength={100}
          value={addressLine2 ?? ''}
          onChangeText={setAddressLine2}
          autoCapitalize="characters"
          autoCorrect={false}
          textContentType="none"
          autoComplete="off"
        />
        <TextInput
          title="City*"
          maxLength={50}
          value={city}
          onChangeText={setCity}
          autoCapitalize="words"
          textContentType="addressCity"
        />
        <View style={{ flexDirection: 'row', columnGap: 20 }}>
          <TextInput
            title="State*"
            maxLength={50}
            value={provinceOrState}
            onChangeText={setProvinceOrState}
            autoCapitalize="words"
            textContentType="addressState"
            containerStyle={{
              width: Dimensions.get('window').width / 2 - 20 - 10,
            }}
          />
          <TextInput
            title="ZIP code*"
            maxLength={20}
            value={postalCode}
            onChangeText={setPostalCode}
            autoCapitalize="characters"
            autoCorrect={false}
            textContentType="postalCode"
            autoComplete="postal-code"
            containerStyle={{
              width: Dimensions.get('window').width / 2 - 20 - 10,
            }}
          />
        </View>
        <TextInput
          title="Country*"
          maxLength={56}
          value={country}
          onChangeText={setCountry}
          editable={false}
          selectTextOnFocus={false}
          keyboardType="default"
          autoCapitalize="words"
          autoCorrect={false}
        />
        <MilitaryQuestion isVeteran={isVeteran} onChange={setIsVeteran} />
      </View>
      <Text style={[textStyles.heading3, styles.sectionHeader]}>Summary</Text>
      <View style={styles.summaryItemList}>
        <View style={styles.summaryItem}>
          <Text style={textStyles.labelLargeBlack}>Renewal</Text>
          <Text style={textStyles.labelSmall}>Monthly</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={textStyles.labelLargeBlack}>
            {isVeteran ? '1 Magazine (Military Edition)' : '1 Magazine'}
          </Text>
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
          <Text style={textStyles.labelSmall}>Total per month</Text>
          <Text style={textStyles.labelSmall}>
            $
            {(isVeteran
              ? getPriceQuery.data.militaryEditionPrice
              : getPriceQuery.data.standardEditionPrice) / 100}
          </Text>
        </View>
        <Text style={[textStyles.caption, styles.disclaimer]}>
          {`*This is a monthly subscription, billed on the 1st of each month starting ${getNextMonthName()} 1st. Cancel anytime.`}
        </Text>
      </View>
      {needsBilling && (
        <Text style={[textStyles.caption, { marginBottom: Spacings.md }]}>
          Next, we&apos;ll ask for a payment method. You won&apos;t be charged
          until {getNextMonthName()} 1st.
        </Text>
      )}
      <PopPressable
        onPress={handleAdd}
        disabled={buttonDisabled()}
        style={[
          styles.button,
          buttonDisabled() && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            buttonDisabled() && { color: '#A8ABB3' },
          ]}>
          Add Recipient
        </Text>
      </PopPressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#FCFBF8',
  },

  avatarContainer: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: Spacings.sm,
    marginTop: Spacings.xxl,
  },

  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
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
