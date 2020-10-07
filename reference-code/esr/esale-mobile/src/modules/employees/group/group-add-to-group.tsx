import React, { useEffect, useState } from 'react';
import { selectedEmployeeIdsSelector, conditionSelector, filterSelector } from '../list/employee-list-selector';
import { GroupCommonStyles } from './group-style';
import { Icon } from '../../../shared/components/icon';
import { messages } from './group-messages';
import { translate } from '../../../config/i18n';
import { useSelector, useDispatch } from 'react-redux';
import ModalDirty from "react-native-modal";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Keyboard,
  KeyboardEvent
} from 'react-native';
import { getGroupSuggestionFromAPI, addGroupAPI } from './group-add-to-group-repository';
import { GroupModalStyles } from './group-add-to-group-style-modal';
import { GroupType, TypeMessage, ActionType } from '../../../config/constants/enum';
import { SelectOption } from './group-add-to-group-select';
import { AppbarCommon } from './group-add-to-group-Appbar';
import { CommonMessages, CommonMessage } from '../../../shared/components/message/message';
import { ressponseStatus, TEXT_EMPTY } from '../../../shared/components/message/message-constants';
import { useNavigation } from '@react-navigation/native';
import { ModalDirtycheckButtonBack } from '../../../shared/components/modal/modal';
import { filterEmployee } from '../../../shared/utils/common-api';

/**
 * Interface Data API groupInfo
 */
export interface GroupSuggestions {
  groupId: number;
  groupName: string;
  groupType: number;
  isAutoGroup: boolean;
  lastUpdatedDate: any;
  isOverWrite: boolean;
  employeeName: string
}

/**
 * Interface Data API
 */
export interface Group {
  data: {
    groupInfo: Array<any>;
  }
  status: number;
}

// set EMPTY
export const EMPTY = "";

/**
 * Group add member to group
 */
export const AddToGroup = () => {
  const dispatch = useDispatch();
  // get employee filter from redux
  const employeesFilter = useSelector(filterSelector);
  // active button when add group
  const [buttonActive, setActiveButton] = useState(false);
  // employee selected
  const employeeSelected = useSelector(selectedEmployeeIdsSelector);
  // get data initializeGroupModal
  const [value, setValue] = useState("");
  // array my group
  const [dataMyGroup, setMyDataGroup] = useState<GroupSuggestions[]>([]);
  // array share group
  const [dataShareGroup, setShareGroup] = useState<GroupSuggestions[]>([]);
  // action modal
  const [modalVisible, setModalVisible] = useState(false);
  // data select option select
  const [dataSelectGroupName, setDataSelectGroupName] = useState("");
  const [dataSelectGroupId, setDataSelectGroupId] = useState(0);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState(0);
  const [errMessage, setErrMessage] = useState(false);
  const [errMessageAddGroup, setErrMessageAddGroup] = useState(false);
  const [group, setGroup] = useState(false);
  const [responseAddError, setResponseAddError] = useState<any>("");
  const navigation = useNavigation();
  const [isVisibleDirtycheck, setIsVisibleDirtycheck] = useState(false);
  const conditonEmployeeSelector = useSelector(conditionSelector);
  const [inputFocus, setInputFocus] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  /**
   * handle click item
   */
  const handlModalVisible = () => {
    setModalVisible(true);
    setDataSelectGroupId(groupId);
    setDataSelectGroupName(groupName);
    setErrMessageAddGroup(false);
  }

  /**
   * check data API status
   * @param response data API search
   */
  const responseAddGroup = (response: any) => {
    if (response.status === ressponseStatus.statusSuccess) {
      setErrMessageAddGroup(false);
    } else {
      // Set ressponse
      setResponseAddError(response);
      setErrMessageAddGroup(true);
    }
  }

  /**
   * check data API status
   * @param response data API search
   */
  const responseSearch = (response: Group, text: string) => {
    if (response?.status === ressponseStatus.statusSuccess) {
      if (response.data.groupInfo.length > 0 && text.length > 0) {
        // classify my group and share group
        let tempMyGroup = response.data.groupInfo.filter(
          (param: GroupSuggestions) =>
            param.groupType === GroupType.MY_GROUP
        );
        let tempShareGroup = response.data.groupInfo.filter(
          (param: GroupSuggestions) =>
            param.groupType === GroupType.SHARE_GROUP
        );
        setMyDataGroup(tempMyGroup);
        setShareGroup(tempShareGroup);
      } else {
        setMyDataGroup([]);
        setShareGroup([]);
      }
      setErrMessage(false);
    } else {
      setErrMessage(true);
    }
  }

  /**
   * set value text input
   * @param text string text input
   */
  const onChangeText = (text: string) => {
    setValue(text);
  };

  /**
  * set value text input
  * @param text string text input
  */
  const onCloseModalHeader = (text: string) => {
    setMyDataGroup([]);
    setShareGroup([]);
    setDataSelectGroupId(0);
    setDataSelectGroupName(EMPTY)
    setValue(text);
    setModalVisible(false);
  };

  /**
   * set value text input
   * @param text string text input
   */
  const handleCloseIconSearch = (text: string) => {
    setMyDataGroup([]);
    setShareGroup([]);
    setValue(text);
  };
  /**
    * function hanlde add member to group
    */
  const handleAddToGroup = async () => {
    setResponseAddError("");
    const param: any = {
      groupId: groupId,
      employeeIds: employeeSelected
    };
    const response = await addGroupAPI(param);
    if (response) {
      responseAddGroup(response);
    }
    if (response.status === ressponseStatus.statusSuccess) {
      filterEmployee(conditonEmployeeSelector.selectedTargetType,
        conditonEmployeeSelector.selectedTargetId,
        conditonEmployeeSelector.isUpdateListView,
        conditonEmployeeSelector.searchConditions,
        conditonEmployeeSelector.filterConditions,
        conditonEmployeeSelector.localSearchKeyword,
        conditonEmployeeSelector.orderBy,
        dispatch,
        {
          offset: 0,
          limit: employeesFilter.limit,
          filterType: employeesFilter.filterType
        }
      );
      navigation.navigate("employee-list", { notify: ActionType.UPDATE, isShow: true });
    }
    setDataWhenAddGroup();
    setActiveButton(false);
    setGroup(false);
  }

  /**
   * call API search
   * @param text text Search
   */
  const handleSearchCallAPI = async (text: string) => {
    const param: any = {
      searchValue: text,
    }
    //Todo call API
    const response = await getGroupSuggestionFromAPI(param);
    if (response) {
      responseSearch(response, text);
    }
  }

  useEffect(() => {
    handleSearchCallAPI(value);
  }, [value]);

  /**
   * set data post API when click icon delete
   */
  const setDataWhenAddGroup = () => {
    setGroupName(EMPTY);
    setGroupId(0);
  }

  /**
   * handle click button in Modal
   */
  const handleClickButtonModal = () => {
    setModalVisible(false);
    setMyDataGroup([]);
    setShareGroup([]);
    setValue(EMPTY);
    if (dataSelectGroupName.length > 0) {
      setGroupName(dataSelectGroupName);
      setGroupId(dataSelectGroupId);
      setActiveButton(true);
      setGroup(true);
    }
  }

  /**
   * handle click icon delete group
   */
  const handleDeleteGroup = () => {
    setDataWhenAddGroup();
    setActiveButton(false)
    setGroup(false);
  }

  function onKeyBoardDidShow(e: KeyboardEvent): void {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide(): void {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyBoardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return (): void => {
      Keyboard.removeListener('keyboardDidShow', onKeyBoardDidShow);
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
    }
  })

  console.log('keyboardHeight', keyboardHeight)
  /**
   * action click select option
   * @param selectOption data detail select
   */
  const handleSelectCondition = (selectOption: GroupSuggestions) => {
    setDataSelectGroupName(selectOption.groupName);
    setDataSelectGroupId(selectOption.groupId);
  };

  /**
   * render flatlist my group
   * @param myGroup array my group
   */
  const renderSuggestMyList = (myGroup: GroupSuggestions) => {
    return (
      <View>
        <SelectOption text={myGroup.groupName} active={dataSelectGroupId === myGroup.groupId} handleSelectCondition={() => handleSelectCondition(myGroup)} />
      </View>
    );
  }

  /**
   * render flatlist share group
   * @param shareGroup array share group
   */
  const renderSuggestShareList = (shareGroup: GroupSuggestions) => {
    return (
      <View>
        <SelectOption text={shareGroup.groupName} active={dataSelectGroupId === shareGroup.groupId} handleSelectCondition={() => handleSelectCondition(shareGroup)} />
      </View>
    );
  }

  /**
   * render modal search
   */
  const renderSearch = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={GroupModalStyles.modalContainer}>
          <TouchableOpacity style={{ flex: (dataMyGroup.length > 0 || dataShareGroup.length > 0) ? 1 : 4, }}
            onPress={() => onCloseModalHeader(EMPTY)}>
            <View style={GroupModalStyles.modalHeader}>
              <Icon name="iconModal" />
            </View>
          </TouchableOpacity>
          <View style={{ flex: (dataMyGroup.length > 0 || dataShareGroup.length > 0) ? 1.5 : 2, borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: "#FFFFFF", marginBottom: Platform.OS === "ios" ? (inputFocus ? keyboardHeight : 0) : 0 }} >
            <View style={GroupModalStyles.modalContent}>
              <View style={GroupModalStyles.viewSearch}>
                <TextInput
                  style={GroupModalStyles.inputSearch}
                  placeholder={translate(messages.placeHolder)}
                  placeholderTextColor="#999999"
                  onChangeText={(text) => onChangeText(text)}
                  value={value}
                  onFocus={() => setInputFocus(true)}
                  onEndEditing={() => setInputFocus(false)}
                />
                {value.length > 0 &&
                  <TouchableOpacity style={GroupModalStyles.styleIconClose} onPress={() => handleCloseIconSearch(EMPTY)}>
                    <Icon name="closeSearch"></Icon>
                  </TouchableOpacity>}
              </View>
              <View style={GroupModalStyles.flatListStyle}>
                <View style={GroupModalStyles.seperateBig}></View>
                {(dataMyGroup.length === 0 && dataShareGroup.length === 0) ? null :
                  errMessage ? <Text style={{ color: "red" }}>{`${translate(messages.connectAPIErr)}`}</Text> :
                    (<ScrollView style={GroupModalStyles.flatListStyle}>
                      {dataMyGroup?.length > 0 &&
                        <View style={GroupModalStyles.styleMyList}>
                          <Text>{`${translate(messages.myGroup)}`}</Text>
                          {dataMyGroup.map((item) => {
                            return renderSuggestMyList(item)
                          })}
                        </View>}
                      {dataMyGroup?.length > 0 && dataShareGroup?.length > 0 && <View style={GroupModalStyles.seperate}></View>}
                      {dataShareGroup?.length > 0 &&
                        <View style={GroupModalStyles.styleMyList}>
                          <Text>{`${translate(messages.shareGroup)}`}</Text>
                          {dataShareGroup.map((item) => {
                            return renderSuggestShareList(item)
                          })}
                        </View>
                      }
                    </ScrollView>)}
                <TouchableOpacity style={!(dataSelectGroupId > 0) ? GroupCommonStyles.buttonConfirmDisable : GroupCommonStyles.buttonConfirm}
                  disabled={!(dataSelectGroupId > 0)}
                  onPress={handleClickButtonModal}>
                  <Text style={!(dataSelectGroupId > 0) ? GroupCommonStyles.textButtonDisable : GroupCommonStyles.textButton}>
                    {translate(messages.groupSearchConfirm)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal >
    )
  }
  const dirtycheck = () => {
    return group;
  }

  const onHandleBack = () => {
    if (dirtycheck()) {
      setIsVisibleDirtycheck(true);
    } else {
      navigation.goBack();
    }
  };

  //Main flow
  return (
    <SafeAreaView
      style={GroupCommonStyles.wrapFlex}
    >
      <AppbarCommon
        title={translate(messages.groupAddGroup)}
        buttonText={translate(messages.groupDecision)}
        buttonType="complete"
        buttonDisabled={buttonActive}
        childrenLeft={<Icon name="close" />}
        handleLeftPress={onHandleBack}
        onPress={groupName.length > 0 ? handleAddToGroup : Object}
      />
      <View>
        {
          errMessageAddGroup && responseAddError !== TEXT_EMPTY &&
          <View style={GroupCommonStyles.viewRegionErrorShow}>
            <CommonMessages response={responseAddError} />
          </View>
        }
      </View>
      <View style={[GroupCommonStyles.wrapAlert, { paddingBottom: 12 }]}>
        <CommonMessage
          type={TypeMessage.INFO}
          content={`${employeeSelected.length} ${translate(messages.groupNumberOfItemToAdd)}`} />
      </View>
      <View style={GroupCommonStyles.divide20} />
      <View style={GroupCommonStyles.wrapFlex}>
        <Text style={GroupCommonStyles.titleGroupMove}>
          {translate(messages.groupGroupToAdd)}
        </Text>
        <View style={GroupCommonStyles.mainButton} >
          <TouchableOpacity
            style={GroupCommonStyles.buttonSearch}
            onPress={() => handlModalVisible()}
          >
            <Text style={GroupCommonStyles.textButtonSearch}>{`${translate(messages.buttonSearch)}`}</Text>
          </TouchableOpacity>
        </View>
        {group ?
          <View style={GroupCommonStyles.viewDetailData}>
            <View style={GroupCommonStyles.viewTextGroup}>
              <Text style={GroupCommonStyles.textDataDetail} numberOfLines={1} >{groupName}</Text>
            </View>
            <View style={GroupCommonStyles.viewIconDelete}>
              <TouchableOpacity onPress={handleDeleteGroup}>
                <Icon name={"closeGroup"} style={GroupCommonStyles.iconDeleteGroup}></Icon>
              </TouchableOpacity>
            </View>
          </View> : null}
      </View>
      {renderSearch()}
      <ModalDirty isVisible={isVisibleDirtycheck}>
        <ModalDirtycheckButtonBack
          onPress={() => { setIsVisibleDirtycheck(false) }}
          onPressBack={() => { navigation.goBack() }}
        />
      </ModalDirty>
    </SafeAreaView>
  );
};
