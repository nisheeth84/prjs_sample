/* eslint-disable react/jsx-indent */
import React, { useState } from 'react';
import { Alert as ShowError, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux';
import { translate } from '../../../../config/i18n';
import { messages } from '../drawer-left-messages';
import {
  DISPLAY_STATUS,
  TYPE_MEMBER,
  MANIPULATION_STATUS,
} from '../../../../config/constants/query';
import {
  GroupActivityModalStyles,
  DrawerLeftContentStyles,
} from '../drawer-left-style';
import {
  statusDiplaySelector,
  groupFilterSelector,
  filterSelector,
  getOrderBySelector,
  getFilterConditionSelector,
  conditionSelector,
} from '../../list/employee-list-selector';
import { ModalDelete } from './drawer-left-modal-delete';
import {
  filterEmployee,
} from '../../../../shared/utils/common-api';
import { employeeActions } from '../../list/employee-list-reducer';
import { getDataInitializeLocalMenu } from '../drawer-left-content';
import { TargetID, TargetType, TypeMessage, ActionType } from '../../../../config/constants/enum';
import { deleteGroup, updateAutoGroup } from '../../group/group-repository';
import { messages as responseMessage, responseMessages } from '../../../../shared/messages/response-messages';
import { titleDiplaySelector } from '../../list/employee-list-selector';
import { errorCode } from '../../../../shared/components/message/message-constants';
import { format } from 'react-string-format';
import { Error } from '../../../../shared/components/message/message-interface';
import { CommonMessage } from '../../../../shared/components/message/message';
import { ModalConfirmUpdateAutoGroup } from './drawer-left-modal-update-auto-group';
import { MOVE_GROUP_SCREEN } from '../../list/employee-list-constants';


export interface OtherActivityModalProps {
  onCloseModal: () => void;
  setStatus?: (status: string) => void;
}

/**
 * Modal other other activity
 * @fucntion onCloseModal
 */
export const OtherActivityModal: React.FunctionComponent<OtherActivityModalProps> = ({
  onCloseModal,
  setStatus = Object,
}) => {
  // Get order by
  const listOrderBy = useSelector(getOrderBySelector);
  // Get Filter condition
  const listFilterCondition = useSelector(getFilterConditionSelector);
  const [openModal, setOpenModalDelete] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // get employee filter from redux
  const employeesFilter = useSelector(filterSelector);
  const statusDiplay = useSelector(statusDiplaySelector);
  // group selected when filter from drawer
  const groupSelected = useSelector(groupFilterSelector);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const groupName = useSelector(titleDiplaySelector);
  const [lisMessageRessponse, setListMessageRessponse] = useState<Error[]>([]);
  // open modal update auto group
  const [openModalUpdateAutoGroup, setOpenModalUpdateAutoGroup] = useState(false);
  const [disableUpdateAutoGroupButton, setDisableUpdateAutoGroupButton] = useState(false);
  const conditonEmployeeSelector = useSelector(conditionSelector);

  /**
   * function hanlde action remove group
   */
  const handleRemoveGroup = async () => {
    setListMessageRessponse([]);
    // query delete group
    setDisableDeleteButton(true);
    if (groupSelected.groupId !== -1) {
      // call api delete group
      try {
        let ressponseRemoveGroup = await deleteGroup({ "groupId": groupSelected.groupId });
        if (ressponseRemoveGroup.status !== 200) {
          if (ressponseRemoveGroup?.data?.parameters?.extensions?.errors) {
            const listMessageError: Error[] = [];
            let messageError: string[] = [];
            ressponseRemoveGroup?.data?.parameters?.extensions?.errors.forEach((element: any) => {
              if (element.errorCode === errorCode.errEmp0006) {
                let errorParam: string[] = [];
                errorParam.push(groupSelected.groupName);
                // Set error
                listMessageError.push({
                  error: format(translate(responseMessages[element.errorCode]), ...errorParam),
                  type: TypeMessage.ERROR
                });
              } else {
                // Check dublicate error code
                if (!messageError.includes(element.errorCode)) {
                  messageError.push(element.errorCode);
                  let errorParam = element.errorParam ?? []
                  let type = TypeMessage.INFO;
                  if (element.errorCode.includes(TypeMessage.ERROR)) {
                    type = TypeMessage.ERROR;
                  } else if (element.errorCode.includes(TypeMessage.WARNING)) {
                    type = TypeMessage.WARNING;
                  }
                  // Set error
                  listMessageError.push({
                    error: format(translate(responseMessages[element.errorCode]), ...errorParam),
                    type: type
                  })
                }
              }
            });
            setListMessageRessponse(listMessageError);
          } else {
            // Set error
            lisMessageRessponse.push({
              error: format(translate(responseMessages[errorCode.errCom0001]), ...[]),
              type: TypeMessage.ERROR
            })
          }
        } else {
          const filter = {
            limit: employeesFilter.limit,
            offset: 0,
            filterType: employeesFilter.filterType
          };

          filterEmployee(TargetType.ALL, TargetID.ZERO, false, null,
            // Get from getFilterConditionSelector
            listFilterCondition, null,
            // Get from getOrderBySelector
            listOrderBy, dispatch, filter);
          dispatch(employeeActions.setStatusDisplay(DISPLAY_STATUS.ALL_EMPLOYEE));
          dispatch(employeeActions.setTitleDisplay('全ての社員'));
          setOpenModalDelete(false);
          setStatus(ActionType.DELETE);
        }

      } catch (error) {
        ShowError.alert('Message', error.message);
      }
      // get menu have updated
      getDataInitializeLocalMenu(dispatch);
    }
    setDisableDeleteButton(false);
    onCloseModal();
  };

  /**
   * function hanlde action navigation to edit group
   */
  const handleEditGroup = () => {
    if (statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) {
      navigation.navigate(MOVE_GROUP_SCREEN.TO_MY_GROUP, {
        mode: MANIPULATION_STATUS.EDIT,
      });
    } else if (statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP) {
      navigation.navigate(MOVE_GROUP_SCREEN.TO_SHARE_GROUP, {
        mode: MANIPULATION_STATUS.EDIT,
      });
    }
    onCloseModal();
  };

  /**
   * function hanlde action navigation to copy group
   */
  const handleCopyGroup = () => {
    if (statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) {
      navigation.navigate(MOVE_GROUP_SCREEN.TO_MY_GROUP, {
        mode: MANIPULATION_STATUS.COPY,
      });
    } else if (statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP) {
      navigation.navigate(MOVE_GROUP_SCREEN.TO_SHARE_GROUP, {
        mode: MANIPULATION_STATUS.COPY,
      });
    }
    onCloseModal();
  };

  /**
   * function hanlde change to share group
   */
  const handleChangeToShareGroup = () => {
    navigation.navigate(MOVE_GROUP_SCREEN.TO_SHARE_GROUP, {
      mode: MANIPULATION_STATUS.CHANGE_TO_SHARE_GROUP,
    });
    onCloseModal();
  };

  /**
   * function hanlde action update auto group
   */
  const handleUpdateAutoGroup = async () => {
    setListMessageRessponse([]);
    setDisableUpdateAutoGroupButton(true);
    // call api update auto group
    if (groupSelected.groupId !== -1) {
      const update = await updateAutoGroup({ "groupId": groupSelected.groupId });
      // if update success
      if (update.status === 200) {
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
        setStatus(ActionType.UPDATE);
        getDataInitializeLocalMenu(dispatch);
        onCloseModal();
      } else {
        if (update?.data?.parameters?.extensions?.errors) {
          const listMessageError: Error[] = [];
          let messageError: string[] = [];
          update?.data?.parameters?.extensions?.errors.forEach((element: any) => {
            if (element.errorCode === errorCode.errEmp0007) {
              let errorParam: string[] = [];
              errorParam.push(groupSelected.groupName);
              // Set error
              listMessageError.push({
                error: format(translate(responseMessages[errorCode.errEmp0007]), ...errorParam),
                type: TypeMessage.ERROR
              });

            } else {
              // Check dublicate error code
              if (!messageError.includes(element.errorCode)) {
                messageError.push(element.errorCode);
                let errorParam = element.errorParam ?? []
                let type = TypeMessage.INFO;
                if (element.errorCode.includes(TypeMessage.ERROR)) {
                  type = TypeMessage.ERROR;
                } else if (element.errorCode.includes(TypeMessage.WARNING)) {
                  type = TypeMessage.WARNING;
                }
                // Set error
                listMessageError.push({
                  error: format(translate(responseMessages[element.errorCode]), ...errorParam),
                  type: type
                })
              }
            }
          }
          )
          setListMessageRessponse(listMessageError);
        } else {
          // Set error
          lisMessageRessponse.push({
            error: format(translate(responseMessages[errorCode.errCom0001]), ...[]),
            type: TypeMessage.ERROR
          })
        }
      }
      setOpenModalUpdateAutoGroup(false);
    }

  };

  /**
   * function close modal delete
   */
  const handleCloseModalDelete = () => {
    setOpenModalDelete(false);
  };

  /**
   * function open modal delete
   */
  const handleModalDelete = () => {
    setOpenModalDelete(true);
  };

  /**
 * function close modal update auto group
 */
  const handleCloseModalUpdateAutoGroup = () => {
    setOpenModalUpdateAutoGroup(false);
  };


  /**
   * function open modal update auto group
   */
  const handleOpenModalUpdateAutoGroup = () => {
    setOpenModalUpdateAutoGroup(true);
  };
  return (
    <View style={GroupActivityModalStyles.container}>
      {lisMessageRessponse.length > 0 &&
        <View style={DrawerLeftContentStyles.viewRegionErrorShow}>
          {
            lisMessageRessponse?.map((error: Error, index: number) => (
              <CommonMessage key={index} content={error.error} type={error.type} widthMessage="80%"></CommonMessage>
            ))
          }
        </View>
      }
      {((!groupSelected.isAutoGroup &&
        statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) ||
        (!groupSelected.isAutoGroup &&
          groupSelected.participantType === TYPE_MEMBER.OWNER &&
          statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP)) && (
          <View style={GroupActivityModalStyles.alignCenter}>
            <TouchableOpacity
              onPress={handleEditGroup}
              style={GroupActivityModalStyles.wrapItem}
            >
              <Text style={GroupActivityModalStyles.title}>
                {translate(messages.drawerLeftModalEditGroup)}
              </Text>
            </TouchableOpacity>
            {((!groupSelected.isAutoGroup &&
              statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) ||
              (!groupSelected.isAutoGroup &&
                statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP) ||
              (groupSelected.isAutoGroup &&
                groupSelected.participantType === TYPE_MEMBER.MEMBER &&
                statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP)) && (
                <View style={GroupActivityModalStyles.divide} />
              )}
          </View>
        )}
      {((!groupSelected.isAutoGroup &&
        statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) ||
        (!groupSelected.isAutoGroup &&
          statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP) ||
        (groupSelected.isAutoGroup &&
          groupSelected.participantType === TYPE_MEMBER.MEMBER &&
          statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP)) && (
          <View style={GroupActivityModalStyles.alignCenter}>
            <TouchableOpacity
              onPress={handleCopyGroup}
              style={GroupActivityModalStyles.wrapItem}
            >
              <Text style={GroupActivityModalStyles.title}>
                {translate(messages.drawerLeftModalCopyGroup)}
              </Text>
            </TouchableOpacity>
            {((!groupSelected.isAutoGroup &&
              statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) ||
              (!groupSelected.isAutoGroup &&
                statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP &&
                groupSelected.participantType === TYPE_MEMBER.OWNER)) && (
                <View style={GroupActivityModalStyles.divide} />
              )}
          </View>
        )}
      {((!groupSelected.isAutoGroup &&
        statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) ||
        (!groupSelected.isAutoGroup &&
          statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP &&
          groupSelected.participantType === TYPE_MEMBER.OWNER)) && (
          <View style={GroupActivityModalStyles.alignCenter}>
            <TouchableOpacity
              onPress={handleModalDelete}
              style={GroupActivityModalStyles.wrapItem}
            >
              <Text style={GroupActivityModalStyles.title}>
                {translate(messages.drawerLeftModalDeleteGroup)}
              </Text>
            </TouchableOpacity>
            {!groupSelected.isAutoGroup &&
              statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP && (
                <View style={GroupActivityModalStyles.divide} />
              )}
          </View>
        )}
      {statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP && (
        <View style={GroupActivityModalStyles.alignCenter}>
          <TouchableOpacity
            onPress={handleChangeToShareGroup}
            style={GroupActivityModalStyles.wrapItem}
          >
            <Text style={GroupActivityModalStyles.title}>
              {translate(messages.drawerLeftModalChangeToShareGroup)}
            </Text>
          </TouchableOpacity>
          {((groupSelected.isAutoGroup &&
            statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) ||
            (groupSelected.isAutoGroup &&
              statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP &&
              groupSelected.participantType === TYPE_MEMBER.OWNER)) && (
              <View style={GroupActivityModalStyles.divide} />
            )}
        </View>
      )}
      {((groupSelected.isAutoGroup &&
        statusDiplay === DISPLAY_STATUS.FILTER_MY_GROUP) ||
        (groupSelected.isAutoGroup &&
          statusDiplay === DISPLAY_STATUS.FILTER_SHARE_GROUP &&
          groupSelected.participantType === TYPE_MEMBER.OWNER)) && (
          <View style={GroupActivityModalStyles.alignCenter}>
            <TouchableOpacity
              onPress={handleOpenModalUpdateAutoGroup}
              style={GroupActivityModalStyles.wrapItem}
            >
              <Text style={GroupActivityModalStyles.title}>
                {translate(messages.drawerLeftModalUpdateAutoGroup)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      <Modal
        isVisible={openModal}
        onBackdropPress={handleCloseModalDelete}
        style={DrawerLeftContentStyles.centerView}
      >
        <ModalDelete
          onCloseModal={handleCloseModalDelete}
          onAcceptDeleteGroup={handleRemoveGroup}
          disableDeleteButton={disableDeleteButton}
          title={translate(responseMessage.WAR_COM_0001).replace("{0}", groupName)}
        />
      </Modal>
      <Modal
        isVisible={openModalUpdateAutoGroup}
        onBackdropPress={handleCloseModalUpdateAutoGroup}
        style={DrawerLeftContentStyles.centerView}
      >
        <ModalConfirmUpdateAutoGroup
          onCloseModal={handleCloseModalUpdateAutoGroup}
          onAcceptUpdateAutoGroup={handleUpdateAutoGroup}
          disableUpdateButton={disableUpdateAutoGroupButton}
          title={groupName}
        />
      </Modal>
    </View>
  );
};
