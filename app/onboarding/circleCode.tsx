import CopyIcon from '@/assets/icons/copy.svg';
import RefreshIcon from '@/assets/icons/refresh.svg';
import {
  ToastMessageType,
  useToastMessage,
} from '@/components/modals/ToastMessageProvider';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetCircleQuery, useRerollCodeMutation } from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { setStringAsync } from 'expo-clipboard';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CircleCode() {
  const showToastMessage = useToastMessage();
  const queryClient = useQueryClient();
  const { data } = useGetCircleQuery();
  const mutation = useRerollCodeMutation(
    (_) => {
      queryClient.invalidateQueries({ queryKey: ['CircleCode'] });
    },
    (_) => showToastMessage('Failed to reroll code', ToastMessageType.Error),
  );

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const rotate = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const pop = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handleReroll() {
    mutation.mutate();

    rotation.value = withTiming(rotation.value + 360, {
      duration: 1000,
    });
  }

  const copyToClipboard = async () => {
    scale.value = withTiming(1.03, { duration: 150 }, () => {
      scale.value = withTiming(1, { duration: 150 });
    });

    await setStringAsync(data?.inviteCode ?? '');
    showToastMessage('Invitation code copied to clipboard');
  };

  function handleContinue() {
    router.replace('/feed');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text
          style={[
            textStyles.heading1,
            {
              marginBottom: Spacings.md,
            },
          ]}>
          Invite members to
          <Text style={{ color: '#C15F3C' }}>{data?.title}</Text>
        </Text>
        <Text style={[textStyles.body, { marginBottom: Spacings.xl }]}>
          Share this code to invite others. They can enter it when signing up.
        </Text>
        <Text
          style={[textStyles.labelLargeBlack, { marginBottom: Spacings.smxs }]}>
          Invitation code
        </Text>
        <Pressable onPress={copyToClipboard}>
          <Animated.View
            style={[
              pop,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderWidth: 2,
                borderColor: '#C15F3C',
                paddingVertical: Spacings.mdsm,
                paddingHorizontal: Spacings.md,
                borderRadius: borderRadius.mdsm,
                marginBottom: Spacings.mdsm,
              },
            ]}>
            <Text style={textStyles.buttonTextOrange}>{data?.inviteCode}</Text>

            <CopyIcon height={24} width={24} />
          </Animated.View>
        </Pressable>
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
      <Pressable
        onPress={handleContinue}
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
          Continue
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: Spacings.lgmd,
    justifyContent: 'space-between',
    marginTop: Spacings.xl,
  },

  button: {
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
