import XIcon from '@/assets/icons/circle-x.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PopPressable from './PopPressable';

interface MilitaryEditionModalContentsProps {
  dismissModal?: () => void;
  setIsVeteran?: Dispatch<SetStateAction<boolean>>;
}

export default function MilitaryEditionModalContents({
  dismissModal = () => {},
  setIsVeteran = () => {},
}: MilitaryEditionModalContentsProps) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={[textStyles.labelLargeBlack, { marginBottom: Spacings.smxs }]}>
          Military Edition
        </Text>
        <PopPressable onPress={dismissModal}>
          <XIcon height={24} width={24} />
        </PopPressable>
      </View>

      <Text
        style={[
          textStyles.caption,
          { marginBottom: Spacings.lgmd, paddingRight: 45 },
        ]}>
        We offer monthly issues for{' '}
        <Text style={{ color: '#779443', fontWeight: 'bold' }}>20% off</Text>{' '}
        when you are sending to a service member APO/FPO/DPO or to a veteran in
        the USA.
      </Text>

      <PopPressable
        onPress={() => {
          setIsVeteran(true);
          dismissModal();
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          borderRadius: 14,
          borderWidth: 2,
          paddingVertical: Spacings.md,
          paddingHorizontal: Spacings.lg,
          backgroundColor: '#779443',
          borderColor: '#779443',
        }}>
        <Text style={textStyles.buttonTextWhite}>
          Activate Military Edition
        </Text>
      </PopPressable>
    </View>
  );
}
const styles = StyleSheet.create({});
