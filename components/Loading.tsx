import AnimatedLoadingIcon from '@/components/AnimatedLoadingIcon';
import { StyleSheet, View } from 'react-native';

interface LoadingProps {
  height?: number;
  width?: number;
}

export default function Loading({ height = 48, width = 48 }: LoadingProps) {
  return (
    <View style={styles.container}>
      <AnimatedLoadingIcon height={height} width={width} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCFBF8',
  },
});
