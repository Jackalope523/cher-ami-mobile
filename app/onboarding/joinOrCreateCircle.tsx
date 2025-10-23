import TextInput from '@/components/TextInput';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useUpdateUserMutation } from '@/lib/hooks';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

export default function JoinOrCreateCircle() {
  const [circleCode, setCircleCode] = useState('');
  const { firstName, lastName, birthday, avatar } = useLocalSearchParams();
  const userMutation = useUpdateUserMutation(
    () => {
      router.replace('/onboarding/circleCode');
    },
    (error) => {
      console.log(error.message);
    },
  );

  function handleJoinPress() {
    userMutation.mutate({
      firstName: firstName as string,
      lastName: lastName as string,
      dateOfBirth: new Date(birthday as string),
      avatarPath: avatar as string,
      inviteCode: circleCode,
    });
  }

  function joinButtonDisabled() {
    return !circleCode || userMutation.isPending;
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          textStyles.heading1,
          {
            marginBottom: Spacings.md,
          },
        ]}>
        Join circle
      </Text>
      <Text
        style={[
          textStyles.body,
          {
            marginBottom: Spacings.xl,
          },
        ]}>
        Please enter the <Text style={{ fontWeight: 'bold' }}>code </Text>
        that was sent to you by the person who invited you to join the circle.
      </Text>
      <View style={{ marginBottom: Spacings.md }}>
        <TextInput
          placeholder="Circle code"
          maxLength={100}
          value={circleCode}
          onChangeText={setCircleCode}
        />
      </View>

      <Pressable
        onPress={handleJoinPress}
        disabled={joinButtonDisabled()}
        style={[
          styles.button,
          joinButtonDisabled() && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[
            textStyles.buttonTextWhite,
            joinButtonDisabled() && { color: '#A8ABB3' },
          ]}>
          Join circle
        </Text>
      </Pressable>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: Spacings.xl,
        }}>
        <View style={styles.divider} />
        <Text
          style={[
            textStyles.labelLargeGrey,
            { marginHorizontal: Spacings.mdsm },
          ]}>
          OR
        </Text>
        <View style={styles.divider} />
      </View>

      <Text
        style={[
          textStyles.heading1,
          {
            marginBottom: Spacings.md,
          },
        ]}>
        Create circle
      </Text>
      <Text
        style={[
          textStyles.body,
          {
            marginBottom: Spacings.xl,
          },
        ]}>
        Start your own circle and invite others to join.
      </Text>

      <Pressable
        onPress={() => {
          router.push({
            pathname: '/onboarding/circleName',
            params: { firstName, lastName, birthday, avatar },
          });
        }}
        disabled={false}
        style={[
          styles.button,
          false && {
            backgroundColor: '#ECEDEF',
            borderColor: '#ECEDEF',
          },
        ]}>
        <Text
          style={[textStyles.buttonTextWhite, false && { color: '#A8ABB3' }]}>
          Create circle
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: Spacings.lgmd,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    marginBottom: Spacings.xl,
  },

  divider: {
    flex: 1,
    borderWidth: 1.5 / 2,
    borderColor: '#DEDBD5',
  },
});
