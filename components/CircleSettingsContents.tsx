import XIcon from '@/assets/icons/circle-x.svg';
import ImageIcon from '@/assets/icons/image.svg';
import LogoutIcon from '@/assets/icons/log-out.svg';
import TextIcon from '@/assets/icons/pencil.svg';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import PopPressable from './PopPressable';

interface CircleSettingsContentsProps {
  dismissModal?: () => void;
  /**
   * Raised to the screen rather than handled here: sheet contents render
   * inside BottomSheetModalProvider, which sits outside DialogueModalProvider,
   * so the dialogue hook isn't reachable from in here.
   */
  onLeave: () => void;
}

export default function CircleSettingsContents({
  dismissModal = () => {},
  onLeave,
}: CircleSettingsContentsProps) {

  function handleRename() {
    dismissModal();
    router.push({ pathname: '/circle/edit', params: { focus: 'name' } });
  }

  function handleChangeHeader() {
    dismissModal();
    router.push({ pathname: '/circle/edit', params: { focus: 'header' } });
  }

  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={textStyles.heading4}>Circle settings</Text>
        <PopPressable onPress={dismissModal}>
          <XIcon height={24} width={24} color="#C15F3C" />
        </PopPressable>
      </View>

      <View style={styles.divider} />

      <PopPressable onPress={handleRename} style={styles.row}>
        <TextIcon height={24} width={24} color="#242832" />
        <Text style={textStyles.body}>Rename circle</Text>
      </PopPressable>

      <PopPressable onPress={handleChangeHeader} style={styles.row}>
        <ImageIcon height={24} width={24} color="#242832" />
        <Text style={textStyles.body}>Change circle image</Text>
      </PopPressable>

      <View style={styles.divider} />

      <PopPressable onPress={onLeave} style={styles.row}>
        <LogoutIcon height={24} width={24} color="#C15F3C" />
        <Text style={[textStyles.body, { color: '#C15F3C' }]}>
          Leave circle
        </Text>
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
    marginVertical: Spacings.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.md,
    paddingVertical: Spacings.md,
  },
});
