import { StyleSheet } from "react-native";

/**
 * styles Calendar Component
 */

export const stylesOn = StyleSheet.create({
  itemDefault: {
    textAlign: 'center',
    padding: 2,
    width: 24,
    height: 24,
    borderRadius: 24
  },
  itemToday: {
    backgroundColor: '#0F6DB4',
    color: '#fff'
  },
  itemDaySelected: {
    backgroundColor: '#D5E2F2',
    color: '#333333'
  },
  itemDay: {
    textAlign: 'center',
    padding: 2,
    width: 24,
    height: 24,
    borderRadius: 24
  },
  itemDayHasData: {
    color: "#AAE4C8"
  },
  itemDayNoData: {
    color: "#ccc"
  },
  itemDayDot: {
    alignItems: "center",
    position: "absolute",
    bottom: -6,
    left: "40%"
  },
  itemDot: {
    fontWeight: "bold",
    fontSize: 24
  }
});

/**
 * styles for calendar in Calendar Component
 */

export const calendarStyle = {
  'stylesheet.calendar.header': {
    header: {
      height: 0,
    },
  },
  todayTextColor: '#333333',
  dayTextColor: '#333333',
  textSectionTitleColor: '#333333',
  textDayFontSize: 12,
  textMonthFontSize: 14,
  textDayHeaderFontSize: 14,
  textDisabledColor: '#989898',
};

/**
 * style Render Resource
 */

export const stylesRenderResource = StyleSheet.create({
  styleSchedule: {
    zIndex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  styleContent: {
    backgroundColor: '#DAE3F3',
    borderWidth: 1,
    borderColor: '#DAE3F3',
    padding: 5,
    borderRadius: 4,
  }
});

/**
 * style Item Resource
 */
export const stylesItemResource = StyleSheet.create({
  styleSchedule: {
    zIndex: 1,
    marginTop: 2,
    marginBottom: 2,
  },
  styleContent: {
    backgroundColor: '#DAE3F3',
    padding: 5,
    borderRadius: 4,
  },
});
