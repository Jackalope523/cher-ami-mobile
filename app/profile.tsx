import BirthdayIcon from '@/assets/icons/cake.svg';
import NetworkImage from '@/components/NetworkImage';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useGetUserQuery } from '@/lib/hooks';
import { StyleSheet, Text, View } from 'react-native';

export default function Profile() {
  const { data } = useGetUserQuery();

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <NetworkImage style={styles.avatar} source={data.avatarPath} />
      <Text style={[textStyles.heading2, styles.name]}>
        {`${data.firstName} ${data.lastName}`}
      </Text>
      <Text style={[textStyles.heading3, styles.about]}>About</Text>
      <View style={styles.birthdayContainer}>
        <BirthdayIcon height={24} width={24} />
        <Text style={[textStyles.body, styles.about]}>
          {`Born on ${data.dateOfBirth.getDate()} ${data.dateOfBirth.toLocaleString(
            'default',
            { month: 'short' },
          )} ${data.dateOfBirth.getFullYear()}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FCFBF8',
  },

  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: Spacings.sm,
    marginTop: Spacings.xxl,
  },

  name: {
    alignSelf: 'center',
    marginBottom: Spacings.xxxl,
  },

  about: {
    marginBottom: Spacings.md,
  },

  birthdayContainer: {
    flexDirection: 'row',
    columnGap: Spacings.mdsm,
  },
});
