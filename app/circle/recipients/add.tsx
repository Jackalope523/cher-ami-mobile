import PlusIcon from '@/assets/icons/plus.svg';
import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useAddRecipientMutation } from '@/lib/hooks';
import { SetupParams, useStripe } from '@stripe/stripe-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router } from 'expo-router';

export default function AddRecipient() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [avatar, setAvatar] = useState('');
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [provinceOrState, setProvinceOrState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  const addRecipientMutation = useAddRecipientMutation(
    () => {
      showToastMessage('Recipient added!', ToastMessageType.Success);
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
      router.back();
    },
    (error) => {
      console.error('Failed to add recipient:', error);
      showToastMessage('Failed to add recipient.', ToastMessageType.Error);
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
      avatar === '' ||
      firstName === '' ||
      lastName === '' ||
      street === '' ||
      city === '' ||
      provinceOrState === '' ||
      postalCode === '' ||
      country === '' ||
      addRecipientMutation.isPending
    );
  }

  async function pickImageAsync() {
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const image = await ImageManipulator.manipulate(
        result.assets[0].uri,
      ).renderAsync();
      const jpgImage = await image.saveAsync({
        format: SaveFormat.JPEG,
      });

      setAvatar(jpgImage.uri);
    }
  }

  function handleAdd() {
    addRecipientMutation.mutate({
      avatarUri: avatar,
      avatarName: 'avatar.jpg',
      title: title,
      firstName: firstName,
      lastName: lastName,
      unitNumber: unitNumber,
      street: street,
      city: city,
      provinceOrState: provinceOrState,
      postalCode: postalCode,
      country: country,
    });
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
      <PopPressable style={styles.avatarContainer} onPress={pickImageAsync}>
        {avatar ? (
          <Image source={avatar} style={styles.avatar} />
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
          title={'Title'}
          maxLength={25}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          title={'First name'}
          maxLength={100}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          title={'Last name'}
          maxLength={100}
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          title={'Street address'}
          maxLength={150}
          value={street}
          onChangeText={setStreet}
        />
        <TextInput
          title={'Unit number'}
          maxLength={15}
          value={unitNumber}
          onChangeText={setUnitNumber}
        />
        <TextInput
          title={'City'}
          maxLength={50}
          value={city}
          onChangeText={setCity}
        />
        <View
          style={{
            flexDirection: 'row',
            columnGap: 20,
          }}>
          <TextInput
            title={'State'}
            maxLength={50}
            value={provinceOrState}
            onChangeText={setProvinceOrState}
            containerStyle={{
              width: Dimensions.get('window').width / 2 - 20 - 10,
            }}
          />
          <TextInput
            title={'ZIP code'}
            maxLength={20}
            value={postalCode}
            onChangeText={setPostalCode}
            containerStyle={{
              width: Dimensions.get('window').width / 2 - 20 - 10,
            }}
          />
        </View>
        <TextInput
          title={'Country'}
          maxLength={56}
          value={country}
          onChangeText={setCountry}
          editable={false}
        />
      </View>
      {/* <Text style={[textStyles.heading3, styles.sectionHeader]}>
            Summary
          </Text>
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
              <Text style={textStyles.labelLargeBlack}>
                Estimated sales tax
              </Text>
              <Text style={textStyles.labelSmall}>---</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={textStyles.labelSmall}>Total</Text>
              <Text style={textStyles.labelSmall}>$12,00</Text>
            </View>
            <Text style={[textStyles.caption, styles.disclaimer]}>
              *Monthly subscription that charges you every month, starting
              October 1.
            </Text>
          </View> */}
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
