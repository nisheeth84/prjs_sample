/* eslint-disable react/jsx-indent */
import React, { useState } from 'react';
import { Alert as ShowError, Text, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../../../config/i18n';
import { messages } from '../drawer-left-messages';
import { messagesComon } from '../../../../shared/utils/common-messages';
import { GroupActivityModalStyles, DrawerLeftContentStyles } from '../drawer-left-style';
import {
  selectedEmployeeIdsSelector,
  statusDiplaySelector,
  groupFilterSelector,
  filterSelector,
  getOrderBySelector,
  getFilterConditionSelector,
  employeesSelector,
} from '../../list/employee-list-selector';
import { leaveGroup } from '../drawer-left-repository';
import {
  DISPLAY_STATUS,
  TYPE_MEMBER,
  MANIPULATION_STATUS,
} from '../../../../config/constants/query';
import { filterEmployee } from '../../../../shared/utils/common-api';
import { getInitializeGroupModal } from '../../group/group-repository';
import { GroupType, TargetType } from '../../../../config/constants/enum';
import Modal from 'react-native-modal';
import { ModalDelete } from './drawer-left-modal-delete';
import { messages as responseMessage } from '../../../../shared/messages/response-messages';
import { MOVE_GROUP_SCREEN } from '../../list/employee-list-constants';

/**
 * Modal group activity
 * @function onCloseModal
 */
export interface GroupActivityModalProps {
  onCloseModal: () => void;
}

export const GroupActivityModal: React.FunctionComponent<GroupActivityModalProps> = ({
  onCloseModal,
}) => {
  // Get order by
  const listOrderBy = useSelector(getOrderBySelector);
  // Get Filter condition
  const listFilterCondition = useSelector(getFilterConditionSelector);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // get employee
  const employeesFilter = useSelector(filterSelector);
  // employee selected in list employee screen
  const selectedEmployeeIds = useSelector(selectedEmployeeIdsSelector);
  // status display
  const statusDiplay = useSelector(statusDiplaySelector);
  // group selected when filter from drawer
  const groupSelected = useSelector(groupFilterSelector);
  // declare variable open modal confirm leave group
  const [visibleModalConfirmLeave, setVisibleModalConfirmLeave] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const employees = useSelector(employeesSelector);

  const getEmployeeName = () => {
    let employeeId = selectedEmployeeIds[0];
    let employee = employees.find((item) => item.employeeId === employeeId);
    let employeeName = (employee?.employeeSurname || "") + (employee?.employeeName ? " " : "") + (employee?.employeeName || "");
    return employeeName;
  }

  /**
   * function handle choose group
   */
  const handleChooseGroup = (screen : string) => {
    if (selectedEmployeeIds.length > 0) {
      navigation.navigate(screen);
    } else {
      ShowError.alert('ERR_EMP_0023', translate(messagesComon.ERR_EMP_0023));
    }
    onCloseModal();
  };

  /**
   * function navigate to create my group screen
   */
  const navigateToCreateMyGroup = () => {
    if (selectedEmployeeIds.length > 0) {
      navigation.navigate(MOVE_GROUP_SCREEN.TO_MY_GROUP, {
        mode: MANIPULATION_STATUS.CREATE,
      });
    } else {
      ShowError.alert('ERR_EMP_0023', translate(messagesComon.ERR_EMP_0023));
    }
    onCloseModal();
  };

  /**
   * function navigate to create share group screen
   */
  const navigateToCreateShareGroup = () => {
    if (selectedEmployeeIds.length > 0) {
      navigation.navigate(MOVE_GROUP_SCREEN.TO_SHARE_GROUP, {
        mode: MANIPULATION_STATUS.CREATE,
      });
    } else {
      ShowError.alert('ERR_EMP_0023', translate(messagesComon.ERR_EMP_0023));
    }
    onCloseModal();
  };

  /**
   * function handle action leave group
   */
  const handleLeaveGroup = async () => {
    setDisableDeleteButton(true);
    // call api leave group
    if (groupSelected.groupId !== -1) {
      await leaveGroup(
        {
          groupId: groupSelected.groupId,
          employeeIds: [...selectedEmployeeIds]
        }
      );
      const getGroup = await getInitializeGroupModal({ groupId: groupSelected.groupId });
      let targetType = getGroup.data.group.groupType === GroupType.MY_GROUP ? TargetType.MY_GROUP : TargetType.SHARE_GROUP;
      // get update list employee
      filterEmployee(
        targetType, groupSelected.groupId, false, null,
        listFilterCondition, null,
        listOrderBy, dispatch, employeesFilter,
      );
    }
    setDisableDeleteButton(false);
    onCloseModal();
  };

  /**
   * close modal confirm leave
   */
  const handleCloseModalLeave = () => {
    setVisibleModalConfirmLeave(false);
  }

  /**
   * open modal confirm leave
   */
  const openPopupConfirmLeave = () => {
    setVisibleModalConfirmLeave(true);
  }


  return (
    <View style={GroupActivityModalStyles.container}>
      <TouchableOpacity
        onPress={() => handleChooseGroup('add-to-group')}
        style={GroupActivityModalStyles.wrapItem}
      >
        <Text style={GroupActivityModalStyles.title}>
          {translate(messages.drawerLeftModalAddToGroup)}
        </Text>
      </TouchableOpacity>
      {((!groupSelected.isAutoGroup &&
        statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) ||
        (!groupSelected.isAutoGroup &&
          groupSelected.participantType === TYPE_MEMBER.OWNER &&
          statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP)) && (
          <View style={GroupActivityModalStyles.alignCenter}>
            <View style={GroupActivityModalStyles.divide} />
            <TouchableOpacity
              onPress={() => handleChooseGroup('move-to-group')}
              style={GroupActivityModalStyles.wrapItem}
            >
              <Text style={GroupActivityModalStyles.title}>
                {translate(messages.drawerLeftModalMoveToGroup)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      <View style={GroupActivityModalStyles.alignCenter}>
        <View style={GroupActivityModalStyles.divide} />
        <TouchableOpacity
          onPress={navigateToCreateMyGroup}
          style={GroupActivityModalStyles.wrapItem}
        >
          <Text style={GroupActivityModalStyles.title}>
            {translate(messages.drawerLeftModalCreateMyGroup)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={GroupActivityModalStyles.alignCenter}>
        <View style={GroupActivityModalStyles.divide} />
        <TouchableOpacity
          onPress={navigateToCreateShareGroup}
          style={GroupActivityModalStyles.wrapItem}
        >
          <Text style={GroupActivityModalStyles.title}>
            {translate(messages.drawerLeftModalCreateShareGroup)}
          </Text>
        </TouchableOpacity>
      </View>
      {((!groupSelected.isAutoGroup &&
        statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) ||
        (!groupSelected.isAutoGroup &&
          groupSelected.participantType === TYPE_MEMBER.OWNER &&
          statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP)) && (
          <View style={GroupActivityModalStyles.alignCenter}>
            <View style={GroupActivityModalStyles.divide} />
            <TouchableOpacity
              onPress={openPopupConfirmLeave}
              style={GroupActivityModalStyles.wrapItem}
            >
              <Text style={GroupActivityModalStyles.title}>
                {translate(messages.drawerLeftModalLeaveGroup)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      <Modal
        isVisible={visibleModalConfirmLeave}
        onBackdropPress={handleCloseModalLeave}
        style={DrawerLeftContentStyles.centerView}
      >
        <ModalDelete
          onCloseModal={handleCloseModalLeave}
          onAcceptDeleteGroup={handleLeaveGroup}
          disableDeleteButton={disableDeleteButton}
          title={selectedEmployeeIds.length > 1 ? translate(responseMessage.WAR_COM_0002).replace("{0}", selectedEmployeeIds.length.toString())
            : selectedEmployeeIds.length === 1 ? translate(responseMessage.WAR_COM_0001).replace("{0}", getEmployeeName()) : ""}
        />
      </Modal>
    </View>
  );
};
