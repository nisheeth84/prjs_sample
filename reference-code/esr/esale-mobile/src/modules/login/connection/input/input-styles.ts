import { StyleSheet, Platform } from "react-native";

export const InputStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFF",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingVertical: Platform.OS === 'ios' ? 12 : 0
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5
  },
});
