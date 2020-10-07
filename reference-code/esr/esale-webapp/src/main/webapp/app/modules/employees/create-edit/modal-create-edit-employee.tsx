import React, { useEffect, useState, useRef, useMemo, createRef } from 'react'
import { Modal } from 'reactstrap';
import { translate, Storage } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import StringUtils, { forceArray } from 'app/shared/util/string-utils';
import {
  EMPLOYEE_ACTION_TYPES,
  EMPLOYEE_VIEW_MODES,
  EMPLOYEE_SPECIAL_FIELD_NAMES as specialFName,
  EMPLOYEE_SPECIAL_LIST_FIELD,
} from '../constants';
import DynamicControlField from '../../../shared/layout/dynamic-form/control-field/dynamic-control-field';
import FieldTextBoxDoubleColumn from './field-text-double-column'
import FieldEmployeeDepartment from './field-employee-department'
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message'
import {
  handleGetDataEmployee,
  handleSubmitEmployeeData,
  reset,
  EmployeeAction,
} from './create-edit-employee.reducer';
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer';
import { ControlType, MODIFY_FLAG, FIELD_BELONG, SCREEN_TYPES, TIMEOUT_TOAST_MESSAGE, MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { DEFINE_FIELD_TYPE } from '../../../shared/layout/dynamic-form/constants';
import { RESPONSE_FIELD_NAME } from 'app/modules/employees/constants';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file'
import MultiDropDown from 'app/modules/employees/inviteEmployees/multi-drop-down';
import { isExceededCapacity } from 'app/shared/util/file-utils';
export interface IModalCreateEditEmployeeProps extends StateProps, DispatchProps {
  id: string,
  iconFunction?: string,
  toggleCloseModalEmployee?: (successInfo?) => void,
  employeeActionType: number
  employeeViewMode: number
  employeeId?: number
  popout?: boolean
  listFieldPreview?: any
  isOpenedFromModal?: boolean // = true if this modal is opened from another modal
  hiddenShowNewTab?: boolean;
  toggleNewWindow?: any,
  backdrop?: boolean; // [backdrop:false] when open from popup
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

const ModalCreateEditEmployee = (props: IModalCreateEditEmployeeProps) => {

  const [msgError, setMsgError] = useState("");
  const [msgSuccess, setMsgSuccess] = useState("");
  const [saveEmployeeData, setSaveEmployeeData] = useState({});
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [successInfo, setSuccessInfo] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [listFieldNormal, setListFieldNormal] = useState([])
  const [listFieldTab, setListFieldTab] = useState([]);

  // user for popup new window
  const [employeeActionType, setEmployeeActionType] = useState(props.employeeActionType);
  const [employeeViewMode, setEmployeeViewMode] = useState(props.employeeViewMode);
  const [employeeData, setEmployeeData] = useState(props.employeeData);
  const [initEmployee, setInitEmployee] = useState(props.initEmployee);
  const [fieldInfos, setFieldInfos] = useState([]);
  const [errorValidates, setErrorValidates] = useState([]);
  const [employeeId, setEmployeeId] = useState(props.employeeId);
  const [initData, setInitData] = useState(null);
  const [fileUploads, setFileUploads] = useState({});
  const [fileSortValidate, setFileSortValidate] = useState([]);
  const [isAccessContractSite, setIsAccessContractSite] = useState(props.employeeData && props.employeeData['isAccessContractSite'] ? props.employeeData['isAccessContractSite'] : false);
  const [isAdmin, setIsAdmin] = useState(props.employeeData && props.employeeData['isAdmin'] ? props.employeeData['isAdmin'] : false);
  const [isReceivedMail, setIsReceivedMail] = useState(employeeActionType === EMPLOYEE_ACTION_TYPES.CREATE);
  const [isShowModalSendEmail, setIsShowModalSendEmail] = useState(false);
  const [comment, setComment] = useState('');
  const [packageIds, setPackageIds] = useState([]);
  const { screenMoveInfo } = props;
  const shouldDisable = employeeViewMode === EMPLOYEE_VIEW_MODES.PREVIEW;
  const wrapperRef = useRef(null);
  const firstRef = useRef(null);
  const formBottomRef = useRef(null);

  const inputRefs = useMemo(() => Array.from({ length: fieldInfos.length }).map(() => createRef<any>()), [fieldInfos]);

  // #region popup new window

  const indexRef = (field) => {
    return fieldInfos.findIndex(e => e.fieldId === field.fieldId);
  }

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

  const setExclusiveError = (errors) => {
    let exclusive = null;
    errors.forEach(element => {
      if (element.item === "updatedDate" && element.errorCode === "ERR_COM_0050") {
        exclusive = element;
      }
    });
    if (exclusive) {
      setMsgError(translate(`messages.${exclusive.errorCode}`, exclusive.params));
      window.scrollTo(0, 0);
    } else {
      setMsgError('');
    }
  }

  useEffect(() => {
    setEmployeeActionType(props.employeeActionType);
  }, [props.employeeActionType]);

  useEffect(() => {
    setEmployeeViewMode(props.employeeViewMode);
  }, [props.employeeViewMode]);

  useEffect(() => {
    if (props.employeeData && props.employeeData['isAccessContractSite']) {
      setIsAccessContractSite(true);
    }
    if (props.employeeData && props.employeeData['isAdmin']) {
      setIsAdmin(true);
    }
    setEmployeeData({});
    if(props.employeeActionType === EMPLOYEE_ACTION_TYPES.UPDATE){
      setEmployeeData(props.employeeData);
      if(props.employeeData && props.employeeData['employeePackages'] && props.employeeData['employeePackages'].length > 0){
        const savePackagesIds = [];
        props.employeeData['employeePackages'].map(it => {
          savePackagesIds.push(it.packagesId);
        });
        setPackageIds(savePackagesIds);
      }
    }
  }, [props.employeeData]);

  useEffect(() => {
    setInitEmployee(props.initEmployee);
  }, [props.initEmployee]);

  useEffect(() => {
    if (employeeViewMode === EMPLOYEE_VIEW_MODES.PREVIEW && !_.isNil(props.listFieldPreview)) {
      setFieldInfos(props.listFieldPreview);
    } else if (props.fieldInfos && props.fieldInfos.length > 0) {
      setFieldInfos(props.fieldInfos);
      setFileSortValidate(props.fieldInfos.filter(e => (e.modifyFlag === MODIFY_FLAG.REQUIRED || e.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED)))
    }
  }, [props.fieldInfos]);

  useEffect(() => {
    setErrorValidates(props.errorValidates ? props.errorValidates : []);
    setExclusiveError(props.errorValidates);
  }, [props.errorValidates]);

  useEffect(() => {
    setEmployeeId(props.employeeId);
  }, [props.employeeId]);

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(ModalCreateEditEmployee.name, {
        msgError,
        msgSuccess,
        saveEmployeeData,
        employeeActionType,
        employeeViewMode,
        employeeData,
        initEmployee,
        fieldInfos,
        errorValidates,
        employeeId,
        successInfo,
        fileUploads,
        isAdmin,
        isAccessContractSite
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(ModalCreateEditEmployee.name);
      if (saveObj) {
        setMsgError(saveObj.msgError);
        setMsgSuccess(saveObj.msgSuccess);
        setSaveEmployeeData(saveObj.saveEmployeeData);
        setEmployeeActionType(saveObj.employeeActionType);
        setEmployeeViewMode(saveObj.employeeViewMode);
        setEmployeeData(saveObj.employeeData);
        setInitEmployee(saveObj.initEmployee);
        setFieldInfos(saveObj.fieldInfos);
        setErrorValidates(saveObj.errorValidates);
        setEmployeeId(saveObj.employeeId);
        setSuccessInfo(saveObj.successInfo);
        setFileUploads(saveObj.fileUploads);
        setIsAdmin(saveObj.isAdmin);
        setIsAccessContractSite(saveObj.isAccessContractSite);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(ModalCreateEditEmployee.name);
    }
  }

  const onBeforeUnload = (ev) => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': false, 'keepOpen': true }, window.location.origin);
    }
  };

  const onReceiveMessage = (ev) => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        let closeInfo = null;
        // click button close of browser
        if (ev.data.forceCloseWindow && employeeActionType === EMPLOYEE_ACTION_TYPES.UPDATE) {
          // set param null, reload modal detail employ
          closeInfo = { message: null, employeeId: null };
        }
        props.toggleCloseModalEmployee(closeInfo);
      } else if (ev.data.type === FSActionTypeScreen.Search) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
      }
    }
  }

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  const getParamForEdit = () => {
    return {
      employeeId,
      mode: "edit"
    };
  }

  const firstLoad = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
      document.body.className = "wrap-employee modal-open";
    } else {
      setShowModal(true);
      props.handleGetDataEmployee(props.id, getParamForEdit(), employeeActionType);
    }
  }

  useEffect(() => {
    firstLoad();
    return () => {
      props.reset(props.id);
      document.body.className = document.body.className.replace('modal-open', '');
    }
  }, []);

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/create-edit-employee`, '', style.toString());
    props.toggleNewWindow && props.toggleNewWindow(true)
  }

  // #endregion

  useEffect(() => {
    displayToastMessage(props.errorMessage, MessageType.Error);
  }, [props.errorMessage]);

  useEffect(() => {
    displayToastMessage(props.successMessage, MessageType.Success);
  }, [props.successMessage]);

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

  const handleSubmit = (initType: boolean, event, submitComment?: boolean) => {
    const files = getfileUploads();
    if (event && isExceededCapacity(files)) {
      setMsgError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else if (event) {
      setMsgError('');
    }
    if (initType && isReceivedMail && !submitComment) {
      setIsShowModalSendEmail(true);
      return
    }
    if (shouldDisable) {
      return;
    }
    const grapSqlParams = {};
    let jsonData = {};
    if (saveEmployeeData !== null && saveEmployeeData !== undefined) {
      jsonData = { ...saveEmployeeData };
      if (employeeActionType === EMPLOYEE_ACTION_TYPES.UPDATE) {
        grapSqlParams['employeeId'] = employeeId;
        jsonData['updatedDate'] = employeeData['updatedDate'];
      }
      const checkDpm = jsonData['employeeDepartments'];
      if (checkDpm && checkDpm.length === 1 && checkDpm[0].departmentId === null && checkDpm[0].positionId === null) {
        jsonData['employeeDepartments'] = [];
      }
    }
    // delete jsonData['timezoneId'];
    delete jsonData['userId'];
    jsonData['isAdmin'] = isAdmin;
    jsonData['packageIds'] = packageIds;
    jsonData['isAccessContractSite'] = isAccessContractSite;
    if(isReceivedMail){
      jsonData['comment'] = comment;
    }
    grapSqlParams['data'] = jsonData;
    if (initType) {
      props.handleSubmitEmployeeData(props.id, grapSqlParams, employeeActionType, getfileUploads());
      event.preventDefault();
    }
    return grapSqlParams;
  }

  useEffect(() => {
    handleSubmit(false, null);
  });

  const checkSnakeCase = (value) => {
    if (value.includes("_")) {
      return StringUtils.snakeCaseToCamelCase(value);
    } else {
      return value;
    }
  }

  const isChangeInput = () => {
    if (successInfo || shouldDisable) {
      return false;
    }
    const dataSubmit = handleSubmit(false, null);
    const formattedInitData = _.cloneDeep(initData);
    const initdataKeys = Object.keys(initData['data']);
    for (const key of initdataKeys) {
      if (!(key in dataSubmit['data'])) {
        // delete formattedInitData['data'][key];
        continue;
      } else {
        const copyInitData = StringUtils.emptyStringIfNull(formattedInitData['data'][key]);
        const copySubmitData = StringUtils.emptyStringIfNull(dataSubmit['data'][key]);
        if (!_.isEqual(copyInitData.toString(), copySubmitData.toString())) {
          return true;
        }
      }
    }
    // return !_.isEqual(formattedInitData, dataSubmit);
    return false;
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const isChange = isChangeInput();
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  }

  const handleCloseModal = (ignoreCheck = false) => {
    if (ignoreCheck) {
      props.reset(props.id);
      if (props.toggleCloseModalEmployee) {
        props.toggleCloseModalEmployee(successInfo);
      }
    } else {
      executeDirtyCheck(() => {
        props.reset(props.id);
        if (props.toggleCloseModalEmployee) {
          props.toggleCloseModalEmployee(successInfo);
        }
      });
    }
  }

  useEffect(() => {
    if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.ADD)) {
      if (employeeActionType === EMPLOYEE_ACTION_TYPES.UPDATE) {
        handleCloseModal();
      } else {
        executeDirtyCheck(() => {
          props.reset(props.id);
          setSaveEmployeeData({});
          firstLoad();
        });
      }
      props.moveScreenReset();
    } else if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.SEARCH) || _.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.DETAIL)) {
      handleCloseModal(true);
      props.moveScreenReset();
    }
  }, [screenMoveInfo]);

  const handleBackPopup = () => {
    firstRef && firstRef.current && firstRef.current.blur();
    executeDirtyCheck(() => {
      if (props.popout) {
        updateStateSession(FSActionTypeScreen.SetSession);
        setForceCloseWindow(true);
      } else {
        handleCloseModal(true);
      }
    });
  };

  const handleCloseModalSendEmail = () => {
    setIsShowModalSendEmail(false);
  }

  useEffect(() => {
    if (successInfo) {
      handleBackPopup();
    }
  }, [successInfo]);

  useEffect(() => {
    switch (props.actionType) {
      case EmployeeAction.UpdateEmployeeSuccess:
        setSuccessInfo({ message: 'INF_COM_0004', employeeId: props.updateId });
        break;
      case EmployeeAction.CreateEmployeeSuccess:
        setSuccessInfo({ message: 'INF_COM_0003', employeeId: props.updateId });
        break;
      default:
        setIsShowModalSendEmail(false);
        break;
    }
    return () => { };

  }, [props.actionType]);

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleCloseModal();
      }
    }
  }, [forceCloseWindow]);

  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (!props.iconFunction) {
      return <></>
    } else {
      return <img src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />
    }
  }

  const getTextByMode = (isModal) => {
    if (employeeActionType === EMPLOYEE_ACTION_TYPES.CREATE) {
      return translate(`employees.create-edit.${isModal ? 'modal-title-create' : 'button-create'}`);
    } else {
      return translate(`employees.create-edit.${isModal ? 'modal-title-edit' : 'button-edit'}`);
    }
  }

  const addToEmployeeData = (addItem, saveData) => {
    if (saveData['employeeData']) {
      let notInArray = true;
      saveData['employeeData'].map((e, index) => {
        if (e.key === addItem.key) {
          notInArray = false;
          saveData['employeeData'][index] = addItem;
        }
      });
      if (notInArray) {
        saveData['employeeData'].push(addItem);
      }
    } else {
      saveData['employeeData'] = [addItem];
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

  const onChangeComment = (e) => {
    const value = e.target.value;
    setComment(value);
  }

  const addExtendField = (item, val, saveData) => {
    let addItem = null;
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP) {
      addItem = [];
      const arrVal = forceArray(val);
      arrVal.forEach(obj => {
        addItem.push(createExtItem(obj.fieldInfo, obj.value));
      })
    } else {
      addItem = createExtItem(item, val);
    }
    if (Array.isArray(addItem)) {
      addItem.forEach(addIt => {
        addToEmployeeData(addIt, saveData);
      });
    } else {
      addToEmployeeData(addItem, saveData);
    }
  }

  /**
   * languageId and timezoneId is Long
   *
   * @param field
   * @param val
   */
  const forceNullIfEmptyString = (field, val) => {
    if (val === "" &&
      (field.fieldName === "language_id" || field.fieldName === "timezone_id")
    ) {
      return null;
    }
    return val;
  }

  const updatePackages = (id, type, val) => {
    setPackageIds(val);
  }


  const updateStateField = (item, type, val) => {
    let fieldInfo = null;
    fieldInfos.forEach(field => {
      if (field.fieldId.toString() === item.fieldId.toString()) {
        fieldInfo = field;
      }
    });
    if (saveEmployeeData !== null && saveEmployeeData !== undefined && fieldInfo) {
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
      } else if (fieldInfo.isDefault) {
        if (fieldInfo.fieldName === "employee_icon") {
          saveEmployeeData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = JSON.stringify(val);
        } else {
          saveEmployeeData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = forceNullIfEmptyString(fieldInfo, val);
        }
        setSaveEmployeeData(_.cloneDeep(saveEmployeeData));
      } else if (fieldInfo.fieldName !== "employee_positions" && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.CALCULATION) {// employee_positions is inside employee_departments
        addExtendField(fieldInfo, val, saveEmployeeData);
        setSaveEmployeeData(_.cloneDeep(saveEmployeeData));
      }
    } else if (item.fieldName !== "employee_positions") {
      const newObject = saveEmployeeData;
      newObject[StringUtils.snakeCaseToCamelCase(item.fieldName)] = val;// StringUtils.emptyStringIfNull(val);
      setSaveEmployeeData(newObject);
    }
  }

  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  }

  const makeEmployeeDepartmentData = () => {
    const employeeDepartmentData = [];
    const camelEmplDepartmt = StringUtils.snakeCaseToCamelCase(specialFName.employeeDepartments);
    let saveData = null;
    if (saveEmployeeData !== undefined && saveEmployeeData !== null && Object.keys(saveEmployeeData).length > 0) {
      saveData = saveEmployeeData;
    } else if (employeeData !== undefined && employeeData !== null) {
      saveData = employeeData;
    }
    if (saveData && saveData[camelEmplDepartmt] !== undefined) {
      saveData[camelEmplDepartmt].map(departPost => {
        employeeDepartmentData.push({
          departmentId: departPost.departmentId,
          positionId: departPost.positionId
        });
      });
    }
    return employeeDepartmentData;
  }

  const getExtendfieldValue = (extendFieldList, fieldName) => {
    if (!extendFieldList) {
      return undefined;
    }
    let retField = null;
    extendFieldList.map(field => {
      if (field.key === fieldName) {
        retField = field;
      }
    });
    if (retField) {
      return retField.value;
    }
    return undefined;
  }

  /**
   * parse field value same when init
   *
   * @param item
   * @param value
   */
  const parseFieldValue = (item, value) => {
    const type = item.fieldType.toString();
    if (value === "" && (type === DEFINE_FIELD_TYPE.CHECKBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX)) {
      return "[]";
    } else if (type === DEFINE_FIELD_TYPE.CHECKBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
      const arr = JSON.parse(value);
      return arr;
    }
    if (value !== "" && type === DEFINE_FIELD_TYPE.NUMERIC) {
      return parseInt(value, 10);
    }
    if (value === "" &&
      (item.fieldName === "language_id"
        || item.fieldName === "timezone_id"
        || item.fieldName === "telephone_number"
        || item.fieldName === "cellphone_number"
      )
    ) {
      return null;
    }
    if ((!value || value.length <= 0) && (type === DEFINE_FIELD_TYPE.EMAIL || type === DEFINE_FIELD_TYPE.PHONE_NUMBER)) {
      return '';
    }
    if ((!value || value.length <= 0) && type === DEFINE_FIELD_TYPE.FILE) {
      return '[]';
    }
    if (item.fieldName === specialFName.employeeDepartments && (_.isNil(value) || _.isEmpty(value))) {
      return [];
    }
    return value;
  }

  const makeInitData = () => {
    const grapSqlParams = {};
    const jsonData = {};
    fieldInfos.forEach(item => {
      const fieldName = StringUtils.snakeCaseToCamelCase(item.fieldName);
      let value = item.isDefault ? initEmployee[fieldName] : getExtendfieldValue(initEmployee['employeeData'], item.fieldName);
      // in mode add value will be undefined because no data initEmployee
      value = parseFieldValue(item, value !== undefined ? value : item.defaultValue);
      if (item.isDefault && fieldName !== "employeePositions") {
        jsonData[fieldName] = value;
      } else if (fieldName !== "employeePositions") {
        addExtendField(item, value, jsonData);
      }
    });
    if (employeeActionType === EMPLOYEE_ACTION_TYPES.UPDATE) {
      grapSqlParams['employeeId'] = employeeId;
      jsonData['updatedDate'] = initEmployee['updatedDate'];
    }
    // delete jsonData['timezoneId'];
    jsonData['isAdmin'] = isAdmin;
    jsonData['comment'] = comment;
    jsonData['isAccessContractSite'] = isAccessContractSite;
    grapSqlParams['data'] = jsonData;
    return grapSqlParams;
  }

  useEffect(() => {
    setInitData(_.cloneDeep(makeInitData()));
  }, [fieldInfos, initEmployee]);

  const getClassNameScrollFirst = (errArr) => {
    let arrayFirst = [];
    fileSortValidate.forEach(item => {
      // const obj = errArr.filter(e => e.item.replace('_', '').toLowerCase() === item.fieldName.replace('_', '').toLowerCase())
      const obj = errArr.filter(e => StringUtils.equalPropertyName(item, item.fieldName));
      if (obj && obj.length > 0) {
        arrayFirst = [...arrayFirst, obj[0]];
      }
    });
    return arrayFirst && arrayFirst[0] && _.toLower(_.replace(arrayFirst[0].item, new RegExp('_', 'g'), '')) || '' // arrayFirst[0].item.replace('_', '').toLowerCase() || '';
  }

  useEffect(() => {
    if (props.errorValidates && props.errorValidates.length > 0) {
      // const acd = getClassNameScrollFirst(props.errorValidates);
      const element = wrapperRef.current.getElementsByClassName(`required_scroll_${getClassNameScrollFirst(props.errorValidates)}`);
      if (element && element[0]) {
        element[0].scrollIntoView();
        const elementInput = element[0].getElementsByTagName('input');
        elementInput && elementInput[0] && elementInput[0].focus();
      }

    }
  }, [props.errorValidates])

  const getDataStatusControl = (item) => {
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
      return { fieldValue: saveEmployeeData };
    }
    let saveData = null;
    if (saveEmployeeData !== undefined && saveEmployeeData !== null && Object.keys(saveEmployeeData).length > 0) {
      saveData = saveEmployeeData;
    } else if (!_.isEmpty(employeeData)) {
      saveData = employeeData;
    }
    if (saveData) {
      let fieldValue;
      if (item.isDefault) {
        if (item.fieldName === 'employee_icon' && _.isObject(saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)])) {
          fieldValue = [saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)]];
        } else {
          fieldValue = saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)];
        }
      } else if (saveData['employeeData'] !== undefined) {
        // extend field is in node 'employeeData'
        fieldValue = getExtendfieldValue(saveData['employeeData'], item.fieldName);
        // try get from origin
        if (_.isUndefined(fieldValue)) {
          fieldValue = getExtendfieldValue(employeeData['employeeData'], item.fieldName);
        }
      }

      if (fieldValue !== undefined) {
        const dataStatus = { ...item };
        dataStatus.fieldValue = fieldValue;
        return dataStatus;
      }
    }
    return null;
  }

  const compareItemInArray = (item, arr) => {
    let rs = 0;
    arr.map(it => {
      if (JSON.stringify(it) === JSON.stringify(item)) {
        rs += 1;
      }
    })
    return rs > 1;
  }

  const getErrorRowId = () => {
    const rs = [-1, 0];
    saveEmployeeData['employeeDepartments'].map((item, index) => {
      if (index > 0 && compareItemInArray(item, saveEmployeeData['employeeDepartments'])) {
        rs[0] = index;
        rs[1] += 1;
      }
    })
    return rs;
  }

  const includeDepartment = [
    'employeeDepartments',
    'employeePositions'
  ]

  const getErrorInfo = (item) => {
    let errorInfo = null;
    errorValidates.forEach(elem => {
      let fieldName = item.fieldName;
      if (item.isDefault) {
        fieldName = StringUtils.snakeCaseToCamelCase(fieldName);
      }
      if (elem.item === fieldName) {
        errorInfo = elem;
      } else if (item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages && elem.item === 'package_id') {
        errorInfo = elem;
      } else if(item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION ){
        const relationId = StringUtils.tryGetAttribute(item, "relationData.fieldId");
        if(relationId && (_.toString(elem.item) === _.toString(relationId) || _.toString(elem.errorParams) === _.toString(relationId))){
          errorInfo = elem;
        }
      }
      if (includeDepartment.includes(fieldName) && elem.item === 'department_id and position_id') {
        if (fieldName === includeDepartment[0]) {
          errorInfo = { errorCode: elem.errorCode, item, rowId: getErrorRowId()[0], errorLength: getErrorRowId()[1] + 1 };
        } else {
          errorInfo = { errorCode: null, item, rowId: getErrorRowId()[0], errorLength: getErrorRowId()[1] + 1 };
        }
      }
    });
    return errorInfo;
  }

  // const firstErrorItem = getFirstItemError(); :TODO by DongPD fix not focus when updateStateField
  const firstErrorItem = null;

  const getFiledByName = (listField, fieldName) => {
    let field = null;
    listField.every(element => {
      if (element.fieldName === fieldName) {
        field = element;
        // use every to breake the loop because can't break from a forEach
        return false;
      } else {
        return true;
      }
    });
    return field;
  }


  const renderFieldTextBoxDoubleColumn = (item, label, nextFieldName, tabIndex) => {
    const nextItem = getFiledByName(fieldInfos, nextFieldName);
    const firstError = getErrorInfo(item);
    const secondError = getErrorInfo(nextItem);
    let className = "col-lg-12 form-group";
    if (item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED) {
      className += ` required_scroll_${item.fieldName.replace('_', '').toLowerCase()}`;
    }
    if (_.isNil(nextItem)) {
      return <></>;
    }
    return (
      <FieldTextBoxDoubleColumn
        className={className}
        firstErrorItem={firstErrorItem}
        // key={item.fielId}
        fieldLabel={label}
        itemDataFields={[item, nextItem]}
        updateStateField={updateStateField}
        firstItemDataStatus={getDataStatusControl(item)}
        secondItemDataStatus={getDataStatusControl(nextItem)}
        errors={[firstError, secondError]}
        isDisabled={shouldDisable}
        tabIndex={tabIndex}
      />
    );
  }

  const renderToastMessage = () => {
    if (toastMessage === null) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={toastMessage.type}
        message={toastMessage.message}
        className="message-area-bottom position-absolute"
      />
    )
  }

  const renderMessage = () => {
    if (!msgError || msgError.length <= 0) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={MessageType.Error}
        message={msgError}
        className="w100"
      />
    )
  }

  const isSpecialField = (field) => {
    const specials = Object.values(specialFName);
    const type = field.fieldType.toString();
    return specials.includes(field.fieldName) || type === DEFINE_FIELD_TYPE.TAB || type === DEFINE_FIELD_TYPE.TITLE;
  }

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
  }

  const isFullWidth = (isDoubleColumn, index, rightSpace) => {
    if (rightSpace) {
      /**
       *  _____________ _____________
       * |_____________|_____________|
       * |_____________| right space
       */
      return false;// !isDoubleColumn;
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
  }

  const isFieldRelationAsSelf = (field) => {
    if (_.toString(field.fieldType) !== DEFINE_FIELD_TYPE.RELATION) {
      return false
    }
    if (field.relationData && field.relationData.asSelf === 1) {
      return true;
    }
    return false;
  }

/**
 * modify fields, add inTab
 *
 */
  useEffect(() => {
    if (_.isNil(fieldInfos)) {
      return;
    }
    const fieldTabs = fieldInfos.filter(e => e.fieldType.toString() === DEFINE_FIELD_TYPE.TAB)
    const fieldNormals = fieldInfos.filter(e => e.fieldType.toString() !== DEFINE_FIELD_TYPE.TAB && !isFieldRelationAsSelf(e))

    if (employeeViewMode === EMPLOYEE_VIEW_MODES.PREVIEW) {
      fieldInfos.forEach(e => {
        if (e.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeTimeZone
          || e.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeLanguage) {
          e.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
        } else if (e.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin) {
          e.fieldType = DEFINE_FIELD_TYPE.TEXT;
        }
      });
    } 

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

  const renderDynamicControlField = (listFields: any[]) => {
    let curRightSpace = false;
    let nxtRightSpace = false;
    return (
      listFields.map((item, idx) => {
        curRightSpace = _.cloneDeep(nxtRightSpace);
        const fullWidth = isFullWidth(item.isDoubleColumn, idx, curRightSpace);
        let className = fullWidth ? "col-lg-12 form-group" : "col-lg-6 form-group";
        if (item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED) {
          className += ` required_scroll_${item.fieldName.replace('_', '').toLowerCase()}`;
        }
        if(item.fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA){
          className+=' form-textarea';
        }
        const tabIndex = idx + 1;
        if (!isSpecialField(item)) {
          // tick that next item has right space or not?
          nxtRightSpace = !curRightSpace && !fullWidth;
        }
        let clearBoth = false;
        if (nxtRightSpace) {
          clearBoth = true;
        }
        if (item.fieldName === specialFName.employeeSurname) {
          return renderFieldTextBoxDoubleColumn(item, translate('employees.create-edit.label-employee-surname'), specialFName.employeeName, tabIndex);
        } else if (item.fieldName === specialFName.employeeSurnameKana) {
          return renderFieldTextBoxDoubleColumn(item, translate('employees.create-edit.label-employee-surname-kana'), specialFName.employeeNameKana, tabIndex);
        } else if (item.fieldName === specialFName.employeeDepartments) {
          const positionItem = getFiledByName(fieldInfos, specialFName.employeePositions);
          if (_.isNil(positionItem)) {
            return <></>;
          }
          return (
            <FieldEmployeeDepartment
              className={`col-lg-12 form-group required_scroll_${item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED ? item.fieldName.replace('_', '').toLowerCase() : ''}`}
              // key={item.fielId}
              fieldLabel={translate('employees.create-edit.label-departmanet')}
              department={item}
              errorDepartment={getErrorInfo(item)}
              position={positionItem}
              updateStateField={updateStateField}
              employeeDepartments={makeEmployeeDepartmentData()}
              errorPosition={getErrorInfo(positionItem)}
              tabIndex={tabIndex}
              disabledBtn={shouldDisable}
            />
          );
        } else if (item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages){
          const initDataMulti = item && item.fieldItems.map(it => {
            return {
              id: it.itemId,
              name: it.itemLabel
            }
          })
          let lstDataEdit = [];
          if(employeeActionType === EMPLOYEE_ACTION_TYPES.UPDATE){
            lstDataEdit = employeeData && employeeData['employeePackages'] && employeeData['employeePackages'].map(it => {
              return it.packagesId
            })
          }
          const lstData = packageIds || lstDataEdit || [];
          return (
            <div className={`${className} custom-dot-three-packages`}>
            <label>{JSON.parse(item.fieldLabel) && JSON.parse(item.fieldLabel)['ja_jp']}</label>
            <MultiDropDown
              lstData={lstData}
              initData={initDataMulti}
              index={1}
              type={'PACKAGES'}
              placehoder={translate('employees.inviteEmployees.form.placeholder.package')}
              updateStateFields={updatePackages}
              errorInfo={getErrorInfo(item)}
            />
            </div>
          )
        } else if (item.fieldName === specialFName.employeeName
          || item.fieldName === specialFName.employeeNameKana
          || item.fieldName === specialFName.employeePositions) {
          return <></>;
        } else {
          const isIconField = item.fieldName === _.snakeCase(RESPONSE_FIELD_NAME.EMPLOYEE_ICON);
          const idxRef = fieldInfos.findIndex(e => e.fieldId === item.fieldId);
          let shouldDisableCheck = shouldDisable;
          const arrayType = [DEFINE_FIELD_TYPE.SINGER_SELECTBOX, DEFINE_FIELD_TYPE.MULTI_SELECTBOX];
          if(arrayType.includes(_.toString(item.fieldType))){
            shouldDisableCheck = false
          }
          return (
            <>
              <DynamicControlField
                ref={inputRefs[idxRef]}
                isFocus={(props.errorValidates && props.errorValidates.length > 0) ? (checkSnakeCase(item.fieldName) === firstErrorItem) : false}
                key={item.fieldId}
                recordId={[employeeId]}
                elementStatus={getDataStatusControl(item)}
                updateStateElement={updateStateField}
                belong={FIELD_BELONG.EMPLOYEE}
                fieldInfo={item}
                className={`${className} ${clearBoth ? 'set-clear-table-list-wrap': ''}`}
                isRequired={item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
                isDisabled={shouldDisableCheck || item.modifyFlag === 0}
                errorInfo={getErrorInfo(item)}
                controlType={employeeActionType === EMPLOYEE_ACTION_TYPES.UPDATE ? ControlType.EDIT : ControlType.ADD}
                listFieldInfo={listFieldTab}
                updateFiles={updateFiles}
                idUpdate={employeeId}
                isSingleFile={isIconField}
                acceptFileExtension={isIconField ? FILE_FOMATS.IMG : null}
                formBottomRef={formBottomRef}
              />
            </>
          );
        }
      })
    );
  }

  const renderContentTab = (listFieldContent: any[]) => {
    return <>{renderDynamicControlField(listFieldContent)}</>
  }

  const handleSendEmail = () => {
    handleSubmit(true, null, true);
    handleBackPopup();
  }

  const renderTab = () => {
    return <DynamicControlField
      controlType={ControlType.EDIT}
      showFieldLabel={false}
      fieldInfo={listFieldTab[0]}
      listFieldInfo={fieldInfos}
      renderControlContent={renderContentTab}
    />
  }

  const onChangeCheckbox = (e) => {
    if (e.target.value === "isAccessContractSite") {
      setIsAccessContractSite(!isAccessContractSite);
    } else if (e.target.value === "isAdmin") {
      setIsAdmin(!isAdmin);
    } else if (e.target.value === "isReceivedMail") {
      setIsReceivedMail(!isReceivedMail)
    }
  }

  const renderCheckBoxFlag = () => {
    return (
      <div className="col-lg-12 form-group">
        <div className="row">
          <div className="col-md-6">
            <label className={`${shouldDisable ? 'icon-check-invalid' : 'icon-check'}`}>
              <input value={"isAccessContractSite"} type="checkbox" disabled={shouldDisable} checked={isAccessContractSite} onChange={(e) => onChangeCheckbox(e)} />
              <i></i>
              {translate('employees.create-edit.label-login')}
            </label>
          </div>
          <div className="col-md-6">
            <label className={`${shouldDisable ? 'icon-check-invalid' : 'icon-check'}`}>
              <input value={"isAdmin"} type="checkbox" checked={isAdmin} disabled={shouldDisable} onChange={(e) => onChangeCheckbox(e)} />
              <i></i>
              {translate('employees.create-edit.label-admin')}
            </label>
          </div>
        </div>
        {
          employeeActionType === EMPLOYEE_ACTION_TYPES.CREATE ?
            <>
              <div className="row mt-4">
                <div className="col-md-12">
                  <div className="border-top pt-5 text-center">
                    <label className={`${shouldDisable ? 'icon-check-invalid' : 'icon-check'}`}>
                      <input value={"isReceivedMail"} type="checkbox" checked={isReceivedMail} disabled={shouldDisable} onChange={(e) => onChangeCheckbox(e)} />
                      <i></i>
                      {translate('employees.create-edit.label-received-mail')}
                    </label>
                  </div>
                </div>
              </div>
            </>
            : null
        }
      </div>
    )
  }

  const renderModal = () => {
    const buttonClassName = shouldDisable ? "button-blue button-form-register disable" : "button-blue button-form-register";
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a className="modal-heading-title" onClick={props.popout || !props.isOpenedFromModal ? null : handleBackPopup} >
                      <i className={`icon-small-primary icon-return-small ${props.popout || !props.isOpenedFromModal ? 'disable' : ''}`} />
                    </a>
                    <span className="text">{getIconFunction()} {getTextByMode(true)}</span>
                  </div>
                </div>
                <div className="right">
                  {showModal && !props.hiddenShowNewTab && <button className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />}
                  {showModal && <button className="icon-small-primary icon-close-up-small line" onClick={() => handleCloseModal()} />}
                </div>
              </div>
              <div className="modal-body style-3">
                <div className="popup-content popup-content-new-window style-3 height100vh-200" ref={wrapperRef}>
                  <div className="user-popup-form">
                    <form >
                      <div className="break-row">
                        {renderMessage()}
                        {isExistBeforeTab && listFieldBeforeTab && renderDynamicControlField(listFieldBeforeTab)}
                        {listFieldTab && listFieldTab.length > 0 && renderTab()}
                        {isExistAfterTab && listFieldAfterTab && renderDynamicControlField(listFieldAfterTab)}
                        {(!listFieldTab || listFieldTab.length === 0) && renderDynamicControlField(listFieldNormal)}
                        {(listFieldTab.length > 0 || listFieldNormal.length > 0) && renderCheckBoxFlag()}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="user-popup-form-bottom" ref={formBottomRef}>
                <button onClick={handleBackPopup} ref={firstRef} className="button-cancel aaaa">{translate('employees.create-edit.button-cancel')}</button>
                <button onClick={(event) => handleSubmit(true, event)} className={buttonClassName}>{getTextByMode(false)}</button>
              </div>
              {renderToastMessage()}
            </div>
          </div>
        </div>
      </>
    );
  }

  const renderModalSendMail = () => {
    return (
      <div className="modal-content">
        <div className="popup-esr2 popup-esr3" id="popup-esr2">
            <div className="popup-esr2-content">
              <div className="modal-header">
                  <div className="left">
                  <div className="popup-button-back"><span className="text no-border no-padding">{translate("employees.create-edit.send-email.title-modal")}</span></div>
                  </div>
              </div>
              <div className="popup-esr2-body border-bottom mb-4">
                  <form>
                    <div className="form-group no-margin">
                        <label className="mb-2">{translate("employees.create-edit.send-email.label")}</label>
                        <textarea autoFocus={true} defaultValue={comment} onChange={onChangeComment} className="input-normal " placeholder={translate("employees.create-edit.send-email.placeholder")} />
                    </div>
                  </form>
              </div>
              <div className="align-center mb-4">
                <button className="button mr-4" onClick={handleCloseModalSendEmail}>{translate("employees.create-edit.send-email.button-cancel")}</button>
                <button className={`button-blue ${comment.trim().length === 0 ? 'disable' : ''}`} disabled={comment.trim().length === 0} onClick={handleSendEmail}>{translate("employees.create-edit.send-email.button-send")}</button>
              </div>
          </div>
        </div>
      </div>
    )
  }

  if (showModal) {
    return (
      <>
        <Modal isOpen fade toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-field-search" autoFocus>
          {renderModal()}
        </Modal>
        {
          isShowModalSendEmail && employeeActionType === EMPLOYEE_ACTION_TYPES.CREATE ?
            <Modal isOpen fade toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-field-search" autoFocus={false}>
              {renderModalSendMail()}
            </Modal>
            : null
        }
      </>
    );
  } else {
    if (props.popout) {
      return renderModal();
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ employeeInfo, applicationProfile, screenMoveState, authentication }: IRootState, ownProps: any) => {
  const stateObject = {
    tenant: applicationProfile.tenant,
    screenMoveInfo: screenMoveState.screenMoveInfo,
    authorities: authentication.account.authorities,
    employeeData: {},
    initEmployee: {},
    fieldInfos: [],
    errorValidates: [],
    actionType: null,
    errorMessage: null,
    successMessage: null,
    updateId: null,
  };
  if (employeeInfo && employeeInfo.data.has(ownProps.id)) {
    stateObject.employeeData = employeeInfo.data.get(ownProps.id).employeeData;
    stateObject.initEmployee = employeeInfo.data.get(ownProps.id).initEmployee;
    stateObject.fieldInfos = employeeInfo.data.get(ownProps.id).fields;
    stateObject.errorValidates = employeeInfo.data.get(ownProps.id).errorItems;
    stateObject.actionType = employeeInfo.data.get(ownProps.id).action;
    stateObject.errorMessage = employeeInfo.data.get(ownProps.id).errorMessage;
    stateObject.successMessage = employeeInfo.data.get(ownProps.id).successMessage;
    stateObject.updateId = employeeInfo.data.get(ownProps.id).employeeId;
  }
  return stateObject;
};

const mapDispatchToProps = {
  handleGetDataEmployee,
  handleSubmitEmployeeData,
  reset,
  startExecuting,
  moveScreenReset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalCreateEditEmployee);
