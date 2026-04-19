import XIcon from '@/assets/icons/circle-x.svg';
import CopyIcon from '@/assets/icons/copy.svg';
import RefreshIcon from '@/assets/icons/refresh.svg';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetCircleQuery, useRerollCodeMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { setStringAsync } from 'expo-clipboard';
import { StyleSheet, Text, View } from 'react-native';
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
    (_) => showToastMessage('Failed to reroll code', ToastMessageType.Error),
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

  const copyToClipboard = async () => {
    await setStringAsync(data?.inviteCode ?? '');
    showToastMessage('Invitation code copied to clipboard');
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={[textStyles.labelLargeBlack, { marginBottom: Spacings.smxs }]}>
          Invite to circle
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
        Share this code to invite people to this circle. They can enter it at
        sign-up to join.
      </Text>
      <View
        style={{
          borderColor: '#DEDBD5',
          borderWidth: 1.5,
          marginBottom: Spacings.mdsm,
        }}
      />
      <Text
        style={[textStyles.labelLargeBlack, { marginBottom: Spacings.smxs }]}>
        Invitation code
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
    </View>
  );
}
const styles = StyleSheet.create({});
