import React, { useEffect, useState, useRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import ModalCreateEditSubTask from 'app/modules/tasks/create-edit-subtask/modal-create-edit-subtask';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import {
  STATUS_TASK, TASK_UPDATE_FLG, TASK_ACTION_TYPES, TASK_DELETE_FLG,
  TASK_VIEW_MODES,
  FILE_EXTENSION_IMAGE
} from 'app/modules/tasks/constants'
import { STATUS_MILESTONE, STATUS_DATA, MILESTONE_UPDATE_FLG, LICENSE } from 'app/modules/global/constants'
import { Storage, translate } from 'react-jhipster'
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants'
import CreateEditMilestoneModal from 'app/modules/tasks/milestone/create-edit/create-edit-milestone-modal'
import DetailMilestoneModal from 'app/modules/tasks/milestone/detail/detail-milestone-modal'
import moment from 'moment'
import {
  handleGetTaskWorkGlobalTools,
  handleUpdateStatusTask,
  handleCollapseTodoArea, handleCollapseFinishArea, handleDeleteTaskGlobal, handleUpdateStatusMilestone, handleDeleteMilestone, ACTION_TYPES,
  handleShowComponent
} from 'app/modules/global/task/global-control-task.reducer';
import DetailTaskModal from 'app/modules/tasks/detail/detail-task-modal';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import { checkOnline, resetOnline } from 'app/shared/reducers/authentication.ts';
import { downloadFile } from 'app/shared/util/file-utils';
import dateFnsFormat from 'date-fns/format';
import { TIMEOUT_TOAST_MESSAGE, TYPE_EVENT_MOUSE_ENTER } from '../constants';
import { closeAllCreateEditTaskModalOpened } from '../../tasks/create-edit-task/create-edit-task.reducer';
import { closeAllCreateEditSubTaskModalOpened } from '../../tasks/create-edit-subtask/create-edit-subtask.reducer';
import { closeAllDetailTaskModalOpened } from '../../tasks/detail/detail-task.reducer';
import { closeAllMilestoneCreateEditModalOpened } from '../../tasks/milestone/create-edit/create-edit-milestone.reducer';
import { closeAllDetailMilestoneModalOpened } from '../../tasks/milestone/detail/detail-milestone.reducer';
import TaskFieldGlobal from './task-field-global';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';


export interface IGlobalTaskName {
  task: any,
  statusWorking: number,
  onOpenModalTaskDetail: (taskId: number) => void,
  handleDisplay: any,
  onClickDetailCustomer?: (customerId?) => void,
  listLicence?: any
}

/**
 * Component render ProductTrading 
 * @param props 
 */
export const GlobalCustomerProductTradings = (props: IGlobalTaskName) => {
  const globalProductTradingRef = useRef(null);
  const customerElement = [];
  let customerText = '';
  let products = [];
  if (props.task.productTradings && props.task.productTradings.length > 0 && props.listLicence && props.listLicence.includes(LICENSE.SALES_LICENSE)) {
    products = products.concat(props.task.productTradings)
  }

  if (props.task.customers && props.task.customers.length > 0 && props.listLicence && props.listLicence.includes(LICENSE.CUSTOMER_LICENSE)) {
    customerElement.push(props.task.customers[0].customerName);
    customerText += props.task.customers[0].customerName;
  }

  products.forEach((product, idx) => {
    if (idx !== 0) {
      customerElement.push(translate("commonCharacter.comma"))
      customerText += translate("commonCharacter.comma")
    }
    if (idx === 0 && props.listLicence && props.listLicence.includes(LICENSE.CUSTOMER_LICENSE)) {
      customerText += translate("commonCharacter.splash")
      customerElement.push(<span key={idx} className="black">/</span>)
    }
    customerText += product.productTradingName
    customerElement.push(product.productTradingName)
  })

  const onMouseEnter = () => {
    const top = globalProductTradingRef.current.getBoundingClientRect().top;
    const right = window.innerWidth - globalProductTradingRef.current.getBoundingClientRect().left;
    const space = window.innerHeight - globalProductTradingRef.current.getBoundingClientRect().bottom;
    if (space > 200) {
      props.handleDisplay(top, right, 'auto', 0, customerText, TYPE_EVENT_MOUSE_ENTER.CUSTOMER_PRODUCT_TRADING, true);
    } else {
      props.handleDisplay('auto', right, space, 0, customerText, TYPE_EVENT_MOUSE_ENTER.CUSTOMER_PRODUCT_TRADING, true);
    }
  }
  const onMouseLeave = () => {
    props.handleDisplay(0, 0, 0, 0, null, TYPE_EVENT_MOUSE_ENTER.CUSTOMER_PRODUCT_TRADING, false);
  }

  const customerId = props.task.customers && props.task.customers.length > 0 && props.listLicence && props.listLicence.includes(LICENSE.CUSTOMER_LICENSE) ? props.task.customers[0].customerId : null;
  return <>
    <div className="customer-name" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={globalProductTradingRef} onClick={() => props.onClickDetailCustomer(customerId)}>
      {customerElement}
    </div>
  </>
}

/**
 * Component render Task name
 * @param props 
 */
export const GlobalTaskName = (props: IGlobalTaskName) => {
  const { taskId, taskName, isFinished } = props.task;
  const globalTaskNameRef = useRef(null);

  const onMouseEnter = () => {
    const top = globalTaskNameRef.current.getBoundingClientRect().top;
    const right = window.innerWidth - globalTaskNameRef.current.getBoundingClientRect().left;
    const space = window.innerHeight - globalTaskNameRef.current.getBoundingClientRect().bottom;
    if (space > 150) {
      props.handleDisplay(top, right, 'auto', 0, taskName, TYPE_EVENT_MOUSE_ENTER.TASK_NAME, true);
    } else {
      props.handleDisplay('auto', right, space, 0, taskName, TYPE_EVENT_MOUSE_ENTER.TASK_NAME, true);
    }
  }
  const onMouseLeave = () => {
    props.handleDisplay(0, 0, 0, 0, null, TYPE_EVENT_MOUSE_ENTER.TASK_NAME, false);
  }
  return <>
    <div className="task-name" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={globalTaskNameRef}>
      <a onClick={() => props.onOpenModalTaskDetail(taskId)}
        title="" className={(isFinished && props.statusWorking === STATUS_DATA.TODO) ? "line-through" : ""}>
        {taskName}
      </a></div>
  </>
}

export interface IGlobalTaskFile {
  files: any,
  handleClickFile: (fileName: string, fileUrl: string) => void,
  onImgError: any,
  checkImage: any,
  handleDisplay: any
}

/**
 * Component render Task files
 * @param props 
 */
export const GlobalTaskFile = (props: IGlobalTaskFile) => {
  const globalTaskFileRef = useRef(null);

  const onMouseEnter = () => {
    const top = globalTaskFileRef.current.getBoundingClientRect().bottom;
    const right = window.innerWidth - globalTaskFileRef.current.getBoundingClientRect().right - 3;
    const space = window.innerHeight - top;
    setTimeout(() => {
      if (space > 350) {
        props.handleDisplay(top, right, 'auto', 0, props.files, TYPE_EVENT_MOUSE_ENTER.TASK_FILE, true);
      } else {
        props.handleDisplay('auto', right, window.innerHeight - globalTaskFileRef.current.getBoundingClientRect().top, 0, props.files, TYPE_EVENT_MOUSE_ENTER.TASK_FILE, true);
      }
    }, 50)
  }

  return <>
    <li className="icon-clip right">
      <a className="icon-small-primary icon-link-file" onMouseEnter={onMouseEnter} ref={globalTaskFileRef} />
      <span className="number"> {
        (props.files.length < 100) ? props.files.length : "99+"
      }</span>
    </li>
  </>
}

export interface IGlobalTaskOperator {
  employee: any,
  checkOnlineNumber: number,
  resetCheckOnline: any,
  handleDisplay: any,
  callApiCheckOnline: (id: number) => void,
  onImageAvatarEmployeeNotFound?: any
}

/**
 * Component render Task operators
 * @param props 
 */
export const GlobalTaskOperator = (props: IGlobalTaskOperator) => {
  const globalTaskOperatorRef = useRef(null);
  const [employeeData, setEmployeeData] = useState({ employee: null, checkOnlineNumber: null });

  useEffect(() => {
    setEmployeeData({
      employee: props.employee,
      checkOnlineNumber: props.checkOnlineNumber
    });
  }, [props.employee]);

  const onMouseEnter = () => {
    props.callApiCheckOnline(props.employee.employeeId);
    const top = globalTaskOperatorRef.current.getBoundingClientRect().bottom;
    const right = window.innerWidth - globalTaskOperatorRef.current.getBoundingClientRect().right;
    const space = window.innerHeight - top;
    setTimeout(() => {
      if (space > 350) {
        props.handleDisplay(top, right, 'auto', 0, employeeData, TYPE_EVENT_MOUSE_ENTER.TASK_OPERATOR, true);
      } else {
        props.handleDisplay('auto', right, window.innerHeight - globalTaskOperatorRef.current.getBoundingClientRect().top, 0, employeeData, TYPE_EVENT_MOUSE_ENTER.TASK_OPERATOR, true);
      }
    }, 50)
  }

  const onMouseLeave = () => {
    props.resetCheckOnline();
  }

  return (
    <div key={props.employee.employeeId} className="list-user-item" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={globalTaskOperatorRef}>
      <img src={props.employee.photoFilePath} alt="" onError={(e) => props.onImageAvatarEmployeeNotFound(e, props.employee)} />
    </div>
  )

}

export interface IGlobalTaskMemo {
  memo: any,
  handleDisplay: any
}

export const GlobalTaskMemo = (props: IGlobalTaskMemo) => {
  const globalTaskMemoRef = useRef(null);

  const onMouseEnter = () => {
    const top = globalTaskMemoRef.current.getBoundingClientRect().bottom;
    const right = window.innerWidth - globalTaskMemoRef.current.getBoundingClientRect().right;
    const space = window.innerHeight - top;
    setTimeout(() => {
      if (space > 350) {
        props.handleDisplay(top, right, 'auto', 0, props.memo, TYPE_EVENT_MOUSE_ENTER.TASK_MEMO, true);
      } else {
        props.handleDisplay('auto', right, window.innerHeight - globalTaskMemoRef.current.getBoundingClientRect().top, 0, props.memo, TYPE_EVENT_MOUSE_ENTER.TASK_MEMO, true);
      }
    }, 50)
  }

  return (
    <li className="icon-lines-page" onMouseEnter={onMouseEnter} ref={globalTaskMemoRef}>
      <a title="" className="icon-small-primary icon-lines-page"></a>
    </li>
  )
}

export interface IGlobalTaskMilestoneName {
  milestoneName: string,
  milestoneId: any,
  handleDisplay: any,
  isFinished?: any,
  statusWorking?: any,
  onOpenModalMilestoneDetail?: (miletoneId: number) => void
}

export const GlobalTaskMilestoneName = (props: IGlobalTaskMilestoneName) => {
  const globalTaskMilestoneNameRef = useRef(null);
  const [milestone, setMilestone] = useState({ milestoneId: null, milestoneName: null });

  useEffect(() => {
    setMilestone({
      milestoneId: props.milestoneId,
      milestoneName: props.milestoneName
    })
  }, [props.milestoneId]);

  const onMouseEnter = () => {
    const top = globalTaskMilestoneNameRef.current.getBoundingClientRect().bottom;
    const right = window.innerWidth - globalTaskMilestoneNameRef.current.getBoundingClientRect().right;
    const space = window.innerHeight - top;
    if (space > 350) {
      props.handleDisplay(top, right, 'auto', 0, milestone, TYPE_EVENT_MOUSE_ENTER.TASK_MILESTONE_NAME, true);
    } else {
      props.handleDisplay('auto', right, window.innerHeight - globalTaskMilestoneNameRef.current.getBoundingClientRect().top, 0, milestone, TYPE_EVENT_MOUSE_ENTER.TASK_MILESTONE_NAME, true);
    }
  }
  return (
    <li className="icon-flag" onMouseEnter={onMouseEnter} ref={globalTaskMilestoneNameRef}>
      <a title="" className="icon-small-primary icon-flag"></a>
    </li>
  )
}

export interface IGlobalSubTask {
  countSubtask: number,
  subtasks: any,
  handleDisplay: any
}

export const GlobalSubTask = (props: IGlobalSubTask) => {
  const globalSubTaskRef = useRef(null);
  const onMouseEnter = () => {
    const top = globalSubTaskRef.current.getBoundingClientRect().bottom;
    const right = window.innerWidth - globalSubTaskRef.current.getBoundingClientRect().right;
    const space = window.innerHeight - top;
    setTimeout(() => {
      if (space > 350) {
        props.handleDisplay(top, right, 'auto', 0, props.subtasks, TYPE_EVENT_MOUSE_ENTER.SUB_TASK, true);
      } else {
        props.handleDisplay('auto', right, window.innerHeight - globalSubTaskRef.current.getBoundingClientRect().top, 0, props.subtasks, TYPE_EVENT_MOUSE_ENTER.SUB_TASK, true);
      }
    }, 50)
  }
  return (
    <li className="icon-task">
      <a title="" className="icon-small-primary icon-task" onMouseEnter={onMouseEnter} ref={globalSubTaskRef}></a>
      {props.countSubtask &&
        <span className="number">{(props.countSubtask > 99) ? '99+' : props.countSubtask}</span>
      }
    </li>
  )

}

export const GlobalTaskOperators = (props: IGlobalTaskOperator) => {
  const globalTaskOperatorsRef = useRef(null);
  const [employeeData, setEmployeeData] = useState({ employee: null, checkOnlineNumber: null });

  useEffect(() => {
    console.log("Global Task Operators");
    setEmployeeData({
      employee: props.employee,
      checkOnlineNumber: props.checkOnlineNumber
    });
  }, [props.employee]);

  const onMouseEnter = () => {
    props.callApiCheckOnline(props.employee.employeeId);
    const top = globalTaskOperatorsRef.current.getBoundingClientRect().top;
    const right = window.innerWidth - globalTaskOperatorsRef.current.getBoundingClientRect().right + 152;
    const space = window.innerHeight - top;
    setTimeout(() => {
      if (space > 350) {
        props.handleDisplay(top, right, 'auto', 0, employeeData, TYPE_EVENT_MOUSE_ENTER.TASK_OPERATOR, true);
      } else {
        props.handleDisplay('auto', right, window.innerHeight - globalTaskOperatorsRef.current.getBoundingClientRect().bottom, 0, employeeData, TYPE_EVENT_MOUSE_ENTER.TASK_OPERATOR, true);
      }
    }, 50)
  }

  const onMouseLeave = () => {
    props.resetCheckOnline();
  }

  return (
    <li key={props.employee.employeeId}>
      <a onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={globalTaskOperatorsRef}><img className="icon" src={props.employee.photoFilePath} alt="" onError={(e) => props.onImageAvatarEmployeeNotFound(e, props.employee)} />
        {(props.employee.employeeSurname ? props.employee.employeeSurname + " " : "") + (props.employee.employeeName ? props.employee.employeeName : "")}
      </a>
    </li>
  )
}

export const GlobalMilestoneName = (props: IGlobalTaskMilestoneName) => {
  const globalMilestoneNameRef = useRef(null);

  const onMouseEnter = () => {
    const top = globalMilestoneNameRef.current.getBoundingClientRect().top;
    const right = window.innerWidth - globalMilestoneNameRef.current.getBoundingClientRect().left;
    const space = window.innerHeight - globalMilestoneNameRef.current.getBoundingClientRect().bottom;
    if (space > 150) {
      props.handleDisplay(top, right, 'auto', 0, props.milestoneName, TYPE_EVENT_MOUSE_ENTER.MILESTONE_NAME, true);
    } else {
      props.handleDisplay('auto', right, space, 0, props.milestoneName, TYPE_EVENT_MOUSE_ENTER.MILESTONE_NAME, true);
    }
  }
  const onMouseLeave = () => {
    props.handleDisplay(0, 0, 0, 0, null, TYPE_EVENT_MOUSE_ENTER.MILESTONE_NAME, false);
  }

  return <>
    <div className="milestone-name-long" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={globalMilestoneNameRef}>
      <span
        onClick={(e) => { props.onOpenModalMilestoneDetail(props.milestoneId); e.preventDefault() }}
        className={(props.isFinished && props.statusWorking === STATUS_DATA.TODO) ? "line-through" : ""}>
        <img src="/content/images/task/ic-flag-brown.svg" alt="" title="" />{props.milestoneName}
      </span>
    </div>
  </>
}

export interface IGlobalMilestoneTask {
  countTask: number,
  tasks: any,
  handleDisplay: any
}

export const GlobalMilestoneTask = (props: IGlobalMilestoneTask) => {
  const globalMilestoneTaskRef = useRef(null);

  const onMouseEnter = () => {
    const top = globalMilestoneTaskRef.current.getBoundingClientRect().top;
    const right = window.innerWidth - globalMilestoneTaskRef.current.getBoundingClientRect().left;
    const space = window.innerHeight - globalMilestoneTaskRef.current.getBoundingClientRect().bottom;
    setTimeout(() => {
      if (space > 350) {
        props.handleDisplay(top, right, 'auto', 0, props.tasks, TYPE_EVENT_MOUSE_ENTER.MILESTONE_TASK, true);
      } else {
        props.handleDisplay('auto', right, space, 0, props.tasks, TYPE_EVENT_MOUSE_ENTER.MILESTONE_TASK, true);
      }
    }, 50)
  }

  return (
    <li className="icon-task">
      <a title="" className="icon-small-primary icon-task" onMouseEnter={onMouseEnter} ref={globalMilestoneTaskRef}></a>
      <span className="number">{(props.countTask > 99) ? '99+' : props.countTask}</span>
    </li>
  )
}

export interface IGlobalTaskProps extends StateProps, DispatchProps {
  globalTaskWorking: any,
  onClose: () => void,
  onHavePopupConfirm?: (havePopupConfirm: boolean) => void,
}

export const GlobalControlTask = (props: IGlobalTaskProps) => {
  const [openPopupDeleteMilestone, setOpenPopupDeleteMilestone] = useState(false);
  const [openPopupUpdateTaskStatus, setOpenPopupUpdateTaskStatus] = useState(false);
  const [openPopupUpdateMilestone, setOpenPopupUpdateMilestone] = useState(false);
  const [openPopupDeleteTask2Button, setOpenPopupDeleteTask2Button] = useState(false);
  const [openPopupDeleteTask3Button, setOpenPopupDeleteTask3Button] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedSubTasks, setSelectedSubTask] = useState(null);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [currentMilestoneId, setCurrentMilestoneId] = useState(null);
  const [deleteTaskFlg, setDeleteTaskFlg] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [openDropdownCreateTaskMilestone, setOpenDropdownCreateTaskMilestone] = useState(false);
  const [openModalCreateMilestone, setOpenModalCreateMilestone] = useState(false);
  const [openModalEditMilestone, setOpenModalEditMilestone] = useState(false);
  const [openModalDetailMilestone, setOpenModalDetailMilestone] = useState(false);
  const [openModalCreateEditTask, setOpenModalCreateEditTask] = useState(false);
  const [openModalCreateEditSubTask, setOpenModalCreateEditSubTask] = useState(false);
  const [openModalTaskDetail, setOpenModalTaskDetail] = useState(false);
  const [openModalDetailSubTask, setOpenModalDetailSubTask] = useState(false);
  const [taskCurrentId, setTaskCurrentId] = useState(null);
  const [taskActionType, setTaskActionType] = useState(TASK_ACTION_TYPES.CREATE);
  const [showSuccessMsg, setShowSuccessMsg] = useState(true);
  const [showErrorMsg, setShowErrormsg] = useState(false);
  const [online, setOnline] = useState(-1); // check online status
  const [heightSidebarRightContent, setHeightSidebarRightContent] = useState(null);
  const [employeeId, setEmployeeId] = useState(0);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [styleBox, setStyleBox] = useState({});
  const [openModalDetailCustomer, setOpenModalDetailCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [taskNameSelected, setetaskNameSelected] = useState(null);
  const [milestoneNameSelected, setMilestoneNameSelected] = useState(null);
  const employeeDetailCtrlId = useId(1, "globalControlTaskEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "globalCtrlTaskCustomerDetailCtrlId_");

  const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);

  useEffect(() => {
    props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_GET_TODO_TASK))
    props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_GET_FINISH_TASK))
    props.handleGetTaskWorkGlobalTools([STATUS_TASK.NOT_STARTED, STATUS_TASK.WORKING], STATUS_MILESTONE.TODO, moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0 }).toDate(), moment().utcOffset(0).set({ hour: 23, minute: 59, second: 59 }).add(2, 'days').toDate());
    props.handleGetTaskWorkGlobalTools([STATUS_TASK.COMPLETED], STATUS_MILESTONE.FINISH, moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0 }).subtract(2, 'days').toDate(), moment().utcOffset(0).set({ hour: 23, minute: 59, second: 59 }).toDate());
    props.handleCollapseTodoArea(true)
    props.handleCollapseFinishArea(false)
  }, []);

  useEffect(() => {
    setShowSuccessMsg(true);
    setShowErrormsg(false);
    setTimeout(() => {
      setShowSuccessMsg(false)
    }, TIMEOUT_TOAST_MESSAGE)
  }, [props.showMsg])

  useEffect(() => {
    setShowErrormsg(true)
  }, [props.errorItem])

  useEffect(() => {
    setShowErrormsg(false);
  }, [openPopupDeleteMilestone, openPopupUpdateTaskStatus, openPopupUpdateMilestone, openPopupDeleteTask2Button, openModalCreateMilestone, openModalEditMilestone,
    openPopupDeleteTask3Button, openDropdownCreateTaskMilestone, openModalDetailMilestone, openModalCreateEditTask, openModalTaskDetail])

  useEffect(() => {
    if (openPopupDeleteMilestone || openPopupUpdateTaskStatus || openPopupUpdateMilestone || openPopupDeleteTask2Button || openPopupDeleteTask3Button) {
      props.onHavePopupConfirm(true);
    } else {
      props.onHavePopupConfirm(false);
    }
  }, [openPopupDeleteMilestone, openPopupUpdateTaskStatus, openPopupUpdateMilestone, openPopupDeleteTask2Button, openPopupDeleteTask3Button])

  useEffect(() => {
    setOnline(props.onlineNumber)
  }, [props.onlineNumber])

  useEffect(() => {
    const HEIGHT_SIDEBAR_RIGHT_TOP = 150;
    const HIEGHT_EXPAND_CONTROL_RIGHT = 40;
    setHeightSidebarRightContent(window.innerHeight - HEIGHT_SIDEBAR_RIGHT_TOP - HIEGHT_EXPAND_CONTROL_RIGHT);
  }, []);

  let taskWorking = [];
  let taskFinish = []
  if (props.globalTaskWorking) {
    taskWorking = props.globalTaskWorking;
  }
  if (props.globalTaskFinished) {
    taskFinish = props.globalTaskFinished
  }

  /**
   * event create milestone popup close
   * @param milestoneId 
   */
  const onModalCreateMilestoneClose = (code) => {
    // props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_GET_TODO_TASK))
    setOpenModalCreateMilestone(false)
    setOpenModalEditMilestone(false)
  }

  /**
   * event close popup  detail milestone 
   * @param milestoneId 
   */
  const onModalDetailMilestoneClose = (milestoneId) => {
    setOpenModalDetailMilestone(false)
  }

  /**
 * open employeeId detail
 * @param employeeIdParam 
 */
  const onOpenModalEmployeeDetail = (employeeIdParam) => {
    setEmployeeId(employeeIdParam);
    setOpenPopupEmployeeDetail(true);
  }

  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  }

  /**
   *  check change status task/subtask
   * @param taskData 
   */
  const onOpenModalUpdateTaskStatus = (taskData) => {
    const { statusTaskId, parentTaskId, countSubtask, subtasks } = taskData
    if (parentTaskId) {
      // props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_UPDATE_STATUS_TASK))
      if (statusTaskId <= STATUS_TASK.WORKING) {
        props.handleUpdateStatusTask(taskData, TASK_UPDATE_FLG.MOVE_TO_DONE)
      } else {
        props.handleUpdateStatusTask(taskData, TASK_UPDATE_FLG.MOVE_TO_TODO)
      }
    } else if (statusTaskId === STATUS_TASK.COMPLETED) {
      // props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_UPDATE_STATUS_TASK))
      props.handleUpdateStatusTask(taskData, TASK_UPDATE_FLG.MOVE_TO_TODO)
    } else if (countSubtask === 0 || !subtasks.some(i => (i.statusTaskId <= STATUS_TASK.WORKING))) {
      // props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_UPDATE_STATUS_TASK))
      props.handleUpdateStatusTask(taskData, TASK_UPDATE_FLG.MOVE_TO_DONE)
    } else {
      setCurrentTask(taskData)
      setOpenPopupUpdateTaskStatus(true)
    }
  };

  /**
   * call api updateTaskStatus
   * @param updateFlg 
   */
  const onConfirmUpdateTaskStatus = (updateFlg) => {
    // props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_UPDATE_STATUS_TASK))
    props.handleUpdateStatusTask(currentTask, updateFlg)
    setOpenPopupUpdateTaskStatus(false)
  }

  /**
   * check change status milestone
   * @param milestone 
   */
  const onOpenModalUpdateStatusMilestone = (milestone) => {
    const { statusMilestoneId, tasks } = milestone
    if (statusMilestoneId === STATUS_MILESTONE.FINISH) {
      // props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_UPDATE_STATUS_MILESTONE))
      props.handleUpdateStatusMilestone(milestone, MILESTONE_UPDATE_FLG.TODO)
    } else if (tasks.some(t => t.statusTaskId <= STATUS_TASK.WORKING)) {
      setCurrentMilestone(milestone)
      setOpenPopupUpdateMilestone(true)
    } else {
      // props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_UPDATE_STATUS_MILESTONE))
      props.handleUpdateStatusMilestone(milestone, MILESTONE_UPDATE_FLG.COMPLETE)
    }
  };

  /**
   * call api updateStatusMilestone
   */
  const onConfirmUpdateMilestone = () => {
    // props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_UPDATE_STATUS_MILESTONE))
    props.handleUpdateStatusMilestone(currentMilestone, MILESTONE_UPDATE_FLG.COMPLETE)
    setOpenPopupUpdateMilestone(false)
  }

  /**
   * open modal create edit task
   * @param actionType 
   * @param taskEdit 
   */
  const onClickOpenModalCreateEditTask = (actionType, taskEdit, task) => {
    if (task && task.parentTaskId) {
      // close all subtask
      props.closeAllCreateEditSubTaskModalOpened();
      setTaskCurrentId(taskEdit);
      setOpenModalCreateEditSubTask(true);
      setOpenDropdownCreateTaskMilestone(false);
    } else {
      props.closeAllCreateEditTaskModalOpened();
      setTaskActionType(actionType);
      setTaskCurrentId(taskEdit);
      setOpenModalCreateEditTask(true);
      setOpenDropdownCreateTaskMilestone(false);
    }
  }

  /**
   *  check delete task/subtask
   * @param task 
   */
  const onOpenModalDeleteTask = (task) => {
    setCurrentTask(task)
    const { parentTaskId, subtasks, taskName } = task;
    if (parentTaskId || !subtasks || subtasks.length === 0) {
      setDeleteTaskFlg(TASK_DELETE_FLG.DELETE_TASK)
      setetaskNameSelected(taskName)
      setOpenPopupDeleteTask2Button(true);
    } else if (subtasks.some(sub => (sub.statusTaskId <= STATUS_TASK.WORKING))) {
      setOpenPopupDeleteTask3Button(true);
    } else {
      setDeleteTaskFlg(TASK_DELETE_FLG.DELETE_TASK_SUBTASK);
      setetaskNameSelected(taskName)
      setOpenPopupDeleteTask2Button(true);
    }
  };

  /**
   * call api delete task
   * @param updateFlg 
   */
  const onConfirmDeleteTask = (deleteFlag) => {
    const flag = deleteFlag || deleteTaskFlg;
    const taskIdList = [{ taskId: currentTask.taskId }]
    // props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_DELETE_TASK))
    props.handleDeleteTaskGlobal(taskIdList, flag);
    setOpenPopupDeleteTask2Button(false);
    setOpenPopupDeleteTask3Button(false);
  }

  /**
  * on click show/hide area todo task
  */
  const onToggleTodoArea = () => {
    props.handleCollapseTodoArea(!props.openTodoTaskFirst)
  }

  /**
   * on show/hide area finished task
   */
  const onToggleFinishedArea = () => {
    props.handleCollapseFinishArea(!props.openFinishTaskFirst)
  }

  /**
   * 
   * @param taskId 
   */
  const onOpenModalTaskDetail = (taskId) => {
    props.closeAllDetailTaskModalOpened();
    setOpenModalTaskDetail(true);
    setCurrentTaskId(taskId);
  }

  /**
   * 
   * @param milestoneId 
   */
  const onOpenModalMilestoneDetail = (milestoneId) => {
    props.closeAllDetailMilestoneModalOpened();
    setCurrentMilestoneId(milestoneId);
    setOpenModalDetailMilestone(true);
  }

  /**
  * check image
  * @param fileName fileName check image
  */
  const checkImage = (fileName) => {
    let flagCheckImage = false;
    FILE_EXTENSION_IMAGE.forEach(fileExtension => {
      if (fileName && fileName.toLowerCase().includes(fileExtension)) {
        flagCheckImage = true;
      }
    });
    return flagCheckImage;
  }

  /**
   * create avatar image from first character of name
   * @param event 
   */
  const onImageAvatarEmployeeNotFound = (event, employeeData) => {
    event.target.onerror = null;
    const employeeFullName = employeeData.employeeSurname ? employeeData.employeeSurname : employeeData.employeeName;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', "48px");
    canvas.setAttribute('height', "48px");
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#8ac891";
    ctx.fillRect(0, 0, 48, 48);
    ctx.fillStyle = "#fff"
    ctx.font = "28px Noto Sans CJK JP";
    ctx.fillText(employeeFullName[0], 12, 34);
    event.target.src = canvas.toDataURL('image/jpeg', 1.0);
  }

  /**
   * handle default image file icon
   * @param event 
   */
  const onImgError = (event) => {
    event.target.onerror = null;
    event.target.src = '/content/images/task/ic-clip-red.svg'
  }


  const callApiCheckOnline = (id) => {
    props.checkOnline(id)
  }

  const resetCheckOnline = () => {
    props.resetOnline();
    setOnline(-1);
  }


  /**
   * render box list user component
   * @param employees 
   */
  const renderListEmployee = (employees, taskId) => {
    const onMouseEnterNumber = (event) => {
      const element = document.getElementById('positionGlobalToolEmp' + taskId);
      const style = {}
      if (element) {
        const topBox = element.getBoundingClientRect().bottom;
        const rightBox = window.innerWidth - element.getBoundingClientRect().right - 70;
        const space = window.innerHeight - element.getBoundingClientRect().bottom;
        if (space > 350) {
          style['left'] = 'auto';
          style['top'] = `${topBox - 5}px`;
          style['right'] = `${rightBox}px`;
          style['bottom'] = 'auto';
        } else {
          style['left'] = 'auto';
          style['top'] = 'auto';
          style['right'] = `${rightBox}px`;
          style['bottom'] = `${space - 50}px`;
        }
      }
      setStyleBox(style);
      event.currentTarget.parentElement.className = 'list-user-item show-list'
    }

    const onMouseLeaveNumber = (event) => {
      event.currentTarget.parentElement.className = 'list-user-item'
    }

    return <div className="list-user">
      {employees && employees.length <= 3 && employees.map((employee) =>
        <GlobalTaskOperator key={employee.employeeId} employee={employee} checkOnlineNumber={online}
          callApiCheckOnline={callApiCheckOnline} resetCheckOnline={resetCheckOnline} handleDisplay={props.handleShowComponent}
          onImageAvatarEmployeeNotFound={onImageAvatarEmployeeNotFound}
        />
      )}
      {employees && employees.length > 3 &&
        <>
          {employees.slice(0, 3).map((employee) =>
            <GlobalTaskOperator key={employee.employeeId} employee={employee} checkOnlineNumber={online}
              callApiCheckOnline={callApiCheckOnline} resetCheckOnline={resetCheckOnline} handleDisplay={props.handleShowComponent}
              onImageAvatarEmployeeNotFound={onImageAvatarEmployeeNotFound}
            />
          )}
          <div className="list-user-item position-relative" onMouseEnter={() => callApiCheckOnline(employees[3].employeeId)} onMouseLeave={resetCheckOnline}>
            <div onMouseEnter={onMouseEnterNumber} onMouseLeave={onMouseLeaveNumber}><a id={'positionGlobalToolEmp' + taskId}>{translate("global-tool.left", { number: employees.length - 3 })}</a>
              <div className="box-list-user position-fixed overflow-y-hover max-height-350 z-index-99" style={styleBox}>
                <ul className='w-100'>
                  {employees && employees.slice(3, employees.length).map(employee =>
                    <GlobalTaskOperators key={employee.employeeId} employee={employee} checkOnlineNumber={online}
                      callApiCheckOnline={callApiCheckOnline} resetCheckOnline={resetCheckOnline} handleDisplay={props.handleShowComponent}
                      onImageAvatarEmployeeNotFound={onImageAvatarEmployeeNotFound}
                    />
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  }

  /**
   * Handle download file
   * @param fileName 
   * @param link 
   */
  const handleClickFile = (fileName, link) => {
    downloadFile(fileName, link, () => {
      // TODO : action when download failed
      // const message = translate('messages.ERR_COM_0042', { 0: fileName });
    });
  }

  /**
  * event on click open modal detail customer
  * @param milestoneId
  */
  const onClickOpenDetailCustomer = (customerId) => {
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
  }

  /**
   * render component for a task
   * @param task 
   */
  const renderTask = (task, statusWorking) => {
    const { isFinished, taskName, finishDate, startDate, milestoneName, countSubtask, subtasks, memo, milestoneId, files, countFile, employees, countEmployee, taskId } = task

    return <div className="task-item task-item-white" >
      <div className="tool">
        <a className="icon-small-primary icon-edit-small" onClick={() => onClickOpenModalCreateEditTask(TASK_ACTION_TYPES.UPDATE, taskId, task)}></a>
        <a className="icon-small-primary icon-erase-small" onClick={() => onOpenModalDeleteTask(task)}></a>
      </div>
      <div className="form-inline">
        <label className="icon-check">
          <input type="checkbox" checked={isFinished} onChange={() => onOpenModalUpdateTaskStatus(task)} /><i></i>
        </label>
        {(props.listLicense && (props.listLicense.includes(LICENSE.CUSTOMER_LICENSE) || props.listLicense.includes(LICENSE.SALES_LICENSE))) && task.customers && task.customers.length > 0 &&
          < span className="icon-check">{<GlobalCustomerProductTradings listLicence={props.listLicense} task={task} statusWorking={statusWorking} onOpenModalTaskDetail={null} handleDisplay={props.handleShowComponent} onClickDetailCustomer={onClickOpenDetailCustomer} />}</span>
        }
        <span className="name-task  w-100">
          {
            taskName && <GlobalTaskName task={task} statusWorking={statusWorking} onOpenModalTaskDetail={onOpenModalTaskDetail} handleDisplay={props.handleShowComponent} />
          }
        </span>
      </div>
      {
        (startDate && finishDate) &&
        <div className="deadline">{translate("global-tool.deadline")} : {dateFnsFormat(startDate, userFormat)}～{dateFnsFormat(finishDate, userFormat)}</div>
      }
      {
        (finishDate && !startDate) &&
        <div className="deadline">{translate("global-tool.deadline")} : {dateFnsFormat(finishDate, userFormat)}</div>
      }
      <div className="list-box">
        <ul className='w-100'>
          {milestoneName &&
            <GlobalTaskMilestoneName key={milestoneId} milestoneName={milestoneName} milestoneId={milestoneId}
              handleDisplay={props.handleShowComponent} />
          }
          {countSubtask > 0 &&
            <GlobalSubTask key={taskId} subtasks={subtasks} countSubtask={countSubtask} handleDisplay={props.handleShowComponent} />
          }
          {memo &&
            <GlobalTaskMemo memo={memo} handleDisplay={props.handleShowComponent} />
          }
          {(files && countFile > 0) &&
            <GlobalTaskFile files={files} handleClickFile={handleClickFile} onImgError={onImgError} checkImage={checkImage} handleDisplay={props.handleShowComponent} />
          }
        </ul>
      </div>
      {
        (employees && countEmployee > 0) &&
        renderListEmployee(employees, taskId)
      }
    </div >
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
   * default
   * @param taskId 
   */
  const onCloseModalTaskDetail = () => {
    setOpenModalTaskDetail(false);
  }

  /**
   * close modal create/edit task
   */
  const onCloseModalCreateEditTask = () => {
    setOpenModalCreateEditTask(false);
    setTaskCurrentId(null);
  }

  /**
   * close modal create/edit subtask
   */
  const onCloseModalSubTask = () => {
    setOpenModalCreateEditSubTask(false);
    setTaskCurrentId(null);
  }

  /**
  * event close popup sub task detail
  * @param taskId
  */
  const toggleCloseModalSubTaskDetail = () => {
    setOpenModalDetailSubTask(false);
  }

  /**
   * render component show a milestone
   * @param milestone 
   */
  const renderMilestone = (milestone, statusWorking) => {
    const { isFinished, milestoneId, milestoneName, finishDate, countTask, tasks, memo } = milestone;
    return <div className="task-item task-item-white-small">
      <div className="tool">
        <a className="icon-small-primary icon-edit-small" onClick={() => { setCurrentMilestoneId(milestoneId); setOpenModalEditMilestone(true); props.closeAllMilestoneCreateEditModalOpened() }}></a>
        <a className="icon-small-primary icon-erase-small" onClick={() => { setCurrentMilestone(milestone); setOpenPopupDeleteMilestone(true); setMilestoneNameSelected(milestoneName) }}></a>
      </div>
      <label className="icon-check" >
        <input type="checkbox" checked={isFinished} onChange={(e) => onOpenModalUpdateStatusMilestone(milestone)} name="" /><i />
        {milestoneName &&
          <GlobalMilestoneName
            milestoneId={milestoneId}
            milestoneName={milestoneName}
            isFinished={isFinished}
            handleDisplay={props.handleShowComponent}
            statusWorking={statusWorking}
            onOpenModalMilestoneDetail={onOpenModalMilestoneDetail}
          />
        }
      </label>
      <div className="deadline">{translate("global-tool.deadline")} : {dateFnsFormat(finishDate, userFormat)}</div>
      <div className="list-box">
        <ul className='w-100'>
          {countTask > 0 &&
            <GlobalMilestoneTask key="" tasks={tasks} handleDisplay={props.handleShowComponent} countTask={countTask} />
          }
          {memo &&
            <GlobalTaskMemo memo={memo} handleDisplay={props.handleShowComponent} />
          }
        </ul>
      </div>
    </div>
  }

  /**
   * render task or milestone
   * @param item 
   * @param key 
   */
  const renderTaskOrMilestone = (item, key, statusWorking) => {
    return <div key={`global_${key}${statusWorking}`}>
      {item.taskData && renderTask(item.taskData, statusWorking)}
      {item.milestoneData && renderMilestone(item.milestoneData, statusWorking)}
    </div>
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

  return (
    <>
      <div className="sidebar-right style-3 overflow-visible">
        <div className="sidebar-right-top">
          <div className="recent-task">
            {translate("global-tool.recenttask")}
            <a className="close" onClick={props.onClose}><i className="far fa-times"></i></a>
          </div>
          <div className="button-shadow-add-select-wrap">
            <a className="button-shadow-add-select" onClick={() => onClickOpenModalCreateEditTask(TASK_ACTION_TYPES.CREATE, null, null)}>{translate("global-tool.createtask")}</a>
            <span className="button-arrow" onClick={() => setOpenDropdownCreateTaskMilestone(!openDropdownCreateTaskMilestone)}> </span>
            {openDropdownCreateTaskMilestone &&
              <div className="box-select-option ">
                <ul className="w-100">
                  <li><a onClick={() => onClickOpenModalCreateEditTask(TASK_ACTION_TYPES.CREATE, null, null)} title="">{translate("global-tool.createtask")}</a></li>
                  <li><a title="" onClick={() => { setOpenModalCreateMilestone(true); setOpenDropdownCreateTaskMilestone(false); props.closeAllMilestoneCreateEditModalOpened() }}>{translate("global-tool.createmilestone")}</a></li>
                </ul>
              </div>
            }
          </div>
        </div>
        <div className="sidebar-right-content overflow-y-hover" style={{ height: heightSidebarRightContent }}>
          <a onClick={onToggleTodoArea} className="expand expand-top"> {translate("global-tool.recenttodolist", { count: props.countGlobalTaskWorking })} <i className={(props.openTodoTaskFirst && props.globalTaskWorking.length > 0) ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></a>
          {props.openTodoTaskFirst &&
            <div className="list-task-wrap">
              {taskWorking.map((item, idx) => renderTaskOrMilestone(item, idx, STATUS_DATA.TODO))}
            </div>
          }
          <a title="" onClick={onToggleFinishedArea} className="expand expand-top">{translate("global-tool.lastcompletetask", { count: props.countGlobalTaskFinished })}<i className={(props.openFinishTaskFirst && props.globalTaskFinished.length > 0) ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></a>
          {props.openFinishTaskFirst &&
            <div className="list-task-wrap" >
              {taskFinish.map((item, idx) => renderTaskOrMilestone(item, idx, STATUS_DATA.FINISHED))}  </div>
          }
        </div>
        {showSuccessMsg && props.errorMsg && props.errorMsg.length > 0 &&
          <a className="block-feedback block-feedback-green position-absolute message-area-bottom">{translate(`messages.${props.errorMsg}`)}</a>}
        {showErrorMsg && props.errorItem && props.errorItem.length > 0 &&
          <a className="block-feedback block-feedback-pink position-absolute message-area-bottom">{translate(`messages.${props.errorItem[0].errorCode}`)}</a>}
      </div>
      {openModalCreateEditTask && <ModalCreateEditTask
        toggleCloseModalTask={onCloseModalCreateEditTask}
        iconFunction="ic-time1.svg"
        taskActionType={taskActionType}
        taskId={taskCurrentId}
        taskViewMode={TASK_VIEW_MODES.EDITABLE}
        canBack={false}
        isNotCloseModal={true}
      />}
      {openModalCreateEditSubTask && <ModalCreateEditSubTask
        toggleCloseModalTask={onCloseModalSubTask}
        iconFunction="ic-time1.svg"
        taskActionType={TASK_ACTION_TYPES.UPDATE}
        taskViewMode={TASK_VIEW_MODES.EDITABLE}
        taskId={taskCurrentId}
        isNotCloseModal={true} />
      }
      {openPopupUpdateTaskStatus &&
        <div className="popup-task">
          <div className="popup-esr2 popup-task-body">
            <div className="popup-task-content">
              <div className="popup-esr2-title title">{translate("global-tool.popup.confirm")}</div>
              <div className="text">{translate("global-tool.popup.completetaskincludesubtasknotcomplete")}</div>
            </div>
            <div className="popup-esr2-footer footer">
              <div><a title="" className="button-blue mr-0" onClick={() => onConfirmUpdateTaskStatus(TASK_UPDATE_FLG.MOVE_TASK_SUBTASK_TO_DONE)}>{translate("global-tool.popup.subtaskalsocomplete")}</a></div>
              <div><a title="" className="button-blue mr-0" onClick={() => onConfirmUpdateTaskStatus(TASK_UPDATE_FLG.CHANGE_SUBTASK_TO_TASK_MOVE_TASK_TO_DONE)}>{translate("global-tool.popup.convertsubtasktotask")}</a></div>
              <div><a title="" className="button-cancel mr-0" onClick={() => setOpenPopupUpdateTaskStatus(false)}>{translate("global-tool.popup.cancel")}</a></div>
            </div>
          </div>
        </div>
      }
      {openPopupUpdateMilestone &&
        <div className="popup-task">
          <div className="popup-esr2 popup-task-body">
            <div className="popup-task-content">
              <div className="popup-esr2-title title">{translate("global-tool.popup.confirm")} </div>
              <div className="text">{translate("global-tool.popup.milestoneincludenotcompletetask")} </div>
            </div>
            <div className="popup-esr2-footer footer">
              <div><a onClick={onConfirmUpdateMilestone} className="button-blue">{translate("global-tool.popup.completetask")} </a></div>
              <div><a onClick={() => setOpenPopupUpdateMilestone(false)} className="button-cancel">{translate("global-tool.popup.cancel")}</a></div>
            </div>
          </div>
        </div>}
      {openPopupDeleteTask2Button && <div className="popup-task">
        <div className="popup-esr2 popup-task-body">
          <div className="popup-task-content">
            <div className="popup-esr2-title title">{translate("global-tool.popup.delete")} </div>
            <div className="text">{translate('messages.WAR_COM_0001', { itemName: taskNameSelected })} </div>
          </div>
          <div className="popup-esr2-footer footer">
            <div><a onClick={() => onConfirmDeleteTask(null)} className="button-red">{translate("global-tool.popup.delete")}</a></div>
            <div><a onClick={() => setOpenPopupDeleteTask2Button(false)} className="button-cancel">{translate("global-tool.popup.cancel")}</a></div>
          </div>
        </div>
      </div>}
      {openPopupDeleteTask3Button && <div className="popup-task">
        <div className="popup-esr2 popup-task-body">
          <div className="popup-task-content">
            <div className="popup-esr2-title title">{translate("global-tool.popup.confirm")}</div>
            <div className="text">{translate("global-tool.popup.taskdeletecontainsubtask")} </div>
          </div>
          <div className="popup-esr2-footer footer">
            <div><a onClick={() => onConfirmDeleteTask(TASK_DELETE_FLG.DELETE_TASK_SUBTASK)} className="button-blue mr-0">{translate("global-tool.popup.deletesubtask")} </a></div>
            <div><a onClick={() => onConfirmDeleteTask(TASK_DELETE_FLG.DELETE_TASK_CONVERT_SUBTASK)} className="button-blue mr-0">{translate("global-tool.popup.convertsubtasktotask")} </a></div>
            <div><a onClick={() => setOpenPopupDeleteTask3Button(false)} className="button-cancel mr-0">{translate("global-tool.popup.cancel")} </a></div>
          </div>
        </div>
      </div>}
      {openPopupDeleteMilestone && <div className="popup-task">
        <div className="popup-esr2 popup-task-body">
          <div className="popup-task-content">
            <div className="popup-esr2-title title">{translate("global-tool.popup.delete")}</div>
            <div className="text">{translate('messages.WAR_COM_0001', { itemName: milestoneNameSelected })}</div>
          </div>
          <div className="popup-esr2-footer footer">
            <div><a onClick={() => {
              // props.startExecuting(REQUEST(ACTION_TYPES.GLOBAL_DELETE_MILESTONE));
              props.handleDeleteMilestone(currentMilestone);
              setOpenPopupDeleteMilestone(false)
            }} className="button-red">{translate("global-tool.popup.delete")}</a></div>
            <div><a onClick={() => setOpenPopupDeleteMilestone(false)} className="button-cancel">{translate("global-tool.popup.cancel")}</a></div>
          </div>
        </div>
      </div>}
      {openModalCreateMilestone &&
        <CreateEditMilestoneModal milesActionType={MILES_ACTION_TYPES.CREATE}
          toggleCloseModalMiles={onModalCreateMilestoneClose} isNotCloseModal={true} />}

      {openModalDetailMilestone &&
        <DetailMilestoneModal milesActionType={MILES_ACTION_TYPES.UPDATE}
          toggleCloseModalMilesDetail={onModalDetailMilestoneClose}
          milestoneId={currentMilestoneId} isNotCloseModal={true} />}

      {openModalEditMilestone &&
        <CreateEditMilestoneModal milesActionType={MILES_ACTION_TYPES.UPDATE}
          toggleCloseModalMiles={onModalCreateMilestoneClose} milesId={currentMilestoneId} isNotCloseModal={true} />}
      {openModalTaskDetail &&
        <DetailTaskModal
          iconFunction="ic-sidebar-employee.svg"
          taskId={currentTaskId}
          toggleCloseModalTaskDetail={onCloseModalTaskDetail}
          isNotCloseModal={true}
          // isFromGlobalTool={true}
          onOpenModalSubTaskDetail={onClickDetailSubTask}
        />
      }
      {openModalDetailSubTask &&
        <DetailTaskModal 
          iconFunction="ic-task-brown.svg"
          taskId={selectedSubTasks.taskId}
          parentId={currentTaskId}
          toggleCloseModalTaskDetail={toggleCloseModalSubTaskDetail}
          isNotCloseModal={true}
          // isFromGlobalTool={true}
          onOpenModalSubTaskDetail={onClickDetailSubTask} 
          />}
      {openPopupEmployeeDetail &&
        <PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          showModal={true}
          employeeId={employeeId}
          listEmployeeId={[employeeId]}
          toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
          resetSuccessMessage={() => { }}
        />
      }
      {
        props.isShowComponent &&
        <TaskFieldGlobal
          type={props.typeEvent}
          top={props.position.top}
          right={props.position.right}
          left={props.position.left}
          bottom={props.position.bottom}
          data={props.globalData}
          onOpenModalEmployeeDetail={onOpenModalEmployeeDetail}
          isDisplay={props.isShowComponent}
          onClickDetailMilestone={onOpenModalMilestoneDetail}
          onClickDetailSubTask={onOpenModalTaskDetail}
          onClickDetailTask={onOpenModalTaskDetail}
        />
      }
      {openModalDetailCustomer && showDetailScreen()}
    </>
  );
}

const mapStateToProps = ({ global, authentication }: IRootState) => ({
  globalTaskWorking: global.globalTaskWorking,
  globalTaskFinished: global.globalTaskFinished,
  openTodoTaskFirst: global.openTodoTaskFirst,
  openFinishTaskFirst: global.openFinishTaskFirst,
  errorMsg: global.errorMessage,
  showMsg: global.showMsg,
  countGlobalTaskWorking: global.countGlobalTaskWorking,
  countGlobalTaskFinished: global.countGlobalTaskFinished,
  onlineNumber: authentication.online,
  errorItem: global.errorItem,
  position: global.position,
  globalData: global.globalData,
  typeEvent: global.type,
  isShowComponent: global.isShowComponent,
  listLicense: authentication.account.licenses,
});

const mapDispatchToProps = {
  handleGetTaskWorkGlobalTools,
  startExecuting,
  handleUpdateStatusTask,
  handleUpdateStatusMilestone,
  handleDeleteTaskGlobal,
  handleDeleteMilestone,
  handleCollapseTodoArea,
  handleCollapseFinishArea,
  checkOnline,
  resetOnline,
  closeAllCreateEditTaskModalOpened,
  closeAllCreateEditSubTaskModalOpened,
  closeAllDetailTaskModalOpened,
  closeAllMilestoneCreateEditModalOpened,
  closeAllDetailMilestoneModalOpened,
  handleShowComponent
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalControlTask);