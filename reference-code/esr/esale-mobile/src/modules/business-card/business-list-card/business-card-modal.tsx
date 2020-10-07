import React from "react";
import {
  FlatList,
  Modal,
  // Alert as ShowError,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { useDispatch } from "react-redux";
import { messages } from "./business-card-messages";
import { translate } from "../../../config/i18n";
import { BusinessCardStyles } from "./business-card-style";
// import { getRecordIds } from "../business-card-repository";

/**
 * interface for business card modal
 */
interface BusinessCardProps {
  // array of modal data
  data: any;
  // check open modal
  openModal: boolean;
  // toggle show/hide modal
  onPress: (argument: boolean) => void;
  // data selected
  selectedBusinessCard?: Array<any>;
  // data deselected
  deselectedBusinessCard?: Array<any>;
  // has press select all
  hasPressSelectAll?: boolean;
  // search Conditions
  searchConditions?: any;

  removeFromFavorite: Function;

  deleteList: Function; // => show modal and call api remove list

  copyList: Function; // => show copy list screen

  addToFavorite: Function; // => call api add favorite list

  refreshList: Function; // => call api refresh auto list

  changeToShareList: Function; // => show modal and call api 

  deleteBusinessCard: Function; // show modal and call api delete???

  removeRecordFromList: Function; // show modal and call api removeBusinessCardsFromList

}

/**
 * render modal card
 */
export const BusinessCardModal: React.FC<BusinessCardProps> = ({
  data,
  openModal,
  onPress = () => { },
  // hasPressSelectAll = false,
  selectedBusinessCard = [],
  // deselectedBusinessCard = [],
  // searchConditions = {},
  removeFromFavorite = () => { },
  deleteList = () => { },
  copyList = () => { },
  addToFavorite = () => { },
  refreshList = () => { },
  changeToShareList = () => { },
  deleteBusinessCard = () => { },
  removeRecordFromList = () => { }

}) => {
  // const dispatch = useDispatch();
  const navigation = useNavigation();

  /**
   * call api get record id and navigate to new screen
   */
  // const callApiGetRecordIds = (navigateScreenName: string) => {
  //   const callApi = async () => {
  //     let params = {
  //       searchConditions,
  //       deselectedRecordIds: deselectedBusinessCard
  //     }
  //     const response = await getRecordIds(params, {})
  //     if (response?.status == 200 && response?.data) {
  //       navigation.navigate(navigateScreenName,
  //         {
  //           totalRecords: response.data.totalRecords,
  //           recordIds: response.data.recordIds
  //         })
  //     }
  //   }
  //   callApi()
  // }

  /**
   * close modal
   */
  const handleCloseModal = () => {
    onPress(!openModal)
    // dispatch(businessCardActions.getCreatList(0));
  }

  const checkNavigate = (item: any) => {

    switch (item.name) {
      case translate(messages.removeFavorites):
        removeFromFavorite()
        break
      case translate(messages.editList):
        removeFromFavorite()
        break
      case translate(messages.removeList):
        deleteList()
        break
      case translate(messages.listDuplicate):
        copyList()
        break
      case translate(messages.addToFavorite):
        addToFavorite()
        break
      case translate(messages.updateList):
        refreshList()
        break
      case translate(messages.changeToShareList):
        changeToShareList()
        break
      case translate(messages.addToList):
        navigation.navigate("add-to-list",
          {
            totalRecords: (selectedBusinessCard || []).length,
            recordIds: (selectedBusinessCard || [])
          })
        break
      case translate(messages.createMyList):
        // if (hasPressSelectAll) {
        //   callApiGetRecordIds("business-card-create-my-list")
        // } else {
        navigation.navigate("business-card-create-my-list",
          {
            totalRecords: (selectedBusinessCard || []).length,
            recordIds: (selectedBusinessCard || [])
          })
        // }
        break
      case translate(messages.createListShare):
        navigation.navigate("business-card-create-shared-list",
          {
            totalRecords: (selectedBusinessCard || []).length,
            recordIds: (selectedBusinessCard || [])
          })
        break
      case translate(messages.remove):
        deleteBusinessCard()
        break
      case translate(messages.moveToList):
        // if (hasPressSelectAll) {
        //   callApiGetRecordIds("move-to-list")
        // } else {
          navigation.navigate("move-to-list",
            {
              totalRecords: (selectedBusinessCard || []).length,
              recordIds: (selectedBusinessCard || [])
            })
        // }
        break
      case translate(messages.removeFromList):
        removeRecordFromList();
        break
      default:
        // dispatch(businessCardActions.getCreatList(0));
        break
    }
    onPress(!openModal);
  };

  /**
   * render item FlatList
   * @param item
   *
   */
  const renderItem = (item: any) => {
    return (
      <TouchableOpacity
        style={BusinessCardStyles.item}
        onPress={() => checkNavigate(item)}
      >
        <Text style={BusinessCardStyles.textModal}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  /**
   * render Separator
   */
  const renderSeparator = () => {
    return <View style={BusinessCardStyles.separator} />;
  };
  return (
    <Modal
      visible={openModal}
      animationType="fade"
      transparent
      onRequestClose={handleCloseModal}
    // onDismiss={handleCloseModal}
    >
      <View style={BusinessCardStyles.modal}>
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={BusinessCardStyles.bgModal} />
        </TouchableWithoutFeedback>
        <View style={BusinessCardStyles.bodyModal}>
          <FlatList
            data={data}
            ItemSeparatorComponent={renderSeparator}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item: any) => item.id.toString()}
          />
        </View>
      </View>
    </Modal>
  );
};
