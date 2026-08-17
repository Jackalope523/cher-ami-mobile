import Title from '@/assets/images/title.png';
import AnimatedLoadingIcon from '@/components/AnimatedLoadingIcon';
import { Spacings } from '@/constants/Spacings';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

interface LoadingProps {
  height?: number;
  width?: number;
  showLogo?: boolean;
}

export default function Loading({
  height = 48,
  width = 48,
  showLogo = false,
}: LoadingProps) {
  return (
    <View style={styles.container}>
      {showLogo && (
        <Image source={Title} contentFit="contain" style={styles.logo} />
      )}
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

  logo: {
    width: '50%',
    aspectRatio: 772 / 173,
    maxWidth: 268,
    marginBottom: Spacings.xl,
  },
});
