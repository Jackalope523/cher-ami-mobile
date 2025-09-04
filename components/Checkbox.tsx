import CheckOutline from '@/assets/icons/check-small-outline.svg';
import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { useState } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SparrowIcon from './SparrowIcon';

interface CheckboxGroupProps {
  onPress: (item: string | GestureResponderEvent) => void;
  text: string[] | React.ReactNode;
}

export function CheckboxGroup({ onPress, text }: CheckboxGroupProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleTap = (item: string | GestureResponderEvent, id: number) => {
    if (selectedIds.includes(id)) {
      // Deselect the item
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      // Select the item
      setSelectedIds([...selectedIds, id]);
    }

    onPress(item);
  };

  return (
    <View style={styles.container}>
      {text?.map((label: string, index: any) => (
        <Pressable
          onPress={(item) => handleTap(item, index)}
          key={index}
          style={
            selectedIds.includes(index)
              ? [styles.containerRest, styles.containerSelected]
              : styles.containerRest
          }>
          <View
            style={
              selectedIds.includes(index)
                ? [styles.checkboxRest, styles.checkboxSelected]
                : styles.checkboxRest
            }>
            <SparrowIcon
              Icon={CheckOutline}
              style={{ display: selectedIds.includes(index) ? 'flex' : 'none' }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={
                selectedIds.includes(index)
                  ? [GlobalStyles.buttonTextTwo, GlobalStyles.textLight]
                  : [GlobalStyles.buttonTextTwo, GlobalStyles.textDark]
              }>
              {label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: Spacings.md,

    // flex: 1,
  },

  containerRest: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.md,
    paddingVertical: Spacings.sm,
    paddingHorizontal: Spacings.md,
    borderColor: Colors.brown800,
    borderWidth: 2,
    borderRadius: 8,
    alignSelf: 'stretch',
  },

  containerSelected: {
    backgroundColor: Colors.brown800,
  },

  checkboxRest: {
    borderColor: Colors.brown800,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 24,
  },

  checkboxSelected: {
    backgroundColor: Colors.canarySand,
  },
});

export default CheckboxGroup;
