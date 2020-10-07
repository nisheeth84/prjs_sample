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
import { messages } from "../calendar-list-messages";
import { translate } from "../../../config/i18n";
import { TypeMessage } from '../../../config/constants/enum';

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

/* 
get Lang by key
*/
export function getValueByKey(key: any) {
  if (messages[`${key}`])
    return translate(messages[`${key}`]);
  return '';
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
  const indexSpecial = str.indexOf(translate(messages.other))
  if (indexSpecial < num) {
    num += translate(messages.other).length
  }
  return str.slice(0, num) + '...'
}

/**
 * check status response api
 * @param response 
 */
export const checkResponse = (response: any) => {
  let result = false
  let message = {}
  if (!response) {
    return {result: result, messages: {}}
  }
  switch (response.status) {
    case 200:      
      result = true
      message = {}
      break;
    case 400:
      message = {
        type: TypeMessage.ERROR,
        content: translate(messages.error_400)
      }
      break;
    case 500:
      message = {
        type: TypeMessage.ERROR,
        content: translate(messages.error_500)
      }
      break;
    case 403:
      message = {
        type: TypeMessage.ERROR,
        content: translate(messages.error_403)
      }
      break;
    default:
      message = {
        type: TypeMessage.ERROR,
        content: translate(messages.error)
      }
  }

  return {result: result, messages: message}
}
/**
 * show toast message
 * @param data 
 */
export const showToastMessage = (_data: any) => {
  // Toast.show({
  //   position: TOAST_MSG_POSITION.BOTTOM,
  //   visibilityTime: TOAST_MSG_DEFAULT,
  //   text2: data.type,
  //   text1: data.content,
  //   autoHide: true
  // })
}