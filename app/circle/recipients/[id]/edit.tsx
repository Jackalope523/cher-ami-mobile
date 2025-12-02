import TrashIcon from '@/assets/icons/trash.svg';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import NetworkImage from '@/components/NetworkImage';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import {
  useGetPriceQuery,
  useGetRecipientQuery,
  useUpdateRecipientMutation,
} from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function EditRecipient() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const getPriceQuery = useGetPriceQuery();
  const showToastMessage = useToastMessage();
  const { data, status } = useGetRecipientQuery(Number(id));
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const mutation = useUpdateRecipientMutation(
    () => {
      showToastMessage(
        'Successfully updated recipient.',
        ToastMessageType.Success,
      );
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
      queryClient.invalidateQueries({ queryKey: ['Recipient', Number(id)] });
      router.back();
    },
    () => {
      showToastMessage('Failed to update recipient.', ToastMessageType.Error);
    },
  );

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
      setAvatar(data.avatarPath);
      setTitle(data.title);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setStreet(data.street);
      setUnitNumber(data.unitNumber);
      setCity(data.city);
      setProvinceOrState(data.provinceOrState);
      setPostalCode(data.postalCode);
      setCountry(data.country);
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
        compress: 0.5,
      });

      setAvatar(jpgImage.uri);
    }
  }

  function buttonDisabled() {
    if (data) {
      return (
        (avatar === data.avatarPath &&
          title === data.title &&
          firstName === data.firstName &&
          lastName === data.lastName &&
          street === data.street &&
          unitNumber === data.unitNumber &&
          city === data.city &&
          country === data.country &&
          provinceOrState === data.provinceOrState &&
          postalCode === data.postalCode) ||
        mutation.isPending
      );
    }

    return true;
  }

  function handleSaveChanges() {
    if (data) {
      mutation.mutate({
        id: Number(id),
        title,
        firstName,
        lastName,
        street,
        city,
        provinceOrState,
        postalCode,
        country,
        unitNumber,
        avatarPath: avatar !== data.avatarPath ? avatar : undefined,
      });
    }
  }

  if (status === 'error' || getPriceQuery.isError) {
    return <Error />;
  }

  if (status === 'pending' || getPriceQuery.isLoading) {
    return <Loading />;
  }

  if (!data || !getPriceQuery.data) {
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
      <PopPressable onPress={pickImageAsync}>
        {avatar !== data.avatarPath ? (
          <Image style={styles.avatar} source={avatar} />
        ) : (
          <NetworkImage
            style={styles.avatar}
            source={`${data.avatarPath}?timestamp=${data.avatarTimestamp}`}
          />
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
            {' '}
            ${getPriceQuery.data / 100}.00
          </Text>
        </View>
        <Text style={[textStyles.caption, styles.disclaimer]}>
          *Monthly subscription that charges you every month, starting October
          1.
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
