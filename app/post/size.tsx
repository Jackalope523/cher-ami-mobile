import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { openCropper } from 'react-native-image-crop-picker';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: windowWidth } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = windowWidth - 80; // 40 margin on each side
const CAROUSEL_SPACING = 40;
const ITEM_FULL_WIDTH = CAROUSEL_ITEM_WIDTH + CAROUSEL_SPACING;

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
    label: 'Standard',
    description:
      'Recommended size. 4:3 aspect ratio. Best for family portraits, landscape photos.',
    width: 1088,
    height: 756,
    aspectRatio: 1088 / 756,
  },
  {
    id: 'vertical',
    label: 'Vertical',
    description: '9:16 aspect ratio. Best for portraits, lifestyle photos.',
    width: 1088,
    height: 1933,
    aspectRatio: 1088 / 1933,
  },
  {
    id: 'horizontal',
    label: 'Horizontal',
    description: 'Best for landscape and panoramic photos.',
    width: 2250,
    height: 756,
    aspectRatio: 2250 / 756,
  },
  {
    id: 'feature',
    label: 'Feature',
    description:
      'Best for high quality photos that you want to highlight in the magazine. 1 per user, per issue.',
    width: 2250,
    height: 2344,
    aspectRatio: 2250 / 2344,
  },
];

export default function Size() {
  const { issueTitle, imageUri, uploadId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

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
            uploadId,
            imageUri: image.path,
            width: image.cropRect?.width,
            height: image.cropRect?.height,
            x: image.cropRect?.x,
            y: image.cropRect?.y,
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
        <View style={styles.carouselWrapper}>
          <Animated.FlatList
            data={SIZES}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_FULL_WIDTH}
            decelerationRate="fast"
            contentContainerStyle={styles.flatListContent}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
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

        <View style={styles.detailsContainer}>
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
        style={[styles.footer, { paddingBottom: insets.bottom + Spacings.md }]}>
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
}: {
  imageUri: string;
  item: ImageSize;
  index: number;
  scrollX: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [
        (index - 1) * ITEM_FULL_WIDTH,
        index * ITEM_FULL_WIDTH,
        (index + 1) * ITEM_FULL_WIDTH,
      ],
      [0.9, 1, 0.9],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      [
        (index - 1) * ITEM_FULL_WIDTH,
        index * ITEM_FULL_WIDTH,
        (index + 1) * ITEM_FULL_WIDTH,
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
  const MAX_SIZE = CAROUSEL_ITEM_WIDTH - PADDING;
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
    <View style={styles.carouselItemContainer}>
      <Animated.View style={[styles.imageWrapper, imageStyle, animatedStyle]}>
        <Image
          source={imageUri}
          style={styles.previewImage}
          contentFit="cover"
        />
      </Animated.View>
    </View>
  );
}

function PaginationDot({
  index,
  scrollX,
}: {
  index: number;
  scrollX: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      [
        (index - 1) * ITEM_FULL_WIDTH,
        index * ITEM_FULL_WIDTH,
        (index + 1) * ITEM_FULL_WIDTH,
      ],
      [8, 10, 8],
      Extrapolation.CLAMP,
    );

    const backgroundColorValue = interpolate(
      scrollX.value,
      [
        (index - 1) * ITEM_FULL_WIDTH,
        index * ITEM_FULL_WIDTH,
        (index + 1) * ITEM_FULL_WIDTH,
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
    height: CAROUSEL_ITEM_WIDTH,
    justifyContent: 'center',
    marginTop: Spacings.xl,
    marginBottom: Spacings.xxl,
  },
  flatListContent: {
    paddingHorizontal: CAROUSEL_SPACING,
    alignItems: 'center',
  },
  carouselItemContainer: {
    width: CAROUSEL_ITEM_WIDTH,
    height: CAROUSEL_ITEM_WIDTH,
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
