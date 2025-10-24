import CreditCardIcon from '@/assets/icons/credit-card-orange.svg';
import PopPressable from '@/components/PopPressable';
import UserItem from '@/components/UserItem';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetSelfQuery } from '@/lib/hooks';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function ManageBilling() {
  const { data } = useGetSelfQuery();

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      style={styles.container}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}>
      <Text style={[textStyles.heading3, { marginBottom: Spacings.md }]}>
        Billing summary
      </Text>
      <Text style={textStyles.body}>
        {"You're currently paying for the following recipients."}
      </Text>
      <View style={styles.userList}>
        {data.recipients.map((x) => (
          <UserItem
            key={x.id}
            text={`${x.firstName} ${x.lastName}`}
            imageSource={x.avatarPath + `?timestamp=${x.avatarTimestamp}`}
            tag={'(Yours)'}
            showTag
          />
        ))}
      </View>
      <View style={styles.divider} />
      <View style={styles.priceTotal}>
        <Text style={textStyles.labelSmall}>Total</Text>
        <Text style={textStyles.labelSmall}>
          ${data?.recipients.length * 12}.00
        </Text>
      </View>
      <Text style={textStyles.heading3}>Billing details</Text>
      <PopPressable onPress={() => {}} style={styles.button}>
        <Text style={textStyles.buttonTextOrange}>Configure Billing</Text>
        <CreditCardIcon height={24} width={24} />
      </PopPressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: 20,
  },

  userList: {
    marginTop: Spacings.lg,
    rowGap: Spacings.lg,
  },

  divider: {
    marginVertical: Spacings.lg,
    borderWidth: 1.5,
    borderColor: '#DEDBD5',
  },

  priceTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacings.xl,
  },

  button: {
    flexDirection: 'row',
    paddingVertical: Spacings.mdsm,
    paddingHorizontal: Spacings.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    columnGap: Spacings.sm,
    borderWidth: 2,
    borderColor: '#B05637',
    marginTop: Spacings.md,
  },
});
