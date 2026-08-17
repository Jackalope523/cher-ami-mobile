import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { StyleSheet, Text, View } from 'react-native';
import PopPressable from './PopPressable';
import { useDialogueModal } from './modals/DialogueModalProvider';

/**
 * Why the country field can't be changed. Reachable by tapping the field, which
 * is otherwise a dead end — it looks like an input but never responds.
 */
export default function CountryHelpContents() {
  const { dismissDialogue } = useDialogueModal();

  return (
    <View>
      <Text style={[textStyles.heading3, { marginBottom: Spacings.md }]}>
        Where we deliver
      </Text>
      <Text style={[textStyles.body, { marginBottom: Spacings.md }]}>
        We mail magazines anywhere in the United States, and shipping is always
        free. That includes military addresses — APO, FPO, and DPO all arrive
        just fine.
      </Text>
      <Text style={[textStyles.body, { marginBottom: Spacings.md }]}>
        If this magazine is going to a veteran or service member, the Military
        Edition takes 20% off every month.
      </Text>
      <Text style={[textStyles.body, { marginBottom: Spacings.lg }]}>
        We can&apos;t mail outside the US yet. Family living abroad can still
        join your family circle and add photos from the app.
      </Text>

      <PopPressable onPress={dismissDialogue} style={styles.button}>
        <Text style={textStyles.buttonTextWhite}>Got it</Text>
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
