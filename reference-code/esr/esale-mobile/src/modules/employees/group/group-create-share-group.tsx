import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppbarCommon } from '../../../shared/components/appbar/appbar-common';
import { theme } from '../../../config/constants';
import { Input } from '../../../shared/components/input';
import { translate } from '../../../config/i18n';
import { messages } from './group-messages';
import { listMemberActions } from './group-add-list-member-reducer';
import {
  MANIPULATION_STATUS,
  TYPE_MEMBER,
  DISPLAY_STATUS
} from '../../../config/constants/query';
import { GroupCommonStyles, GroupCreateShareGroupStyles } from './group-style';
import {
  selectedEmployeeIdsSelector,
  groupFilterSelector,
  getOrderBySelector, 
  getFilterConditionSelector,
  filterSelector,
  conditionSelector
} from '../list/employee-list-selector';
import { employeeActions, initializeEmployeeConditionAction } from '../list/employee-list-reducer';
import { GroupParticipantItem } from './group-interfaces';
import { getInitializeGroupModal, createGroup, editGroup } from './group-repository';
import Modal from 'react-native-modal';
import { ModalDirtycheckButtonBack } from '../../../shared/components/modal/modal';
import _ from "lodash"
import { GroupType, TypeSelectSuggest, KeySearch, NameControl, TypeMessage, ActionType, TargetType, TargetID } from '../../../config/constants/enum';
import { EmployeeSuggestView } from '../../../shared/components/suggestions/employee/employee-suggest-view';
import { EmployeeDTO } from '../../../shared/components/suggestions/interface/employee-suggest-interface';
import { authorizationSelector } from '../../login/authorization/authorization-selector';
import { ScrollView } from 'react-native-gesture-handler';
import { initializeLocalMenuActions } from '../drawer/drawer-left-reducer';
import { CommonMessages, CommonMessage } from '../../../shared/components/message/message';
import { ressponseStatus, TEXT_EMPTY } from '../../../shared/components/message/message-constants';
import { filterEmployee} from '../../../shared/utils/common-api';
import { messages as messagesEmployee } from '../drawer/drawer-left-messages';

/**
 * Components create share group
 */
export const GroupCreateShareGroup = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const groupSelected = useSelector(groupFilterSelector);
  const [modeManipulationGroup, setModeManipulationGroup] = useState(MANIPULATION_STATUS.CREATE);
  const dataSelected = useSelector(selectedEmployeeIdsSelector);
  const [groupName, setGroupName] = useState('');
  const [groupNameInitial, setGroupNameInitial] = useState('');
  const [buttonActive, setActiveButton] = useState(true);
  const [updatedDate, setUpdatedDate] = useState('');
  // get employee filter from redux
  const [isVisibleDirtycheck, setIsVisibleDirtycheck] = useState(false);
  const [groupParticipantsInitial, setGroupParticipantsInitial] = useState<EmployeeDTO[]>([]);
  const [valueSelected, setValueSelected] = useState<EmployeeDTO[]>([]);
  const LoginInfor = useSelector(authorizationSelector);
  const [listParticipant, setListPariticipant] = useState<any[]>([]);
  const [suggestionsChoice, setSuggestionsChoice] = useState({
    departments: [], employees: [{
      employeeId: LoginInfor.employeeId,
      participantType: TYPE_MEMBER.OWNER
    }], groups: []
  });
  const [responseError, setResponseError] = useState<any>("");
  const [isShowError, setIsShowError] = useState(false);
  const [isErrorInputGroupName, setIsErrorInputGroupName] = useState(false);
  const [isErrorInputGroupParticipant, setIsErrorInputGroupParticipant] = useState(false);
  // Get order by
  const listOrderBy = useSelector(getOrderBySelector);
  // Get Filter condition
  const listFilterCondition = useSelector(getFilterConditionSelector);
  // get employee filter from redux
  const employeesFilter = useSelector(filterSelector);
  const conditonEmployeeSelector = useSelector(conditionSelector);
  let typeCreate = TEXT_EMPTY;

  // check the status in what mode
  useEffect(() => {
    setModeManipulationGroup((route.params as any).mode);
    if (route?.params && (route.params as any).mode && (route.params as any).mode !== MANIPULATION_STATUS.CREATE && (route.params as any).mode !== MANIPULATION_STATUS.CREATE_FROM_LEFT_MENU) {
      setData();
    }
  }, []);
  useEffect(() => {
    if (listParticipant.length > 0 ? groupParticipantsInitial.length < listParticipant.length : groupParticipantsInitial.length === 0) {
      setGroupParticipantsInitial(_.cloneDeep(valueSelected));
    }
  }, [valueSelected])

  // get data for groupName and groupParticipant from API INITIALIZE_SHARE_GROUP_MODAL
  const setData = async () => {
    const groupInfo = await getInitializeGroupModal(
      {
        groupId: groupSelected.groupId
      }
    )
    if (groupInfo?.data?.group && groupInfo?.data?.groupParticipants) {
      // get data success
      setGroupName(groupInfo.data.group.groupName);
      setGroupNameInitial(groupInfo.data.group.groupName);
      setUpdatedDate(groupInfo.data.group.updatedDate);
      let departments: any = [];
      let employees: any = [];
      let groups: any = [];
      groupInfo.data.groupParticipants.forEach((groupParticipant: GroupParticipantItem) => {
        if (groupParticipant.employeeId) {
          employees.push({
            employeeId: groupParticipant.employeeId,
            participantType: groupParticipant.participantType
          })
        } else if (groupParticipant.departmentId) {
          departments.push({
            departmentId: groupParticipant.departmentId,
            participantType: groupParticipant.participantType
          })
        } else if (groupParticipant.participantGroupId) {
          groups.push({
            groupId: groupParticipant.participantGroupId,
            participantType: groupParticipant.participantType
          })
        }
      })
      setListPariticipant(groupInfo.data.groupParticipants);
      setSuggestionsChoice({ departments, employees, groups });
    } else {
      setIsShowError(true);
      setResponseError(groupInfo);
    }
  }

  // function create/update share group
  const handleUpdateGroup = async () => {
    setIsShowError(false);
    setResponseError("");
    setIsErrorInputGroupName(false);
    setIsErrorInputGroupParticipant(false);
    setActiveButton(false);
    let response = null;
    let listGroupParticipant: GroupParticipantItem[] = [];

    valueSelected.forEach((item) => {
      switch (item.groupSearch) {
        case (KeySearch.EMPLOYEE): {
          listGroupParticipant.push({
            participantType: item.participantType || TYPE_MEMBER.OWNER,
            employeeId: item.itemId
          })
          break;
        }
        case (KeySearch.DEPARTMENT): {
          listGroupParticipant.push({
            participantType: item.participantType || TYPE_MEMBER.OWNER,
            departmentId: item.itemId
          })
          break;
        }
        case (KeySearch.GROUP): {
          listGroupParticipant.push({
            participantType: item.participantType || TYPE_MEMBER.OWNER,
            participantGroupId: item.itemId
          })
          break;
        }
      }
    })
    switch (modeManipulationGroup) {
      case (MANIPULATION_STATUS.CREATE):
      case (MANIPULATION_STATUS.CREATE_FROM_LEFT_MENU): {
        // create array data member selected to add share group
        const selectData: any = [];
        if (modeManipulationGroup === MANIPULATION_STATUS.CREATE){
          dataSelected.forEach((item: number) => {
            selectData.push({
              employeeId: item
            });
          });
        }
        // call api create group
        response = await createGroup(
          {
            groupName: groupName,
            groupType: GroupType.SHARE_GROUP,
            isAutoGroup: false,
            groupMembers: [...selectData],
            groupParticipants: listGroupParticipant
          }
        );
        typeCreate = ActionType.CREATE;
        break;
      }
      case (MANIPULATION_STATUS.COPY): {
        // call api create group
        response = await createGroup(
          {
            groupName: groupName,
            groupType: GroupType.SHARE_GROUP,
            isAutoGroup: false,
            groupParticipants: listGroupParticipant
          }
        );
        typeCreate = ActionType.CREATE;
        break;
      }
      case (MANIPULATION_STATUS.CHANGE_TO_SHARE_GROUP):
      case (MANIPULATION_STATUS.EDIT):
        {
          response = await editGroup(
            {
              groupId: groupSelected.groupId,
              groupName: groupName,
              groupType: GroupType.SHARE_GROUP,
              isAutoGroup: false,
              updatedDate: updatedDate,
              groupParticipants: listGroupParticipant
            }
          );
          typeCreate = ActionType.UPDATE;
          break;
        }
    }
    // update or create success
    if (response?.status === ressponseStatus.statusSuccess) {
      dispatch(listMemberActions.setListMember({ listMember: [] }));
      // reload local menu
      dispatch(initializeLocalMenuActions.reloadLocalMenu(undefined));
      // reload employee-list mode edit
      if (modeManipulationGroup === MANIPULATION_STATUS.CHANGE_TO_SHARE_GROUP || modeManipulationGroup === MANIPULATION_STATUS.EDIT) {
        let newParticipantType = -1;
        let indexLoginUser = listGroupParticipant.findIndex((item: GroupParticipantItem) => {
          if (item.employeeId && item.employeeId === LoginInfor.employeeId) {
            newParticipantType = item.participantType;
            return true;
          }
          return false;
        })
        if (indexLoginUser === -1) {
          // userLogin not in group participant
          const filter = {
            limit: employeesFilter.limit,
            offset: 0,
            filterType: employeesFilter.filterType
          };

          filterEmployee(
            TargetType.ALL, TargetID.ZERO, false, null,
            // Get from getFilterConditionSelector
            listFilterCondition, null,
            // Get from getOrderBySelector
            listOrderBy, dispatch, filter,
          );
          dispatch(
            employeeActions.setGroupSelected({
              groupId: -1,
              groupName: '',
              isAutoGroup: false,
              participantType: -1,
            })
          );
          dispatch(
            employeeActions.setStatusDisplay(DISPLAY_STATUS.ALL_EMPLOYEE)
          );
          dispatch(
            employeeActions.setTitleDisplay(
              translate(messagesEmployee.drawerLeftAllEmployees)
            )
          );
        } else {
          // loginUser in group
          dispatch(employeeActions.setTitleDisplay(groupName));
          dispatch(
            employeeActions.setStatusDisplay(DISPLAY_STATUS.FILTER_SHARE_GROUP)
          );
          dispatch(
            employeeActions.setGroupSelected({
              groupId: response?.data?.groupId,
              groupName: groupName,
              isAutoGroup: false,
              participantType: newParticipantType,
            })
          );
        }
      }
      if (modeManipulationGroup === MANIPULATION_STATUS.CREATE_FROM_LEFT_MENU){
        let condition = {...conditonEmployeeSelector};
        condition.isCallback = true;
        dispatch(initializeEmployeeConditionAction.setCondition(condition));
        dispatch(employeeActions.filterUpdatedOffset({offset: 0}));
      }
      navigation.navigate("employee-list", { notify: typeCreate, isShow: true });
    } else {
      response?.data?.parameters?.extensions?.errors.forEach((elementInfo: any) => {
        if (elementInfo.item === NameControl.group) {
          setIsErrorInputGroupName(true);
        }
        if (elementInfo.item === NameControl.groupParticipant) {
          setIsErrorInputGroupParticipant(true);
        }
      })
      setIsShowError(true);
      setResponseError(response);
    }
    setActiveButton(true);
  }
  const dirtycheck = () => {
    return (groupName !== groupNameInitial) || (!_.isEqual(valueSelected, groupParticipantsInitial));
  }

  const onHandleBack = () => {
    if (dirtycheck()) {
      setIsVisibleDirtycheck(true);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[GroupCommonStyles.paddingTop, GroupCommonStyles.container]}>
      <AppbarCommon
        title={
          modeManipulationGroup === MANIPULATION_STATUS.EDIT
            ? translate(messages.groupEditGroupShare)
            : modeManipulationGroup === MANIPULATION_STATUS.CHANGE_TO_SHARE_GROUP
              ? translate(messages.groupChangeToShareGroup)
              : translate(messages.groupCreateGroupShare)
        }
        buttonText={translate(messages.groupCreateGroup)}
        buttonType="complete"
        leftIcon="close"
        handleLeftPress={onHandleBack}
        onPress={handleUpdateGroup}
        buttonDisabled={!buttonActive}
      />
      <ScrollView>
        {modeManipulationGroup === MANIPULATION_STATUS.CREATE && dataSelected.length !== 0 &&
          <View>
            <View style={GroupCommonStyles.wrapAlert}>
              <CommonMessage
                type={TypeMessage.SUCCESS}
                content={`${dataSelected.length}${translate(
                  messages.groupRecordCreateGroup
                )}`}
              ></CommonMessage>
            </View>
          </View>
        }
        <View>
        {
          isShowError && responseError !== TEXT_EMPTY &&
          <View style={GroupCommonStyles.viewRegionErrorShow}>
            <CommonMessages response={responseError} />
          </View>
        }
      </View>
        {modeManipulationGroup !== MANIPULATION_STATUS.CHANGE_TO_SHARE_GROUP &&
          <View>
            <View style={isErrorInputGroupName ? GroupCommonStyles.wrapFormInputError : GroupCommonStyles.wrapFormInput}>
              <View style={GroupCreateShareGroupStyles.labelName}>
                <Text style={GroupCommonStyles.labelText}>
                  {translate(messages.groupNameGroup)}
                </Text>
                <View style={GroupCommonStyles.labelHighlight}>
                  <Text style={GroupCommonStyles.labelTextHighlight}>
                    {translate(messages.groupRequire)}
                  </Text>
                </View>
              </View>
              <Input
                placeholder={translate(messages.groupEnterNameGroup)}
                maxLength={50}
                style={GroupCreateShareGroupStyles.inputName}
                placeholderColor={theme.colors.gray1}
                value={groupName}
                onChangeText={(text) => {
                  setGroupName(text);
                }}
              />
            </View>
          </View>
        }
        <View style={GroupCommonStyles.divide1} />
        <View style={isErrorInputGroupParticipant ? { backgroundColor: '#FFDEDE' } : {}}>
          <View style={GroupCommonStyles.wrapFormInput}>
            <View style={GroupCreateShareGroupStyles.labelName}>
              <Text style={GroupCommonStyles.labelText}>
                {translate(messages.groupListParticipants)}
              </Text>
              <View style={GroupCommonStyles.labelHighlight}>
                <Text style={GroupCommonStyles.labelTextHighlight}>
                  {translate(messages.groupRequire)}
                </Text>
              </View>
            </View>
          </View>
          <View style={GroupCommonStyles.modalSuggetView}>
            <EmployeeSuggestView
              suggestionsChoice={suggestionsChoice}
              typeSearch={TypeSelectSuggest.MULTI}
              groupSearch={KeySearch.NONE}
              withAuthorization={true}
              fieldLabel={translate(messages.groupListParticipants)} updateStateElement={setValueSelected}
              invisibleLabel={true}
              isError={isErrorInputGroupParticipant} // process error
            />
          </View>
        </View>
        <Modal isVisible={isVisibleDirtycheck}>
          <ModalDirtycheckButtonBack
            onPress={() => { setIsVisibleDirtycheck(false) }}
            onPressBack={() => { navigation.goBack() }}
          />
        </Modal>
      </ScrollView>
    </SafeAreaView >
  );
};
