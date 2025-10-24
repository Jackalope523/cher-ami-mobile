import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useToastMessage } from './modals/ToastMessageProvider';
import PopPressable from './PopPressable';
import TextInput from './TextInput';

interface DeleteCircleContentsProps {
  dismissModal?: () => void;
}

export default function DeleteCircleContents({
  dismissModal = () => {},
}: DeleteCircleContentsProps) {
  const showToastMessage = useToastMessage();
  const [text, setText] = useState('');

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
        Delete Circle?
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
      <TextInput
        title={'Type "DELETE" to proceed.'}
        value={text}
        onChangeText={setText}
      />
      <PopPressable
        onPress={handleDelete}
        disabled={text !== 'DELETE'}
        style={{
          backgroundColor: '#F47A70',
          paddingVertical: Spacings.md,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#F47A70',
          marginTop: Spacings.xxl,
          marginBottom: Spacings.mdsm,
        }}>
        <Text style={textStyles.buttonTextBlack}>Delete</Text>
      </PopPressable>
      <PopPressable
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
      </PopPressable>
    </View>
  );
}
const styles = StyleSheet.create({});
