import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useDeleteUserMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { useAuth } from './AuthProvider';
import Error from './Error';
import Loading from './Loading';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';
import PopPressable from './PopPressable';
import TextInput from './TextInput';

interface DeleteAccountContentsProps {
  dismissModal?: () => void;
}

export default function DeleteAccountContents({
  dismissModal = () => {},
}: DeleteAccountContentsProps) {
  const showToastMessage = useToastMessage();
  const [text, setText] = useState('');
  const queryClient = useQueryClient();
  const { deleteToken, updateOnboarded } = useAuth();
  const deleteAccountMutation = useDeleteUserMutation(
    () => {
      showToastMessage('Accound Deleted', ToastMessageType.Success);
      updateOnboarded(false);
      deleteToken();
      dismissModal();
    },
    () => {
      showToastMessage('Network error. Try again.', ToastMessageType.Error);
      dismissModal();
    },
  );

  function buttonDisabled() {
    return text !== 'DELETE' || deleteAccountMutation.isPending;
  }

  if (deleteAccountMutation.isError) {
    return (
      <View
        style={{
          height: Dimensions.get('window').height * 0.3,
          width: Dimensions.get('window').height * 0.3,
        }}>
        <Error />
      </View>
    );
  }

  if (deleteAccountMutation.isPending) {
    return (
      <View
        style={{
          height: Dimensions.get('window').height * 0.3,
          width: Dimensions.get('window').height * 0.3,
        }}>
        <Loading />
      </View>
    );
  }

  return (
    <Pressable onPress={Keyboard.dismiss}>
      <Text
        style={[
          textStyles.heading3,
          { textAlign: 'center', marginBottom: Spacings.md },
        ]}>
        Delete Account?
      </Text>
      <Text
        style={[
          textStyles.body,
          { textAlign: 'center', marginBottom: Spacings.xxl },
        ]}>
        Once you delete your account, it will be gone for good and cannot be
        restored.
      </Text>
      <TextInput
        title={'Type "DELETE" to proceed.'}
        value={text}
        onChangeText={setText}
      />
      <PopPressable
        onPress={() => {
          deleteAccountMutation.mutate();
        }}
        disabled={buttonDisabled()}
        style={{
          backgroundColor: buttonDisabled() ? '#ECEDEF' : '#F47A70',
          paddingVertical: Spacings.md,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: buttonDisabled() ? '#ECEDEF' : '#F47A70',
          marginTop: Spacings.xxl,
          marginBottom: Spacings.mdsm,
        }}>
        <Text style={textStyles.buttonTextBlack}>Delete</Text>
      </PopPressable>
      <PopPressable
        onPress={dismissModal}
        style={{
          paddingVertical: Spacings.md,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#242832',
        }}>
        <Text style={textStyles.buttonTextBlack}>Cancel</Text>
      </PopPressable>
    </Pressable>
  );
}
const styles = StyleSheet.create({});
