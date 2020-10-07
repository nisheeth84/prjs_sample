import { StyleSheet } from "react-native";
export const CommonTabScreenStyles =  StyleSheet.create({
  titleTabsBlock: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
    
  },
  titleTabContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 46,
    padding:0,margin:0,
    flex:1,
  },
  activeTab: {
    backgroundColor: "#D6E3F3",
    borderColor: "#0F6DB5",
    borderBottomWidth: 1,
    fontWeight: "bold"
  },
  textLink: {
    color: "#0F6DB5",
    fontWeight:"bold"
  },
  textDefault: {
    color: "#333333",
    fontWeight:"bold"
  },
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 1,
    fontWeight: 'bold',
    width: 100,
    fontSize: 10,
    color: '#0F6DB5',
  },
  activeTitle: {
    textAlign: 'center',
    color: '#0F6DB5',
    backgroundColor: '#D6E3F3',
    fontSize: 12,
  },
  noactive: {
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    fontSize: 12,
  },
  padding25:{
    padding:25
  },
  paddingIOS:{
    paddingLeft: 25,
    paddingRight: 25
  },
  borderRight: {
    position: 'absolute',
    right: 0,
    height: 20,
    width: 1,
    backgroundColor: '#E5E5E5',
  },
  noBorderRight: {
    position: 'absolute',
    right: 0,
    height: 20,
    width: 1,
    backgroundColor: '#D6E3F3',
  },
  styleTab:{
    padding: 0,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "auto",
    borderRadius: 0,
  },
  iconStyle:{
    padding: 0,
    margin: 0,
  },
  labelStyle:{
    padding: 0,
    margin: 0
  },
  indicatorStyle:{
    backgroundColor: 'transparent'
  },
  badgeBlock: {
    position: "absolute",
    right: 6,
    width: 16,
    height: 16,
    backgroundColor: "red",
    fontSize: 8,
    color: "white",
    borderRadius: 16/2,
    justifyContent: "center",
  },
  badgeIcon: {
    textAlign: "center",
    color: "white",
    fontSize: 8,
  },
  divideTab: {
    height: 33,
    borderRightWidth: 1,
    borderColor: "#E5E5E5",
    right:0,
    position: "absolute",
  },
})