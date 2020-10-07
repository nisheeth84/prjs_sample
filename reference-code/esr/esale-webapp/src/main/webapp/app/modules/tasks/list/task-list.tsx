import '../../../../content/css/custom.css';
import { connect } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { STATUS_TASK, TASK_UPDATE_FLG, TASK_TABLE_ID, TASKS_UPDATE_FLG, TASK_DELETE_FLG, RESPONSE_FIELD_NAME, IS_PUBLIC } from 'app/modules/tasks/constants'
import { translate } from 'react-jhipster';
import { SEARCH_MODE, DEFINE_FIELD_NAME_TASK, VIEW_CARD_LIMIT, TASK_STATUS_KEY } from 'app/modules/tasks/constants'
import GlobalControlRight from 'app/modules/global/global-tool'
import CreateEditMilestoneModal from 'app/modules/tasks/milestone/create-edit/create-edit-milestone-modal'
import { startExecuting } from 'app/shared/reducers/action-executing';
import { useId } from "react-id-generator";
import {
  getFieldInfoPersonals
} from 'app/shared/layout/dynamic-form/list/dynamic-list.reducer';
import {
  handleGetLocalNavigation,
  handleOpenCardView,
  handleDeleteTask,
  handleUpdateTaskStatus,
  TaskAction,
  handleSearchTask,
  handleUpdateListStaskStatus, handleGetCustomFieldsInfo, ACTION_TYPES,
  handleUpdateTask,
  changeScreenMode,
  handleLocalSearchTask,
  handleChangeOffset
} from 'app/modules/tasks/list/task-list.reducer';
import { FIELD_BELONG, ScreenMode, MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import TaskTable from 'app/modules/tasks/list/task-table'
import TaskCard from 'app/modules/tasks/list/task-card';
import TaskControlTop from 'app/modules/tasks/control/task-control-top'
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import ModalCreateEditSubTask from 'app/modules/tasks/create-edit-subtask/modal-create-edit-subtask';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import PopupFieldsSearch from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from '../constants';
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
import DetailTaskModal from 'app/modules/tasks/detail/detail-task-modal';
import DetailMilestoneModal from 'app/modules/tasks/milestone/detail/detail-milestone-modal';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import _ from 'lodash';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import { DEFINE_FIELD_TYPE, FieldInfoType } from 'app/shared/layout/dynamic-form/constants';
import BrowserDirtyCheck from 'app/shared/layout/common/browser-dirty-check';
import StringUtils from 'app/shared/util/string-utils';
import HelpPopup from 'app/modules/help/help';
import { CATEGORIES_ID } from 'app/modules/help/constant';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import { WindowActionMessage } from 'app/shared/layout/menu/constants';
import useEventListener from 'app/shared/util/use-event-listener';
import PopupMenuSet from 'app/modules/setting/menu-setting';
import { isExceededCapacity } from 'app/shared/util/file-utils';

export interface ITaskListProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
  screenMode: any;
}
/**
 * Component show list task
 * @param props
 *
 */
export const TaskList = (props: ITaskListProps) => {
  const [openPopupUpdateTaskStatus, setOpenPopupUpdateTaskStatus] = useState(false);
  const [openPopupUpdateListTaskStatus, setOpenPopupUpdateListTaskStatus] = useState(false)
  const [openPopupEditModeTaskStatus, setOpenPopupEditModeTaskStatus] = useState(false)
  const [openPopupDeleteTask2Button, setOpenPopupDeleteTask2Button] = useState(false);
  const [openPopupDeleteTask3Button, setOpenPopupDeleteTask3Button] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedSubTasks, setSelectedSubTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchLocal, setSearchLocal] = useState('');
  const [deleteTaskFlg, setDeleteTaskFlg] = useState(0);
  const [searchMode, setSearchMode] = useState(SEARCH_MODE.NONE);
  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const [searchConditions, setSearchConditions] = useState(null);
  const [newStatusId, setNewStatusId] = useState();
  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [openSwitcher, openShowSwitcher] = useState(false);
  const [filterConditions, setFilterConditions] = useState([]);
  const [orderBy, setOrderBy] = useState([]);
  const [openModalCreateMilestone, setOpenModalCreateMilestone] = useState(false);
  const [openModalDetailMilestone, setOpenModalDetailMilestone] = useState(false);
  const [openModalDetailCustomer, setOpenModalDetailCustomer] = useState(false);
  const [offset, setOffset] = useState(0);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const [dataModalTask, setDataModalTask] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE })
  const [openModalDetailTask, setOpenModalDetailTask] = useState(false);
  const [openModalDetailSubTask, setOpenModalDetailSubTask] = useState(false);
  const [taskListByStatus, setTaskListByStatus] = useState([[], [], []]);
  const [taskListToDetail, setTaskListToDetail] = useState([]);
  const [openCardView, setOpenCardView] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const tableListRef = useRef(null);
  const cardListRef = useRef(null);
  const [saveEditValues, setSaveEditValues] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [fileUploads, setFileUploads] = useState({});
  const [selectedTargetType,] = useState(0);
  const [selectedTargetId,] = useState(0);
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);
  const classAddCreateOrther: string[][] = [['select-text', 'text-ellipsis']];
  const formId = "mode-simple-edit";
  const [isChanged, setIsChanged] = useDetectFormChange(formId, [], classAddCreateOrther);
  const { fieldInfoSearch, customFieldInfoSearch } = props;
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState(false);
  const [msgErrorBox, setMsgErrorBox] = useState(null);
  const customerDetailCtrlId = useId(1, "taskListCustomerDetailCtrlId_");


  useEffect(() => {
    setIsChanged(false)
  }, [props.screenMode])

  useEffect(() => {
    props.handleChangeOffset({
      NOT_STARTED: 0,
      WORKING: 0,
      COMPLETED: 0
    })
    props.handleGetCustomFieldsInfo();
    document.body.className = "wrap-task";
    props.changeScreenMode(false);
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_GET_TASKS));
    props.handleOpenCardView(true);
    props.handleGetLocalNavigation();
    return () => {
      document.body.className = "";
    }
  }, []);

  useEffect(() => {
    // open details task from other screen
    const { state } = props.location;
    if (state && state.openDetail && state.recordId) {
      setSelectedTask({ taskId: state.recordId });
      setOpenModalDetailTask(true);
      const stateCopy = { ...state };
      delete stateCopy.openDetail;
      delete stateCopy.recordId;
      props.history.replace({ state: stateCopy });
    }
  }, [props.location]);

  const handleConDisplaySearchDetail = (value) => {
    setConDisplaySearchDetail(value)
    if (!value) {
      setSearchMode(SEARCH_MODE.NONE)
      setSearchConditions([]);
      props.handleSearchTask({ searchCondition: [] })
    }
  }

  useEffect(() => {
    if (props.tasks) {
      const list = [[], [], []];
      list[STATUS_TASK.NOT_STARTED - 1] = props.tasks.filter(task => task.statusTaskId === (STATUS_TASK.NOT_STARTED))
      list[STATUS_TASK.WORKING - 1] = props.tasks.filter(task => task.statusTaskId === (STATUS_TASK.WORKING))
      list[STATUS_TASK.COMPLETED - 1] = props.tasks.filter(task => task.statusTaskId === (STATUS_TASK.COMPLETED))
      setTaskListByStatus(list);
      const listToDetail = [...list[STATUS_TASK.NOT_STARTED - 1], ...list[STATUS_TASK.WORKING - 1], ...list[STATUS_TASK.COMPLETED - 1]];
      setTaskListToDetail(listToDetail);
      if (props.screenMode === ScreenMode.EDIT) {
        setSaveEditValues([]);
        openShowSwitcher(false);
        props.changeScreenMode(false);
      }
    }
  }, [props.tasks])

  useEffect(() => {
    if ((props.actionType === TaskAction.Success || props.actionType === TaskAction.SuccessDelete) && props.successMessage) {
      setShowMessage(true);
      if (openCardView) {
        cardListRef.current.scrollTo(0, 0);
      }
    }
  }, [props.actionType, props.successMessage, props.errorMessage]);

  /**
   * Display message and set time out
   */
  const displayMessage = () => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage(false);
      }, 2000)
    }
    if ((!props.errorMessage || props.errorMessage.length <= 0) && (!props.successMessage || props.successMessage.length <= 0)) {
      return (<></>)
    }
    return (
      <div className="message-area message-area-bottom position-absolute">
        {showMessage && (
          <BoxMessage messageType={MessageType.Success}
            message={translate("messages." + props.successMessage)}
            styleClassMessage="block-feedback block-feedback-green text-left"
            className=" "
          />
        )
        }
      </div>
    )
  }

  /**
   * on click open search popup
   */
  const onOpenPopupSearch = () => {
    if (!openPopupSearch) {
      setOpenPopupSearch(true);
    }
  }

  /**
   * Convert special field to search or filter
   * @param filterOrSearchData 
   */
  const convertSpecialField = (filterOrSearchData) => {
    const filterTmp = _.cloneDeep(filterOrSearchData);
    let filterSearch = props.fieldInfos.fieldInfoPersonals ? _.cloneDeep(props.fieldInfos.fieldInfoPersonals) : [];
    if (filterSearch.length === 0) {
      filterSearch = props.fieldInfoSearch.fieldInfoPersonals ? _.cloneDeep(props.fieldInfoSearch.fieldInfoPersonals) : [];
    }

    for (let i = 0; i < filterTmp.length; i++) {
      const data = filterSearch.find(e => e.fieldName === filterTmp[i].fieldName);
      if (data) {
        filterTmp[i].fieldType = data.fieldType;
        filterTmp[i].isDefault = data.isDefault;
      }
      if (filterTmp[i].fieldName === "is_public" && filterTmp[i].fieldValue !== "") {
        let valueIsPublic = [];
        if (Array.isArray(filterTmp[i].fieldValue)) {
          valueIsPublic = filterTmp[i].fieldValue;
        } else {
          valueIsPublic = JSON.parse(filterTmp[i].fieldValue);
        }
        if (valueIsPublic.length === 2) {
          filterTmp[i].fieldValue = '';
        } else if (valueIsPublic.length === 1) {
          filterTmp[i].fieldType = 90;
          if (IS_PUBLIC.PUBLIC === Number(valueIsPublic[0].toString())) {
            filterTmp[i].fieldValue = "true";
          } else {
            filterTmp[i].fieldValue = "false";
          }
        }
      } else if (filterTmp[i].fieldName === "is_public" && filterTmp[i].fieldValue === "" && filterTmp[i].isSearchBlank) {
        filterTmp[i].fieldValue = "NULL";
      }
    }
    return filterTmp;
  }

  /**
   * Convert special field of type = 99.
   * @param fieldInfos 
   */
  const convertFieldTypeForSpecialField = (fieldInfos) => {
    const customFieldsSpecial = _.cloneDeep(fieldInfos);
    customFieldsSpecial && (customFieldsSpecial.length > 0) && customFieldsSpecial.forEach(e => {
      switch (e.fieldName) {
        case "milestone_name":
          e.fieldType = 9;
          break;
        case "customer_id":
          e.fieldType = 5;
          break;
        case "customer_name":
          e.fieldType = 9;
          break;
        case "products_tradings_id":
          e.fieldType = 5;
          break;
        case "product_name":
          e.fieldType = 9;
          break;
        case "parent_id":
          e.fieldType = 5;
          break;
        case "created_user":
          e.fieldType = 9;
          break;
        case "updated_user":
          e.fieldType = 9;
          break;
        default:
          break;
      }
    })
    return customFieldsSpecial;
  }


  /**
   * event common table set a filter
   * @param filter
   * @param order
   */
  const onActionFilterOrder = (filter, order: []) => {
    setOffset(0);
    setOrderBy(order);
    setSaveEditValues([]);
    const filterTmp = convertSpecialField(filter);
    const finalFilterData = convertFieldTypeForSpecialField(filterTmp);
    setFilterConditions(finalFilterData);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_GET_TASKS))
    props.handleSearchTask({ offset: 0, orderBy: order, filterConditions: finalFilterData, searchConditions });
  }


  /**
   * search task
   * @param searchCondition
   */
  const onSearchCondition = (searchCondition) => {
    setOpenPopupSearch(false);
    const searchTmp = convertSpecialField(searchCondition);
    const finalSearchData = convertFieldTypeForSpecialField(searchTmp);
    setSearchConditions(convertFieldTypeForSpecialField(searchCondition));
    setOffset(0);
    setSearchMode(SEARCH_MODE.CONDITION);
    setSaveEditValues([]);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_GET_TASKS))
    props.handleSearchTask({ offset: 0, orderBy, searchConditions: finalSearchData, filterConditions });
    setSearchLocal('');
  }

  /**
   * event change text search
   * @param searchText
   */
  const onEnterSearchText = (searchText) => {
    setSearchLocal(searchText);
    setOffset(0);
    setSearchMode(SEARCH_MODE.TEXT_DEFAULT);
    setSaveEditValues([]);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_GET_TASKS))
    props.handleLocalSearchTask({ offset: 0, searchLocal: searchText });
  }

  /**
   *  on switch display
   */
  const onOpenSwitchDisplay = () => {
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_GET_CUSTOM_FIELD_INFO))
    props.handleGetCustomFieldsInfo();
    openShowSwitcher(!openSwitcher);
  }

  /**
   * handle close search popup
   * @param saveCondition
   */
  const onClosePopupSearch = (saveCondition) => {
    setOpenPopupSearch(false);
    if (saveCondition && saveCondition.length > 0) {
      setSearchConditions(saveCondition);
    }
  }

  /**
   * change paging
   * @param offsetRecord
   * @param limitRecord
   */
  const onPageChange = (offsetRecord, limitRecord) => {
    setOffset(offsetRecord);
    setLimit(limitRecord);
    setSaveEditValues([]);
    if (props.screenMode === ScreenMode.EDIT) {
      props.changeScreenMode(false);
    }
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_GET_TASKS))
    props.handleSearchTask({ offset: offsetRecord, orderBy, limit: limitRecord, filterConditions, searchConditions });
  }

  /**
 * on scroll
 */
  const onScroll = (e, i) => {
    let isNotStarted = false;
    let isWorking = false;
    let isComplete = false;
    switch(i) {
      case STATUS_TASK.NOT_STARTED:
        isNotStarted = props.tasks.filter(task => task.statusTaskId === (STATUS_TASK.NOT_STARTED)).length < props.totalRecordStatus[0];
        break;
      case STATUS_TASK.WORKING:
        isWorking = props.tasks.filter(task => task.statusTaskId === (STATUS_TASK.WORKING)).length < props.totalRecordStatus[1];
        break;
      case STATUS_TASK.COMPLETED:
        isComplete = props.tasks.filter(task => task.statusTaskId === (STATUS_TASK.COMPLETED)).length < props.totalRecordStatus[2];
        break;
      default:
        break;
    }

    const element = e.target;
    const isScroll = isNotStarted || isWorking || isComplete;
    if (element.scrollTop !== 0 && element.scrollHeight - element.scrollTop === element.clientHeight && isScroll) {
      props.handleChangeOffset({
        NOT_STARTED: isNotStarted ? props.offsets[TASK_STATUS_KEY.NOT_STARTED] + VIEW_CARD_LIMIT : null,
        WORKING: isWorking ? props.offsets[TASK_STATUS_KEY.WORKING] + VIEW_CARD_LIMIT : null,
        COMPLETED: isComplete ? props.offsets[TASK_STATUS_KEY.COMPLETED] + VIEW_CARD_LIMIT : null
      })
      props.handleSearchTask({ filterConditions, searchConditions });
    }
  }

  /**
   * after drag-drop task, call api updateTaskStatus in reducer
   * @param sourceIndex
   * @param oldStatusTask
   * @param newIndex
   * @param newStatusTask
   */
  const onUpdateTaskStatus = (sourceIndex, oldStatusTask, newIndex, newStatusTask) => {
    if (oldStatusTask === newStatusTask) return;
    const item = taskListByStatus[oldStatusTask - 1].splice(sourceIndex, 1)[0];
    taskListByStatus[newStatusTask - 1].push(item)
    setTaskListByStatus(taskListByStatus)
    setSelectedTask(item)
    const unComplete = item.subtasks && item.subtasks.some(t => (t.statusTaskId <= STATUS_TASK.WORKING))
    if (item.statusTaskId === STATUS_TASK.NOT_STARTED && newStatusTask === STATUS_TASK.WORKING) {
      props.handleChangeOffset({
        NOT_STARTED: 0,
        WORKING: 0,
        COMPLETED: 0
      })
      // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_UPDATE_TASK_STATUS))
      props.handleUpdateTaskStatus(item, TASK_UPDATE_FLG.MOVE_TO_DOING)
    }
    if (item.statusTaskId <= STATUS_TASK.WORKING && newStatusTask === STATUS_TASK.COMPLETED) {
      if (item.parentTaskId || !unComplete) {
        props.handleChangeOffset({
          NOT_STARTED: 0,
          WORKING: 0,
          COMPLETED: 0
        })
        // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_UPDATE_TASK_STATUS))
        props.handleUpdateTaskStatus(item, TASK_UPDATE_FLG.MOVE_TO_DONE)
      } else {
        setOpenPopupUpdateTaskStatus(true);
      }
    }
    if (item.statusTaskId >= STATUS_TASK.WORKING && newStatusTask === STATUS_TASK.NOT_STARTED) {
      props.handleChangeOffset({
        NOT_STARTED: 0,
        WORKING: 0,
        COMPLETED: 0
      })
      // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_UPDATE_TASK_STATUS))
      props.handleUpdateTaskStatus(item, TASK_UPDATE_FLG.MOVE_TO_TODO)
    }
    if (item.statusTaskId === STATUS_TASK.COMPLETED && newStatusTask === STATUS_TASK.WORKING) {
      props.handleChangeOffset({
        NOT_STARTED: 0,
        WORKING: 0,
        COMPLETED: 0
      })
      // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_UPDATE_TASK_STATUS))
      props.handleUpdateTaskStatus(item, TASK_UPDATE_FLG.MOVE_TO_DOING)
    }
  }

  /**
   * event on click confirm drag drop popup
   * @param updateFlag
   */
  const onConfirmUpdateTaskStatus = (updateFlag) => {
    // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_UPDATE_LIST_STATUS))
    props.handleUpdateTaskStatus(selectedTask, updateFlag);
    setOpenPopupUpdateTaskStatus(false)
  }
  /**
   * update batch selected tasks
   * @param newStatusTask
   */
  const onUpdateListTaskStatus = (newStatusTask) => {
    const selectedTaskData = props.recordCheckList.filter(task => task.isChecked).map(i => {
      const founds = props.tasks.find(task => task.taskId === i.taskId);
      if (founds) {
        return founds
      }
    }).filter(task => !!task)
    setNewStatusId(newStatusTask)
    switch (newStatusTask) {
      case STATUS_TASK.NOT_STARTED:
      case STATUS_TASK.WORKING:
        // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_UPDATE_LIST_STATUS))
        props.handleUpdateListStaskStatus(selectedTaskData, newStatusTask, TASKS_UPDATE_FLG.MOVE_WITHOUT_CONFIRM);
        break
      case STATUS_TASK.COMPLETED: {
        const isIncomplete = selectedTaskData.some(task => task.subtasks && task.subtasks.some(sub => sub.statusTaskId <= STATUS_TASK.WORKING))
        setSelectedTasks(selectedTaskData);
        if (isIncomplete) {
          setOpenPopupUpdateListTaskStatus(true)
        } else {
          // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_UPDATE_LIST_STATUS))
          props.handleUpdateListStaskStatus(selectedTaskData, newStatusTask, TASKS_UPDATE_FLG.MOVE_WITHOUT_CONFIRM)
        }
        break
      }
      default:
        return
    }
  }

  /**
   * event on click popup confirm update list task status
   * @param updateFlag
   */
  const onConfirmUpdateListTaskStatus = (updateFlag) => {
    props.handleUpdateListStaskStatus(selectedTasks, newStatusId, updateFlag);
    setOpenPopupUpdateListTaskStatus(false)
  }

  /**
   * handle delete a task
   * @param task
   */
  const onOpenDeleteTaskDialog = (task) => {
    const { parentTaskId, subtasks } = task
    setSelectedTasks([task])
    if (parentTaskId || !subtasks || subtasks.length === 0) {
      setDeleteTaskFlg(TASK_DELETE_FLG.DELETE_TASK)
      setOpenPopupDeleteTask2Button(true);
    } else if (subtasks.some(sub => (sub.statusTaskId <= STATUS_TASK.WORKING))) {
      setOpenPopupDeleteTask3Button(true);
    } else {
      setDeleteTaskFlg(TASK_DELETE_FLG.DELETE_TASK_SUBTASK);
      setOpenPopupDeleteTask2Button(true);
    }
  }

  /**
   * clear selected record state
   */
  const removeSelectedRecord = () => {
    tableListRef && tableListRef.current && tableListRef.current.removeSelectedRecord();
  }


  /**
   * call delete task to reducer
   */
  const onConfirmDeleteTask = (deleteFlag) => {
    const flag = deleteFlag || deleteTaskFlg;
    const taskIdList = selectedTasks.map(task => ({ taskId: task.taskId }));
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_DELETE_TASKS))
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_GET_TASKS))
    props.handleChangeOffset({
      NOT_STARTED: 0,
      WORKING: 0,
      COMPLETED: 0
    })
    props.handleDeleteTask(taskIdList, flag, removeSelectedRecord);
    setOpenPopupDeleteTask2Button(false);
    setOpenPopupDeleteTask3Button(false);
  }


  /**
   * delete selected tasks
   */
  const onOpenDeleteListTaskDialog = () => {
    const selectedTaskData = props.recordCheckList.filter(task => task.isChecked).map(task => {
      const found = props.tasks.find(i => i.taskId === task.taskId);
      if (found) {
        return found
      }
    }).filter(task => !!task)
    setSelectedTasks(selectedTaskData)
    const parentTask = selectedTaskData.filter(task => task.parentTaskId === null && task.subtasks && task.subtasks.length > 0);
    if (parentTask && parentTask.length > 0) {
      const isIncomplete = parentTask.some(task => task.subtasks && task.subtasks.some(sub => sub.statusTaskId <= STATUS_TASK.WORKING))
      if (isIncomplete) {
        setOpenPopupDeleteTask3Button(true)
      } else {
        setDeleteTaskFlg(TASK_DELETE_FLG.DELETE_TASK_SUBTASK)
        setOpenPopupDeleteTask2Button(true)
      }
    } else {
      setDeleteTaskFlg(TASK_DELETE_FLG.DELETE_TASK)
      setOpenPopupDeleteTask2Button(true);
    }
  }


  /**
   * close modal create task
   */
  const onCloseModalTask = (actionStatus) => {
    setDataModalTask({
      ...dataModalTask,
      showModal: false
    });
    if (actionStatus) {
      props.handleChangeOffset({
        NOT_STARTED: 0,
        WORKING: 0,
        COMPLETED: 0
      })
      // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_GET_TASKS))
      props.handleSearchTask({ searchConditions });
    }
  }

  /**
 * close modal create/edit Sub task
 */
  const onCloseModalSubTask = () => {
    setDataModalTask({
      ...dataModalTask,
      showModal: false
    });
    props.handleSearchTask({ searchConditions });
  }


  /**
   * close modal create task
   */
  const onShowModalEditTask = (taskActionType, taskId, parentTaskId) => {
    setDataModalTask({
      ...dataModalTask,
      taskActionType,
      taskId,
      parentTaskId,
      showModal: true
    });
  }

  const handleChangeMode = (isViewCard) => {
    if (isViewCard && props.screenMode === ScreenMode.EDIT) {
      return;
    }
    setOpenCardView(isViewCard);
    props.handleOpenCardView(isViewCard);
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_GET_TASKS));
    if (isViewCard) {
      props.handleSearchTask({ searchConditions });
    } else {
      props.handleSearchTask({ offset, limit, searchConditions });
    }
  }

  /**
   * event create milestone popup close
   * @param milestoneId
   */
  const onModalCreateMilestoneClose = (code) => {
    setOpenModalCreateMilestone(false)
  }

  /**
  * event on click open modal detail task
  * @param taskId
  */
  const onClickDetailTask = (taskId) => {
    setSelectedTask({ taskId });
    setOpenModalDetailTask(true);
  }

  /**
   *
   * @param taskId
   */
  const onClickDetailSubTask = (taskId) => {
    setSelectedSubTask({ taskId });
    setOpenModalDetailSubTask(true);
  }

  /**
  * event on click open modal detail milestone
  * @param milestoneId
  */
  const onClickDetailMilestone = (milestoneId) => {
    setSelectedMilestone({ milestoneId });
    setOpenModalDetailMilestone(true);
  }

  /**
  * event on click open modal detail customer
  * @param milestoneId
  */
  const onClickDetailCustomer = (customerId) => {
    if (!customerId) {
      return;
    }
    setSelectedCustomer(customerId);
    setOpenModalDetailCustomer(true);
  }

  /**
  * event on click open modal detail customer
  * @param taskId
  */
  const onClosePopupCustomerDetail = () => {
    document.body.className = 'wrap-task';
    setOpenModalDetailCustomer(false);
    props.handleSearchTask({});
  }

  /**
   * event close detail task and refresh fieldInfoPersonal
   * @param milestoneId
   */
  const refreshFieldInfoPersonal = () => {
    props.getFieldInfoPersonals('TASK_LIST_ID', FIELD_BELONG.TASK, 1, FieldInfoType.Personal, selectedTargetType, selectedTargetId);
    tableListRef.current && tableListRef.current.removeSelectedRecord();
    tableListRef && tableListRef.current && tableListRef.current.reloadFieldInfo();
  }

  const onReceiveMessage = (ev) => {
    if (StringUtils.tryGetAttribute(ev, "data.type") === WindowActionMessage.ReloadList) {
      refreshFieldInfoPersonal();
    }
  }
  useEventListener('message', onReceiveMessage);


  /**
   * event close popup task detail
   * @param taskId
   */
  const toggleCloseModalTaskDetail = (taskId) => {
    props.handleChangeOffset({
      NOT_STARTED: 0,
      WORKING: 0,
      COMPLETED: 0
    })
    setOpenModalDetailTask(false);
    props.handleSearchTask({ searchConditions });
  }

  /**
   * handle action open popup help
   */
  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  /**
  * event close popup sub task detail
  * @param taskId
  */
  const toggleCloseModalSubTaskDetail = () => {
    props.handleChangeOffset({
      NOT_STARTED: 0,
      WORKING: 0,
      COMPLETED: 0
    })
    setOpenModalDetailSubTask(false);
    props.handleSearchTask({});
  }

  /**
   * event close popup detail milestone
   * @param reloadFlag
   */
  const toggleCloseModalMilesDetail = (reloadFlag = false) => {
    props.handleChangeOffset({
      NOT_STARTED: 0,
      WORKING: 0,
      COMPLETED: 0
    })
    setOpenModalDetailMilestone(false);
    if (reloadFlag) {
      props.handleSearchTask({});
    }
  }

  const renderNameTask = (id) => {
    let rs = '';
    const propsTaskList = props.tasks;
    propsTaskList && propsTaskList.map(item => {
      if (item.taskId === id) rs = item.taskName;
    })
    return rs;
  }

  /**
   * Render messenger when Delete Task
   */
  const renderMesDelete = () => {
    const propsCheckList = props.recordCheckList;
    let rs = '';
    if (propsCheckList && propsCheckList.length > 1) {
      rs = translate('messages.WAR_COM_0002', { 0: propsCheckList.length })
    } else {
      const itemName = renderNameTask(selectedTasks[0].taskId);
      rs = translate('messages.WAR_COM_0001', { itemName })
    }
    return rs;

  }

  let taskList = [];
  if (props.tasks) {
    taskList = props.tasks;
  }

  let fields = [];
  if (props.fieldInfos && props.fieldInfos.fieldInfoPersonals) {
    fields = props.fieldInfos.fieldInfoPersonals;
  }

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

  const compareFieldItem = (recordIdx, fieldName, newValue) => {
    const oldValue = taskList[recordIdx][fieldName];
    if (!isEqualTextValue(newValue, oldValue)) {
      return true;
    }
    return false;
  }

  const isChangeInputEdit = () => {
    if (props.screenMode === ScreenMode.DISPLAY || saveEditValues.length <= 0 || taskList.length <= 0 || fields.length <= 0) {
      return false;
    }
    const groupTask = saveEditValues.reduce(function (h, obj) {
      h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
      return h;
    }, {});
    for (const emp in groupTask) {
      if (!Object.prototype.hasOwnProperty.call(groupTask, emp)) {
        continue;
      }
      const recordIdx = taskList.findIndex(e => e['taskId'].toString() === emp.toString());
      if (recordIdx < 0) {
        return true;
      }
      for (let i = 0; i < groupTask[emp].length; i++) {
        const fieldIdx = fields.findIndex(e => e.fieldId.toString() === groupTask[emp][i].fieldId.toString());
        if (fieldIdx < 0) {
          continue;
        }
        const fieldName = fields[fieldIdx].fieldName;
        const newValue = groupTask[emp][i].itemValue;
        const hasChange = compareFieldItem(recordIdx, fieldName, newValue);
        if (hasChange) {
          return true;
        }
      }
    }
    return false;
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (props.screenMode === ScreenMode.DISPLAY) {
      action();
    } else {
      isChanged ? await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: DIRTYCHECK_PARTTERN.PARTTERN2 }) : action();
    }
  }

  const changeEditMode = (isEdit: boolean) => {
    setMsgErrorBox('');
    if (!isEdit) {
      executeDirtyCheck(() => {
        setSaveEditValues([]);
        openShowSwitcher(false);
        setIsDirty(true);
        props.changeScreenMode(isEdit)
      });
    } else {
      if (!taskList || taskList.length < 1) {
        alert('taskList is empty!');
        return;
      }
      setSaveEditValues([]);
      openShowSwitcher(false);
      props.changeScreenMode(isEdit)
    }
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

  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  }

  /**
   * event on click popup confirm edit mode task status
   * @param updateFlag
   */
  const onConfirmEditModeTaskStatus = (updateFlag) => {
    let conditions = null;
    if (searchMode === SEARCH_MODE.TEXT_DEFAULT) {
      conditions = searchLocal;
    } else if (searchMode === SEARCH_MODE.CONDITION) {
      conditions = searchConditions;
    } else {
      conditions = "";
    }
    props.handleChangeOffset({
      NOT_STARTED: 0,
      WORKING: 0,
      COMPLETED: 0
    })
    const files = getfileUploads();
    if (isExceededCapacity(files)) {
      setMsgErrorBox(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else {
      setMsgErrorBox('');
    }
    props.handleUpdateTask(TASK_TABLE_ID, saveEditValues, offset, limit, conditions, filterConditions, true, orderBy, getfileUploads(), updateFlag);
    setOpenPopupEditModeTaskStatus(false)
  }

  /**
   * event on click update tasks
   * @param updateFlag
   */
  const handleUpdateTasks = () => {
    let conditions = null;
    if (searchMode === SEARCH_MODE.TEXT_DEFAULT) {
      conditions = searchLocal;
    } else if (searchMode === SEARCH_MODE.CONDITION) {
      conditions = searchConditions;
    } else {
      conditions = "";
    }

    let isShowDialogConfirm = false;
    saveEditValues.forEach(editValue => {
      const field = props.fieldInfos.fieldInfoPersonals.find(e => e.fieldId.toString() === editValue.fieldId.toString());
      if (field && RESPONSE_FIELD_NAME.STATUS !== StringUtils.snakeCaseToCamelCase(field.fieldName)) {
        return;
      }
      const task = taskList.find(taskTmp => taskTmp.taskId === editValue.itemId);
      if (task && task.parentTaskId === null && task.statusTaskId.toString() !== editValue.itemValue && '3' === editValue.itemValue) {
        const isIncomplete = task.subtasks.some(sub => sub.statusTaskId <= STATUS_TASK.WORKING);
        if (isIncomplete) {
          isShowDialogConfirm = true;
          return false;
        }
      }
    })
    const files = getfileUploads();
    if (isExceededCapacity(files)) {
      setMsgErrorBox(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else {
      setMsgErrorBox('');
    }
    if (isShowDialogConfirm) {
      setOpenPopupEditModeTaskStatus(true);
    } else {
      props.handleChangeOffset({
        NOT_STARTED: 0,
        WORKING: 0,
        COMPLETED: 0
      })
      props.handleUpdateTask(TASK_TABLE_ID, saveEditValues, offset, limit, conditions, filterConditions, true, orderBy, getfileUploads(), null);
    }
  }

  const onUpdateFieldValue = (itemData, type, itemEditValue, idx) => {
    if (type.toString() === DEFINE_FIELD_TYPE.RELATION) {
      return;
    }
    const itemEditValueCopy = _.cloneDeep(itemEditValue);
    const index = saveEditValues.findIndex(e => e.itemId.toString() === itemData.itemId.toString() && e.fieldId.toString() === itemData.fieldId.toString());
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

  /**
   * handle close popup settings
   */
  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }

  /**
   * handle close popup settings
   */
  const dismissDialogSetting = () => {
    setOnOpenPopupSetting(false);
  }

  /**
  * handle action open popup setting
  */
  const handleOpenPopupSetting = () => {
    setOnOpenPopupSetting(true)
  }


  useEffect(() => {
    tableListRef && tableListRef.current && tableListRef.current.updateSizeDynamicList();
  }, [openSwitcher])

  /**
   * Custom FieldInfo when search popupFieldSearch
   * FieldInfo type = 99
   */
  const specialFieldInfoSearch = (fieldSearch) => {
    fieldSearch.forEach(z => {
      if (z.fieldName === DEFINE_FIELD_NAME_TASK.IS_PUBLIC) {
        z.fieldItems = [];
        z.fieldItems.push({
          itemId: IS_PUBLIC.NOT_PUBLIC,
          itemLabel: translate("tasks.list.isPublic.notPublic"),
          itemOrder: 1,
          isAvailable: true
        })
        z.fieldItems.push({
          itemId: IS_PUBLIC.PUBLIC,
          itemLabel: translate("tasks.list.isPublic.public"),
          itemOrder: 2,
          isAvailable: true
        })
        z.fieldType = 1;
      } else if (z.fieldName === DEFINE_FIELD_NAME_TASK.PARENT_ID
        || z.fieldName === DEFINE_FIELD_NAME_TASK.CUSTOMER_ID
        || z.fieldName === DEFINE_FIELD_NAME_TASK.PRODUCTS_TRADINGS_ID) {
        z.fieldType = 5;
      }
    })
  }



  let fieldSearch = [];
  if (fieldInfoSearch?.fieldInfoPersonals) {
    fieldSearch = fieldInfoSearch.fieldInfoPersonals;
    specialFieldInfoSearch(fieldSearch);
  }

  let customFieldSearch = [];
  if (customFieldInfoSearch?.customFieldsInfo) {
    customFieldSearch = customFieldInfoSearch.customFieldsInfo;
    specialFieldInfoSearch(customFieldSearch);
  }

  const showDetailScreen = () => {
    return (
      <>
        {
          <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            showModal={true}
            customerId={selectedCustomer}
            listCustomerId={[]}
            toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
            openFromOtherServices={true}
          />
        }
      </>
    )
  }

  return <>
    <div className="control-esr">
      {dataModalTask.showModal && !dataModalTask.parentTaskId && <ModalCreateEditTask
        toggleCloseModalTask={onCloseModalTask}
        iconFunction="ic-time1.svg"
        {...dataModalTask}
        canBack={false} />}
      {dataModalTask.showModal && dataModalTask.parentTaskId && <ModalCreateEditSubTask
        toggleCloseModalTask={onCloseModalSubTask}
        iconFunction="ic-time1.svg"
        {...dataModalTask}
        canBack={false} />}
      {openModalCreateMilestone &&
        <CreateEditMilestoneModal milesActionType={MILES_ACTION_TYPES.CREATE}
          toggleCloseModalMiles={onModalCreateMilestoneClose} />}
      {openPopupUpdateTaskStatus && <>
        <div className="popup-esr2 popup-task-body" id="popup-esr2">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close" /></span></button>
            <div className="popup-task-content">
              <div className="title">{translate("tasks.list.popup.verification")}</div>
              <div className="text">{translate("tasks.list.popup.youcantsubtasktoincomplete")}
              </div>
            </div>
            <div className="footer">
              <a className="button-blue" onClick={() => { onConfirmUpdateTaskStatus(TASK_UPDATE_FLG.MOVE_TASK_SUBTASK_TO_DONE) }}>{translate("tasks.list.popup.movetoincompleteforeachtask")}</a>
              <a onClick={() => { onConfirmUpdateTaskStatus(TASK_UPDATE_FLG.CHANGE_SUBTASK_TO_TASK_MOVE_TASK_TO_DONE) }} className="button-blue">{translate("tasks.list.popup.convertsubtasktotask")}</a>
              <a className="button-cancel" onClick={() => setOpenPopupUpdateTaskStatus(false)}>{translate("tasks.list.popup.cancel")}</a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show" />
      </>}
      {openPopupUpdateListTaskStatus && <>
        <div className="popup-esr2 popup-task-body" id="popup-esr2">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close" /></span></button>
            <div className="popup-task-content">
              <div className="title">{translate("tasks.list.popup.verification")}</div>
              <div className="text">{translate("tasks.list.popup.youcantsubtasktoincomplete")}
              </div>
            </div>
            <div className="footer">
              <a className="button-blue" onClick={() => { onConfirmUpdateListTaskStatus(TASKS_UPDATE_FLG.MOVE_TASK_SUBTASK_TO_DONE) }}>{translate("tasks.list.popup.movetoincompleteforeachtask")}</a>
              <a onClick={() => { onConfirmUpdateListTaskStatus(TASKS_UPDATE_FLG.MOVE_TASK_TO_DONE_CONVERT_SUBTASK) }} className="button-blue">{translate("tasks.list.popup.convertsubtasktotask")}</a>
              <a className="button-cancel" onClick={() => setOpenPopupUpdateListTaskStatus(false)}>{translate("tasks.list.popup.cancel")}</a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show" />
      </>}
      {openPopupEditModeTaskStatus && <>
        <div className="popup-esr2 popup-task-body" id="popup-esr2">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close" /></span></button>
            <div className="popup-task-content">
              <div className="title">{translate("tasks.list.popup.verification")}</div>
              <div className="text">{translate("tasks.list.popup.youcantsubtasktoincomplete")}
              </div>
            </div>
            <div className="footer">
              <a className="button-blue" onClick={() => { onConfirmEditModeTaskStatus(TASK_UPDATE_FLG.MOVE_TASK_SUBTASK_TO_DONE) }}>{translate("tasks.list.popup.movetoincompleteforeachtask")}</a>
              <a onClick={() => { onConfirmEditModeTaskStatus(TASK_UPDATE_FLG.CHANGE_SUBTASK_TO_TASK_MOVE_TASK_TO_DONE) }} className="button-blue">{translate("tasks.list.popup.convertsubtasktotask")}</a>
              <a className="button-cancel" onClick={() => setOpenPopupEditModeTaskStatus(false)}>{translate("tasks.list.popup.cancel")}</a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show" />
      </>}
      {openPopupDeleteTask2Button && <>
        <div className="popup-esr2" id="popup-esr2">
          <div className="popup-esr2-content min-width-340">
            <div className="popup-esr2-body">
              <div className="popup-esr2-title">{translate("tasks.list.popup.delete")}</div>
              <div className="align-center">{renderMesDelete()}</div>
            </div>
            <div className="popup-esr2-footer">
              <a onClick={() => setOpenPopupDeleteTask2Button(false)} className="button-cancel">{translate("tasks.list.popup.cancel")}</a>
              <a onClick={() => onConfirmDeleteTask(null)} className="button-red">{translate("tasks.list.popup.delete")}</a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop2 show" />
      </>}
      {openPopupDeleteTask3Button && <>
        <div className="popup-esr2 popup-task-body" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-task-content">
              <div className="title">{translate("tasks.list.popup.verification")}</div>
              <div className="text"></div>
              <div className="text">{translate("tasks.list.popup.pleaseselectanoption")}</div>
            </div>
            <div className="footer">
              <a onClick={() => onConfirmDeleteTask(TASK_DELETE_FLG.DELETE_TASK_SUBTASK)} className="button-blue">{translate("tasks.list.popup.deletesubtask")}</a>
              <a onClick={() => onConfirmDeleteTask(TASK_DELETE_FLG.DELETE_TASK_CONVERT_SUBTASK)} className="button-blue">{translate("tasks.list.popup.convertsubtasktotask")}</a>
              <a onClick={() => setOpenPopupDeleteTask3Button(false)} className="button-cancel">{translate("tasks.list.popup.cancel")}</a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop2 show" />
      </>}
      {openPopupSearch && <PopupFieldsSearch
        iconFunction="task/ic-time1.svg"
        fieldBelong={FIELD_BELONG.TASK}
        conditionSearch={searchConditions}
        onCloseFieldsSearch={onClosePopupSearch}
        onActionSearch={onSearchCondition}
        conDisplaySearchDetail={conDisplaySearchDetail}
        setConDisplaySearchDetail={handleConDisplaySearchDetail}
        selectedTargetType={selectedTargetType}
        selectedTargetId={selectedTargetId}
        fieldNameExtension={"task_data"}
        customFields={customFieldSearch}
      />}
      {openModalDetailTask &&
        <DetailTaskModal
          key={selectedTask.taskId}
          iconFunction="ic-task-brown.svg"
          taskId={selectedTask.taskId}
          toggleCloseModalTaskDetail={toggleCloseModalTaskDetail}
          listTask={taskListToDetail}
          canBack={false}
          onClickDetailMilestone={onClickDetailMilestone}
          onOpenModalSubTaskDetail={onClickDetailSubTask} />}
      {/* Only redicrect Screen */}
      {openModalDetailSubTask &&
        <DetailTaskModal iconFunction="ic-task-brown.svg"
          taskId={selectedSubTasks.taskId}
          parentId={selectedTask.taskId}
          toggleCloseModalTaskDetail={toggleCloseModalSubTaskDetail}
          listTask={taskListToDetail}
          canBack={openModalDetailTask}
          onClickDetailMilestone={onClickDetailMilestone}
          onOpenModalSubTaskDetail={onClickDetailSubTask} />}
      {openModalDetailMilestone && 
        <DetailMilestoneModal 
          milesActionType={null} 
          milestoneId={selectedMilestone.milestoneId} 
          toggleCloseModalMilesDetail={toggleCloseModalMilesDetail} 
          openFromModal={openModalDetailTask || openModalDetailSubTask} 
        />}
      {openModalDetailCustomer && showDetailScreen()}
      <TaskControlTop
        searchMode={searchMode}
        modeDisplay={props.screenMode}
        toggleSwitchEditMode={changeEditMode}
        toggleUpdateInEditMode={handleUpdateTasks}
        toggleSwitchDisplay={onOpenSwitchDisplay}
        textSearch={searchLocal}
        enterSearchText={onEnterSearchText}
        toggleOpenPopupSearch={onOpenPopupSearch}
        onDeleteTask={onOpenDeleteListTaskDialog}
        onUpdateListTaskStatus={onUpdateListTaskStatus}
        conDisplaySearchDetail={conDisplaySearchDetail}
        setConDisplaySearchDetail={handleConDisplaySearchDetail}
        handleShowModalCreateEditTask={onShowModalEditTask}
        handleChangeMode={handleChangeMode}
        toggleOpenHelpPopup={handleOpenPopupHelp}
        openCardView={openCardView}
        openSwitcher={openSwitcher}
        openHelpPopup={onOpenPopupHelp}
        toggleOpenPopupSetting={handleOpenPopupSetting}
        handleShowModalCreateMilestone={() => setOpenModalCreateMilestone(true)} />
      <div id={formId} className="wrap-task wrap-control-esr">
        <div className={`esr-content ${openCardView ? 'd-block' : ''}`}>
          {openCardView
            ? <div className='esr-content-task table-list-wrap style-3' ref={cardListRef}>
              <TaskCard
                onClickDetailMilestone={onClickDetailMilestone}
                tasks={taskListByStatus}
                onShowDeleteDialog={onOpenDeleteTaskDialog}
                onDrop={onUpdateTaskStatus}
                onClickDetailTask={onClickDetailTask}
                onShowModalEditTask={onShowModalEditTask}
                onClickDetailCustomer={onClickDetailCustomer}
                onScroll={onScroll}
              />
            </div>
            :
            <div className={`esr-content-task d-flex style-3`}>
              <TaskTable
                handleShowModalCreateEditTask={onShowModalEditTask}
                setOpenSwitcher={(show) => openShowSwitcher(show)}
                conditionSearch={searchConditions}
                filterConditions={filterConditions}
                searchMode={searchMode}
                screenMode={props.screenMode}
                checkboxFirstColumn
                tableRef={tableListRef}
                totalRecord={props.totalRecords}
                records={props.tasks}
                onActionFilterOrder={onActionFilterOrder}
                offset={offset}
                limit={limit}
                orderBy={orderBy}
                onPageChange={onPageChange}
                openSwitcher={openSwitcher}
                onUpdateFieldValue={onUpdateFieldValue}
                updateFiles={updateFiles}
                typeMsgEmpty={props.typeMsgEmpty}
                refreshFieldInfoPersonal={refreshFieldInfoPersonal}
                msgErrorBox={msgErrorBox}
              />
            </div>
          }
        </div>
        {displayMessage()}
      </div>
      <BrowserDirtyCheck isDirty={isDirty && props.screenMode === ScreenMode.EDIT} />
      <GlobalControlRight />
    </div>
    {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.tasks} dismissDialog={dismissDialogHelp} />}
    {onOpenPopupSetting && <PopupMenuSet dismissDialog={dismissDialogSetting} />}
  </>;
};

const mapStateToProps = ({ taskList, dynamicList, popupFieldsSearch }: IRootState) => ({
  tasks: taskList.tasks,
  errorMessage: taskList.errorMessage,
  actionType: taskList.action,
  screenMode: taskList.screenMode,
  successMessage: taskList.successMessage,
  fieldInfos: dynamicList.data.has(TASK_TABLE_ID) ? dynamicList.data.get(TASK_TABLE_ID).fieldInfos : {},
  recordCheckList: dynamicList.data.has(TASK_TABLE_ID) ? dynamicList.data.get(TASK_TABLE_ID).recordCheckList : [],
  totalRecords: taskList.totalRecord,
  totalRecordStatus: taskList.totalRecordStatus,
  fields: taskList.customFieldInfos,
  errorItems: taskList.errorItems,
  typeMsgEmpty: taskList.typeMsgEmpty,
  customFieldInfoSearch: popupFieldsSearch.customField,
  fieldInfoSearch: popupFieldsSearch.fieldInfos,
  offsets: taskList.offsets
});

const mapDispatchToProps = {
  handleDeleteTask,
  handleOpenCardView,
  handleUpdateTask,
  handleUpdateTaskStatus,
  handleSearchTask,
  handleUpdateListStaskStatus, startExecuting,
  handleGetLocalNavigation, handleGetCustomFieldsInfo,
  changeScreenMode,
  handleLocalSearchTask,
  getFieldInfoPersonals,
  handleChangeOffset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);


