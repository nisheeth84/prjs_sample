
import React, { useEffect, useState } from 'react'
import _ from 'lodash';
import { Modal } from 'reactstrap';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import StringUtils from 'app/shared/util/string-utils';
import useEventListener from 'app/shared/util/use-event-listener';
import { getFieldLabel } from 'app/shared/util/string-utils';
import {
  TASK_ACTION_TYPES,
  TASK_VIEW_MODES,
  TASK_SPECIAL_FIELD_NAMES as specialFName,
  BASE_FIELD_NAMES,
  FieldInfoSubTaskRemove
} from '../constants';
import { ControlType, FIELD_BELONG, MAXIMUM_FILE_UPLOAD_MB, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants'
import { DEFINE_FIELD_TYPE } from '../../../shared/layout/dynamic-form/constants'
import DynamicControlField from '../../../shared/layout/dynamic-form/control-field/dynamic-control-field';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import ManagerSuggestSearch from 'app/shared/layout/common/suggestion/tag-auto-complete';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';

import {
  handleGetDataTask,
  handleSubmitTaskData,
  reset,
  TaskAction,
  ACTION_TYPES
} from './create-edit-subtask.reducer';
import { formatDate, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import { isExceededCapacity } from 'app/shared/util/file-utils';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

export interface IModalCreateEditSubTaskProps extends StateProps, DispatchProps {
  // icon image of modal
  iconFunction?: string,
  // event close modal
  toggleCloseModalTask?: (taskId?) => void,
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
  // id of new subtask created
  taskIdCreated: number,
  // list field for subtask
  fields: any,
  // dataInfo userLogin creatTask
  dataInfo: any
  // type of action call api subtask
  actionType: number,
  popout?: boolean,
  canBack?: any,
  modeCopy?: any, // copy mode flag
  // task parent exist
  parentExist?: boolean,
  // id of task edit
  parentTaskId?: number,
  listFieldPreview?: any,
  backdrop?: boolean, // [backdrop:false] when open from popup
  toggleNewWindow?: any,
  isNotCloseModal?: boolean; // don't close modal
  // isFromGlobalTool?: boolean;
  parentPopout?: boolean; // = true if open from create/edit task modal.
}

/**
 * Component for show modal create/edit subtask
 * @param props
 */
const ModalCreateEditSubTask = (props: IModalCreateEditSubTaskProps) => {
  const {
    taskViewMode,
    fields,
    errorValidates
  } = props;


  const [msgError, setMsgError] = useState("");
  const [msgSuccess, setMsgSuccess] = useState("");
  const [saveTaskData, setSaveTaskData] = useState(null);
  const [taskId, setTaskId] = useState(props.taskId ? props.taskId : null);
  const [taskActionType, setTaskActionType] = useState(props.taskActionType ? props.taskActionType : TASK_ACTION_TYPES.CREATE);
  const [showModal, setShowModal] = useState(true);
  const [fieldInfos, setFieldInfos] = useState(fields || []);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [flagWaitingDisplayMessage, setFlagWaitingDisplayMessage] = useState(false);
  const [listOperator, setListOperator] = useState(null);
  const [listFileDefault, setListFileDefault] = useState([]);
  const shouldDisable = taskViewMode === TASK_VIEW_MODES.PREVIEW;
  const [fileUpload] = useState([]);
  const [arrOperatorDefaultUpdate] = useState([]);
  const [canBack] = useState(props.canBack === undefined || props.canBack === null ? true : props.canBack);
  const [fileUploadExt, setFileUploadExt] = useState({});
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);

  const formId = "form-subtask-edit";
  const classAddCreateOrther: string[][] = [['button-add-subtask']];
  const [isChanged] = useDetectFormChange(formId, [], classAddCreateOrther);

  const dateFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);

  useEffect(() => {
    if (props.isCloseAllWindownOpened && !props.isNotCloseModal) {
      if (props.popout) {
        props.reset();
        window.close();
      } else {
        props.reset();
        props.toggleCloseModalTask(true);
      }
    }
  }, [props.isCloseAllWindownOpened]);

  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploadExt,
      ...fUploads
    };
    setFileUploadExt(_.cloneDeep(newUploads));
  }

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
   * Dirty Check
   * @param action 
   * @param cancel 
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void, partern?: any) => {
    isChanged ? await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: partern }) : action();
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

  /**
   * Get Operator manager
   */
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

  /**
 * Get ManagerOperator CreatTask
 */
  const getManagerOperatorDefault = () => {
    const arrOperator = [];
    if (props.dataInfo) {
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
   * get list file
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
   * Update state for zoom screen
   * @param mode update to section
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(ModalCreateEditSubTask.name, {
        taskId,
        saveTaskData,
        actionType: TaskAction.None,
        taskActionType,
        fieldInfos,
        listOperator

      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(ModalCreateEditSubTask.name);
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
        setListOperator(saveObj.listOperator);
        document.body.className = "wrap-task";
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(ModalCreateEditSubTask.name);
    }
  }

  const getParamForEdit = () => {
    return {
      mode: "edit",
      taskId
    };
  }

  /**
   * show message error when submit
   */
  const setMessageError = () => {
    if (props.errorValidates) {
      for (const errorItem of props.errorValidates) {
        if (errorItem.errorCode === 'ERR_COM_0050' || errorItem.errorCode === 'ERR_TOD_0001' || errorItem.errorCode === 'ERR_COM_0073') {
          setMsgError(translate('messages.' + errorItem.errorCode, errorItem.errorParams ? errorItem.errorParams : null));
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
   * Update for data default
   */
  const setUpdateDataDefault = () => {
    const dataUpdateDefault = props.taskData;
    dataUpdateDefault[StringUtils.snakeCaseToCamelCase('operator_id')] = arrOperatorDefaultUpdate;
    if (listFileDefault) {
      const valueTag = listFileDefault.map(item => {
        return item.fileName ? item.fileName : ''
      });
      dataUpdateDefault['fileNameOlds'] = valueTag;
    }
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
        getListFileDefautl();
        if (taskViewMode !== TASK_VIEW_MODES.PREVIEW) {
          setUpdateDataDefault();
        }
        break;
      case TaskAction.GetTaskLayoutSuccess:
        setFieldInfos(fields);
        getManagerOperatorDefault();
        break;
      case TaskAction.ErrorModal:
        setMessageError();
        break;
      case TaskAction.UpdateTaskFailure:
        break;
      case TaskAction.UpdateTaskSuccess:
      case TaskAction.CreateTaskSuccess:
        setFlagWaitingDisplayMessage(true);
        setTimeout(() => {
          if (props.popout) {
            updateStateSession(FSActionTypeScreen.RemoveSession);
            setForceCloseWindow(true);
          } else {
            props.toggleCloseModalTask({
              taskId: props.taskIdCreated,
              taskName: saveTaskData.taskName || "",
              statusTaskId: saveTaskData.status,
              finishDate: convertDateTimeToServer(saveTaskData.finishDate, dateFormat)
            });
            props.reset();
          }
        }, 2000);
        setMsgError("");
        setMsgSuccess(translate('messages.' + props.successMessage));
        break;
      default:
        setMsgError('');
        break;
    }
    return () => { }
  }, [props.actionType]);

  /**
   * event close modal subtask
   */
  const handleCloseModal = (partern) => {
    executeDirtyCheck(() => {
      props.reset();
      props.toggleCloseModalTask();
    }, () => { }, partern)
  }

  /**
   * event click submit create or edit subtask
   */
  const handleSubmit = () => {
    const files = fileUpload.concat(getFileUploadForExtField());
    if (event && isExceededCapacity(files)) {
      setMsgError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else if (event) {
      setMsgError('');
    }
    if (shouldDisable || flagWaitingDisplayMessage) {
      return;
    }
    let taskRequestParams = {};
    if (saveTaskData !== null && saveTaskData !== undefined) {
      taskRequestParams = { ...saveTaskData };
      taskRequestParams['updateFlg'] = null;

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

      if (taskRequestParams['customers'] && Array.isArray(taskRequestParams['customers'])) {
        const newCustomers = [];
        taskRequestParams['customers'].forEach(customer => {
          const cus = { customerId: customer.customerId, customerName: customer.customerName };
          newCustomers.push(cus);
        });
        taskRequestParams['customers'] = newCustomers;
      }
    }

    if (props.parentExist) {
      taskRequestParams['parentTaskId'] = props.parentTaskId;
      taskRequestParams['subTasks'] = [];
    }

    // trim string data
    const stringFields = ['taskName', 'memo'];
    const keys = Object.keys(taskRequestParams);
    for (const key of keys) {
      if (stringFields.includes(key) && taskRequestParams[key] && taskRequestParams[key].length > 0) {
        taskRequestParams[key] = taskRequestParams[key].trim();
      }
    }
    if (taskActionType === TASK_ACTION_TYPES.CREATE) {
      props.startExecuting(REQUEST(ACTION_TYPES.TASK_CREATE));
    } else {
      props.startExecuting(REQUEST(ACTION_TYPES.TASK_UPDATE));
    }
    props.handleSubmitTaskData(taskRequestParams, taskActionType, files);
  }

  const baseUrl = window.location.origin.toString();

  /**
   * get icon of popup
   */
  const getIconFunction = () => {
    if (!props.iconFunction) {
      return <img className="icon-task-brown" src={baseUrl + `/content/images/task/ic-time1.svg`} alt="" />
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
  const getTextOfModal = () => {
    if (taskActionType === TASK_ACTION_TYPES.CREATE || taskViewMode === TASK_VIEW_MODES.PREVIEW) {
      return <>{translate('tasks.create-edit.label.subtask-register')}</>;
    } else {
      return <>{translate('tasks.create-edit.label.subtask-edit')}</>;
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
    return BASE_FIELD_NAMES.includes(item.fieldName);
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
      if (isFieldDefault(fieldInfo)) {
        saveTaskData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = val;
        if (fieldInfo.fieldName.toString() === specialFName.taskFile) {
          const tmp = val.filter(element => element.status === 0);
          saveTaskData['fileNameOlds'] = tmp.map(element => element.fileName);
        }
        setSaveTaskData(_.cloneDeep(saveTaskData));
      } else {
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
        if (item.fieldName === 'is_public') {
          if (saveTaskData['isPublic'] !== undefined) {
            if (saveTaskData['isPublic'].isPublic) {
              dataStatus['fieldValue'] = item.fieldItems[0].itemId;
            } else if (saveTaskData.isPublic === false) {
              dataStatus['fieldValue'] = -1;
            }
          }
        } else {
          if (item.fieldName === 'file_name') {
            dataStatus['fieldValue'] = JSON.stringify(saveTaskData['files']);
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
    let errorInfo = null
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
      }
    });
    return errorInfo;
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
    if (msgError && errorValidates[0] && (errorValidates[0].errorCode === 'ERR_COM_0050' || errorValidates[0].errorCode === 'ERR_COM_0073')) {
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
            groupId: null
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
  * get message error 
  */
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
   * render field of form create/edit subtask
   */
  const renderDynamicControlField = (listFields: any[]) => {
    let panelCreatedDate = null;
    let panelCreatedUser = null;
    let panelUpdatedDate = null;
    let panelUpdatedUser = null;
    let isRequired = false;
    let isFocus = true;
    const fieldInfosSubTask = [];
    for (let i = 0; i < listFields.length; i++) {
      if (!FieldInfoSubTaskRemove.includes(listFields[i].fieldName)) {
        if (listFields[i].fieldName === specialFName.taskName) {
          listFields[i].fieldLabel = listFields[i].fieldLabel.replace(getFieldLabel(fieldInfos[i], 'fieldLabel'), translate('tasks.create-edit.label.subtask'))
        }
        fieldInfosSubTask.push(listFields[i]);
      }
    }
    let curRightSpace = false;
    let nxtRightSpace = false;
    const arrayItem = fieldInfosSubTask.map((item, idx) => {
      const errorInfo = getErrorInfo(item);
      let isFocusElement = false;
      if (errorInfo && isFocus) {
        isFocusElement = isFocus;
        isFocus = false;
      }
      isRequired = item.modifyFlag === 3 || item.modifyFlag === 2;
      const itemData = _.cloneDeep(item);
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
      switch (item.fieldName) {
        case specialFName.operatorId:
          return (
            <div className={className} key={item.fieldId}>
              <ManagerSuggestSearch
                id={item.fieldName}
                title={getFieldLabel(item, 'fieldLabel')}
                type={TagAutoCompleteType.Employee}
                modeSelect={TagAutoCompleteMode.Multi}
                isRequired={isRequired}
                onActionSelectTag={onActionSelectOperator}
                elementTags={taskViewMode === TASK_VIEW_MODES.PREVIEW ? [] : listOperator}
                placeholder={translate('tasks.create-edit.placeholder.operators')}
                validMsg={getErrorMsg(errorInfo)}
                isDisabled={shouldDisable}
                inputClass={getSuggestClassName(errorInfo)}
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
                value={taskActionType === TASK_ACTION_TYPES.UPDATE ? taskId : null}
                readOnly
              />
            </div>
          );
        default:
          if (itemData.fieldName === specialFName.statusTaskId) {
            if (itemData.fieldItems && Array.isArray(itemData.fieldItems)) {
              for (let i = 1; i <= itemData.fieldItems.length; i++) {
                itemData.fieldItems[i - 1].itemId = i;
              }
            }
          }

          return (
            <DynamicControlField
              key={item.fieldId}
              isFocus={isFocusElement}
              controlType={taskActionType === TASK_ACTION_TYPES.UPDATE ? ControlType.EDIT : ControlType.ADD}
              belong={FIELD_BELONG.TASK}
              elementStatus={getDataStatusControl(itemData)}
              updateStateElement={updateStateFieldDynamic}
              fieldInfo={itemData}
              className={className}
              isDisabled={shouldDisable || item.fieldName === specialFName.taskID}
              showFieldLabel={true}
              isRequired={item.modifyFlag === 3 || item.modifyFlag === 2}
              errorInfo={getErrorInfo(item)}
              listFieldInfo={listFieldTab}
              updateFiles={updateFiles}
              idUpdate={taskActionType === TASK_ACTION_TYPES.UPDATE ? taskId : undefined}
              isSingleFile={false} // can select multiple file
            />
          );
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
        updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.data.forceCloseWindow) {
          if (taskActionType === TASK_ACTION_TYPES.CREATE) {
            props.toggleCloseModalTask({
              taskId: props.taskIdCreated,
              taskName: saveTaskData.taskName || "",
              statusTaskId: saveTaskData.status,
              finishDate: convertDateTimeToServer(saveTaskData.finishDate, dateFormat)
            });
          }
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
      setShowModal(true);
      if (props.modeCopy) {
        setTaskId(null);
        setTaskActionType(TASK_ACTION_TYPES.CREATE);
      }
    }

    return () => {
      updateStateSession(FSActionTypeScreen.RemoveSession);
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
    window.open(`${props.tenant}/create-edit-subtask/${taskId ? taskId : ''}`, '', style.toString());
    props.toggleNewWindow && props.toggleNewWindow(true);
  }

  /**
   * use for tab component
   * @param listFieldContent 
   */
  const renderContentTab = (listFieldContent: any[]) => {
    return <>{renderDynamicControlField(listFieldContent)}</>
  }

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

  const buttonClassName = shouldDisable ? "button-blue button-form-register disable" : "button-blue button-form-register";
  const renderSubTaskDetail = () => {
    return (
      <>
        <div className="modal-open wrap-task">
          <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
            <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
              <div className="modal-content">
                <div className="modal-header">
                  <div className="left">
                    <div className="popup-button-back">
                      {canBack ?
                        <a className="icon-small-primary icon-return-small" title="" onClick={handleBackPopup}></a>
                        :
                        <a className="modal-heading-title" title="" onClick={() => { }}><i className="fas fa-long-arrow-left"></i></a>
                      }
                      <span className="text">{getIconFunction()} {getTextOfModal()}</span>
                    </div>
                  </div>
                  <div className="right">
                    {!props.parentPopout && showModal && <a onClick={() => openNewWindow()} className="icon-small-primary icon-link-small" />}
                    {!props.parentPopout && showModal && <a onClick={() => handleCloseModal(DIRTYCHECK_PARTTERN.PARTTERN2)} className="icon-small-primary icon-close-up-small line" />}
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
                  <a onClick={handleSubmit} className={buttonClassName}>{getTextSubmitButton()}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (showModal) {
    return <>
      <Modal isOpen fade toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-field-search" autoFocus>
        {renderSubTaskDetail()}
      </Modal>
    </>;
  } else {
    if (props.popout) {
      return <>{renderSubTaskDetail()}</>;
    } else {
      return <></>;
    }
  }

}

const mapStateToProps = ({ subTaskInfo, applicationProfile, authentication }: IRootState) => ({
  tenant: applicationProfile.tenant,
  taskData: subTaskInfo.taskData,
  fields: subTaskInfo.fields,
  errorValidates: subTaskInfo.errorItems,
  actionType: subTaskInfo.action,
  taskIdCreated: subTaskInfo.taskIdCreated,
  errorMessage: subTaskInfo.errorMessage,
  successMessage: subTaskInfo.successMessage,
  dataInfo: subTaskInfo.dataInfo,
  authorities: authentication.account.authorities,
  isCloseAllWindownOpened: subTaskInfo.isCloseAllWindownOpened,
});

const mapDispatchToProps = {
  handleGetDataTask,
  handleSubmitTaskData,
  startExecuting,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalCreateEditSubTask);
