import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { createContext, ReactNode, useContext } from 'react';
import {
  Image as CropPickerImage,
  openPicker,
  Options,
} from 'react-native-image-crop-picker';

interface ImagePickerProviderProps {
  children: ReactNode;
}

export interface PickedImage {
  uri: string;
  /** When the photo was taken, from EXIF metadata. Null if unavailable. */
  takenAt: Date | null;
}

interface ImagePickerInterface {
  pickImageAsync: (options?: Options) => Promise<PickedImage | null>;
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

function extractTakenAt(result: CropPickerImage): Date | null {
  // EXIF lives in different shapes per platform: iOS nests it under "{Exif}",
  // Android returns a flat object. Format: "YYYY:MM:DD HH:MM:SS".
  const exif = result.exif as Record<string, any> | null | undefined;
  const raw: unknown =
    exif?.['{Exif}']?.DateTimeOriginal ?? exif?.DateTimeOriginal ?? null;

  if (typeof raw === 'string') {
    const match = raw.match(
      /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/,
    );
    if (match) {
      const date = new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6]),
      );
      if (!isNaN(date.getTime())) return date;
    }
  }

  // iOS also reports the asset's creation date (unix seconds) directly.
  const creationDate = (result as { creationDate?: string }).creationDate;
  if (creationDate) {
    const seconds = Number(creationDate);
    if (!isNaN(seconds) && seconds > 0) return new Date(seconds * 1000);
  }

  return null;
}

export default function ImagePickerProvider({
  children,
}: ImagePickerProviderProps) {
  async function pickImageAsync(options?: Options) {
    try {
      const result = await openPicker({ includeExif: true, ...(options ?? {}) });

      const takenAt = extractTakenAt(result);

      const fileInfo = new File(result.path).info();

      const image = await ImageManipulator.manipulate(
        result.path,
      ).renderAsync();

      const MAX_BYTES = 5 * 1024 * 1024;
      let compressionFactor = 0.9;
      if (fileInfo.size && fileInfo.size > MAX_BYTES) {
        compressionFactor = MAX_BYTES / fileInfo.size;
      }

      const jpgImage = await image.saveAsync({
        format: SaveFormat.JPEG,
        compress: compressionFactor,
      });

      return { uri: jpgImage.uri, takenAt };
    } catch (e: unknown) {
      console.log(e);
      return null;
    }
  }

  return (
    <ImagePickerContext.Provider value={{ pickImageAsync }}>
      {children}
    </ImagePickerContext.Provider>
  );
}
