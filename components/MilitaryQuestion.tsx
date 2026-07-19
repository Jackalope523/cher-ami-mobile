import CheckIcon from '@/assets/icons/check.svg';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

interface MilitaryQuestionProps {
  isVeteran: boolean;
  onChange: (value: boolean) => void;
}

export default function MilitaryQuestion({
  isVeteran,
  onChange,
}: MilitaryQuestionProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onChange(!isVeteran)}
        style={styles.checkboxRow}>
        <View style={[styles.checkbox, isVeteran && styles.checkboxChecked]}>
          {isVeteran && <CheckIcon height={16} width={16} color="#FFFFFF" />}
        </View>
        <Text style={[textStyles.body, { flexShrink: 1 }]}>
          Sending to a veteran or military service member?
        </Text>
      </Pressable>
      <Text style={[textStyles.caption, styles.caption]}>
        {isVeteran
          ? 'Military Edition applied — 20% off every month. We deliver to APO, FPO, and DPO addresses too.'
          : 'If so, the Military Edition gives you 20% off. We deliver to APO, FPO, and DPO addresses too.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.mdsm,
    borderWidth: 1.5,
    borderColor: '#DEDBD5',
    padding: Spacings.md,
    rowGap: Spacings.sm,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.mdsm,
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

  caption: {
    marginLeft: 24 + Spacings.mdsm,
  },
});
