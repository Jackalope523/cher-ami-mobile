import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { ImagePickerOptions, launchImageLibraryAsync } from 'expo-image-picker';
import { createContext, ReactNode, useContext } from 'react';

interface ImagePickerProviderProps {
  children: ReactNode;
}

interface ImagePickerInterface {
  pickImageAsync: (options?: ImagePickerOptions) => Promise<string | null>;
}

const ImagePickerContext = createContext<ImagePickerInterface | null>(null);

export const useImagePicker = () => {
  const context = useContext(ImagePickerContext);

  if (!context) {
    throw new Error(
      'useImagePicker must be used within an ImagePickerProvider',
    );
  }

  return context.pickImageAsync;
};

export default function ImagePickerProvider({
  children,
}: ImagePickerProviderProps) {
  async function pickImageAsync(options?: ImagePickerOptions) {
    let result = await launchImageLibraryAsync(options);

    if (!result.canceled) {
      const image = await ImageManipulator.manipulate(
        result.assets[0].uri,
      ).renderAsync();
      const jpgImage = await image.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.7,
      });

      return jpgImage.uri;
    } else {
      return null;
    }
  }

  return (
    <ImagePickerContext.Provider value={{ pickImageAsync }}>
      {children}
    </ImagePickerContext.Provider>
  );
}
