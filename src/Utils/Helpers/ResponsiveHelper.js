import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on standard ~5" screen mobile device
const baseWidth = 375;
const baseHeight = 667;

/**
 * Function to scale font size based on screen width
 * @param {number} size - The font size on the base screen
 * @returns {number} - The scaled font size
 */
export const scaleFont = (size) => {
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale;

  // Round to nearest pixel for better rendering
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }

  return Math.round(newSize);
};

/**
 * Function to scale size based on screen width (for spacing, margins, etc.)
 * @param {number} size - The size on the base screen
 * @returns {number} - The scaled size
 */
export const scaleSize = (size) => {
  const scale = SCREEN_WIDTH / baseWidth;
  return size * scale;
};

/**
 * Function to scale size based on screen height (for vertical spacing)
 * @param {number} size - The size on the base screen
 * @returns {number} - The scaled size
 */
export const scaleHeight = (size) => {
  const scale = SCREEN_HEIGHT / baseHeight;
  return size * scale;
};

/**
 * Moderate scale function - scales less aggressively
 * Good for font sizes to avoid extremely large text on tablets
 * @param {number} size - The size on the base screen
 * @param {number} factor - How much to scale (0 = no scale, 1 = full scale)
 * @returns {number} - The scaled size
 */
export const moderateScale = (size, factor = 0.5) => {
  const scale = SCREEN_WIDTH / baseWidth;
  return size + (scale - 1) * size * factor;
};

/**
 * Responsive font sizes for common text styles
 */
export const FontSizes = {
  title: moderateScale(29, 0.4),        // Main titles
  large: moderateScale(20, 0.4),        // Large text / Subtitles
  medium: moderateScale(16, 0.4),       // Medium text
  regular: moderateScale(14, 0.4),      // Regular text
  small: moderateScale(12, 0.4),        // Small text
  tiny: moderateScale(10, 0.4),         // Tiny text
};

/**
 * Get device type based on screen width
 */
export const getDeviceType = () => {
  if (SCREEN_WIDTH < 375) {
    return 'small'; // Small phones (iPhone SE, etc.)
  } else if (SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768) {
    return 'normal'; // Normal phones
  } else if (SCREEN_WIDTH >= 768 && SCREEN_WIDTH < 1024) {
    return 'tablet'; // Tablets
  }
  return 'large'; // Large tablets/iPads
};

/**
 * Responsive spacing
 */
export const Spacing = {
  tiny: scaleSize(4),
  small: scaleSize(8),
  medium: scaleSize(16),
  large: scaleSize(24),
  xlarge: scaleSize(32),
  xxlarge: scaleSize(48),
};

export default {
  scaleFont,
  scaleSize,
  scaleHeight,
  moderateScale,
  FontSizes,
  Spacing,
  getDeviceType,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};
