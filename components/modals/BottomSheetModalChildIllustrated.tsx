import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { globalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';

export type IllustrationOption = {
  label: string;
  illustration: ImageSourcePropType;
  onPress: () => any;
};

type BottomSheetModalChildIllustratedProps = {
  optionOne: IllustrationOption;
  optionTwo: IllustrationOption;
  description?: string;
};

function BottomSheetModalChildIllustrated({
  optionOne,
  optionTwo,
  description,
}: BottomSheetModalChildIllustratedProps) {
  return (
    <View style={styles.bottomSheet}>
      <View style={styles.options}>
        <Pressable style={styles.option} onPress={optionOne.onPress}>
          <Image
            source={optionOne.illustration}
            resizeMode="contain"
            style={styles.illustration}
          />
          <Text style={[globalStyles.textDark, globalStyles.buttonTextTwo]}>
            {optionOne.label}
          </Text>
        </Pressable>
        <Pressable style={styles.option} onPress={optionTwo.onPress}>
          <Image
            source={optionTwo.illustration}
            resizeMode="contain"
            style={styles.illustration}
          />

          <Text style={[globalStyles.textDark, globalStyles.buttonTextTwo]}>
            {optionTwo.label}
          </Text>
        </Pressable>
      </View>
      {description && (
        <Text style={[globalStyles.textDark, globalStyles.bodyTextOne]}>
          {description}
        </Text>
      )}
    </View>
  );
}

export default BottomSheetModalChildIllustrated;

const styles = StyleSheet.create({
  bottomSheet: {
    rowGap: Spacings.lg,
  },

  // Options
  options: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacings.md,
  },

  option: {
    flex: 1,
    alignItems: 'center',
  },

  illustration: {
    width: (Dimensions.get('screen').width - Spacings.lg * 2) / 2 - Spacings.md,
    height:
      (Dimensions.get('screen').width - Spacings.lg * 2) / 2 - Spacings.md,
  },
});
