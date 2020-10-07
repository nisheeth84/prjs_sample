import { StyleSheet } from "react-native";
import { theme } from "../../../config/constants";

export const BusinessCardStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: theme.space[4],
  },
  textInput: {
    height: 54,
    borderWidth: 1,
    justifyContent: "center",
    padding: theme.space[3],
    borderRadius: theme.space[3],
    marginTop: theme.space[2],
    borderColor: theme.colors.gray100,
    backgroundColor: theme.colors.gray400,
  },
  text: {
    fontSize: theme.fontSizes[4],
  },
  input: {
    fontSize: theme.fontSizes[4],
  },
});
