import Chevron from '@/assets/icons/chevron-right.svg';
import PrivacyPolicyIcon from '@/assets/icons/file-key.svg';
import TermsOfServiceIcon from '@/assets/icons/scroll.svg';
import PopPressable from '@/components/PopPressable';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { StyleSheet, Text, View } from 'react-native';

export default function Settings() {
  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <PopPressable onPress={() => {}} style={styles.option}>
          <View style={styles.optionLabel}>
            <PrivacyPolicyIcon height={24} width={24} color={'#B05637'} />
            <Text style={textStyles.buttonTextOrange}>Privacy Policy</Text>
          </View>
          <Chevron height={24} width={24} color={'#B05637'} />
        </PopPressable>
        <PopPressable onPress={() => {}} style={styles.option}>
          <View style={styles.optionLabel}>
            <TermsOfServiceIcon height={24} width={24} color={'#B05637'} />
            <Text style={textStyles.buttonTextOrange}>Privacy Policy</Text>
          </View>
          <Chevron height={24} width={24} color={'#B05637'} />
        </PopPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: Spacings.lgmd,
  },

  optionsContainer: {
    borderRadius: borderRadius.mdsm,
    borderWidth: 2,
    borderColor: '#F4F1EA',
    backgroundColor: '#F4F1EA',
  },

  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacings.mdsm,
    paddingHorizontal: Spacings.md,
  },

  optionLabel: {
    flexDirection: 'row',
    columnGap: Spacings.sm,
    alignItems: 'center',
  },
});
