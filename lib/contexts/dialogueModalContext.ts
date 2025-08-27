import { createContext, useContext } from "react";

interface DialogueModalContextType {
    displayDialogue(title: string, description: string, confirmText: string, cancelText: string, onConfirm: () => void, onCancel: () => void): void
}

export const DialogueModalContext = createContext<DialogueModalContextType|null>(null);

export const useDialogueModal = () => {
  const context = useContext(DialogueModalContext);

  if (!context) {
    throw new Error("useDialogueModal must be used within a DialogueModalProvider");
  }
  
  return context.displayDialogue;
};