import PlaceholderImage from '@/assets/images/placeholder.jpg';
import Button, {
  ButtonDisplay,
  ButtonSize,
  ButtonType,
} from '@/components/Button';
import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { globalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Upload() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={globalStyles.headingTextThree}>Upload</Text>

      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image} />
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          type={ButtonType.Function}
          size={ButtonSize.Medium}
          display={ButtonDisplay.Full}
          text={'Choose a Photo'}
          onPress={() => {}}
          disabled={false}
        />
        <Button
          type={ButtonType.Success}
          size={ButtonSize.Medium}
          display={ButtonDisplay.Full}
          text={'Use this Photo'}
          onPress={() => {}}
          disabled={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canarySand,
    alignItems: 'center',
    justifyContent: 'flex-end',
    rowGap: Spacings.sm,
  },

  image: {
    width: Dimensions.get('window').width - Spacings.lg * 2,
    height: Dimensions.get('window').width - Spacings.lg * 2,
    borderRadius: borderRadius.lg,
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.canaryDark,
    borderRadius: borderRadius.lg,
  },

  buttonsContainer: {
    rowGap: Spacings.sm,
  },
});

