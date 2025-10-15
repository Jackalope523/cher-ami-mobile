import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';

interface LeaveCircleContentsProps {
  dismissModal?: () => void;
}

export default function LeaveCircleContents({
  dismissModal = () => {},
}: LeaveCircleContentsProps) {
  function handleDelete() {
    dismissModal();
  }

  return (
    <View>
      <Text
        style={[
          textStyles.heading3,
          { textAlign: 'center', marginBottom: Spacings.md },
        ]}>
        Leave Circle?
      </Text>
      <Text
        style={[
          textStyles.body,
          { textAlign: 'center', marginBottom: Spacings.xxl },
        ]}>
        Once you delete
        <Text style={{ fontWeight: 'bold' }}> The Wolff Family</Text> circle, it
        will be gone for good and cannot be restored.
      </Text>
      <Pressable
        onPress={handleDelete}
        style={{
          backgroundColor: '#F47A70',
          paddingVertical: Spacings.md,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#F47A70',
          marginBottom: Spacings.mdsm,
        }}>
        <Text style={textStyles.buttonTextBlack}>Leave</Text>
      </Pressable>
      <Pressable
        onPress={dismissModal}
        style={{
          paddingVertical: Spacings.md,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#242832',
        }}>
        <Text style={textStyles.buttonTextBlack}>Cancel</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({});
