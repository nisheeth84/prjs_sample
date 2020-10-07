import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Platform
} from 'react-native';
import {
  useRoute,
  useNavigation
} from '@react-navigation/native';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { AppbarCommon } from '../../../shared/components/appbar/appbar-common';
import { theme } from '../../../config/constants';
import { Input } from '../../../shared/components/input';
import {
  MANIPULATION_STATUS
} from '../../../config/constants/query';
import { createGroup, getInitializeGroupModal, editGroup } from './group-repository';
import { GroupCommonStyles, GroupCreateMyGroupStyles } from './group-style';
import { translate } from '../../../config/i18n';
import { messages } from './group-messages';
import {
  selectedEmployeeIdsSelector,
  groupFilterSelector,
  conditionSelector
} from '../list/employee-list-selector';
import { employeeActions, initializeEmployeeConditionAction } from '../list/employee-list-reducer';
import { ModalDirtycheckButtonBack } from '../../../shared/components/modal/modal';
import Modal from 'react-native-modal';
import { GroupType, NameControl, TypeMessage, ActionType, PlatformOS } from '../../../config/constants/enum';
import { ScrollView } from 'react-native-gesture-handler';
import { initializeLocalMenuActions } from '../drawer/drawer-left-reducer';
import { ressponseStatus, TEXT_EMPTY } from '../../../shared/components/message/message-constants';
import { CommonMessages, CommonMessage } from '../../../shared/components/message/message';
import { LoadState } from '../../../types';
import { AppIndicator } from '../../../shared/components/app-indicator/app-indicator';

/**
 * Components create my group
 */
export const GroupCreateMyGroup = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  // argument status manipulation group
  const [modeManipulationGroup, setModeManipulationGroup] = useState(
    MANIPULATION_STATUS.CREATE
  );
  const groupSelected = useSelector(groupFilterSelector);
  // declare argument input
  const [groupName, setGroupName] = useState('');
  const [groupNameInitial, setGroupNameInitial] = useState('');

  // declare argument button
  const [buttonActive, setActiveButton] = useState(true);
  // employees selected in the list employees screen
  const dataSelected = useSelector(selectedEmployeeIdsSelector);

  // declare updatedDate
  const [updatedDate, setUpdatedDate] = useState('');

  const [isVisibleDirtycheck, setIsVisibleDirtycheck] = useState(false);
  const [responseError, setResponseError] = useState<any>("");
  const [isShowError, setIsShowError] = useState(false);
  const [isErrorInputGroup, setIsErrorInputGroup] = useState(false);
  // handled in each specific case
  const [loadState, setLoadState] = useState<LoadState>('initial');
  let typeCreate = TEXT_EMPTY;
  const conditonEmployeeSelector = useSelector(conditionSelector);

  useEffect(() => {
    if (route?.params) {
      if ((route.params as any).mode !== MANIPULATION_STATUS.CREATE && (route.params as any).mode !== MANIPULATION_STATUS.CREATE_FROM_LEFT_MENU) {
        setLoadState('loading');
        setData();
      }
      setModeManipulationGroup((route.params as any).mode);
    }
  }, []);

  // set data on load
  const setData = async () => {
    const groupInfo = await getInitializeGroupModal(
      {
        groupId: groupSelected.groupId
      }
    )
    //get data from API InitializeGroupModal
    if (groupInfo.status === ressponseStatus.statusSuccess) {
      setLoadState('succeeded');
      setGroupName(groupInfo.data.group.groupName);
      setGroupNameInitial(groupInfo.data.group.groupName);
      setUpdatedDate(groupInfo.data.group.updatedDate)
    } else {
      // TODO call API fail
      setLoadState('failed');
      setIsShowError(true);
      setResponseError(groupInfo);
    }
  }

  // function handle error when create group
  // function create group
  const handleCreateGroup = async () => {
    setResponseError("");
    setIsShowError(false);
    setIsErrorInputGroup(false);
    setActiveButton(false);
    let response = null;
    // mode create call api create group
    if (modeManipulationGroup === MANIPULATION_STATUS.CREATE || modeManipulationGroup === MANIPULATION_STATUS.CREATE_FROM_LEFT_MENU) {
      const data: any = [];
      if (modeManipulationGroup === MANIPULATION_STATUS.CREATE) {
        dataSelected.forEach((item: any) => {
          data.push({
            employeeId: item,
          });
        });
      }
      // call api create group
      response = await createGroup(
        {
          groupName: groupName,
          groupType: GroupType.MY_GROUP,
          isAutoGroup: false,
          groupMembers: [...data]
        }
      );
      typeCreate = ActionType.CREATE;
    } else if (modeManipulationGroup === MANIPULATION_STATUS.COPY) {
      // mode copy call api create group by mode copy
      // call api create group
      response = await createGroup(
        {
          groupName: groupName,
          groupType: GroupType.MY_GROUP,
          isAutoGroup: false
        }
      );
      typeCreate = ActionType.CREATE;
    } else {
      // other mode call api update group
      response = await editGroup(
        {
          groupId: groupSelected.groupId,
          groupName: groupName,
          groupType: GroupType.MY_GROUP,
          isAutoGroup: false,
          updatedDate: updatedDate
        }
      );
      typeCreate = ActionType.UPDATE;
    }
    // set data when have updated
    if (response.status === ressponseStatus.statusSuccess) {
      // reload local menu
      dispatch(initializeLocalMenuActions.reloadLocalMenu(undefined));
      // reload data title list-employees mode edit
      if (modeManipulationGroup === MANIPULATION_STATUS.EDIT) {
        dispatch(employeeActions.setTitleDisplay(groupName));
      }
      // call list employee by the group when an update or create
      if (modeManipulationGroup === MANIPULATION_STATUS.CREATE_FROM_LEFT_MENU) {
        let condition = { ...conditonEmployeeSelector };
        condition.isCallback = true;
        dispatch(initializeEmployeeConditionAction.setCondition(condition));
        dispatch(employeeActions.filterUpdatedOffset({ offset: 0 }));
      }
      navigation.navigate("employee-list", { notify: typeCreate, isShow: true })
    } else {
      // color controll when error
      response.data?.parameters?.extensions?.errors?.forEach((elementInfo: any) => {
        if (elementInfo.item === NameControl.group) {
          setIsErrorInputGroup(true);
        }
      })
      setIsShowError(true);
      // Set ressponse
      setResponseError(response);
    }
    setActiveButton(true);
  };

  const dirtycheck = () => {
    return groupName !== groupNameInitial;
  }

  const onHandleBack = () => {
    if (dirtycheck()) {
      setIsVisibleDirtycheck(true);
    } else {
      navigation.goBack();
    }
  };

  // view creat, edit my group
  return (
    <SafeAreaView style={[GroupCommonStyles.paddingTop, GroupCommonStyles.container]}>
      <AppbarCommon
        title={
          modeManipulationGroup === MANIPULATION_STATUS.CREATE ||
            modeManipulationGroup === MANIPULATION_STATUS.COPY ||
            modeManipulationGroup === MANIPULATION_STATUS.CREATE_FROM_LEFT_MENU
            ? translate(messages.groupCreateGroupAppbar)
            : translate(messages.groupEditGroupAppbar)
        }
        buttonText={translate(messages.groupCreateGroup)}
        buttonType="complete"
        leftIcon="close"
        onPress={() => {
          handleCreateGroup();
        }}
        handleLeftPress={onHandleBack}
        buttonDisabled={!buttonActive}
      />
      {loadState !== 'succeeded' && loadState !== 'initial' ? <AppIndicator size={40} style={GroupCreateMyGroupStyles.loadingView} /> :
        <ScrollView>
          {modeManipulationGroup === MANIPULATION_STATUS.CREATE && dataSelected.length !== 0 && (
            <View style={[GroupCommonStyles.wrapAlert, { paddingBottom: isShowError ? 0 : 20 }]}>
              <CommonMessage
                type={TypeMessage.SUCCESS}
                content={`${dataSelected.length.toString()}${translate(messages.groupRecordCreateGroup)}`}
              ></CommonMessage>
            </View>
          )}
          <View>
            {
              isShowError && responseError !== TEXT_EMPTY &&
              <View style={GroupCommonStyles.viewRegionErrorShow}>
                <CommonMessages response={responseError} />
              </View>
            }
          </View>
          <View style={isErrorInputGroup ? GroupCreateMyGroupStyles.viewError : {}}>
            <View style={GroupCreateMyGroupStyles.wrapFormInput}>
              <View style={GroupCreateMyGroupStyles.labelName}>
                <Text style={GroupCommonStyles.labelText}>
                  {translate(messages.groupNameGroup)}
                </Text>
                <View style={GroupCommonStyles.labelHighlight}>
                  <Text style={GroupCommonStyles.labelTextHighlight}>
                    {translate(messages.groupRequire)}
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <View
                style={[
                  GroupCreateMyGroupStyles.wrapFormInput,
                  GroupCreateMyGroupStyles.paddingTop0,
                  Platform.OS === PlatformOS.ANDROID ? { paddingLeft: 8 } : {}
                ]}
              >
                <Input
                  placeholder={translate(messages.groupEnterNameGroup)}
                  maxLength={50}
                  style={GroupCreateMyGroupStyles.inputName}
                  placeholderColor={theme.colors.gray1}
                  value={groupName}
                  onChangeText={(text: string) => {
                    setGroupName(text);
                  }}
                />
              </View>
            </View>
            <View style={GroupCommonStyles.divide1} />
          </View>
          <Modal isVisible={isVisibleDirtycheck}>
            <ModalDirtycheckButtonBack
              onPress={() => { setIsVisibleDirtycheck(false) }}
              onPressBack={() => { navigation.goBack() }}
            />
          </Modal>
        </ScrollView>
      }
    </SafeAreaView>

  );
};
