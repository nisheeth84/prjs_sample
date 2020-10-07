import {
  Platform,
  StatusBar,
  Dimensions,
  PixelRatio,
} from 'react-native'
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen'

const guidelineBaseWidth = 375
const guidelineBaseHeight = 812
const iPhoneX_HEIGHT = 812
const iPhoneXr_HEIGHT = 896
const iPhoneXs_HEIGHT = 896
const iPhoneXsMax_HEIGHT = 896
const iPhoneSE_HEIGHT = 568
const pixelRatio = PixelRatio.get()

export const Screen = Dimensions.get('window')
export const ScreenWidth = Screen.width
export const ScreenHeight = Screen.height

export function getWidth(width: number) {
  return widthPercentageToDP((width / guidelineBaseWidth) * 100)
}

export function getHeight(height: number) {
  return heightPercentageToDP((height / guidelineBaseHeight) * 100)
}

export function normalize(size: number) {
  if (pixelRatio >= 2 && pixelRatio < 3) {
    // IPhone 5s and older Androids
    if (ScreenWidth < 360) {
      return size * 0.95
    }

    // IPhone 5
    if (ScreenWidth < 667) {
      return size
      // IPhone 6-6s
    }

    if (ScreenHeight >= 667 && ScreenHeight <= 735) {
      return size * 1.15
    }
    return size * 1.25
  }

  if (pixelRatio >= 3 && pixelRatio < 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (ScreenWidth <= 360) {
      return size
    }

    // Catch other weird android width sizings
    if (ScreenHeight < 667) {
      return size * 1.15
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (ScreenHeight >= 667 && ScreenHeight <= 735) {
      return size * 1.2
    }

    // catch larger devices
    // ie IPhone 6s plus / 7 plus / mi note 等等
    return size * 1.27
  }

  if (pixelRatio >= 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (ScreenWidth <= 360) {
      return size
      // Catch other smaller android height sizings
    }

    if (ScreenHeight < 667) {
      return size * 1.2
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (ScreenHeight >= 667 && ScreenHeight <= 735) {
      return size * 1.25
    }

    return size * 1.4
  }

  return size
}

export function hasNotch() {
  return detection()
}

export function isIPhoneSE(dim: any) {
  return dim.height === iPhoneSE_HEIGHT
}

export function isIPhoneX(dim: any) {
  return dim.height === iPhoneX_HEIGHT
}

export function isIPhoneXs(dim: any) {
  return dim.height === iPhoneXs_HEIGHT
}

export function isIPhoneXsMax(dim: any) {
  return dim.height === iPhoneXsMax_HEIGHT
}

export function isIPhoneXr(dim: any) {
  return dim.height === iPhoneXr_HEIGHT
}

export function getStatusBarHeight() {
  return Platform.select({
    ios: hasNotch() ? 44 : 30,
    android: StatusBar.currentHeight,
  })
}

function detection() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (isIPhoneX(Screen) ||
      isIPhoneXr(Screen) ||
      isIPhoneXs(Screen) ||
      isIPhoneXsMax(Screen))
  )
}
