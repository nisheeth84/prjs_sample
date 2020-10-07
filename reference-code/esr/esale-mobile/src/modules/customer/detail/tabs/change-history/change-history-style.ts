import { StyleSheet } from "react-native";
import { themeCusomer } from "../../shared/components/theme-customer";

export const ChangeHistoryStyles =  StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingVertical: 15
  },
  messageStyle: {
    justifyContent: "center", 
    alignItems: "center"
  },
  item: {
    flexDirection: "row",
    color: themeCusomer.colors.black,
    fontSize: 12,
    paddingBottom: 20,
    paddingHorizontal: 15
  },
  imageLeftBlock: {
    paddingRight: 15,
    paddingTop: 8,
    width: 30
  },
  ellipseBlueIcon: {
    marginTop: 3,
    zIndex: 2
  },
  employeeImage: {
    width: 26,
    height: 26,
  },
  imageVerticalLine: {
    position: "absolute",
    top: 16,
    left: 0,
    zIndex: 1,
    marginLeft: 7
  },
  titleBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateLabel: {
    marginRight: 90
  },
  avatarBlock: {
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
  },
  employeeText: {
    color: themeCusomer.colors.blue200,
    paddingLeft: 5
  },
  contentBlock: {
    padding: 15,
    backgroundColor: themeCusomer.colors.gray2,
    borderRadius: 12,
    marginVertical: 10
  },
  textContent: {
    flexDirection: "row",
    flex: 10
  },
  contentChange: {
    paddingLeft: 10
  },
  arrowLabel: {
    fontSize: 30
  }
})