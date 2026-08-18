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
        We mail magazines anywhere in the United States and
        military addresses such as APO, FPO, and DPOs. Shipping is
        always free.
      </Text>
      <Text style={[textStyles.body, { marginBottom: Spacings.lg }]}>
        We don&apos;t mail to other countries yet but family living abroad can still
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
