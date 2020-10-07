import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, Platform, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '../../../shared/components/icon';
import { theme } from '../../../config/constants';
import { Input } from '../../../shared/components/input';
import { ModalDelete } from './modal/drawer-left-modal-delete';
import { ModalConfirmUpdateAutoGroup } from './modal/drawer-left-modal-update-auto-group';
import { ManipulationGroup, } from './drawer-left-manipulation-group';
import { GroupActivityModal } from './modal/drawer-left-modal-group-activity';
import { OtherActivityModal } from './modal/drawer-left-modal-other-activity';
import { translate } from '../../../config/i18n';
import { messages } from './drawer-left-messages';
import {
  MANIPULATION_TYPE,
  MANIPULATION_STATUS,
  DISPLAY_STATUS,
} from '../../../config/constants/query';
import {
  Departments,
  MyGroups,
  ShareGroups,
  getInitializeLocalMenu,
} from './drawer-left-repository';
import { initializeLocalMenuSelector, reloadLocalMenuSelector, statusKeyboard } from './drawer-list-selector';
import { employeeActions } from '../list/employee-list-reducer';
import { DrawerLeftContentStyles } from './drawer-left-style';
import { filterSelector, groupManipulatedSelector, conditionSelector } from '../list/employee-list-selector';
import { messagesComon } from '../../../shared/utils/common-messages';
import {
  filterEmployee,
} from '../../../shared/utils/common-api';
import {
  getInitializeGroupModal, deleteGroup,
  updateAutoGroup,
  editGroup,
  createGroup,
} from '../group/group-repository';
import { Dispatch } from '@reduxjs/toolkit';
import { initializeLocalMenuActions } from './drawer-left-reducer';
import { getOrderBySelector, getFilterConditionSelector } from '../list/employee-list-selector';
import { TargetType, TargetID, GroupType, TypeMessage, ActionType } from '../../../config/constants/enum';
import { CommonButton } from '../../../shared/components/button-input/button';
import { StatusButton, TypeButton } from '../../../config/constants/enum';
import { ressponseStatus, errorCode, TEXT_EMPTY } from '../../../shared/components/message/message-constants';
import { CommonMessages, CommonMessage } from '../../../shared/components/message/message';
import { responseMessages } from '../../../shared/messages/response-messages';
import { format } from 'react-string-format';
import { Error } from '../../../shared/components/message/message-interface';
import Toast from 'react-native-tiny-toast';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { MOVE_GROUP_SCREEN } from '../list/employee-list-constants';
var ressponseInitialize: any;
var isErrorRessponse: boolean;
export const getDataInitializeLocalMenu = async (dispatch: Dispatch<any>) => {
  try {
    isErrorRessponse = false;
    ressponseInitialize = "";
    const response = await getInitializeLocalMenu({});
    if (response.status === ressponseStatus.statusSuccess) {
      dispatch(
        initializeLocalMenuActions.initializeLocalMenuFetched(response.data)
      );
    } else {
      // Set ressponse
      ressponseInitialize = response;
    }

  } catch (error) {
    isErrorRessponse = true;
  }
};
/**
 * Drawer left content
 */
export const DrawerLeftContent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // get employee filter from redux
  const employeesFilter = useSelector(filterSelector);
  // get initializeLocalMenu from redux
  const initializeLocalMenu = useSelector(initializeLocalMenuSelector);

  // get variable reload local menu
  const reloadLocalMenu = useSelector(reloadLocalMenuSelector);

  //get groupselected from redux
  const groupManipulated = useSelector(groupManipulatedSelector);
  // get status keyboard
  const keyboard = useSelector(statusKeyboard);
  // handle show group when click arrow down
  const [showMyGroup, setShowMyGroup] = useState(true);
  // handle show share group when click arrow down
  const [showShareGroup, setShowShareGroup] = useState(true);
  // show manipulation group when mode edit
  const [showManipulation, setShowManipulation] = useState(false);
  // argument open close modal delete
  const [openModalDelete, setOpenModalDelete] = useState(false);
  // argument open close modal activity group
  const [openModalActivityGroup, setOpenModalActivityGroup] = useState(false);
  // argument open close modal other activity group
  const [openModalOtherActivity, setOpenModalOtherActivity] = useState(false);
  // argument edit manipulation
  const [editManipulation, setEditManipulation] = useState(false);
  // button edit complete
  const [editComplete, setEditComplete] = useState(false);
  // list department
  const [departments, setDepartments] = useState<Departments[] | null>([]);
  // filter department
  const [filterDepartments, setFilterDepartments] = useState<Departments[] | null>([]);
  // copy new group
  const [newMyGroup, setNewMyGroup] = useState<MyGroups>();
  // copy new share group
  const [newShareGroup, setNewShareGroup] = useState<ShareGroups>();
  // position in list department
  const [positionDepartment, setPositionDepartment] = useState(-1);
  // title department
  const [titleDepartment, setTitleDepartment] = useState('');
  // value search deparment or group
  const [searchDepartmentOrGroup, setSearchDepartmentOrGroup] = useState('');
  // disable button when call delete modal
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const [groupIdAction, setGroupIdAction] = useState(-1);
  // open modal update auto group
  const [openModalUpdateAutoGroup, setOpenModalUpdateAutoGroup] = useState(
    false
  );
  // Get order by
  const listOrderBy = useSelector(getOrderBySelector);
  // Get Filter condition
  const listFilterCondition = useSelector(getFilterConditionSelector);
  // disable when update auto group
  const [
    disableUpdateAutoGroupButton,
    setDisableUpdateAutoGroupButton,
  ] = useState(false);
  // save old path to go back department
  const [savePathDepartment, setSavePathDepartment] = useState<
    Array<Departments[] | null>
  >([]);
  // group id select
  const [groupIdSelected, setGroupIdSelected] = useState(-1);
  const [myGroups, setMyGroups] = useState<MyGroups[]>([]);
  const [sharedGroups, setSharedGroups] = useState<ShareGroups[]>([]);
  //code update
  const listMyGroup = initializeLocalMenu?.myGroups;
  const listShareGroup = initializeLocalMenu?.sharedGroups;
  const [responseError, setResponseError] = useState<any>("");
  const [responseCopyEditGroupError, setResponseCopyEditGroupError] = useState<any>("");
  const [lisMessageRessponse, setListMessageRessponse] = useState<Error[]>([]);
  const [isError, setIsError] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMesssage] = useState(TEXT_EMPTY);
  const conditonEmployeeSelector = useSelector(conditionSelector);
  const [groupNameSelected, setGroupNameSelected] = useState("");
  const isDrawerOpen = useIsDrawerOpen();

  /**
   * function set up local menu
   */
  const setupInitializeLocalMenu = async () => {
    setResponseError("");
    const response = await getInitializeLocalMenu({});
    if (response.status === ressponseStatus.statusSuccess) {
      dispatch(
        initializeLocalMenuActions.initializeLocalMenuFetched(response.data)
      );
    } else {
      // Set ressponse
      setResponseError(response);
    }
  }
  useEffect(() => {
    setupInitializeLocalMenu();
  }, [reloadLocalMenu])
  // When close modal then close keyboard 
  useEffect(() => {
    if (!isDrawerOpen) {
      Keyboard.dismiss();
    }
  }, [isDrawerOpen])
  useEffect(() => {
    // set my groups when start
    setMyGroups(
      initializeLocalMenu?.myGroups ? initializeLocalMenu?.myGroups : []
    );
    // set shared groups when start
    setSharedGroups(
      initializeLocalMenu?.sharedGroups ? initializeLocalMenu?.sharedGroups : []
    );
    // set title department when start
    setTitleDepartment(translate(messages.drawerDepartment));
  }, [initializeLocalMenu]);

  /**
   * function click to show my group
   */
  const hanldeShowMyGroup = () => {
    setShowMyGroup(!showMyGroup);
  };

  /**
   * function click to show share group
   */
  const hanldeShowShareGroup = () => {
    setShowShareGroup(!showShareGroup);
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
  const handleModalDelete = (groupId: number, groupName: string) => {
    setGroupIdSelected(groupId);
    setGroupNameSelected(groupName);
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
  const handleModalUpdateAutoGroup = (groupId: number, groupName: string) => {
    setGroupIdSelected(groupId);
    setGroupNameSelected(groupName);
    setOpenModalUpdateAutoGroup(true);
  };

  /**
   * function click to show activity group
   */
  const handleCloseModalActivityGroup = () => {
    setOpenModalOtherActivity(false);
  };

  /**
   *function click to show other group
   */
  const handleCloseModalOtherActivity = () => {
    setOpenModalActivityGroup(false);
  };

  /**
   * action go to create share group
   */
  const addShareGroup = () => {
    navigation.navigate(MOVE_GROUP_SCREEN.TO_SHARE_GROUP, {
      mode: MANIPULATION_STATUS.CREATE_FROM_LEFT_MENU,
    });
  };

  /**
   * action go to create my group
   */
  const addMyGroup = () => {
    navigation.navigate(MOVE_GROUP_SCREEN.TO_MY_GROUP, {
      mode: MANIPULATION_STATUS.CREATE_FROM_LEFT_MENU,
    });
  };

  /**
   * action get department in first time
   */
  const handleGetDepartment = () => {
    const data = savePathDepartment;
    if (initializeLocalMenu) {
      setPositionDepartment(positionDepartment + 1);
      setDepartments(initializeLocalMenu.departments);
      setFilterDepartments(initializeLocalMenu.departments?.filter((item: Departments) => searchInDepartment(item, searchDepartmentOrGroup)));
      data.push(initializeLocalMenu.departments);
      setSavePathDepartment([...data]);
    }
  };

  /**
   * handle reset search value
   */
  const resetSearch = () => {
    setSearchDepartmentOrGroup('');
  };
  /**
   * filter by type, if type is empty, fetch all
   * @param targetType 
   * @param targetId 
   */
  const filterByType = async (targetType: number, targetId: number) => {
    const filter = {
      limit: employeesFilter.limit,
      offset: 0,
      filterType: employeesFilter.filterType
    };

    filterEmployee(
      targetType, targetId, false, null,
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
    resetSearch();
    navigation.navigate("employee-list");
  };

  /**
   * action drilldown department (when click item department get and show child of department)
   */
  const handleDrilldownDepartment = (department: Departments) => () => {
    const data = savePathDepartment;
    if (departments) {
      setDepartments(department.departmentChild);
      setFilterDepartments(department.departmentChild?.filter((item: Departments) => searchInDepartment(item, searchDepartmentOrGroup)) || []);
      setPositionDepartment(positionDepartment + 1);
      data.push(department.departmentChild);
      if (data) {
        setSavePathDepartment([...data]);
      }
      setTitleDepartment(department.departmentName);
    }
  };

  /**
   * action handle filter department
   */
  const handleFlterDepartment = (department: Departments) => () => {
    if (departments) {
      filterByType(TargetType.DEPARTMENT, department.departmentId);
      dispatch(
        employeeActions.setStatusDisplay(DISPLAY_STATUS.FILTER_DEPARTMENT)
      );
      dispatch(
        employeeActions.setTitleDisplay(department.departmentName)
      );
    }
  };

  /**
   * action click icon back department
   */
  const handleBackDepartment = () => {
    // savePathDepartment is array save path when drill down
    const data = savePathDepartment;
    data.splice(positionDepartment, 1);
    // position is previous postion of array savePathDepartment
    const position = positionDepartment - 1;
    if (initializeLocalMenu) {
      // when position 0 set default title Department
      if (position === 0) {
        setTitleDepartment(translate(messages.drawerDepartment));
      }
      // when position 0 have not to drill down array department is empty
      // positionDepartment is present position of array department
      if (positionDepartment === 0) {
        setDepartments([]);
        setFilterDepartments([]);
      } else {
        setDepartments(savePathDepartment[position]);
        setFilterDepartments(savePathDepartment[position]?.filter((item: Departments) => searchInDepartment(item, searchDepartmentOrGroup)) || []);
        if (savePathDepartment[position - 1]) {
          setTitleDepartment(
            (savePathDepartment as any)[position - 1][0].departmentName
          );
        }
      }
      setSavePathDepartment([...data]);
      setPositionDepartment(position);
    }
  };

  // function delete group
  const handleDeleteGroup = async () => {
    setIsError(false);
    setListMessageRessponse([]);
    setDisableDeleteButton(true);
    setResponseError("");
    try {
      // call api delete group
      const res = await deleteGroup({ groupId: groupIdSelected });
      if (res.status === ressponseStatus.statusSuccess) {
        getDataInitializeLocalMenu(dispatch);
        setResponseError(ressponseInitialize);
        setIsError(isErrorRessponse);
        handleToast(ActionType.DELETE);
      } else {
        if (res?.data?.parameters?.extensions?.errors) {
          const listMessageError: Error[] = [];
          let messageError: string[] = [];
          res?.data?.parameters?.extensions?.errors.forEach((element: any) => {
            if (element.errorCode === errorCode.errEmp0006) {
              let errorParam: string[] = [];
              let tempGroupName = myGroups?.find(elelmentMyGroup => elelmentMyGroup.groupId === groupIdSelected)?.groupName;
              tempGroupName = tempGroupName ? tempGroupName : sharedGroups?.find(elelmentMyGroup => elelmentMyGroup.groupId === groupIdSelected)?.groupName;
              errorParam.push(tempGroupName ? tempGroupName : "");
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
      }
      setOpenModalDelete(false);
    } catch (error) {
      setIsError(true);
    }
    setDisableDeleteButton(false);
  };
  // function open modal update auto group
  const handleUpdateAutoGroup = async () => {
    setIsError(false);
    setListMessageRessponse([])
    setDisableUpdateAutoGroupButton(true);
    try {
      // call api update auto group
      const update = await updateAutoGroup({ "groupId": groupIdSelected }
      );
      if (update.status === 200) {
        getDataInitializeLocalMenu(dispatch);
        setResponseError(ressponseInitialize);
        setIsError(isErrorRessponse);
        let targetType;
        let tempMyGroup = listMyGroup.find((item: MyGroups) => item.groupId === groupIdSelected);
        if (tempMyGroup) {
          targetType = 3;
          dispatch(
            employeeActions.setStatusDisplay(DISPLAY_STATUS.FILTER_MY_GROUP)
          );
        } else {
          // Share Group = 4
          targetType = 4;
          dispatch(
            employeeActions.setStatusDisplay(DISPLAY_STATUS.FILTER_SHARE_GROUP)
          );
        }
        dispatch(employeeActions.setTitleDisplay(groupNameSelected));
        filterEmployee(targetType,
          groupIdSelected,
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
        navigation.navigate("employee-list", { notify: ActionType.UPDATE, isShow: true })
      } else {
        if (update?.data?.parameters?.extensions?.errors) {
          const listMessageError: Error[] = [];
          let messageError: string[] = [];
          update?.data?.parameters?.extensions?.errors.forEach((element: any) => {
            if (element.errorCode === errorCode.errEmp0007) {
              let errorParam: string[] = [];
              let tempGroupName = myGroups?.find(elelmentMyGroup => elelmentMyGroup.groupId === groupIdSelected)?.groupName;
              tempGroupName = tempGroupName ? tempGroupName : sharedGroups?.find(elelmentMyGroup => elelmentMyGroup.groupId === groupIdSelected)?.groupName;
              errorParam.push(tempGroupName ? tempGroupName : "");
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
    } catch (error) {
      setIsError(true);
    }
    setDisableUpdateAutoGroupButton(false);
  };
  //function copy group
  const handleCopyGroup = (
    groupID: number,
    groupName: string,
    isAutoGroup: boolean,
    type: string,
    participantType?: number
  ) => {
    // copy a new my group
    if (type === MANIPULATION_TYPE.MY_GROUP) {
      setNewMyGroup({
        groupId: groupID,
        groupName,
        isAutoGroup,
      });
    } else {
      // copy a new share group
      setNewShareGroup({
        groupId: groupID,
        groupName,
        isAutoGroup,
        participantType: participantType ? participantType : 1,
      });
    }
  };

  // function reset group
  const resetGroup = () => {
    setNewMyGroup(undefined);
    setNewShareGroup(undefined);
    setGroupIdAction(-1);
    //reset group is selected to manipulate
    dispatch(employeeActions.setGroupManipulated({
      groupId: -1,
      groupName: '',
      isAutoGroup: false,
      participantType: -1,
      status: '',
      editStatus: false
    }))
  };

  /**
   * handle search department or group
   */
  const handleSearchDeparmentOrGroup = (text: string) => {
    setSearchDepartmentOrGroup(text);
    if (text === '') {
      setMyGroups(
        initializeLocalMenu?.myGroups ? initializeLocalMenu?.myGroups : []
      );
      setSharedGroups(
        initializeLocalMenu?.sharedGroups
          ? initializeLocalMenu?.sharedGroups
          : []
      );
    } else {
      //code update
      const searchMyGroups = listMyGroup?.filter((item: MyGroups) =>
        item.groupName.toLowerCase().includes(text.toLowerCase()));
      const searchSharedGroups = listShareGroup?.filter((item: ShareGroups) =>
        item.groupName.toLowerCase().includes(text.toLowerCase()));
      setMyGroups(searchMyGroups);
      setSharedGroups(searchSharedGroups);
    }
    setFilterDepartments(departments?.filter((item: Departments) => searchInDepartment(item, text)) || []);
  };

  /**
   * check department or childDepartment have text in name
   * @param department department check
   * @param searchText search text
   */
  const searchInDepartment = (department: Departments, searchText: string): boolean => {
    if (searchText === '') return true;
    if (department.departmentName.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      if (department.departmentChild && department.departmentChild.length > 0) {
        let childDepartment = department.departmentChild;
        let index = childDepartment.find((child: Departments) => searchInDepartment(child, searchText));
        if (index) return true;
      }
    }
    return false;
  }
  // handle edit group
  const onEditGroup = async () => {
    let tempStatus = "";
    setResponseError("");
    try {
      //don't have group is selected to manipulate
      if (!groupManipulated.editStatus) {
        return;
      }
      //get infor of group
      const getGroup = await getInitializeGroupModal({ groupId: groupManipulated.groupId });
      if (getGroup.status === ressponseStatus.statusSuccess) {
        if (groupManipulated.status === MANIPULATION_STATUS.EDIT) {
          if (getGroup.data.group) {
            setResponseCopyEditGroupError("");
            const myGroupParticipants: any = []
            getGroup.data.groupParticipants.forEach(
              (item: any) => {
                myGroupParticipants.push({
                  employeeId: item.employeeId,
                  departmentId: item.departmentId,
                  participantGroupId: item.participantGroupId,
                  participantType: item.participantType
                })
              }
            );
            let ressponseUpdateGroup = await editGroup(
              {
                groupId: groupManipulated.groupId,
                groupName: groupManipulated.groupName,
                groupType: getGroup.data.group.groupType,
                isAutoGroup: false,
                isOverWrite: false,
                updatedDate: getGroup.data.group.updatedDate,
                groupParticipants: getGroup.data.groupParticipants ? [...myGroupParticipants] : null,
                searchConditions: []
              }
            );
            if (ressponseUpdateGroup.status !== ressponseStatus.statusSuccess) {
              setResponseCopyEditGroupError(ressponseUpdateGroup);
            } else {
              tempStatus = ActionType.UPDATE;
            }

          }
        } else if (groupManipulated.status === MANIPULATION_STATUS.COPY) {
          if (getGroup.data.group) {
            const data: any = [];
            const myGroupParticipants: any = []
            setResponseCopyEditGroupError("");
            getGroup.data.groupParticipants.forEach(
              (item: any) => {
                item.employeeId && data.push({
                  employeeId: item.employeeId,
                });
                myGroupParticipants.push({
                  employeeId: item.employeeId,
                  departmentId: item.departmentId,
                  participantGroupId: item.participantGroupId,
                  participantType: item.participantType
                })
              }
            );
            let ressPonseCreateGroup = await createGroup({
              groupName: groupManipulated.groupName,
              groupType: getGroup.data.group.groupType,
              isAutoGroup: false,
              isOverWrite: false,
              groupMembers: [...data],
              groupParticipants: getGroup.data.group.groupType == GroupType.SHARE_GROUP ? [...myGroupParticipants] : null,
              searchConditions: []
            });
            if (ressPonseCreateGroup.status !== ressponseStatus.statusSuccess) {
              setResponseCopyEditGroupError(ressPonseCreateGroup);
            } else {
              tempStatus = ActionType.CREATE;
            }
          }
        }
        resetGroup();
        //init list menu again
        getDataInitializeLocalMenu(dispatch);
        setResponseError(ressponseInitialize);
        setIsError(isErrorRessponse);
        handleToast(tempStatus);
      } else {
        // Set ressponse
        setResponseError(getGroup);
      }
    } catch (error) {
      setIsError(true);
    }
  };
  /**
   * Handle toast
   */
  const handleToast = (actions: string) => {
    switch (actions) {
      case ActionType.CREATE:
        setShowToast(true);
        setToastMesssage(translate(responseMessages[errorCode.infCom0003]));
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
        break;
      case ActionType.UPDATE:
        setShowToast(true);
        setToastMesssage(translate(responseMessages[errorCode.infCom0004]));
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
        break;
      case ActionType.DELETE:
        setShowToast(true);
        setToastMesssage(translate(responseMessages[errorCode.infCom0005]));
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
        break;
      default:
        break;
    }
  }
  /**
   * check position to set style department
   */
  const styleDepartmentTitle =
    positionDepartment === -1
      ? DrawerLeftContentStyles.headerWrapper
      : DrawerLeftContentStyles.wrapTitle;

  return (
    <View style={[DrawerLeftContentStyles.container, { paddingBottom: (keyboard && Platform.OS === "ios") ? "50%" : 0 }]}>
      <SafeAreaView>
        <ScrollView>
          {
            showToast &&
            <Toast
              visible={showToast}
              position={-60}
              shadow={false}
              animation={false}
              textColor='#333333'
              imgStyle={{ marginRight: 5 }}
              imgSource={require("../../../../assets/icons/SUS.png")}
              containerStyle={DrawerLeftContentStyles.viewToast}
            >
              <Text>{toastMessage}</Text></Toast>
          }
          <View>
            {
              responseError !== TEXT_EMPTY &&
              <View style={DrawerLeftContentStyles.viewRegionErrorShow}>
                <CommonMessages response={responseError} widthMessage="80%" />
              </View>
            }
            {
              responseCopyEditGroupError !== TEXT_EMPTY &&
              <View style={DrawerLeftContentStyles.viewRegionErrorShow}>
                <CommonMessages response={responseCopyEditGroupError} widthMessage="80%" />
              </View>
            }
          </View>
          {
            isError &&
            <View style={DrawerLeftContentStyles.viewRegionErrorShow}>
              <CommonMessage type={TypeMessage.ERROR} content={format(translate(responseMessages[errorCode.errCom0001]), ...[])} widthMessage="80%"></CommonMessage>
            </View>
          }
          {lisMessageRessponse.length > 0 &&
            <View style={DrawerLeftContentStyles.viewRegionErrorShow}>
              {
                lisMessageRessponse?.map((error: Error, index: number) => (
                  <CommonMessage key={index} content={error.error} type={error.type} widthMessage="80%"></CommonMessage>
                ))
              }
            </View>
          }
          <View style={DrawerLeftContentStyles.header}>
            <Text style={DrawerLeftContentStyles.titleHeader}>
              {translate(messages.drawerLeftEmployeeMenu)}
            </Text>
            {editComplete ? (
              <CommonButton onPress={() => {
                onEditGroup();
                setEditComplete(false);
                setShowManipulation(false);
                setEditManipulation(false);
              }}
                status={StatusButton.ENABLE} textButton={translate(messages.drawerEditDone)}
                typeButton={TypeButton.BUTTON_SUCCESS} />
            ) : (
                <TouchableOpacity
                  style={DrawerLeftContentStyles.iconEdit}
                  onPress={() => {
                    setEditComplete(true);
                    setShowManipulation(true);
                    setGroupIdAction(-1);
                  }}
                >
                  <Icon name="edit" />
                </TouchableOpacity>
              )}
          </View>
          <View style={DrawerLeftContentStyles.divide} />
          {<TouchableOpacity
            style={DrawerLeftContentStyles.header}
            onPress={() => {
              filterByType(TargetType.ALL, TargetID.ZERO);
              dispatch(
                employeeActions.setStatusDisplay(DISPLAY_STATUS.ALL_EMPLOYEE)
              );
              dispatch(
                employeeActions.setTitleDisplay(
                  translate(messages.drawerLeftAllEmployees)
                )
              );
            }}
          >
            <Text style={DrawerLeftContentStyles.titleList}>
              {translate(messages.drawerLeftAllEmployees)}
            </Text>
          </TouchableOpacity>}

          <View style={DrawerLeftContentStyles.divide2} />
          <View style={DrawerLeftContentStyles.list}>
            <Text style={DrawerLeftContentStyles.titleList}>
              {translate(messages.drawerLeftDepartmentGroup)}
            </Text>
            <View style={DrawerLeftContentStyles.search}>
              <Icon name="search" />
              <Input
                value={searchDepartmentOrGroup}
                placeholder={translate(messages.drawerLeftSearch)}
                placeholderColor={theme.colors.gray}
                style={DrawerLeftContentStyles.inputStyle}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                onChangeText={handleSearchDeparmentOrGroup}
              />
            </View>
          </View>
          <View style={DrawerLeftContentStyles.divide} />
          <View>
            <TouchableOpacity
              style={styleDepartmentTitle}
              disabled={positionDepartment !== -1}
              onPress={handleGetDepartment}
            >
              <Text style={DrawerLeftContentStyles.titleList}>
                {titleDepartment}
              </Text>
              {positionDepartment === -1 && <Icon name="arrowRight" />}
            </TouchableOpacity>
            <View style={DrawerLeftContentStyles.divide} />
            {positionDepartment >= 0 && (
              <TouchableOpacity
                style={DrawerLeftContentStyles.formBack}
                onPress={handleBackDepartment}
              >
                <Icon
                  name="arrowBack"
                  style={DrawerLeftContentStyles.iconBack}
                />
                <Text>{translate(messages.backToTop)}</Text>
              </TouchableOpacity>
            )}
            {filterDepartments &&
              filterDepartments.map((item) => {
                return (
                  <View key={item.departmentId.toString()}>
                    <View style={DrawerLeftContentStyles.departmentItem}>
                      <TouchableOpacity
                        style={DrawerLeftContentStyles.departmentChildItem}
                        onPress={handleFlterDepartment(item)}
                      >
                        <Text style={DrawerLeftContentStyles.titleList} numberOfLines={1}>
                          {item.departmentName}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleDrilldownDepartment(item)}
                      >
                        {item.departmentChild && <Icon name="arrowRight" />}
                      </TouchableOpacity>
                    </View>
                    <View style={DrawerLeftContentStyles.divide} />
                  </View>
                );
              })}
          </View>
          <View style={DrawerLeftContentStyles.divide} />
          <TouchableOpacity
            style={DrawerLeftContentStyles.headerWrapper}
            onPress={() => {
              filterByType(TargetType.RETAIL, TargetID.ZERO);
              dispatch(
                employeeActions.setStatusDisplay(DISPLAY_STATUS.RETIRE_EMPLOYEE)
              );
              dispatch(
                employeeActions.setTitleDisplay(
                  translate(messages.drawerLeftRetiree)
                )
              );
            }}
          >
            <Text style={DrawerLeftContentStyles.titleList}>
              {translate(messages.drawerLeftRetiree)}
            </Text>
          </TouchableOpacity>
          <View style={DrawerLeftContentStyles.divide} />
          <View style={DrawerLeftContentStyles.listItem}>
            <View style={DrawerLeftContentStyles.dropdownHeader}>
              <TouchableOpacity
                style={DrawerLeftContentStyles.headerArrow}
                onPress={hanldeShowMyGroup}
              >
                {myGroups.length > 0 &&
                  <Icon
                    name={showMyGroup ? 'arrowUp' : 'arrowDown'}
                    style={DrawerLeftContentStyles.iconArrowDown}
                  />}
                <Text style={DrawerLeftContentStyles.titleList}>
                  {translate(messages.drawerLeftMyGroup)}
                </Text>
              </TouchableOpacity>
              {!showManipulation && (
                <TouchableOpacity onPress={addMyGroup}>
                  <Icon name="addCircleOutline" />
                </TouchableOpacity>
              )}
            </View>
            {showMyGroup && (
              <View>
                {myGroups.map((item) => {
                  return (
                    <ManipulationGroup
                      key={item.groupId.toString()}
                      isAutoGroup={item.isAutoGroup}
                      groupID={item.groupId}
                      title={item.groupName}
                      showManipulationButton={showManipulation && (groupIdAction === -1 || groupIdAction === item.groupId)}
                      deleteGroup={handleModalDelete}
                      updateAutoGroup={handleModalUpdateAutoGroup}
                      copyGroup={handleCopyGroup}
                      type={MANIPULATION_TYPE.MY_GROUP}
                      status={MANIPULATION_STATUS.EDIT}
                      setShowButton={setGroupIdAction}
                      resetGroup={resetGroup}
                      canEdit={editManipulation}
                      resetSeachValue={resetSearch}
                    />
                  );
                })}
                {newMyGroup && (
                  <ManipulationGroup
                    isAutoGroup={newMyGroup.isAutoGroup}
                    groupID={newMyGroup.groupId}
                    title={newMyGroup.groupName}
                    showManipulationButton={showManipulation && (groupIdAction === -1 || groupIdAction === newMyGroup.groupId)}
                    isFocus
                    updateAutoGroup={handleModalUpdateAutoGroup}
                    deleteGroup={handleModalDelete}
                    copyGroup={handleCopyGroup}
                    type={MANIPULATION_TYPE.MY_GROUP}
                    status={MANIPULATION_STATUS.COPY}
                    setShowButton={setGroupIdAction}
                    resetGroup={resetGroup}
                    canEdit={showManipulation}
                    resetSeachValue={resetSearch}
                  />
                )}
              </View>
            )}
          </View>
          <View style={DrawerLeftContentStyles.divide} />
          <View style={DrawerLeftContentStyles.listItem}>
            <View style={DrawerLeftContentStyles.wrapGroupTitle}>
              <TouchableOpacity
                onPress={hanldeShowShareGroup}
                style={DrawerLeftContentStyles.dropdownHeader}
              >
                <View style={DrawerLeftContentStyles.headerArrow}>
                  {sharedGroups.length > 0 &&
                    <Icon
                      name={showShareGroup ? 'arrowUp' : 'arrowDown'}
                      style={DrawerLeftContentStyles.iconArrowDown}
                    />
                  }
                  <Text style={DrawerLeftContentStyles.titleList}>
                    {translate(messages.drawerLeftGroupShare)}
                  </Text>
                </View>
              </TouchableOpacity>
              {!showManipulation && (
                <TouchableOpacity onPress={addShareGroup}>
                  <Icon name="addCircleOutline" />
                </TouchableOpacity>
              )}
            </View>
            {showShareGroup && (
              <View>
                {sharedGroups.map((item) => {
                  return (
                    <ManipulationGroup
                      key={item.groupId.toString()}
                      groupID={item.groupId}
                      isAutoGroup={item.isAutoGroup}
                      title={item.groupName}
                      showManipulationButton={showManipulation && (groupIdAction === -1 || groupIdAction === item.groupId)}
                      deleteGroup={handleModalDelete}
                      updateAutoGroup={handleModalUpdateAutoGroup}
                      copyGroup={handleCopyGroup}
                      participantType={item.participantType}
                      type={MANIPULATION_TYPE.SHARE_GROUP}
                      status={MANIPULATION_STATUS.EDIT}
                      setShowButton={setGroupIdAction}
                      resetGroup={resetGroup}
                      canEdit={editManipulation}
                      resetSeachValue={resetSearch}
                    />
                  );
                })}
                {newShareGroup && (
                  <ManipulationGroup
                    groupID={newShareGroup.groupId}
                    isAutoGroup={newShareGroup.isAutoGroup}
                    title={newShareGroup.groupName}
                    showManipulationButton={showManipulation && (groupIdAction === -1 || groupIdAction === newShareGroup.groupId)}
                    isFocus
                    deleteGroup={handleModalDelete}
                    updateAutoGroup={handleModalUpdateAutoGroup}
                    copyGroup={handleCopyGroup}
                    participantType={newShareGroup.participantType}
                    type={MANIPULATION_TYPE.SHARE_GROUP}
                    status={MANIPULATION_STATUS.COPY}
                    setShowButton={setGroupIdAction}
                    resetGroup={resetGroup}
                    canEdit={showManipulation}
                    resetSeachValue={resetSearch}
                  />
                )}
              </View>
            )}
          </View>
          <View style={DrawerLeftContentStyles.divide} />
        </ScrollView>
        <Modal
          isVisible={openModalActivityGroup}
          onBackdropPress={handleCloseModalActivityGroup}
          style={DrawerLeftContentStyles.bottomView}
        >
          <GroupActivityModal onCloseModal={handleCloseModalActivityGroup} />
        </Modal>
        <Modal
          isVisible={openModalOtherActivity}
          onBackdropPress={handleCloseModalOtherActivity}
          style={DrawerLeftContentStyles.bottomView}
        >
          <OtherActivityModal onCloseModal={handleCloseModalOtherActivity} />
        </Modal>
        <Modal
          isVisible={openModalDelete}
          onBackdropPress={handleCloseModalDelete}
          style={DrawerLeftContentStyles.centerView}
        >
          <ModalDelete
            onCloseModal={handleCloseModalDelete}
            onAcceptDeleteGroup={handleDeleteGroup}
            disableDeleteButton={disableDeleteButton}
            title={format(translate(messagesComon.WAR_COM_0001), groupNameSelected)}
          />
          {/* <ModalDelete
            onCloseModal={handleCloseModalDelete}
            onAcceptDeleteGroup={() => { }}
            disableDeleteButton={disableDeleteButton}
            title={translate(messagesComon.WAR_EMP_0001)}
          /> */}
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
            title={groupNameSelected}
          />
        </Modal>
      </SafeAreaView>
    </View >
  );
};
