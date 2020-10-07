import React, { useEffect, useState } from 'react';
import { GroupChooseGroupItem } from './group-choose-group-item';
import { GroupCommonStyles } from './group-style';
import { groupFilterSelector, selectedEmployeeIdsSelector, conditionSelector } from '../list/employee-list-selector';
import { Icon } from '../../../shared/components/icon';
import { messages } from './group-messages';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../../config/i18n';
import { useDispatch, useSelector } from 'react-redux';
import ModalDirty from "react-native-modal";
import {
  SafeAreaView,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Keyboard,
  KeyboardEvent
} from 'react-native';
import { employeeActions, initializeEmployeeConditionAction } from '../list/employee-list-reducer';
import { GroupInfo, moveGroup, getGroupSuggestions } from './group-repository';
import { GroupType, TypeMessage, ActionType } from '../../../config/constants/enum';
import { CommonMessages, CommonMessage } from '../../../shared/components/message/message';
import { ressponseStatus, errorCode, TEXT_EMPTY } from '../../../shared/components/message/message-constants';
import { responseMessages } from '../../../shared/messages/response-messages';
import { format } from 'react-string-format';
import { ModalDirtycheckButtonBack } from '../../../shared/components/modal/modal';
import { GroupModalStyles } from "./group-add-to-group-style-modal";

/**
 * Components move to group
 */
export const MoveToGroup = () => {
  const conditonEmployeeSelector = useSelector(conditionSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // get group is selecting
  const groupSource = useSelector(groupFilterSelector);
  // active button when add group
  const [buttonActive, setActiveButton] = useState(true);
  // group selected
  const [groupIdSelected, setGroupIdSelected] = useState(-1);
  // employee selected
  const employeeSelected = useSelector(selectedEmployeeIdsSelector);
  const [errors, setErrors] = useState<any[]>([]);
  const [searchContent, setSearchContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [resultMyGroup, setResultMyGroup] = useState<GroupInfo[]>([]);
  const [resultShareGroup, setResultShareGroup] = useState<GroupInfo[]>([]);
  const [groupSelected, setGroupSelected] = useState<GroupInfo>();
  const [resultSearch, setResultSearch] = useState<GroupInfo[]>([]);
  const [responseMoveError, setResponseMoveError] = useState<any>("");
  const [errMoveMessage, setErrMoveMessage] = useState(false);
  const [responseSearchError, setResponseSearchError] = useState<any>("");
  const [errSearchMessage, setErrSearchMessage] = useState(false);
  const [isVisibleDirtycheck, setIsVisibleDirtycheck] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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
  // get data initializeGroupModal
  async function handleChangeText(text: string) {
    try {
      setSearchContent(text);
      if (text.length > 0) {
        const listGroupSuggestion = await getGroupSuggestions({ searchValue: text });
        if (listGroupSuggestion?.status === 200) {
          setResultSearch(listGroupSuggestion.data.groupInfo);
        } else {
          setErrSearchMessage(true);
          // Set ressponse
          setResponseSearchError(listGroupSuggestion);
        }
      } else {
        //set call api search text @#$#%$#$^!!!@#%
        setResultSearch([]);
        setResultMyGroup([]);
        setResultShareGroup([]);
      }
    } catch (error) {
      setErrors(error);
    }
  }


  useEffect(() => {
    if (resultSearch.length > 0) {
      setResultMyGroup(resultSearch.filter(item => item.groupType === GroupType.MY_GROUP))
      setResultShareGroup(resultSearch.filter(item => item.groupType === GroupType.SHARE_GROUP))
    } else {
      setResultMyGroup([])
      setResultShareGroup([])
    }

  }, [resultSearch]);


  /**
   * function hanlde select member
   */
  const handleSelectItem = (groupId: number) => {
    if (groupId === groupIdSelected) {
      setGroupIdSelected(-1);
    } else {
      setGroupIdSelected(groupId);
    }
  };

  /**
   * delete group selected
   */
  const handleDeleteGroupSelected = () => {
    setGroupIdSelected(-1);
    setGroupSelected({} as GroupInfo);
  }


  /**
   * function hanlde move member to group
   */
  const handleMoveToGroup = async () => {
    setActiveButton(false);
    try {
      const numberlist: any[] = employeeSelected
      if (groupSelected) {
        const moveToGroupResult = await moveGroup({ sourceGroupId: groupSource.groupId, destGroupId: groupSelected.groupId || 0, employeeIds: numberlist })
        if (moveToGroupResult?.status == ressponseStatus.statusSuccess) {
          let conditon = {...conditonEmployeeSelector};
          conditon.isCallback = true;
          dispatch(initializeEmployeeConditionAction.setCondition(conditon));
          dispatch(employeeActions.filterUpdatedOffset({offset: 0}));
          navigation.navigate("employee-list", {notify: ActionType.UPDATE, isShow: true})
        } else {
          setResponseMoveError(moveToGroupResult)
          setErrMoveMessage(true);
        }
      }
      setActiveButton(true);
    } catch (error) {
      setActiveButton(true);
      setErrors(error);
    }
  };

  const handleConfirmGroupSelected = () => {
    if (groupSelected?.groupId !== groupIdSelected) {
      setGroupSelected(resultSearch.find(item => item.groupId === groupIdSelected) || {} as GroupInfo);
    }
    setModalVisible(false);
  }
  /**
  * Render search component
  */
  const renderSearch = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={GroupModalStyles.modalContainer}>
          <TouchableOpacity style={resultSearch.length === 0 ? GroupCommonStyles.modalHeader : GroupCommonStyles.modalHeaderResult}
            onPress={() => {
              setSearchContent("");
              handleChangeText("");
              setModalVisible(!modalVisible);
              setGroupIdSelected(groupSelected?.groupId || -1);
              setErrSearchMessage(false);
              // Set ressponse
              setResponseSearchError("");
            }} >
            <View style={GroupCommonStyles.iconModal}>
              <Icon name="icon_modal" />
            </View>
          </TouchableOpacity>
          <View style={[GroupCommonStyles.modalContent,{marginBottom: Platform.OS === "ios" ? (inputFocus ? keyboardHeight : 0) : 0}]}>
            <View style={GroupCommonStyles.inputContainer}>
              <TextInput style={[GroupModalStyles.inputSearch, searchContent.length > 0 ? GroupCommonStyles.inputSearchTextData : GroupCommonStyles.inputSearchText]}
                placeholder={translate(messages.groupTitleSearchGroup)}
                value={searchContent}
                placeholderTextColor="#999999"
                onChangeText={(text) => handleChangeText(text)}
                onFocus={() => setInputFocus(true)}
                onEndEditing={() => setInputFocus(false)}
              />
              <View style={GroupCommonStyles.textSearchContainer}>
                {searchContent.length > 0 && (
                  <TouchableOpacity onPress={() => handleChangeText("")}>
                    <Icon name="closeSearch" ></Icon>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={GroupCommonStyles.divide20} />
            {resultSearch.length > 0 && (<ScrollView>
              {resultMyGroup.length > 0 && (
                <View style={GroupCommonStyles.titleGroup}>
                  <Text>{translate(messages.groupTitleMyGroup)}</Text>
                  <View style={[GroupCommonStyles.wrapGroup]}>
                    {renderResult(GroupType.MY_GROUP)}
                  </View>
                </View>
              )}
              <View style={GroupCommonStyles.divide1} />
              {resultShareGroup.length > 0 && (
                <View style={GroupCommonStyles.titleGroup}>
                  <Text>{translate(messages.groupTitleShareGroup)}</Text>
                  <View style={[GroupCommonStyles.wrapGroup]}>
                    {renderResult(GroupType.SHARE_GROUP)}
                  </View>
                </View>)}
            </ScrollView>
            )}
            <View>
              {
                errSearchMessage && responseSearchError !== TEXT_EMPTY &&
                <View style={GroupCommonStyles.viewRegionErrorShow}>
                  <CommonMessages response={responseSearchError} />
                </View>
              }
            </View>
            <TouchableOpacity style={groupIdSelected === -1 ? GroupCommonStyles.buttonConfirmDisable : GroupCommonStyles.buttonConfirm}
              disabled={groupIdSelected === -1}
              onPress={handleConfirmGroupSelected}>
              <Text style={groupIdSelected === -1 ? GroupCommonStyles.textButtonDisable : GroupCommonStyles.textButton}>
                {translate(messages.groupSearchConfirm)}</Text>
            </TouchableOpacity>
          </View>
        </View >
      </Modal >
    );
  }

  /**
   * return result search
   * @param type is MyGroup or ShareGroup
   */
  const renderResult = (type: number) => {
    const listGroup = type === GroupType.MY_GROUP ? resultMyGroup : resultShareGroup;
    return listGroup.map((item: GroupInfo, index: number) => {
      const position = type === GroupType.MY_GROUP ? index : index + resultMyGroup.length;
      return <GroupChooseGroupItem
        key={item.groupId}
        employeeName={item.employeeName}
        groupType={item.groupType}
        handleSelectItem={handleSelectItem}
        groupName={item.groupName}
        groupId={item.groupId}
        position={position}
        checked={groupIdSelected === item.groupId}
      />
    })
  }

  const dirtycheck = () => {
    return groupSelected?.groupId !== null && groupSelected?.groupId !== undefined;
  }
  const onHandleBack = () => {
    if (dirtycheck()) {
      setIsVisibleDirtycheck(true);
    } else {
      navigation.goBack();
    }
  };


  return (
    <View style={GroupCommonStyles.container}>
      <SafeAreaView
        style={[GroupCommonStyles.wrapFlex]}
      >
        <View style={GroupCommonStyles.header}>
          <TouchableOpacity onPress={onHandleBack}>
            <Icon name="close" />
          </TouchableOpacity>
          <Text style={GroupCommonStyles.title} allowFontScaling>{translate(messages.groupMoveGroup)}</Text>
          {groupIdSelected === -1
            ? <TouchableOpacity disabled style={GroupCommonStyles.buttonDisable}>
              <Text style={GroupCommonStyles.textButtonDisable}>{translate(messages.groupDecisionMove)}</Text>
            </TouchableOpacity>
            : <TouchableOpacity style={GroupCommonStyles.button} onPress={handleMoveToGroup} disabled={!buttonActive}>
              <Text style={GroupCommonStyles.textButton}>{translate(messages.groupDecisionMove)}</Text>
            </TouchableOpacity>
          }
        </View>
        <View style={GroupCommonStyles.divide1} />
        <View>
          {
            errMoveMessage && responseMoveError !== TEXT_EMPTY &&
            <View style={GroupCommonStyles.viewRegionErrorShow}>
              <CommonMessages response={responseMoveError} />
            </View>
          }
        </View>
        <View style={[GroupCommonStyles.wrapAlert,{paddingBottom: 12}]}>
          <CommonMessage
            type={TypeMessage.INFO}
            content={`${employeeSelected.length} ${translate(
              messages.groupNumberOfItemToMove
            )}`} />
          {errors?.length > 0 &&
            <View style={GroupCommonStyles.messagesError}>
              <CommonMessage type={TypeMessage.ERROR} content={format(translate(responseMessages[errorCode.errCom0001]), ...[])}></CommonMessage>
            </View>
          }
        </View>
        <View style={GroupCommonStyles.divide20} />
        <View style={GroupCommonStyles.wrapFlex}>
          <Text style={GroupCommonStyles.titleGroupMove}>
            {translate(messages.groupGroupToMove)}
          </Text>
          <TouchableOpacity style={GroupCommonStyles.ButtonSearchToMove} onPress={() => { setModalVisible(!modalVisible) }}>
            <Text style={GroupCommonStyles.titleSelectGroupMove}>
              {translate(messages.groupSelectGroupToMove)}
            </Text>

          </TouchableOpacity>
          {groupSelected?.groupId &&
            <View style={[GroupCommonStyles.wrapGroupSelected]}>
              <View style={{ flex: 9 }}>
                <Text numberOfLines={1}>
                  {groupSelected.groupName}
                </Text>
              </View>
              <TouchableOpacity style={GroupCommonStyles.iconCheckView} onPress={handleDeleteGroupSelected}>
                <Icon style={GroupCommonStyles.iconListDelete} name="iconDelete" />
              </TouchableOpacity>
            </View>}
        </View>
        {renderSearch()}
        <ModalDirty isVisible={isVisibleDirtycheck} >
          <ModalDirtycheckButtonBack
            onPress={() => { setIsVisibleDirtycheck(false) }}
            onPressBack={() => { navigation.goBack() }}
          />
        </ModalDirty>
      </SafeAreaView>
    </View>
  );
};
