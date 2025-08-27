import { Colors } from '@/constants/Colors';
import { globalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';
import { ModalOption } from './BottomSheetModalProvider';

import PerhapsText from '../PerhapsText';
import SparrowIcon from '../SparrowIcon';

interface BottomSheetModalChildMultiOptionProps {
  title?: string;
  description?: string;
  options: ModalOption[];
  syncedOptions?: Promise<ModalOption[]>;
  iconStyle?: StyleProp<ViewStyle>;
}

function BottomSheetModalChildMultiOption({
  title,
  description,
  options,
  syncedOptions,
  iconStyle,
}: BottomSheetModalChildMultiOptionProps) {
  const [displayedOptions, setDisplayedOptions] = useState(options);
  const [optionsLoading, setOptionsLoading] = useState(
    syncedOptions !== undefined,
  );
  const [optionsEmpty, setOptionsEmpty] = useState(false);

  useEffect(() => {
    if (syncedOptions) {
      syncedOptions
        .then((synced) => {
          setDisplayedOptions(synced);
          setOptionsLoading(false);
        })
        .catch(() => setOptionsEmpty(true));
    }
  }, []);

  function renderModalOption(option: ModalOption, index: number) {
    const Icon = option.icon;
    return (
      <Pressable
        key={index}
        style={styles.option}
        onPress={option.onPress}
        disabled={option.disabled}>
        {Icon && !optionsLoading && (
          <SparrowIcon
            Icon={Icon}
            fill={option.disabled ? Colors.brown300 : Colors.brown800}
            style={iconStyle}
          />
        )}
        <PerhapsText
          forceLoading={optionsLoading}
          style={[
            globalStyles.buttonTextTwo,
            option.disabled ? globalStyles.textDisabled : globalStyles.textDark,
          ]}>
          {option.label}
        </PerhapsText>
      </Pressable>
    );
  }

  return (
    <View style={styles.bottomSheet}>
      {(title || description) && (
        <View style={styles.info}>
          {title && (
            <Text
              style={[globalStyles.headingTextThree, globalStyles.textDark]}>
              {title}
            </Text>
          )}
          {description && (
            <Text style={[globalStyles.bodyTextOne, globalStyles.textDark]}>
              {description}
            </Text>
          )}
        </View>
      )}

      {(title || description) && <View style={styles.divider} />}

      <FlatList
        style={{ paddingTop: Spacings.lg, marginTop: -Spacings.lg }}
        nestedScrollEnabled={true}
        overScrollMode="never"
        contentContainerStyle={styles.options}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: Spacings.xl * 3 }} />}
        ListEmptyComponent={
          <>
            {optionsEmpty && (
              <Text style={[globalStyles.buttonTextTwo, globalStyles.textDark]}>
                No options to display!
              </Text>
            )}
          </>
        }
        data={displayedOptions}
        renderItem={({ item, index }) => renderModalOption(item, index)}
      />
    </View>
  );
}

export default BottomSheetModalChildMultiOption;

const styles = StyleSheet.create({
  bottomSheet: {
    rowGap: Spacings.lg,
    paddingBottom: Spacings.xl,
  },

  // Info
  info: {
    rowGap: Spacings.md,
  },

  // Options
  options: {
    rowGap: Spacings.md,
  },

  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacings.mdsm,
  },

  divider: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.canaryDarkBrown,
    borderRadius: 100,
  },
});
