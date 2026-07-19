import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { StyleSheet, Text, View } from 'react-native';
import { useDialogueModal } from './modals/DialogueModalProvider';
import PopPressable from './PopPressable';

interface WelcomeModalContentsProps {
  firstName?: string;
}

const STEPS = [
  'Add photos — they fill this month’s magazine.',
  'Invite family so everyone can add their photos too.',
  'Add a recipient — the person who gets the magazine in the mail.',
];

export default function WelcomeModalContents({
  firstName,
}: WelcomeModalContentsProps) {
  const { dismissDialogue } = useDialogueModal();

  return (
    <View>
      <Text
        style={[
          textStyles.fancyText,
          { textAlign: 'center', marginBottom: Spacings.md },
        ]}>
        {firstName ? `Welcome, ${firstName}!` : 'Welcome!'}
      </Text>
      <Text
        style={[
          textStyles.body,
          { textAlign: 'center', marginBottom: Spacings.lg },
        ]}>
        Here&apos;s how Cher Ami works:
      </Text>

      <View style={{ rowGap: Spacings.md, marginBottom: Spacings.lg }}>
        {STEPS.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={textStyles.buttonTextWhite}>{index + 1}</Text>
            </View>
            <Text style={[textStyles.body, { flexShrink: 1 }]}>{step}</Text>
          </View>
        ))}
      </View>

      <Text
        style={[
          textStyles.caption,
          { textAlign: 'center', marginBottom: Spacings.lg },
        ]}>
        Your first magazine is on us.
      </Text>

      <PopPressable onPress={dismissDialogue} style={styles.button}>
        <Text style={textStyles.buttonTextWhite}>Let&apos;s go</Text>
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
});
