import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export const GroupModalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalHeader: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    height: '100%'
  },
  modalContent: {
    flex: 4,
  },
  inputSearch: {
    minHeight: 0.052 * height,
    width: 0.82 * width,
    paddingLeft: 10
  },
  viewSearch: {
    flexDirection: 'row',
    alignItems: "center",
    borderColor: "#CDCDCD",
    borderWidth: 1,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#E5E5E5"
  },
  styleIconClose: {
    position: "absolute",
    right: 10
  },
  seperateBig: {
    backgroundColor: "#E5E5E5",
    height: 0.0155 * height,
    marginTop: 20
  },
  styleMyList: {
    marginTop: 5,
    marginLeft: 20
  },
  styleGroup: {
    marginTop: 5,
    marginLeft: 20
  },
  seperate: {
    borderColor: "gray",
    borderWidth: 0.3
  },
  buttonModal: {
    alignSelf: "center",
    position: "absolute",
    bottom: 10
  },
  flatListStyle: {
    flex: 2
  },
})
export const SortProductSelection = StyleSheet.create({
  spacePadding: {
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center"
  },
  bold: {
    fontWeight: "normal",
  },
  boldTextButton: {
    fontWeight: "normal",
    marginLeft: 10
  },
  width100: {
    width: "100%",
  },
  orderSelect: {
    flexDirection: 'row',
    width: 0.203 * width,
    height: 0.0414 * height,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  iconContainer: {
    paddingHorizontal: 5,
    marginRight: 12,
    borderWidth: 1,
  },

})
export const AppbarCommonStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    elevation: 1,
  },
  leftElement: {
    flex: 1,
  },
  centerElement: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightElement: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
  },
  buttonStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
});