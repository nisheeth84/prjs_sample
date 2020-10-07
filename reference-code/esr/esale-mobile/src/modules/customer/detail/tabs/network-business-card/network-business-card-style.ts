import { StyleSheet } from "react-native";
import { theme } from "../../../../../config/constants";
import { themeCusomer } from "../../shared/components/theme-customer";

export const NetworkBusinessCardStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    fontSize: 12
  },
  messageStyle: {
    justifyContent: "center", 
    alignItems: "center"
  },
  grayText: {
    color: theme.colors.gray1
  },
  marginTop10: {
    marginTop: 10,
  },
  partRow: {
    paddingLeft: 15,
    paddingRight: 10,
    backgroundColor: theme.colors.gray200,
    paddingVertical: 4
  },
  partBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  partText: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    flex: .93
  },
  addIcon: {
    width: 25,
    height: 25
  },
  businessCardBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  businessCardLeft: {
    alignSelf: "flex-start",
  },
  positionBlock: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
    borderRadius: 4,
    textAlign: "center",
    width: 120
  },
  positionLabel: {
    color: theme.colors.white,
    fontWeight: "bold",
    textAlign: "center",
    width: 102
  },
  positionIcon: {
    width: 18,
    height: 18,
  },
  businessCardImage: {
    marginTop: 10,
    width: 120,
    height: 60,
    resizeMode: "stretch",
  },
  businessCardRight: {
    paddingLeft: 10,
    alignSelf: "flex-start",
  },
  employeeImageBlock: {
    marginTop: 10,
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
  },
  employeeImage: {
    width: 30,
    height: 30,
    resizeMode: "stretch",
    marginRight: 5
  },
  addedIconBlock: {
    width: 30,
    height: 30,
    backgroundColor: themeCusomer.colors.blue200,
    fontSize: 12,
    color: "white",
    borderRadius: 30/2,
    justifyContent: "center",
  },
  addedIcon: {
    textAlign: "center",
    color: themeCusomer.colors.white,
  },
  popupConfirmContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  listEmployeesContent: {
    width: 270,
    height: 470,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50
  },
  popupConfirmContent: {
    width: 270,
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    padding: 15
  },
  infoEmployeeContainer: {
    height: 50,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#707070',
    width: '100%',
    alignItems: "center",
  },
  imageEmployeeContainer: {
    width: '15%',
    alignItems: 'center',
    justifyContent: "center"
  },
  imageEmployee: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: 'center'
  },
  backgroundAvatar: {
    backgroundColor: '#8AC891'
  },
  imageName: {
    fontSize: 16,
    color: '#FFFFFF'
  },
  infoEmployeeTextContainer: {
    width: '80%',
    justifyContent: 'space-between',
    padding: 10
  },
  employeeNameText:{
    color: '#0F6DB5',
    fontSize: 12
  },
  closeButtonContainer: {
    height: 70,
    width: '100%',
    borderTopColor:'#707070',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth:1
  },
  closeButton: {
    height: 40,
    width: 100,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonText: {
    color: '#333333',
    fontSize: 12
  },
});

export const BasicDetailBusinessCardStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    fontSize: 14,
    color: theme.colors.gray1
  },
  employeesNameBlock: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  positionBlock: {
    margin: 15,
  },
  havePosition: {
    borderRadius: 12
  },
  noPosition: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  positionContent: {
    margin: 15,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray100
  },
  updatePositionBlock: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray100
  },
  positionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    zIndex: 2
  },
  deletedButtonBlock: {
    marginTop: 40,
    alignItems: "center"
  },
  deletedButton: {
    height: 50,
    width: 165,
    backgroundColor: theme.colors.red,
    borderRadius: 12,
    justifyContent: 'center',
  },
});

export const SelectedPositionModalStyle = StyleSheet.create({
  containerModal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: theme.colors.white,
    margin: 0
  },
  container: {
    height: 430
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    justifyContent: "space-between"
  },
  selectButtonBlock: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  selectButton: {
    height: 50,
    width: 165,
    backgroundColor: theme.colors.blue200,
    borderRadius: 12,
    justifyContent: 'center',
  },
  labelButton: {
    textAlign: "center",
    color: theme.colors.white,
    fontWeight: "bold"
  },
  selectedIconBlock: {
    alignSelf: "center"
  },
});

export const SelectedTradingProductModalStyle = StyleSheet.create({
  container: {
    height: 430,
    backgroundColor: theme.colors.gray200,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  searchBlock: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    padding: 20,
    marginBottom: 10,
    backgroundColor: theme.colors.white,
  },
  inputSearch: {
    flexDirection: "row",
    borderRadius: 12,
    borderColor: theme.colors.gray100,
    backgroundColor: theme.colors.gray2,
    borderWidth: 1,
    padding: 10
  },
  searchIcon: {
    paddingRight: 10,
    marginRight: 10
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: theme.colors.white
  },
})
