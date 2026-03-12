import PopPressable from '@/components/PopPressable';
import { Spacings } from '@/constants/Spacings';
import { textStyles } from '@/constants/TextStyles';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { openCropper } from 'react-native-image-crop-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: windowWidth } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = windowWidth * 0.8;
const CAROUSEL_SPACING = (windowWidth - CAROUSEL_ITEM_WIDTH) / 2;

const SIZES = [
  {
    id: 'standard',
    label: 'Standard',
    description:
      'Recommended size. 4:3 aspect ratio.\nBest for family portraits, landscape photos.',
    width: 1088,
    height: 756,
    aspectRatio: 4 / 3,
  },
  {
    id: 'portrait',
    label: 'Portrait',
    description:
      'Tall format. 3:4 aspect ratio.\nGreat for single person portraits and scenery.',
    width: 756,
    height: 1088,
    aspectRatio: 3 / 4,
  },
  {
    id: 'square',
    label: 'Square',
    description:
      '1:1 aspect ratio.\nClassic social media look, perfect for close-ups.',
    width: 1000,
    height: 1000,
    aspectRatio: 1,
  },
  {
    id: 'spread',
    label: 'Spread',
    description:
      'Extra wide format. 16:9 aspect ratio.\nIdeal for panoramic shots and wide group photos.',
    width: 1600,
    height: 900,
    aspectRatio: 16 / 9,
  },
];

export default function PickSize() {
  const { issueTitle, imageUri } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

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
    }).then((image) => {
      router.replace({
        pathname: '/post/create',
        params: {
          issueTitle,
          imageUri: image.path,
          width: selected.width,
          height: selected.height,
        },
      });
    });
  }

  const renderItem = ({ item }: { item: (typeof SIZES)[0] }) => {
    return (
      <View style={styles.carouselItemContainer}>
        <View style={[styles.imageWrapper, { aspectRatio: item.aspectRatio }]}>
          <Image
            source={{ uri: imageUri as string }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={SIZES}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CAROUSEL_ITEM_WIDTH + Spacings.md}
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          onScroll={onScroll}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(item) => item.id}
        />

        <Text style={[textStyles.body, styles.hintText]}>
          You'll get to adjust the crop next.
        </Text>

        <View style={styles.paginationContainer}>
          {SIZES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                activeIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={textStyles.heading3}>{SIZES[activeIndex].label}</Text>
          <Text style={[textStyles.caption, styles.descriptionText]}>
            {SIZES[activeIndex].description}
          </Text>

          <View style={styles.previewSection}>
            <Text style={textStyles.labelLargeBlack}>Preview</Text>
            <View style={styles.placeholderGrid}>
              {/* Simplified placeholders matching the design */}
              <View style={styles.placeholderRow}>
                <View style={styles.placeholderBox} />
                <View style={styles.placeholderBox} />
              </View>
              <View style={styles.placeholderRow}>
                <View style={[styles.placeholderBox, { flex: 2 }]} />
                <View style={styles.placeholderBox} />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + Spacings.md }]}>
        <PopPressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={textStyles.buttonTextWhite}>Continue</Text>
        </PopPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
  },
  content: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: CAROUSEL_SPACING,
    paddingTop: Spacings.xl,
    alignItems: 'center',
  },
  carouselItemContainer: {
    width: CAROUSEL_ITEM_WIDTH,
    marginRight: Spacings.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: '100%',
    backgroundColor: '#EAE8E4',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  previewImage: {
    flex: 1,
  },
  hintText: {
    textAlign: 'center',
    marginTop: Spacings.lg,
    color: '#868581',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacings.md,
    marginBottom: Spacings.xl,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EAE8E4',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#C15F3C',
    width: 10,
    height: 10,
    borderRadius: 5,
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
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
