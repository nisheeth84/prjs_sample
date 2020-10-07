import { StyleSheet } from "react-native";
import { theme } from "../../../../config/constants";

export const BusinessCardBasicInfoStyle = StyleSheet.create({
  partContainer: {
    marginTop: theme.space[3],
    backgroundColor: theme.colors.white100,
  },
  activityContainer: {
    backgroundColor: theme.colors.white100,
  },
  headerPart: {
    paddingHorizontal: theme.space[3],
    paddingTop: theme.space[4],
    paddingBottom: theme.space[5],
    borderBottomColor: theme.colors.gray100,
    borderBottomWidth: 2,
  },
  timeLineContent: {
    paddingVertical: theme.space[4],
    paddingHorizontal: theme.space[3],
  },
  containerList: {
    flex: 1,
    backgroundColor: "white",
  },
});
