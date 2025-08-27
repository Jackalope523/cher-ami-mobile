import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { Keyboard, StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import BottomSheetModalGeneric from './BottomSheetModalBase';
import BottomSheetModalChildIllustrated, {
  IllustrationOption,
} from './BottomSheetModalChildIllustrated';
import BottomSheetModalChildMultiOption from './BottomSheetModalChildMultiOption';

export type ModalOption = {
  label: string;
  icon?: FC<SvgProps>;
  onPress: () => void;
  disabled?: boolean;
};

export type ReportOption<T> = {
  option: T;
} & ModalOption;

interface BottomSheetModalProviderProps {
  children: ReactNode;
}

interface BottomSheetModalInterface {
  dismissBottomSheets(): void;
  displayOptionsBottomSheet(
    options: ModalOption[],
    title?: string,
    description?: string,
    iconStyle?: StyleProp<ViewStyle>,
  ): void;
  displayGenericBottomSheet(contents: ReactNode): void;
  displayReportBottomSheet<T>(
    options: ReportOption<T>[],
    availableReportsSync: Promise<T[]>,
  ): void;
  displayIllustratedBottomSheet(
    optionOne: IllustrationOption,
    optionTwo: IllustrationOption,
    description?: string,
  ): void;
}

const BottomSheetModalContext = createContext<BottomSheetModalInterface | null>(
  null,
);

export const useBottomSheetModal = () => {
  const context = useContext(BottomSheetModalContext);

  if (!context) {
    throw new Error(
      'useBottomSheetModal must be used within a BottomSheetModalProvider',
    );
  }

  return {
    dismissBottomSheetModals: context.dismissBottomSheets,
    displayOptionsBottomSheet: context.displayOptionsBottomSheet,
    displayGenericBottomSheet: context.displayGenericBottomSheet,
    displayReportBottomSheet: context.displayReportBottomSheet,
    displayIllustratedBottomSheet: context.displayIllustratedBottomSheet,
  };
};

export default function BottomSheetModalProvider({
  children,
}: BottomSheetModalProviderProps) {
  const [openModals, setOpenModals] = useState<ReactNode[]>([]);

  function dismissBottomSheets() {
    setOpenModals([]);
  }

  function displayGenericBottomSheet(contents: React.ReactNode) {
    Keyboard.dismiss();

    const key = openModals.length;

    const nextModal = (
      <BottomSheetModalGeneric
        key={key}
        index={key}
        onHide={() => handleHideModal(key)}>
        {contents}
      </BottomSheetModalGeneric>
    );

    setOpenModals((prevModals) => [...prevModals, nextModal]);

    return key;
  }

  function displayOptionsBottomSheet(
    options: ModalOption[],
    title?: string,
    description?: string,
    iconStyle?: StyleProp<ViewStyle>,
  ) {
    displayGenericBottomSheet(
      <BottomSheetModalChildMultiOption
        title={title}
        description={description}
        options={options}
        iconStyle={iconStyle}
      />,
    );
  }

  function displayReportBottomSheet<T>(
    options: ReportOption<T>[],
    availableReportsSync: Promise<T[]>,
  ) {
    let title = 'Pick a reason for the report';
    let description =
      'Thank you for helping make CANARY a friendlier space. We will review your report and take action if necessary.';

    // Disable all options pre-emptively
    options.forEach((option) => (option.disabled = true));

    let syncedOptions = availableReportsSync.then((available) => {
      options.forEach((option) =>
        available.includes(option.option)
          ? (option.disabled = false)
          : (option.disabled = true),
      );
      return options;
    });

    displayGenericBottomSheet(
      <BottomSheetModalChildMultiOption
        title={title}
        description={description}
        options={options}
        syncedOptions={syncedOptions}
      />,
    );
  }

  function displayIllustratedBottomSheet(
    optionOne: IllustrationOption,
    optionTwo: IllustrationOption,
    description?: string,
  ) {
    displayGenericBottomSheet(
      <BottomSheetModalChildIllustrated
        optionOne={optionOne}
        optionTwo={optionTwo}
        description={description}
      />,
    );
  }

  function handleHideModal(modalKey: number) {
    setOpenModals((prevModals) => prevModals.filter((_, i) => i !== modalKey));
  }

  return (
    <BottomSheetModalContext.Provider
      value={{
        dismissBottomSheets,
        displayGenericBottomSheet,
        displayReportBottomSheet,
        displayIllustratedBottomSheet,
        displayOptionsBottomSheet,
      }}>
      {children}
      {openModals}
    </BottomSheetModalContext.Provider>
  );
}
