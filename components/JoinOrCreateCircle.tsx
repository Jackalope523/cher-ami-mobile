import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import PopPressable from '@/components/PopPressable';
import TextInput from '@/components/TextInput';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useJoinCircleMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface JoinOrCreateCircleProps {
  /** Set during first-run onboarding, which continues the flow after either choice. */
  onboarding?: boolean;
  onJoined?: () => void;
}

export default function JoinOrCreateCircle({
  onboarding = false,
  onJoined,
}: JoinOrCreateCircleProps) {
  const queryClient = useQueryClient();
  const showToastMessage = useToastMessage();
  const [circleCode, setCircleCode] = useState('');
  const mutation = useJoinCircleMutation(
    async () => {
      await queryClient.invalidateQueries({ queryKey: ['Circle'] });
      showToastMessage("You're in!", ToastMessageType.Success);
      onJoined?.();
    },
    async (error) => {
      // The join endpoint refuses a 403 when the caller is already in a circle.
      // The invite code was fine, so don't send them looking for a typo — their
      // local view is just stale. Refresh it and carry on.
      if (error.response?.status === 403) {
        showToastMessage(
          "You're already in a family circle.",
          ToastMessageType.Informational,
        );
        await queryClient.invalidateQueries({ queryKey: ['Circle'] });
        onJoined?.();
        return;
      }

      console.log(error);
      showToastMessage(
        "Couldn't join. Double-check the code and try again.",
        ToastMessageType.Error,
      );
    },
  );

  function handleJoinPress() {
    Keyboard.dismiss();
    mutation.mutate({
      code: circleCode.trim(),
    });
  }

  function handleCreatePress() {
    router.push({
      pathname: '/onboarding/circleSetup',
      params: onboarding ? { onboarding: '1' } : {},
    });
  }

  function joinButtonDisabled() {
    return !circleCode.trim() || mutation.isPending;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
        <Text
          style={[
            textStyles.heading1,
            {
              marginBottom: Spacings.md,
            },
          ]}>
          Your family circle
        </Text>
        <Text
          style={[
            textStyles.body,
            {
              marginBottom: Spacings.xl,
            },
          ]}>
          A family circle is a private space where your family shares
          the photos that turn into your magazines.
        </Text>

        <View style={styles.card}>
          <Text style={[textStyles.heading4, { marginBottom: Spacings.sm }]}>
            Start a family circle
          </Text>
          <Text style={[textStyles.body, { marginBottom: Spacings.md }]}>
            The first one here? Start your family&apos;s circle, then invite
            everyone else!
          </Text>
          <PopPressable onPress={handleCreatePress} style={styles.button}>
            <Text style={textStyles.buttonTextWhite}>Start a family circle</Text>
          </PopPressable>
        </View>

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

        <View style={[styles.card, { marginBottom: Spacings.xl }]}>
          <Text style={[textStyles.heading4, { marginBottom: Spacings.sm }]}>
            Join your family&apos;s circle
          </Text>
          <Text style={[textStyles.body, { marginBottom: Spacings.md }]}>
            Did someone invite you? Enter their{' '}
            <Text style={{ fontWeight: 'bold' }}>invite code</Text> here. They can find
            it in the app by tapping{' '}
            <Text style={{ fontWeight: 'bold' }}>My Family Circle</Text>, then{' '}
            <Text style={{ fontWeight: 'bold' }}>Invite Family &amp; Friends</Text>
            .
          </Text>
          <View style={{ marginBottom: Spacings.md }}>
            <TextInput
              placeholder="Invite code (e.g. HappyPigeon)"
              maxLength={100}
              value={circleCode}
              onChangeText={setCircleCode}
              autoCapitalize="none"
              autoCorrect={false}
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
              Join
            </Text>
          </PopPressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: Spacings.lgmd,
  },

  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#DEDBD5',
    backgroundColor: '#FFFFFF',
    padding: Spacings.lgmd,
    marginBottom: Spacings.xl,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
  },

  divider: {
    flex: 1,
    borderWidth: 1.5 / 2,
    borderColor: '#DEDBD5',
  },
});
