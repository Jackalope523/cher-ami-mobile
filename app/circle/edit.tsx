import PlusIcon from '@/assets/icons/plus.svg';
import Placeholder from '@/assets/images/placeholder.png';
import { useAuth } from '@/components/AuthProvider';
import Error from '@/components/Error';
import { useImagePicker } from '@/components/ImagePickerProvider';
import Loading from '@/components/Loading';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetCircleQuery, useUpdateCircleMutation } from '@/lib/hooks';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

export default function EditRecipient() {
  const { getToken } = useAuth();
  const circleQuery = useGetCircleQuery();
  const updateCircleMutation = useUpdateCircleMutation();
  const pickImageAsync = useImagePicker();

  const [header, setHeader] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (circleQuery.data) {
      setHeader(circleQuery.data.headerUrl);
      setTitle(circleQuery.data.title);
    }
  }, [circleQuery.data]);

  function pickImage() {
    pickImageAsync({
      width: 2 * 186,
      height: 186,
      cropping: true,
    }).then((x) => {
      if (x !== null) {
        setHeader(x);
      }
    });
  }

  function buttonDisabled() {
    if (circleQuery.data) {
      return (
        (header === circleQuery.data.headerUrl &&
          title === circleQuery.data.title) ||
        updateCircleMutation.isPending
      );
    }

    return true;
  }

  function handleSaveChanges() {
    if (circleQuery.data) {
      updateCircleMutation.mutate({
        title: title,
        headerUrl: header !== circleQuery.data.headerUrl ? header : null,
      });
      router.back();
    }
  }

  if (circleQuery.isError) {
    return <Error />;
  }

  if (circleQuery.isLoading) {
    return <Loading />;
  }

  if (!circleQuery.data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <PopPressable onPress={pickImage}>
        {header === null ? (
          <View style={[styles.header, { backgroundColor: '#F4F1EA' }]}>
            <PlusIcon height={48} width={48} color={'#868581'} />
          </View>
        ) : (
          <PopPressable onPress={pickImage}>
            <Image
              style={{
                width: Dimensions.get('window').width - 40,
                aspectRatio: 2 / 1,
                borderRadius: 32,
                marginVertical: Spacings.xl,
              }}
              placeholder={Placeholder}
              placeholderContentFit="fill"
              source={{
                headers: {
                  Authorization: `Bearer ${getToken()}`,
                },
                uri:
                  header !== circleQuery.data.headerUrl
                    ? header
                    : circleQuery.data.headerUrl,
              }}
            />
          </PopPressable>
        )}
      </PopPressable>
      <Text style={[textStyles.labelLargeBlack, styles.changeAvatar]}>
        Change Header
      </Text>
      <View style={styles.textInputs}>
        <TextInput
          title="Title*"
          maxLength={100}
          value={title}
          onChangeText={setTitle}
          autoCapitalize="words"
          textContentType="givenName"
          autoComplete="name-given"
        />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FCFBF8',
  },

  header: {
    width: Dimensions.get('window').width - 40,
    aspectRatio: 2 / 1,
    borderRadius: 32,
    marginVertical: Spacings.xl,
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
