import {StyleSheet } from "react-native";

export const BusinessCardStyles = StyleSheet.create({
  bg: { height: "100%" },
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },
  listCard: {
    flex: 1,
    marginTop: 8,
    marginBottom: 100,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  employeeContainer: {
    flexDirection: 'row'
  },
  link: {
    color: '#0F6DB5',
  },
  employeeText: {
    color: '#0F6DB5'
  },
  labelHeader: {
    color: '#333333',
    fontWeight:"bold"
  }
});

export const BusinessCardItemStyles = StyleSheet.create({
  inforBusiness: {
    backgroundColor: "#FFFFFF",
    marginBottom: 2,
    paddingVertical: 15,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    marginHorizontal: 15,
    flex:0.9
  },
  mainInforBlock: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 104,
    height: 60,
  },
  iconArrowRight: {
    width: 30,
    height: 30,
    justifyContent: "center",
    maxWidth:30
  },
  nameColor: { color:  "#666666", },
});

