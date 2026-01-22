import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { createContext, ReactNode, useContext } from 'react';
import { openPicker, Options } from 'react-native-image-crop-picker';

interface ImagePickerProviderProps {
  children: ReactNode;
}

interface ImagePickerInterface {
  pickImageAsync: (options: Options) => Promise<string | null>;
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
  async function pickImageAsync(options: Options) {
    try {
      const result = await openPicker(options);

      const image = await ImageManipulator.manipulate(
        result.path,
      ).renderAsync();
      const jpgImage = await image.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.7,
      });

      return jpgImage.uri;
    } catch {
      return null;
    }
  }

  return (
    <ImagePickerContext.Provider value={{ pickImageAsync }}>
      {children}
    </ImagePickerContext.Provider>
  );
}
