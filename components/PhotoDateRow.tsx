import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { formatPhotoDate } from '@/lib/utility';
import { StyleSheet, Text, View } from 'react-native';
import { useDialogueModal } from './modals/DialogueModalProvider';
import PhotoDatePickerContents from './PhotoDatePickerContents';
import PopPressable from './PopPressable';

interface PhotoDateRowProps {
  value: Date;
  issueStart: Date;
  onChange: (date: Date) => void;
}

export default function PhotoDateRow({
  value,
  issueStart,
  onChange,
}: PhotoDateRowProps) {
  const { displayDialogue } = useDialogueModal();

  function handleChange() {
    displayDialogue(
      <PhotoDatePickerContents
        value={value}
        issueStart={issueStart}
        onSelect={onChange}
      />,
    );
  }

  return (
    <View style={styles.row}>
      <Text style={[textStyles.body, { color: '#868581', flexShrink: 1 }]}>
        {formatPhotoDate(value)}
      </Text>
      <PopPressable onPress={handleChange}>
        <Text style={[textStyles.labelLargeBlack, { color: '#C15F3C' }]}>
          Change
        </Text>
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: Spacings.md,
    columnGap: Spacings.md,
  },
});
