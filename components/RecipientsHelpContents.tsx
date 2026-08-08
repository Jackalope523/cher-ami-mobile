import XIcon from '@/assets/icons/circle-x.svg';
import ExternalLinkIcon from '@/assets/icons/chevron-right.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { openURL } from 'expo-linking';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PopPressable from './PopPressable';

interface RecipientsHelpContentsProps {
  dismissModal?: () => void;
}

const FAQS = [
  {
    question: 'What are recipients?',
    answer:
      'Recipients are people who receive the printed magazine in the mail.',
  },
  {
    question: 'Do they need the app?',
    answer: 'No. Recipients only need a mailing address.',
  },
  {
    question: 'Can I be a member and a recipient?',
    answer:
      'Yes. You can post in the app and also receive the printed magazine each month.',
  },
  {
    question: 'How often is the magazine sent?',
    answer: 'Once a month.',
  },
  {
    question: 'Where do you deliver?',
    answer:
      'Anywhere in the USA, including military APO, FPO, and DPO addresses. Delivery is always free.',
  },
];

export default function RecipientsHelpContents({
  dismissModal = () => {},
}: RecipientsHelpContentsProps) {
  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={textStyles.heading4}>Recipients</Text>
        <PopPressable onPress={dismissModal}>
          <XIcon height={24} width={24} color="#C15F3C" />
        </PopPressable>
      </View>

      <View style={styles.divider} />

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {FAQS.map((faq) => (
          <View key={faq.question} style={{ marginBottom: Spacings.lg }}>
            <Text style={[textStyles.heading5, { marginBottom: Spacings.xs }]}>
              {faq.question}
            </Text>
            <Text style={textStyles.body}>{faq.answer}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.divider} />

      <Text style={[textStyles.heading5, styles.stillHaveQuestions]}>
        Still have questions?
      </Text>

      <PopPressable
        onPress={() => openURL('https://thecherami.com/example')}
        style={styles.primaryButton}>
        <Text style={textStyles.buttonTextWhite}>View sample magazine</Text>
      </PopPressable>

      <PopPressable
        onPress={() => openURL('https://www.thecherami.com/help')}
        style={styles.secondaryButton}>
        <Text style={textStyles.buttonTextBlack}>Visit Help Center</Text>
        <ExternalLinkIcon height={20} width={20} color="#242832" />
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacings.md,
  },

  divider: {
    borderTopWidth: 1.5 / 2,
    borderTopColor: '#DEDBD5',
    marginBottom: Spacings.md,
  },

  list: {
    maxHeight: 320,
  },

  stillHaveQuestions: {
    textAlign: 'center',
    marginBottom: Spacings.md,
  },

  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242832',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#242832',
    marginBottom: Spacings.mdsm,
  },

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: Spacings.sm,
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#242832',
    marginBottom: Spacings.sm,
  },
});
