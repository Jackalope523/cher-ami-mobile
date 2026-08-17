import InviteModalContents from '@/components/InviteModalContents';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function Invite() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
        <Text style={[textStyles.heading1, { marginBottom: Spacings.md }]}>
          Invite your family.
        </Text>
        <Text style={[textStyles.body, { marginBottom: Spacings.xl }]}>
          Magazines are better when everyone adds a photo. Send an invitation
          now, or share the code whenever you like.
        </Text>

        <InviteModalContents />
      </ScrollView>

      <PopPressable onPress={() => router.back()} style={styles.button}>
        <Text style={textStyles.buttonTextBlack}>Done</Text>
      </PopPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: Spacings.lgmd,
    justifyContent: 'space-between',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#242832',
    marginVertical: Spacings.lgmd,
  },
});
