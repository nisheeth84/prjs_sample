import React, { useState, useEffect, useRef } from 'react';
import {
  reset,
  changeScreenMode,
  handleInitTaskDetail,
  handleInitChangeHistory,
  handleReorderField,
  handleUpdateStatusTask,
  DetailTaskAction,
  handleDeleteTask,
  ACTION_TYPES,
  handleUpdateCustomFieldInfo
} from './detail-task.reducer';

import {
  setTaskCopy
} from '../create-edit-task/create-edit-task.reducer';
import { checkOnline, resetOnline } from 'app/shared/reducers/authentication.ts';

import { AUTHORITIES, ScreenMode, AVAILABLE_FLAG, FIELD_BELONG, SCREEN_TYPES, TIMEOUT_TOAST_MESSAGE, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Storage, translate } from 'react-jhipster';
import _ from 'lodash';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { Modal } from 'reactstrap';

import {
  TAB_ID_LIST,
  STATUS_TASK,
  TASK_UPDATE_FLG,
  TASK_ACTION_TYPES,
  TASK_VIEW_MODES,
  TASK_DELETE_FLG,
  LICENSE
} from '../constants';

import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import TabList from './detail-task-modal-tab-list';
import TabSummary from './detail-tabs/detail-tab-summary';
import TabChangeHistory from './detail-tabs/detail-tab-change-history';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import useEventListener from 'app/shared/util/use-event-listener';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import { startExecuting } from 'app/shared/reducers/action-executing';
import ModalCreateEditSubTask from 'app/modules/tasks/create-edit-subtask/modal-create-edit-subtask';
import DynamicSelectField, { SettingModes } from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import { DynamicControlAction, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer'
import { isNullOrUndefined } from 'util';
import { toast } from 'react-toastify';
import { useDragLayer } from 'react-dnd';
import RelationDisplayTab from 'app/shared/layout/dynamic-form/control-field/view/relation-display-tab'
import dateFnsFormat from 'date-fns/format';
import { processRelationselectOrganization, putDataToFieldEdit, isFieldRelationAsTab, createNewFieldLookup, revertDeletedFields, initialRevertFields, concatArray } from 'app/shared/util/utils';
import { TypeMessage } from './detail-tabs/detail-tab-summary-element';
import TimelineCommonControl from 'app/modules/timeline/timeline-common-control/timeline-common-control';
import { TIMELINE_SERVICE_TYPES, TIMELINE_TYPE, MODE_EXT_TIMELINE } from 'app/modules/timeline/common/constants';
import { ACTIVITY_ACTION_TYPES, ACTIVITY_VIEW_MODES } from 'app/modules/activity/constants';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import { handleInnitGetExtTimelineFilter } from 'app/modules/timeline/timeline-common-reducer';
import DetailMilestoneModal from 'app/modules/tasks/milestone/detail/detail-milestone-modal';
import DetailSubTaskModal from 'app/modules/tasks/detail/detail-task-modal';

export interface IDetailTaskModalProps extends StateProps, DispatchProps {
  iconFunction?: string,
  toggleCloseModalTaskDetail?: (taskId?) => void,
  taskId?: number,
  popout?: boolean,
  listTask?: any,
  popoutParams?: any,
  canBack?: any,
  taskSuccessMessage?: string;
  onClickDetailMilestone?: (milestoneId) => void,
  onOpenModalSubTaskDetail?: (subTaskId) => void,
  isNotCloseModal?: boolean; // don't close modal
  // isFromGlobalTool?: boolean; // open from global tool
  parentId?: number;
  backdrop?,
  openFromModal?: boolean,
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

export enum PopupConditionDisplay {
  None,
  ModalDialog,
  Window,
}

/**
 * Component for show detail task
 * @param props
 */
const DetailTaskModal = (props: IDetailTaskModalProps) => {
  const initialState = {
    tabListShow: _.cloneDeep(props.task && props.task.tabInfo.filter(e => e.isDisplay)),
    tabList: _.cloneDeep(props.task && props.task.tabInfo),
    tabListUpdate: null,
    summaryFields: null
  };
  const {
    actionType
  } = props;

  const [summaryFields, setSummaryFields] = useState(null);

  const [tabListShow, setTabListShow] = useState(props.task ? props.task.tabInfo.filter(e => e.isDisplay) : null);
  const [dataInfo, setDataInfo] = useState(props.task ? props.task.dataInfo.task : null);
  const [screenMode, setScreenMode] = useState(props.screenMode);
  const [dataDetail, setDataDetail] = useState(props.dataDetail);
  const [taskLayout, setTaskLayout] = useState(props.taskLayout);
  const [changeHistory, setChangeHistory] = useState(props.changeHistory);
  const [task, setTask] = useState(props.task);
  const [taskCurrentId, setTaskCurrentId] = useState(props.taskId ? props.taskId : props.popoutParams.taskId);
  const [listTask, setListTask] = useState(props.listTask);
  const [indexCurrent, setIndexCurrent] = useState(null);
  const [taskSuccessMsg, setTaskSuccessMsg] = useState(null);

  const [tabList, setTabList] = useState(props.task ? props.task.tabInfo : null);
  const [tabListUpdate, setTabListUpdate] = useState(null);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const [currentTab, setCurrentTab] = useState(TAB_ID_LIST.summary);
  const [openPopupUpdateTaskStatus, setOpenPopupUpdateTaskStatus] = useState(false);
  const [openPopupDeleteTask2, setOpenPopupDeleteTask2] = useState(false);
  const [openPopupDeleteTask3, setOpenPopupDeleteTask3] = useState(false);
  const [processFlg, setprocessFlg] = useState(null);
  const [msgError, setMsgError] = useState(props.errorItems);
  const [dataModalTask, setDataModalTask] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.UPDATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE, modeCopy: false, listFieldPreview: null })
  const [openPopupCopyTask, setOpenPopupCopyTask] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [canBack, ] = useState(props.canBack);
  const [currentPage, setCurretPage] = useState(1);
  const [popupSettingMode, setPopupSettingMode] = useState(SettingModes.CreateNewInput);
  const [currentFieldEdit, setCurrentFieldEdit] = useState(null);
  const [deletedSummaryFields, setDeletedSummaryFields] = useState(null);
  const [editedSummaryFields, setEditedSummaryFields] = useState([]);
  const [isSaveField, setIsSaveField] = useState(false);
  const [fieldEdit, setFieldEdit] = useState();
  const [fieldRelationTab, setFieldRelationTab] = useState([]);
  const [paramsEdit, setParamsEdit] = useState();
  const [taskFieldUnvailable, setTaskFieldUnvailable] = useState([]);
  const [deleteFieldUnavailable, setDeleteFieldUnavailable] = useState([]);
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  const { screenMoveInfo } = props;
  const [fieldCallback, setFieldCallback] = useState({});
  const tabSummaryRef = useRef(null);
  const tableListRef = useRef(null);
  const actionTabRef = useRef(null);
  const [isLoadTask, setIsLoadTask] = useState(false);
  const [isOpenMenuAddTab, setIsOpenMenuAddTab] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const [normalMessage, setNormalMessage] = useState(null);
  const [heightTable, setHeightTable] = useState(null);
  const [isScrollMin, setIsScrollMin] = useState(true);
  const [summaryFieldRevert, setSummaryFieldRevert] = useState([]);
  const [showTimeline, setShowTimeline] = useState((props.screenMode === ScreenMode.DISPLAY && props.listLicense && props.listLicense.includes(LICENSE.TIMELINE_LICENSE)))
  const [showModalActivity, setShowModalActivity] = useState(false);
  const [activityViewMode,] = useState(ACTIVITY_VIEW_MODES.EDITABLE);
  const [activityActionType,] = useState(ACTIVITY_ACTION_TYPES.CREATE);
  const [, setActivityId] = useState(null);
  const [, setShowActivityDetail] = useState(false);
  const [isChangeTimeline, setIsChangeTimeline] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [openModalDetailMilestone, setOpenModalDetailMilestone] = useState(false);
  const [openModalDetailSubTask, setOpenModalDetailSubTask] = useState(false);
  const [selectedSubTasks, setSelectedSubTask] = useState(null);

  const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT); // get user setting date format

  const changeTab = (clickedTabId) => {
    setCurrentTab(clickedTabId);
  }

  useEffect(() => {
    if (props.isCloseAllWindownOpened && !props.isNotCloseModal) {
      if (props.popoutParams) {
        props.reset();
        window.close();
      } else {
        props.reset();
        props.toggleCloseModalTaskDetail();
      }
    }
  }, [props.isCloseAllWindownOpened]);

  useEffect(() => {
    if (currentTab === TAB_ID_LIST.changeHistory) {
      setHeightTable('unset');
    }
  }, [currentTab]);

  /**
   *
   * @param mode update to section
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(DetailTaskModal.name, {
        summaryFields,
        tabListShow,
        currentTab,
        dataInfo,
        screenMode,
        dataDetail,
        taskLayout,
        changeHistory,
        task,
        taskCurrentId,
        listTask,
        indexCurrent
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(DetailTaskModal.name);
      if (saveObj) {
        setSummaryFields(saveObj.summaryFields);
        setTabListShow(saveObj.tabListShow);
        setCurrentTab(saveObj.currentTab);
        setDataInfo(saveObj.dataInfo);
        setScreenMode(saveObj.screenMode);
        setDataDetail(saveObj.dataDetail);
        setTaskLayout(saveObj.taskLayout);
        setChangeHistory(saveObj.changeHistory);
        setTask(saveObj.task);
        setTaskCurrentId(saveObj.taskCurrentId);
        setListTask(saveObj.listTask);
        setIndexCurrent(saveObj.indexCurrent);
        document.body.className = "wrap-task";
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(DetailTaskModal.name);
    }
  }

  /**
   * Check display field according to license
   * @param field 
   * @param fieldNames
   * @param license 
   */
  const checkDisplayFieldByLicense = (field, fieldNames, license) => {
    if (!fieldNames.includes(field.fieldName)) {
      return true;
    }
    if (props.listLicense && props.listLicense.includes(license)) {
      return true;
    }
    return false;
  }


  /**
   * Filter fieldInfos by license
   * @param data 
   */
  const filterFieldInfoByLicense = data => {
    if (!data || data.length === 0) {
      return [];
    }
    return data.filter(
      item =>
        checkDisplayFieldByLicense(
          item,
          ['customer_name', 'customer_id'],
          LICENSE.CUSTOMER_LICENSE
        ) &&
        checkDisplayFieldByLicense(
          item,
          ['product_name', 'products_tradings_id'],
          LICENSE.SALES_LICENSE
        )
    );
  };

  useEffect(() => {
    setScreenMode(props.screenMode);
    setDataDetail(props.dataDetail);
    setTaskLayout(filterFieldInfoByLicense(props.taskLayout));

    if (props.changeHistory) {
      setChangeHistory(props.changeHistory);
    }
    if (props.task) {
      const cloneTask =_.cloneDeep(props.task);
      cloneTask['fieldInfo'] = filterFieldInfoByLicense(props.task.fieldInfo);
      setTask(cloneTask);
    }
    setTabListShow(props.task ? props.task.tabInfo.filter(e => e.isDisplay) : null);
    setDataInfo(props.task ? props.task.dataInfo.task : null);
  }, [actionType, props.changeHistory, props.task, props.taskLayout, props.screenMode]);

	/**
* close modal create task
*/


  const [listHistory, setListHistory] = useState([]);
  const [, setChangeHistoryTemp] = useState([]);

  // const isFieldRelationAsTab = (field) => {
  //   if (!field || _.toString(field.fieldType) !== DEFINE_FIELD_TYPE.RELATION) {
  //     return false;
  //   }
  //   if (field.relationData && field.relationData.displayTab === 1 && field.relationData.asSelf !== 1) {
  //     return true;
  //   }
  //   return false;
  // }

  const reloadDataTimeline = (taskId) => {
    const formSearch = {
      filters: {},
      limit: 5,
      offset: 0,
      listType: TIMELINE_TYPE.ALL_TIMELINE,
      targetDelivers: [],
      sort: "changedDate",
      idObject: [taskId],
      serviceType: TIMELINE_SERVICE_TYPES.TASK,
      mode: MODE_EXT_TIMELINE.DETAIL,
      hasLoginUser: false
    };
    props.handleInnitGetExtTimelineFilter(formSearch);
  }

  useEffect(() => {
    if (summaryFieldRevert && summaryFields && taskFieldUnvailable) {
      setSummaryFieldRevert(initialRevertFields(summaryFields, taskFieldUnvailable, summaryFieldRevert));
    }
  }, [summaryFields, taskFieldUnvailable])

  useEffect(() => {
    if (props.task) {
      setSummaryFieldRevert(_.cloneDeep(props.task.fieldInfo))
    }
  }, [props.task])

  useEffect(() => {
    if (props.task) {
      props.task.fieldInfo.forEach((item) => {
        if (_.isNil(item.salesProcess)) {
          Object.assign(item, { salesProcess: null });
        }
      })
      if (!isLoadTask && _.toArray(props.task.fieldInfo).length > 0) {
        setFieldRelationTab(props.task.fieldInfo.filter(e => isFieldRelationAsTab(e)))
        setIsLoadTask(true);
      }
    }
    setTaskFieldUnvailable(_.cloneDeep(props.taskFieldsUnVailable));
  }, [props.task])

  useEffect(() => {
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.DETAIL) {
      if (taskCurrentId !== screenMoveInfo.objectId) setTaskCurrentId(screenMoveInfo.objectId);
      if (currentTab !== TAB_ID_LIST.summary) setCurrentTab(TAB_ID_LIST.summary);
      props.handleInitTaskDetail(screenMoveInfo.objectId);
      props.moveScreenReset();
    }
  }, [screenMoveInfo])

  useEffect(() => {
    if (props.changeHistory) {
      setListHistory(props.changeHistory);
    }
  }, [props.changeHistory])

  useEffect(() => {
    setChangeHistoryTemp(_.cloneDeep(listHistory));
  }, [listHistory])

  useEffect(() => {
    if (props.task) {
      setTabList(props.task.tabInfo);
    }
  }, [props.task, tabList])

  const onCloseModalTask = (actionStatus) => {
    reloadDataTimeline(taskCurrentId);
    setDataModalTask({
      ...dataModalTask,
      showModal: false
    });
    if (actionStatus) {
      listHistory.length = 0;
      props.handleInitTaskDetail(taskCurrentId);
    }
  }
	/**
	 * close modal create task
	 */
  const onShowModalEditTask = () => {
    setDataModalTask({
      ...dataModalTask,
      taskId: taskCurrentId,
      parentTaskId: dataInfo.parentTaskId,
      showModal: true,
      taskViewMode: TASK_VIEW_MODES.EDITABLE,
      modeCopy: false
    });
  }

  const onDragDropTabList = (dragTabId, dropTabId) => {
    const dragIndex = tabListShow.findIndex(e => e.tabId === dragTabId);
    const dropIndex = tabListShow.findIndex(e => e.tabId === dropTabId);
    if (dragIndex < 0 || dropIndex < 0 || dragIndex === dropIndex) {
      return
    }
    const objParamListShow = [];
    const objParamList = [];
    const tempObjectListShow = tabListShow.splice(dragIndex, 1, tabListShow[dropIndex])[0]; // get the item from the array
    const tempObjectList = tabList.splice(dragIndex, 1, tabList[dropIndex])[0]; // get the item from the array
    tabListShow.splice(dropIndex, 1, tempObjectListShow);
    tabList.splice(dropIndex, 1, tempObjectList);
    for (let i = 0; i < tabListShow.length; i++) {
      objParamListShow.push(_.cloneDeep(tabListShow[i]));
      objParamListShow[i].tabOrder = i + 1;
    }
    for (let i = 0; i < tabList.length; i++) {
      objParamList.push(_.cloneDeep(tabList[i]));
      objParamList[i].tabOrder = i + 1;
    }
    setTabListShow(objParamListShow);
    setTabList(objParamList);
    setTabListUpdate(objParamList);
  }

  const onChangeSummaryFields = (fields, deleteFields, editedFields) => {
    setFieldCallback({ listField: _.cloneDeep(fields), deleteFields: null })
    setSummaryFields(_.cloneDeep(fields));
    setEditedSummaryFields(editedFields);
    setDeletedSummaryFields(_.cloneDeep(deleteFields));
  }

  const isChangeInputEdit = () => {
    let isChange = false;
    if (screenMode === ScreenMode.EDIT) {
      const oldData = {
        summaryField: _.cloneDeep(props.task.fieldInfo),
        tabList: _.cloneDeep(props.task.tabInfo)
      };
      if (summaryFields === null && tabListUpdate === null && popupSettingMode !== SettingModes.EditInput) {
        isChange = false;
      } else {
        if (tabListUpdate !== null && !_.isEqual(tabListUpdate, oldData.tabList)) {
          isChange = true;
        }
        // if ((summaryFields !== null && !_.isEqual(summaryFields, oldData.summaryField)) || (tabListUpdate !== null && !_.isEqual(tabListUpdate, oldData.tabList))) {
        if (!_.isNil(summaryFields)) {
          summaryFields.forEach((field) => {
            if (field.userModifyFlg && field.userModifyFlg === true) {
              isChange = true;
            }
          })
        }
        if (!_.isNil(tabListUpdate)) { // Todo
          isChange = true;
        }
        if (popupSettingMode === SettingModes.EditInput) {
          isChange = true;
        }
      }
    } else {
      isChange = false;
    }
    if (isDelete) {
      isChange = true;
    }
    return isChange;
  };

  const executeDirtyCheckModeEdit = async (action: () => void, cancel?: () => void) => {
    const isChange = isChangeInputEdit();
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: DIRTYCHECK_PARTTERN.PARTTERN2 });
    } else {
      action();
    }
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void, partern?: any) => {
    const isChange = isChangeInputEdit();
    if (isChange || isChangeTimeline) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: partern });
    } else {
      action();
    }
  }

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/detail-task/${taskCurrentId}`, '', style.toString());
  }

	/**
	 *  check update status task/subtask
	 * @param taskData
	 */
  const onShowUpdateStatusDialog = (taskData) => {
    const { taskId, statusTaskId, parentTaskId, subtasks } = taskData
    if (parentTaskId !== null) {
      props.handleUpdateStatusTask(taskId, statusTaskId, TASK_UPDATE_FLG.MOVE_TO_DONE)

    } else {
      if (subtasks === null || subtasks === []) {
        props.handleUpdateStatusTask(taskId, statusTaskId, TASK_UPDATE_FLG.MOVE_TO_DONE)
      } else {
        if (subtasks.some(i => (i.statusTaskId === STATUS_TASK.NOT_STARTED || i.statusTaskId === STATUS_TASK.WORKING))) {
          setOpenPopupUpdateTaskStatus(true)
        } else {
          props.handleUpdateStatusTask(taskId, statusTaskId, TASK_UPDATE_FLG.MOVE_TASK_SUBTASK_TO_DONE)
        }
      }
    }
  };

	/**
	 *  check delete task/subtask
	 * @param taskData
	 */
  const onShowDeleteDialog = (taskData) => {
    const { parentTaskId, subtasks } = taskData
    if (parentTaskId !== null) {
      setprocessFlg(TASK_DELETE_FLG.DELETE_TASK)
      setOpenPopupDeleteTask2(true)
    } else {
      if (subtasks === null || subtasks === []) {
        setprocessFlg(TASK_DELETE_FLG.DELETE_TASK)
        setOpenPopupDeleteTask2(true)
      } else {
        if (subtasks.some(i => (i.statusTaskId === STATUS_TASK.NOT_STARTED || i.statusTaskId === STATUS_TASK.WORKING))) {
          setOpenPopupDeleteTask3(true)
        } else {
          setprocessFlg(TASK_DELETE_FLG.DELETE_TASK_SUBTASK)
          setOpenPopupDeleteTask2(true)
        }
      }
    }
  };

  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

	/**
	 * call api updateTaskStatus
	 * @param updateFlg
	 */
  const onUpdateTaskStatus = (updateFlg) => {
    const { taskId, statusTaskId } = dataInfo;
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_DETAIL_UPDATE_STATUS));
    props.handleUpdateStatusTask(taskId, statusTaskId, updateFlg);
    setOpenPopupUpdateTaskStatus(false);
  }

  /**
	 * call api deleteTasks
	 * @param updateFlg
	 */
  const onDeleteTask = (updateFlg) => {
    const { taskId } = dataInfo
    const taskIds = { taskId }
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_DETAIL_DELETE));
    props.handleDeleteTask(taskIds, updateFlg);
    setOpenPopupDeleteTask2(false);
    setOpenPopupDeleteTask3(false);
  }

  /**
   * close popup detail
   */
  const handleClosePopup = (partern) => {
    executeDirtyCheck(() => {
      props.reset();
      props.toggleCloseModalTaskDetail();
      if (props.parentId) {
        props.handleInitTaskDetail(props.parentId);
      }
    }, () => { }, partern);
  }

  const updateCustomFieldInfo = () => {
    const tabListUpdateTmp = _.cloneDeep(tabListUpdate);
    if (tabListUpdateTmp !== null) {
      tabListUpdateTmp.map((item) => {
        delete item.tabLabel;
        delete item.fieldOrder;
        delete item.labelName;
      })
    }
    const fieldsUpdate = [];
    const summaryFieldsTmp = _.cloneDeep(summaryFields);
    if (!_.isNil(summaryFields)) {
      taskFieldUnvailable.forEach((field) => {
        const index = summaryFields.findIndex(e => e.fieldId === field.fieldId);
        if (index < 0) {
          summaryFieldsTmp.push(field);
        }
      })
    }
    const deleteSummaryFieldTmp = _.cloneDeep(deletedSummaryFields)
    deleteFieldUnavailable.forEach((field) => {
      const index = deletedSummaryFields.findIndex(e => e.fieldId !== field.fieldId);
      if (index < 0) {
        deleteSummaryFieldTmp.push(field);
      }
    })
    if (summaryFieldsTmp !== null) {
      summaryFieldsTmp.map((item) => {
        const field = _.cloneDeep(item)
        delete field.fieldBelong;
        delete field.createdDate;
        delete field.createdUser;
        delete field.updatedUser;
        delete field.isMultiToSingle;
        if (!_.isNil(field.oldField)) {
          delete field.oldField;
        }
        if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION && !_.isNil(field.relationField)) {
          if (!_.isNil(field.relationField.isMultiToSingle)) {
            delete field.relationField.isMultiToSingle;
          }
          const relationField = _.cloneDeep(field.relationField);
          delete field.relationField;
          fieldsUpdate.push(field);
          relationField.fieldLabel =
            !_.isNil(relationField) && _.isString(relationField.fieldLabel)
              ? relationField.fieldLabel
              : JSON.stringify(relationField.fieldLabel);
          delete relationField.createdDate;
          delete relationField.createdUser;
          delete relationField.updatedUser;
          fieldsUpdate.push(relationField);
        } else {
          fieldsUpdate.push(field);
        }
      })
    }
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_UPDATE_CUSTOM_FIELD_INFO))
    props.handleUpdateCustomFieldInfo(FIELD_BELONG.TASK, deleteSummaryFieldTmp, fieldsUpdate, tabListUpdateTmp, null, null, taskCurrentId);
    props.changeScreenMode(false);
  }

  const onDelAddTab = (tabListDelAddAfter, tabListAfter) => {
    const tabArray = [];
    if (tabListDelAddAfter.length > 0) {
      setTabListShow(_.cloneDeep(tabListDelAddAfter));
      tabListDelAddAfter.map(it => {
        tabArray.push(it.tabId)
      })
    }
    let listTemp = tabListAfter.sort((a, b) => a.tabOrder - b.tabOrder);
    listTemp = listTemp.map((it, index) => {
      let obj = {}
      if (tabArray.includes(it.tabId)) {
        obj = Object.assign(it, { isDisplay: true, tabOrder: index + 1 })
      } else {

        obj = Object.assign(it, { isDisplay: false, tabOrder: tabListDelAddAfter.length + index + 1 })
      }
      return obj
    })
    setTabListUpdate(listTemp);
    setTabList(_.cloneDeep(tabListAfter));
  }

  let isChangeField = false;
  const isChangeSettingField = (isChange: boolean) => {
    isChangeField = isChange;
    return isChange;
  }

  const [countSave] = useState({});
  const openDynamicSelectFields = async (currentSettingMode, currentField) => {
    if (
      isChangeField &&
      currentFieldEdit &&
      (currentField.fieldId > 0 || (currentField.fieldId < 0 && !_.isNil(currentField.userModifyFlg))) &&
      currentField.fieldId !== currentFieldEdit.fieldId
    ) {
      const onEdit = () => {
        setPopupSettingMode(currentSettingMode);
        setCurrentFieldEdit(currentField);
      };
      const onCancel = () => { };
      await DialogDirtyCheck({
        onLeave: onEdit,
        onStay: onCancel
      });
    } else {
      setPopupSettingMode(currentSettingMode);
      setCurrentFieldEdit(currentField);
    }
    if (currentFieldEdit && currentFieldEdit.fieldId < 0 && _.isNil(currentFieldEdit.userModifyFlg)
      && _.isNil(countSave[currentFieldEdit.fieldId]) && currentField.fieldId !== currentFieldEdit.fieldId) {
      const summaryFieldsTmp = _.cloneDeep(summaryFields);
      const idx = summaryFieldsTmp.findIndex(e => e.fieldId === currentFieldEdit.fieldId);
      if (idx >= 0) {
        countSave[currentFieldEdit.fieldId] = 0;
        summaryFieldsTmp.splice(idx, 1);
        setSummaryFields(summaryFieldsTmp);
      }
    }
  }

  const deleteFieldUnAvailable = (fieldInfo) => {
    const fieldsUnAvailable = _.cloneDeep(taskFieldUnvailable);
    const index = fieldsUnAvailable.findIndex(e => e.fieldId === fieldInfo.fieldId)
    if (index >= 0) {
      fieldsUnAvailable.splice(index, 1);
      deletedSummaryFields.push(fieldInfo.fieldId);
      setTaskFieldUnvailable(fieldsUnAvailable);
    }
  }

  const destroySaveField = () => {
    setIsSaveField(false);
  }
  const [waringAvailabelFlg, ] = useState(false);

  const WAR_COM_0010 = "WAR_COM_0010";
  const WAR_COM_0013 = "WAR_COM_0013";

  const displayToastMessage = (message, type, styleClass) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { type, message, styleClass };
    objParams.type = type;
    objParams.message = [message];
    objParams.styleClass = styleClass;
    setToastMessage(objParams);
    if (type === MessageType.Success || message === WAR_COM_0010 || message === WAR_COM_0013) {
      setTimeout(() => {
        setToastMessage(null);
      }, TIMEOUT_TOAST_MESSAGE);
    }
  };

  const onShowMessage = (message, type) => {
    if (type === TypeMessage.downloadFileError) {
      setMessageDownloadFileError(message);
    } else if (type === TypeMessage.deleteWarning) {
      displayToastMessage(WAR_COM_0013, MessageType.Warning, 'block-feedback block-feedback-yellow text-left')
    }
    setTimeout(() => {
      setMessageDownloadFileError(null);
    }, TIMEOUT_TOAST_MESSAGE);
  };

  const displayNormalMessage = (message, type) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { type, message };
    objParams.type = type;
    objParams.message = [message];
    setNormalMessage(objParams);
  };

    /**
   * Handle for clicking the outside of dropdown
   * @param e
   */
  const handleClickOutside = (e) => {
    if (actionTabRef.current && !actionTabRef.current.contains(e.target)) {
      setIsOpenMenuAddTab(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);
  
  useEffect(() => {
    if (props.action === DetailTaskAction.UpdateCustomFileInfoSuccess) {
      setFieldCallback(null);
      setSummaryFields(null);
    }
  }, [props.action]);

  useEffect(() => {
    if (props.taskSuccessMessage) {
      setTaskSuccessMsg(props.taskSuccessMessage);
    }
  }, [props.taskSuccessMessage]);

  useEffect(() => {
    displayToastMessage(taskSuccessMsg, MessageType.Success, 'block-feedback block-feedback-green text-left')
  }, [taskSuccessMsg])

  useEffect(() => {
    displayToastMessage(props.successMessage, MessageType.Success, 'block-feedback block-feedback-green text-left')
  }, [props.successMessage])

  useEffect(() => {
    displayToastMessage(props.messageChangeStatusSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
  }, [props.messageChangeStatusSuccess]);

  useEffect(() => {
    displayNormalMessage(props.errorMessageChangeStatusFailed, MessageType.Error);
  }, [props.errorMessageChangeStatusFailed]);

  useEffect(() => {
    if (props.messageUpdateCustomFieldInfoSuccess && props.action === DetailTaskAction.GetTaskAfterUpdateCustomFieldInfoSuccess) {
      displayToastMessage(props.messageUpdateCustomFieldInfoSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
    }
  }, [props.action, props.messageUpdateCustomFieldInfoSuccess]);

  useEffect(() => {
    displayNormalMessage(props.messageUpdateCustomFieldInfoError, MessageType.Error);
    if (props.messageUpdateCustomFieldInfoError) {
      const resultRevert = revertDeletedFields(deletedSummaryFields, summaryFields, taskFieldUnvailable, summaryFieldRevert);
      setSummaryFields(_.cloneDeep(resultRevert.fieldsAvailable));
      setTaskFieldUnvailable(_.cloneDeep(resultRevert.fieldsUnVailable))
      setDeletedSummaryFields(resultRevert.deletedFields)
      setSummaryFieldRevert(resultRevert.fieldsRevert)
    }
  }, [props.messageUpdateCustomFieldInfoError]);

  const renderToastMessage = () => {
    if (toastMessage !== null) {
      return (
        <>
          <div className="message-area message-area-bottom position-absolute">
            {toastMessage.message.map((messsageParams, idx) => {
              return <BoxMessage key={idx} messageType={toastMessage.type} message={getErrorMessage(messsageParams)} styleClassMessage={toastMessage.styleClass} className=' ' />;
            })}
          </div>
        </>
      );
    }
  }

  const renderMessage = () => {
    if (normalMessage === null) {
      if (messageDownloadFileError) {
        return <BoxMessage messageType={normalMessage.type} message={messageDownloadFileError} className={'w-80'} />;
      }
    } else {
      return (
        <>
          {normalMessage.message.map((messsageParams, idx) => {
            return (
              <>
                {messsageParams.map((item, index) => {
                  return <BoxMessage key={index} messageType={normalMessage.type} message={getErrorMessage(item.errorCode)} className={'w-80'} />;
                })}
              </>
            )
          })}
        </>
      );
    }
  };

  /**
* method render message box error or success
*/
  const displayMessageError = () => {
    if (msgError) {
      return (
        <BoxMessage
          messageType={msgError && msgError.length > 0 ? MessageType.Error : MessageType.Success}
          message={msgError && msgError.length > 0 ? msgError : ''}
          className={'w-80'}
        />
      )
    }
  }

  const onSaveField = (fields, paramsEditField, fieldInfoEdit) => {
    setCurrentFieldEdit(null);
    let deleteField = [];
    let listField = _.cloneDeep(fields);
    const resultProcess = processRelationselectOrganization(listField, paramsEditField, deleteField);
    listField = resultProcess.listField;
    deleteField = resultProcess.deleteField;
    const newParamsEditField = resultProcess.newParamsEditField;
    listField = putDataToFieldEdit(listField, newParamsEditField, fieldInfoEdit);

    listField.forEach((field, index) => {
      if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.LOOKUP) {
        const newLookup = createNewFieldLookup(listField, field, deleteField)
        listField = newLookup.listField;
        deleteField = newLookup.deleteField;
      }
      if (field.fieldId === fieldInfoEdit.fieldId) {
        if (field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE) {
          const idx = taskFieldUnvailable.findIndex(e => e.fieldId === field.fieldId)
          if (idx < 0) {
            taskFieldUnvailable.push(field);
          } else {
            taskFieldUnvailable[idx] = field;
          }
          displayToastMessage(WAR_COM_0010, MessageType.Warning, 'block-feedback block-feedback-yellow text-left');
          listField.splice(index, 1);
        } else if (field.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          if (listField.findIndex(e => e.fieldId === field.fieldId) < 0) {
            listField.push(field);
          }
          if (editedSummaryFields.findIndex(e => e === field.fieldId) < 0) {
            editedSummaryFields.push(field.fieldId);
            setEditedSummaryFields(_.cloneDeep(editedSummaryFields));
          }
          const idxUnAvailable = taskFieldUnvailable.findIndex(e => e.fieldId === field.fieldId);
          if (idxUnAvailable >= 0) {
            taskFieldUnvailable.splice(idxUnAvailable, 1);
          }
        }
      }
    });

    for (let i = 0; i < listField.length; i++) {
      listField[i].fieldOrder = i + 1;
    }
    const ret = { listField: null, deleteFields: null };

    setFieldRelationTab(listField.filter(e => isFieldRelationAsTab(e)))

    ret.listField = listField;
    ret.deleteFields = deleteField;
    setFieldCallback(_.cloneDeep(ret));
    return ret;
  };

  const [isEditAvailableField, setIsEditAvailableField] = useState(false);
  const onExecuteAction = (fieldInfo, actionTypeTmp, params) => {
    switch (actionTypeTmp) {
      case DynamicControlAction.SAVE: {
        countSave[fieldInfo.fieldId] = countSave[fieldInfo.fieldId] + 1;
        if (fieldInfo.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          setIsSaveField(true);
        } else {
          const listFieldTmp = summaryFields ? _.cloneDeep(summaryFields) : concatArray(props.task.fieldInfo.filter(e => e.availableFlag > 0), taskFieldUnvailable, fieldInfo)
          if (summaryFields) {
            props.task.fieldInfo.forEach((field) => {
              const index = summaryFields.findIndex(e => e.fieldId === field.fieldId)
              if (index < 0 && field.fieldId === params.fieldId) {
                listFieldTmp.push(field)
              }
            })
          }
          const saveFieldResult = onSaveField(listFieldTmp, params, fieldInfo);
          setSummaryFields(saveFieldResult.listField);
          const arrFieldDel = _.cloneDeep(deleteFieldUnavailable)
          if (saveFieldResult.deleteFields.length > 0) {
            arrFieldDel.push(...saveFieldResult.deleteFields)
          }
          setDeleteFieldUnavailable(arrFieldDel);
        }
        setFieldEdit(fieldInfo);
        setParamsEdit(params);
        if (isEditAvailableField) {
          setPopupSettingMode(SettingModes.AddNotAvailabelInput);
          setIsEditAvailableField(false);
        } else setPopupSettingMode(SettingModes.CreateNewInput);
        break;
      }
      case DynamicControlAction.CANCEL: {
        const summaryFieldsTmp = _.cloneDeep(summaryFields);
        if (summaryFieldsTmp) {
          const idx = summaryFieldsTmp.findIndex(e => e.fieldId === fieldInfo.fieldId);
          if (fieldInfo.fieldId < 0 && (_.isNil(countSave[fieldInfo.fieldId]) || countSave[fieldInfo.fieldId] === 0) && !fieldInfo.copyField) {
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
              countSave[fieldInfo.fieldId] = 0;
              setCurrentFieldEdit(null)
            }
          } else if (fieldInfo.fieldId > 0 && fieldInfo.availableFlag === 0) {
            const idx2 = taskFieldUnvailable.findIndex(e => e.fieldId === fieldInfo.fieldId);
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
            }
            if (idx2 < 0) {
              taskFieldUnvailable.push(fieldInfo);
            }
            setCurrentFieldEdit(null)
          }
        }
        if (!_.isNil(summaryFields)) {
          setSummaryFields(summaryFieldsTmp);
        }
        if (isEditAvailableField) {
          setPopupSettingMode(SettingModes.AddNotAvailabelInput);
          setIsEditAvailableField(false);
        } else setPopupSettingMode(SettingModes.CreateNewInput);
        break;
      }
      case DynamicControlAction.DELETE:
        deleteFieldUnAvailable(fieldInfo);
        if (fieldInfo) {
          setIsDelete(true);
        }
        break;
      case DynamicControlAction.EDIT:
        if (!_.isNil(fieldInfo.fieldId)) {
          setIsEditAvailableField(true);
        }
        openDynamicSelectFields(SettingModes.EditInput, fieldInfo);
        if (fieldInfo.fieldId === null) {
          tabSummaryRef.current.onAddNewField(fieldInfo);
        }
        break;
      default:
        break;
    }
  };

  const renderDynamicSelectFields = () => {
    const listField = _.concat(summaryFields ? summaryFields : [], taskFieldUnvailable);
    return (
      <DynamicSelectField
        onChangeSettingField={isChangeSettingField}
        fieldsUnVailable={taskFieldUnvailable}
        currentSettingMode={popupSettingMode}
        fieldInfos={currentFieldEdit}
        listFieldInfo={listField}
        fieldNameExtension={"task_data"}
        onExecuteAction={currentTab === TAB_ID_LIST.summary ? onExecuteAction : undefined}
        fieldBelong={FIELD_BELONG.TASK}
        getFieldsCallBack={!_.isEmpty(fieldCallback) ? fieldCallback : { listField: props.task.fieldInfo, deleteFields: null }}
      />
    )
  }

  const handleClosePopupModeEdit = () => {
    executeDirtyCheckModeEdit(() => {
      props.changeScreenMode(false);
      setPopupSettingMode(SettingModes.CreateNewInput);
      setTabListUpdate(null);
      setSummaryFields(null);
      setCurrentFieldEdit(null);
      setCurrentFieldEdit(null);
      setTabListShow(initialState.tabListShow)
      setTabList(initialState.tabList);
    });
  }

  /**
   * show message error when submit
   */
  const setMessageError = () => {
    if (props.errorItems) {
      let errorMessages = "";
      props.errorItems.forEach(itemError => {
        if (errorMessages) {
          errorMessages += translate('messages.' + itemError.errorCode);
        } else {
          errorMessages = translate('messages.' + itemError.errorCode);
        }
      });
      setMsgError(errorMessages);
      return;
    }
    if (props.errorMessage) {
      setMsgError(props.errorMessage);
    }
  }

  useEffect(() => {
    switch (actionType) {
      case DetailTaskAction.Error:
        setMessageError();
        break;
      case DetailTaskAction.GetTaskSuccess:
        props.handleInitChangeHistory(taskCurrentId, 1, 30);
        break;
      case DetailTaskAction.UpdateSuccess:
        if (!props.errorMessage && (!props.errorItems || props.errorItems.length === 0)) {
          reloadDataTimeline(taskCurrentId);
          setTimeout(() => {
            if (props.popout) {
              if (props.popoutParams && props.popoutParams.taskId) {
                props.handleInitTaskDetail(props.popoutParams.taskId);
              }
            } else {
              props.handleInitTaskDetail(taskCurrentId);
              setShowModal(true);
            }
          }, TIMEOUT_TOAST_MESSAGE);
          setMsgError("");
          return;
        }
        break;
      case DetailTaskAction.DeleteSuccess:
        if (!props.errorMessage && (!props.errorItems || props.errorItems.length === 0)) {
          setTimeout(() => {
            if (props.popout) {
              updateStateSession(FSActionTypeScreen.SetSession);
              setForceCloseWindow(true);
            } else {
              props.toggleCloseModalTaskDetail();
              props.reset();
            }
          }, TIMEOUT_TOAST_MESSAGE);
          setMsgError("");
          return;
        }
        break;
      default:
        setMsgError("");
        break;
    }
    return () => { }
  }, [actionType]);

  /**
   * Open Modal copy task or subtask
   */
  const onShowModalCopyTask = () => {
    // props.setTaskCopy(dataDetail);
    setOpenPopupCopyTask(true);
    setDataModalTask({
      ...dataModalTask,
      taskId: taskCurrentId,
      parentTaskId: dataInfo.parentTaskId,
      showModal: false,
      taskViewMode: TASK_VIEW_MODES.EDITABLE,
      modeCopy: true
    });
  }

  /**
   * Open Modal preview task or subtask
   */
  const onShowModalPreviewTask = () => {
    setDataModalTask({
      ...dataModalTask,
      taskId: taskCurrentId,
      parentTaskId: dataInfo.parentTaskId,
      showModal: true,
      listFieldPreview: summaryFields,
      taskViewMode: TASK_VIEW_MODES.PREVIEW
    });
  }

  /**
   * close task copy
   */
  const onCloseModalTaskCopy = () => {
    setOpenPopupCopyTask(false);
  }


  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
    }
  };

  /**
  * Handle Back action
  */
  const handleBackPopup = () => {
    if (props.openFromModal) {
      return props.toggleCloseModalTaskDetail();
    }

    if (!showModal) {
      return;
    }
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.SetSession);
      setForceCloseWindow(true);
    } else {
      handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN1);
    }
  };

  /**
  * Handle when change forceCloseWindow
  */
  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN1);
      }
    }
  }, [forceCloseWindow]);


  /**
  * Post message onReceiveMessage
  * @param ev
  */
  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.data.forceCloseWindow) {
          setShowModal(true);
        } else {
          props.toggleCloseModalTaskDetail();
        }
      }
    }
  };

  /**
 * Add EventListener
 */
  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  /**
   * got to pre task
   */
  const gotoPrevTask = () => {
    const index = listTask.findIndex(item => {
      return item.taskId === taskCurrentId;
    });
    if (index === 0) {
      return;
    }
    props.handleInitTaskDetail(listTask[index - 1].taskId);
    setTaskCurrentId(listTask[index - 1].taskId);
    setIndexCurrent(index - 1);
    listHistory.length = 0;
    reloadDataTimeline(listTask[index - 1].taskId);
  }

  /**
   * go to Next Task
   */
  const gotoNextTask = () => {
    const index = listTask.findIndex(item => {
      return item.taskId === taskCurrentId;
    });
    if (index === listTask.length - 1) {
      return;
    }
    props.handleInitTaskDetail(listTask[index + 1].taskId);
    setTaskCurrentId(listTask[index + 1].taskId);
    setIndexCurrent(index + 1);
    listHistory.length = 0;
    reloadDataTimeline(listTask[index + 1].taskId);
  }

  /**
   * useEffect execute firstly
   */
  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
      if (props.popoutParams && props.popoutParams.taskId) {
        props.handleInitTaskDetail(props.popoutParams.taskId);
      }
    }

    if (listTask) {
      const index = listTask.findIndex(item => {
        return item.taskId === taskCurrentId;
      });
      setIndexCurrent(index);
    }

    return () => {
      updateStateSession(FSActionTypeScreen.RemoveSession);
      props.reset();
    };
  }, []);

  useEffect(() => {
    if (props.taskId && props.taskId > 0) {
      props.handleInitTaskDetail(props.taskId);
      setTaskCurrentId(props.taskId);
      setShowModal(true);
    }
  }, [props.taskId])

  /**
   * Copy link clipboard
   */
  const copyUrlDetailTask = () => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = `${window.location.origin}/${props.tenant}/detail-task/${taskCurrentId}`;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  const getMoreDataScroll = () => {
    props.handleInitChangeHistory(taskCurrentId, currentPage + 1, 30);
    setCurretPage(currentPage + 1);
  }

  /**
   * Get task Duration with Japanese date format
   */
  const getTaskDuration = () => {
    if (!dataInfo) {
      return null;
    }
    const taskDuration = [];
    if (dataInfo.startDate) {
      taskDuration.push(dateFnsFormat(dataInfo.startDate, userFormat));
    }
    if (dataInfo.finishDate) {
      taskDuration.push(dateFnsFormat(dataInfo.finishDate, userFormat));
    }
    if (taskDuration.length > 0) {
      return taskDuration.join(' 〜 ');
    }
    return null;
  };

  const addTab = (tabId) => {
    tabList.map((tab) => {
      if (tab.tabId === tabId) {
        tab.isDisplay = true;
        tab.tabOrder = tabListShow[tabListShow.length - 1].tabOrder + 1;
        tabListShow.push(tab)
      }
    })
    const tabListTmp = tabList.filter(e => e.isDisplay === false)
    const tabsUpdate = _.cloneDeep(tabListShow);
    const lastTabOrderDisplay = tabListShow[tabListShow.length - 1].tabOrder;
    tabListTmp.sort((a, b) => a.tabOrder - b.tabOrder).forEach((item, idx) => {
      item.tabOrder = lastTabOrderDisplay + idx + 1;
      tabsUpdate.push(item);
    })
    setTabListShow(_.cloneDeep(tabListShow))
    onDelAddTab(tabListShow, tabList);
  }

  const renderActionTab = () => {
    if (tabListShow !== null && tabList !== null && tabListShow.length < tabList.length && props.screenMode === ScreenMode.EDIT) {
      return (
        <div className="add-tab-wrap active" ref={actionTabRef}>
          <div className="add-tab" onClick={() => setIsOpenMenuAddTab(!isOpenMenuAddTab)}></div>
          {isOpenMenuAddTab && tabListShow && tabListShow.length < tabList.length &&
            <div className="box-select-option z-index-9">
              <ul>
                {tabList.map((tab, idx) => {
                  let tabHidden = true;
                  tabListShow.forEach((tabShow) => {
                    if (tab.tabId === tabShow.tabId) {
                      tabHidden = false;
                    }
                  })
                  if (tabHidden === true) {
                    return (
                      <>
                        <li><a key={idx} onClick={(tabId) => addTab(tab.tabId)} >{getFieldLabel(tab, 'labelName')}</a></li>
                      </>
                    )
                  }
                })}
              </ul>
            </div>
          }
        </div>
      )
    } else {
      return <></>
    }
  }

  const calculateHeightTable = () => {
    if (currentTab === TAB_ID_LIST.summary && tableListRef && tableListRef.current) {
      const height = window.innerHeight - tableListRef.current.getBoundingClientRect().top - 160;
      if (height !== heightTable) {
        setHeightTable(height);
      }
    }
  }

  const onClickDetailMilestone = (milestoneId) => {
    if (props.onClickDetailMilestone) {
      props.onClickDetailMilestone(milestoneId);
    } else {
      setSelectedMilestone({ milestoneId });
      setOpenModalDetailMilestone(true);
    }
  }

  /**
   * event close popup detail milestone
   * @param reloadFlag
   */
  const toggleCloseModalMilesDetail = (reloadFlag = false) => {
    if (reloadFlag) {
      props.handleInitTaskDetail(taskCurrentId);
    }
    setOpenModalDetailMilestone(false);
  }

  const onOpenModalSubTaskDetail = (subTaskId) => {
    if (props.onOpenModalSubTaskDetail) {
      props.onOpenModalSubTaskDetail(subTaskId);
    } else {
      setSelectedSubTask(subTaskId);
      setOpenModalDetailSubTask(true);
    }
  }

  /**
   * event close popup detail subtask
   * @param reloadFlag
   */
  const toggleCloseModalSubTaskDetail = (reloadFlag = false) => {
    if (reloadFlag) {
      props.handleInitTaskDetail(taskCurrentId);
    }
    setOpenModalDetailSubTask(false);
  }

  const renderTabContents = () => {
    calculateHeightTable();
    return (<>
      {task && tabList && currentTab === TAB_ID_LIST.summary && <TabSummary
        ref={tabSummaryRef}
        key={task.taskId}
        task={...task}
        screenMode={screenMode}
        handleReorderField={props.handleReorderField}
        onChangeFields={onChangeSummaryFields}
        editedFields={editedSummaryFields}
        summaryFields={summaryFields}
        onClickDetailMilestone={onClickDetailMilestone}
        onOpenModalSubTaskDetail={onOpenModalSubTaskDetail}
        openDynamicSelectFields={openDynamicSelectFields}
        tabList={tabList}
        isSaveField={isSaveField}
        destroySaveField={destroySaveField}
        fieldEdit={fieldEdit}
        paramsEdit={paramsEdit}
        onShowMessage={onShowMessage}
        onSaveField={onSaveField}
        taskId={props.taskId}
        countSave={countSave}
        checkOnline={props.checkOnline}
        resetOnline={props.resetOnline}
        taskAllFields={props.task}
        deletedFields={deletedSummaryFields}
        edittingField={currentFieldEdit}
        fieldsUnavailable={taskFieldUnvailable}
        popout={props.popout}
      />
      }
      {currentTab === TAB_ID_LIST.changeHistory &&
        <TabChangeHistory
          key={task.taskId}
          changeHistory={listHistory}
          languageId={Storage.session.get('locale', 'ja_jp')}
          taskLayout={taskLayout}
          getMoreDataScroll={getMoreDataScroll}
          tenant={props.tenant}
          tabList={tabList}
        />
      }
      <RelationDisplayTab
        id="taskRelationId"
        recordData={props.task && props.task.dataInfo ? props.task.dataInfo.task : null}
        fieldNameExtension="taskData"
        isHeader={false}
        listFieldInfo={fieldRelationTab}
        currentTabId={currentTab}
      />
    </>)
  }

  /**
   * check user login use activity service
   */
  const checkActivityService = () => {
    const ACTIVITY_SERVICE_ID = 6;
    return props.screenMode === ScreenMode.DISPLAY && props.servicesInfo && props.servicesInfo.findIndex((service) => service.serviceId === ACTIVITY_SERVICE_ID) !== -1;
  }

  const {
    isDragging,
  } = useDragLayer(monitor => ({
    isDragging: monitor.isDragging()
  }));

  const handleScrollIsDragging = e => {
    const element = e.target;
    if (element.scrollTop === 0) {
      setIsScrollMin(true);
    } else {
      setIsScrollMin(false)
    }
  };

  useEffect(() => {
    if (props.screenMode === ScreenMode.DISPLAY) {
      setNormalMessage({ type: MessageType.None, message: [] })
      setEditedSummaryFields([])
    }
  }, [props.screenMode]);

  const renderDragTabSuccess = () => {
    return <>
      {isDragging && !isScrollMin && <div className="box-common-drag-drop-success">
        <span>{translate('tasks.detail.info.infoScroll')}</span>
      </div>}
    </>
  }

  const handleCloseModalTask = (toggleModal) => {
    reloadDataTimeline(taskCurrentId);
    if (toggleModal && !dataModalTask.modeCopy) {
      setDataModalTask({
        ...dataModalTask,
        showModal: false
      });
    }
  }

  /**
   * render common right must have license
   */
  const renderCommonTimeline = () => {
    if (props.listLicense && props.listLicense.includes(LICENSE.TIMELINE_LICENSE)) {
      return (<div className={"popup-content-common-right background-col-F9 v2 wrap-timeline" + (props.screenMode === ScreenMode.DISPLAY ? "" : " hidden")}>
        <div className="button">
          <a className={"icon-small-primary " + (showTimeline ? "icon-next" : "icon-prev")} onClick={() => setShowTimeline(!showTimeline)} />
        </div>
        {showTimeline &&
          <TimelineCommonControl
            objectId={[taskCurrentId]}
            serviceType={TIMELINE_SERVICE_TYPES.TASK}
            isDataChange={(isChange) => setIsChangeTimeline(isChange)}
          />
        }
      </div>)
    }
  }

  const onClickOpenModalFormActivity = () => {
    if (!showModalActivity) {
      setShowModalActivity(true);
      setActivityId(null);
      document.body.classList.add("wrap-activity");
    }
  }

  const onSaveSuccess = (id) => {
    setShowModalActivity(false);
    setActivityId(id)
    setShowActivityDetail(true);
  }

  const checkShowFullScreen = () => {
    return !showTimeline && props.screenMode === ScreenMode.DISPLAY;
  }

  const getClassNamePopup = () => {
    if (props.screenMode === ScreenMode.EDIT) {
      return 'wrap-popup-content popup-content-task-wrap';
    } else if (showTimeline) {
      return 'popup-content-task-wrap';
    } else {
      return 'popup-content-task-wrap popup-content-close'
    }
  }

  const renderHeader = () => {
    return <>
      <div className="left">
        <div className="popup-button-back">
          {canBack ?
            <a onClick={handleBackPopup} className="icon-small-primary icon-return-small"></a>
            :
            <a className="icon-small-primary icon-return-small disable" title="" onClick={() => { }}></a>
          }
          <span className="text text-over-width text-break"><img className="icon-register" src="/content/images/task/ic-time1.svg" />{dataInfo ? dataInfo.taskName : ''}</span>
          <span className="text2">
            {getTaskDuration()}
          </span>
        </div>
      </div>
      <div className="right">
        <a className="icon-small-primary icon-share" onClick={(url) => copyUrlDetailTask()} />
        {showModal && <>
          <a onClick={() => openNewWindow()} className="icon-small-primary icon-link-small" />
          <a onClick={() => handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN2)} className="icon-small-primary icon-close-up-small line" />
        </>}
      </div>
    </>
  }

  const renderPopup = () => {
    return <>{openModalDetailMilestone &&
      <DetailMilestoneModal
        milesActionType={null}
        milestoneId={selectedMilestone.milestoneId}
        toggleCloseModalMilesDetail={toggleCloseModalMilesDetail}
        openFromModal={true}
      />}
      {openModalDetailSubTask &&
        <DetailSubTaskModal iconFunction="ic-task-brown.svg"
          taskId={selectedSubTasks}
          parentId={taskCurrentId}
          toggleCloseModalTaskDetail={toggleCloseModalSubTaskDetail}
          canBack={true}
          onClickDetailMilestone={onClickDetailMilestone}
        />}
      </>;
  }

  const renderTaskDetail = () => {
    return <>
      <div className="wrap-task">
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right popup-modal-common show" id="popup-esr" aria-hidden="true">
          <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
            <div className="modal-content">
              {renderDragTabSuccess()}
              <div className="modal-header">
                {renderHeader()}
              </div>
              <div className="modal-body style-3">
                <div className="notify-message">
                  {waringAvailabelFlg && (() => toast('abc xyz'))}
                </div>
                <div className="popup-content h100 popup-task-no-padding style-3 overflow-hidden">
                  <div className="popup-tool popup-tool-v2">
                    {
                      checkActivityService() && <img className="icon-bag-white cursor-pointer" src="/content/images/common/ic-bag.svg" onClick={onClickOpenModalFormActivity} />
                    }
                    {
                      props.screenMode === ScreenMode.EDIT &&
                      <label className="button-blue button-blue-line">{translate('tasks.detail.form.label-infor')}</label>
                    }
                    <div className="message-area">
                      {renderMessage()}
                      {displayMessageError()}
                    </div>
                    <div className="toolbox">
                      <div>
                        <a className="icon-small-primary icon-copy-small" onClick={() => onShowModalCopyTask()} />
                        {dataInfo && dataInfo.isTaskOperator &&
                          <>
                            <a className="icon-small-primary icon-edit-small" onClick={() => onShowModalEditTask()} />
                            <a className="icon-small-primary icon-erase-small" onClick={() => onShowDeleteDialog(dataInfo)} />
                          </>}
                        {screenMode === ScreenMode.DISPLAY ?
                          <>
                            <a className={isAdmin ? 'button-primary button-add-new' : 'button-primary button-add-new disable'} onClick={() => isAdmin ? props.changeScreenMode(true) : null}>{translate('tasks.detail.form.button-setting')}</a>
                          </> : null
                        }
                        {props.screenMode === ScreenMode.EDIT &&
                          <>
                            <a onClick={handleClosePopupModeEdit} className="button-cancel">{translate('employees.detail.label.button.cancel')}</a>
                            {_.isEqual(popupSettingMode, SettingModes.EditInput) ? <a className="button-blue disable">{translate('employees.detail.label.button.save')}</a>
                              : <a onClick={updateCustomFieldInfo} className="button-blue">{translate('employees.detail.label.button.save')}</a>
                            }
                          </>
                        }
                        {((listTask && indexCurrent !== 0) || !listTask) && <a className={listTask ? 'icon-small-primary icon-prev' : 'icon-small-primary icon-prev disable'} onClick={() => gotoPrevTask()} />}
                        {((listTask && indexCurrent !== listTask.length - 1) || !listTask) && <a className={listTask ? 'icon-small-primary icon-next' : 'icon-small-primary icon-next disable'} onClick={() => gotoNextTask()} />}
                      </div>
                    </div>
                  </div>
                  <div className={getClassNamePopup()}>
                    <div className={"popup-content-task-left" + (checkShowFullScreen() ? " w-100" : "")}>
                      {screenMode === ScreenMode.EDIT && (
                        <a className="button-primary button-activity-registration content-left"
                          onClick={() => onShowModalPreviewTask()}
                        >{translate('tasks.detail.form.button-preview')}</a>
                      )}
                      <div className="flag-wrap">
                        <img className="icon-task" src="/content/images/task/ic-time1.svg" />
                        <div>
                          <div className="font-size-18 text-break">{dataInfo ? dataInfo.taskName : ''}</div>
                          <div className="font-size-12">
                            {getTaskDuration()}
                          </div>
                        </div>
                      </div>
                      <div className="popup-content-task-content v2">
                        <div className="tab-detault">
                          <ul className="nav nav-tabs tab-detail-in-global">
                            {tabList && tabListShow ? <TabList onChangeTab={changeTab}
                              key={currentTab}
                              tabList={...tabList}
                              tabListShow={tabListShow}
                              onDragDropTabList={onDragDropTabList}
                              deleteAddTab={onDelAddTab}
                              currentTab={currentTab}
                              screenMode={props.screenMode}
                            /> : null}
                            <RelationDisplayTab
                              id="taskRelationId"
                              isHeader={true}
                              listFieldInfo={fieldRelationTab}
                              currentTabId={currentTab}
                              onChangeTab={changeTab}
                            />
                            {renderActionTab()}
                          </ul>
                          <div className="tab-content overflow-x-hidden style-3 overflow-y-hover" style={{ height: heightTable }} onScroll={handleScrollIsDragging} ref={tableListRef}>{renderTabContents()}</div>
                        </div>
                      </div>
                      {dataInfo &&
                        <>
                          <div className="user-popup-form-bottom">
                            {dataInfo && dataInfo.isTaskOperator &&
                              (dataInfo.statusTaskId === STATUS_TASK.COMPLETED ? (
                                <a className="button-blue disable">{translate('tasks.detail.form.button-update')}</a>
                              ) : (
                                  <a onClick={() => onShowUpdateStatusDialog(dataInfo)} className="button-blue">
                                    {translate('tasks.detail.form.button-update')}
                                  </a>
                                ))}
                          </div>
                        </>
                      }
                    </div>
                    {renderCommonTimeline()}
                    {props.screenMode === ScreenMode.EDIT && renderDynamicSelectFields()}
                  </div>
                </div>
                {renderToastMessage()}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show" />

        {openPopupUpdateTaskStatus &&
          <>
            <div className="popup-esr2 popup-task-body" id="popup-esr2">
              <div className="popup-esr2-content">
                <div className="popup-task-content">
                  <div className="title">{translate("tasks.list.popup.verification")}</div>
                  <div className="text">{translate("tasks.list.popup.youcantsubtasktoincomplete")}</div>
                </div>
                <div className="footer">
                  <a title="" className="button-blue" onClick={() => onUpdateTaskStatus(TASK_UPDATE_FLG.MOVE_TASK_SUBTASK_TO_DONE)}>{translate("global-tool.popup.subtaskalsocomplete")}</a>
                  <a title="" className="button-blue" onClick={() => onUpdateTaskStatus(TASK_UPDATE_FLG.CHANGE_SUBTASK_TO_TASK_MOVE_TASK_TO_DONE)}>{translate("global-tool.popup.convertsubtasktotask")}</a>
                  <a title="" className="button-cancel" onClick={() => setOpenPopupUpdateTaskStatus(false)}>{translate("global-tool.popup.cancel")}</a>
                </div>
              </div>
            </div>
            <div className="modal-backdrop2 show"></div>
          </>
        }

        {openPopupDeleteTask2 &&
          <>
            <div className="popup-esr2 popup-task-body" id="popup-esr2">
              <div className="popup-esr2-content">
                <div className="popup-task-content">
                  <div className="title">{translate("global-tool.popup.delete")}</div>
                  <div className="text">{translate("global-tool.popup.areyousuredelete")}</div>
                </div>
                <div className="footer">
                  <a title="" className="button-red" onClick={() => onDeleteTask(processFlg)}>{translate("global-tool.popup.delete")}</a>
                  <a title="" className="button-cancel" onClick={() => setOpenPopupDeleteTask2(false)}>{translate("global-tool.popup.cancel")}</a>
                </div>
              </div>
            </div>
            <div className="modal-backdrop2 show"></div>
          </>
        }
        {openPopupDeleteTask3 &&
          <>
            <div className="popup-esr2 popup-task-body" id="popup-esr2">
              <div className="popup-esr2-content">
                <div className="popup-task-content">
                  <div className="title">{translate("global-tool.popup.confirm")}</div>
                  <div className="text">{translate("global-tool.popup.taskdeletecontainsubtask")}</div>
                </div>
                <div className="footer">
                  <a title="" className="button-blue" onClick={() => onDeleteTask(TASK_DELETE_FLG.DELETE_TASK_SUBTASK)}>{translate("global-tool.popup.deletesubtask")}</a>
                  <a title="" className="button-blue" onClick={() => onDeleteTask(TASK_DELETE_FLG.DELETE_TASK_CONVERT_SUBTASK)}>{translate("tasks.detail.form.text-delete-3")}</a>
                  <a title="" className="button-cancel" onClick={() => setOpenPopupDeleteTask3(false)}>{translate("global-tool.popup.cancel")}</a>
                </div>
              </div>
            </div>
            <div className="modal-backdrop2 show"></div>
          </>
        }

        {openPopupCopyTask &&
          <ModalCreateEditTask
            backdrop={!showModal}
            toggleCloseModalTask={onCloseModalTaskCopy}
            iconFunction="ic-time1.svg"
            // isFromGlobalTool={props.isFromGlobalTool}
            {...dataModalTask}
          />
        }
        {dataModalTask.showModal && !dataModalTask.parentTaskId && <ModalCreateEditTask
          backdrop={!showModal}
          toggleCloseModalTask={onCloseModalTask}
          iconFunction="ic-time1.svg"
          toggleNewWindow={handleCloseModalTask}
          // isFromGlobalTool={props.isFromGlobalTool}
          {...dataModalTask} />}
        {dataModalTask.showModal && dataModalTask.parentTaskId && <ModalCreateEditSubTask
          backdrop={!showModal}
          toggleCloseModalTask={onCloseModalTask}
          iconFunction="ic-time1.svg"
          toggleNewWindow={handleCloseModalTask}
          {...dataModalTask}
          // isFromGlobalTool={props.isFromGlobalTool}
        />}
        {showModalActivity && 
          <ActivityModalForm
            activityActionType={activityActionType}
            activityViewMode={activityViewMode}
            activityId={null}
            onCloseModalActivity={() => {
              setShowModalActivity(false);
              document.body.className = "wrap-task";
            }}
            onSaveSussecc={onSaveSuccess}
            taskId={taskCurrentId}
            canBack={true}
            isOpenFromAnotherModule={true}
          />
        }
        {renderPopup()}
      </div>
    </>
  }

  if (showModal) {
    return <>
      <Modal isOpen fade toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-field-search" autoFocus>
        {renderTaskDetail()}
      </Modal></>;
  } else {
    if (props.popout) {
      return <>{renderTaskDetail()}</>;
    } else {
      return <></>;
    }
  }

};
const mapDispatchToProps = {
  reset,
  changeScreenMode,
  handleInitTaskDetail,
  handleInitChangeHistory,
  handleReorderField,
  handleUpdateStatusTask,
  handleDeleteTask,
  startExecuting,
  setTaskCopy,
  handleUpdateCustomFieldInfo,
  moveScreenReset,
  checkOnline,
  resetOnline,
  handleInnitGetExtTimelineFilter
};
const mapStateToProps = ({ detailTask, authentication, applicationProfile, screenMoveState, menuLeft }: IRootState) => ({
  tenant: applicationProfile.tenant,
  task: detailTask.task,
  changeHistory: detailTask.changeHistory,
  taskLayout: detailTask.taskLayout,
  screenMode: detailTask.screenMode,
  authorities: authentication.account.authorities,
  actionType: detailTask.action,
  errorItems: detailTask.errorItems,
  errorMessage: detailTask.errorMessage,
  successMessage: detailTask.successMessage,
  taskFieldsUnVailable: detailTask.taskFieldsUnVailable,
  dataDetail: detailTask.dataDetail,
  messageUpdateCustomFieldInfoSuccess: detailTask.messageUpdateCustomFieldInfoSuccess,
  messageUpdateCustomFieldInfoError: detailTask.messageUpdateCustomFieldInfoError,
  action: detailTask.action,
  screenMoveInfo: screenMoveState.screenMoveInfo,
  errorMessageChangeStatusFailed: detailTask.errorMessageChangeStatusFailed,
  messageChangeStatusSuccess: detailTask.messageChangeStatusSuccess,
  servicesInfo: menuLeft.servicesInfo,
  isCloseAllWindownOpened: detailTask.isCloseAllWindownOpened,
  listLicense: authentication.account.licenses
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
  mapStateToProps, mapDispatchToProps
)(DetailTaskModal);

