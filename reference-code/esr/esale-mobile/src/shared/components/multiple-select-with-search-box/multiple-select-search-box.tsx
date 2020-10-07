import React, { useState, useEffect } from "react";

import {
  FlatList,
  Modal,
  //Text,
  TouchableOpacity,
  View,
} from "react-native";
import { InputWithIcon } from "../search-input-with-icon";
//import { Icon } from "../icon";
import { MultipleSelectWithSearchBoxItem } from "./multiple-select-with-search-box-item";
import { SelectWithSearchBoxStyles } from "./styles";
//import { CommonStyles } from "../../common-style";
import { messages } from "./multiple-select-with-search-box-messages";
import { translate } from "../../../config/i18n";
import { AuthorityItemType } from "../../../config/constants/enum";
import { apiClient } from "../../../config/clients/api-client";
import { BUSINESS_CARD_API } from "../../../config/constants/api";

/**
 * interface for MultipleSelectWithSearchBox props
 */
interface MultipleSelectWithSearchBoxProps {
  // array of total data
  data?: Array<any>;
  // array of property need to display
  itemInfoProperties?: Array<string>;
  // place holder strong for search box
  placeHolder?: string;
  // name of id property
  idProperty?: string;
  // handle click submit modal
  onSubmitModal?: (result: any) => void;
  // title of button submit
  buttonSubmitTitle?: string;
  // title for button back to pick
  buttonBackTitle?: string;
  // check if only get search result
  isOnlyPickItem?: boolean;
  // label of notification input
  labelNotification?: string;
  // placeholder of notification input
  placeHolderNotification?: string;
  // visible of modal
  modalVisible?: boolean;
}

/**
 * Component display multiple select with search box
 * @param props
 */
export function MultipleSelectWithSearchBox({
  data = [
    {
      employeeId: 1,
      employeeName: "部署1AAAAAAA",
      employeeDescription: "社員A部長",
      employeeImage: "",
      departmentId: 1,
      departmentName: "部署名A",
      positionName: "役職名AAAAAAAAAAAAAAAAAAAAAAA",
      authorityItemType: AuthorityItemType.EMPLOYEE,
    },
    {
      employeeId: 2,
      employeeName: "部署1A2",
      employeeDescription: "社員A部長",
      employeeImage: "",
      departmentId: 2,
      departmentName: "部署名A2",
      positionName: "役職名A2",
      departmentParentName: "部署名AS2",
      authorityItemType: AuthorityItemType.DEPARTMENT,
    },
    {
      employeeId: 3,
      employeeName: "部署A3",
      employeeDescription: "社員A部長",
      employeeImage: "",
      departmentId: 3,
      departmentName: "部署名A3",
      positionName: "役職名A3",
      groupName: "グループA",
      authorityItemType: AuthorityItemType.GROUP,
    },
    {
      employeeId: 4,
      employeeName: "部署A31",
      employeeDescription: "社員A部長",
      employeeImage: "",
      departmentId: 4,
      departmentName: "部署名A4",
      positionName: "役職名A4",
      authorityItemType: AuthorityItemType.EMPLOYEE,
    },
    {
      employeeId: 5,
      employeeName: "部署A443",
      employeeDescription: "社員A部長",
      employeeImage: "",
      departmentId: 5,
      departmentName: "部署名A5",
      positionName: "役職名A5",
      authorityItemType: AuthorityItemType.EMPLOYEE,
    },
  ],
  //itemInfoProperties = ["employeeName", "employeeDescription"],
  placeHolder = translate(messages.multipleSearchBoxPlaceHolder),
  onSubmitModal = () => {},
  modalVisible = false,
}: MultipleSelectWithSearchBoxProps) {
  //const [selectArray, setSelectedArray] = useState<any>([]);
  const [dataSearch, setDataSearch] = useState(data);
  const [searchValue, setSearchValue] = useState("");

  // /**
  //  * handle press search item
  //  * @param indexInSelect
  //  * @param item
  //  */
  // const pressSearchItem = (indexInSelect: number, item: any) => {
  //   let newArray = [...selectArray];
  //   if (indexInSelect >= 0) {
  //     newArray.splice(indexInSelect, 1);
  //   } else {
  //     newArray.push(item);
  //   }
  //   setSelectedArray(newArray);
  // };

  /**
   * return index of item in an array
   * @param array
   * @param item
   * @param checkProperty
   */

  const handlePressItem = (item: any) => {
    setSearchValue("");
    setDataSearch([]);
    onSubmitModal(item);
  };

  /**
   * display search item
   * @param param0
   */
  const renderSearchItem = ({ item }: any) => {
    return (
      <MultipleSelectWithSearchBoxItem
        handlePressItem={handlePressItem}
        item={item}
      />
    );
  };

  /**
   * handle click delete button in select item
   * @param index
   */
  // const removeSelectItem = (index: number) => {
  //   let newArray = [...selectArray];
  //   newArray.splice(index, 1);
  //   setSelectedArray(newArray);
  // };

  /**
   * display selected item
   * @param param0
   */
  // const renderSelectedItem = ({ item, index }: any) => {
  //   return (
  //     <View style={SelectWithSearchBoxStyles.selectItemContainer}>
  //       <Icon style={SelectWithSearchBoxStyles.selectAvatar} name={"people"} />
  //       <Text style={CommonStyles.black10}>{item[itemInfoProperties[0]]}</Text>
  //       <TouchableOpacity
  //         onPress={() => removeSelectItem(index)}
  //         style={SelectWithSearchBoxStyles.deleteContainer}
  //       >
  //         <Icon style={SelectWithSearchBoxStyles.deleteIcon} name="delete" />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  /**
   * change data search and timeout for showing data
   */
  const callAPi = async () => {
    try {
      const response = await apiClient.post(
        BUSINESS_CARD_API.suggestionDepartment,
        { departmentName: searchValue },
        {}
      );
      setDataSearch(response?.data?.department);
    } catch (error) {
      setDataSearch([]);
    }

    // setDataSearch(response)
  };

  useEffect(() => {
    // timeOut = setTimeout(() => {
    if (searchValue) {
      callAPi();
    } else {
      setDataSearch([]);
    }
    // setDataSearch();
    // }, 500);
  }, [searchValue]);

  /**
   * handle when change search value
   * @param value
   */
  const handleSearchValue = (value: string) => {
    setSearchValue(value);
    // if (timeOut) {
    // clearTimeout(timeOut);
    // }
  };
  return (
    <View style={[SelectWithSearchBoxStyles.centeredView]}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setDataSearch([]);
          setSearchValue("");
        }}
      >
        <View style={SelectWithSearchBoxStyles.modalContent}>
          <TouchableOpacity
            onPress={() =>
              onSubmitModal({ departmentName: searchValue, departmentId: null })
            }
            activeOpacity={1}
            style={{ flex: 1, backgroundColor: "transparent" }}
          />

          <View style={SelectWithSearchBoxStyles.modalView}>
            <>
              <View style={SelectWithSearchBoxStyles.headerModal}>
                <InputWithIcon
                  searchText={searchValue}
                  handleChangeText={handleSearchValue}
                  placeHolder={placeHolder}
                  hasClear={!!searchValue}
                  clearText={() => setSearchValue("")}
                />
              </View>
              <View style={SelectWithSearchBoxStyles.spaceView} />
              <FlatList
                data={dataSearch}
                renderItem={renderSearchItem}
                keyExtractor={(item: any) => item?.departmentId?.toString()}
                style={SelectWithSearchBoxStyles.listSearch}
              />
            </>
          </View>
        </View>
      </Modal>
    </View>
  );
}
