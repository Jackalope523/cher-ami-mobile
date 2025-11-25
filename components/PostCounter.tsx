import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { usePostCountQuery } from '@/lib/hooks';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

type PostCounterProps = {
  issueTitle?: string | null | undefined;
  maxPosts?: number;
};

export default function PostCounter({
  issueTitle = 'Issue 1',
  maxPosts = 20,
}: PostCounterProps) {
  const { data } = usePostCountQuery();

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
  return (
    <View style={styles.issueStateContainer}>
      <View style={styles.issueStateInfo}>
        <Text style={textStyles.labelLargeBlack}>{issueTitle}</Text>
        <Text style={textStyles.labelLargeBlack}>
          {data}/{maxPosts} posts
        </Text>
      </View>

      <View style={[styles.loadingBar]}>
        <Animated.View style={[styles.loadingBar, animatedStyle]} />
      </View>
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
  },

  loadingBar: {
    backgroundColor: '#C4C6CC',
    height: Spacings.sm,
    borderRadius: Spacings.sm,
  },
});
