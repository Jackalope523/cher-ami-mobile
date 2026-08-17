import Squirrel from '@/assets/images/squirrel.png';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetCircleQuery, useGetSelfQuery } from '@/lib/hooks';
import { firstStepHref } from '@/lib/onboarding';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STEPS = [
  'Add photos to fill the current month’s magazine.',
  'Invite the family so everyone can add their photos too.',
  'Add a recipient who will get the magazine in the mail.',
];

export default function Welcome() {
  const userQuery = useGetSelfQuery();
  const circleQuery = useGetCircleQuery();

  // Wait for both: they decide whether we ask for a name and whether the user
  // was already invited into someone's family circle. Surface a failure rather
  // than routing on a half-known answer — see circleStepHref.
  if (userQuery.isError || circleQuery.isError) {
    return <Error />;
  }

  if (userQuery.isLoading || circleQuery.isLoading) {
    return <Loading />;
  }

  function handleContinue() {
    router.push(firstStepHref(userQuery.data, circleQuery.data));
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
        <View style={{ alignItems: 'center', marginBottom: Spacings.lg }}>
          {/* The declared ratio has to match squirrel.png's own 500x410, or
              expo-image's default "cover" crops the difference away. */}
          <Image
            source={Squirrel}
            contentFit="contain"
            style={{
              width: '100%',
              aspectRatio: 500 / 410,
              maxWidth: 220,
            }}
          />
        </View>

        <Text
          style={[
            textStyles.fancyText,
            { textAlign: 'center', marginBottom: Spacings.md },
          ]}>
          Welcome to Cher Ami!
        </Text>
        <Text
          style={[
            textStyles.body,
            { textAlign: 'center', marginBottom: Spacings.xl },
          ]}>
          Every month, your family&apos;s photos become a printed magazine we
          mail to someone you love. Here&apos;s how it works:
        </Text>

        <View style={{ rowGap: Spacings.md, marginBottom: Spacings.xl }}>
          {STEPS.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={textStyles.buttonTextWhite}>{index + 1}</Text>
              </View>
              <Text style={[textStyles.body, { flexShrink: 1 }]}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <PopPressable onPress={handleContinue} style={styles.button}>
        <Text style={textStyles.buttonTextWhite}>Let&apos;s get started!</Text>
      </PopPressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: Spacings.lgmd,
    justifyContent: 'space-between',
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.mdsm,
  },

  stepNumber: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#C15F3C',
    alignItems: 'center',
    justifyContent: 'center',
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
