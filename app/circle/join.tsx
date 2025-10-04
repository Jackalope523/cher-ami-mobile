import { BannerMessageType } from '@/components/BannerMessage';
import Button, { ButtonType } from '@/components/Button';
import LizardTextInput, { InputType } from '@/components/LizardTextInput';
import { useToastMessage } from '@/components/modals/ToastMessageProvider';
import { Spacings } from '@/constants/Spacings';
import { useJoinCircleMutation } from '@/lib/hooks';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function JoinCircle() {
  const showToastMessage = useToastMessage();

  const [code, setCode] = useState('');
  const [validCode, setValidCode] = useState(false);

  const joinCircleMutation = useJoinCircleMutation(
    () => {
      showToastMessage('Joined circle!', BannerMessageType.Success);
      router.replace('/upload');
    },
    (error) => {
      console.error('Circle join failed: ', error);
      showToastMessage('Failed to join circle.', BannerMessageType.Error);
    },
  );

  function handleSubmit() {
    joinCircleMutation.mutate({ code: code });
  }

  return (
    <View style={styles.container}>
      <LizardTextInput
        type={InputType.CircleCode}
        label="Circle Code"
        valid={validCode}
        setValid={setValidCode}
        text={code}
        setText={setCode}
        autoComplete="name"
        inputMode="text"
        maxLength={100}
        required
      />
      <Button
        text={'Join Circle'}
        onPress={handleSubmit}
        type={ButtonType.Success}
        disabled={!validCode || joinCircleMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacings.lg,
    rowGap: Spacings.lg,
  },
});
