import { StyleSheet, Text, View } from 'react-native';

import NetworkImage from '@/components/NetworkImage';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { router } from 'expo-router';
import { Pressable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RemoveRecipient() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={[textStyles.heading1, styles.screenHeader]}>
          Remove recipient?
        </Text>
        <NetworkImage style={styles.avatar} />
        <Text style={[textStyles.heading2, styles.recipientName]}>
          Kimi Neumann
        </Text>
        <Text style={textStyles.body}>
          By removing Kimi Neumann from the recipients, they will{' '}
          <Text style={[textStyles.body, { fontWeight: 'bold' }]}>
            stop receiving
          </Text>
          print-out magazines.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {}}
          disabled={false}
          style={[styles.removeButton]}>
          <Text style={textStyles.buttonTextBlack}>Remove</Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          disabled={false}
          style={[
            styles.cancelButton,
            false && {
              backgroundColor: '#ECEDEF',
              borderColor: '#ECEDEF',
            },
          ]}>
          <Text
            style={[textStyles.buttonTextWhite, false && { color: '#A8ABB3' }]}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FCFBF8',
    justifyContent: 'space-between',
  },

  screenHeader: {
    alignSelf: 'center',
  },

  recipientName: {
    alignSelf: 'center',
    marginBottom: Spacings.xxxl,
  },

  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: Spacings.sm,
    marginTop: Spacings.xxl,
  },

  buttonContainer: {
    rowGap: Spacings.mdsm,
  },

  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#242832',
    paddingVertical: Spacings.md,
    paddingHorizontal: Spacings.lg,
  },

  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    paddingVertical: Spacings.md,
    paddingHorizontal: Spacings.lg,
  },
});
