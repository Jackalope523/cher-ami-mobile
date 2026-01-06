import CreditCardIcon from '@/assets/icons/credit-card.svg';
import Error from '@/components/Error';
import Loading from '@/components/Loading';
import PopPressable from '@/components/PopPressable';
import UserItem from '@/components/UserItem';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetPriceQuery, useGetSelfQuery } from '@/lib/hooks';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function Manage() {
  const getSelfQuery = useGetSelfQuery();
  const getPriceQuery = useGetPriceQuery();

  if (getSelfQuery.isError || getPriceQuery.isError) {
    return <Error />;
  }

  if (getSelfQuery.isLoading || getPriceQuery.isLoading) {
    return <Loading />;
  }

  if (!getSelfQuery.data || !getPriceQuery.data) {
    return null;
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
        {getSelfQuery.data.recipients.map((x) => (
          <UserItem
            key={x.id}
            text={`${x.firstName} ${x.lastName}`}
            imageSource={x.avatarPath + `?timestamp=${x.avatarTimestamp}`}
            tagRight={`$${getPriceQuery.data / 100}.00`}
          />
        ))}
      </View>
      <View style={styles.divider} />
      <View style={styles.priceTotal}>
        <Text style={textStyles.labelSmall}>Total</Text>
        <Text style={textStyles.labelSmall}>
          ${(getSelfQuery.data.recipients.length * getPriceQuery.data) / 100}.00
        </Text>
      </View>
      <Text style={textStyles.heading3}>Billing details</Text>
      <PopPressable
        onPress={() => {
          router.push('/billing/add');
        }}
        style={styles.button}>
        <Text style={textStyles.buttonTextOrange}>Configure Billing</Text>
        <CreditCardIcon height={24} width={24} color={'#B05637'} />
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
