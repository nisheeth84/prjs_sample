import React, { useEffect, useState, useRef } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { IRootState } from 'app/shared/reducers';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants'
import { SHARE_GROUP_MODES, MY_GROUP_MODES, SHOW_MESSAGE_SUCCESS, EMPLOYEE_SPECIAL_LIST_FIELD, SELECT_TARGET_TYPE } from '../constants'
import EmployeeControlTop from '../control/employee-control-top';
import EmployeeControlSidebar from '../control/employee-control-sidebar';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import SwitchFieldPanel from '../../../shared/layout/dynamic-form/switch-display/switch-field-panel';
import PaginationList from 'app/shared/layout/paging/pagination-list';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import PopupEmployeeDetail from '../popup-detail/popup-employee-detail';
import { GroupModalAction } from '../group/employee-group-modal.reducer';
import useEventListener from 'app/shared/util/use-event-listener';
import CreateEditSchedule from 'app/modules/calendar/popups/create-edit-schedule';
import { convertSpecialFieldEmployee, getExtensionsEmployees, customFieldsInfo, renderSpecialItemNotEdit, specialDisplayMultiLine } from './special-render/special-render'

import {
  getCustomFieldsInfo,
  getEmployees,
  reset,
  resetMessageSuccess,
  handleInitEmployeeList,
  handleSearchEmployee,
  handleUpdateEmployee,
  changeScreenMode,
  EmployeeAction,
  handleFilterEmployeeByMenu,
  handleMoveToDepartment,
  handleGetInitializeListInfo,
  handleGetFieldInfoBelong,
  DataResponseOverflowMenu,
  handleGetEmployeeLayout,
  resetList,
  getSearchConditionInfoGroup,
  resetMsgError as resetMsgErrorEmployeeList,
  handleCheckInvalidLicense
} from './employee-list.reducer';
import {
  getFieldInfoPersonals
} from 'app/shared/layout/dynamic-form/list/dynamic-list.reducer';
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer';
import { handleMoveToGroup } from 'app/modules/employees/group/employee-group-modal.reducer.ts';
import { handleAddToGroup } from 'app/modules/employees/group/employee-group-modal.reducer.ts';
import { reset as resetGroup } from 'app/modules/employees/group/employee-group-modal.reducer.ts';
import { EmployeeAction as EmployeeActionCreateEdit } from '../create-edit/create-edit-employee.reducer'

import { resetSidebar, handleInitLocalMenu } from '../control/employee-control-sidebar.reducer';
import PopupFieldsSearch from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search'
import ModalCreateEditEmployee from '../create-edit/modal-create-edit-employee';
import { EMPLOYEE_DEF, SEARCH_MODE, MENU_TYPE, EMPLOYEE_VIEW_MODES, EMPLOYEE_ACTION_TYPES, EMPLOYEE_LIST_ID } from '../constants';
import InviteEmployee from '../inviteEmployees/modal-invite-employees';

import { ScreenMode, FIELD_BELONG, SCREEN_TYPES, TIMEOUT_TOAST_MESSAGE, AUTHORITIES, MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import StringUtils, { getColorImage } from 'app/shared/util/string-utils';
import _ from 'lodash';
import MoveToDepartmentPopup from '../control/popup/move-to-department-popup';
import { isNullOrUndefined } from 'util';
import EmployeeMoveToGroupModal from '../group/employee-move-to-group-modal'
import DepartmentRegistEdit from '../department/department-regist-edit';
import ManagerSetting from '../manager/manager-setting';
import EmployeeCreateGroupModal from '../group/employee-create-my-group-modal'
import { FieldInfoType, OVER_FLOW_MENU_TYPE, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import EmployeeAddToGroupModal from '../group/employee-add-to-group-modal'
import EmployeesMySharedListModal, { FSActionTypeScreen } from 'app/modules/employees/my-shared-list/employees-my-shared-list-modal';
import SpecailEditList from '../special-item/special-edit-list';
import { EDIT_SPECIAL_ITEM } from 'app/modules/employees/constants';
import OverFlowMenu from 'app/shared/layout/common/overflow-menu';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { customHeaderField, getPathTreeName } from './special-render/special-render';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import PopupMenuSet from '../../setting/menu-setting';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import Popover from 'app/shared/layout/common/Popover';
import { WindowActionMessage } from 'app/shared/layout/menu/constants';
import GlobalControlRight from 'app/modules/global/global-tool'
import HelpPopup from 'app/modules/help/help';
import { CATEGORIES_ID } from 'app/modules/help/constant';
import { isExceededCapacity } from 'app/shared/util/file-utils';
import { GROUP_TYPE } from 'app/shared/layout/dynamic-form/group/constants';
import { PopupWarningLicense } from '../components';
import { logout } from 'app/shared/reducers/authentication';
import DynamicDisplayConditionList from 'app/shared/layout/dynamic-form/list/dynamic-display-condition-list';
import employee from 'app/modules/setting/employee/employee';

export interface IEmployeeListProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
  screenMode: any;
  fieldInfos: any;
  customFieldInfos: any;
  employees: any;
  actionType: any;
  errorMessage: any;
  errorItems: any;
  checkboxFirstColumn: any;
  authorities;
}
export const ICON_FUNCION_CUSTOMERS = "ic-sidebar-employee.svg";

export const EmployeeList = (props: IEmployeeListProps) => {
  const [offset, setOffset] = useState(0);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [openInviteEmployees, setOpenInviteEmployees] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [groupId, setGroupId] = useState();
  const [isOwnerGroup, setIsOwnerGroup] = useState();
  const [isAutoShareGroup, setIsAutoShareGroup] = useState();
  const [groupMember, setGroupMember] = useState([]);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [openPopupDetailManager, setOpenPopupDetailManager] = useState(false);
  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const [textSearch, setTextSearch] = useState('');
  const [conditionSearch, setConditionSearch] = useState(null);
  const [filterConditions, setFilterConditions] = useState([]);
  const [orderBy, setOrderBy] = useState([]);
  const [searchMode, setSearchMode] = useState(SEARCH_MODE.NONE);
  const [isDirty, setIsDirty] = useState(false);
  const [saveEditValues, setSaveEditValues] = useState([]);
  const [, setTypeGroup] = useState(MENU_TYPE.MY_GROUP);
  const tableListRef = useRef(null);
  const [activeIcon, setActiveIcon] = useState(false);
  const [listMenuType, setListMenuType] = useState({
    isAllEmployees: true,
    isDepartment: false,
    isQuitJob: false,
    isMyGroup: false,
    isSharedGroup: false,
    isAutoGroup: false,
    isOwner: false
  });
  const [sidebarCurrentId, setSidebarCurrentId] = useState(null);
  const [showPopupMoveToDepartment, setShowPopupMoveToDepartment] = useState(false);
  const [sourceEmployee, setSourceEmployee] = useState([]);
  const [targetCard, setTargetCard] = useState(null);
  const [openMoveToGroupModal, setOpenMoveToGroupModal] = useState(false);
  const [openManagerSettingPopup, setOpenManagerSettingPopup] = useState(false);
  const [, setShowModal] = useState(true);
  const [openAddEditMyGroupModal, setOpenAddEditMyGroupModal] = useState(false);
  const [openEmployeeCreateMyGroup, setOpenEmployeeCreateMyGroup] = useState(false);
  const [myGroupModalMode, setMyGroupModalMode] = useState(null);
  const [openAddToGroupModal, setOpenAddToGroupModal] = useState(false);
  const [groupMode, setGroupMode] = useState(SHARE_GROUP_MODES.MODE_CREATE_GROUP);
  const [openModalEmployee, setOpenModalEmployee] = useState(false);
  const [employeeActionType, setEmployeeActionType] = useState(EMPLOYEE_ACTION_TYPES.CREATE);
  const [employeeViewMode, setEmployeeViewMode] = useState(EMPLOYEE_VIEW_MODES.EDITABLE);
  const [employeeId, setEmployeeId] = useState(null);
  const [groupName, setGroupName] = useState(null);
  const [targetType, setTargetType] = useState(SELECT_TARGET_TYPE.ALL_EMPLOYEE);
  const [targetId, setTargetId] = useState(0);
  const { employees, errorItems, screenMoveInfo } = props;

  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);
  const { fieldInfos, customFieldInfos } = props;
  const [openDepartmentPopup, setOpenDepartmentPopup] = useState(false);
  const [departmentIdSelected, setDepartmentIdSelected] = useState(0);
  const [isRegistDepartment, setIsRegistDepartment] = useState(true);
  const [employeeIdDetail, setEmployeeIdDetail] = useState(null);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const [employeeSuccessMessage, setEmployeeSuccessMessage] = useState(null);
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  const [fileUploads, setFileUploads] = useState({});
  const [selectedTargetType, setSelectedTargetType] = useState(0);
  const [selectedTargetId, setSelectTargetId] = useState(0);
  const [msgSuccess, setMsgSuccess] = useState(SHOW_MESSAGE_SUCCESS.NONE);
  const [openOverFlow, setOpenOverFlow] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openCreateCalendar, setOpenCreateCalendar] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [dataModalTask,] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE });
  const [heightPosition, setHeightPosition] = useState(1);
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);
  const [msgErrorBox, setMsgErrorBox] = useState(null);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]); // check user is admin or not
  const [recordCheckList, setRecordCheckList] = useState([]);
  const [targetDepartment, setTargetDepartment] = useState(null);
  const [infoSearchConditionGroup, setInfoSearchConditionGroup] = useState([]);
  const [prevEmployeeIds, setPrevEmployeeIds] = useState([]);
  const [isOpenEmployeeDetailNotFromList, setIsOpenEmployeeDetailNotFromList] = useState(false);
  const employeeEditCtrlId = useId(1, "listEmployeeEditCtrlId_");
  const employeeDetailCtrlId = useId(1, "listEmployeeDetail_");
  const [isUpdateListView, setIsUpdateListView] = useState(false);
  const [isNewEmployee, setIsNewEmployee] = useState(false);
  const [isUpdateList, setIsUpdateList] = useState(false);

  const defaultCustomerMyListData = {
    listMode: SHARE_GROUP_MODES.MODE_CREATE_GROUP,
    listId: null,
    isAutoList: false,
    listMembers: null
  }
  // const [openCustomerMyList, setOpenCustomerMyList] = useState(false);
  const [employeesMyListData, setEmployeesMyListData] = useState(defaultCustomerMyListData);

  const defaultEmployeesSharedListData = {
    listMode: SHARE_GROUP_MODES.MODE_CREATE_GROUP,
    listId: null,
    isOwnerList: false,
    isAutoList: false,
    listMembers: null
  }
  const [EmployeesSharedListData, setEmployeesSharedListData] = useState(defaultEmployeesSharedListData);


  let employeeList = [];
  if (employees && employees.employees) {
    employeeList = employees.employees;
  }
  let fields = [];
  if (fieldInfos && fieldInfos.fieldInfoPersonals) {
    fields = fieldInfos.fieldInfoPersonals;
  }
  let customFields = [];
  if (customFieldInfos && customFieldInfos.customFieldsInfo) {
    customFields = customFieldInfos.customFieldsInfo;
  }

  let employeeLayout = [];
  if (props.employeeLayout) {
    employeeLayout = props.employeeLayout;
  }

  useEffect(() => {
    if (props.infoSearchConditionGroup) {
      setInfoSearchConditionGroup(props.infoSearchConditionGroup)
    }
  }, [props.infoSearchConditionGroup])

  useEffect(() => {
    props.handleCheckInvalidLicense()
  }, [])

  useEffect(() => {
    document.body.className = "wrap-employee";
    props.changeScreenMode(false);
    props.handleInitEmployeeList(offset, limit);
    props.handleGetEmployeeLayout(EMPLOYEE_DEF.EXTENSION_BELONG_LIST);
    props.handleGetInitializeListInfo(FIELD_BELONG.EMPLOYEE);
    setIsUpdateList(false);
    setIsNewEmployee(false);
    return () => {
      document.body.className = "";
      props.reset();
    }
  }, []);

  useEffect(() => {
    // open details employees from other screen
    const { state } = props.location;
    if (state && state.openDetail && state.recordId) {
      setOpenPopupEmployeeDetail(true);
      setEmployeeIdDetail(state.recordId);
      const stateCopy = { ...state };
      delete stateCopy.openDetail;
      delete stateCopy.recordId;
      props.history.replace({ state: stateCopy });
    }
  }, [props.location]);


  useEffect(() => {
    if(props.searchConditionsParam && (listMenuType.isMyGroup || listMenuType.isSharedGroup)) {
      setInfoSearchConditionGroup(props.searchConditionsParam);
    }
  }, [props.searchConditionsParam])

  const reloadScreen = (isReloadNow?) => {
    let conditions = null;
    if (isReloadNow) {
      conditions = null;
    } else if (conditionSearch && conditionSearch.length > 0) {
      conditions = conditionSearch;
    } else {
      conditions = textSearch;
    }
    props.resetList();
    props.handleSearchEmployee(offset, limit, conditions, filterConditions, selectedTargetType, selectedTargetId, false, orderBy);
    props.getFieldInfoPersonals(EMPLOYEE_LIST_ID, FIELD_BELONG.EMPLOYEE, 1, FieldInfoType.Personal, selectedTargetType, selectedTargetId);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
    tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
    setIsUpdateList(false);
    setIsNewEmployee(false);
  }

  const updateDataList = (isReloadNow?) => {
    let conditions = null;
    if (isReloadNow) {
      conditions = null;
    } else if (conditionSearch && conditionSearch.length > 0) {
      conditions = conditionSearch;
    } else {
      conditions = textSearch;
    }
    props.handleSearchEmployee(offset, limit, conditions, filterConditions, selectedTargetType, selectedTargetId, false, orderBy);
    setIsUpdateList(false);
    setIsNewEmployee(false);
  }

  /**
   * After deleting group/department, show all employees
   */
  useEffect(() => {
    let actionCreateEdit;
    if (props.modalActionCreatEmployee.has(employeeEditCtrlId[0])) {
      actionCreateEdit = props.modalActionCreatEmployee.get(employeeEditCtrlId[0]).action;
    }

    if (actionCreateEdit === EmployeeActionCreateEdit.CreateEmployeeSuccess ||
      actionCreateEdit === EmployeeActionCreateEdit.UpdateEmployeeSuccess ||
      props.updatedAutoGroupId ||
      props.msgSuccessList && props.msgSuccessList.successId !== SHOW_MESSAGE_SUCCESS.NONE
    ) {
      props.resetGroup();
      reloadScreen();
    }
    if (props.modalActionGroup === GroupModalAction.Success) {
      props.handleInitLocalMenu();
    }
  }, [props.modalActionGroup, props.removeManagerEmployeesId,
  props.modalActionCreatEmployee, props.updatedAutoGroupId]);

  /**
   * Set menu type to all employees
   */
  useEffect(() => {
    if (props.deletedDepartmentId !== null || props.deletedGroupId !== null) {
      setListMenuType({
        isAllEmployees: true,
        isDepartment: false,
        isQuitJob: false,
        isMyGroup: false,
        isSharedGroup: false,
        isAutoGroup: false,
        isOwner: false
      })
      props.handleInitEmployeeList(offset, limit);
    }
  }, [props.deletedGroupId, props.deletedDepartmentId]);


  const isEqualTextValue = (newValue, oldValue) => {
    let copyNewValue = _.cloneDeep(newValue);
    let copyOldValue = _.cloneDeep(oldValue);
    if (_.isNil(copyNewValue) || copyNewValue.length === 0) {
      copyNewValue = "";
    }
    if (_.isNil(copyOldValue)) {
      copyOldValue = "";
    }
    if (_.isEqual(copyNewValue.toString(), copyOldValue.toString())) {
      return true;
    }
    return false;
  }

  const compareEmployeeIcon = (newValue, oldValue) => {
    // TODO:
    // if ((_.isNil(newValue) || (isNilOrIsEmpty(newValue.fileName) && isNilOrIsEmpty(newValue.filePath)))
    // && (_.isNil(oldValue) || (isNilOrIsEmpty(oldValue.fileName) && isNilOrIsEmpty(oldValue.filePath)))) {
    //   return false;
    // }
    // return (!isEqualTextValue(newValue.fileName, oldValue.fileName) || !isEqualTextValue(newValue.filePath, oldValue.filePath));
    return false;
  }

  const compareFieldItem = (recordIdx, fieldName, newValue) => {
    let oldValue = employeeList[recordIdx][fieldName];
    switch (fieldName) {
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeName:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeNameKana:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurname:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurnameKana:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeCellphoneNumber:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeTelephoneNumber:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeEmail:
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeUserId:
        return (!isEqualTextValue(newValue, oldValue));
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeIcon:
        return compareEmployeeIcon(newValue, oldValue);
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments:
        if (newValue.length !== oldValue.length) {
          return true;
        } else if (newValue.length !== 0) {
          for (let index = 0; index < newValue.length; index++) {
            if (!isEqualTextValue(newValue[index], oldValue[index].departmentId)) {
              return true;
            }
          }
        }
        return false;
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions:
        oldValue = employeeList[recordIdx][EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments];
        if (newValue.length !== oldValue.length) {
          return true;
        } else if (newValue.length !== 0) {
          for (let index = 0; index < newValue.length; index++) {
            if (!isEqualTextValue(newValue[index], oldValue[index].positionId)) {
              return true;
            }
          }
        }
        return false;
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager:
        oldValue = employeeList[recordIdx][EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments];
        if (newValue.length !== oldValue.length) {
          return true;
        } else if (newValue.length !== 0) {
          for (let index = 0; index < newValue.length; index++) {
            if (!isEqualTextValue(newValue[index], oldValue[index].employeeId)) {
              return true;
            }
          }
        }
        return false;
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage:

        oldValue = employeeList[recordIdx].language ? employeeList[recordIdx].language.languageId : '';
        return (!isEqualTextValue(newValue, oldValue.toString()));
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeTimeZone:
        oldValue = employeeList[recordIdx].timezone.timezoneId;
        return (!isEqualTextValue(newValue, oldValue.toString()));
      case EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates:
        // TODO:
        return false;
      default:
        // Other fields
        if (!isEqualTextValue(newValue, oldValue)) {
          return true;
        }
        return false;
    }
  }

  /**
   * Reload screen when completely move employees to another department
   */
  useEffect(() => {
    if (props.idsMovedError?.length === 0 && props.idsMovedSuccess?.length > 0) {
      props.handleSearchEmployee(offset, limit, conditionSearch,filterConditions, selectedTargetType, selectedTargetId, isUpdateListView, orderBy);
    }
  }, [props.idsMovedError, props.idsMovedSuccess]);

  useEffect(() => {
    if ((props.employeeDetailData.has(employeeDetailCtrlId[0]) && props.employeeDetailData.get(employeeDetailCtrlId[0]).messageChangeStatusSuccess !== null)
      || props.msgInvite) {
      props.handleFilterEmployeeByMenu(offset, limit, conditionSearch, selectedTargetType, selectedTargetId, false, [], []);
    }
  }, [props.employeeDetailData, props.msgInvite]);

  const isChangeInputEdit = () => {
    if (props.screenMode === ScreenMode.DISPLAY || saveEditValues.length <= 0 || employeeList.length <= 0 || fields.length <= 0) {
      return false;
    }
    const groupEmployee = saveEditValues.reduce(function (h, obj) {
      h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
      return h;
    }, {});
    for (const emp in groupEmployee) {
      if (!Object.prototype.hasOwnProperty.call(groupEmployee, emp)) {
        continue;
      }
      const recordIdx = employeeList.findIndex(e => e['employee_id'].toString() === emp.toString());
      if (recordIdx < 0) {
        return true;
      }
      for (let i = 0; i < groupEmployee[emp].length; i++) {
        const fieldIdx = fields.findIndex(e => e.fieldId.toString() === groupEmployee[emp][i].fieldId.toString());
        if (fieldIdx < 0) {
          continue;
        }
        const fieldName = fields[fieldIdx].fieldName;
        const newValue = groupEmployee[emp][i].itemValue;
        const hasChange = compareFieldItem(recordIdx, fieldName, newValue);
        if (hasChange) {
          return true;
        }
      }
    }
    return false;
  }

  const onSelectSwitchDisplayField = (srcField, isSelected) => {
    tableListRef.current.handleChooseField(srcField, isSelected);
  }

  const onDragField = (fieldSrc, fieldTargetId) => {
    tableListRef.current.handleDragField(fieldSrc, fieldTargetId);
  }

  const onUpdateFieldValue = (itemData, type, itemEditValue, idx) => {
    if (type.toString() === DEFINE_FIELD_TYPE.RELATION) {
      return;
    }
    let itemEditValueCopy = _.cloneDeep(itemEditValue);
    const index = saveEditValues.findIndex(e => _.toString(e.itemId) === _.toString(itemData.itemId) && _.toString(e.fieldId) === _.toString(itemData.fieldId));
    const fieldInfo = props.fieldInfos && props.fieldInfos.fieldInfoPersonals && props.fieldInfos.fieldInfoPersonals.filter(field => field.fieldId.toString() === itemData.fieldId.toString());
    if (fieldInfo && fieldInfo.length > 0 && fieldInfo[0].fieldName === "employee_icon") {
      if (itemEditValueCopy && Array.isArray(itemEditValueCopy)) {
        itemEditValueCopy.forEach(e => {
          if (!_.isNil(e)) {
            delete e["fileUrl"];
            delete e["file_url"];
          }
        });
      }
      itemEditValueCopy = JSON.stringify(itemEditValue);
    }
    if (idx) {
      if (index < 0) {
        saveEditValues.push({ itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: [itemEditValueCopy] });
      } else {
        saveEditValues.forEach((item) => {
          if (item.fieldId === itemData.fieldId && item.itemId === itemData.itemId) {
            if (item.itemValue === '') {
              item.itemValue = [itemEditValueCopy];
            } else {
              item.itemValue[idx - 1] = itemEditValueCopy;
            }
          }
        })
      }
    } else {
      if (index < 0) {
        saveEditValues.push({ itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValueCopy });
      } else {
        saveEditValues[index] = { itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValueCopy };
      }
    }
    setIsDirty(isChangeInputEdit());
  }

  const onLeaveDirtyCheck = (action) => {
    props.resetMsgErrorEmployeeList();
    props.resetSidebar();
    action();
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void, patternType?: number) => {
    if (props.screenMode === ScreenMode.DISPLAY) {
      onLeaveDirtyCheck(action);
    } else {
      // const isChange = isChangeInputEdit();
      // const partternType = DIRTYCHECK_PARTTERN.PARTTERN2; // DUMMY type
      const partternType = patternType || DIRTYCHECK_PARTTERN.PARTTERN1;
      if (isDirty) {
        await DialogDirtyCheck({ onLeave: () => onLeaveDirtyCheck(action), onStay: cancel, partternType });
      } else {
        onLeaveDirtyCheck(action);
      }
    }
  }

  const onPageChange = (offsetRecord, limitRecord) => {
    executeDirtyCheck(() => {
      setOffset(offsetRecord);
      setLimit(limitRecord);
      setSaveEditValues([]);
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      if (searchMode === SEARCH_MODE.TEXT_DEFAULT) {
        props.handleSearchEmployee(offsetRecord, limitRecord, textSearch);
      } else if (searchMode === SEARCH_MODE.CONDITION) {
        props.handleSearchEmployee(offsetRecord, limitRecord, conditionSearch);
      } else {
        props.handleSearchEmployee(offsetRecord, limitRecord, conditionSearch, filterConditions, selectedTargetType, selectedTargetId, false, orderBy);
      }
    });
  }

  const onShowSwitchDisplay = () => {
    if (!showSwitcher) {
      executeDirtyCheck(() => {
        props.getCustomFieldsInfo(EMPLOYEE_DEF.EXTENSION_BELONG_LIST);
        setShowSwitcher(true);
        setSaveEditValues([]);
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
      });
    }
  }

  const enterSearchText = (text) => {
    executeDirtyCheck(() => {
      setSelectedTargetType(0);
      setTextSearch(text);
      setOffset(0);
      setConditionSearch([]);
      setFilterConditions([]);
      setSearchMode(SEARCH_MODE.TEXT_DEFAULT);
      setSaveEditValues([]);
      setListMenuType({
        isAllEmployees: true,
        isDepartment: false,
        isQuitJob: false,
        isMyGroup: false,
        isSharedGroup: false,
        isAutoGroup: false,
        isOwner: false
      });
      tableListRef.current.resetState();
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      props.handleSearchEmployee(0, limit, text);
    }, () => {
      setTextSearch("");
    });
  }

  const handleSearchPopup = (condition) => {
    setOpenPopupSearch(false);
    setConditionSearch(condition);
    setFilterConditions([]);
    setOrderBy([]);
    setOffset(0);
    setSelectedTargetType(0);
    setSearchMode(SEARCH_MODE.CONDITION);
    setSaveEditValues([]);
    setListMenuType({
      isAllEmployees: true,
      isDepartment: false,
      isQuitJob: false,
      isMyGroup: false,
      isSharedGroup: false,
      isAutoGroup: false,
      isOwner: false
    });
    tableListRef.current.resetState();
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    props.handleSearchEmployee(0, limit, condition);
  }

  const onActionFilterOrder = (filter: [], order: []) => {
    executeDirtyCheck(() => {
      setOffset(0);
      setFilterConditions(filter);
      setOrderBy(order);
      setSaveEditValues([]);
      let updateListView = false;
      if (selectedTargetType === MENU_TYPE.MY_GROUP || selectedTargetType === MENU_TYPE.SHARED_GROUP) {
        updateListView = true;
        setIsUpdateListView(true);
      }
      if (props.screenMode === ScreenMode.EDIT) {
        props.changeScreenMode(false);
      }
      if (searchMode === SEARCH_MODE.CONDITION) {
        props.handleSearchEmployee(0, limit, conditionSearch, filter, selectedTargetType, selectedTargetId, updateListView, order);
      } else {
        props.handleSearchEmployee(0, limit, textSearch, filter, selectedTargetType, selectedTargetId, updateListView, order);
      }
    })
  }

  const getfileUploads = () => {
    const fUploads = [];
    const keyFiles = Object.keys(fileUploads);
    keyFiles.forEach(key => {
      const arrFile = fileUploads[key];
      arrFile.forEach(file => {
        fUploads.push(file);
      });
    });
    return fUploads;
  }

  const handleUpdateEmployees = () => {
    setMsgErrorBox('');
    let conditions = null;
    if (searchMode === SEARCH_MODE.TEXT_DEFAULT) {
      conditions = textSearch;
    } else if (searchMode === SEARCH_MODE.CONDITION) {
      conditions = conditionSearch;
    } else {
      conditions = "";
    }
    const files = getfileUploads();
    if (isExceededCapacity(files)) {
      setMsgErrorBox(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    }
    props.handleUpdateEmployee(EMPLOYEE_LIST_ID, saveEditValues, offset, limit, conditions, filterConditions, selectedTargetType, selectedTargetId, true, orderBy, getfileUploads());
  }



  const onOpenPopupSearch = () => {
    if (!openPopupSearch) {
      executeDirtyCheck(() => {
        if (props.screenMode === ScreenMode.EDIT) {
          props.changeScreenMode(false);
        }
        setOpenPopupSearch(true);
        setTextSearch("");
        setMsgErrorBox('');
      });
    }
  }
  const onOpenPopupEmployeeDetail = (paramId, fieldId) => {
    if (!openPopupEmployeeDetail && fieldId !== null && props.screenMode === ScreenMode.DISPLAY) {
      executeDirtyCheck(() => {
        setOpenPopupEmployeeDetail(!openPopupEmployeeDetail);
        setEmployeeIdDetail(paramId);
        setMsgErrorBox('');
      });
    }
  }

  const onOpenDetailManager = (paramId) => {
    executeDirtyCheck(() => {
      setOpenPopupEmployeeDetail(!openPopupEmployeeDetail);
      setOpenPopupDetailManager(true);
      setEmployeeIdDetail(paramId);
      setMsgErrorBox('');
    });
  }

  const changeEditMode = (isEdit: boolean) => {
    if (!isEdit) {
      executeDirtyCheck(() => {
        setMsgErrorBox('');
        setSaveEditValues([]);
        setShowSwitcher(false);
        setIsDirty(true);
        props.changeScreenMode(isEdit)
      }, null, DIRTYCHECK_PARTTERN.PARTTERN2);
    } else {
      if (!employeeList || employeeList.length < 1) {
        return;
      }
      setSaveEditValues([]);
      setShowSwitcher(false);
      props.changeScreenMode(isEdit)
    }
  }

  /**
   * sidebarCurrentId changes, reset all the error messages
   */
  useEffect(() => {
    props.changeScreenMode(false);
    if (sidebarCurrentId) {
      props.getSearchConditionInfoGroup(sidebarCurrentId);
    }
    return () => {
      props.resetSidebar();
    }
  }, [sidebarCurrentId]);

  const onOpenDepartmentPopup = (isRegist) => {
    setIsRegistDepartment(isRegist);
    if (!openDepartmentPopup) {
      executeDirtyCheck(() => {
        setShowModal(true);
        setOpenDepartmentPopup(true);
        setMsgErrorBox('')
      });
    }
  }

  const onOpenDepartmentPopupLocalMenu = (departmentSelected) => {
    setIsRegistDepartment(false);
    setDepartmentIdSelected(departmentSelected);
    if (!openDepartmentPopup) {
      setShowModal(true);
      setOpenDepartmentPopup(true);
      setMsgErrorBox('')
    }
  }

  const closeDepartmentPopup = (isSearch) => {
    if (isSearch) {
      props.handleInitLocalMenu();
    }
    setOpenDepartmentPopup(false);
  }

  const onOpenInviteEmployees = () => {
    if (!openInviteEmployees) {
      executeDirtyCheck(() => {
        setOpenInviteEmployees(true);
        setMsgErrorBox('');
      });
    }
  }

  const onCloseInviteEmployees = () => {
    setOpenInviteEmployees(false);
  }

  const onOpenAddEditMyGroupModal = (modalMode, isAutoGroupParam) => {
    setListMenuType({
      ...listMenuType,
      isAutoGroup: isAutoGroupParam
    })
    setMyGroupModalMode(modalMode);
    if (!openAddEditMyGroupModal) {
      setOpenAddEditMyGroupModal(true);
      setMsgErrorBox('');
    }
  };

  const handleOpenEmployeesMyListModal = (
    listMode,
    listId,
    isAutoList,
    listMembers
  ) => {
    if (!openAddEditMyGroupModal) {
      setMsgErrorBox('');
      setEmployeesMyListData({
        listMode,
        listId,
        isAutoList,
        listMembers
      });
      setOpenAddEditMyGroupModal(true);
    }
  };

  const onClosePopupSearch = (saveCondition) => {
    setOpenPopupSearch(false);
    setConditionSearch(saveCondition);
  }

  const onOpenMoveToGroupModal = () => {
    if (!openMoveToGroupModal) {
      setMsgErrorBox('')
      setOpenMoveToGroupModal(true);
    }
  };



  const onCloseMoveToGroupModal = (isMoveSuccess: boolean) => {
    setOpenMoveToGroupModal(false);
  }
  const onSetTypeGroup = (type) => {
    setTypeGroup(type);
  }

  const changeSelectedSidebar = (obj) => {
    setMsgErrorBox('');
    setTargetType(obj.type);
    setTargetId(obj.cardId);
    tableListRef.current.changeTargetSidebar(obj.type, obj.cardId);
    // reset state
    setConditionSearch([]);
    setOffset(0);
    setLimit(RECORD_PER_PAGE_OPTIONS[1]);
    // if(employeeControlTopRef && employeeControlTopRef.current){
    //   setConDisplaySearchDetail(false);
    // }
    setConDisplaySearchDetail(false);
    if (obj.type !== MENU_TYPE.DEPARTMENT) {
      setTargetDepartment(null);
    }
  }

  const onOpenModalEmployee = (emplActionType, emplViewMode, emplId = null) => {
    if (!openModalEmployee) {
      executeDirtyCheck(() => {
        setMsgErrorBox('');
        setOpenModalEmployee(true);
        setEmployeeActionType(emplActionType);
        setEmployeeViewMode(emplViewMode);
        setEmployeeId(emplId);
      });
    }
  }

  const goToEmployeeDetail = (param, isUpdated = false) => {
    // alert(param.message);
    setEmployeeSuccessMessage(param.message);
    setEmployeeIdDetail(param.employeeId);
    setOpenPopupEmployeeDetail(true);
    setIsUpdateList(isUpdated);
    setIsNewEmployee(isUpdated);
  }

  useEffect(() => {
    if (screenMoveInfo.screenType === SCREEN_TYPES.DETAIL) {
      goToEmployeeDetail({ employeeId: screenMoveInfo.objectId });
      props.moveScreenReset();
    } else if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.SEARCH) && !openPopupEmployeeDetail && !openModalEmployee) {
      onOpenPopupSearch();
      props.moveScreenReset();
    } else if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.ADD) && !openPopupEmployeeDetail && !openModalEmployee) {
      onOpenModalEmployee(EMPLOYEE_ACTION_TYPES.CREATE, EMPLOYEE_VIEW_MODES.EDITABLE);
      props.moveScreenReset();
    }
  }, [screenMoveInfo])

  const onCloseModalEmployee = (param) => {
    setOpenModalEmployee(false);
    if (param) {
      goToEmployeeDetail(param, true);
    }
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.SEARCH) {
      onOpenPopupSearch();
    }
  }

  const onOpenManagerSettingPopup = () => {
    if (!openManagerSettingPopup) {
      setMsgErrorBox('')
      setOpenManagerSettingPopup(true);
      setShowModal(true);
    }
  }

  const closeManagerSettingPopup = (isSearch) => {
    if (isSearch) {
      onPageChange(offset, limit);
      props.handleInitLocalMenu();
    }
    setOpenManagerSettingPopup(false);
  }

  const onClosePopupEmployeeDetail = (isBack?, isUpdated?) => {
    setOpenPopupEmployeeDetail(false);
    setOpenPopupDetailManager(false);
    const prevEmployeeIdsTmp = _.cloneDeep(prevEmployeeIds);
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.ADD) {
      onOpenModalEmployee(EMPLOYEE_ACTION_TYPES.CREATE, EMPLOYEE_VIEW_MODES.EDITABLE);
      // props.moveScreenReset();
    }
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.SEARCH) {
      onOpenPopupSearch();
    }
    if (prevEmployeeIdsTmp.length > 0) {
      setEmployeeIdDetail(_.last(prevEmployeeIdsTmp));
      const prev = _.dropRight(prevEmployeeIdsTmp);
      setPrevEmployeeIds(prev);
      setOpenPopupEmployeeDetail(true);
    }
    if (prevEmployeeIdsTmp.length === 0 && isOpenEmployeeDetailNotFromList) {
      setIsOpenEmployeeDetailNotFromList(false)
    }
    if (isUpdateList || isUpdated) {
      updateDataList();
    }
  }

  const onCloseAddEditMyGroupModal = (isSubmitSucess: boolean) => {
    setOpenAddEditMyGroupModal(false);
    setMyGroupModalMode(null);
  };

  useEffect(() => {
    tableListRef && tableListRef.current && tableListRef.current.updateSizeDynamicList();
  }, [showSwitcher])

  const OnOpenCreateMyGroup = () => {
    setOpenEmployeeCreateMyGroup(true)
    setMsgErrorBox('')
  }

  const onCloseEmployeeCreateMyGroup = (isCreateSuccess: boolean) => {
    setOpenEmployeeCreateMyGroup(false)
    if (isCreateSuccess) {
      props.handleInitLocalMenu();
      props.getSearchConditionInfoGroup(sidebarCurrentId);
    }
  }

  // const onCloseGroupModal = (isSubmitSucess: boolean) => {
  //   setOpenGroupModal(false);
  //   setEmployeesSharedListData(defaultEmployeesSharedListData);
  //   if (isSubmitSucess) {
  //     props.handleInitLocalMenu();
  //   }
  // }

  const onOpenGroupModal = (grpMode, groupIdIn, isOwnerGroupIn, isAutoGroupIn, groupMemberIn) => {
    if (!openGroupModal) {
      setGroupMode(grpMode);
      setGroupId(groupIdIn);
      setIsAutoShareGroup(isAutoGroupIn);
      setIsOwnerGroup(isOwnerGroupIn);
      setGroupMember(groupMemberIn);
      setOpenGroupModal(true);
    }
  }

  const handleOpenEmployeeSharedListModal = (
    listMode,
    listId,
    isOwnerList,
    isAutoList,
    listMembers
  ) => {
    if (!openGroupModal) {
      setMsgErrorBox('');
      setEmployeesSharedListData({
        listMode,
        listId,
        isOwnerList,
        isAutoList,
        listMembers
      })
      setOpenGroupModal(true);
    }
  }
  const handleCloseCustomerSharedListModal = (isSubmitSucess: boolean) => {
    setOpenGroupModal(false);
    setOpenAddEditMyGroupModal(false);
    setEmployeesSharedListData(defaultEmployeesSharedListData);
    if (isSubmitSucess) {
      props.handleInitLocalMenu();
      props.getSearchConditionInfoGroup(sidebarCurrentId);
    }
  }

  const onReceiveMessage = (ev) => {
    if (ev && ev.data && ev.data.type === FSActionTypeScreen.CreatUpdateSuccess) {
      handleCloseCustomerSharedListModal(true);
    }
    if ((StringUtils.tryGetAttribute(ev, "data.type") === FSActionTypeScreen.CloseWindow && StringUtils.tryGetAttribute(ev, "data.screen") === 'employeeDetail')
      || StringUtils.tryGetAttribute(ev, "data.type") === WindowActionMessage.ReloadList) {
      reloadScreen();
    }
  }

  useEventListener('message', onReceiveMessage);

  const parseValidateError = () => {
    let msgError = [];
    let firstErrorRowIndex = null;
    let firstErrorItem = null;
    let firstErrorEmployees = null
    if (!errorItems || !Array.isArray(errorItems) || errorItems.length <= 0 || employeeList.length <= 0) {
      msgError = [];

    } else {
      let count = 0;

      const lstError = _.cloneDeep(props.errorItems);
      for (let i = 0; i < errorItems.length; i++) {
        if (!errorItems[i]) {
          continue;
        }
        const rowIndex = employeeList.findIndex(e => e['employee_id'].toString() === errorItems[i].rowId.toString());
        const field = props.employeeLayout.find(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === StringUtils.snakeCaseToCamelCase(errorItems[i].item));
        const fieldOrder = field ? field.fieldOrder : null
        lstError[i]['rowIndex'] = rowIndex;
        lstError[i]['order'] = fieldOrder;
        const fieldIndex = fields.findIndex(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === errorItems[i].item || e.fieldName === errorItems[i].item);
        if (rowIndex < 0 || fieldIndex < 0) {
          continue;
        }
        count++;
      }
      let msg = translate('messages.ERR_COM_0052', { count });
      if (props.errorItems && props.errorItems[0] && props.errorItems[0].errorCode && props.errorItems[0].errorCode === 'ERR_COM_0050') {
        msg = translate('messages.ERR_COM_0050');
      }
      if (count > 0 && msg) {
        msgError.push({ msg });
      }
      if (lstError.length > 0) {
        const lstErrorSortByOrder = lstError.sort(function (a, b) {
          return a.rowIndex - b.rowIndex || a.order - b.order;
        });
        if (lstErrorSortByOrder[0]) {
          firstErrorRowIndex = lstErrorSortByOrder[0].rowIndex;
          firstErrorItem = lstErrorSortByOrder[0].item;
          firstErrorEmployees = lstErrorSortByOrder[0].rowId;
        }

      }
    }
    return { msgError, firstErrorRowIndex, firstErrorItem, firstErrorEmployees };
  }

  /**
   * Find first item focus in edit mode of list
   * If the item is textbox (field type = 9) or text area (field type = 10) or number (field type = 5) or email (field type = 15) or cellphone (field type = 13)
   * then focus it.
   */
  const findFirstFocusEdit = () => {
    let firstEmployeeShowInList = null;
    let firstItemFocus = null;
    // eslint-disable-next-line no-prototype-builtins
    if (props.employees && props.employees.hasOwnProperty("employees")) {
      firstEmployeeShowInList = props.employees.employees.length > 0 ? props.employees.employees[0]['employee_id'] : null;
    }
    if (props.employeeLayout) {
      const lstFieldAfterSortByFieldOrder = props.employeeLayout.sort(StringUtils.compareValues('fieldOrder'));

      for (let i = 0; i < lstFieldAfterSortByFieldOrder.length; i++) {
        if (lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.TEXT ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.PHONE_NUMBER ||
          lstFieldAfterSortByFieldOrder[i].fieldType.toString() === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
          firstItemFocus = lstFieldAfterSortByFieldOrder[i].fieldName;
          break;
        }
      }
    }
    return { firstEmployeeShowInList, firstItemFocus }
  }

  const getSelectedRecord = (recordCheck) => {
    setRecordCheckList(recordCheck);
  }

  const validateMsg = parseValidateError().msgError;
  // Find first error item
  const firstErrorItemError = parseValidateError().firstErrorItem;
  // Find first employee error
  const firstEmployeesError = parseValidateError().firstErrorEmployees;
  // Find first employee ficus when edit list
  const firstEmployeeShowInListFocus = findFirstFocusEdit().firstEmployeeShowInList;
  // Find first item ficus when edit list
  const firstItemInEditListFocus = findFirstFocusEdit().firstItemFocus;
  /**
   * Filter employees by local menu
   * @param filter
   * @param selectedTargetTypeProp
   * @param listViewConditions
   */
  const updateFiltersLocalMenu = (filter, selectedTargetTypeProp, listViewConditions) => {
    const department = filter.find(obj => obj.key === 'department_id');
    setInfoSearchConditionGroup([]);
    setConditionSearch([]);
    setTextSearch("");
    // tableListRef.current.resetState();
    if (department) {
      setDepartmentIdSelected(department.value);
    }
    let arrOrderby = [];
    if (listViewConditions.orderBy) {
      arrOrderby = listViewConditions.orderBy
    }
    let defaultFilterConditions = [];
    let filters = [];
    if (listViewConditions && listViewConditions.filterConditions) {
      defaultFilterConditions = listViewConditions.filterConditions;
      filters = _.cloneDeep(defaultFilterConditions);
      defaultFilterConditions.forEach((e, idx) => {
        if (!isNullOrUndefined(e.fieldType)) {
          e.fieldType = parseInt(e.fieldType, 10);
          filters[idx].fieldType = parseInt(e.fieldType, 10);
          const fieldMap = props.fields.find(elm => elm.fieldId === e.fieldId);
          filters[idx].fieldLabel = fieldMap.fieldLabel;
        }
        if (_.isEmpty(e.fieldValue)) {
          e['isSearchBlank'] = true;
          filters[idx]['isSearchBlank'] = true;
        }
        delete e.searchValue;
      });
    }
    if (defaultFilterConditions) {
      setFilterConditions(filters);
    } else {
      setFilterConditions([]);
    }

    setConditionSearch([]);
    setTextSearch('');
    setOffset(0);
    if (textSearch) {
      setSearchMode(SEARCH_MODE.TEXT_DEFAULT);
    }
    setSelectedTargetType(selectedTargetTypeProp);
    setSelectTargetId(filter[0].value);

    props.handleFilterEmployeeByMenu(offset, limit, [], selectedTargetTypeProp, filter[0].value, false, defaultFilterConditions, arrOrderby);
    if (arrOrderby.length > 0 || defaultFilterConditions.length > 0) {
      tableListRef.current.setFilterListView(arrOrderby, defaultFilterConditions, props.fields);
    } else {
      tableListRef.current && tableListRef.current.resetState();
    }
  }

  /**
   * Update menu type when clicking on sidebar records
   * @param iconType
   * @param isAutoGroup
   * @param isOwner
   */
  const updateListMenuType = (iconType: number, isAutoGroup, isOwner) => {
    const tmp = {
      isAllEmployees: false,
      isDepartment: false,
      isQuitJob: false,
      isMyGroup: false,
      isSharedGroup: false,
      isAutoGroup: false,
      isOwner: false
    };
    switch (iconType) {
      case MENU_TYPE.DEPARTMENT:
        setListMenuType({ ...tmp, isDepartment: true });
        break;
      case MENU_TYPE.QUIT_JOB:
        setListMenuType({ ...tmp, isQuitJob: true });
        break;
      case MENU_TYPE.MY_GROUP:
        setListMenuType({ ...tmp, isMyGroup: true, isAutoGroup });
        break;
      case MENU_TYPE.SHARED_GROUP:
        setListMenuType({ ...tmp, isSharedGroup: true, isAutoGroup, isOwner });
        break;
      default:
        setListMenuType({ ...tmp, isAllEmployees: true });
        break;
    }
  }

  const actionSetSidebarId = (sidebarId: number) => {
    setSidebarCurrentId(sidebarId);
  }

  const dragEmployeesToGroup = (targetCategory, sourceRow) => {
    const listEmployeeDrag = [];
    sourceRow.forEach((item) => {
      listEmployeeDrag.push(item['employee_id'] ? item['employee_id'] : item['employeeId']);
    });
    if (selectedTargetType === SELECT_TARGET_TYPE.GROUP || selectedTargetType === SELECT_TARGET_TYPE.SHARE_GROUP && selectedTargetId) {
      props.handleMoveToGroup(selectedTargetId, targetCategory.groupId, listEmployeeDrag);
    } else {
      props.handleAddToGroup(targetCategory.groupId, listEmployeeDrag);
    }
  }

  /**
   * Handle for dragging employees and dropping into department or group
   * @param sourceRow
   * @param targetCategory
   */
  const onDragRow = async (sourceRow, targetCategory) => {
    if (targetCategory.departmentId) {
      setShowPopupMoveToDepartment(true);
      setSourceEmployee(sourceRow);
      setTargetCard(targetCategory);
    }

    let messageWarningMove = translate('messages.WAR_EMP_0007', { 0: sourceRow.length, 1: targetCategory.groupName });
    if (selectedTargetType === SELECT_TARGET_TYPE.GROUP || selectedTargetType === SELECT_TARGET_TYPE.SHARE_GROUP && selectedTargetId) {
      messageWarningMove = translate('messages.WAR_EMP_0008', { 0: sourceRow.length, 1: groupName, 2: targetCategory.groupName });
    }
    if (targetCategory.groupId) {
      const result = await ConfirmDialog({
        title: (<>{translate('global.title.confirm')}</>),
        message: messageWarningMove,
        confirmText: translate('global.dialog-dirtycheck.parttern2.confirm'),
        confirmClass: "button-blue",
        cancelText: translate('global.dialog-dirtycheck.parttern2.cancel'),
        cancelClass: "button-cancel"
      });
      if (result) {
        dragEmployeesToGroup(targetCategory, sourceRow)
      }
    }
  }

  /**
   * Call API moveToDepartment
   * @param moveType
   */
  const handleMoveEmployee = (moveType) => {
    const listIdMoveToDepartment = [];
    sourceEmployee.forEach((item) => {
      listIdMoveToDepartment.push(item['employee_id'] ? item['employee_id'] : item['employeeId']);
    })
    props.handleMoveToDepartment(targetCard.departmentId, listIdMoveToDepartment, moveType);
    setShowPopupMoveToDepartment(false);
  }

  /**
   * Get error message code from API
   * @param errorCode
   */
  const getErrorMessage = (errorCode, param?) => {
    if (errorCode === 'ERR_EMP_0006' || errorCode === 'ERR_EMP_0007') {
      return translate(`messages.${errorCode}`, { 0: groupName });
    }

    if (param) {
      return translate('messages.' + errorCode, param);
    } else {
      return translate('messages.' + errorCode);
    }
  }

  const onOpenAddToGroupModal = () => {
    setOpenAddToGroupModal(true);
  };

  const onCloseAddToGroupModal = (isMoveSuccess: boolean) => {
    setOpenAddToGroupModal(false);
  };

  /**
   * Open detail customer by itself
   * (parent customer/customer in tab of this customer)
   * @param nextCustomerId next customer will go to
   * @param prevCustomerId this customer push to prevCustomerIds
   */
  const handleOpenEmployeeDetailByItself = (nextEmployeeId, prevEmployeeId) => {
    setEmployeeIdDetail(nextEmployeeId);
    const prev = _.concat(prevEmployeeIds, prevEmployeeId);
    setPrevEmployeeIds(prev);
    setOpenPopupEmployeeDetail(true);
  }

  const showDetailScreen = (currentEmployeeId, listEmployeeId) => {
    if (!currentEmployeeId) return
    return (
      <>
        {<PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          key={currentEmployeeId}
          showModal={true}
          employeeId={currentEmployeeId}
          isNewEmployee={isNewEmployee}
          listEmployeeId={listEmployeeId}
          toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
          onOpenModalCreateEditEmployee={onOpenModalEmployee}
          employeeSuccessMessage={employeeSuccessMessage}
          resetSuccessMessage={() => { setEmployeeSuccessMessage(null) }}
          handleOpenEmployeeDetailByItself={handleOpenEmployeeDetailByItself}
          isOpenEmployeeDetailNotFromList={isOpenEmployeeDetailNotFromList}
          prevEmployeeIds={prevEmployeeIds}
        />
        }
      </>
    )
  }

  const getListEmployeeId = () => {
    const listEmployeeId = [];
    if (props.employees) {
      props.employees.employees.map((e) => {
        listEmployeeId.push(e.employee_id);
      });
    }
    return listEmployeeId;
  }

  /**
   * Get group name from current active card
   * @param name
   */
  const getGroupName = (name) => {
    setGroupName(name);
  }

  const customFieldsInfoData = (field, type) => {
    return customFieldsInfo(field, type, employeeLayout)
  }

  // msg error code
  useEffect(() => {
    setMsgErrorBox('');
    if (props.errorItems && props.errorItems[0]) {
      setMsgErrorBox(getErrorMessage(props.errorItems[0].errorCode));
    }
    if (props.errorDeleteDepartment && props.errorDeleteDepartment[0]) {
      setMsgErrorBox(getErrorMessage(props.errorDeleteDepartment[0].errorCode));
    }
    if (messageDownloadFileError !== null) {
      setMsgErrorBox(messageDownloadFileError)
    }
    if (props.idsMovedError?.length > 0) {
      let listEmployeeNameError = '';
      props.idsMovedError.forEach((id, idx) => {
        const emp = sourceEmployee.find(e => e['employeeId'] === id || e['employee_id'] === id);
        if (emp) {
          if (idx > 0) {
            listEmployeeNameError += translate('commonCharacter.comma');
          }
          const employeeFullName = StringUtils.getFullName(emp['employee_surname'], emp['employee_name']);
          listEmployeeNameError += employeeFullName;
        }
      })
      setMsgErrorBox(getErrorMessage('ERR_EMP_0037', { 0: listEmployeeNameError }));
    }
  }, [messageDownloadFileError, props.errorItems, props.errorDeleteDepartment, props.idsMovedError])

  const renderToastMessage = () => {
    if (msgSuccess !== SHOW_MESSAGE_SUCCESS.NONE) {
      let msgInfoSuccess = '';
      if (!props.isMissingLicense && msgSuccess === SHOW_MESSAGE_SUCCESS.CREATE) {
        msgInfoSuccess = `${translate("messages.INF_COM_0003")}`;
      } else if (!props.isMissingLicense && msgSuccess === SHOW_MESSAGE_SUCCESS.UPDATE) {
        msgInfoSuccess = `${translate("messages.INF_COM_0004")}`;
      } else if (msgSuccess === SHOW_MESSAGE_SUCCESS.DELETE) {
        msgInfoSuccess = `${translate("messages.INF_COM_0005")}`;
      } else if (msgSuccess === SHOW_MESSAGE_SUCCESS.UPDATE_LICENSE) {
        if (!openModalEmployee) {
          msgInfoSuccess = `${translate("messages.update_employee_license")}`;
        }
        setTimeout(props.logout, 2000)
      }
      return (
        <div className="message-area message-area-bottom position-absolute">
          <BoxMessage messageType={MessageType.Success}
            message={msgInfoSuccess}
            styleClassMessage="block-feedback block-feedback-green text-left"
            className=" " />
        </div>
      )
    }
  }

  /**
   * Rendering an area including departmentName and managerName
   */
  const renderDepartmentInfo = () => {
    const departmentInfo = props.employees ? props.employees.department : null;

    if (!departmentInfo) {
      return;
    }

    let departmentDisplayName = '';
    if (departmentInfo && departmentInfo.managerSurname) {
      departmentDisplayName = departmentInfo.managerSurname
    }
    if (departmentInfo && departmentInfo.managerName) {
      departmentDisplayName = departmentDisplayName + ' ' + departmentInfo.managerName;
    }

    return <div className="align-left">
      <strong>{departmentInfo.departmentName} {translate('employees.list.title.manager-name')}</strong>
      {(departmentInfo.managerName || departmentInfo.managerSurname) ?
        <a onClick={() => onOpenDetailManager(departmentInfo.managerId)}>
          <strong>{departmentDisplayName.trim()}
          </strong>
        </a> : 'ー'
      }
    </div>
  }

  const checkBoxMesSuccess = (propsMsg) => {
    if (propsMsg !== SHOW_MESSAGE_SUCCESS.NONE) {
      setMsgSuccess(propsMsg);
      setTimeout(function () {
        setMsgSuccess(SHOW_MESSAGE_SUCCESS.NONE);
        props.resetMessageSuccess();
      }, TIMEOUT_TOAST_MESSAGE);
    }
  }

  useEffect(() => { 
    props.msgSuccessGroup && checkBoxMesSuccess(props.msgSuccessGroup.successId) }, [props.msgSuccessGroup])
  useEffect(() => { props.msgSuccessList && checkBoxMesSuccess(props.msgSuccessList.successId) }, [props.msgSuccessList])
  useEffect(() => { props.msgSuccessManage && checkBoxMesSuccess(props.msgSuccessManage.successId) }, [props.msgSuccessManage])
  useEffect(() => { props.msgSuccessDepartMent && checkBoxMesSuccess(props.msgSuccessDepartMent.successId) }, [props.msgSuccessDepartMent])
  useEffect(() => { props.msgSuccessControlSidebar && checkBoxMesSuccess(props.msgSuccessControlSidebar.successId) }, [props.msgSuccessControlSidebar])
  useEffect(() => { props.msgSuccessEmployeesSharedList && checkBoxMesSuccess(props.msgSuccessEmployeesSharedList.successId) }, [props.msgSuccessEmployeesSharedList]);
  useEffect(() => {
    if (props.employeeDetailData.has(employeeDetailCtrlId[0]) && props.employeeDetailData.get(employeeDetailCtrlId[0]).messageDeleteSuccess === 'INF_COM_0005') {
      checkBoxMesSuccess(SHOW_MESSAGE_SUCCESS.DELETE);
    }
  });

  useEffect(() => {
    if (props.actionType === EmployeeAction.Success) {
      setFileUploads({});
    }
  }, [props.actionType]);

  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  }

  const customFieldValue = (rowData, fieldColumn, mode) => {

  }

  const onClickOverFlowMenu = (idAction, param) => {
    switch (idAction) {
      case OVER_FLOW_MENU_TYPE.EMPLOYEE.REGIST_SCHEDULES: {
        setOpenCreateCalendar(true);
        setScheduleData({
          participants: {
            employees: [{
              employeeId: param.employee.employeeId,
              employeeName: param.employee.employeeName
            }]
          }
        });
        break;
      }
      case OVER_FLOW_MENU_TYPE.EMPLOYEE.REGIST_TASK:
        if (param && param.employee) {
          dataModalTask['employee'] = param.employee;
        }
        setOpenCreateTask(true);
        break;
      case OVER_FLOW_MENU_TYPE.EMPLOYEE.CREATE_MAIL:
        if (param && param['email']) {
          window.location.href = `mailto:${param.email}`;
        }
        break;
      default:
        break;
    }
  }

  const handleClickPosition = (e) => {
    setHeightPosition(document.body.clientHeight - e.clientY);
  }


  const customContentField = (fieldColumn, rowData, mode, nameKey) => {
    if (_.isArray(fieldColumn)) {
      const idxSurname = fieldColumn.find(item => item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurname);
      const idxSurnameKana = fieldColumn.find(item => item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurnameKana);

      if (mode === ScreenMode.DISPLAY) {
        if (idxSurname) {
          const activeClass = (activeIcon || openOverFlow === rowData.employee_id) ? 'active' : '';
          const param: DataResponseOverflowMenu = {
            email: rowData['email'],
            employee: {
              employeeId: rowData.employee_id,
              photoFilePath: rowData.employee_icon ? rowData.employee_icon.fileUrl : '',
              employeeName: rowData.employee_name && rowData.employee_name.length > 0
                ? rowData.employee_surname + ' ' + rowData.employee_name
                : rowData.employee_surname,
              employeeSurname: rowData.employee_surname,
              departments: rowData.employee_departments
            },

          };
          let charEmploy = ''
          try {
            charEmploy = param.employee.employeeName.charAt(0);
          } catch (error) {
            charEmploy = ''
          }

          return (
            <div className='overflow-menu text-over' onMouseOut={(e) => { setActiveIcon(false) }}>
              {rowData["employee_icon"] && rowData["employee_icon"]["fileUrl"] && <a className="avatar"> <img src={rowData["employee_icon"]["fileUrl"]} /> </a>}
              {(!rowData["employee_icon"] || !rowData["employee_icon"]["fileUrl"]) &&
                <a className={'avatar ' + getColorImage(7)}> {charEmploy} </a>
              }
              <a className="d-inline-block text-ellipsis max-calc110" onClick={() => onOpenPopupEmployeeDetail(rowData.employee_id, fieldColumn[0].fieldId)}>
                <Popover x={-20} y={25}>
                  {rowData.employee_surname ? rowData.employee_surname : ''}  {rowData.employee_name ? rowData.employee_name : ''}
                </Popover>
              </a>
              <a title="" className="icon-small-primary icon-link-small overflow-menu-item" href={`${window.location.origin}/${props.tenant}/employee-detail/${rowData.employee_id}`} target="_blank" rel="noopener noreferrer"></a>
              <div className={`d-inline position-relative overflow-menu-item ${heightPosition < 200 ? 'position-top' : ''}`} onMouseLeave={(e) => setOpenOverFlow(null)}>
                <a id={rowData.employee_id} title="" className={`icon-small-primary icon-sort-small ${activeClass}`}
                  onMouseOver={(e) => setActiveIcon(true)}
                  onClick={(e) => { setOpenOverFlow(rowData.employee_id); handleClickPosition(e); e.stopPropagation(); }}
                  onMouseOut={(e) => e.stopPropagation()}>
                </a>
                {openOverFlow === rowData.employee_id &&
                  <OverFlowMenu
                    setOpenOverFlow={setOpenOverFlow}
                    fieldBelong={FIELD_BELONG.EMPLOYEE}
                    onClickOverFlowMenu={onClickOverFlowMenu}
                    param={param}
                    showTooltipActivity={false}
                    showTooltipPostData={false}
                  />}
              </div>
            </div>
          );
        }
        if (idxSurnameKana) {
          return <div className="text-over">
            <Popover x={-20} y={25}><span className="d-inline-block text-ellipsis">
              {rowData.employee_surname_kana ? rowData.employee_surname_kana : ''} {rowData.employee_name_kana ? rowData.employee_name_kana : ''}
            </span></Popover>
          </div>
        }
      } else {
        let isFocusFirstError = false;
        let isFocusFirstItemEdit = false;
        let typeSpecialEdit;
        if (idxSurname) {
          typeSpecialEdit = EDIT_SPECIAL_ITEM.NAME;
        }
        if (idxSurnameKana) {
          typeSpecialEdit = EDIT_SPECIAL_ITEM.KANA;
        }
        let errorInfos = null;
        if (props.screenMode === ScreenMode.EDIT && props.errorItems && props.errorItems.length > 0) {
          const fieldNameList = fields.map(e => _.camelCase(e.fieldName));
          errorInfos = props.errorItems.filter(
            e =>
              e &&
              e.rowId.toString() === getValueProp(rowData, "employeeId").toString() &&
              _.includes(fieldNameList, _.camelCase(e.item.toString()))
          );
        }
        if (errorInfos && errorInfos !== undefined && errorInfos.length > 0) {
          if (errorInfos[0]['rowId'] === firstEmployeesError && errorInfos[0]['item'] === firstErrorItemError) {
            isFocusFirstError = true;
          }
        }
        if (rowData['employee_id'] === firstEmployeeShowInListFocus) {
          isFocusFirstItemEdit = true;
        }
        return <SpecailEditList
          valueData={rowData}
          itemData={fieldColumn}
          extensionsData={getExtensionsEmployees(employeeLayout)}
          updateStateField={onUpdateFieldValue}
          nameKey={nameKey}
          typeSpecialEdit={typeSpecialEdit}
          updateFiles={updateFiles}
          errorInfos={errorInfos}
          isFocusFirst={errorInfos ? isFocusFirstError : isFocusFirstItemEdit}
          itemFirstFocus={errorInfos ? firstErrorItemError : firstItemInEditListFocus}
        />
      }
    } else {
      if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager ||
        fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates ||
        fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeTimeZone ||
        fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin) {
        return renderSpecialItemNotEdit(fieldColumn, rowData, onOpenPopupEmployeeDetail, props.screenMode);
      }
      if (mode === ScreenMode.DISPLAY) {
        return specialDisplayMultiLine(fieldColumn, rowData, props.screenMode);
      } else {
        return <SpecailEditList
          valueData={rowData}
          itemData={fieldColumn}
          extensionsData={getExtensionsEmployees(employeeLayout)}
          updateStateField={onUpdateFieldValue}
          errorInfos={props.errorItems}
          nameKey={nameKey}
          updateFiles={updateFiles}
        />
      }
    }
  }

  const [dataConvertSpecialField, setDataConvertSpecialField] = useState(null);

  useEffect(() => {
    if (employeeLayout) {
      const data = getExtensionsEmployees(employeeLayout);
      if (!_.isEqual(data, dataConvertSpecialField)) {
        setDataConvertSpecialField(data);
      }
    }
  }, [employeeLayout])

  const showMessage = (message, type) => {
    setMessageDownloadFileError(message);
    setTimeout(() => {
      setMessageDownloadFileError(null);
    }, 5000);
  }

  const resetConditionSearch = () => {
    setConDisplaySearchDetail(false);
    setConditionSearch([]);
    setFilterConditions([]);
    props.handleSearchEmployee(offset, limit, [], [], selectedTargetType, selectedTargetId, false, []);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
    tableListRef.current && tableListRef.current.setFilterListView([], [], customFields);
    tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
  }

  /**
   * handle action open popup setting
   */
  const handleOpenPopupSetting = () => {
    setOnOpenPopupSetting(true)
  }

  /**
 * handle close popup settings
 */
  const dismissDialog = () => {
    setOnOpenPopupSetting(false);
  }
  /**
 * handle close popup Help
 */
  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }

  /**
     * handle action open popup help
     */
  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  const renderInvolveGroupEmployee = () => {
    return (
      <>
        {openAddEditMyGroupModal && employeesMyListData &&
          <EmployeesMySharedListModal
            iconFunction={ICON_FUNCION_CUSTOMERS}
            listMode={employeesMyListData.listMode}
            listId={employeesMyListData.listId}
            isAutoList={employeesMyListData.isAutoList}
            listMembers={employeesMyListData.listMembers}
            employeeLayout={employeeLayout}
            handleCloseEmployeesMySharedListModal={handleCloseCustomerSharedListModal}
            listType={GROUP_TYPE.MY}
            labelTranslate={'employee-my-list-modal'}
          />
        }
        {openGroupModal && EmployeesSharedListData &&
          <EmployeesMySharedListModal
            iconFunction={ICON_FUNCION_CUSTOMERS}
            listMode={EmployeesSharedListData.listMode}
            listId={EmployeesSharedListData.listId}
            isAutoList={EmployeesSharedListData.isAutoList}
            listMembers={EmployeesSharedListData.listMembers}
            employeeLayout={employeeLayout}
            handleCloseEmployeesMySharedListModal={handleCloseCustomerSharedListModal}
            listType={GROUP_TYPE.SHARED}
            labelTranslate={'employee-shared-list-modal'}
          />
        }
        {openMoveToGroupModal &&
          <EmployeeMoveToGroupModal
            toggleCloseMoveToGroupModal={onCloseMoveToGroupModal}
            empCheckList={recordCheckList.filter(e => e.isChecked === true)}
            sideBarCurrentId={sidebarCurrentId}
            reloadScreen={updateDataList} />
        }
        {openEmployeeCreateMyGroup && <EmployeeCreateGroupModal toggleCloseCreateMyGroupModal={onCloseEmployeeCreateMyGroup} />}
        {openAddToGroupModal && (
          <EmployeeAddToGroupModal
            toggleCloseAddToGroupModal={onCloseAddToGroupModal}
            sideBarCurrentId={sidebarCurrentId}
            reloadScreen={updateDataList} />
        )}
      </>
    )
  }

  const renderErrorBox = () => {
    if (validateMsg.length > 0) {
      return <BoxMessage messageType={MessageType.Error}
        messages={_.map(validateMsg, 'msg')}
      />
    }
    return (
      <BoxMessage messageType={MessageType.Error} message={msgErrorBox} />
    )
  }

  const onClosePopupCreate = (popupType) => {
    if (popupType === 'calendar') {
      setOpenCreateCalendar(false);
    }
  }

  const renderModalToolTip = () => {
    return (
      <>
        {openCreateCalendar && <CreateEditSchedule
          onClosePopup={() => onClosePopupCreate('calendar')}
          scheduleDataParam={scheduleData}
        />}
        {openCreateTask &&
          <ModalCreateEditTask
            toggleCloseModalTask={() => setOpenCreateTask(false)}
            iconFunction="ic-task-brown.svg"
            {...dataModalTask}
            canBack={true} />
        }
      </>
    )
  }

  return (
    <>
      <div className="control-esr page-employee resize-content">
        <EmployeeControlTop
          modeDisplay={props.screenMode}
          toggleSwitchDisplay={onShowSwitchDisplay}
          toggleOpenPopupSearch={onOpenPopupSearch}
          toggleOpenDepartmentPopup={onOpenDepartmentPopup}
          toggleOpenInviteEmployees={onOpenInviteEmployees}
          textSearch={textSearch} enterSearchText={enterSearchText}
          toggleSwitchEditMode={changeEditMode}
          toggleUpdateInEditMode={handleUpdateEmployees}
          listMenuType={listMenuType}
          sidebarCurrentId={sidebarCurrentId}
          orderBy={orderBy}
          toggleOpenMoveToGroupModal={onOpenMoveToGroupModal}
          reloadScreen={updateDataList}
          toggleOpenManagerSettingPopup={onOpenManagerSettingPopup}
          searchMode={searchMode}
          conDisplaySearchDetail={conDisplaySearchDetail}
          setConDisplaySearchDetail={resetConditionSearch}
          toggleOpenModalCreateEmployee={onOpenModalEmployee}
          toggleOpenAddToGroupModal={onOpenAddToGroupModal}
          toggleOpenAddEditMyGroupModal={handleOpenEmployeesMyListModal}
          toggleOpenCreateMyGroup={OnOpenCreateMyGroup}
          // toggleSetIsCopyGroup={() => setIsCopyGroup(!isCopyGroup)}
          openGroupModal={handleOpenEmployeeSharedListModal}
          groupName={getGroupName}
          openSwitchDisplay={showSwitcher}
          toggleOpenPopupSetting={handleOpenPopupSetting}
          selectedTargetType={targetType}
          selectedTargetId={targetId}
          recordCheckList={recordCheckList}
          targetDepartment={targetDepartment}
          toggleOpenHelpPopup={handleOpenPopupHelp}
        />
        <div className="wrap-control-esr style-3">
          <div className="esr-content">
            <EmployeeControlSidebar updateFiltersSearch={updateFiltersLocalMenu}
              toggleOpenModalCreateGroup={handleOpenEmployeeSharedListModal}
              toggleOpenModalChangeGroupType={handleOpenEmployeeSharedListModal}
              toggleShowFeaturesIcon={updateListMenuType}
              toggleOpenAddEditMyGroupModal={handleOpenEmployeesMyListModal}
              sidebarCurrentId={actionSetSidebarId}
              selectedTargetType={selectedTargetType}
              setTypeGroup={onSetTypeGroup}
              openGroupModal={handleOpenEmployeeSharedListModal}
              toggleOpenDepartmentPopup={onOpenDepartmentPopupLocalMenu}
              getGroupName={getGroupName}
              initializeListInfo={props.initializeListInfo}
              handleGetInitializeListInfo={() => props.handleGetInitializeListInfo(FIELD_BELONG.EMPLOYEE)}
              changeSelectedSidebar={changeSelectedSidebar}
              setTargetDepartment={setTargetDepartment}
              dirtyCheck={executeDirtyCheck}
            />
            <div className={showSwitcher ? "esr-content-body esr-content-body2 overflow-x-hidden" : "esr-content-body overflow-x-hidden"}>
              <div className="esr-content-body-main w-auto">
                {msgErrorBox && renderErrorBox()}
                <div className="pagination-top max-width-220">
                  {renderDepartmentInfo()}
                  <div className="esr-pagination">
                    <DynamicDisplayConditionList
                      conditions={conditionSearch}
                      filters={filterConditions}
                      searchMode={searchMode}
                      siderbarActiveId={sidebarCurrentId}
                      infoSearchConditionList={infoSearchConditionGroup}
                      layoutData={employeeLayout}
                      fieldBelong={FIELD_BELONG.EMPLOYEE}
                    />
                    {fieldInfos && employees && employees.totalRecords > 0 &&
                      <PaginationList offset={offset} limit={limit} totalRecords={employees.totalRecords} onPageChange={onPageChange} />
                    }
                  </div>
                </div>
                {/* {renderMessage()} */}
                {fieldInfos && employees &&
                  <DynamicList ref={tableListRef} id={EMPLOYEE_LIST_ID}
                    records={employeeList} mode={props.screenMode}
                    checkboxFirstColumn={true}
                    keyRecordId={"employeeId"}
                    belong={FIELD_BELONG.EMPLOYEE}
                    fieldInfoType={FieldInfoType.Personal}
                    extensionsData={getExtensionsEmployees(employeeLayout)}
                    errorRecords={errorItems}
                    onActionFilterOrder={onActionFilterOrder}
                    onUpdateFieldValue={onUpdateFieldValue}
                    onDragRow={onDragRow}
                    onSelectedRecord={getSelectedRecord}
                    // formatFieldGroup={formatFieldGroup()}
                    // sidebarCurrentId={sidebarCurrentId} TODO comment
                    tableClass={"table-list table-drop-down table-employee "}// table-list-has-show-wrap
                    getCustomFieldValue={customFieldValue}
                    getCustomFieldInfo={customFieldsInfoData}
                    customHeaderField={customHeaderField}
                    customContentField={customContentField}
                    updateFiles={updateFiles}
                    showMessage={showMessage}
                    fieldNameExtension="employee_data"
                    totalRecords={employees.totalRecords}
                    firstFocus={errorItems ? { id: firstEmployeesError, item: firstErrorItemError, nameId: 'employee_id' } : { id: firstEmployeeShowInListFocus, item: firstItemInEditListFocus, nameId: 'employee_id' }}
                    selectedTargetType={selectedTargetType}
                    targetType={targetType}
                    targetId={targetId}
                    typeMsgEmpty={employees && employees.typeMsgEmpty}
                  />}
              </div>
            </div>
            {showSwitcher && <SwitchFieldPanel dataSource={customFields}
              dataTarget={fields}
              onCloseSwitchDisplay={() => setShowSwitcher(false)}
              onChooseField={(id, isSelected) => onSelectSwitchDisplayField(id, isSelected)}
              onDragField={onDragField}
              fieldBelong={FIELD_BELONG.EMPLOYEE}
              isAdmin={isAdmin}
              goToEmployeeDetail={goToEmployeeDetail}
            />}
          </div>
          {renderToastMessage()}
        </div>
        {renderInvolveGroupEmployee()}
        <GlobalControlRight />
        {openPopupSearch &&
          <PopupFieldsSearch
            iconFunction="ic-sidebar-employee.svg"
            fieldBelong={FIELD_BELONG.EMPLOYEE}
            conditionSearch={conditionSearch}
            onCloseFieldsSearch={onClosePopupSearch}
            onActionSearch={handleSearchPopup}
            conDisplaySearchDetail={conDisplaySearchDetail}
            setConDisplaySearchDetail={setConDisplaySearchDetail}
            fieldNameExtension="employee_data"
            layoutData={employeeLayout}
            selectedTargetType={selectedTargetType}
            selectedTargetId={selectedTargetId}
          />
        }
        <PopupWarningLicense license={props.license} />
        {/* ShowDETAIL */}
        {openPopupEmployeeDetail && showDetailScreen(employeeIdDetail, openPopupDetailManager ? [employeeIdDetail] : getListEmployeeId())}
        {openDepartmentPopup &&
          <DepartmentRegistEdit
            isRegist={isRegistDepartment}
            departmentId={isRegistDepartment ? null : departmentIdSelected}
            toggleClosePopupDepartmentRegistEdit={closeDepartmentPopup}
          />
        }
        {openManagerSettingPopup &&
          <ManagerSetting
            employeeIds={recordCheckList.filter(e => e.isChecked === true).map(item => item.employeeId)}
            toggleClosePopupSettingCondition={closeManagerSettingPopup}
            reloadScreen={updateDataList}
          />
        }
        {openInviteEmployees &&
          <InviteEmployee
            toggleCloseInviteEmployees={onCloseInviteEmployees}
          />
        }
        {openModalEmployee &&
          <ModalCreateEditEmployee
            id={employeeEditCtrlId[0]}
            toggleCloseModalEmployee={onCloseModalEmployee}
            iconFunction="ic-sidebar-employee.svg"
            employeeActionType={employeeActionType}
            employeeViewMode={employeeViewMode}
            employeeId={employeeId}
          />
        }
        {renderModalToolTip()}
        {showPopupMoveToDepartment &&
          <MoveToDepartmentPopup
            setShowPopupMoveToDepartment={setShowPopupMoveToDepartment}
            moveType={handleMoveEmployee}
            locale={props.currentLocale}
          />}
        {onOpenPopupSetting && <PopupMenuSet dismissDialog={dismissDialog} />}

      </div>
      {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.employee} dismissDialog={dismissDialogHelp} />}
    </>
  );
};

const mapStateToProps = ({ locale, employeeList, dynamicList, employeeControlSidebar, employeeDetail, groupModal, screenMoveState, employeeInfo, managerSetting, departmentRegistEdit, applicationProfile, authentication, inviteEmployees, employeesMySharedListState }: IRootState) => ({
  fieldInfos: dynamicList.data.has(EMPLOYEE_LIST_ID) ? dynamicList.data.get(EMPLOYEE_LIST_ID).fieldInfos : {},
  customFieldInfos: employeeList.customFieldInfos,
  employees: employeeList.employees,
  actionType: employeeList.action,
  errorMessage: employeeList.errorMessage,
  errorItems: employeeList.errorItems,
  screenMode: employeeList.screenMode,
  idsMovedSuccess: employeeList.idsMovedSuccess,
  idsMovedError: employeeList.idsMovedError,
  sidebarErrorMessage: employeeControlSidebar.errorMessage,
  deletedGroupId: employeeControlSidebar.deletedGroupId,
  deletedDepartmentId: employeeControlSidebar.deletedDepartmentId,
  updatedAutoGroupId: employeeControlSidebar.updatedAutoGroupId,
  employeeDetailData: employeeDetail.data,
  errorDeleteDepartment: employeeControlSidebar.errorItems,
  // messageDeleteSuccess: employeeDetail.messageDeleteSuccess,
  // messageChangeStatusSuccess: employeeDetail.messageChangeStatusSuccess,
  initializeListInfo: employeeList.initializeListInfo,
  fields: employeeList.fields,
  employeeLayout: employeeList.employeeLayout,
  modalActionGroup: groupModal.modalAction,
  removeManagerEmployeesId: employeeList.removeManagerEmployeesId,
  screenMoveInfo: screenMoveState.screenMoveInfo,
  modalActionCreatEmployee: employeeInfo.data,
  tenant: applicationProfile.tenant,
  authorities: authentication.account.authorities,
  msgSuccessGroup: groupModal.msgSuccess,
  msgSuccessDepartMent: departmentRegistEdit.msgSuccess,
  msgSuccessList: employeeList.msgSuccess,
  msgSuccessManage: managerSetting.msgSuccess,
  msgSuccessControlSidebar: employeeControlSidebar.msgSuccess,
  infoSearchConditionGroup: employeeList.infoSearchConditionGroup,
  msgInvite: inviteEmployees.isSuccess,
  msgSuccessEmployeesSharedList: employeesMySharedListState.msgSuccess,
  searchConditionsParam: employeesMySharedListState.searchConditionsParam,
  license: employeeList.license,
  isMissingLicense: authentication.isMissingLicense,
  currentLocale: locale.currentLocale
});

const mapDispatchToProps = {
  getCustomFieldsInfo,
  getEmployees,
  handleInitEmployeeList,
  handleSearchEmployee,
  handleUpdateEmployee,
  changeScreenMode,
  handleFilterEmployeeByMenu,
  handleGetInitializeListInfo,
  handleMoveToDepartment,
  handleInitLocalMenu,
  reset,
  resetMessageSuccess,
  resetGroup,
  handleGetFieldInfoBelong,
  resetSidebar,
  moveScreenReset,
  getFieldInfoPersonals,
  handleMoveToGroup,
  handleAddToGroup,
  handleGetEmployeeLayout,
  resetList,
  getSearchConditionInfoGroup,
  resetMsgErrorEmployeeList,
  handleCheckInvalidLicense,
  logout,

};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeList);
