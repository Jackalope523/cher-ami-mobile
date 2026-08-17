import PlusIcon from '@/assets/icons/plus.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import Placeholder from '@/assets/images/placeholder.png';
import { useAuth } from '@/components/AuthProvider';
import CountryHelpContents from '@/components/CountryHelpContents';
import Error from '@/components/Error';
import { useImagePicker } from '@/components/ImagePickerProvider';
import Loading from '@/components/Loading';
import MilitaryQuestionContents from '@/components/MilitaryQuestionContents';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  useGetPriceQuery,
  useGetRecipientQuery,
  useGetSelfQuery,
  useUpdateRecipientMutation,
} from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
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

export default function EditRecipient() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { getToken } = useAuth();
  const { displayDialogue } = useDialogueModal();
  const queryClient = useQueryClient();
  const pickImageAsync = useImagePicker();
  const getPriceQuery = useGetPriceQuery();
  const selfQuery = useGetSelfQuery();
  const showToastMessage = useToastMessage();
  const { data, status } = useGetRecipientQuery(Number(id));
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const isOwner =
    !!data && !!selfQuery.data && data.managerId === selfQuery.data.id;
  const mutation = useUpdateRecipientMutation(
    () => {
      showToastMessage('Updated recipient.', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
      queryClient.invalidateQueries({ queryKey: ['Recipient', Number(id)] });
      queryClient.invalidateQueries({ queryKey: ['User', 'Self'] });
      router.back();
    },
    () => {
      showToastMessage('Failed to update recipient.', ToastMessageType.Error);
    },
  );

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

  const asDollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;

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

  useEffect(() => {
    if (!data) return;

    navigation.setOptions({
      title: isOwner ? 'Edit Recipient' : 'Recipient',
      headerRight: isOwner
        ? () => (
            <PopPressable
              onPress={() => {
                router.navigate({
                  pathname: '/circle/recipients/[id]/delete',
                  params: { id: id as string },
                });
              }}
              style={{ paddingHorizontal: Spacings.md }}>
              <TrashIcon height={24} width={24} color={'#B05637'} />
            </PopPressable>
          )
        : undefined,
    });
  }, [data, id, isOwner, navigation]);

  useEffect(() => {
    if (data) {
      setAvatar(data.avatarUrl);
      setName(data.name);
      setAddressLine1(data.addressLine1);
      setAddressLine2(data.addressLine2);
      setCity(data.city);
      setProvinceOrState(data.provinceOrState);
      setPostalCode(data.postalCode);
      setCountry(data.country);
      setIsVeteran(data.isVeteran);
    }
  }, [data]);

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

  function pickImage() {
    pickImageAsync({
      height: 256,
      width: 256,
      cropping: true,
    }).then((x) => {
      setAvatar(x?.uri ?? null);
    });
  }

  function buttonDisabled() {
    if (data) {
      return (
        (avatar === data.avatarUrl &&
          name === data.name &&
          addressLine1 === data.addressLine1 &&
          addressLine2 === data.addressLine2 &&
          city === data.city &&
          country === data.country &&
          provinceOrState === data.provinceOrState &&
          postalCode === data.postalCode &&
          isVeteran === data.isVeteran) ||
        mutation.isPending
      );
    }

    return true;
  }

  function handleSaveChanges() {
    if (data) {
      mutation.mutate({
        id: Number(id),
        name,
        addressLine1,
        addressLine2,
        city,
        provinceOrState,
        postalCode,
        country,
        avatarUrl: avatar !== data.avatarUrl ? avatar : null,
        isVeteran,
      });
    }
  }

  if (status === 'error' || getPriceQuery.isError) {
    return <Error />;
  }

  if (status === 'pending' || getPriceQuery.isLoading) {
    return <Loading />;
  }

  if (!data || getPriceQuery.data === undefined) {
    return null;
  }

  const price = isVeteran
    ? getPriceQuery.data.militaryEditionPrice
    : getPriceQuery.data.standardEditionPrice;

  const addedBy =
    selfQuery.data && data.managerId === selfQuery.data.id
      ? 'Added by you'
      : data.managerName
        ? `Added by ${data.managerName}`
        : null;

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
      <PopPressable onPress={isOwner ? pickImage : undefined}>
        {avatar !== data.avatarUrl ? (
          <Image style={styles.avatar} source={avatar} />
        ) : data.avatarUrl ? (
          <Image
            style={styles.avatar}
            placeholder={Placeholder}
            placeholderContentFit="fill"
            source={{
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
              uri: data.avatarUrl,
            }}
          />
        ) : (
          <View style={[styles.avatar, { backgroundColor: '#F4F1EA' }]}>
            {isOwner ? (
              <PlusIcon height={48} width={48} color={'#868581'} />
            ) : (
              <Text style={textStyles.heading2}>{data.name.charAt(0)}</Text>
            )}
          </View>
        )}
      </PopPressable>
      {isOwner && (
        <Text style={[textStyles.labelLargeBlack, styles.changeAvatar]}>
          Change avatar
        </Text>
      )}
      {addedBy && (
        <Text style={[textStyles.caption, styles.addedBy]}>{addedBy}</Text>
      )}
      {!isOwner && (
        <View style={styles.readOnlyNote}>
          <Text style={textStyles.body}>
            {data.managerName
              ? `Only ${data.managerName} can change this recipient's details, since they added them.`
              : 'Only the person who added this recipient can change their details.'}
          </Text>
        </View>
      )}
      <Text style={[textStyles.heading3, styles.sectionHeader]}>
        Mailing address
      </Text>
      <View style={styles.textInputs}>
        <TextInput
          title="Name*"
          editable={isOwner}
          maxLength={100}
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
          editable={isOwner}
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
          editable={isOwner}
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
          editable={isOwner}
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
            editable={isOwner}
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
            editable={isOwner}
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
        {isOwner ? (
          <PopPressable onPress={handleMilitaryQuestion} hitSlop={Spacings.sm}>
            <Text style={[textStyles.caption, styles.militaryLink]}>
              {isVeteran
                ? 'Military Edition applied — 20% off. Change'
                : 'Sending to a veteran or service member?'}
            </Text>
          </PopPressable>
        ) : (
          isVeteran && (
            <Text style={[textStyles.caption, { color: '#868581' }]}>
              Military Edition — 20% off
            </Text>
          )
        )}
      </View>
      <Text style={[textStyles.heading3, styles.sectionHeader]}>Summary</Text>
      <View style={styles.summaryItemList}>
        <View style={styles.summaryItem}>
          <Text style={textStyles.labelLargeBlack}>Renewal</Text>
          <Text style={textStyles.labelSmall}>Monthly</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[textStyles.labelLargeBlack, styles.summaryLabel]}>
            {isVeteran
              ? `${'This recipient'} (Military Edition)`
              : 'This recipient'}
          </Text>
          <Text style={textStyles.labelSmall}>{asDollars(price)}</Text>
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
          <Text style={[textStyles.labelLargeBlack, styles.summaryLabel]}>
            Total per month
          </Text>
          <Text style={textStyles.labelLargeBlack}>{asDollars(price)}/mo</Text>
        </View>
        <Text style={[textStyles.caption, styles.disclaimer]}>
          *Billed on the 1st of a month, and only when a magazine goes out that
          month. You can also stop any time by removing this recipient.
        </Text>
      </View>
      {isOwner && (
        <PopPressable
          onPress={handleSaveChanges}
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
            Save Changes
          </Text>
        </PopPressable>
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacings.sm,
    marginTop: Spacings.xxl,
  },

  changeAvatar: {
    alignSelf: 'center',
    marginBottom: Spacings.sm,
  },

  addedBy: {
    alignSelf: 'center',
    color: '#868581',
    marginBottom: Spacings.xxxl,
  },

  readOnlyNote: {
    backgroundColor: '#F4F1EA',
    borderRadius: borderRadius.mdsm,
    padding: Spacings.md,
    marginBottom: Spacings.xl,
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

  militaryLink: {
    color: '#868581',
    textDecorationLine: 'underline',
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
