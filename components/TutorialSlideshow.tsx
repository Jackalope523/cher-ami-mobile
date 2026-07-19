import CameraImage from '@/assets/images/camera.png';
import Hedgehog from '@/assets/images/hedgehog.png';
import MailboxImage from '@/assets/images/mailbox.png';
import Squirrel from '@/assets/images/squirrel.png';
import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: windowWidth } = Dimensions.get('window');

type Slide = {
  id: string;
  image: ImageSourcePropType;
  imageAspectRatio: number;
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    id: 'welcome',
    image: Squirrel,
    imageAspectRatio: 288 / 228,
    title: 'Welcome to Cher Ami',
    body: 'Turn your family’s photos into a real printed magazine — and mail it to the people you love.',
  },
  {
    id: 'share',
    image: CameraImage,
    imageAspectRatio: 1,
    title: 'Share photos together',
    body: 'Everyone in your family circle can add photos and captions all month long.',
  },
  {
    id: 'print',
    image: MailboxImage,
    imageAspectRatio: 1,
    title: 'We print and mail it',
    body: 'At the end of the month, your photos become a beautiful glossy magazine, delivered right to their mailbox.',
  },
  {
    id: 'simple',
    image: Hedgehog,
    imageAspectRatio: 160 / 223,
    title: 'No tech needed on their end',
    body: 'Whoever receives it doesn’t need an app, an account, or Wi-Fi. The magazine simply arrives.',
  },
];

interface TutorialSlideshowProps {
  onDone: () => void;
}

export default function TutorialSlideshow({ onDone }: TutorialSlideshowProps) {
  const listRef = useRef<FlatList<Slide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === SLIDES.length - 1;

  function handleNext() {
    if (isLastSlide) {
      onDone();
    } else {
      listRef.current?.scrollToIndex({ index: activeIndex + 1 });
    }
  }

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipRow}>
        <Pressable onPress={onDone} hitSlop={Spacings.md}>
          <Text style={textStyles.labelLargeGrey}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: windowWidth,
          offset: windowWidth * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={{
                  aspectRatio: item.imageAspectRatio,
                  width: '70%',
                  maxHeight: 240,
                }}
                contentFit="contain"
              />
            </View>
            <Text
              style={[
                textStyles.heading2,
                { textAlign: 'center', marginBottom: Spacings.md },
              ]}>
              {item.title}
            </Text>
            <Text style={[textStyles.body, { textAlign: 'center' }]}>
              {item.body}
            </Text>
          </View>
        )}
      />

      <View style={styles.paginationContainer}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <PopPressable onPress={handleNext} style={styles.button}>
        <Text style={textStyles.buttonTextWhite}>
          {isLastSlide ? 'Get started' : 'Next'}
        </Text>
      </PopPressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: 0,
  },

  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacings.lgmd,
    paddingTop: Spacings.md,
  },

  slide: {
    width: windowWidth,
    paddingHorizontal: Spacings.xl,
    justifyContent: 'center',
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: Spacings.xl,
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: Spacings.sm,
    marginVertical: Spacings.lg,
  },

  paginationDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#EAE8E4',
  },

  paginationDotActive: {
    backgroundColor: '#C15F3C',
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C15F3C',
    paddingVertical: Spacings.md,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#C15F3C',
    marginHorizontal: Spacings.lgmd,
    marginBottom: Spacings.lgmd,
  },
});
