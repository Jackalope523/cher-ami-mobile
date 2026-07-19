import XIcon from '@/assets/icons/circle-x.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { StyleSheet, Text, View } from 'react-native';
import PopPressable from './PopPressable';

interface RecipientsHelpContentsProps {
  dismissModal?: () => void;
}

const HELP_ITEMS = [
  'A recipient is someone who gets the printed magazine in the mail each month — like Nana, Papa, or anyone you love.',
  'They don’t need the app, an account, or even Wi-Fi. The magazine simply arrives in their mailbox.',
  'Delivery is free anywhere in the USA, including military APO, FPO, and DPO addresses.',
  'Your first magazine is free. After that, each recipient is a monthly subscription you can cancel anytime.',
];

export default function RecipientsHelpContents({
  dismissModal = () => {},
}: RecipientsHelpContentsProps) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={[textStyles.labelLargeBlack, { marginBottom: Spacings.md }]}>
          About recipients
        </Text>
        <PopPressable onPress={dismissModal}>
          <XIcon height={24} width={24} color="#868581" />
        </PopPressable>
      </View>

      <View style={{ rowGap: Spacings.md, marginBottom: Spacings.lg }}>
        {HELP_ITEMS.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.bullet} />
            <Text style={[textStyles.body, { flexShrink: 1 }]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    columnGap: Spacings.mdsm,
  },

  bullet: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#C15F3C',
    marginTop: 8,
  },
});
