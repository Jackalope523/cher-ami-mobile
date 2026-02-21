import UserIcon from '@/assets/icons/user-round.svg';
import Placeholder from '@/assets/images/placeholder.png';
import { useAuth } from '@/components/AuthProvider';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useDeleteRecipientMutation, useGetRecipientQuery } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DeleteRecipient() {
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams();
  const { getToken } = useAuth();
  const { data, status } = useGetRecipientQuery(Number(id));
  const mutation = useDeleteRecipientMutation(
    () => {
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
      router.replace('/(drawer)/manage');
    },
    () => {
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
    },
  );

  if (status === 'error') {
    return <Error />;
  }

  if (status === 'pending') {
    return <Loading />;
  }

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={[textStyles.heading1, styles.screenHeader]}>
          Remove recipient?
        </Text>

        {data.avatarPath ? (
          <Image
            style={styles.avatar}
            placeholder={Placeholder}
            placeholderContentFit="fill"
            source={{
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
              uri: data.avatarPath,
            }}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: '#F4F1EA',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            <UserIcon height={48} width={48} color={'#868581'} />
          </View>
        )}
        <Text style={[textStyles.heading2, styles.recipientName]}>
          {data.name}
        </Text>
        <Text style={textStyles.body}>
          By removing {data.name} from the recipients, they will{' '}
          <Text style={[textStyles.body, { fontWeight: 'bold' }]}>
            stop receiving
          </Text>{' '}
          print-out magazines.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <PopPressable
          onPress={() => {
            mutation.mutate({ Id: Number(id) });
          }}
          disabled={mutation.isPending}
          style={[styles.removeButton]}>
          <Text style={textStyles.buttonTextBlack}>Remove</Text>
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
