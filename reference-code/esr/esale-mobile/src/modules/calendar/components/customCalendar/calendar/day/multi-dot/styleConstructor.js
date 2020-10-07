import { StyleSheet } from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.day.multiDot';
const stylesOn = StyleSheet.create({
  itemDefault: {
    textAlign: 'center',
    padding: 2,
    width: 24,
    height: 24,
    borderRadius: 24,
  },
  itemToday: {
    backgroundColor: '#0F6DB4',
    color: '#fff',
  },
  itemDaySelected: {
    backgroundColor: '#D5E2F2',
    color: '#333333',
  },
  itemDay: {
    textAlign: 'center',
    padding: 2,
    width: 24,
    height: 24,
    borderRadius: 24,
  },
  itemDayHasData: {
    color: '#AAE4C8',
  },
  itemDayNoData: {
    color: '#ccc',
  },
  itemDayDot: {
    alignItems: 'center',
    position: 'absolute',
    bottom: -6,
    left: '40%',
  },
  itemDot: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});
export default function styleConstructor(theme = {}) {
  const appStyle = { ...defaultStyle, ...theme };
  return StyleSheet.create({
    base: {
      width: 20,
      height: 20,
      alignItems: 'center',
      borderRadius: 20,
    },
    text: {
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight,
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    alignedText: {
      marginTop: 0,
    },
    selected: {
      backgroundColor: '#D5E2F2',
      borderRadius: 20,
    },
    today: {
      backgroundColor: '#0F6DB4',
    },
    todayText: {
      color: '#fff',
    },
    selectedText: {
      color: '#333333',
    },
    disabledText: {
      color: appStyle.textDisabledColor,
    },
    dot: {
      width: 4,
      height: 4,
      marginTop: 7,
      marginLeft: 1,
      marginRight: 1,
      borderRadius: 4,
      opacity: 0,
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: appStyle.dotColor,
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor,
    },
    weekend:{ color: '#B91C1C' }, 
    ...(theme[STYLESHEET_ID] || {}),
  });
}
