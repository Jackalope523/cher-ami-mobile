import Button, {
  ButtonDisplay,
  ButtonSize,
  ButtonType,
} from '@/components/Button';
import { borderRadius } from '@/constants/Borders';
import { Colors } from '@/constants/Colors';
import { globalStyles } from '@/constants/GlobalStyles';
import { Spacings } from '@/constants/Spacings';
import { DialogueModalContext } from '@/lib/contexts/dialogueModalContext';
import { ReactNode, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import ErrorIcon from '../../assets/icons/error-fill.svg';

interface DialogueModalProviderProps {
  children: ReactNode;
}

export default function DialogueModalProvider({
  children,
}: DialogueModalProviderProps) {
  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => any>();
  const [onCancel, setOnCancel] = useState<() => any>();

  function displayDialogue(
    title: string,
    description: string,
    confirmText: string,
    cancelText: string,
    onConfirm: () => any,
    onCancel: () => any,
  ) {
    setTitle(title);
    setDescription(description);
    setConfirmText(confirmText);
    setCancelText(cancelText);
    setOnConfirm(() => onConfirm);
    setOnCancel(() => onCancel);

    setVisible(true);
  }

  function handleCancelPress() {
    setVisible(false);
    if (onCancel) {
      onCancel();
    }
  }

  function handleConfirmPress() {
    setVisible(false);
    if (onConfirm) {
      onConfirm();
    }
  }

  return (
    <DialogueModalContext.Provider value={{ displayDialogue }}>
      {visible && (
        <View style={styles.container}>
          <Animated.View
            style={[styles.backdrop, { zIndex: 9 }]}
            entering={FadeIn}
            exiting={FadeOut}>
            <TouchableOpacity style={styles.flex} onPress={handleCancelPress} />
          </Animated.View>

          <Animated.View
            style={styles.dialog}
            entering={SlideInDown}
            exiting={SlideOutDown}>
            <View style={styles.info}>
              <ErrorIcon width={40} height={40} fill={Colors.red400} />
              <Text
                style={[globalStyles.headingTextTwo, globalStyles.textDark]}>
                {title}
              </Text>
              <Text
                style={[
                  globalStyles.bodyTextOne,
                  globalStyles.textDark,
                  { textAlign: 'center' },
                ]}>
                {description}
              </Text>
            </View>
            <View style={styles.controls}>
              <Button
                type={ButtonType.Error}
                display={ButtonDisplay.Full}
                size={ButtonSize.Small}
                onPress={handleConfirmPress}
                text={confirmText}
              />
              <Button
                type={ButtonType.SecondaryLight}
                display={ButtonDisplay.Full}
                size={ButtonSize.Small}
                onPress={handleCancelPress}
                text={cancelText}
              />
            </View>
          </Animated.View>
        </View>
      )}
      {children}
    </DialogueModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 20,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    bottom: 0,
    left: 0,
  },

  dialog: {
    padding: Spacings.md,
    rowGap: Spacings.lg,
    borderWidth: 2,
    borderRadius: borderRadius.md,
    borderColor: Colors.brown800,
    backgroundColor: Colors.canarySand,
    position: 'absolute',
    margin: Spacings.lg,

    alignSelf: 'center',
    zIndex: 10,
  },

  info: {
    rowGap: Spacings.sm,
    alignItems: 'center',
  },

  controls: {
    rowGap: Spacings.xs, // For Future Jade: this is different from Figma spacing but don't fix it cause Figma doesn't count the shadow
  },

  flex: {
    flex: 1,
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 75)',
  },
});
