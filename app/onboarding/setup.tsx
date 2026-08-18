import CheckIcon from '@/assets/icons/check.svg';
import ChevronIcon from '@/assets/icons/chevron-right.svg';
import Loading from '@/components/Loading';
import PopPressable from '@/components/PopPressable';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetCircleQuery } from '@/lib/hooks';
import { useFinishOnboarding } from '@/lib/onboarding';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { OneSignal } from 'react-native-onesignal';

/**
 * The last onboarding screen: everything still worth doing, in one place.
 *
 * Someone who joined an existing circle sees only the notifications step —
 * see `isJoiner` below.
 *
 * Adding the first photo deliberately isn't here — it needs the crop and shape
 * flow, which is a lot to walk into mid-setup. It gets its own guidance the
 * first time someone posts instead.
 */
export default function Setup() {
  const { joined } = useLocalSearchParams();
  const circleQuery = useGetCircleQuery();
  const finishOnboarding = useFinishOnboarding();

  // Someone who joined a circle rather than starting one didn't choose who it
  // is for and isn't the one gathering the family, so inviting and adding a
  // recipient aren't theirs to do. Notifications are the part that still
  // matters — both remain reachable from the feed either way.
  const isJoiner = joined === '1';

  const [invited, setInvited] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    OneSignal.Notifications.getPermissionAsync().then(setNotificationsOn);
  }, []);

  async function handleNotifications() {
    if (notificationsOn) return;

    await OneSignal.Notifications.requestPermission(true);
    setNotificationsOn(await OneSignal.Notifications.getPermissionAsync());
  }

  const hasRecipient = (circleQuery.data?.recipients.length ?? 0) > 0;

  function handleInvite() {
    setInvited(true);
    router.push('/onboarding/invite');
  }

  async function handleFinish() {
    setFinishing(true);
    await finishOnboarding();
  }

  if (finishing) {
    return <Loading />;
  }

  function renderStep(
    title: string,
    description: string,
    done: boolean,
    onPress: () => void,
  ) {
    return (
      <PopPressable onPress={onPress} style={styles.step}>
        <View style={[styles.stepIcon, done && styles.stepIconDone]}>
          {done ? (
            <CheckIcon height={20} width={20} color={'#FCFBF8'} />
          ) : (
            <ChevronIcon height={20} width={20} />
          )}
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={textStyles.labelLargeBlack}>{title}</Text>
          <Text style={[textStyles.body, { color: '#868581' }]}>
            {description}
          </Text>
        </View>
      </PopPressable>
    );
  }

  return (
    <View style={styles.container}>
      {/* The padding sits on the scroll content, not the container: a row that
          pops to 1.03 on press has to grow into it, and a ScrollView clips
          anything wider than itself. */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        overScrollMode="never">
        <Text style={[textStyles.heading1, { marginBottom: Spacings.sm }]}>
          {isJoiner ? "You're in!" : 'Your family circle is ready!'}
        </Text>
        <Text style={[textStyles.body, { marginBottom: Spacings.lg }]}>
          {isJoiner
            ? 'Welcome to your family\u2019s circle! Let\u2019s get you up to speed. Turn on notifications so you know when someone adds a photo.'
            : 'A couple of things to speed up the first magazine. Or, do them later and get started adding photos right away!'}
        </Text>

        <View style={{ rowGap: Spacings.mdsm }}>
          {!isJoiner &&
            renderStep(
              'Invite your family',
              'Everyone can add their own photos.',
              invited,
              handleInvite,
            )}
          {!isJoiner &&
            renderStep(
              'Add a recipient',
              hasRecipient
                ? 'Their magazine is on its way at the end of the month.'
                : 'The person who gets the magazine in the mail.',
              hasRecipient,
              () => router.push('/circle/recipients/add'),
            )}
          {renderStep(
            'Turn on notifications',
            notificationsOn
              ? 'We’ll let you know when photos are added.'
              : 'Hear when the family adds photos, and before each magazine closes.',
            notificationsOn,
            handleNotifications,
          )}
        </View>
      </ScrollView>

      <PopPressable onPress={handleFinish} style={styles.button}>
        <Text style={textStyles.buttonTextWhite}>Let&apos;s go!</Text>
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    justifyContent: 'space-between',
  },

  scrollContent: {
    paddingHorizontal: Spacings.lgmd,
  },

  step: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#DEDBD5',
    backgroundColor: '#FFFFFF',
    padding: Spacings.md,
  },

  stepIcon: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#F4F1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepIconDone: {
    backgroundColor: '#9AD47C',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    marginVertical: Spacings.lgmd,
    marginHorizontal: Spacings.lgmd,
  },
});
