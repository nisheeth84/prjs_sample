import React, { useEffect, useState, useMemo, createRef } from 'react'
import _ from 'lodash';
import { Modal } from 'reactstrap';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import StringUtils from 'app/shared/util/string-utils';
import { formatDate, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { getFieldLabel } from 'app/shared/util/string-utils';
import {
  TASK_ACTION_TYPES,
  TASK_VIEW_MODES,
  TASK_SPECIAL_FIELD_NAMES as specialFName,
  FLAG_DELETE_TASK,
  AllFieldInfoDetailTask,
  LICENSE
} from '../constants';

import { ControlType, FIELD_BELONG, TIMEOUT_TOAST_MESSAGE, AUTHORITIES, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants'
import { DEFINE_FIELD_TYPE } from '../../../shared/layout/dynamic-form/constants'
import DynamicControlField from '../../../shared/layout/dynamic-form/control-field/dynamic-control-field';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import ManagerSuggestSearch from 'app/shared/layout/common/suggestion/tag-auto-complete';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import FieldInputSubtask from 'app/modules/tasks/control/field-input-subtask';
import ModalCreateEditSubTask from 'app/modules/tasks/create-edit-subtask/modal-create-edit-subtask';
import PopupConfirm from './popup-confirm';
import useEventListener from 'app/shared/util/use-event-listener';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';

import {
  handleGetDataTask,
  handleSubmitTaskData,
  handleDeleteSubTask,
  handleGetProductTradingsByIds,
  reset,
  TaskAction,
  ACTION_TYPES
} from './create-edit-task.reducer';
import { getValueProp } from 'app/shared/util/entity-utils';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { isExceededCapacity } from 'app/shared/util/file-utils';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

// Constant flag for delete subtask
const PROCESS_FLAG_TYPE = {
  deleteSubTask: 1,
  removeRelation: 4
};

// fieldTypes is allowed to display in preview mode
const previewAllowedFieldTypes = [DEFINE_FIELD_TYPE.SINGER_SELECTBOX, DEFINE_FIELD_TYPE.MULTI_SELECTBOX];
export interface IModalCreateEditTaskProps extends StateProps, DispatchProps {
  // icon image of modal
  iconFunction?: string,
  // event close modal
  toggleCloseModalTask?: (actionStatus?) => void,
  // type of modal create or edit
  taskActionType: number,
  // type of view mode
  taskViewMode: number,
  // id of task edit
  taskId?: number,
  // success message
  successMessage: string,
  // error  message
  errorMessage: string,
  // error validate when submit
  errorValidates: any,
  // data of task edit
  taskData: any,
  // list field for form create/edit
  fields: any,
  // list subtask delete
  listTaskDelete: any;
  // employee manager of task
  employee?: any;
  // dataInfo userLogin creatTask
  dataInfo: any
  listFieldPreview?: any
  // type of action call api task
  actionType,
  popoutParams?: any,
  popout?: boolean,
  canBack?: any,
  modeCopy?: boolean,
  toggleNewWindow?: any,
  employeeId?: number,
  backdrop?: boolean; // [backdrop:false] when open from popup
  isNotCloseModal?: boolean; // don't close modal
  productTradingIds?: any, // productTrading Ids
  customerId?: any, // customer Ids
  milestoneId?: any,
  // isFromGlobalTool?: boolean;
  businessCardId?: any, // business card id
  onCloseModalTask?: (taskId) => void; // return task id
}

/**
 * Component for show modal create/edit task
 * @param props
 */
const ModalCreateEditTask = (props: IModalCreateEditTaskProps) => {
  const {
    taskViewMode,
    fields,
    errorValidates,
    listTaskDelete,
  } = props;

  const [msgError, setMsgError] = useState("");
  const [msgSuccess, setMsgSuccess] = useState("");
  const [saveTaskData, setSaveTaskData] = useState(null);
  const [taskData, setTaskData] = useState(props.taskData && props.taskData.taskData ? props.taskData.taskData : null);
  const [openModalTask, setOpenModalTask] = useState(false);
  const [showPopupConfirm, setShowPopupConfirm] = useState(false);
  const [taskId, setTaskId] = useState(props.taskId ? props.taskId : props.popoutParams && props.popoutParams.taskId ? props.popoutParams.taskId : null);
  const [taskActionType, setTaskActionType] = useState(props.taskActionType ? props.taskActionType : props.popoutParams && props.popoutParams.taskId ? TASK_ACTION_TYPES.UPDATE : TASK_ACTION_TYPES.CREATE);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [fieldInfos, setFieldInfos] = useState(fields || []);
  const [flagWaitingDisplayMessage, setFlagWaitingDisplayMessage] = useState(false);
  const [listOperator, setListOperator] = useState(null);
  const [listProductTradding, setListProductTradding] = useState(props.productTradings && props.productTradings.length > 0 ? props.productTradings : null);
  const [listFileDefault, setListFileDefault] = useState([]);
  const shouldDisable = taskViewMode === TASK_VIEW_MODES.PREVIEW;
  const [fileUpload] = useState([]);
  const [arrOperatorDefaultUpdate] = useState([]);
  const [arrProductUpdateDefault] = useState([]);
  const [subtaskOriginal, setSubtaskOriginal] = useState([]);
  const [canBack, setCanBack] = useState(props.canBack === undefined || props.canBack === null ? true : props.canBack);
  const [fileUploadExt, setFileUploadExt] = useState({});
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [, setToastMessage] = useState(null);
  const [openConfirmDeleteSubtask, setOpenConfirmDeleteSubtask] = useState(false);
  const [isFirstErrorItem, setIsFirstErrorItem] = useState(false);
  const [customers, setCustomers] = useState(props.customers && props.customers.length > 0 ? props.customers : []);
  const [milestones, setMilestones] = useState(props.milestones && props.milestones.length > 0 ? props.milestones : []);
  const [milestoneId, setMilestoneId] = useState(props.milestoneId && props.milestoneId > 0 ? props.milestoneId : null);
  const [customerId, setCustomerId] = useState(props.customerId && props.customerId > 0 ? props.customerId : null);

  const formId = "form-task-edit";
  const classAddCreateOrther: string[][] = [['button-add-subtask']];
  const [isChanged] = useDetectFormChange(formId, [], classAddCreateOrther);

  const dateFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);

  const getParamForEdit = () => {
    if (props.taskActionType === TASK_ACTION_TYPES.UPDATE) {
      return {
        mode: "edit",
        taskId
      };
    } else if (props.taskActionType === TASK_ACTION_TYPES.CREATE) {
      return {
        customerIds: props.customerId ? [props.customerId] : null,
        milestoneIds: props.milestoneId ? [props.milestoneId] : null
      }
    }

    return null;
  }

  const inputRefs = useMemo(() => Array.from({ length: fieldInfos.length }).map(() => createRef<any>()), [fieldInfos]);
  const indexRef = (field) => {
    return fieldInfos.findIndex(e => e.fieldId === field.fieldId);
  }
  useEffect(() => {
    if (props.isCloseAllWindownOpened && !props.isNotCloseModal) {
      if (props.popoutParams) {
        props.reset();
        window.close();
      } else {
        props.reset();
        props.toggleCloseModalTask(true);
      }
    }
  }, [props.isCloseAllWindownOpened]);

  useEffect(() => {
    if (props.taskData && props.taskData.taskData) {
      setTaskData(props.taskData.taskData);
    }
  }, [props.taskData]);

  /**
   * Set toast message at bottom screen
   * @param message
   * @param type
   */
  const displayToastMessage = (message, type) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { message, type };
    setToastMessage(objParams);
    setTimeout(() => {
      setToastMessage(null);
    }, TIMEOUT_TOAST_MESSAGE);
  };

  const executeDirtyCheck = async (action: () => void, cancel?: () => void, partern?: any) => {
    isChanged ? await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: partern }) : action();
  }

  /**
* update data of field default
* @param fieldName
* @param value
*/
  const updateDataDefault = (fieldName, value) => {
    if (saveTaskData !== null && saveTaskData !== undefined) {
      saveTaskData[StringUtils.snakeCaseToCamelCase(fieldName)] = value;
    } else {
      const newObject = {};
      newObject[StringUtils.snakeCaseToCamelCase(fieldName)] = value;
      setSaveTaskData(newObject);
    }
  }

  const getEmployeesDefault = (employees) => {
    const arrEmployees = [];
    if (!employees) {
      return arrEmployees;
    }
    employees.map((item) => {
      arrEmployees.push({
        employeeId: item.employeeId,
        fileUrl: item.photoFilePath,
        employeeName: item.employeeName,
        employeeSurname: item.employeeSurname
      })
    })
    return arrEmployees;
  }

  const getManagerOperator = () => {
    const arrOperator = [];
    if (props.taskData.operators && props.taskData.operators[0].employees) {
      props.taskData.operators[0].employees.map((item) => {
        arrOperator.push({
          employeeId: item.employeeId,
          photoFileUrl: item.photoFilePath,
          employeeName: item.employeeName,
          employeeSurname: item.employeeSurname,
          departments: [
            {
              departmentName: item.departmentName,
              positionName: item.positionName
            }
          ]
        })
      })
    }
    if (props.taskData.operators && props.taskData.operators[0].departments) {
      props.taskData.operators[0].departments.map((item) => {
        arrOperator.push({
          departmentId: item.departmentId,
          departmentName: item.departmentName,
          parentDepartment: { departmentName: item.departmentParentName },
          employees: getEmployeesDefault(item.employees)
        })
      })
    }
    if (props.taskData.operators && props.taskData.operators[0].groups) {
      props.taskData.operators[0].groups.map((item) => {
        arrOperator.push({
          groupId: item.groupId,
          groupName: item.groupName,
          employees: getEmployeesDefault(item.employees)
        })
      })
    }
    setListOperator(arrOperator);
    if (arrOperator.length > 0) {
      arrOperator.forEach(item => {
        arrOperatorDefaultUpdate.push({
          employeeId: item.employeeId ? item.employeeId : null,
          departmentId: item.departmentId ? item.departmentId : null,
          groupId: item.groupId ? item.groupId : null,
        });
      })
    }
  }

  /**
   * Get List Product Tradding
   */
  const getListProductTradding = () => {
    const arrProduct = [];
    if (props.taskData.productTradings) {
      props.taskData.productTradings.map((item) => {
        arrProduct.push(item);
      })
      setListProductTradding(arrProduct);
      props.taskData.productTradings.forEach(item => {
        arrProductUpdateDefault.push(item)
      })
    }
  }


  /**
 * Get ManagerOperator CreatTask
 */
  const getManagerOperatorDefault = () => {
    const arrOperator = [];
    if (props.employee) {
      arrOperator.push({
        employeeId: props.employee.employeeId,
        photoFileUrl: props.employee.photoFilePath,
        employeeName: props.employee.employeeName,
        departments: props.employee.departments
      })
    }
    else if (props.dataInfo) {
      arrOperator.push({
        employeeId: props.dataInfo.userLoginId,
        photoFileUrl: props.dataInfo.userLoginPhotoFilePath,
        employeeName: props.dataInfo.userLoginName,
        employeeSurname: props.dataInfo.userLoginSurname,
        departments: [
          {
            departmentName: props.dataInfo.userLoginDepartmentName,
            positionName: props.dataInfo.userLoginPositionName
          }
        ]
      })
    }
    setListOperator(arrOperator);
    updateDataDefault('operator_id', {
      employeeId: props.dataInfo.userLoginId,
      departmentId: null,
      groupId: null,
    });
  }

  /**
   * Get list file default
   */
  const getListFileDefautl = () => {
    if (props.taskData.files) {
      props.taskData.files.map((item) => {
        listFileDefault.push({
          fileId: item.fileId,
          fileName: item.fileName,
          filePath: item.filePath
        })
      })
      setListFileDefault(listFileDefault);
    }
  }

  /**
 * 
 * @param mode update to section
 */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(ModalCreateEditTask.name, {
        taskId,
        saveTaskData,
        actionType: TaskAction.None,
        taskActionType,
        fieldInfos,
        subtaskOriginal,
        listOperator,
        showModal,
        customers,
        milestones,
        customerId,
        milestoneId,
        listProductTradding
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(ModalCreateEditTask.name);
      if (saveObj) {
        setTaskId(saveObj.taskId);
        saveObj.saveTaskData.isPublic = saveObj.saveTaskData['isPublic'][0] ? { isPublic: true } : false;
        const subtasks = saveObj.saveTaskData.subtasks ? [...saveObj.saveTaskData.subtasks] : [];
        saveObj.saveTaskData.subtasks = subtasks.map(subItem => {
          subItem.added = true;
          return subItem;
        });
        setSaveTaskData(saveObj.saveTaskData);
        setTaskActionType(saveObj.taskActionType);
        setFieldInfos(saveObj.fieldInfos);
        setSubtaskOriginal(saveObj.subtaskOriginal);
        setListOperator(saveObj.listOperator);
        setShowModal(saveObj.showModal);
        setCustomers(saveObj.customers);
        setMilestones(saveObj.milestones);
        setCustomerId(saveObj.customerId);
        setMilestoneId(saveObj.milestoneId);
        setListProductTradding(saveObj.listProductTradding);
        document.body.className = "wrap-task body-full-width";
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(ModalCreateEditTask.name);
    }
  }

  /**
   * update list subtask when delete a subtask
   * @param tasksIdsDelete 
   */
  const updateListSubtask = (tasksIdsDelete) => {
    if (saveTaskData !== null && saveTaskData !== undefined && saveTaskData.subtasks) {
      const subtasks = saveTaskData.subtasks.filter(taskItem => tasksIdsDelete.indexOf(taskItem.taskId) < 0);
      setSaveTaskData({ ...saveTaskData, subtasks });
    }
  }

  /**
   * show message error when submit
   */
  const setMessageError = () => {
    if (props.errorValidates) {
      for (const errorItem of props.errorValidates) {
        if (errorItem.errorCode === "ERR_COM_0050" || errorItem.errorCode === "ERR_TOD_0001") {
          const msg = translate('messages.' + errorItem.errorCode, errorItem.errorParams ? errorItem.errorParams : null);
          setMsgError(msg);
          break;
        }
      }
      return;
    }

    if (props.errorMessage) {
      setMsgError(props.errorMessage);
    }
  }

  /**
   * update data default
   */
  const setUpdateDataDefault = () => {
    const dataUpdateDefault = props.taskData;
    dataUpdateDefault[StringUtils.snakeCaseToCamelCase('operator_id')] = arrOperatorDefaultUpdate;
    dataUpdateDefault[StringUtils.snakeCaseToCamelCase('products_tradings_id')] = arrProductUpdateDefault;
    if (listFileDefault) {
      const valueTag = listFileDefault.map(item => {
        return item.fileName ? item.fileName : ''
      });
      dataUpdateDefault['fileNameOlds'] = valueTag;
    }
    dataUpdateDefault['deleteSubtaskIds'] = [];
    dataUpdateDefault['processFlg'] = null;

    if (props.modeCopy) {
      dataUpdateDefault['files'] = [];
      dataUpdateDefault['subtasks'] = [];
      const newTaskData = _.cloneDeep(dataUpdateDefault.taskData);
      Object.keys(dataUpdateDefault.taskData).forEach(key => {
        if (key.toString().includes('file')) {
          newTaskData[key] = [];
        }
      })
      dataUpdateDefault['taskData'] = newTaskData;
    }
    setSaveTaskData(dataUpdateDefault);
  }

  /**
   * close windows when delete subtask
   */
  const handleWhenDeleteSubtask = () => {
    if (props.popoutParams) {
      props.reset();
      window.close();
    } else {
      props.reset();
      props.toggleCloseModalTask(true);
    }
  }

  useEffect(() => {
    switch (props.actionType) {
      case TaskAction.None:
        break;
      case TaskAction.GetTaskSuccess:
        if (taskViewMode === TASK_VIEW_MODES.PREVIEW && !_.isNil(props.listFieldPreview)) {
          setFieldInfos(props.listFieldPreview);
        } else {
          setFieldInfos(fields);
        }
        getManagerOperator();
        getListProductTradding();
        getListFileDefautl();
        if (taskViewMode !== TASK_VIEW_MODES.PREVIEW) {
          setUpdateDataDefault();
        }
        setSubtaskOriginal(_.cloneDeep(props.modeCopy ? [] : props.taskData.subtasks));
        if (props.taskData.milestoneId) {
          const initialMilestone = {
            customerName: props.taskData.milestoneCustomerName,
            endDate: props.taskData.milestoneFinishDate,
            milestoneId: props.taskData.milestoneId,
            milestoneName: props.taskData.milestoneName,
            parentCustomerName: props.taskData.milestoneParentCustomerName
          }
          setMilestones([initialMilestone]);
        }
        if (props.taskData.customers && props.taskData.customers.length > 0) {
          const cloneCustomer = _.cloneDeep(props.taskData.customers[0]);
          cloneCustomer['address'] = cloneCustomer && _.size(cloneCustomer.customerAddress) > 0 ? JSON.parse(cloneCustomer.customerAddress).address : '';
          setCustomers([cloneCustomer]);
        }
        break;
      case TaskAction.GetTaskLayoutSuccess:
        setFieldInfos(fields);
        getManagerOperatorDefault();
        if (props.milestones && props.milestones.length > 0) {
          setMilestones(props.milestones);
        }
        if (props.customers && props.customers.length > 0) {
          const cloneCustomer = _.cloneDeep(props.customers[0]);
          if (props.customers[0].customerParent && _.size(props.customers[0].customerParent) > 0) {
            cloneCustomer['parentCustomerName'] = props.customers[0].customerParent.customerName;
            cloneCustomer['address'] = cloneCustomer && _.size(cloneCustomer.customerAddress) > 0 ? JSON.parse(cloneCustomer.customerAddress).address : '';
          }
          setCustomers([cloneCustomer]);
        }
        break;
      case TaskAction.UpdateTaskFailure:
      case TaskAction.ErrorModal:
        setIsFirstErrorItem(true);
        setMessageError();
        break;
      case TaskAction.UpdateTaskSuccess:
      case TaskAction.CreateTaskSuccess:
        setFlagWaitingDisplayMessage(true);
        setTimeout(() => {
          if (props.popout) {
            updateStateSession(FSActionTypeScreen.RemoveSession);
            document.body.classList.remove("body-full-width");
            setForceCloseWindow(true);
          } else {
            props.toggleCloseModalTask(true);
            props && props.onCloseModalTask(props.taskIdNew);
            props.reset();
          }
        }, 2000);
        setMsgError("");
        setMsgSuccess(translate('messages.' + props.successMessage));
        break;
      case TaskAction.DeleteSubtaskSuccess:
        if (props.flgCloseWindows) {
          handleWhenDeleteSubtask();
          break;
        }
        updateListSubtask(listTaskDelete);
        break;
      case TaskAction.GetProductTradingsSuccess:
        if (props.productTradings && props.productTradings.length > 0) {
          updateDataDefault(specialFName.productTradingIds, props.productTradings);
          setListProductTradding(props.productTradings);
          break;
        }
        break;
      default:
        setMsgError('');
        break;
    }
    return () => { }
  }, [props.actionType]);

  /**
   * Copy link clipboard
   */
  const copyUrlCreateEditTask = () => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    if (taskId) {
      dummy.value = `${window.location.origin}/${props.tenant}/create-edit-task/${taskId}`;
    } else {
      dummy.value = `${window.location.origin}/${props.tenant}/create-edit-task`;
    }
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  /**
   * event close modal task
   */
  const handleCloseModal = (partern) => {
    executeDirtyCheck(() => {
      if (saveTaskData && saveTaskData.subtasks && saveTaskData.subtasks.length) {
        const subTasksDelete = saveTaskData.subtasks.filter(itemSub => {
          const itemOrigin = subtaskOriginal.findIndex(item => item.taskId === itemSub.taskId);
          if (itemOrigin >= 0) {
            return false;
          }
          return true;
        });
        const listTaskId = subTasksDelete.map(taskItem => {
          return {
            taskId: taskItem.taskId
          }
        });
        if (listTaskId.length) {
          props.startExecuting(REQUEST(ACTION_TYPES.TASK_DELETE_SUBTASK));
          props.handleDeleteSubTask(listTaskId, FLAG_DELETE_TASK.ONLY_TASK, true);
          return;
        }
      }
      if (taskViewMode === TASK_VIEW_MODES.PREVIEW) {
        props.toggleCloseModalTask(false);
      } else {
        handleWhenDeleteSubtask();
      }
    }, () => { }, partern)
  }

  /**
   * event click button delete subtask
   */
  const onClickDeleteSubtask = (taskIdDelete) => {
    const indexOrigin = subtaskOriginal.findIndex(item => item.taskId === taskIdDelete);
    if (indexOrigin < 0) {
      props.startExecuting(REQUEST(ACTION_TYPES.TASK_DELETE_SUBTASK));
      props.handleDeleteSubTask([{ taskId: taskIdDelete }], FLAG_DELETE_TASK.ONLY_TASK, false);
    }
    const subtasks = saveTaskData.subtasks.filter(taskItem => taskItem.taskId !== taskIdDelete);
    if (taskActionType === TASK_ACTION_TYPES.CREATE) {
      setSaveTaskData({ ...saveTaskData, subtasks });
    } else {
      const cloneDeleteSubtaskIds = _.cloneDeep(saveTaskData.deleteSubtaskIds);
      cloneDeleteSubtaskIds.push(taskIdDelete);
      setSaveTaskData({ ...saveTaskData, subtasks, deleteSubtaskIds: cloneDeleteSubtaskIds });
    }
  }

  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploadExt,
      ...fUploads
    };
    setFileUploadExt(_.cloneDeep(newUploads));
  }

  /**
   * Upload file for ext field
   */
  const getFileUploadForExtField = () => {
    const fUploads = [];
    const keyFiles = Object.keys(fileUploadExt);
    keyFiles.forEach(key => {
      const arrFile = fileUploadExt[key];
      arrFile.forEach(file => {
        fUploads.push(file);
      });
    });
    return fUploads;
  }

  /**
   * event click submit create or edit task
   * @param processFlg : delete subtask flag
   */
  const handleSubmit = (processFlg = null) => {
    const files = fileUpload.concat(getFileUploadForExtField());
    if (event && isExceededCapacity(files)) {
      setMsgError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else if (event) {
      setMsgError('');
    }
    setOpenConfirmDeleteSubtask(false);
    if (shouldDisable || flagWaitingDisplayMessage) {
      return;
    }
    if (processFlg !== null) {
      saveTaskData['processFlg'] = processFlg;
    }
    let taskRequestParams = {};
    if (saveTaskData !== null && saveTaskData !== undefined) {
      const subtasks = saveTaskData.subtasks || [];
      if (subtasks.length) {
        if (saveTaskData.status === "3") {
          const existSubtask = subtasks.find(task => task.statusTaskId === "1" || task.statusTaskId === "2" || task.statusTaskId === 1 || task.statusTaskId === 2)
          if (existSubtask) {
            setShowPopupConfirm(true);
            return;
          }
        }
      }

      taskRequestParams = { ...saveTaskData };
      taskRequestParams['updateFlg'] = null;
      const productsTradingIds = saveTaskData.productsTradingsId?.map(item => item.productTradingId);
      taskRequestParams['productsTradingsId'] = productsTradingIds;

      if (taskActionType === TASK_ACTION_TYPES.UPDATE) {
        taskRequestParams['taskId'] = taskId;
      }

      taskRequestParams['isPublic'] = taskRequestParams['isPublic'] && taskRequestParams['isPublic'][0] ? 1 : 0;
      if (saveTaskData['startDate']) {
        taskRequestParams['startDate'] = convertDateTimeToServer(saveTaskData['startDate'], dateFormat);
      }

      if (saveTaskData['finishDate']) {
        taskRequestParams['finishDate'] = convertDateTimeToServer(saveTaskData['finishDate'], dateFormat);
      }

      const taskDataDynamic = taskRequestParams['taskData'] || {};
      if (_.isEqual(taskData, taskDataDynamic)) {
        taskRequestParams['taskData'] = {};
      } else {
        taskRequestParams['taskData'] = taskDataDynamic;
      }

      // trim string data
      const stringFields = ['taskName', 'memo'];
      const keys = Object.keys(taskRequestParams);
      for (const key of keys) {
        if (stringFields.includes(key) && taskRequestParams[key] && taskRequestParams[key].length > 0) {
          taskRequestParams[key] = taskRequestParams[key].trim();
        }
      }
      // if (processFlg !== null) {
      //   taskRequestParams['processFlg'] = processFlg;
      // }
      if (customers && customers.length > 0) {
        const newCustomers = [];
        customers.forEach(customer => {
          const cus = { customerId: customer.customerId, customerName: customer.customerName };
          newCustomers.push(cus);
        });
        taskRequestParams['customers'] = newCustomers;
      } else {
        taskRequestParams['customers'] = null;
      }
      if (milestones && milestones.length > 0) {
        const cloneMilestone = _.cloneDeep(milestones[0]);
        taskRequestParams['milestoneId'] = cloneMilestone.milestoneId;
        taskRequestParams['milestoneName'] = cloneMilestone.milestoneName;
        taskRequestParams['milestoneFinishDate'] = cloneMilestone.endDate;
      } else {
        taskRequestParams['milestoneId'] = null;
        taskRequestParams['milestoneName'] = null;
        taskRequestParams['milestoneFinishDate'] = null;
      }
    }

    if (taskActionType === TASK_ACTION_TYPES.CREATE) {

      props.startExecuting(REQUEST(ACTION_TYPES.TASK_CREATE));
    } else {
      props.startExecuting(REQUEST(ACTION_TYPES.TASK_UPDATE));
    }
    props.handleSubmitTaskData(taskRequestParams, taskActionType, files);
  }

  /**
   * Handle when clicking button submit
   */
  const openConfirmSubmitTask = () => {
    if (
      !props.taskData.subtasks ||
      props.taskData.subtasks.length === 0 ||
      !saveTaskData.deleteSubtaskIds ||
      saveTaskData.deleteSubtaskIds.length === 0
    ) {
      handleSubmit();
      return;
    }
    const subTaskIds = subtaskOriginal.map(subtask => subtask.taskId);
    const deletePropsSubTask = saveTaskData.deleteSubtaskIds.every(item => subTaskIds.includes(item));
    if (deletePropsSubTask) {
      setOpenConfirmDeleteSubtask(true);
    } else {
      handleSubmit();
    }
  }
  const baseUrl = window.location.origin.toString();
  /**
   * set icon of modal popup
   */
  const getIconFunction = () => {
    if (!props.iconFunction) {
      if (props.popoutParams) {
        return <img className="icon-task-brown" src={baseUrl + `/content/images/task/ic-time1.svg`} alt="" />
      } else {
        return <></>
      }
    } else {
      return <img className="icon-task-brown" src={baseUrl + `/content/images/task/${props.iconFunction}`} alt="" />
    }
  }

  /**
   * get text of button submit
   */
  const getTextSubmitButton = () => {
    if (taskActionType === TASK_ACTION_TYPES.CREATE || taskViewMode === TASK_VIEW_MODES.PREVIEW) {
      return translate('tasks.create-edit.button.create');
    } else {
      return translate('tasks.create-edit.button.edit');
    }
  }

  /**
   * get text of title modal
   */
  const getTextModal = () => {
    if (taskActionType === TASK_ACTION_TYPES.CREATE || taskViewMode === TASK_VIEW_MODES.PREVIEW) {
      return translate('tasks.create-edit.label.register');
    } else {
      if (saveTaskData && saveTaskData.parentTaskId) {
        return translate('tasks.create-edit.label.subtask-edit');
      } else {
        return translate('tasks.create-edit.label.task-edit');
      }
    }
  }

  const addToTaskData = (addItem, saveData) => {
    if (saveData['taskData'] && saveData['taskData'].length > 0) {
      let notInArray = true;
      saveData['taskData'].map((e, index) => {
        if (e.key === addItem.key) {
          notInArray = false;
          saveData['taskData'][index] = addItem;
        }
      });
      if (notInArray) {
        saveData['taskData'].push(addItem);
      }
    } else {
      saveData['taskData'] = [addItem];
    }
  }

  const createExtItem = (item, val) => {
    const isArray = Array.isArray(val);
    const itemValue = isArray ? JSON.stringify(val) : val ? val.toString() : '';
    return {
      fieldType: item.fieldType.toString(),
      key: item.fieldName,
      value: itemValue
    };
  }

  /**
   * save data of field dynamic
   * @param item
   * @param val
   */
  const addExtendField = (item, val) => {
    let addItem = null;
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP) {
      addItem = [];
      let arrVal = [];
      try {
        arrVal = _.isString(val) ? JSON.parse(val) : val;
      } catch (e) {
        arrVal = [];
      }
      arrVal.forEach(obj => {
        addItem.push(createExtItem(obj.fieldInfo, obj.value));
      })
    } else {
      addItem = createExtItem(item, val);
    }
    if (Array.isArray(addItem)) {
      addItem.forEach(addIt => {
        addToTaskData(addIt, saveTaskData);
      });
    } else {
      addToTaskData(addItem, saveTaskData);
    }
  }

  /**
   * check field is default
   */
  const isFieldDefault = (item) => {
    return AllFieldInfoDetailTask.includes(item.fieldName);
  }

  /**
   * save data of field dynamic
   */
  const updateStateFieldDynamic = (item, type, val) => {
    let fieldInfo = null;
    fieldInfos.forEach(field => {
      if (field.fieldId.toString() === item.fieldId.toString()) {
        fieldInfo = field;
      }
    });
    if (saveTaskData !== null && saveTaskData !== undefined && fieldInfo) {
      if (_.isEqual(DEFINE_FIELD_TYPE.LOOKUP, _.toString(type))) {
        const valueLookup = _.isArray(val) ? val : _.toArray(val);
        let isToast = false;
        valueLookup.forEach(e => {
          const idx = fieldInfos.findIndex(o => o.fieldId === e.fieldInfo.fieldId);
          if (idx >= 0) {
            const idxRef = indexRef(fieldInfos[idx]);
            if (inputRefs[idxRef] && inputRefs[idxRef].current && inputRefs[idxRef].current.setValueEdit) {
              inputRefs[idxRef].current.setValueEdit(e.value);
              isToast = true;
            }
          }
        })
        if (isToast) {
          displayToastMessage(translate('messages.INF_COM_0018'), MessageType.Info);
        }
      } else if (isFieldDefault(fieldInfo)) {
        saveTaskData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = val;
        if (fieldInfo.fieldName.toString() === specialFName.taskFile) {
          const tmp = val.filter(element => element.status === 0);
          saveTaskData['fileNameOlds'] = tmp.map(element => element.fileName)
        }
        setSaveTaskData(_.cloneDeep(saveTaskData));
      } else if (_.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.CALCULATION) {
        addExtendField(fieldInfo, val);
        setSaveTaskData(_.cloneDeep(saveTaskData));
      }
    } else {
      const newObject = {};
      newObject[StringUtils.snakeCaseToCamelCase(item.fieldName)] = val;
      setSaveTaskData(newObject);
    }
  }

  /**
   * close popup confirm status task
   */
  const cancelPopupConfirm = () => {
    setShowPopupConfirm(false);
  }

  /**
   * handle click button confirm status task when submit create/edit task
   */
  const confirmPopup = (stateNumber) => {
    setShowPopupConfirm(false);
    saveTaskData['updateFlg'] = stateNumber;
    if (saveTaskData !== null && saveTaskData !== undefined) {
      let taskRequestParams = {};

      taskRequestParams = { ...saveTaskData };
      const productsTradingIds = saveTaskData.productsTradingsId?.map(item => item.productTradingId);
      taskRequestParams['productsTradingsId'] = productsTradingIds;
      if (taskActionType === TASK_ACTION_TYPES.UPDATE) {
        taskRequestParams['taskId'] = taskId;
      }

      taskRequestParams['isPublic'] = taskRequestParams['isPublic'] && taskRequestParams['isPublic'][0] ? 1 : 0;
      if (saveTaskData['startDate']) {
        taskRequestParams['startDate'] = convertDateTimeToServer(saveTaskData['startDate'], dateFormat);
      }

      if (saveTaskData['finishDate']) {
        taskRequestParams['finishDate'] = convertDateTimeToServer(saveTaskData['finishDate'], dateFormat);
      }

      const taskDataDynamic = taskRequestParams['taskData'] || {};
      taskRequestParams['taskData'] = taskDataDynamic;
      // trim string data
      const stringFields = ['taskName', 'memo'];
      const keys = Object.keys(taskRequestParams);
      for (const key of keys) {
        if (stringFields.includes(key) && taskRequestParams[key] && taskRequestParams[key].length > 0) {
          taskRequestParams[key] = taskRequestParams[key].trim();
        }
      }
      if (taskRequestParams['customers'] && Array.isArray(taskRequestParams['customers'])) {
        const newCustomers = [];
        taskRequestParams['customers'].forEach(customer => {
          const cus = { customerId: customer.customerId, customerName: customer.customerName };
          newCustomers.push(cus);
        });
        taskRequestParams['customers'] = newCustomers;
      }

      if (milestones && milestones.length > 0) {
        const cloneMilestone = _.cloneDeep(milestones[0]);
        taskRequestParams['milestoneId'] = cloneMilestone.milestoneId;
        taskRequestParams['milestoneName'] = cloneMilestone.milestoneName;
        taskRequestParams['milestoneFinishDate'] = cloneMilestone.endDate;
      } else {
        taskRequestParams['milestoneId'] = null;
        taskRequestParams['milestoneName'] = null;
        taskRequestParams['milestoneFinishDate'] = null;
      }

      if (taskActionType === TASK_ACTION_TYPES.CREATE) {
        props.startExecuting(REQUEST(ACTION_TYPES.TASK_CREATE));
      } else {
        props.startExecuting(REQUEST(ACTION_TYPES.TASK_UPDATE));
      }
      const files = fileUpload.concat(getFileUploadForExtField());
      props.handleSubmitTaskData(taskRequestParams, taskActionType, files);
    }
  }

  /**
   * get data init for field dynamic
   * @param item 
   */
  const getDataStatusControl = (item) => {
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
      return { fieldValue: saveTaskData };
    }
    if (saveTaskData !== undefined && saveTaskData !== null) {
      const dataStatus = { ...item };
      if (isFieldDefault(item)) {
        if (item.fieldName === "is_public") {
          if (saveTaskData["isPublic"] !== undefined) {
            if (saveTaskData["isPublic"].isPublic) {
              dataStatus['fieldValue'] = item.fieldItems[0].itemId;
            } else if (saveTaskData.isPublic === false) {
              dataStatus['fieldValue'] = -1;
            }
          }
        } else {
          if (item.fieldName === "file_name") {
            dataStatus['fieldValue'] = JSON.stringify(saveTaskData["files"]);
          } else {
            if (saveTaskData[StringUtils.snakeCaseToCamelCase(item.fieldName)] !== undefined) {
              dataStatus.fieldValue = saveTaskData[StringUtils.snakeCaseToCamelCase(item.fieldName)];
            }
          }
        }
        return dataStatus;
      } else {
        if (saveTaskData.taskData && saveTaskData.taskData[item.fieldName] !== undefined) {
          dataStatus.fieldValue = saveTaskData.taskData[item.fieldName];
          return dataStatus;
        } else if (taskData && taskData[item.fieldName] !== undefined) {
          // try get from origin, get value relation in tab
          dataStatus.fieldValue = taskData[item.fieldName];
          return dataStatus;
        }
      }
    }
    return null;
  }

  /**
   * get error of field item
   * @param item 
   */
  const getErrorInfo = (item) => {
    let errorInfo = null;
    if (!errorValidates || !errorValidates.length) {
      return null;
    }
    errorValidates.forEach(elem => {
      let fieldName = item.fieldName;
      if (isFieldDefault(item)) {
        if (fieldName === "operator_id") {
          fieldName = "operators"
        } else {
          fieldName = StringUtils.snakeCaseToCamelCase(fieldName);
        }
      }
      if (elem.item && elem.item.trim() === fieldName) {
        const errorTmp = { ...elem };
        // errorTmp['rowId'] = elem.rowId;
        // errorTmp['item'] = elem.item
        // errorTmp['errorCode'] = elem.errorCode;
        // errorTmp['errorParams'] = elem.errorParams;
        if (fieldName === "operators") {
          errorTmp['params'] = {
            0: translate('tasks.create-edit.label.operators')
          };
        } else {
          errorTmp['params'] = elem.params ? elem.params : null;
        }
        errorInfo = errorTmp;
      } else if(item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION ){
        const relationId = StringUtils.tryGetAttribute(item, "relationData.fieldId");
        if(relationId && (_.toString(elem.item) === _.toString(relationId) || _.toString(elem.errorParams) === _.toString(relationId))){
          errorInfo = elem;
        }
      }
    });
    return errorInfo;
  }

  /**
   * event open modal subtask
   * @param type
   * @param mode 
   */
  const toggleOpenModalCreateSubTask = (type, mode) => {
    setOpenModalTask(true);
  }

  /**
   * event close modal subtask
   * @param subTask 
   */
  const onCloseModalSubTask = (subTask) => {
    if (subTask) {
      if (saveTaskData !== null && saveTaskData !== undefined) {
        const oldSubtask = saveTaskData.subtasks || [];
        oldSubtask.push(subTask);
        saveTaskData.subtasks = oldSubtask;
        setSaveTaskData(saveTaskData);
        setOpenModalTask(false);
        return;
      }
      const newObject = {};
      newObject['subtasks'] = [subTask];
      setSaveTaskData(newObject);
    }
    setOpenModalTask(false);
  }

  /**
   * show message error or sucess
   */
  const displayMessage = () => {
    if (!msgSuccess || msgSuccess.length <= 0) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={MessageType.Success}
        message={msgSuccess}
        className="message-area-bottom position-absolute"
      />
    )
  }

  const renderErrorMessage = () => {
    if (msgError && errorValidates[0] && errorValidates[0].errorCode === 'ERR_COM_0050') {
      return (
        <BoxMessage messageType={MessageType.Error}
          message={msgError}
          className={'message-absoluted w-80'}
        />
      );
    } else if (msgError && msgError.length > 0) {
      return (
        <BoxMessage
          messageType={MessageType.Error}
          message={msgError}
          className={'message-absoluted w-80'}
        />
      )
    }
  }

  /**
   * event select product, update list product select
   * @param id 
   * @param type 
   * @param mode 
   * @param listTag 
   */
  const onActionSelectProductTrading = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag) {
      updateDataDefault(specialFName.productTradingIds, listTag);
      setListProductTradding(listTag);
    }
  }
  /**
   * Handle when select 1 in milestone list
   * @param id 
   * @param type 
   * @param mode 
   * @param listTag 
   */
  const onActionSelectMilestone = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag) {
      setMilestones(listTag);
      return;
    }
    setMilestones([]);
  };

  /**
   * Handle when select 1 in customer list
   * @param id 
   * @param type 
   * @param mode 
   * @param listTag 
   */
  const onActionSelectCustomer = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag) {
      for (const item of listTag) {
        if (item.customerId) {
          const newCustomers = [];
          newCustomers.push({
            customerId: item.customerId,
            customerName: item.customerName
          })
          setCustomers(newCustomers);
          return;
        }
      }
    }
    saveTaskData['customers'] = [];
    updateDataDefault(specialFName.productTradingIds, []);
    setListProductTradding([]);
    setCustomers([]);
  };

  /**
   * 
   * @param item get label item 
   */
  const getTextItemField = (item, fieldLabel) => {
    const lang = Storage.session.get('locale', 'ja_jp');
    if (!item) {
      return '';
    }
    if (Object.prototype.hasOwnProperty.call(item, fieldLabel)) {
      try {
        const labels = _.isString(item[fieldLabel]) ? JSON.parse(item[fieldLabel]) : item[fieldLabel];
        if (labels && Object.prototype.hasOwnProperty.call(labels, lang)) {
          return getValueProp(labels, lang);
        }
      } catch (e) {
        return item[fieldLabel];
      }
    }
    return '';
  };

  const getErrorMsg = (errorInfo) => {
    let msg = null;
    if (errorInfo) {
      if (errorInfo.errorCode) {
        msg = translate(`messages.${errorInfo.errorCode}`, errorInfo.params);
      } else if (errorInfo.errorMsg) {
        msg = errorInfo.errorMsg;
      }
    }
    return msg;
  }

  /**
   * get message error 
   */
  const renderMessageError = (errorInfo) => {
    const msg = getErrorMsg(errorInfo);
    return (
      msg && <span className="messenger-error" >{msg}</span>
    );
  }

  /**
   * render product
   * @param item 
   * @param className : className for outer div
   * @param inputClass : className for suggestSearch
   */
  const renderProductName = (item, errorInfo, className, inputClass) => {
    if (!props.listLicense || !props.listLicense.includes(LICENSE.SALES_LICENSE)) {
      return <></>
    }

    if (saveTaskData && saveTaskData.parentTaskId) {
      return <></>;
    }
    if (!customers || customers.length === 0) {
      inputClass += ' disable';
    }
    const placeholder = getFieldLabel(item, 'fieldLabel');
    const customerIds = customers && customers.length > 0 ? customers.map(customer => customer.customerId) : [];
    return (
      <div className={className} key={item.fieldId}>
        <ManagerSuggestSearch
          id={item.fieldName}
          title={getFieldLabel(item, 'fieldLabel')}
          type={TagAutoCompleteType.ProductTrading}
          modeSelect={TagAutoCompleteMode.Multi}
          inputClass={inputClass}
          isRequired={item.modifyFlag === 3 || item.modifyFlag === 2}
          elementTags={listProductTradding}
          placeholder={translate('tasks.create-edit.placeholder.suggest-multi', { placeholder })}
          onActionSelectTag={onActionSelectProductTrading}
          isDisabled={shouldDisable || !customers || customers.length === 0}
          validMsg={getErrorMsg(errorInfo)}
          hiddenActionRight={true}
          customerIds={customerIds}
        />
      </div>
    );

  }

  /**
   * render subtask
   * @param item
   * @param errorInfo
   */
  const renderSubtask = (item, errorInfo, className) => {
    return (
      <div className={className}>
        <FieldInputSubtask
          placeHolder={getTextItemField(item, 'fieldLabel')}
          label={getTextItemField(item, 'fieldLabel')}
          listTask={saveTaskData ? saveTaskData.subtasks || [] : []}
          toggleOpenModalCreateSubTask={toggleOpenModalCreateSubTask}
          deleteSubtask={onClickDeleteSubtask}
          isRequired={item.modifyFlag === 3 || item.modifyFlag === 2}
          isDisabled={taskViewMode === TASK_VIEW_MODES.PREVIEW}
        />
        {renderMessageError(errorInfo)}
      </div>
    );
  }

  const isJsonString = strJson => {
    try {
      JSON.parse(strJson);
    } catch (e) {
      return false;
    }
    return true;
  };

  const getAdress = (addressIn) => {
    let addressOut = '';
    if (addressIn === '{}') {
      return addressOut;
    }
    const addressJson = isJsonString(addressIn) ? JSON.parse(addressIn) : "";
    if(!addressJson){
      return addressIn;
    }
    addressOut += addressJson.address ? addressJson.address : "";
    return addressOut;
  }

  // todo 
  const renderCustomersName = (item, errorInfo, className, inputClass) => {
    if (!props.listLicense || !props.listLicense.includes(LICENSE.CUSTOMER_LICENSE)) {
      return <></>
    }

    if (saveTaskData && saveTaskData.parentTaskId) {
      return <></>;
    }
    if (props.customerId && props.customerId > 0 && customers && _.size(customers) > 0) {
      inputClass += ' disable';
    }

    if (customers && customers.length > 0) {
      customers[0]['customerAddress'] = customers[0].customerAddress ? getAdress(customers[0].customerAddress) : '';
    }
    const placeholder = getFieldLabel(item, 'fieldLabel');
    return (
      <div className={className} key={item.fieldId}>
        <ManagerSuggestSearch
          id={item.fieldName}
          title={getFieldLabel(item, 'fieldLabel')}
          type={TagAutoCompleteType.Customer}
          modeSelect={TagAutoCompleteMode.Single}
          inputClass={inputClass}
          isRequired={item.modifyFlag === 3 || item.modifyFlag === 2}
          elementTags={customers}
          placeholder={translate('tasks.create-edit.placeholder.suggest-single', { placeholder })}
          onActionSelectTag={onActionSelectCustomer}
          isDisabled={shouldDisable || (props.customerId && props.customerId > 0)}
          validMsg={getErrorMsg(errorInfo)}
          disableTag={customerId && customers && _.size(customers) > 0}
        />
      </div>
    );
  }

  /**
   * render component in case default
   * @param item
   * @param errorInfo
   * @param isFocusElement
   * @param className
   */
  const renderInCaseDefault = (item, errorInfo, isFocusElement, className) => {
    if (item.fieldName === specialFName.statusTaskId) {
      if (item.fieldItems && Array.isArray(item.fieldItems)) {
        item.fieldItems.sort((a, b) => {
          if (a.itemOrder && b.itemOrder) {
            return a.itemOrder - b.itemOrder;
          } else {
            return a.itemId - b.itemId;
          }
        });
        for (let i = 1; i <= item.fieldItems.length; i++) {
          item.fieldItems[i - 1].itemId = i;
        }
      }
    }
    if (item.fieldName === specialFName.customersId && saveTaskData && saveTaskData.parentTaskId) {
      return <></>;
    }
    const idxRef = fieldInfos.findIndex(e => e.fieldId === item.fieldId);
    return (
      <DynamicControlField
        ref={inputRefs[idxRef]}
        key={item.fieldId}
        isFocus={isFocusElement}
        recordId={[taskId]}
        controlType={taskActionType === TASK_ACTION_TYPES.UPDATE ? ControlType.EDIT : ControlType.ADD}
        belong={FIELD_BELONG.TASK}
        elementStatus={getDataStatusControl(item)}
        updateStateElement={updateStateFieldDynamic}
        fieldInfo={item}
        className={className}
        isDisabled={(shouldDisable && !previewAllowedFieldTypes.includes(item.fieldType.toString()))}
        isRequired={item.modifyFlag === 3 || item.modifyFlag === 2}
        showFieldLabel={true}
        errorInfo={errorInfo}
        listFieldInfo={listFieldTab}
        updateFiles={updateFiles}
        idUpdate={taskId}
        isSingleFile={false} // can select multiple file
      />
    );
  }

  /**
   * Get milestone error if exists
   */
  const getMilestoneError = () => {
    if (!props.errorValidates) {
      return null;
    }
    const milestoneError = props.errorValidates.filter(item => item.errorCode === 'ERR_TOD_0006');
    if (milestoneError && milestoneError.length > 0) {
      return translate('messages.' + milestoneError[0].errorCode);
    }
    return null;
  };

  /**
 * event select operator
 * @param id
 * @param type
 * @param mode
 * @param listTag
 */
  const onActionSelectOperator = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag) {
      const valueTag = listTag.map(item => {
        if (item.employeeId) {
          return {
            employeeId: item.employeeId,
            departmentId: null,
            groupId: null,
          }
        }
        if (item.departmentId) {
          return {
            employeeId: null,
            departmentId: item.departmentId,
            groupId: null,
          }
        }
        if (item.groupId) {
          return {
            employeeId: null,
            departmentId: null,
            groupId: item.groupId,
          }
        }
      });
      updateDataDefault(id, valueTag);
      setListOperator(listTag);
    }
  }

  /**
   * use for setting list field
   */
  useEffect(() => {
    if (_.isNil(fieldInfos)) {
      return;
    }
    const fieldTabs = fieldInfos.filter(e => e.fieldType.toString() === DEFINE_FIELD_TYPE.TAB)
    const fieldNormals = fieldInfos.filter(e => e.fieldType.toString() !== DEFINE_FIELD_TYPE.TAB)

    fieldTabs.forEach((field) => {
      if (!_.isNil(field.tabData) && field.tabData.length > 0) {
        field.tabData.forEach(e => {
          const idx = fieldNormals.findIndex(o => o.fieldId === e)
          if (idx >= 0) {
            fieldNormals.splice(idx, 1)
          }
        })
      }
    })
    setListFieldTab(fieldTabs);
    setListFieldNormal(fieldNormals)
  }, [fieldInfos])

  const isExistBeforeTab = listFieldTab.length > 0 && listFieldTab[0].fieldOrder > 1
  const isExistAfterTab = listFieldTab.length > 0 && listFieldNormal.length > 0 && listFieldTab[listFieldTab.length - 1].fieldOrder < listFieldNormal[listFieldNormal.length - 1].fieldOrder

  const listFieldBeforeTab = listFieldNormal.filter(e => isExistBeforeTab && e.fieldOrder < listFieldTab[0].fieldOrder)
  const listFieldAfterTab = listFieldNormal.filter(e => isExistAfterTab && e.fieldOrder > listFieldTab[listFieldTab.length - 1].fieldOrder)

  const focusErrorItem = () => {
    if (!props.errorValidates || !props.errorValidates.length) {
      return null;
    }
    const lstError = _.cloneDeep(props.errorValidates);
    lstError && lstError.forEach((element, idx) => {
      if (element.item === "operators") {
        element.item = "operator_id";
      }
      props.fields && props.fields.forEach((e, i) => {
        if (StringUtils.snakeCaseToCamelCase(element.item) === StringUtils.snakeCaseToCamelCase(e.fieldName)) {
          element["fieldOrder"] = e.fieldOrder;
        }
      });
    })

    const lstErrorTmp = lstError.sort(StringUtils.compareValues('fieldOrder'));
    return lstErrorTmp && lstErrorTmp.length > 0 ? lstErrorTmp[0].item : null;
  }

  /**
   * Check if field exists in specialFName or has special type
   * @param field
   */
  const isSpecialField = field => {
    const type = field.fieldType.toString();
    return type === DEFINE_FIELD_TYPE.TAB || type === DEFINE_FIELD_TYPE.TITLE;
  };

  /**
   * Get pre/next field by id
   * @param curIdx 
   * @param increase 
   */
  const fieldPreOrNext = (curIdx, increase) => {
    const step = increase ? 1 : -1;
    const length = fieldInfos.length;
    let target = null;
    const start = curIdx + step;
    if (fieldInfos[start] === undefined) {
      return null;
    }
    for (let i = start; increase ? i < length : i > 0; i += step) {
      if (isSpecialField(fieldInfos[i])) {
        continue;
      }
      target = fieldInfos[i];
      break;
    }
    return target;
  };

  /**
   * Check if full-width field
   * @param isDoubleColumn 
   * @param index 
   * @param rightSpace 
   */
  const isFullWidth = (isDoubleColumn, index, rightSpace) => {
    if (rightSpace) {
      /**
       *  _____________ _____________
       * |_____________|_____________|
       * |_____________| right space
       */
      return false; // !isDoubleColumn;
    }
    const nxt = fieldPreOrNext(index, true);
    let fullWidth = false;
    /**
     *  _____________ _____________
     * |_____________|_____________|
     *     no have right space
     */
    if (!nxt) {
      fullWidth = true;
    } else if (nxt.isDoubleColumn) {
      fullWidth = !isDoubleColumn;
    } else {
      fullWidth = true;
    }
    return fullWidth;
  };

  /**
   * Return class for suggest search
   * @param errorInfo 
   */
  const getSuggestClassName = errorInfo => {
    let inputClass = errorInfo !== null ? "input-normal error" : "input-normal";
    if (taskViewMode === TASK_VIEW_MODES.PREVIEW) {
      inputClass += " disable";
    }
    return inputClass;
  }
  /**
   * render field of form create/edit task
   */
  const renderDynamicControlField = (listFields: any[]) => {
    let panelCreatedDate = null;
    let panelCreatedUser = null;
    let panelUpdatedDate = null;
    let panelUpdatedUser = null;
    const firstErrorItem = focusErrorItem();
    let curRightSpace = false;
    let nxtRightSpace = false;
    const arrayItem = listFields.map((item, idx) => {
      if (item.availableFlag === 0) { // remove customersName condition later
        return <> </>
      }
      const errorInfo = getErrorInfo(item);
      curRightSpace = _.cloneDeep(nxtRightSpace);
      const fullWidth = isFullWidth(item.isDoubleColumn, idx, curRightSpace);
      let className = fullWidth ? "col-lg-12 form-group" : "col-lg-6 form-group";
      if (!isSpecialField(item)) {
        // tick that next item has right space or not?
        nxtRightSpace = !curRightSpace && !fullWidth;
      }
      if (nxtRightSpace) {
        className += " set-clear-table-list-wrap";
      }
      const isFocusItemError = isFirstErrorItem ? StringUtils.snakeCaseToCamelCase(item.fieldName) === StringUtils.snakeCaseToCamelCase(firstErrorItem) : false;
      switch (item.fieldName) {
        case specialFName.operatorId:
          return (
            <div className={className} key={item.fieldId}>
              <ManagerSuggestSearch
                id={item.fieldName}
                isFocusInput={isFocusItemError}
                title={getFieldLabel(item, 'fieldLabel')}
                inputClass={getSuggestClassName(errorInfo)}
                type={TagAutoCompleteType.Employee}
                modeSelect={TagAutoCompleteMode.Multi}
                isRequired={item.modifyFlag === 3 || item.modifyFlag === 2}
                onActionSelectTag={onActionSelectOperator}
                elementTags={taskViewMode === TASK_VIEW_MODES.PREVIEW ? [] : listOperator}
                placeholder={translate('tasks.create-edit.placeholder.operators')}
                validMsg={getErrorMsg(errorInfo)}
                isDisabled={shouldDisable}
              />
            </div>
          );

        case specialFName.createdDate:
          panelCreatedDate = (
            <div className="col-lg-6 form-group" key={item.fieldId}>
              <div>{translate('tasks.create-edit.label.createdDate')}</div>
              <div>{taskActionType === TASK_ACTION_TYPES.UPDATE
                ? (saveTaskData ? formatDate(saveTaskData.registDate) : '')
                : translate('tasks.create-edit.label.registeredAuto')
              }
              </div>
            </div>
          )
          return <></>;
        case specialFName.createdUser:
          panelCreatedUser = (
            <div className="col-lg-6 form-group" key={item.fieldId}>
              <div>{translate('tasks.create-edit.label.createdUser')}</div>
              <div>{taskActionType === TASK_ACTION_TYPES.UPDATE
                ? (saveTaskData ? saveTaskData.registPersonName : '')
                : translate('tasks.create-edit.label.registeredAuto')
              }
              </div>
            </div>
          )
          return <></>;
        case specialFName.updatedDate:
          panelUpdatedDate = (
            <div className="col-lg-6 form-group" key={item.fieldId}>
              <div>{translate('tasks.create-edit.label.updatedDate')}</div>
              <div>{taskActionType === TASK_ACTION_TYPES.UPDATE
                ? (saveTaskData ? formatDate(saveTaskData.refixDate) : '')
                : translate('tasks.create-edit.label.registeredAuto')
              }
              </div>
            </div>
          )
          return <></>;
        case specialFName.updatedUser:
          panelUpdatedUser = (
            <div className="col-lg-6 form-group" key={item.fieldId}>
              <div>{translate('tasks.create-edit.label.updatedUser')}</div>
              <div>{taskActionType === TASK_ACTION_TYPES.UPDATE
                ? (saveTaskData ? saveTaskData.refixPersonName : '')
                : translate('tasks.create-edit.label.registeredAuto')
              }
              </div>
            </div>
          )
          return <></>;
        case specialFName.milestoneName:
          return (
            <div className={className} key={item.fieldId}>
              <ManagerSuggestSearch
                id={item.fieldName}
                isFocusInput={isFocusItemError}
                title={getFieldLabel(item, 'fieldLabel')}
                placeholder={translate('tasks.create-edit.placeholder.milestone')}
                inputClass={getSuggestClassName(errorInfo)}
                type={TagAutoCompleteType.Milestone}
                modeSelect={TagAutoCompleteMode.Single}
                isRequired={item.modifyFlag === 3 || item.modifyFlag === 2}
                elementTags={milestones}
                onActionSelectTag={onActionSelectMilestone}
                validMsg={getMilestoneError()}
                isDisabled={shouldDisable || (milestoneId && milestoneId > 0)}
                disableTag={milestoneId && milestones && _.size(milestones) > 0}
              />
              {renderMessageError(errorInfo)}
            </div>
          );
        case specialFName.productName:
          return renderProductName(item, errorInfo, className, getSuggestClassName(errorInfo));
        case specialFName.parentId:
          return renderSubtask(item, errorInfo, className);
        case specialFName.customersName:
          return renderCustomersName(item, errorInfo, className, getSuggestClassName(errorInfo));
        case specialFName.productTradingIds:
        case specialFName.customersId:
        case specialFName.milestoneId:
          return <></>;
        case specialFName.taskID:
          return (
            <div className={className}>
              <label className="advance-search-popup-label-title mb-0">
                <label> {getFieldLabel(item, 'fieldLabel')} </label>
              </label>
              <input
                type="text"
                className="input-normal disable"
                placeholder={translate('tasks.create-edit.placeholder.taskId')}
                value={taskId}
                readOnly
              />
            </div>
          );
        default:
          return renderInCaseDefault(item, errorInfo, isFocusItemError, className);
      }
    });

    arrayItem.push(
      <div className="row col-lg-12">
        {panelCreatedDate}
        {panelCreatedUser}
        {panelUpdatedDate}
        {panelUpdatedUser}
      </div>
    )
    return arrayItem;
  }

  /**
   * befor unload
   * @param ev
   */
  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
    }
  };
  /**
  * Handle Back action
  */
  const handleBackPopup = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.SetSession);
      setForceCloseWindow(true);
    } else {
      handleCloseModal(DIRTYCHECK_PARTTERN.PARTTERN1);
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
        handleCloseModal(DIRTYCHECK_PARTTERN.PARTTERN1);
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
        // updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.data.forceCloseWindow) {
          props.toggleCloseModalTask(true);
        } else {
          props.toggleCloseModalTask();
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

  const handleUserMouseClick = () => {
    setIsFirstErrorItem(false);
  }
  useEventListener('mousedown', handleUserMouseClick);


  /**
   * useEffect execute firstly
   */
  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      props.handleGetDataTask(getParamForEdit(), taskActionType);
      setFieldInfos(props.fields);
      setShowModal(true);
      if (props.modeCopy) {
        setTaskId(null);
        setTaskActionType(TASK_ACTION_TYPES.CREATE);
      }
      if (props.productTradingIds && props.productTradingIds.length > 0) {
        props.handleGetProductTradingsByIds(props.productTradingIds);
      }
    }

    return () => {
      // updateStateSession(FSActionTypeScreen.RemoveSession);
      document.body.classList.remove("body-full-width");
      props.reset();
    };
  }, []);

  /**
   * open new windows
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/create-edit-task/${taskId ? taskId : ''}`, '', style.toString());
    props.toggleNewWindow && props.toggleNewWindow(true);
  }

  /**
   * use for tab component
   * @param listFieldContent
   */
  const renderContentTab = (listFieldContent: any[]) => {
    return <>{renderDynamicControlField(listFieldContent)}</>
  }

  /**
   * Render tab
   */
  const renderTab = () => {
    return <DynamicControlField
      controlType={ControlType.EDIT}
      showFieldLabel={false}
      fieldInfo={listFieldTab[0]}
      listFieldInfo={fieldInfos}
      renderControlContent={renderContentTab}
      isDisabled={shouldDisable}
    />
  }

  const cancelDeleteSubtask = () => {
    setOpenConfirmDeleteSubtask(false);
    if (saveTaskData.deleteSubtaskIds && saveTaskData.deleteSubtaskIds.length > 0) {
      const cloneSaveTaskData = _.cloneDeep(saveTaskData);
      const revertSubTasks = subtaskOriginal.filter(item => saveTaskData.deleteSubtaskIds.includes(item.taskId));
      cloneSaveTaskData['deleteSubtaskIds'] = [];
      cloneSaveTaskData['subtasks'] = [...cloneSaveTaskData.subtasks, ...revertSubTasks];
      setSaveTaskData(cloneSaveTaskData);
    }
    const subtasks = saveTaskData.subtasks || [];
    if (subtasks.length) {
      if (saveTaskData.status === "3") {
        const existSubtask = subtasks.find(task => task.statusTaskId === "1" || task.statusTaskId === "2" || task.statusTaskId === 1 || task.statusTaskId === 2)
        if (existSubtask) {
          setShowPopupConfirm(true);
          return;
        }
      }
    }
  }
  /**
   * Render confirm popup when delete subtask
   */
  const renderPopupDeleteSubtask = () => {
    return (
      <div className="popup-task">
        <div className="popup-esr2 popup-task-body width-300">
          <div className="popup-task-content">
            <div className="popup-esr2-title title">{translate('tasks.create-edit.confirm-delete-subtask.title')}</div>
            <div className="text">{translate('tasks.create-edit.confirm-delete-subtask.message')}</div>
          </div>
          <div className="popup-esr2-footer footer">
            <div><a title="" className="button-blue" onClick={() => handleSubmit(PROCESS_FLAG_TYPE.deleteSubTask)}>{translate('tasks.create-edit.confirm-delete-subtask.delete-subtask')}</a></div>
            <div><a title="" className="button-blue" onClick={() => handleSubmit(PROCESS_FLAG_TYPE.removeRelation)}>{translate('tasks.create-edit.confirm-delete-subtask.delete-subtask-relation')}</a></div>
            <div><a title="" className="button-cancel" onClick={() => cancelDeleteSubtask()}>{translate('tasks.create-edit.confirm-delete-subtask.cancel')}</a></div>
          </div>
        </div>
        <div className="modal-backdrop2 show" />
      </div>
    );
  }

  const buttonClassName = shouldDisable ? "button-blue button-form-register disable" : "button-blue button-form-register";

  const renderTaskDetail = () => {
    return (
      <>
        <div className='wrap-task modal-open'>
          <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
            <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
              <div className="modal-content">
                <div className="modal-header">
                  <div className="left">
                    <div className="popup-button-back">
                      {canBack ?
                        <a title="" className={`icon-small-primary icon-return-small ${props.popout || !canBack ? 'disable' : ''}`} onClick={!props.popout && canBack && handleBackPopup}></a>
                        :
                        <a className="modal-heading-title" title="" onClick={() => { }}><i className="fas fa-long-arrow-left"></i></a>
                      }
                      <span className="text">{getIconFunction()} {getTextModal()}</span>
                    </div>
                  </div>
                  <div className="right">
                    {showModal && <a onClick={() => openNewWindow()} className="icon-small-primary icon-link-small" />}
                    {showModal && <a onClick={() => handleCloseModal(DIRTYCHECK_PARTTERN.PARTTERN2)} className="icon-small-primary icon-close-up-small line" />}
                  </div>
                </div>
                {renderErrorMessage()}
                <div className="modal-body color-333">
                  <div className="popup-content max-height-auto overflow-hover style-3">
                    <div className="user-popup-form popup-task-form">
                      <form id={formId}>
                        <div className="row break-row">
                          {isExistBeforeTab && listFieldBeforeTab && renderDynamicControlField(listFieldBeforeTab)}
                          {listFieldTab && listFieldTab.length > 0 && renderTab()}
                          {isExistAfterTab && listFieldAfterTab && renderDynamicControlField(listFieldAfterTab)}
                          {(!listFieldTab || listFieldTab.length === 0) && renderDynamicControlField(listFieldNormal)}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="notify-message">
                  {displayMessage()}
                </div>
                <div className="user-popup-form-bottom">
                  <a onClick={() => handleCloseModal(DIRTYCHECK_PARTTERN.PARTTERN2)} className="button-cancel">{translate('tasks.create-edit.button.cancel')}</a>
                  <a onClick={openConfirmSubmitTask} className={buttonClassName}>{getTextSubmitButton()}</a>
                </div>
              </div>
            </div>
          </div>

          {openModalTask &&
            <ModalCreateEditSubTask
              toggleCloseModalTask={onCloseModalSubTask}
              iconFunction="ic-time1.svg"
              taskActionType={TASK_ACTION_TYPES.CREATE}
              taskViewMode={TASK_VIEW_MODES.EDITABLE}
              taskId={taskId}
              backdrop={false}
              parentPopout={props.popout}
            />
          }
          {
            showPopupConfirm &&
            <>
              <PopupConfirm
                onClickButtonConfirm={confirmPopup}
                onClickButtonCancelConfirm={cancelPopupConfirm} />
              <div className="modal-backdrop2 show" />
            </>
          }
          {taskActionType === TASK_ACTION_TYPES.UPDATE && openConfirmDeleteSubtask && renderPopupDeleteSubtask()}
        </div>
      </>
    );
  }

  if (showModal) {
    // if (props.isFromGlobalTool) {
    //   return <>{renderTaskDetail()}</>;
    // } else {
    return (<>
      <Modal isOpen fade toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-field-search" autoFocus>
        {renderTaskDetail()}
      </Modal>
    </>);
    // }
  } else {
    if (props.popout) {
      return <>{renderTaskDetail()}</>;
    } else {
      return <></>;
    }
  }

}
const mapStateToProps = ({ taskInfo, applicationProfile, authentication }: IRootState) => ({
  tenant: applicationProfile.tenant,
  taskData: taskInfo.taskData,
  fields: taskInfo.fields,
  errorValidates: taskInfo.errorItems,
  actionType: taskInfo.action,
  listTaskDelete: taskInfo.listTaskDelete,
  errorMessage: taskInfo.errorMessage,
  successMessage: taskInfo.successMessage,
  dataInfo: taskInfo.dataInfo,
  flgCloseWindows: taskInfo.flgCloseWindows,
  productTradings: taskInfo.productTradings,
  customers: taskInfo.customers,
  milestones: taskInfo.milestones,
  listLicense: authentication.account.licenses,
  authorities: authentication.account.authorities,
  isCloseAllWindownOpened: taskInfo.isCloseAllWindownOpened,
  taskIdNew: taskInfo.taskId
});

const mapDispatchToProps = {
  handleGetDataTask,
  handleSubmitTaskData,
  handleDeleteSubTask,
  handleGetProductTradingsByIds,
  startExecuting,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalCreateEditTask);
