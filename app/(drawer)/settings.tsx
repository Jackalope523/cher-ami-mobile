import BlockIcon from '@/assets/icons/block.svg';
import Chevron from '@/assets/icons/chevron-right.svg';
import PrivacyPolicyIcon from '@/assets/icons/file-key.svg';
import TermsOfServiceIcon from '@/assets/icons/scroll.svg';
import TrashIcon from '@/assets/icons/trash.svg';
import DeleteAccountContents from '@/components/DeleteAccountContents';
import { useDialogueModal } from '@/components/modals/DialogueModalProvider';
import PopPressable from '@/components/PopPressable';
import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { openURL } from 'expo-linking';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Settings() {
  const { displayDialogue, dismissDialogue } = useDialogueModal();

  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <PopPressable
          onPress={() => {
            openURL('https://thecherami.com/legal/privacy');
          }}
          style={styles.option}>
          <View style={styles.optionLabel}>
            <PrivacyPolicyIcon height={24} width={24} color={'#B05637'} />
            <Text style={textStyles.buttonTextOrange}>Privacy Policy</Text>
          </View>
          <Chevron height={24} width={24} color={'#B05637'} />
        </PopPressable>
        <PopPressable
          onPress={() => {
            openURL('https://thecherami.com/legal/terms');
          }}
          style={styles.option}>
          <View style={styles.optionLabel}>
            <TermsOfServiceIcon height={24} width={24} color={'#B05637'} />
            <Text style={textStyles.buttonTextOrange}>
              Terms and Conditions
            </Text>
          </View>
          <Chevron height={24} width={24} color={'#B05637'} />
        </PopPressable>
      </View>
      <View style={styles.optionsContainer}>
        <PopPressable
          onPress={() => {
            router.push('/blocked');
          }}
          style={styles.option}>
          <View style={styles.optionLabel}>
            <BlockIcon height={24} width={24} color={'#B05637'} />
            <Text style={textStyles.buttonTextOrange}>Blocked Users</Text>
          </View>
          <Chevron height={24} width={24} color={'#B05637'} />
        </PopPressable>
        <PopPressable
          onPress={() => {
            displayDialogue(<DeleteAccountContents />);
          }}
          style={styles.option}>
          <View style={styles.optionLabel}>
            <TrashIcon height={24} width={24} color={'#B05637'} />
            <Text style={textStyles.buttonTextOrange}>Delete Account</Text>
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
    rowGap: Spacings.xl,
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
