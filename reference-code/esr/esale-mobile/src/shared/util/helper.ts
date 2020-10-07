import {
  Platform,
  StatusBar,
  Dimensions,
  PixelRatio,
} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const iPhoneX_HEIGHT = 812;
const iPhoneXr_HEIGHT = 896;
const iPhoneXs_HEIGHT = 896;
const iPhoneXsMax_HEIGHT = 896;
const iPhoneSE_HEIGHT = 568;
const pixelRatio = PixelRatio.get();

export const Screen = Dimensions.get('window');
export const ScreenWidth = Screen.width;
export const ScreenHeight = Screen.height;
/**
 * get Width Screen
 * @param width 
 */
export function getWidth(width: number) {
  return widthPercentageToDP((width / guidelineBaseWidth) * 100);
}
/**
 * get Height Screen
 * @param height 
 */
export function getHeight(height: number) {
  return heightPercentageToDP((height / guidelineBaseHeight) * 100);
}
/**
 * get normal size
 * @param size 
 */
export function normalize(size: number) {
  if (pixelRatio >= 2 && pixelRatio < 3) {
    // iPhone 5s and older Androids
    if (ScreenWidth < 360) {
      return size * 0.95;
    }

    // iPhone 5
    if (ScreenWidth < 667) {
      return size;
      // iPhone 6-6s
    }

    if (ScreenHeight >= 667 && ScreenHeight <= 735) {
      return size * 1.15;
    }
    // older phablets
    return size * 1.25;
  }

  if (pixelRatio >= 3 && pixelRatio < 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (ScreenWidth <= 360) {
      return size;
    }

    // Catch other weird android width sizings
    if (ScreenHeight < 667) {
      return size * 1.15;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (ScreenHeight >= 667 && ScreenHeight <= 735) {
      return size * 1.2;
    }

    // catch larger devices
    // ie iPhone 6s plus / 7 plus / mi note 等等
    return size * 1.27;
  }

  if (pixelRatio >= 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (ScreenWidth <= 360) {
      return size;
      // Catch other smaller android height sizings
    }

    if (ScreenHeight < 667) {
      return size * 1.2;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (ScreenHeight >= 667 && ScreenHeight <= 735) {
      return size * 1.25;
    }

    // catch larger phablet devices
    return size * 1.4;
  }

  return size;
}
/**
 * check device
 * @param dim 
 */
export function hasNotch() {
  return detection();
}
/**
 * check device
 * @param dim 
 */
export function isIPhoneSE(dim: any) {
  return dim.height === iPhoneSE_HEIGHT;
}
/**
 * check device
 * @param dim 
 */
export function isIPhoneX(dim: any) {
  return dim.height === iPhoneX_HEIGHT;
}
/**
 * check device
 * @param dim 
 */
export function isIPhoneXs(dim: any) {
  return dim.height === iPhoneXs_HEIGHT;
}
/**
 * check device
 * @param dim 
 */
export function isIPhoneXsMax(dim: any) {
  return dim.height === iPhoneXsMax_HEIGHT;
}
/**
 * check device
 * @param dim 
 */
export function isIPhoneXr(dim: any) {
  return dim.height === iPhoneXr_HEIGHT;
}
/**
 * get height status bar
 */
export function getStatusBarHeight() {
  return Platform.select({
    ios: hasNotch() ? 44 : 30,
    android: StatusBar.currentHeight,
  });
}
/**
 * detected device
 */
function detection() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (isIPhoneX(Screen) ||
      isIPhoneXr(Screen) ||
      isIPhoneXs(Screen) ||
      isIPhoneXsMax(Screen))
  );
}

/**
* truncate string if string too long
* @param str
* @param num
*/
export const truncateString = (str: string, num = 50) => {
 if (str.length <= num) {
   return str
 }
 return str.slice(0, num) + '...'
}