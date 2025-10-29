import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useJoinCircleMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function JoinOrCreateCircle() {
  const queryClient = useQueryClient();
  const showToastMessage = useToastMessage();
  const [circleCode, setCircleCode] = useState('');
  const mutation = useJoinCircleMutation(
    async () => {
      await queryClient.refetchQueries({ queryKey: ['Circle'] });
      showToastMessage('Successfully joined circle.', ToastMessageType.Success);
    },
    (error) => {
      console.log(error);
      showToastMessage('Failed to join circle.', ToastMessageType.Error);
    },
  );

  function handleJoinPress() {
    mutation.mutate({
      code: circleCode,
    });
  }

  function handleCreatePress() {
    router.push('/onboarding/circleName');
  }

  function joinButtonDisabled() {
    return !circleCode || mutation.isPending;
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          textStyles.heading1,
          {
            marginBottom: Spacings.md,
          },
        ]}>
        Join circle
      </Text>
      <Text
        style={[
          textStyles.body,
          {
            marginBottom: Spacings.xl,
          },
        ]}>
        Please enter the <Text style={{ fontWeight: 'bold' }}>code </Text>
        that was sent to you by the person who invited you to join the circle.
      </Text>
      <View style={{ marginBottom: Spacings.md }}>
        <TextInput
          placeholder="Circle code"
          maxLength={100}
          value={circleCode}
          onChangeText={setCircleCode}
        />
      </View>

      <PopPressable
        onPress={handleJoinPress}
        disabled={joinButtonDisabled()}
        style={[
          styles.button,
          joinButtonDisabled() && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            joinButtonDisabled() && { color: '#A8ABB3' },
          ]}>
          Join circle
        </Text>
      </PopPressable>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: Spacings.xl,
        }}>
        <View style={styles.divider} />
        <Text
          style={[
            textStyles.labelLargeGrey,
            { marginHorizontal: Spacings.mdsm },
          ]}>
          OR
        </Text>
        <View style={styles.divider} />
      </View>

      <Text
        style={[
          textStyles.heading1,
          {
            marginBottom: Spacings.md,
          },
        ]}>
        Create circle
      </Text>
      <Text
        style={[
          textStyles.body,
          {
            marginBottom: Spacings.xl,
          },
        ]}>
        Start your own circle and invite others to join.
      </Text>

      <PopPressable
        onPress={handleCreatePress}
        disabled={false}
        style={[
          styles.button,
          false && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[textStyles.buttonTextWhite, false && { color: '#A8ABB3' }]}>
          Create circle
        </Text>
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: Spacings.lgmd,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    marginBottom: Spacings.xl,
  },

  divider: {
    flex: 1,
    borderWidth: 1.5 / 2,
    borderColor: '#DEDBD5',
  },
});
