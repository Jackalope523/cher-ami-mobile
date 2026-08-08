import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { withCalendarDay } from '@/lib/utility';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDialogueModal } from './modals/DialogueModalProvider';
import PopPressable from './PopPressable';

interface PhotoDatePickerContentsProps {
  value: Date;
  issueStart: Date;
  onSelect: (date: Date) => void;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayLabel(day: Date, today: Date): string {
  const diffDays = Math.round(
    (today.getTime() - day.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return day.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function PhotoDatePickerContents({
  value,
  issueStart,
  onSelect,
}: PhotoDatePickerContentsProps) {
  const { dismissDialogue } = useDialogueModal();

  const today = startOfDay(new Date());
  const firstDay = startOfDay(issueStart);
  const selectedDay = startOfDay(value).getTime();

  const days: Date[] = [];
  for (
    let day = new Date(today);
    day >= firstDay && days.length < 62;
    day.setDate(day.getDate() - 1)
  ) {
    days.push(new Date(day));
  }

  function handleSelect(day: Date) {
    onSelect(withCalendarDay(day, value));
    dismissDialogue();
  }

  return (
    <View>
      <Text
        style={[
          textStyles.heading3,
          { textAlign: 'center', marginBottom: Spacings.md },
        ]}>
        When was this photo taken?
      </Text>
      <ScrollView style={styles.list}>
        {days.map((day) => {
          const selected = day.getTime() === selectedDay;
          return (
            <PopPressable
              key={day.toISOString()}
              onPress={() => handleSelect(day)}
              style={[styles.dayRow, selected && styles.dayRowSelected]}>
              <Text
                style={[
                  textStyles.body,
                  selected && { color: '#FCFBF8', fontWeight: '600' },
                ]}>
                {dayLabel(day, today)}
              </Text>
            </PopPressable>
          );
        })}
      </ScrollView>
      <PopPressable onPress={dismissDialogue} style={styles.cancelButton}>
        <Text style={textStyles.buttonTextBlack}>Cancel</Text>
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 320,
    marginBottom: Spacings.md,
  },

  dayRow: {
    paddingVertical: Spacings.mdsm,
    paddingHorizontal: Spacings.md,
    borderRadius: borderRadius.sm,
    marginBottom: Spacings.xs,
    backgroundColor: '#F4F1EA',
  },

  dayRowSelected: {
    backgroundColor: '#C15F3C',
  },

  cancelButton: {
    paddingVertical: Spacings.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#242832',
  },
});
