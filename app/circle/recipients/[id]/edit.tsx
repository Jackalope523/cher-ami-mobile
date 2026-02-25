import PlusIcon from '@/assets/icons/plus.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import Placeholder from '@/assets/images/placeholder.png';
import { useAuth } from '@/components/AuthProvider';
import Error from '@/components/Error';
import { useImagePicker } from '@/components/ImagePickerProvider';
import Loading from '@/components/Loading';
import MilitaryEditionModalContents from '@/components/MilitaryEditionModalContents';
import { useBottomSheetModal } from '@/components/modals/BottomSheetModalProvider';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  useGetPriceQuery,
  useGetRecipientQuery,
  useUpdateRecipientMutation,
} from '@/lib/hooks';
import { getNextMonthName } from '@/lib/utility';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function EditRecipient() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { displayBottomSheet, dismissBottomSheetModal } = useBottomSheetModal();
  const pickImageAsync = useImagePicker();
  const getPriceQuery = useGetPriceQuery();
  const showToastMessage = useToastMessage();
  const { data, status } = useGetRecipientQuery(Number(id));
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const mutation = useUpdateRecipientMutation(
    () => {
      showToastMessage('Updated recipient.', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
      queryClient.invalidateQueries({ queryKey: ['Recipient', Number(id)] });
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

  useEffect(() => {
    if (data) {
      navigation.setOptions({
        headerRight: () => (
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
        ),
      });
    }
  }, [data, id, navigation]);

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
      height: 96,
      width: 96,
      cropping: true,
    }).then((x) => {
      setAvatar(x);
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
      <PopPressable onPress={pickImage}>
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
            <PlusIcon height={48} width={48} color={'#868581'} />
          </View>
        )}
      </PopPressable>
      <Text style={[textStyles.labelLargeBlack, styles.changeAvatar]}>
        Change avatar
      </Text>
      <Text style={[textStyles.heading3, styles.sectionHeader]}>
        Mailing address
      </Text>
      <View style={styles.textInputs}>
        <TextInput
          title="Name*"
          maxLength={100}
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
        <PopPressable
          onPress={() => {
            if (isVeteran) {
              setIsVeteran(false);
            } else {
              displayBottomSheet(
                <MilitaryEditionModalContents
                  dismissModal={dismissBottomSheetModal}
                  setIsVeteran={setIsVeteran}
                />,
              );
            }
          }}
          style={[
            styles.button,
            {
              backgroundColor: isVeteran ? '#ECEDEF' : '#779443',
              borderColor: isVeteran ? '#ECEDEF' : '#779443',
            },
          ]}>
          <Text
            style={[
              textStyles.buttonTextWhite,
              { color: isVeteran ? '#A8ABB3' : '#FFFFFF' },
              { fontWeight: isVeteran ? 'bold' : 'normal' },
            ]}>
            {isVeteran
              ? 'Military Edition Activated'
              : 'Activate Military Edition'}
          </Text>
        </PopPressable>
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
          <Text style={textStyles.labelSmall}>
            $
            {(isVeteran
              ? getPriceQuery.data.militaryEditionPrice
              : getPriceQuery.data.standardEditionPrice) / 100}
          </Text>
        </View>
        <Text style={[textStyles.caption, styles.disclaimer]}>
          {`*Monthly subscription that charges you every month, starting ${getNextMonthName()} 1st.`}
        </Text>
      </View>
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
