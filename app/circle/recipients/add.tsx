import PlusIcon from '@/assets/icons/plus.svg';
import CountryHelpContents from '@/components/CountryHelpContents';
import Error from '@/components/Error';
import { useImagePicker } from '@/components/ImagePickerProvider';
import Loading from '@/components/Loading';
import MilitaryQuestionContents from '@/components/MilitaryQuestionContents';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { openLink } from '@/lib/browser';
import {
  useAddPaymentMethodMutation,
  useAddRecipientMutation,
  useFeedPostsInfiniteQuery,
  useGetCircleQuery,
  useGetPaymentMethodQuery,
  useGetPriceQuery,
  useGetSelfQuery,
} from '@/lib/hooks';
import { billingSchedule } from '@/lib/utility';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  TextInput as ReactNativeTextInput,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function AddRecipient() {
  const pickImageAsync = useImagePicker();
  const queryClient = useQueryClient();
  const showToastMessage = useToastMessage();
  const { displayDialogue } = useDialogueModal();
  const getPriceQuery = useGetPriceQuery();
  const feedQuery = useFeedPostsInfiniteQuery();
  const circleQuery = useGetCircleQuery();
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

  const addressLine1Ref = useRef<ReactNativeTextInput>(null);
  const addressLine2Ref = useRef<ReactNativeTextInput>(null);
  const cityRef = useRef<ReactNativeTextInput>(null);
  const stateRef = useRef<ReactNativeTextInput>(null);
  const postalCodeRef = useRef<ReactNativeTextInput>(null);

  const addRecipientMutation = useAddRecipientMutation();
  const addPaymentMethodMutation = useAddPaymentMethodMutation(
    (gotPaymentDetails) => {
      if (gotPaymentDetails) {
        queryClient.invalidateQueries({ queryKey: ['PaymentMethod'] });
        submitRecipient();
      } else {
        showToastMessage(
          'We need a card on file before we can send magazines.',
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

  // The free magazine is one per circle, so it only applies while nobody in
  // the circle receives one yet — a second recipient is billed from their
  // first shipment.
  const freeFirstMagazine = (circleQuery.data?.recipients.length ?? 0) === 0;

  // Dates come from the magazine they're actually joining, not from "now" —
  // a late-in-the-month sign-up rolls onto the following issue.
  const schedule = billingSchedule(
    feedQuery.data?.pages[0].issueCloseDate ?? null,
    freeFirstMagazine,
  );

  const standardPrice = getPriceQuery.data?.standardEditionPrice ?? 0;
  const militaryPrice = getPriceQuery.data?.militaryEditionPrice ?? 0;
  const priceFor = (veteran: boolean) =>
    veteran ? militaryPrice : standardPrice;

  // What they already pay for, so the total reflects every magazine rather
  // than just the one being added.
  const existingRecipients = userQuery.data?.recipients ?? [];
  const existingCost = existingRecipients.reduce(
    (total, recipient) => total + priceFor(recipient.isVeteran),
    0,
  );
  const newCost = priceFor(isVeteran);
  const monthlyTotal = existingCost + newCost;
  const magazineCount = existingRecipients.length + 1;

  const asDollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

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
      height: 256,
      width: 256,
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

  function handleMilitaryQuestion() {
    displayDialogue(
      <MilitaryQuestionContents
        isVeteran={isVeteran}
        onChange={setIsVeteran}
      />,
    );
  }

  function handleCountryQuestion() {
    Keyboard.dismiss();
    displayDialogue(<CountryHelpContents />);
  }

  function handleAdd() {
    if (needsBilling) {
      addPaymentMethodMutation.mutate();
    } else {
      submitRecipient();
    }
  }

  if (
    getPriceQuery.isError ||
    getPaymentMethodQuery.isError ||
    circleQuery.isError
  ) {
    return <Error />;
  }

  if (
    getPriceQuery.isLoading ||
    getPaymentMethodQuery.isLoading ||
    userQuery.isLoading ||
    circleQuery.isLoading
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
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => addressLine1Ref.current?.focus()}
        />
        <TextInput
          ref={addressLine1Ref}
          title="Address Line 1*"
          maxLength={100}
          value={addressLine1}
          onChangeText={setAddressLine1}
          keyboardType="default"
          autoCapitalize="words"
          autoCorrect={true}
          textContentType="streetAddressLine1"
          autoComplete="street-address"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => addressLine2Ref.current?.focus()}
        />
        <TextInput
          ref={addressLine2Ref}
          title="Address Line 2"
          maxLength={100}
          value={addressLine2 ?? ''}
          onChangeText={setAddressLine2}
          autoCapitalize="characters"
          autoCorrect={false}
          textContentType="none"
          autoComplete="off"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => cityRef.current?.focus()}
        />
        <TextInput
          ref={cityRef}
          title="City*"
          maxLength={50}
          value={city}
          onChangeText={setCity}
          autoCapitalize="words"
          textContentType="addressCity"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => stateRef.current?.focus()}
        />
        <View style={{ flexDirection: 'row', columnGap: 20 }}>
          <TextInput
            ref={stateRef}
            title="State*"
            maxLength={50}
            value={provinceOrState}
            onChangeText={setProvinceOrState}
            autoCapitalize="words"
            textContentType="addressState"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => postalCodeRef.current?.focus()}
            containerStyle={{
              width: Dimensions.get('window').width / 2 - 20 - 10,
            }}
          />
          <TextInput
            ref={postalCodeRef}
            title="ZIP code*"
            maxLength={20}
            value={postalCode}
            onChangeText={setPostalCode}
            autoCapitalize="characters"
            autoCorrect={false}
            textContentType="postalCode"
            autoComplete="postal-code"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            containerStyle={{
              width: Dimensions.get('window').width / 2 - 20 - 10,
            }}
          />
        </View>
        <PopPressable onPress={handleCountryQuestion}>
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
        </PopPressable>
        <PopPressable onPress={handleMilitaryQuestion} hitSlop={Spacings.sm}>
          <Text style={[textStyles.caption, styles.militaryLink]}>
            {isVeteran
              ? 'Military Edition applied — 20% off. Change'
              : 'Sending to a veteran or service member?'}
          </Text>
        </PopPressable>
      </View>
      <Text style={[textStyles.heading3, styles.sectionHeader]}>Summary</Text>
      <View style={styles.summaryItemList}>
        <View style={styles.summaryItem}>
          <Text style={textStyles.labelLargeBlack}>Renewal</Text>
          <Text style={textStyles.labelSmall}>Monthly</Text>
        </View>
        {existingRecipients.length > 0 && (
          <View style={styles.summaryItem}>
            <Text style={[textStyles.labelLargeBlack, styles.summaryLabel]}>
              Your other recipients ({existingRecipients.length})
            </Text>
            <Text style={textStyles.labelSmall}>{asDollars(existingCost)}</Text>
          </View>
        )}
        <View style={styles.summaryItem}>
          <Text style={[textStyles.labelLargeBlack, styles.summaryLabel]}>
            {isVeteran
              ? `${'This recipient'} (Military Edition)`
              : 'This recipient'}
          </Text>
          <Text style={textStyles.labelSmall}>{asDollars(newCost)}</Text>
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
        {freeFirstMagazine && (
          <View style={styles.summaryItem}>
            <Text
              style={[
                textStyles.labelLargeBlack,
                styles.freeLabel,
                styles.summaryLabel,
              ]}>
              {schedule
                ? `${schedule.issueMonth}'s magazine — on us`
                : 'First magazine — on us'}
            </Text>
            <Text style={[textStyles.labelLargeBlack, styles.freeLabel]}>
              FREE
            </Text>
          </View>
        )}
        <View style={styles.summaryItem}>
          <Text style={textStyles.labelLargeBlack}>Due today</Text>
          <Text style={textStyles.labelLargeBlack}>$0.00</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[textStyles.labelLargeBlack, styles.summaryLabel]}>
            {schedule
              ? `Then from ${schedule.firstChargeDate}`
              : 'Then each month'}
            {magazineCount > 1
              ?
                ` (${magazineCount} magazines)`
              : ''}
          </Text>
          <Text style={textStyles.labelLargeBlack}>
            {asDollars(monthlyTotal)}/mo
          </Text>
        </View>
        <Text style={[textStyles.caption, styles.disclaimer]}>
          {schedule
            ? `*Billed on the 1st of a month, and only when a magazine goes out that month. Starting ${schedule.firstChargeDate}.`
            : '*Billed monthly, and only when a magazine goes out.'}
        </Text>
      </View>
      <View style={styles.billingNote}>
        <Text
          style={[textStyles.labelLargeBlack, { marginBottom: Spacings.xs }]}>
          {needsBilling ? 'Why we ask for a card now' : 'How billing works'}
        </Text>
        {schedule ? (
          <Text style={[textStyles.body, { marginBottom: Spacings.sm }]}>
            {schedule.issueMonth}&apos;s magazine closes {schedule.closesOn} and
            goes in the mail in {schedule.firstShipmentMonth}
            {freeFirstMagazine
              ? ` — that one is on us. Your first payment is ${schedule.firstChargeDate}, for ${schedule.firstChargeIssueMonth}'s magazine.`
              : `, and that is what your first payment on ${schedule.firstChargeDate} covers.`}
          </Text>
        ) : (
          <Text style={[textStyles.body, { marginBottom: Spacings.sm }]}>
            Each magazine closes at the end of its month and goes in the mail at
            the start of the next one.
            {freeFirstMagazine
              ? ' Your first one is on us, and your first payment comes when the magazine after it is mailed.'
              : ' Your first payment comes when their first magazine is mailed.'}
          </Text>
        )}
        <Text style={textStyles.body}>
          We only charge when a magazine is actually sent — if no photos are
          added one month, nothing goes out and there&apos;s nothing to pay. You
          can stop any time by removing the recipient.
        </Text>
        {needsBilling && (
          <Text style={[textStyles.body, { marginTop: Spacings.sm }]}>
            We keep your card on file so each magazine can go out without us
            having to interrupt you every month.
          </Text>
        )}
      </View>
      <Text style={[textStyles.caption, styles.terms]}>
        By adding a recipient you agree to our{' '}
        <Text
          onPress={() => openLink('https://thecherami.com/legal/terms')}
          style={[textStyles.caption, styles.termsLink]}>
          Terms and Conditions
        </Text>{' '}
        and{' '}
        <Text
          onPress={() => openLink('https://thecherami.com/legal/privacy')}
          style={[textStyles.caption, styles.termsLink]}>
          Privacy Policy
        </Text>
        .
      </Text>

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

  freeLabel: {
    color: '#779443',
  },

  terms: {
    textAlign: 'center',
    marginBottom: Spacings.md,
  },

  termsLink: {
    textDecorationLine: 'underline',
  },

  militaryLink: {
    color: '#868581',
    textDecorationLine: 'underline',
    marginBottom: Spacings.md,
  },

  billingNote: {
    backgroundColor: '#F4F1EA',
    borderRadius: borderRadius.mdsm,
    padding: Spacings.md,
    marginBottom: Spacings.md,
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
    columnGap: Spacings.md,
  },

  summaryLabel: {
    flexShrink: 1,
  },

  countryHint: {
    color: '#868581',
    marginTop: Spacings.xs,
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
