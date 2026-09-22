import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useLayout } from '@/lib/layout';
import { openCropper } from 'react-native-image-crop-picker';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CAROUSEL_SPACING = 40; // 40 margin on each side

// Derived per render rather than at module load: the carousel's snap offsets
// have to survive an iPad rotation.
function useCarousel() {
  const { width, height, contentWidth, isTablet } = useLayout();

  // On a landscape tablet the column is wide but the screen is short; sized from
  // width alone the photo pushes its description off screen. Phones are unchanged.
  const itemWidth = isTablet
    ? Math.min(contentWidth - 80, Math.round(height * 0.42))
    : contentWidth - 80;

  return {
    itemWidth,
    fullWidth: itemWidth + CAROUSEL_SPACING,
    // Centres the photo while its neighbours peek in from the screen edges.
    sidePadding: (width - itemWidth) / 2,
  };
}

type ImageSize = {
  id: string;
  label: string;
  description: string;
  width: number;
  height: number;
  aspectRatio: number;
};

const SIZES: ImageSize[] = [
  {
    id: 'standard',
    label: 'The Standard',
    description:
      'Recommended size. 4:3 aspect ratio. Best for family portraits, landscape photos.',
    width: 1088,
    height: 756,
    aspectRatio: 1088 / 756,
  },
  {
    id: 'vertical',
    label: 'The Vertical',
    description: '9:16 aspect ratio. Best for portraits, lifestyle photos.',
    width: 1088,
    height: 1933,
    aspectRatio: 1088 / 1933,
  },
  {
    id: 'horizontal',
    label: 'The Horizontal',
    description: '16:9 aspect ratio. Best for landscape, panoramic photos.',
    width: 2250,
    height: 756,
    aspectRatio: 2250 / 756,
  },
  {
    id: 'feature',
    label: 'The Feature',
    description:
      'Takes up a whole page, one per user per month. Best for your favorite that you want to emphasize in the magazine.',
    width: 2250,
    height: 2344,
    aspectRatio: 2250 / 2344,
  },
];

export default function Size() {
  const {
    issueTitle,
    issueCloseDate,
    issueStartDate,
    photoDate,
    imageUri,
    uploadId,
    next,
  } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { itemWidth, fullWidth, sidePadding } = useCarousel();
  const { column } = useLayout();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const listRef = useRef<FlatList<ImageSize>>(null);

  // The selected shape is whichever one the scroll position is centred on. Asking
  // the list which items are visible picked the neighbour peeking in on the left.
  useAnimatedReaction(
    () => Math.round(scrollX.value / fullWidth),
    (current, previous) => {
      if (current !== previous) {
        scheduleOnRN(
          setActiveIndex,
          Math.max(0, Math.min(SIZES.length - 1, current)),
        );
      }
    },
    [fullWidth],
  );

  function goTo(index: number) {
    const target = Math.max(0, Math.min(SIZES.length - 1, index));
    listRef.current?.scrollToOffset({
      offset: target * fullWidth,
      animated: true,
    });
  }

  // A tap on a neighbouring shape selects it; on the current one, its outer
  // quarters step to the previous or next shape.
  function handleItemTap(index: number, x: number) {
    if (index !== activeIndex) goTo(index);
    else if (x < itemWidth * 0.25) goTo(index - 1);
    else if (x > itemWidth * 0.75) goTo(index + 1);
  }

  function handleContinue() {
    const selected = SIZES[activeIndex];
    openCropper({
      mediaType: 'photo',
      path: imageUri as string,
      width: selected.width,
      height: selected.height,
    })
      .then((image) => {
        router.push({
          pathname: '/post/caption',
          params: {
            issueTitle,
            issueCloseDate,
            issueStartDate,
            photoDate,
            uploadId,
            next,
            imageUri: image.path,
            width: image.cropRect?.width,
            height: image.cropRect?.height,
            x: image.cropRect?.x,
            y: image.cropRect?.y,
            // What this layout needs in print, so the next screen can tell
            // whether the crop has to be upscaled to fill it.
            targetWidth: selected.width,
            targetHeight: selected.height,
          },
        });
      })
      .catch((err) => {
        console.log('Crop canceled or failed:', err);
      });
  }

  const renderItem = ({ item, index }: { item: ImageSize; index: number }) => {
    return (
      <CarouselItem
        imageUri={imageUri as string}
        item={item}
        index={index}
        scrollX={scrollX}
        onTap={handleItemTap}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        overScrollMode="never"
        bounces={false}>
        <View style={[styles.carouselWrapper, { height: itemWidth }]}>
          <Animated.FlatList
            ref={listRef}
            data={SIZES}
            renderItem={renderItem}
            // Items only re-render when this changes, and their tap handler reads both.
            extraData={`${activeIndex}:${fullWidth}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={fullWidth}
            decelerationRate="fast"
            contentContainerStyle={[
              styles.flatListContent,
              { paddingHorizontal: sidePadding },
            ]}
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id}
            overScrollMode="never"
            bounces={false}
          />
        </View>

        <Text style={[textStyles.body, styles.hintText]}>
          You&apos;ll get to adjust the crop next.
        </Text>

        <View style={styles.paginationContainer}>
          {SIZES.map((_, index) => (
            <PaginationDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>

        <View style={[styles.detailsContainer, column]}>
          <Text
            style={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: 28,
              color: '#242832',
              letterSpacing: -0.5,
            }}>
            {SIZES[activeIndex].label}
          </Text>
          <Text style={[textStyles.body, styles.descriptionText]}>
            {SIZES[activeIndex].description}
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          column,
          { paddingBottom: insets.bottom + Spacings.md },
        ]}>
        <PopPressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={textStyles.buttonTextWhite}>Continue</Text>
        </PopPressable>
      </View>
    </View>
  );
}

function CarouselItem({
  imageUri,
  item,
  index,
  scrollX,
  onTap,
}: {
  imageUri: string;
  item: ImageSize;
  index: number;
  scrollX: SharedValue<number>;
  onTap: (index: number, x: number) => void;
}) {
  const { itemWidth, fullWidth } = useCarousel();

  // A tap with a movement threshold, as in Post: a Pressable would count the
  // start of a short swipe as a tap.
  const tap = Gesture.Tap()
    .maxDistance(10)
    .onEnd((event) => {
      scheduleOnRN(onTap, index, event.x);
    });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [
        (index - 1) * fullWidth,
        index * fullWidth,
        (index + 1) * fullWidth,
      ],
      [0.9, 1, 0.9],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      [
        (index - 1) * fullWidth,
        index * fullWidth,
        (index + 1) * fullWidth,
      ],
      [0.6, 1, 0.6],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const PADDING = 0;
  const MAX_SIZE = itemWidth - PADDING;
  let displayWidth, displayHeight;

  if (item.aspectRatio >= 1) {
    displayWidth = MAX_SIZE;
    displayHeight = MAX_SIZE / item.aspectRatio;
  } else {
    displayHeight = MAX_SIZE;
    displayWidth = MAX_SIZE * item.aspectRatio;
  }

  const imageStyle = {
    width: displayWidth,
    height: displayHeight,
    borderRadius: item.id === 'horizontal' ? 24 : 32,
  };

  return (
    <GestureDetector gesture={tap}>
      <View
        style={[
          styles.carouselItemContainer,
          { width: itemWidth, height: itemWidth },
        ]}>
        <Animated.View
          style={[styles.imageWrapper, imageStyle, animatedStyle]}>
          <Image
            source={imageUri}
            style={styles.previewImage}
            contentFit="cover"
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

function PaginationDot({
  index,
  scrollX,
}: {
  index: number;
  scrollX: SharedValue<number>;
}) {
  const { fullWidth } = useCarousel();

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      [
        (index - 1) * fullWidth,
        index * fullWidth,
        (index + 1) * fullWidth,
      ],
      [8, 10, 8],
      Extrapolation.CLAMP,
    );

    const backgroundColorValue = interpolate(
      scrollX.value,
      [
        (index - 1) * fullWidth,
        index * fullWidth,
        (index + 1) * fullWidth,
      ],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    return {
      width,
      height: width,
      borderRadius: width / 2,
      backgroundColor: interpolateColor(
        backgroundColorValue,
        [0, 1],
        ['#EAE8E4', '#C15F3C'],
      ),
    };
  });

  return <Animated.View style={[styles.paginationDot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacings.xl,
  },
  carouselWrapper: {
    justifyContent: 'center',
    marginTop: Spacings.xl,
    marginBottom: Spacings.xxl,
  },
  flatListContent: {
    alignItems: 'center',
  },
  carouselItemContainer: {
    marginRight: CAROUSEL_SPACING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    backgroundColor: '#EAE8E4',
    overflow: 'hidden',
  },
  previewImage: {
    flex: 1,
  },
  hintText: {
    textAlign: 'center',
    color: '#868581',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacings.md,
    marginBottom: Spacings.xl,
    height: 10,
  },
  paginationDot: {
    marginHorizontal: 4,
  },
  detailsContainer: {
    paddingHorizontal: Spacings.lg,
  },
  descriptionText: {
    marginTop: Spacings.sm,
    lineHeight: 22,
  },
  previewSection: {
    marginTop: Spacings.xl,
  },
  placeholderGrid: {
    marginTop: Spacings.md,
    gap: Spacings.sm,
  },
  placeholderRow: {
    flexDirection: 'row',
    gap: Spacings.sm,
  },
  placeholderBox: {
    height: 60,
    flex: 1,
    backgroundColor: '#EAE8E4',
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: Spacings.lg,
    backgroundColor: '#FCFBF8',
  },
  continueButton: {
    backgroundColor: '#C15F3C',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
