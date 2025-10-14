import { borderRadius } from '@/constants/Borders';
import { Spacings } from '@/constants/Spacings';
import { createContext, ReactNode, useContext, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

interface DialogueModalProviderProps {
  children: ReactNode;
}

interface DialogueModalContextType {
  displayDialogue(contents: ReactNode): void;
  dismissDialogue(): void;
}

const DialogueModalContext = createContext<DialogueModalContextType | null>(
  null,
);

export const useDialogueModal = () => {
  const context = useContext(DialogueModalContext);

  if (!context) {
    throw new Error(
      'useDialogueModal must be used within a DialogueModalProvider',
    );
  }

  return {
    displayDialogue: context.displayDialogue,
    dismissDialogue: context.dismissDialogue,
  };
};

export default function DialogueModalProvider({
  children,
}: DialogueModalProviderProps) {
  const [open, setOpen] = useState<ReactNode>();

  function dismissDialogue() {
    setOpen(undefined);
  }

  function displayDialogue(contents: ReactNode) {
    Keyboard.dismiss();
    setOpen(contents);
  }

  return (
    <DialogueModalContext.Provider value={{ displayDialogue, dismissDialogue }}>
      {open && (
        <View style={styles.container}>
          <Pressable style={styles.pressable} onPress={dismissDialogue}>
            <Animated.View
              style={styles.background}
              entering={FadeIn}
              exiting={FadeOut}
            />
          </Pressable>
          <Animated.View
            style={styles.dialogue}
            entering={SlideInDown}
            exiting={SlideOutDown}>
            {open}
          </Animated.View>
        </View>
      )}
      {children}
    </DialogueModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },

  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  dialogue: {
    zIndex: 1,
    padding: Spacings.lgmd,
    marginHorizontal: Spacings.lgmd,
    borderRadius: borderRadius.xl,
    backgroundColor: '#FCFBF8',
  },

  pressable: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
