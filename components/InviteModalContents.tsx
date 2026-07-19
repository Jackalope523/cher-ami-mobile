import XIcon from '@/assets/icons/circle-x.svg';
import CopyIcon from '@/assets/icons/copy.svg';
import RefreshIcon from '@/assets/icons/refresh.svg';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetCircleQuery, useRerollCodeMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { setStringAsync } from 'expo-clipboard';
import { Share, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  ToastMessageType,
  useToastMessage,
} from './modals/ToastMessageProvider';
import PopPressable from './PopPressable';

interface InviteModalContentsProps {
  dismissModal?: () => void;
}

export default function InviteModalContents({
  dismissModal = () => {},
}: InviteModalContentsProps) {
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const { data } = useGetCircleQuery();
  const mutation = useRerollCodeMutation(
    (_) => {
      queryClient.invalidateQueries({ queryKey: ['Circle'] });
    },
    (_) =>
      showToastMessage(
        "Couldn't create a new code. Try again.",
        ToastMessageType.Error,
      ),
  );

  const rotation = useSharedValue(0);

  const rotate = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  function handleReroll() {
    mutation.mutate();

    rotation.value = withTiming(rotation.value + 360, {
      duration: 1000,
    });
  }

  async function handleShare() {
    const circleName = data?.title ? `"${data.title}"` : 'our family circle';

    await Share.share({
      message:
        `Hi! Come join ${circleName} on Cher Ami — we share family photos there, ` +
        `and every month they become a printed magazine for the people we love.\n\n` +
        `Here's how to join:\n` +
        `1. Download the Cher Ami app: https://thecherami.com\n` +
        `2. Sign up, then choose "Join your family's circle"\n` +
        `3. Enter our invite code: ${data?.inviteCode}\n\n` +
        `See you there!`,
    });
  }

  const copyToClipboard = async () => {
    await setStringAsync(data?.inviteCode ?? '');
    showToastMessage('Invite code copied!');
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={[textStyles.labelLargeBlack, { marginBottom: Spacings.smxs }]}>
          Invite family &amp; friends
        </Text>
        <PopPressable onPress={dismissModal}>
          <XIcon height={24} width={24} color="#868581" />
        </PopPressable>
      </View>

      <Text
        style={[
          textStyles.caption,
          { marginBottom: Spacings.lgmd, paddingRight: 45 },
        ]}>
        Send an invitation by text, email, or however you like — it includes
        your invite code and simple instructions.
      </Text>

      <PopPressable onPress={handleShare} style={styles.shareButton}>
        <Text style={textStyles.buttonTextWhite}>Send an invitation</Text>
      </PopPressable>

      <View
        style={{
          borderColor: '#DEDBD5',
          borderWidth: 1.5,
          marginBottom: Spacings.mdsm,
        }}
      />
      <Text
        style={[textStyles.labelLargeBlack, { marginBottom: Spacings.smxs }]}>
        Or share the code yourself
      </Text>
      <Text style={[textStyles.caption, { marginBottom: Spacings.mdsm }]}>
        Tap to copy. They&apos;ll enter it when choosing &ldquo;Join your
        family&apos;s circle.&rdquo;
      </Text>
      <PopPressable
        onPress={copyToClipboard}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderWidth: 2,
          borderColor: '#C15F3C',
          paddingVertical: Spacings.mdsm,
          paddingHorizontal: Spacings.md,
          borderRadius: borderRadius.mdsm,
          marginBottom: Spacings.mdsm,
        }}>
        <Text style={textStyles.buttonTextOrange}>{data?.inviteCode}</Text>
        <CopyIcon height={24} width={24} />
      </PopPressable>
      <Pressable
        onPress={handleReroll}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          columnGap: Spacings.sm,
          paddingVertical: Spacings.mdsm,
        }}>
        <Text style={textStyles.buttonTextBlack}>Generate new code</Text>
        <Animated.View style={rotate}>
          <RefreshIcon height={24} width={24} />
        </Animated.View>
      </Pressable>
      <Text
        style={[
          textStyles.caption,
          { textAlign: 'center', marginBottom: Spacings.sm },
        ]}>
        Generating a new code stops the old one from working.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  shareButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    marginBottom: Spacings.lgmd,
  },
});
