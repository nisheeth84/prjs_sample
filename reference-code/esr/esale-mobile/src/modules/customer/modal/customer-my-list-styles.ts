import { StyleSheet, StatusBar } from "react-native";

export const myListStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#FFFFFF',
  },
  inputListName: {
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
    fontSize: 14,
    height: 50,
    paddingLeft: 10
  },
  viewListName: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 10
  },
  viewRequired:
  {
    borderRadius: 5,
    backgroundColor: '#FA5151',
    width: 35,
    padding: 3,
    marginLeft: 20
  },
  labelRequired: {
    textAlign: 'center',
    fontSize: 10,
    color: '#FFFFFF',
  },
  viewCountListUserId: {
    alignItems: 'center',
  },
  viewListNNone: {
    display: 'none'
  },
  viewLine: {
    backgroundColor: '#EDEDED',
    height: 8,
  },
  viewLineNone: {
    display: 'none'
  },
  imageCountListUserID: {
    marginLeft: 10,
    marginRight: 10
  },
  viewRegionErrorHiden: {
    display: 'none'
  },
  viewRegionErrorShow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  viewInput: {
    paddingTop: 20,
  }
});
