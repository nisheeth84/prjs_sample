import React, { useEffect, useState, useRef, useMemo, createRef } from 'react';
import {
  CUSTOMER_ACTION_TYPES,
  CUSTOMER_VIEW_MODES,
  CUSTOMER_REMOVE_FIELD_CREATE,
  CUSTOMER_REMOVE_FIELD_UPDATE,
  CUSTOMER_SPECIAL_FIELD_NAMES as specialFName
} from '../constants';
import { translate, Storage } from 'react-jhipster';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { IRootState } from 'app/shared/reducers';
import { handleGetDataCustomer, handleSubmitCustomerData, reset, CustomerAction } from './create-edit-customer.reducer';
import { startExecuting } from 'app/shared/reducers/action-executing';
import StringUtils, { forceArray, getFieldLabel, firstChar, getEmployeeImageUrl } from 'app/shared/util/string-utils';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import useEventListener from 'app/shared/util/use-event-listener';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE } from '../../../shared/layout/dynamic-form/constants';
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import DynamicControlField from '../../../shared/layout/dynamic-form/control-field/dynamic-control-field';
import { ControlType, MODIFY_FLAG, SCREEN_TYPES, TIMEOUT_TOAST_MESSAGE, MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import { Modal } from 'reactstrap';
import FieldBusiness from './field-business';
import FieldCompanyDescription from './field-company-description';
import FieldPictureLogo from './field-picture-logo';
import { handleGetDataProduct } from 'app/modules/products/product-popup/product-edit.reducer';
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete';
import { TagAutoCompleteMode, TagAutoCompleteType } from 'app/shared/layout/common/suggestion/constants';
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';
import { FIELD_BELONG } from 'app/config/constants';
import { DATE_TIME_FORMAT, utcToTz } from 'app/shared/util/date-utils';
import BeautyPullDown from './beauty-pull-down';
import { CUSTOMER_NAME_CONPANY, CUSTOMER_NAME_COMPANY_FIELD } from '../constants'
import { fillLookupData } from 'app/shared/util/modules/add-edit';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import { isExceededCapacity } from 'app/shared/util/file-utils';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import * as R from 'ramda';

export interface ICreateEditCustomerModalProps extends StateProps, DispatchProps {
  id: string,
  toggleCloseModalCustomer?: (successInfo?) => void;
  customerActionType: any;
  customerViewMode: number;
  customerId?: number;
  popout?: boolean;
  iconFunction?: string;
  isOpenedFromModal?: boolean // = true if this modal is opened from another modal
  onCloseModalCustomer?: (customerId) => void; // action when this open
  hiddenShowNewTab?: boolean; // hide button open in new window
  listFieldPreview?: any;
  parent?: any;
  fromTagAuto?: boolean
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

/**
 * Create/edit customer modal area
 * @param props
 */
const CreateEditCustomerModal = (props: ICreateEditCustomerModalProps) => {
  const [msgError, setMsgError] = useState('');
  const [msgSuccess, setMsgSuccess] = useState('');
  const [saveCustomerData, setSaveCustomerData] = useState({});
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [successInfo, setSuccessInfo] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  // use for popup new window
  const [customerActionType, setCustomerActionType] = useState(props.customerActionType);
  const [customerViewMode, setCustomerViewMode] = useState(props.customerViewMode);
  const [customerData, setCustomerData] = useState(props.customerData);
  const [fieldInfos, setFieldInfos] = useState([]);
  const [errorValidates, setErrorValidates] = useState([]);
  const [customerId, setCustomerId] = useState(props.customerId);
  const [, setInitData] = useState(null);
  const [, setLstErrorItem] = useState([]);
  const [, setFileUpload] = useState(null);
  const [fileDefault,] = useState(null);
  const [fileSortValidate, setFileSortValidate] = useState([]);
  const [fileUploads, setFileUploads] = useState({});
  const [indexCompany, setIndexCompany] = useState(0);
  const ref = useRef(null);
  const wrapperRef = useRef(null);
  const inputRefs = useMemo(() => Array.from({ length: fieldInfos.length }).map(() => createRef<any>()), [fieldInfos]);
  const [, setShowScenarioPopup] = useState(false);
  const shouldDisable = customerViewMode === CUSTOMER_VIEW_MODES.PREVIEW;
  const { screenMoveInfo } = props;
  const [listFieldTab, setListFieldTab] = useState([]);
  const [listFieldNormal, setListFieldNormal] = useState([])
  const [exclusiveMsg, setExclusiveMsg] = useState(null);
  const [msgValidateParentId, setMsgValidateParentId] = useState(null);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeIdSelected, setEmployeeIdSelected] = useState(null);
  const [valueTagEmployee, setValueTagEmployee] = useState(null);
  const employeeDetailCtrlId = useId(1, "createEditCustomerEmployeeDetail_")

  const lang = Storage.session.get('locale');

  const formId = "form-customer-edit";
  const classAddCreateOrther: string[][] = [['fileUpload'], ['icon-delete']];
  const [isChanged] = useDetectFormChange(formId, [], classAddCreateOrther);

  // #region popup new window
  const getClassNameScrollFirst = errArr => {
    let arrayFirst = [];
    fileSortValidate.forEach(item => {
      // const obj = errArr.filter(e => e && e.item && e.item.replace('_', '').toLowerCase() === item.fieldName.replace('_', '').toLowerCase());
      const obj = errArr.filter(e => StringUtils.equalPropertyName(item, item.fieldName));
      if (obj && obj.length > 0) {
        arrayFirst = [...arrayFirst, obj[0]];
      }
    });
    // return (arrayFirst && arrayFirst[0] && arrayFirst[0].item.replace('_', '').toLowerCase()) || '';
    return arrayFirst && arrayFirst[0] && _.toLower(_.replace(arrayFirst[0].item, new RegExp('_', 'g'), '')) || ''
  };

  useEffect(() => {
    setLstErrorItem(props.errorValidates ? props.errorValidates : []);
    if (props.errorValidates && props.errorValidates.length > 0) {
      const element = wrapperRef.current.getElementsByClassName(`required_scroll_${getClassNameScrollFirst(props.errorValidates)}`);
      if (element && element[0]) {
        element[0].scrollIntoView();
        const elementInput = element[0].getElementsByTagName('input');
        elementInput && elementInput[0] && elementInput[0].focus();
      }
    }
    let exclusiveError = '';
    let msgErrorParent = ''
    props.errorValidates && props.errorValidates.map(elm => {
      if (elm.item === 'customerId') {
        exclusiveError = translate(`messages.${elm.errorCode}`)
      }
      if (elm.item === 'customerParent') {
        msgErrorParent = translate(`messages.${elm.errorCode}`)
      }
    })
    setErrorValidates(props.errorValidates ? props.errorValidates : []);
    setMsgValidateParentId(msgErrorParent);
    setExclusiveMsg(exclusiveError);
  }, [props.errorValidates]);

  useEffect(() => {
    setCustomerActionType(props.customerActionType);
  }, [props.customerActionType]);

  useEffect(() => {
    setCustomerViewMode(props.customerViewMode);
  }, [props.customerViewMode]);

  useEffect(() => {
    /**
     * when there are more than 1 CreateEditCustomerModal
     * customerData will be overwritten in mode CREATE
     */
    if(props.fromTagAuto || customerActionType === CUSTOMER_ACTION_TYPES.CREATE){
      setCustomerData({})
    }else{
      setCustomerData(props.customerData);
      setValueTagEmployee(props.customerData && props.customerData['personInCharge'] || null);
    }

  }, [props.customerData]);

  useEffect(() => {
    if (props.parent) {
      const { parentId, parentName } = props.parent
      const newCustomerData = Object.assign(customerData, { parentId, parentName });
      setCustomerData(newCustomerData);
    }
  }, [props.parent]);


  useEffect(() => {
    if (props.customerViewMode === CUSTOMER_VIEW_MODES.PREVIEW && !_.isNil(props.listFieldPreview)) {
      setFieldInfos(props.listFieldPreview);
    } else {
      if(props.fieldInfos && props.fieldInfos.length > 0){
        setFieldInfos(props.fieldInfos);
        setFileSortValidate(
          props.fieldInfos.filter(e => e.modifyFlag === MODIFY_FLAG.REQUIRED || e.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED)
        );
      }
    }
  }, [props.fieldInfos]);

  useEffect(() => {
    setCustomerId(props.customerId);
  }, [props.customerId]);

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(CreateEditCustomerModal.name, {
        msgError,
        msgSuccess,
        saveCustomerData,
        customerActionType,
        customerViewMode,
        customerData,
        fieldInfos,
        errorValidates,
        customerId,
        successInfo
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(CreateEditCustomerModal.name);
      if (saveObj) {
        setMsgError(saveObj.msgError);
        setMsgSuccess(saveObj.msgSuccess);
        setSaveCustomerData(saveObj.saveCustomerData);
        setCustomerActionType(saveObj.customerActionType);
        setCustomerViewMode(saveObj.customerViewMode);
        setCustomerData(saveObj.customerData);
        setFieldInfos(saveObj.fieldInfos);
        setErrorValidates(saveObj.errorValidates);
        setCustomerId(saveObj.customerId);
        setSuccessInfo(saveObj.successInfo);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(CreateEditCustomerModal.name);
    }
  };

  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false, 'keepOpen': true }, window.location.origin);
    }
  };

  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        let closeInfo = null;
        if (ev.data.forceCloseWindow && customerActionType === CUSTOMER_ACTION_TYPES.UPDATE) {
          // set param null to reload customer detail modal
          closeInfo = { message: null, customerIds: null };
        }
        props.toggleCloseModalCustomer(closeInfo);
      } else if (ev.data.type === FSActionTypeScreen.Search) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
      }
    }
  };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  const getParamForEdit = () => {
    return {
      customerId,
      mode: 'edit'
    };
  };

  const firstLoad = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
      // document.body.className = "wrap-customer modal-open";
    } else {
      setShowModal(true);
      props.handleGetDataCustomer(props.id, getParamForEdit(), customerActionType);
    }
  }

  useEffect(() => {
    firstLoad();
    return () => {
      props.reset(props.id);
      updateStateSession(FSActionTypeScreen.RemoveSession);
    };
  }, []);

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/create-edit-customer`, '', style.toString());
  };


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
  };

  const buildAddress = value => {
    let zipCode = null;
    let building = null;
    let address = null;
    if (_.isString(value)) {
      const objAddress = JSON.parse(value);
      zipCode = (objAddress && objAddress['zip_code']) || null;
      building = (objAddress && objAddress['building_name']) || null;
      address = (objAddress && objAddress['address_name']) || null;
    }
    return { zipCode, building, address };
  };

  const getCustomerNameCompany = (cName) => {
    let rs = cName;
    const objRs = CUSTOMER_NAME_CONPANY[indexCompany];
    if (objRs['type'] === 2) {
      rs = rs + objRs['text'];
    } else {
      rs = objRs['text'] + rs;
    }
    return rs;
  }

  const handleSubmit = (initType: boolean, event, submitComment?: boolean) => {
    const files = getfileUploads();
    if (event && isExceededCapacity(files)) {
      setMsgError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else if (event) {
      setMsgError('');
    }
    if (shouldDisable) {
      return;
    }
    const grapSqlParams = {};
    let jsonData = {};
    if (saveCustomerData !== null && saveCustomerData !== undefined) {
      if (customerActionType === CUSTOMER_ACTION_TYPES.UPDATE) {
        grapSqlParams['customerId'] = customerId;
        jsonData['updatedDate'] = customerData && customerData['updatedDate'];
        jsonData['parentId'] = customerData && customerData['parentId'] || null;
      }
      jsonData = Object.assign(jsonData, saveCustomerData);
    }
    grapSqlParams['data'] = jsonData;
    if (initType) {
      const submitParams = jsonData;
      if (jsonData && jsonData['customerAddress']) {
        submitParams['zipCode'] = buildAddress(jsonData['customerAddress']).zipCode;
        submitParams['building'] = buildAddress(jsonData['customerAddress']).building;
        submitParams['address'] = buildAddress(jsonData['customerAddress']).address;
        delete submitParams['customerAddress'];
      } else {
        delete submitParams['customerAddress'];
      }
      if (jsonData && jsonData['customerLogo']) {
        if (jsonData['customerLogo'].length < 1) {
          delete submitParams['customerLogo'];
        }
      }
      if (customerActionType === CUSTOMER_ACTION_TYPES.CREATE) {
        delete submitParams['customerId'];
      } else if (customerActionType === CUSTOMER_ACTION_TYPES.UPDATE) {
        submitParams['customerId'] = customerId;
      }
      if (submitParams && submitParams['customerName'] && indexCompany > 1) {
        const cloneName = _.clone(submitParams['customerName']);
        submitParams['customerName'] = getCustomerNameCompany(cloneName);
      }
      grapSqlParams['data'] = submitParams;
      props.handleSubmitCustomerData(props.id, grapSqlParams, customerActionType, getfileUploads(), props.fromTagAuto);
      event.preventDefault();
    }
    return grapSqlParams;
  };

  useEffect(() => {
    handleSubmit(false, null);
  });


  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (isChanged) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  const handleCloseModal = (ignoreCheck?: boolean) => {
    if (ignoreCheck) {
      props.reset(props.id);
      if (props.toggleCloseModalCustomer) {
        props.toggleCloseModalCustomer(successInfo);
      }
    } else {
      executeDirtyCheck(() => {
        props.reset(props.id);
        if (props.toggleCloseModalCustomer) {
          props.toggleCloseModalCustomer(successInfo);
        }
      });
    }
  };

  useEffect(() => {
    if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.ADD)) {
      if (customerActionType === CUSTOMER_ACTION_TYPES.UPDATE) {
        handleCloseModal(true);
      } else {
        props.reset(props.id);
        setSaveCustomerData({});
        firstLoad();
      }
      props.moveScreenReset();
    } else if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.SEARCH) || _.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.DETAIL)) {
      handleCloseModal(true);
      props.moveScreenReset();
    }
  }, [screenMoveInfo]);

  const handleBackPopup = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.SetSession);
      setForceCloseWindow(true);
    } else {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (successInfo) {
      handleCloseModal(true);
    }
  }, [successInfo]);

  useEffect(() => {
    switch (props.actionType) {
      case CustomerAction.UpdateCustomerSuccess:
        setSuccessInfo({ message: 'INF_COM_0004', customerId: props.updateId });
        break;
      case CustomerAction.CreateTagCustomerSuccess:
        if(props.fromTagAuto){
          props.onCloseModalCustomer(props.updateId);
        }
        break;
      case CustomerAction.CreateCustomerSuccess:
        if (props.hiddenShowNewTab) {
          props.onCloseModalCustomer(props.updateId);
        } else {
          setSuccessInfo({ message: 'INF_COM_0003', customerId: props.updateId });
        }
        break;
      case CustomerAction.SuccessCreateScenario:
        setShowScenarioPopup(false);
        break;
      default:
        break;
    }
    return () => { };
  }, [props.actionType]);

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
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
      return <img className="icon-group-user" src="../../../content/images/ic-sidebar-customer.svg" alt="" />;
    } else {
      return <img className="icon-group-user" src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />;
    }
  };

  /**
   * Get text for add or edit case
   */
  const getTextSubmitButton = () => {
    if (customerActionType === CUSTOMER_ACTION_TYPES.CREATE) {
      return translate('customers.create-edit-modal.create-button');
    } else {
      return translate('customers.create-edit-modal.edit-button');
    }
  };

  const createExtItem = (item, val) => {
    const isArray = Array.isArray(val);
    const itemValue = isArray ? JSON.stringify(val) : val ? val.toString() : '';
    return {
      fieldType: item.fieldType.toString(),
      key: item.fieldName,
      value: itemValue
    };
  };

  const addToEmployeeData = (addItem, saveData) => {
    if (saveData['customerData']) {
      let notInArray = true;
      saveData['customerData'].map((e, index) => {
        if (e.key === addItem.key) {
          notInArray = false;
          saveData['customerData'][index] = addItem;
        }
      });
      if (notInArray) {
        saveData['customerData'].push(addItem);
      }
    } else {
      saveData['customerData'] = [addItem];
    }
  };

  const addExtendField = (item, val, saveData) => {
    let addItem = null;
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP) {
      addItem = [];
      const arrVal = forceArray(val);
      arrVal.forEach(obj => {
        addItem.push(createExtItem(obj.fieldInfo, obj.value));
      });
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
  };

  /**
   * languageId and timezoneId is Long
   *
   * @param field
   * @param val
   */
  const forceNullIfEmptyString = (field, val) => {
    if (
      val === '' &&
      (field.fieldName === 'language_id' ||
        field.fieldName === 'timezone_id' ||
        field.fieldName === 'telephone_number' ||
        field.fieldName === 'cellphone_number')
    ) {
      return null;
    }
    return val;
  };

  const updateStateIsChange = (item, val, type, tags) => {
    const savePersonInCharge = _.cloneDeep(saveCustomerData);
    if (tags && tags.length > 0) {
      let obj = {};
      if (tags[0] && tags[0].employeeId) {
        obj = { employeeId: tags[0].employeeId };
      } else if (tags[0] && tags[0].departmentId) {
        obj = { departmentId: tags[0].departmentId };
      } else if (tags[0] && tags[0].groupId) {
        obj = { groupId: tags[0].groupId };
      }
      savePersonInCharge['personInCharge'] = obj;
    } else {
      savePersonInCharge['personInCharge'] = { employeeId: 0, groupId: 0, departmentId: 0 };
    }
    setValueTagEmployee(null);
    setSaveCustomerData(savePersonInCharge);
  };

  const updateStateParentId = (item, val, type, tags) => {
    const savePersonInCharge = _.cloneDeep(saveCustomerData);
    const customerDataInCharge = _.cloneDeep(customerData);
    savePersonInCharge['parentId'] = tags && tags.length > 0 ? tags[0].customerId : null;
    customerDataInCharge['parentId'] = savePersonInCharge['parentId'];
    customerDataInCharge['parentName'] = tags && tags.length > 0 ? tags[0].customerName : null;
    customerDataInCharge['parentCustomerName'] = tags && tags.length > 0 ? tags[0].parentCustomerName : null;
    customerDataInCharge['parentCustomerAddress'] = tags && tags.length > 0 ? tags[0].customerAddress : null;
    setCustomerData(customerDataInCharge);
    setSaveCustomerData(savePersonInCharge);
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

  const updateStateField = (item, type, val) => {
    let fieldInfo = null;
    fieldInfos.forEach(field => {
      if (field.fieldId.toString() === item.fieldId.toString()) {
        fieldInfo = field;
      }
    });
    if (saveCustomerData !== null && saveCustomerData !== undefined && fieldInfo) {
      if (_.isEqual(DEFINE_FIELD_TYPE.LOOKUP, _.toString(type))) {
        fillLookupData(val, fieldInfos, inputRefs, () => {
          displayToastMessage(translate('messages.INF_COM_0018'), MessageType.Info);
        })
      } else if (fieldInfo.isDefault) {
        if (fieldInfo.fieldName === "customer_logo") {
          saveCustomerData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = JSON.stringify(val);
        } else {
          saveCustomerData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = forceNullIfEmptyString(fieldInfo, val);
        }
        setSaveCustomerData(_.cloneDeep(saveCustomerData));
        // saveCustomerData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = forceNullIfEmptyString(fieldInfo, val);
      } else if (fieldInfo.fieldName && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.CALCULATION) {
        addExtendField(fieldInfo, val, saveCustomerData);
        setSaveCustomerData(_.cloneDeep(saveCustomerData));
      }
    } else if (item.fieldName) {
      const newObject = {};
      newObject[StringUtils.snakeCaseToCamelCase(item.fieldName)] = val; // StringUtils.emptyStringIfNull(val);
      setSaveCustomerData(newObject);
    }
  };

  const makeBusinessData = () => {
    const customerBusinessData = {
      businessMainId: null,
      businessSubId: null
    };
    const camelBusinessMainId = StringUtils.snakeCaseToCamelCase(specialFName.customerBusinessMain);
    const camelBusinessSubId = StringUtils.snakeCaseToCamelCase(specialFName.customerBusinessSub);
    let saveData = null;
    if (saveCustomerData !== undefined && saveCustomerData !== null && Object.keys(saveCustomerData).length > 0) {
      saveData = saveCustomerData;
    } else if (customerData !== undefined && customerData !== null) {
      saveData = customerData;
    }
    if (saveData && saveData[camelBusinessMainId] !== undefined) {
      customerBusinessData.businessMainId = saveData[camelBusinessMainId];
    }
    if (saveData && saveData[camelBusinessSubId] !== undefined) {
      customerBusinessData.businessSubId = saveData[camelBusinessSubId];
    }
    return customerBusinessData;
  };

  const makeCompanyDescriptionData = () => {
    let companyDescriptionData = null;
    const camelDescription = StringUtils.snakeCaseToCamelCase(specialFName.customerCompanyDescription);
    let saveData = null;
    if (saveCustomerData !== undefined && saveCustomerData !== null && Object.keys(saveCustomerData).length > 0) {
      saveData = saveCustomerData;
    } else if (saveData !== undefined && saveData !== null) {
      saveData = customerData;
    }
    if (saveData && saveData[camelDescription] !== undefined) {
      companyDescriptionData = saveData[camelDescription];
    }
    return companyDescriptionData;
  };

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
  };

  /**
   * parse field value same when init
   *
   * @param item
   * @param value
   */
  const parseFieldValue = (item, value) => {
    const type = item.fieldType.toString();
    if (value === '' && (type === DEFINE_FIELD_TYPE.CHECKBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX)) {
      return '[]';
    } else if (type === DEFINE_FIELD_TYPE.CHECKBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
      const arr = JSON.parse(value);
      return arr;
    }
    if (value !== '' && type === DEFINE_FIELD_TYPE.NUMERIC) {
      return parseInt(value, 10);
    }
    if (
      value === '' &&
      (item.fieldName === 'language_id' ||
        item.fieldName === 'timezone_id' ||
        item.fieldName === 'telephone_number' ||
        item.fieldName === 'cellphone_number')
    ) {
      return null;
    }
    if (value === '' && (item.fieldName === specialFName.customerBusinessMain || item.fieldName === specialFName.customerBusinessSub)) {
      return null;
    }
    return value;
  };

  const makeInitData = () => {
    const grapSqlParams = {};
    const jsonData = {};
    fieldInfos.forEach(item => {
      const fieldName = StringUtils.snakeCaseToCamelCase(item.fieldName);
      let value = item.isDefault ? customerData[fieldName] : getExtendfieldValue(customerData['customerData'], item.fieldName);
      value = parseFieldValue(item, value !== undefined ? value : item.defaultValue);
      value = _.isNaN(value) ? '' : value;
      if (item.isDefault && fieldName !== 'businessSubId') {
        jsonData[fieldName] = value;
      } else if (fieldName !== 'businessSubId') {
        addExtendField(item, value, jsonData);
      }
    });
    if (customerActionType === CUSTOMER_ACTION_TYPES.UPDATE) {
      grapSqlParams['customerId'] = customerId;
      jsonData['updatedDate'] = customerData && customerData['updatedDate'];
    }

    grapSqlParams['data'] = jsonData;
    return grapSqlParams;
  };

  useEffect(() => {
    setInitData(_.cloneDeep(makeInitData()));
  }, [fieldInfos, customerData]);

  // const forceArray = (item, value) => {
  //   const type = item.fieldType.toString();
  //   if (type === DEFINE_FIELD_TYPE.CHECKBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
  //     const ret = JSON.parse(value);
  //     return ret;
  //   }
  //   return value;
  // }

  const getDataStatusControl = item => {
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
      return { fieldValue: saveCustomerData };
    }
    let saveData = null;
    if (!_.isEmpty(customerData)) {
      saveData = customerData;
    }
    if (saveData) {
      let fieldValue;
      if (item.isDefault) {
        if (item.fieldName === 'customer_logo') {
          fieldValue = _.isObject(saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)]) ?
            [saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)]] : [];
          if (saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)]) {
            if (saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)].photoFilePath) {
              fieldValue[0]['filePath'] = saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)].photoFilePath;
              delete fieldValue[0]['photoFilePath']
            }
            if (saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)].photoFileName) {
              fieldValue[0]['fileName'] = saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)].photoFileName;
              delete fieldValue[0]['photoFileName']
            }
          }
        } else if (item.fieldName === 'customer_id') {
          fieldValue = customerData && customerData['customerId'];
        } else {
          fieldValue = saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)];
        }
      } else if (saveData['customerData'] !== undefined) {
        // extend field is in node 'customerData'
        fieldValue = getExtendfieldValue(saveData['customerData'], item.fieldName);
      }
      if (fieldValue !== undefined) {
        const dataStatus = { ...item };
        dataStatus.fieldValue = fieldValue;
        return dataStatus;
      }
    }
    if (item.fieldName === specialFName.customerAddress && saveData && saveData.zipCode) {
      const rs = {};
      rs['zip_code'] = saveData.zipCode;
      rs['building_name'] = saveData.building;
      rs['address_name'] = saveData.address;
      return Object.assign(item, { fieldValue: JSON.stringify(rs) });
    }
    return null;
  };

  const getErrorInfo = item => {
    let errorInfo = null;
    errorValidates.forEach(elem => {
      let fieldName = item.fieldName;
      if (item.isDefault) {
        fieldName = StringUtils.snakeCaseToCamelCase(fieldName);
      }
      if (elem && elem.item && elem.item.toLowerCase() === fieldName.toLowerCase()) {
        const errorTmp = {};
        errorTmp['rowId'] = elem.rowId;
        errorTmp['item'] = elem.item;
        errorTmp['errorCode'] = elem.errorCode;
        errorTmp['params'] = elem.params ? elem.params : null;
        errorInfo = errorTmp;
      }
      if (errorInfo && 
            ((elem && elem.item && elem.item.toLowerCase() === 'url' && fieldName.toLowerCase() === 'url') || (elem && elem.arrayError && item.fieldName.indexOf('link_') !== -1))
          ) {
        errorInfo = { arrayError: elem.arrayError || [] };
      }
      if (item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
        const relationId = StringUtils.tryGetAttribute(item, "relationData.fieldId");
        if(relationId && (_.toString(elem.item) === _.toString(relationId) || _.toString(elem.errorParams) === _.toString(relationId))){
          errorInfo = elem;
        }
      }
      if (elem && elem.item === 'customerId') {
        errorInfo = null;
      }
    });
    return errorInfo;
  };

  // const getFirstItemError = () => {
  //   let firstErrorItem = null;
  //   if (lstErrorItem && lstErrorItem.length > 0) {
  //     for (let i = 0; i < fieldInfos.length; i++) {
  //       const filedNameInit = checkSnakeCase(fieldInfos[i].fieldName);
  //       if (lstErrorItem.some(j => checkSnakeCase(j.item) === filedNameInit)) {
  //         firstErrorItem = filedNameInit;
  //         break;
  //       }
  //     }
  //   }
  //   return firstErrorItem;
  // };

  const getFieldByName = (listField, fieldName) => {
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
  };

  /**
   * Render product list item
   */
  const renderProductList = () => {
    return (
      <div className="col-lg-6 form-group">
        <div className="form-group">
          <TagAutoComplete
            type={TagAutoCompleteType.Product}
            title={translate('customers.create-edit-modal.product')}
            id="product"
            modeSelect={TagAutoCompleteMode.Multi}
            ref={ref}
            elementTags={
              customerData['productTradingData'] && customerData['productTradingData'].fieldInfo
                ? customerData['productTradingData'].fieldInfo
                : null
            }
            inputClass={`input-normal input-common2 one-item ${shouldDisable ? 'disable' : ''}`}
            isDisabledPreView={shouldDisable}
          />
        </div>
      </div>
    );
  };

  // TODO: getCustomerSuggestion
  const renderCustomerSuggestion = (classSugges) => {
    const parentCustomerNameSug = R.path(['parentCustomerName'], customerData) || '';
    const addressParent = R.path(['parentCustomerAddress'], customerData) || '';
    return (
      <div className={classSugges}>
        <div className="form-group">
          <TagAutoComplete
            type={TagAutoCompleteType.Customer}
            title={translate('customers.create-edit-modal.customer-parent')}
            id="customer"
            modeSelect={TagAutoCompleteMode.Single}
            ref={ref}
            placeholder={translate('customers.create-edit-modal.placeholder-customer-parent')}
            elementTags={
              customerData['parentId']
                ? [{ customerId: customerData['parentId'], customerName: customerData['parentName'], parentCustomerName: parentCustomerNameSug, customerAddress: addressParent }]
                : null
            }
            onActionSelectTag={updateStateParentId}
            validMsg={msgValidateParentId}
            inputClass={`input-normal input-common2 one-item ${shouldDisable ? 'disable' : ''}`}
            isDisabledPreView={shouldDisable}
            // fromCustomer={true}
          />
        </div>
      </div>
    );
  };

  const getElementTags = value => {
    let rs = [];
    if (value) {
      if (value.departmentName) {
        rs = [{ departmentId: value.departmentId, departmentName: value.departmentName }];
      } else if (value.employeeName) {
        rs = [{ employeeId: value.employeeId, employeeName: value.employeeName, employeeSurname: value.employeeSurname }];
      } else if (value.groupName) {
        rs = [{ groupId: value.groupId, groupName: value.groupName }];
      }
      return rs;
    } else {
      return null;
    }
  };

  /**
   * Render employee suggestion
   */
  const renderEmployeeSuggestion = (classSugges) => {
    return (
      <div className={classSugges}>
        <div className="form-group">
          <TagAutoComplete
            type={TagAutoCompleteType.Employee}
            title={translate('customers.create-edit-modal.employee')}
            id="employee"
            modeSelect={TagAutoCompleteMode.Single}
            ref={ref}
            onActionSelectTag={(a, b, c, d) => updateStateIsChange(a, b, c, d)}
            elementTags={getElementTags(valueTagEmployee)}
            inputClass={`input-normal input-common2 one-item ${shouldDisable ? 'disable' : ''}`}
            placeholder={translate('customers.create-edit-modal.placeholder-employee')}
            isDisabledPreView={shouldDisable}
          />
        </div>
      </div>
    );
  };

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

  const displayMessage = () => {
    if ((!msgError || msgError.length <= 0) && (!msgSuccess || msgSuccess.length <= 0)) {
      if (!props.errorValidates || props.errorValidates.length === 0) {
        if (_.isNil(props.responseStatus) || props.responseStatus === 0 || props.responseStatus === 200) {
          return <></>;
        }
        return <BoxMessage messageType={MessageType.Error} message={translate('messages.ERR_COM_0001')} />
      }
      if (props.errorValidates && props.errorValidates.find(e => e['errorCode'] === 'ERR_COM_0012')) {
        return <BoxMessage messageType={MessageType.Error} message={translate('messages.ERR_COM_0012')} />
      }
      return <></>;
    }
    return (
      <BoxMessage
        messageType={msgError && msgError.length > 0 ? MessageType.Error : MessageType.Success}
        message={msgError && msgError.length > 0 ? msgError : msgSuccess}
      />
    );
  };

  const fieldPreOrNext = (curIdx, increase) => {
    const step = increase ? 1 : -1;
    const length = fieldInfos.length;
    const specials = Object.values(CUSTOMER_REMOVE_FIELD_UPDATE);
    let target = null;
    const start = curIdx + step;
    if (fieldInfos[start] === undefined) {
      return null;
    }
    for (let i = start; increase ? i < length : i > 0; i += step) {
      if (specials.includes(fieldInfos[i].fieldName)) {
        continue;
      }
      target = fieldInfos[i];
      break;
    }
    return target;
  };

  const isFullWidth = (isDoubleColumn, index, hasSpace) => {
    const nxt = fieldPreOrNext(index, true);
    let fullWidth = false;
    if (hasSpace) {
      return !isDoubleColumn;
    } else {
      if (!nxt) {
        fullWidth = true;
      } else if (nxt.isDoubleColumn) {
        fullWidth = !isDoubleColumn;
      } else {
        fullWidth = true;
      }
    }
    return fullWidth;
  };

  /**
   * event update file
   * @param file
   * @param fieldName
   */
  const updateFileData = (file, fieldName) => {
    if (saveCustomerData !== null && saveCustomerData !== undefined) {
      saveCustomerData[fieldName] = StringUtils.emptyStringIfNull(file);
      setFileUpload(file);
    } else {
      const newObject = {};
      newObject[fieldName] = StringUtils.emptyStringIfNull(file);
      setSaveCustomerData(newObject);
    }
  };

  const getDisplayEmployeeName = (emp) => {
    return `${emp && emp.employeeSurname || ''} ${emp && emp.employeeName || ''}`;
  }

  const handleMoveScreen = (employeeId) => {
    setOpenPopupEmployeeDetail(true);
    setEmployeeIdSelected(employeeId);
  }

  const renderPopupEmployeeDetail = () => {
    return (
      <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        showModal={true}
        backdrop={true}
        openFromModal={true}
        employeeId={employeeIdSelected}
        listEmployeeId={[employeeIdSelected]}
        toggleClosePopupEmployeeDetail={() => setOpenPopupEmployeeDetail(false)}
        resetSuccessMessage={() => { }}
      />
    )
  }

  const getLinkUser = (employee) => {
    const char = firstChar(R.path(['employeeName'], employee));
    const url = getEmployeeImageUrl(employee);
    return <>
      {employee &&
        <div className="item form-inline">
          {url ? <a><img className="user" src={url} /></a> : <a tabIndex={-1} className="no-avatar green">{char}</a>}
          <a className="d-inline-block text-ellipsis file max-calc45" onClick={() => handleMoveScreen(R.path(['employeeId'], employee))}>
            {getDisplayEmployeeName(employee)}
          </a>
          {openPopupEmployeeDetail && renderPopupEmployeeDetail()}
        </div>
      }
    </>
  }

  const renderNameText = (fileName, textTranslate, classNameR, itemFileName) => {
    let txt = textTranslate;
    if (itemFileName !== 'customer_id' && customerActionType === CUSTOMER_ACTION_TYPES.UPDATE) {
      if (itemFileName === specialFName.createdDate) {
        txt = utcToTz(customerData['createdDate'] + '', DATE_TIME_FORMAT.User);
      } else if (itemFileName === specialFName.updatedDate) {
        txt = utcToTz(customerData['updatedDate'] + '', DATE_TIME_FORMAT.User);
      } else if (itemFileName === specialFName.createdUser) {
        return <div className={classNameR}>
          <label>{fileName}</label>
          {getLinkUser(customerData['createdUser'])}
        </div>
      } else if (itemFileName === specialFName.updatedUser) {
        return <div className={classNameR}>
          <label>{fileName}</label>
          {getLinkUser(customerData['updatedUser'])}
        </div>
      }
    }
    return (
      <div className={classNameR}>
        <label>{fileName}</label>
        <span className="color-333">{txt}</span>
      </div>
    )
  }

  // TODO: change
  const updateFileDefaultChange = listFileDef => {
    if (listFileDef) {
      const valueTag = fileDefault.fileName;
      saveCustomerData['fileNameOld'] = valueTag;
    }
  };

  const updateFiles = fUploads => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  };

  const isSpecialField = field => {
    let specials = Object.values(CUSTOMER_REMOVE_FIELD_CREATE);
    if (customerActionType === CUSTOMER_ACTION_TYPES.UPDATE) {
      specials = Object.values(CUSTOMER_REMOVE_FIELD_UPDATE);
    }
    const type = field.fieldType.toString();
    return specials.includes(field.fieldName) || type === DEFINE_FIELD_TYPE.TAB || type === DEFINE_FIELD_TYPE.TITLE;
  };

  const disablePreview = ((item) => {
    let shouldDisableCheck = shouldDisable;
    const arrayType = [DEFINE_FIELD_TYPE.SINGER_SELECTBOX, DEFINE_FIELD_TYPE.MULTI_SELECTBOX];
    arrayType.forEach((type) => {
      if (type === _.toString(item.fieldType)) {
        shouldDisableCheck = false
      }
    })
    return shouldDisableCheck;
  })

  const renderDynamicControlFieldCustomer = (item, idxRef, className, isIconField, clearBoth) => {

    return <>
      <DynamicControlField
        ref={inputRefs[idxRef]}
        key={item.fieldId}
        recordId={[customerId]}
        elementStatus={getDataStatusControl(item)}
        updateStateElement={updateStateField}
        fieldInfo={item}
        belong={FIELD_BELONG.CUSTOMER}
        // className={`${className}`}
        className={`${className}`}
        isRequired={item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
        isDisabled={disablePreview(item) || item.modifyFlag === MODIFY_FLAG.READ_ONLY}
        errorInfo={getErrorInfo(item)}
        controlType={customerActionType === CUSTOMER_ACTION_TYPES.UPDATE ? ControlType.EDIT : ControlType.ADD}
        updateFiles={updateFiles}
        isSingleFile={isIconField}
        idUpdate={customerId}
        acceptFileExtension={isIconField ? FILE_FOMATS.IMG : null}
        confirmDeleteLogo={item && item.fieldName === 'customer_logo'}
      />
    </>
  }

  const updateCompany = (value) => {
    setIndexCompany(value)
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
    let hasSpace = true;
    let curRightSpace = false;
    let nxtRightSpace = false;
    return listFields.map((item, idx) => {
      curRightSpace = _.cloneDeep(nxtRightSpace);
      const fullWidth = isFullWidth(item.isDoubleColumn, idx, curRightSpace);
      let className = fullWidth ? 'col-lg-12 form-group' : 'col-lg-6 form-group';
      if (item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED) {
        className += ` required_scroll_${item.fieldName.replace('_', '').toLowerCase()}`;
      }
      // tick that has space or not?
      hasSpace = !hasSpace && !fullWidth;
      renderProductList();
      if (!isSpecialField(item)) {
        // tick that next item has right space or not?
        nxtRightSpace = !curRightSpace && !fullWidth;
      }
      let clearBoth = false;
      if (nxtRightSpace) {
        clearBoth = true;
        className += ' set-clear-table-list-wrap';
      }
      if (item.fieldName === specialFName.customerBusinessMain) {
        const businessMainItem = getFieldByName(fieldInfos, specialFName.customerBusinessMain);
        const businessSubItem = getFieldByName(fieldInfos, specialFName.customerBusinessSub);
        return (
          <>
            <FieldBusiness
              key={item.fielId}
              fieldLabel={translate('customers.create-edit-modal.business')}
              businessMain={businessMainItem}
              errorBusinessMain={getErrorInfo(item)}
              businessSub={businessSubItem}
              updateStateField={updateStateField}
              businessData={makeBusinessData}
              errorBusinessSub={getErrorInfo(businessSubItem)}
              isDisabled={false}
              isRequired={item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
              classBusiness={className}
            />
          </>
        );
      } else if (item.fieldName === specialFName.customerCompanyDescription) {
        return (
          <FieldCompanyDescription
            key={item.fielId}
            fieldLabel={translate('customers.create-edit-modal.company-description')}
            companyDescription={item}
            updateStateField={updateStateField}
            companyDescriptionData={makeCompanyDescriptionData}
            errorCompanyDescription={getErrorInfo(item)}
            isDisabled={disablePreview(item)}
            isRequired={item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
            className={className}
          />
        );
      } else if (item.fieldName === 'customer_parent') {
        return renderCustomerSuggestion(className);
      } else if (item.fieldName === specialFName.customerId && customerActionType === CUSTOMER_ACTION_TYPES.CREATE) {
        return renderNameText(StringUtils.escapeSpaceHtml(getFieldLabel(item, 'fieldLabel')), translate('customers.create-edit-modal.text-customer-id'), className, item.fieldName);
      } else if (item.fieldName === specialFName.createdDate || item.fieldName === specialFName.createdUser || item.fieldName === specialFName.updatedDate || item.fieldName === specialFName.updatedUser) {
        return renderNameText(StringUtils.escapeSpaceHtml(getFieldLabel(item, 'fieldLabel')), translate('customers.create-edit-modal.text-created-date'), className, item.fieldName);
      } else if (item.fieldName === specialFName.employeeId || item.fieldName === specialFName.personInCharge) {
        return renderEmployeeSuggestion(className);
      } else if (item.fieldName === specialFName.customerPhoto) {
        return (
          <FieldPictureLogo
            className={className}
            fieldLabel={translate('customers.create-edit-modal.picture-logo')}
            key={item.fieldId}
            isRequired={item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
            onFileChange={file => updateFileData(file, 'photo_file_path')}
            onFileDefaultChange={updateFileDefaultChange}
          />
        );
      } else if (
        item.fieldName === specialFName.customerBusinessSub ||
        item.fieldName === specialFName.customerScenario ||
        item.fieldName === specialFName.scheduleNext ||
        item.fieldName === specialFName.actionNext ||
        item.fieldName === 'is_display_child_customers' ||
        item.fieldName === specialFName.lastContactDate ||
        item.fieldName === specialFName.customerScenario
      ) {
        return <></>;
      } else {
        const isIconField = item.fieldName === _.snakeCase(specialFName.customerLogo);
        const idxRef = fieldInfos.findIndex(e => e.fieldId === item.fieldId);
        if (item.fieldName === 'customer_name' && customerActionType === CUSTOMER_ACTION_TYPES.CREATE && lang === 'ja_jp') {
          return <div className={className}>
            <div className="row">
              {renderDynamicControlFieldCustomer(item, idxRef, className.replace('col-lg-12', '') + " col-lg-8", isIconField, clearBoth)}
              <BeautyPullDown
                value={1}
                data={{ fieldItems: CUSTOMER_NAME_COMPANY_FIELD }}
                updateStateField={updateCompany}
                classNameParent="col-lg-4 form-group margin-top-20"
                maxHeight="max-height-200"
              />
            </div>
          </div>
        }
        return renderDynamicControlFieldCustomer(item, idxRef, className, isIconField, clearBoth);
      }
    });
  };

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
    />
  }

  const renderModal = () => {
    const buttonClassName = shouldDisable ? 'button-blue button-form-register disable' : 'button-blue button-form-register';
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a className={`${(props.popout || (props && !props.isOpenedFromModal)) ? 'pointer-none' : ''} modal-heading-title`} onClick={handleBackPopup}>
                      <i className={`icon-small-primary icon-return-small ${(props.popout || (props && !props.isOpenedFromModal)) ? 'disable' : ''}`} />
                    </a>
                    <span className="text">
                      {getIconFunction()}
                      {customerId
                        ? translate('customers.create-edit-modal.title-edit-customer')
                        : translate('customers.create-edit-modal.title-create-customer')}
                    </span>
                  </div>
                </div>
                <div className="right">
                  {!props.hiddenShowNewTab && showModal && <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />}
                  {showModal && <a className="icon-small-primary icon-close-up-small line" onClick={() => handleCloseModal(customerViewMode === CUSTOMER_VIEW_MODES.PREVIEW)} />}
                </div>
              </div>
              <div className="modal-body style-3">
                <div className="popup-content style-3 overflow-y-hover" ref={wrapperRef}>
                  {exclusiveMsg && <BoxMessage messageType={MessageType.Error} message={exclusiveMsg} />}
                  <div className="user-popup-form">
                    <form id={formId}>
                      <div className="row break-row">
                        {displayMessage()}
                        {/* {renderDynamicControlField()} */}
                        {isExistBeforeTab && listFieldBeforeTab && renderDynamicControlField(listFieldBeforeTab)}
                        {listFieldTab && listFieldTab.length > 0 && renderTab()}
                        {isExistAfterTab && listFieldAfterTab && renderDynamicControlField(listFieldAfterTab)}
                        {(!listFieldTab || listFieldTab.length === 0) && renderDynamicControlField(listFieldNormal)}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="user-popup-form-bottom">
                <button onClick={handleBackPopup} className="button-cancel mr-5">
                  {translate('employees.create-edit.button-cancel')}
                </button>
                <button onClick={(event) => handleSubmit(true, event)} className={buttonClassName}>
                  {getTextSubmitButton()}
                </button>
              </div>
              {renderToastMessage()}
            </div>
          </div>
        </div>
      </>
    );
  };

  if (showModal) {
    return (
      <>
        <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
          {renderModal()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return renderModal();
    } else {
      return <></>;
    }
  }
};

const mapStateToProps = ({ customerInfo, applicationProfile, productPopupEditState, screenMoveState }: IRootState, ownProps: any) => {
  const stateObject = {
    customerData: {},
    fieldInfos: [],
    errorValidates: [],
    responseStatus: null,
    actionType: null,
    errorMessage: null,
    successMessage: null,
    updateId: null,
    tenant: applicationProfile.tenant,
    screenMoveInfo: screenMoveState.screenMoveInfo,
  };
  if (customerInfo && customerInfo.data.has(ownProps.id)) {
    stateObject.customerData = customerInfo.data.get(ownProps.id).customerData;
    stateObject.fieldInfos = customerInfo.data.get(ownProps.id).fields;
    stateObject.errorValidates = customerInfo.data.get(ownProps.id).errorItems;
    stateObject.actionType = customerInfo.data.get(ownProps.id).action;
    stateObject.errorMessage = customerInfo.data.get(ownProps.id).errorMessage;
    stateObject.successMessage = customerInfo.data.get(ownProps.id).successMessage;
    stateObject.updateId = customerInfo.data.get(ownProps.id).customerId;
    // stateObject.productData: productPopupEditState.dataInfo,
  }
  return stateObject;
};

const mapDispatchToProps = {
  handleGetDataCustomer,
  handleSubmitCustomerData,
  handleGetDataProduct,
  startExecuting,
  moveScreenReset,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEditCustomerModal);
