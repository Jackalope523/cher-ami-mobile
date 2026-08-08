import CheckIcon from '@/assets/icons/check.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import PopPressable from './PopPressable';
import { useDialogueModal } from './modals/DialogueModalProvider';

interface MilitaryQuestionContentsProps {
  isVeteran: boolean;
  onChange: (value: boolean) => void;
}

/**
 * The Military Edition question, kept behind a quiet link rather than sitting
 * in the form: it applies to a small minority, and an unmissable discount
 * checkbox invites everyone else to wonder whether they should tick it.
 */
export default function MilitaryQuestionContents({
  isVeteran,
  onChange,
}: MilitaryQuestionContentsProps) {
  const { dismissDialogue } = useDialogueModal();
  const [checked, setChecked] = useState(isVeteran);

  function handleDone() {
    onChange(checked);
    dismissDialogue();
  }

  return (
    <View>
      <Text style={[textStyles.heading3, { marginBottom: Spacings.md }]}>
        Military Edition
      </Text>
      <Text style={[textStyles.body, { marginBottom: Spacings.lg }]}>
        If this magazine is going to a veteran or service member, the Military
        Edition takes 20% off every month. We deliver to APO, FPO, and DPO
        addresses too.
      </Text>

      <Pressable
        onPress={() => setChecked((value) => !value)}
        style={styles.checkboxRow}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <CheckIcon height={16} width={16} color="#FFFFFF" />}
        </View>
        <Text style={[textStyles.body, { flexShrink: 1 }]}>
          Yes, I confirm this recipient is a veteran or military service member
        </Text>
      </Pressable>

      <PopPressable onPress={handleDone} style={styles.button}>
        <Text style={textStyles.buttonTextWhite}>Done</Text>
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.mdsm,
    marginBottom: Spacings.xl,
  },

  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#DEDBD5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#779443',
    borderColor: '#779443',
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
