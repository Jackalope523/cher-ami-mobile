import ChevronIcon from '@/assets/icons/chevron.svg';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { usePostCountQuery } from '@/lib/hooks';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

type PostCounterProps = {
  issueTitle?: string | null | undefined;
  issueCloseDate?: Date | string | null | undefined;
  maxPosts?: number;
};

export default function PostCounter({
  issueTitle = 'Issue 1',
  issueCloseDate = null,
  maxPosts = 20,
}: PostCounterProps) {
  const { data } = usePostCountQuery();
  const [expanded, setExpanded] = useState(false);

  const count = data ?? 0;
  const percentage = Math.min(100, Math.round((100 * count) / maxPosts));
  const remaining = Math.max(0, maxPosts - count);

  const closeDate = issueCloseDate ? new Date(issueCloseDate) : null;
  const closeDateText =
    closeDate && !isNaN(closeDate.getTime())
      ? closeDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        })
      : null;

  const progress = useDerivedValue(() => {
    return data ? withTiming((100 * data) / maxPosts, { duration: 500 }) : 0;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 50, 100],
      ['#F47A70', '#F6CE4B', '#9AD47C'],
    );

    return {
      backgroundColor: backgroundColor,
      width: `${progress.value}%`,
    };
  });

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: withTiming(expanded ? '180deg' : '0deg', { duration: 200 }) },
      ],
    };
  });

  return (
    <View style={styles.issueStateContainer}>
      <Pressable
        onPress={() => setExpanded((value) => !value)}
        style={{ rowGap: Spacings.sm }}>
        <View style={styles.issueStateInfo}>
          <Text style={textStyles.labelLargeBlack}>{issueTitle}</Text>
          <View style={styles.percentageContainer}>
            <Text style={textStyles.labelLargeBlack}>{percentage}% full</Text>
            <Animated.View style={chevronStyle}>
              <ChevronIcon height={20} width={20} />
            </Animated.View>
          </View>
        </View>

        <View style={[styles.loadingBar]}>
          <Animated.View style={[styles.loadingBar, animatedStyle]} />
        </View>
      </Pressable>

      {expanded && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(100)}
          style={styles.detailsContainer}>
          {closeDateText && (
            <View style={styles.detailRow}>
              <Text style={textStyles.labelSmall}>Closes</Text>
              <Text style={textStyles.labelLargeBlack}>{closeDateText}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={textStyles.labelSmall}>Photos added</Text>
            <Text style={textStyles.labelLargeBlack}>
              {count} of {maxPosts}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={textStyles.labelSmall}>Room for</Text>
            <Text style={textStyles.labelLargeBlack}>
              {remaining === 0
                ? 'No more — it’s full!'
                : `${remaining} more photo${remaining === 1 ? '' : 's'}`}
            </Text>
          </View>
          <Text style={[textStyles.caption, { marginTop: Spacings.xs }]}>
            {closeDateText
              ? `Photos added before ${closeDateText} are printed in this magazine and mailed to your recipients.`
              : 'Photos added before the end of the month are printed in this magazine and mailed to your recipients.'}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  issueStateContainer: {
    paddingHorizontal: 20,
    rowGap: Spacings.sm,
    paddingBottom: Spacings.md,
  },
  issueStateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.xs,
  },

  loadingBar: {
    backgroundColor: '#C4C6CC',
    height: Spacings.sm,
    borderRadius: Spacings.sm,
  },

  detailsContainer: {
    backgroundColor: '#F4F1EA',
    borderRadius: borderRadius.mdsm,
    padding: Spacings.md,
    rowGap: Spacings.sm,
    marginTop: Spacings.xs,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
