import { useWindowDimensions } from 'react-native';

// iPads report at least this many points on their short edge; phones never do,
// so the check survives rotation in a way a plain width check would not.
const TABLET_SHORT_EDGE = 768;

const CONTENT_RATIO = 0.61;
const HEADER_RATIO = 0.92;

export function useLayout() {
  const { width, height } = useWindowDimensions();

  const isTablet = Math.min(width, height) >= TABLET_SHORT_EDGE;
  const contentWidth = isTablet ? Math.round(width * CONTENT_RATIO) : width;

  return {
    width,
    height,
    isTablet,
    contentWidth,
    headerWidth: isTablet ? Math.round(width * HEADER_RATIO) : width,
    /** For a screen's root view: a centred column on tablets, unchanged on phones. */
    column: { width: contentWidth, alignSelf: 'center' as const },
  };
}
