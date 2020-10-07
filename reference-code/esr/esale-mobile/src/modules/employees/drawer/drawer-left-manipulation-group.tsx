import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import { Icon } from '../../../shared/components/icon';
import { theme } from '../../../config/constants';
import { Input } from '../../../shared/components/input';
import { translate } from '../../../config/i18n';
import { messages } from './drawer-left-messages';
import {
  MANIPULATION_TYPE,
  MANIPULATION_STATUS,
  DISPLAY_STATUS,
} from '../../../config/constants/query';
import { ManipulationGroupStyles, DrawerLeftContentStyles } from './drawer-left-style';
import { employeeActions } from '../list/employee-list-reducer';
import {
  filterEmployee
} from '../../../shared/utils/common-api';
import { filterSelector } from '../list/employee-list-selector';
import { getOrderBySelector, getFilterConditionSelector } from '../list/employee-list-selector';
import { getDataInitializeLocalMenu } from './drawer-left-content';
import { TargetType } from '../../../config/constants/enum';
import { ModalMoveToGroupShare } from './modal/drawer-left-modal-move-group-share';
import { initializeLocalMenuActions } from './drawer-left-reducer';
/**
 * define interface type manipualtion group
 */
export interface ManipulationGroup {
  title: string;
  showManipulationButton: boolean;
  deleteGroup: (groupdId: number, groupName: string) => void;
  updateAutoGroup: (groupId: number, groupName: string) => void;
  copyGroup: (
    groupID: number,
    groupName: string,
    isAutoGroup: boolean,
    type: string,
    participantType?: number
  ) => void;
  setShowButton: (groupId: number) => void;
  type: string;
  isAutoGroup: boolean;
  groupID: number;
  participantType?: number;
  isFocus?: boolean;
  status: string;
  canEdit: boolean;
  resetGroup: () => void;
  resetSeachValue: () => void;
}

/**
 * drawer left manipulation group
 * @param title
 * @param showManipulationButton
 * @function deleteGroup
 * @function updateAutoGroup
 * @function copyGroup
 * @param type
 * @param isAutoGroup
 * @param groupID
 * @param participantType
 * @param isFocus
 * @param status
 * @param canEdit
 * @function resetGroup
 * @function resetSeachValue
 */
export const ManipulationGroup = ({
  title,
  showManipulationButton,
  deleteGroup,
  updateAutoGroup,
  copyGroup,
  setShowButton,
  type,
  isAutoGroup,
  groupID,
  participantType,
  isFocus,
  status,
  canEdit,
  resetGroup,
  resetSeachValue,
}: ManipulationGroup) => {
  // Get order by
  const listOrderBy = useSelector(getOrderBySelector);
  // Get Filter condition
  const listFilterCondition = useSelector(getFilterConditionSelector);
  const [editStatus, setEditStatus] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    setEditStatus(canEdit);

  }, [canEdit, showManipulationButton]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // value group input
  const [valueGroupTitle, setValueGroupTitle] = useState(title);

  // get employee filter from redux
  const employeesFilter = useSelector(filterSelector);
  const [
    disableButton,
    setDisableButton,
  ] = useState(false);
  /**
   * handle change to edit mode
   */
  const handleEdit = () => {
    setEditStatus(true);
    setValueGroupTitle(title);
    setShowButton(groupID);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleGoShareGroup = () => {
    setOpenModal(true);
  }
  // Enum check PARRICIPANT
  const PARRICIPANT = {
    NODATA: undefined,
    MEMBER: 1,
    OWNER: 2,
  }
  /**
   * handle close edit
   */
  const handleCloseEdit = () => {
    setEditStatus(false);
    dispatch(
      employeeActions.setGroupManipulated({
        groupId: -1,
        groupName: title,
        isAutoGroup: isAutoGroup,
        participantType: participantType,
        status: status,
        editStatus: false
      })
    );
    dispatch(initializeLocalMenuActions.status(false))
    resetGroup();
  };

  /**
   * handle update auto group
   */
  const handleUpdateAutoGroup = () => {
    updateAutoGroup(groupID, title);
    getDataInitializeLocalMenu(dispatch);
  };

  /**
   * navigate to share group
   */
  const gotoShareGroup = () => {
    setDisableButton(true);
    dispatch(
      employeeActions.setGroupSelected({
        groupId: groupID,
        groupName: title,
        isAutoGroup,
        participantType,
      })
    );
    navigation.navigate('group-create-share-group', {
      mode: MANIPULATION_STATUS.CHANGE_TO_SHARE_GROUP,
    });
    setOpenModal(false);
    setDisableButton(false);
  };

  /**
   * handle delete group
   */
  const handleDeleteGroup = () => {
    deleteGroup(groupID, title);
    getDataInitializeLocalMenu(dispatch);
    dispatch(
      employeeActions.setGroupSelected({
        groupId: groupID,
        groupName: title,
        isAutoGroup,
        participantType,
      })
    );
  };

  /**
   * handle change group name
   */
  const onChangeValueGroup = (text: string) => {
    setValueGroupTitle(text);
  };
  // handle copy group
  const handleCopyGroup = () => {
    setShowButton(-2);
    copyGroup(groupID, title, isAutoGroup, type, participantType);
    dispatch(
      employeeActions.setGroupManipulated({
        groupId: groupID,
        groupName: title,
        isAutoGroup: isAutoGroup,
        participantType: participantType,
        status: status,
        editStatus: true
      })
    );
  };
  // handle focus out input
  const onFocusOut = () => {
    dispatch(
      employeeActions.setGroupManipulated({
        groupId: groupID,
        groupName: valueGroupTitle,
        isAutoGroup: isAutoGroup,
        participantType: participantType,
        status: status,
        editStatus: true
      })
    );
  }
  // handle filter group
  const handleFilterGroup = async () => {
    const filter = {
      limit: employeesFilter.limit,
      offset: 0,
      filterType: employeesFilter.filterType
    };

    const targetType = type === MANIPULATION_TYPE.MY_GROUP ? TargetType.MY_GROUP : TargetType.SHARE_GROUP;
    filterEmployee(
      targetType, groupID, false, null,
      // Get from getFilterConditionSelector
      listFilterCondition, null,
      // Get from getOrderBySelector
      listOrderBy, dispatch, filter,
    );
    dispatch(employeeActions.setTitleDisplay(title));
    if (type === MANIPULATION_TYPE.MY_GROUP) {
      dispatch(
        employeeActions.setStatusDisplay(DISPLAY_STATUS.FILTER_MY_GROUP)
      );
    } else {
      dispatch(
        employeeActions.setStatusDisplay(DISPLAY_STATUS.FILTER_SHARE_GROUP)
      );
    }
    dispatch(
      employeeActions.setGroupSelected({
        groupId: groupID,
        groupName: title,
        isAutoGroup,
        participantType,
      })
    );
    dispatch(employeeActions.deselectAllEmployees(undefined));
    resetSeachValue();
    navigation.navigate("employee-list");
  };

  /**
   * render button 
   * @param style style button
   * @param messageButton message button
   * @param handleButton action button
   */
  const renderButton=(style : any, messageButton: any, handleButton: ()=> void)=>{
    return(
      <TouchableOpacity
        style={style}
        onPress={handleButton}
      >
        <Text style={{color: "#333333"}}>{translate(messageButton)}</Text>
      </TouchableOpacity>
    );
  }

  /**
   * check render button group
   * @param isAutoList isAutoList group
   * @param participant_type participant_type group
   */
  const renderActionGroup = (isAutoList: boolean, participant_type: any) => {
    return (
      <View style={ManipulationGroupStyles.elementChildWrapper}>
        {/* render button Edit */}
        {((!isAutoList && participant_type === PARRICIPANT.NODATA) || (!isAutoList && participant_type === PARRICIPANT.OWNER)) &&
          renderButton(ManipulationGroupStyles.elementChild, messages.drawerLeftEdit, () => handleEdit())}
        {/* render button Copy */}
        {(!isAutoList || (isAutoList && participant_type === PARRICIPANT.MEMBER)) &&
          renderButton(ManipulationGroupStyles.elementChild, messages.drawerLeftCopy, () => handleCopyGroup())}
        {/* render button Delete */}
        {((!isAutoList && participant_type === PARRICIPANT.NODATA) || (!isAutoList && participant_type === PARRICIPANT.OWNER)) &&
          renderButton(ManipulationGroupStyles.elementChild, messages.drawerLeftDelete, () => handleDeleteGroup())}
        {/* render button change share group */}
        {(participant_type === PARRICIPANT.NODATA) &&
          renderButton(ManipulationGroupStyles.elementChild, messages.drawerLeftChangeToShareGroup, () => handleGoShareGroup())}
      </View>
    );
  }

  return (
    <View style={ManipulationGroupStyles.manipulationWrapper}>
      <View>
        {editStatus ? (
          <View>
            <View style={ManipulationGroupStyles.childListWrapper}>
              <Input
                value={valueGroupTitle}
                placeholder="グループ名を入力"
                placeholderColor={theme.colors.gray}
                style={ManipulationGroupStyles.inputStyle}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                onChangeText={onChangeValueGroup}
                autoFocus={isFocus}
                onBlur={onFocusOut}
                maxLength={50}
                onFocus={() => dispatch(initializeLocalMenuActions.status(true))}
                onEndEditing={() => dispatch(initializeLocalMenuActions.status(false))}
              />
              <TouchableOpacity onPress={handleCloseEdit}>
                <Icon name="close" style={ManipulationGroupStyles.iconRemove} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
            <View style={ManipulationGroupStyles.childListWrapper}>
              <TouchableOpacity style={{
                width: (!showManipulationButton && isAutoGroup && (type === MANIPULATION_TYPE.MY_GROUP || participantType === 2))
                  ? ((Dimensions.get('window').width - 50) / 100 * 75)
                  : (Dimensions.get('window').width - 100)
              }} onPress={handleFilterGroup}>
                <Text style={ManipulationGroupStyles.childList} numberOfLines={1}>{title}</Text>
              </TouchableOpacity>
              {!showManipulationButton && isAutoGroup && (type === MANIPULATION_TYPE.MY_GROUP || participantType === 2) && (
                <TouchableOpacity onPress={handleUpdateAutoGroup}>
                  <Icon name="refresh" />
                </TouchableOpacity>
              )}
            </View>
          )}
      </View>
      {showManipulationButton && !editStatus && (
        renderActionGroup(isAutoGroup,participantType)
      )}
      <Modal
        isVisible={openModal}
        onBackdropPress={handleCloseModal}
        style={DrawerLeftContentStyles.centerView}
      >
        <ModalMoveToGroupShare
          onCloseModal={handleCloseModal}
          onAccept={gotoShareGroup}
          disableButton={disableButton}
        />
      </Modal>
    </View>
  );
};
