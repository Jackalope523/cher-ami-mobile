import { IllustrationOption } from "@/components/modals/BottomSheetModalChildIllustrated";
import { ModalOption, ReportOption } from "@/components/modals/BottomSheetModalProvider";
import { createContext, ReactNode, useContext } from "react";
import { StyleProp, ViewStyle } from "react-native";

interface BottomSheetModalInterface {
    dismissBottomSheets(): void;
    displayOptionsBottomSheet(options: ModalOption[], title?: string, description?: string, iconStyle?: StyleProp<ViewStyle>) : void;
    displayGenericBottomSheet(contents: ReactNode): void;
    displayReportBottomSheet<T>(options: ReportOption<T>[], availableReportsSync: Promise<T[]>): void;
    displayIllustratedBottomSheet(optionOne: IllustrationOption, optionTwo: IllustrationOption, description?: string): void;
}

export const BottomSheetModalContext = createContext<BottomSheetModalInterface|null>(null);

export const useBottomSheetModal = () => {
  const context = useContext(BottomSheetModalContext);

  if (!context) {
    throw new Error("useBottomSheetModal must be used within a BottomSheetModalProvider");
  }
  
  return {
    dismissBottomSheetModals: context.dismissBottomSheets, 
    displayOptionsBottomSheet: context.displayOptionsBottomSheet, 
    displayGenericBottomSheet: context.displayGenericBottomSheet, 
    displayReportBottomSheet: context.displayReportBottomSheet, 
    displayIllustratedBottomSheet: context.displayIllustratedBottomSheet
  };
};