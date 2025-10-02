import { Colors } from '@/constants/Colors';
import { Spacings } from '@/constants/Spacings';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

type PostCounterProps = {
  issueTitle?: string;
  numberOfPosts?: number;
  maxPosts?: number;
};

export default function PostCounter({
  issueTitle = 'Issue 1',
  numberOfPosts = 0,
  maxPosts = 20,
}: PostCounterProps) {
  const progress = useDerivedValue(() => {
    return withTiming((100 * numberOfPosts) / maxPosts, { duration: 500 });
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
        <Text style={styles.issueText}>{issueTitle}</Text>
        <Text style={styles.issueText}>
          {numberOfPosts}/{maxPosts} posts
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
    backgroundColor: Colors.charcoal100,
    height: Spacings.sm,
    borderRadius: Spacings.sm,
  },

  issueText: {
    fontSize: 16,
    color: '#242832',
    fontWeight: 600,
  },
});
