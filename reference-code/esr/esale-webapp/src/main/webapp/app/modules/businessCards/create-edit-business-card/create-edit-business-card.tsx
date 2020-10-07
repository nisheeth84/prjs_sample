import { IRootState } from 'app/shared/reducers';
import {
  getCustomFieldInfo,
  suggestBusinessCardDepartment,
  updateBusinessCard,
  handleCreateBusinessCard,
  handleGetBusinessCard,
  reset
} from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card.reducer';
import { connect } from 'react-redux';
import React, { useEffect, useRef, useState, useMemo, createRef } from 'react';
import { CreateEditBusinessCardAction } from './create-edit-business-card.reducer';
import { Storage, translate } from 'react-jhipster';
import { Modal } from 'reactstrap';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import FieldTextBoxDoubleColumn from './field-text-double-column';
import FieldBusinessCardReceiver from './field-business-card-receiver';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import _ from 'lodash';
import { BUSINESS_SPECIAL_FIELD_NAMES as specialFName, SPECIAL_COMMON, TAB_ID_LIST, BUSINESS_CARD_VIEW_MODES, BUSINESS_CARD_ACTION_TYPES } from 'app/modules/businessCards/constants';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { ControlType, MODIFY_FLAG, FIELD_BELONG, TIMEOUT_TOAST_MESSAGE, USER_FORMAT_DATE_KEY, APP_DATETIME_FORMAT_ES, MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import { getJsonBName } from 'app/modules/products/utils';
import useEventListener from 'app/shared/util/use-event-listener';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import FieldSuggestBox from '../suggestion/field-suggest-box';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import {
  TagAutoCompleteType,
  TagAutoCompleteMode,
} from "app/shared/layout/common/suggestion/constants";
import TagSuggestion from "app/shared/layout/common/suggestion/tag-auto-complete"
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import { switchFormatDate } from 'app/shared/util/date-utils';
import FocusTrap from 'focus-trap-react';
import dateFnsParse from 'date-fns/parse';
import FieldPictureLogo from 'app/modules/customers/create-edit-customer/field-picture-logo';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';
import { isExceededCapacity } from 'app/shared/util/file-utils';

export interface ICreateEditBusinessCardProps extends StateProps, DispatchProps {
  businessCardId?: any;
  closePopup: (options?, id?: number) => void;
  popout?: boolean;
  iconFunction?: string;
  businessCardActionType: number;
  businessCardViewMode?: number;
  fieldPreview?: any,
  isOpenedFromModal?: boolean // = true if this modal is opened from another modal
  toggleNewWindow?: any,
  backdrop?: boolean; // [backdrop:false] when open from popup
  customerId?: number;
  customerName?: string;
  onCloseModalBusinessCard?: (businessCardId) => void; // action when this open
  hiddenShowNewTab?: boolean; // hide button open in new window
  handleUpdateBusinessSetCurrentTab?: (currentTab: number) => void,
  departmentName?: string;
  // setIsCreateEdit?: (isSubmit) => void;
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow
}

const CreateEditBusinessCard = (props: ICreateEditBusinessCardProps) => {
  const url = window.location.href;
  const idUrl = +url.substring(url.lastIndexOf('/') + 1);

  const formClass = "form-product-edit"
  const classAddCreateOrther: string[][] = [['upload'], ['select-text']];
  const [fieldInfos, setFieldInfos] = useState([]);
  const [errMsg, setErrMsg] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [businessCardDataInit, setBusinessCardDataInit] = useState(null);
  const [businessCardDataCurrent, setBusinessCardDataCurrent] = useState(null);
  const [businessCardId, setBusinessCardId] = useState(idUrl ? idUrl : props.businessCardId);
  const [errorValidates, setErrorValidates] = useState([]);
  const [receivePerson, setReceivePerson] = useState(null);
  const receiverRef = useRef(null);
  const [fileUploads, setFileUploads] = useState({});
  const [listFieldNormal, setListFieldNormal] = useState([]);
  const [listFieldTab, setListFieldTab] = useState([]);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [businessCardViewMode, setBusinessCardViewMode] = useState(props.businessCardViewMode);
  const [businessCardActionType, setBusinessCardActionType] = useState(props.businessCardActionType);
  const [firstErrorItem, setFirstErrorItem] = useState(null)
  const firstRef = useRef(null);
  const [doNotFocus, setDoNotFocus] = useState(true)
  const [isChanged] = useDetectFormChange(formClass, [forceCloseWindow], classAddCreateOrther)
  const isEdit = !!businessCardId;
  const [dataCheckInit, setDataCheckInit] = useState(isEdit ? props.businessCardDetail : null)
  const [autofocusField, setAutofocusField] = useState(0);

  const inputRefs = useMemo(() => Array.from({ length: fieldInfos?.length }).map(() => createRef<any>()), [fieldInfos]);

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
    setTimeout(() => {
    }, TIMEOUT_TOAST_MESSAGE);
  };
  const renderToastMessage = () => {
    if (props.successMessage === null) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={MessageType.Success}
        message={props.successMessage}
        className="message-area-bottom position-absolute"
      />
    )
  }

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {

      Storage.local.set(CreateEditBusinessCard.name, {
        fieldInfos,
        errMsg,
        businessCardDataInit,
        businessCardDataCurrent,
        receivePerson: receiverRef.current.receivePerson,
        businessCardId,
        successInfo,
        businessCardActionType,
        businessCardViewMode,
        forceCloseWindow,
        listFieldTab,
        isOpenDropdown,
        firstErrorItem,
        doNotFocus,
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(CreateEditBusinessCard.name);
      if (saveObj) {
        setFieldInfos(saveObj.fieldInfos);
        setErrMsg(saveObj.errMsg);
        setBusinessCardDataInit(saveObj.businessCardDataInit);
        setBusinessCardDataCurrent(saveObj.businessCardDataCurrent);
        setBusinessCardId(saveObj.businessCardId);
        setReceivePerson(saveObj.receivePerson);
        setListFieldNormal(isEdit ? saveObj.fieldInfos.filter(e => e.fieldType.toString() !== DEFINE_FIELD_TYPE.TAB) : [])
        setSuccessInfo(saveObj.successInfo);
        setBusinessCardActionType(saveObj.businessCardActionType);
        setBusinessCardViewMode(saveObj.businessCardViewMode);
        setForceCloseWindow(saveObj.forceCloseWindow);
        setListFieldTab(saveObj.listFieldTab);
        setIsOpenDropdown(saveObj.isOpenDropdown);
        setFirstErrorItem(saveObj.firstErrorItem);
        setDoNotFocus(saveObj.doNotFocus);
        setAutofocusField(saveObj.autofocusField)
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(CreateEditBusinessCard.name);
    }
  };

  useEffect(() => {
    setBusinessCardActionType(props.businessCardActionType);
  }, [props.businessCardActionType]);

  useEffect(() => {
    setBusinessCardViewMode(props.businessCardViewMode);
  }, [props.businessCardViewMode]);

  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      setShowModal(true);
    }
    return () => {
      if (props.popout) {
        updateStateSession(FSActionTypeScreen.RemoveSession);
      }
    };
  }, []);

  useEffect(() => {
    if (isEdit) {
      if (!props.popout) {
        props.handleGetBusinessCard({
          businessCardId: props.businessCardId,
          isOnlyData: false
        });
      }
    } else {
      props.getCustomFieldInfo({ fieldBelong: FIELD_BELONG.BUSINESS_CARD });
    }
  }, []);


  const getErrorInfo = item => {
    let errorInfo = null;
    errorValidates.forEach(elem => {
      let fieldName = item.fieldName;
      if (item.isDefault) {
        fieldName = StringUtils.snakeCaseToCamelCase(fieldName);
      }
      if (elem.item === fieldName) {
        const errorTmp = {};
        errorTmp['rowId'] = elem.rowId;
        errorTmp['item'] = elem.item;
        errorTmp['errorCode'] = elem.errorCode;
        errorTmp['arrayError'] = elem.arrayError;
        errorTmp['errorParams'] = elem.errorParams ? elem.errorParams : null;
        errorInfo = errorTmp;
      }
      if (item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
        const relationId = StringUtils.tryGetAttribute(item, "relationData.fieldId");
        if (relationId && (_.toString(elem.item) === _.toString(relationId) || _.toString(elem.errorParams) === _.toString(relationId))) {
          errorInfo = elem;
        }
      }
    });
    return errorInfo;

  };

  const onchangeText = (value) => {
    if (businessCardDataInit?.customerName) {
      businessCardDataInit.customerName = null;
      businessCardDataInit.customerId = null;
    }
    businessCardDataInit.alternativeCustomerName = value
    setDoNotFocus(null);
  }

  const addToBusinessCardData = (addItem, saveData) => {
    if (saveData['businessCardData']) {
      let notInArray = true;
      saveData['businessCardData'].map((e, index) => {
        if (e.key === addItem.key) {
          notInArray = false;
          saveData['businessCardData'][index] = addItem;
        }
      });
      if (notInArray) {
        saveData['businessCardData'].push(addItem);
      }
    } else {
      saveData['businessCardData'] = [addItem];
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
      arrVal && arrVal.length > 0 && arrVal.forEach(obj => {
        addItem.push(createExtItem(obj.fieldInfo, obj.value));
      })
    } else {
      addItem = createExtItem(item, val);
    }
    if (Array.isArray(addItem)) {
      addItem.forEach(addIt => {
        addToBusinessCardData(addIt, businessCardDataInit);
      });
    } else {
      addToBusinessCardData(addItem, businessCardDataInit);
    }
  }

  /**
     * get data for tag suggestion
     * @param item
     */
  const getDataTagStatusControl = () => {
    let fieldValue = null;
    if (businessCardDataInit?.customerName) {
      const activities = businessCardDataInit;
      let _tags = [];
      _tags = [{
        customerId: activities?.customerId,
        customerName: activities?.customerName,
      }];
      fieldValue = _tags;
    } else {
      if (props.customerId && props.customerName) {
        fieldValue = [{
          customerId: props.customerId,
          customerName: props.customerName
        }];
      } else fieldValue = null
    }
    return fieldValue;
  }

  const validateItem = item => {
    const errorInfo = getErrorInfo(item);
    if (errorInfo) {
      return translate('messages.' + errorInfo.errorCode, errorInfo.errorParams);
    }
    return null;
  };

  const checkSnakeCase = value => {
    if (value?.includes('_')) {
      return doNotFocus ? StringUtils.snakeCaseToCamelCase(value) : null;
    } else {
      return doNotFocus ? value : null;
    }
  };

  const getFirstItemError = () => {
    let firstError = null;
    if (errorValidates && errorValidates.length > 0) {
      for (let i = 0; i < fieldInfos.length; i++) {
        const filedNameInit = checkSnakeCase(fieldInfos[i].fieldName);
        if (_.cloneDeep(errorValidates).some(j => checkSnakeCase(j.item) === filedNameInit)) {
          firstError = filedNameInit;
          break;
        }
      }
    }
    return firstError;
  };



  useEffect(() => {
    setFirstErrorItem(getFirstItemError())
  }, errorValidates)

  const updateStateField = (item, type, val) => {
    if (businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW) return;
    let fieldInfo = null;
    fieldInfos.forEach(field => {
      if (field.fieldId.toString() === item.fieldId.toString()) {
        fieldInfo = field;
      }
    });
    if (fieldInfo.fieldName === specialFName.alternativeCustomerName && !!businessCardDataInit) {
      if (val) {
        businessCardDataInit["customerId"] = val[0] ? val[0].customerId : null;
        businessCardDataInit["customerName"] = val[0] ? val[0].customerName : null;
        businessCardDataInit.alternativeCustomerName = null;
      } else {
        businessCardDataInit.alternativeCustomerName = null;
      }
    } else if (fieldInfo.fieldName === "department_name") {
      if (val !== undefined && val) {
        props.suggestBusinessCardDepartment({ departmentName: val })
        setIsOpenDropdown(true);
      }
      const newObject = { ...businessCardDataInit };
      newObject[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = val;
      setBusinessCardDataInit(newObject);
    } else if (businessCardDataInit !== null && businessCardDataInit !== undefined && fieldInfo) {
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
        const newObject = { ...businessCardDataInit };
        if (fieldInfo.fieldName === "address") {
          if (val) {
            const valObject = JSON.parse(val);
            newObject[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = valObject.address_name ? valObject.address_name : newObject.address;
            newObject["building"] = valObject.building_name;
            newObject["zipCode"] = valObject.zip_code;
            setBusinessCardDataInit(newObject);
          }
        } else if (fieldInfo.fieldName === "employee_id") {
          setBusinessCardDataInit(newObject);
        } else if (fieldInfo.fieldName !== "business_card_image_path") {
          newObject[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = val;
          setBusinessCardDataInit(newObject);
        } else {
          newObject.businessCardImageName = null;
          newObject[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = null;
          newObject["status"] = null;
          if (val && val.length > 0) {
            for (let i = 0; i < val.length; i++) {
              if (val[i].status && val[i].status === 2) {
                newObject.businessCardImageName = val[i].file_name;
                newObject[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = val[i].file_path;
                newObject["status"] = 2;
                break;
              } else if (val[i].status && val[i].status === 1) {
                newObject.businessCardImageName = val[i].fileName;
                newObject[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = val[i].filePath;
                newObject["status"] = 1;
              }
            }
          }
          setBusinessCardDataInit(newObject);
        }
      } else if (_.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.CALCULATION) {
        addExtendField(fieldInfo, val);
        setBusinessCardDataInit(_.cloneDeep(businessCardDataInit));
      }
    }
  }

  const onchangeDepartment = e => {
    businessCardDataInit["departmentName"] = e ? e : null;
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
    // if (retField) {
    return retField?.value;
    // }
    // return undefined;
  }

  const getDataStatusControl = (item) => {
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
      return { fieldValue: businessCardDataInit };
    }
    let saveData = null;
    saveData = businessCardDataInit;
    if (saveData) {
      let fieldValue;
      if (item.fieldName === specialFName.businessCardImagePath) {
        if (businessCardDataInit.businessCardImagePath) {
          return {
            key: item.fieldName,
            fieldValue: [{
              status: 0,
              fileName: businessCardDataInit.businessCardImageName,
              filePath: businessCardDataInit.businessCardImagePath,
              fileUrl: businessCardDataInit.businessCardImagePath,
            }]
          }
        }
      }
      if (item.isDefault) {
        if (item.fieldName === "address") {
          const addressObject = { "address_name": saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)], "zip_code": saveData["zipCode"], "building_name": saveData["building"] }
          fieldValue = JSON.stringify(addressObject)
        } else {
          fieldValue = saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)];
        }
      } else if (saveData['businessCardData'] !== undefined) {

        fieldValue = getExtendfieldValue(saveData['businessCardData'], item.fieldName);
        if (_.isUndefined(fieldValue)) {
          fieldValue = getExtendfieldValue(businessCardDataInit['businessCardData'], item.fieldName);
        }
      }

      if (fieldValue !== undefined) {
        const dataStatus = { ...item };
        dataStatus['fieldValue'] = fieldValue;
        return dataStatus;
      }
    }
    return null;
  }

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
  };


  const updateFiles = fUploads => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  };

  const renderFieldTextBoxDoubleColumn = (item, label, nextFieldName, isDisabled, tabIndex) => {
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
        fieldLabel={label}
        itemDataFields={[item, nextItem]}
        updateStateField={updateStateField}
        firstItemDataStatus={getDataStatusControl(item)}
        secondItemDataStatus={getDataStatusControl(nextItem)}
        errors={[firstError, secondError]}
        isDisabled={isDisabled}
      />
    );
  };

  /**
   *  suggestion box department 
   */
  const renderFieldSuggestBox = (item, label, nextFieldName, isDisabled) => {
    const nextItem = getFiledByName(fieldInfos, nextFieldName);
    const firstError = doNotFocus === null ? null : getErrorInfo(item);
    const secondError = doNotFocus === null ? null : getErrorInfo(nextItem);
    return (
      <FieldSuggestBox
        dataSelectedInit={!props.popout && businessCardDataInit?.departmentName ? businessCardDataInit?.departmentName : []}
        onchangeDepartment={onchangeDepartment}
        isOpenDropdown={isOpenDropdown}
        setIsOpenDropdown={setIsOpenDropdown}
        filteredData={props.suggestDepartment}
        firstErrorItem={firstErrorItem}
        key={item.fielId}
        fieldLabel={label}
        itemDataFields={[item, nextItem]}
        updateStateField={updateStateField}
        firstItemDataStatus={getDataStatusControl(item)}
        secondItemDataStatus={getDataStatusControl(nextItem)}
        errors={doNotFocus ? [firstError, secondError] : []}
        isDisabled={isDisabled}
        disableTag={!!props.departmentName}
        isHoldTextInput={true}
        onTextChange={() => setDoNotFocus(null)}
      />
    );
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

  const submit = () => {
    const files = getfileUploads();
    if (event && isExceededCapacity(files)) {
      setErrMsg(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else if (event) {
      setErrMsg('');
    }
    const receivePersonsSubmit = receiverRef.current.receivePerson;
    receivePersonsSubmit.map((receive, index) => {
      receivePersonsSubmit[index] = { employeeId: receive.employeeId, receiveDate: receive.receiveDate ? dateFnsParse(receive.receiveDate) : null }
    })
    const submitForm = {
      receivePerson: receivePersonsSubmit,
      saveMode: 1,
      ...businessCardDataInit
    };
    Object.assign(submitForm, businessCardDataInit);
    delete submitForm['lastContactDate'];
    delete submitForm['updatedUser'];
    delete submitForm['isHandMode'];
    delete submitForm['companyName'];
    delete submitForm['branchName'];
    delete submitForm['businessCardReceives'];
    delete submitForm['createdDate'];
    delete submitForm['createdUser'];
    delete submitForm['fax'];
    delete submitForm['url'];
    delete submitForm['hasActivity'];
    delete submitForm['activityId'];
    delete submitForm['hasFollow'];
    delete submitForm['updatedDate'];
    delete submitForm['createdUserName'];
    delete submitForm['filePathUpdatedUser'];
    delete submitForm['fileNameUpdatedUser'];
    delete submitForm['filePathCreatedUser'];
    delete submitForm['fileNameCreatedUser'];
    delete submitForm['updatedUserName'];
    if (isEdit) {
      submitForm.businessCardImagePath = null;
      if (submitForm?.alternativeCustomerName) {
        delete submitForm['customerName'];
        delete submitForm['customerId'];
      }

      props.updateBusinessCard(submitForm, getfileUploads());
      props.handleUpdateBusinessSetCurrentTab(TAB_ID_LIST.summary);

    } else {
      delete submitForm['status']
      if (submitForm['businessCardImageName']) {
        submitForm['businessCardImageData'] = "card-data";
      }
      if (props.departmentName) {
        delete submitForm['departmentName'];
      }
      submitForm.businessCardImagePath = null;
      props.handleCreateBusinessCard(submitForm, getfileUploads());
      // event.preventDefault();
    }
  };

  useEffect(() => {
    setErrMsg(props.errorMessage);
    setDoNotFocus(true);
  }, [props.errorMessage]);

  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
      document.body.className = 'wrap-card modal-open';
    } else {
      setShowModal(true);
      // document.body.className = 'wrap-card modal-open';
      document.body.classList.add('wrap-card');
    }

    return () => {
      props.reset();
      if (props.popout) {
        updateStateSession(FSActionTypeScreen.RemoveSession);
        document.body.className = document.body.className.replace('modal-open', '');
      }
    };
  }, []);

  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false, keepOpen: true }, window.location.origin);
    }
  };

  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        let closeInfo = null;
        // click button close of browser
        if (ev.data.forceCloseWindow && isEdit) {
          // set param null, reload modal detail employ
          closeInfo = {};
        }
        props.closePopup(closeInfo);
      }
    }
  };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  const executeDirtyCheck = async (action: () => void, partternType?: any, cancel?: () => void) => {
    // const isChangedInput = isChangeInput()
    if (isChanged) { await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType }) } else action();
  }

  const handleCloseModal = (ignoreCheck = false) => {
    if (props.popout) {
      setForceCloseWindow(true);
    }
    if (businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW) {
      props.closePopup();
      return;
    }
    if (ignoreCheck) {
      props.reset();
      if (props.closePopup) {
        props.closePopup({}, businessCardId);
      }
    } else {

      executeDirtyCheck(() => {
        props.reset();
        if (props.closePopup) {
          props.closePopup({}, businessCardId);
        }
      });
    }
  };

  const backTab = (orderIndex) => {
    setAutofocusField(orderIndex - 1)
  }

  const handleBackPopup = () => {
    firstRef && firstRef.current && firstRef.current.blur();
    executeDirtyCheck(() => {
      if (props.popout) {
        updateStateSession(FSActionTypeScreen.SetSession);
        setForceCloseWindow(true);
      } else {
        handleCloseModal(true);
      }
    }, 1);
  };

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
        // handleCloseModal();
      } else {
        handleCloseModal();
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    if (props.errorValidatesComponent) {
      setErrorValidates(props.errorValidatesComponent);
      setDoNotFocus(true)
    }
    // setExclusiveError(props.errorValidates);
  }, [props.errorValidatesComponent]);

  useEffect(() => {
    switch (props.action) {
      case CreateEditBusinessCardAction.GetFieldSuccess:
        // setFieldInfos(props.customFieldInfos);
        break;
      case CreateEditBusinessCardAction.GetBusinessCardSuccess:
        // setFieldInfos(props.customFieldInfos);
        setBusinessCardDataInit(props.businessCardDetail);
        setReceivePerson(props.businessCardDetail.businessCardReceives);
        break;
      case CreateEditBusinessCardAction.CreateEditSuccess:
        if (props.hiddenShowNewTab) {
          props.onCloseModalBusinessCard(props.businessCardIdResponse);
        } else {
          if (props.popout) {
            window.close();
          }
          props.closePopup({
            businessCardId: props.businessCardIdResponse,
            msg: isEdit ? "INF_COM_0004" : "INF_COM_0003"
          }, props.businessCardIdResponse);
        }
        break;
      case CreateEditBusinessCardAction.Error:
        setErrMsg(props.errorMessage);
        break;
      default:
        break;
    }
    return () => { };
  }, [props.action]);

  const fieldPreOrNext = (curIdx, increase) => {
    const step = increase ? 1 : -1;
    const length = fieldInfos.length;
    const specials = Object.values(specialFName);
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

  const isFullWidth = (isDoubleColumn, index, rightSpace) => {
    if (rightSpace) {
      return false;
    }
    const nxt = fieldPreOrNext(index, true);
    let fullWidth = false;
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
   * use for setting list field
   */
  useEffect(() => {
    let fields = [];
    if (businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW && !_.isNil(props.fieldPreview)) {
      fields = props.fieldPreview
    } else {
      fields = props.customFieldInfos
    }
    if (_.isNil(fields)) return;
    setFieldInfos(fields);
    const fieldTabs = fields.filter(e => e.fieldType.toString() === DEFINE_FIELD_TYPE.TAB);
    const fieldNormals = fields.filter(e => e.fieldType.toString() !== DEFINE_FIELD_TYPE.TAB);
    if (!isEdit && !props.popout) {

      const dataInit = {
        ...businessCardDataInit,
        isWorking: true,
        departmentName: props.departmentName ? props.departmentName : null,
        customerName: props.customerName ? props.customerName : null,
        customerId: props.customerId ? props.customerId : null,
        businessCardData: businessCardDataInit?.businessCardData ? businessCardDataInit?.businessCardData : [],
      };
      // if (props.popout) {
      //   dataInit['businessCardData'] = [...businessCardDataInit.businessCardData];
      // }
      setBusinessCardDataInit(dataInit)
      setDataCheckInit(dataInit)
    }
    fieldTabs.forEach(field => {
      if (!_.isNil(field.tabData) && field.tabData.length > 0) {
        field.tabData.forEach(e => {
          const idx = fieldNormals.findIndex(o => o.fieldId === e);
          if (idx >= 0) {
            fieldNormals.splice(idx, 1);
          }
        });
      }
    });
    setListFieldTab(fieldTabs);
    setListFieldNormal(fieldNormals);
  }, [props.customFieldInfos]);
  // const checkErrorField =(item)=> {
  //   errorValidates.forEach(element => {
  //     element.
  //   });
  //   return false ;
  // }
  const isExistBeforeTab = listFieldTab.length > 0 && listFieldTab[0].fieldOrder > 1;
  const isExistAfterTab =
    listFieldTab.length > 0 &&
    listFieldNormal.length > 0 &&
    listFieldTab[listFieldTab.length - 1].fieldOrder < listFieldNormal[listFieldNormal.length - 1].fieldOrder;

  const listFieldBeforeTab = listFieldNormal.filter(e => isExistBeforeTab && e.fieldOrder < listFieldTab[0].fieldOrder);
  const listFieldAfterTab = listFieldNormal.filter(e => isExistAfterTab && e.fieldOrder > listFieldTab[listFieldTab.length - 1].fieldOrder);
  const renderBusinessCardId = () => {
    return businessCardDataInit.businessCardId ? businessCardDataInit.businessCardId : translate('businesscards.create-edit.auto-generate')
  }
  const renderDynamicControlField = (listFields: any[]) => {
    let curRightSpace = false;
    let nxtRightSpace = false;
    if (listFields && listFields.length > 0)
      return listFields.map((item, idx) => {
        curRightSpace = _.cloneDeep(nxtRightSpace);
        const fullWidth = isFullWidth(item.isDoubleColumn, idx, curRightSpace);
        const className = fullWidth ? 'col-lg-12 form-group' : 'col-lg-6 form-group';
        const specials = Object.values(specialFName);
        const tabIndex = idx + 1;
        if (!specials.includes(item.fieldName)) {
          nxtRightSpace = !curRightSpace && !fullWidth;
        }
        switch (item.fieldName) {
          case specialFName.businessCardId:
            return (
              <div className="col-12 form-group">
                <label>{getJsonBName(item.fieldLabel)}</label>
                <span className="color-333">{renderBusinessCardId()}</span>
              </div>
            );
          case specialFName.businessCardFirstName:
            return renderFieldTextBoxDoubleColumn(
              item,
              translate('businesscards.create-edit.label-name-group'),
              specialFName.businessCardLastName,
              businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW,
              tabIndex
            );
          case specialFName.businessCardFirstNameKana:
            return renderFieldTextBoxDoubleColumn(
              item,
              translate('businesscards.create-edit.label-name-kana-group'),
              specialFName.businessCardLastNameKana,
              businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW,
              tabIndex
            );
          case specialFName.businessCardDepartments:
            return renderFieldSuggestBox(
              item,
              translate('businesscards.create-edit.label-department-group'),
              specialFName.businessCardPositions,
              businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW
            );
          case specialFName.alternativeCustomerName:
            return (
              <>
                <div className="col-lg-6  form-group" key={`activityField_${item.fieldId}`}>
                  <TagSuggestion
                    id="customerId"
                    backTab={backTab}
                    itemfieldOrder={item.fieldOrder}
                    className="items break-line form-group"
                    placeholder={translate('businesscards.create-edit.customer-name-placeholder')}
                    inputClass="input-normal"
                    validMsg={validateItem(item)}
                    modeSelect={TagAutoCompleteMode.Single}
                    type={TagAutoCompleteType.Customer}
                    elementTags={getDataTagStatusControl()}
                    onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
                      updateStateField(item, type, listTag);
                    }}
                    title={getFieldLabel(item, 'fieldLabel')}
                    isRequired={StringUtils.getValuePropStr(item, 'modifyFlag') === MODIFY_FLAG.REQUIRED || StringUtils.getValuePropStr(item, 'modifyFlag') === MODIFY_FLAG.DEFAULT_REQUIRED}
                    isDisabled={businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW || !!props.customerId || !!props.customerName}
                    isHoldTextInput={true}
                    onChangeText={onchangeText}
                    disableTag={!!props.customerId}
                    textInputValue={businessCardDataInit?.alternativeCustomerName}
                    autoFocusCustomer={true}
                  />
                </div>
              </>
            );
          case specialFName.isWorking:
            return (
              <>
                <div className="col-lg-6 form-group">
                  <label >{getJsonBName(item.fieldLabel)}</label>
                  <div className="wrap-check wrap-tag pt-0">
                    <div className="">
                      <div key={idx} className="check-box-item mr-0 pt-0">
                        <label key={idx} className={`icon-check mr-3 `}>
                          <input
                            disabled={item.modifyFlag === MODIFY_FLAG.READ_ONLY || businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW}
                            value={businessCardDataInit?.isWorking}
                            type="checkbox"
                            checked={businessCardDataInit?.isWorking}
                            onChange={() => updateStateField(item, item.fieldType.toString(), !businessCardDataInit.isWorking)} />
                          <i></i>
                          {translate(`businesscards.create-edit.working`)}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          case specialFName.lastContactDate:
            return (
              <div className="col-lg-6 form-group">
                <div className="color-333">{getJsonBName(item.fieldLabel)}</div>
                <div className="color-333">
                  {businessCardDataInit?.lastContactDate ? switchFormatDate(businessCardDataInit.lastContactDate, 1) : (isEdit ? translate('businesscards.create-edit.auto-update') : translate('businesscards.create-edit.auto-generate'))}
                </div>
              </div>
            )
          case specialFName.businessReceiveDate:
            return (
              <>
                <FieldBusinessCardReceiver
                  ref={receiverRef}
                  receivePerson={receivePerson}
                  onReceiverChange={() => { }}
                  fieldLabel={translate('businesscards.create-edit.employee-id')}
                  isDisabled={businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW}
                  onUpdateFieldValue={updateStateField}
                />
              </>
            );
          case specialFName.updatedDate:
            return (
              <div className="col-lg-6 form-group">
                <div className="color-333">{translate('businesscards.create-edit.updated-date')}</div>
                <div className="color-333">
                  {businessCardDataInit?.updatedDate ? switchFormatDate(businessCardDataInit.updatedDate, 1) : translate('businesscards.create-edit.auto-generate')}
                </div>
              </div>
            )
          case specialFName.createdDate:
            return (
              <div className="col-lg-6 form-group">
                <div className="color-333">{translate('businesscards.create-edit.created-date')}</div>
                <div className="color-333">
                  {businessCardDataInit?.createdDate ? switchFormatDate(businessCardDataInit.createdDate, 1) : translate('businesscards.create-edit.auto-generate')}
                </div>
              </div>)
          case specialFName.createdUser:
            return (
              <div className="col-lg-6 form-group">
                <div className="color-333">{translate('businesscards.create-edit.created-user')}</div>
                <div className="color-333">
                  {businessCardDataInit?.createdUser ? (businessCardDataInit.createdUserName) : translate('businesscards.create-edit.auto-generate')}
                </div>
              </div>
            )
          case specialFName.updatedUser:
            return (
              <div className="col-lg-6 form-group">
                <div className="color-333">{translate('businesscards.create-edit.updated-user')}</div>
                <div className="color-333">
                  {businessCardDataInit?.updatedUser ? (businessCardDataInit.updatedUserName) : translate('businesscards.create-edit.auto-generate')}
                </div>
              </div>
            )
          case specialFName.businessCardLastName:
          case specialFName.businessCardLastNameKana:
          case specialFName.businessCardPositions:
          case specialFName.receivedLastContactDate:
          case specialFName.campaign:
          case specialFName.employeeId:
          case SPECIAL_COMMON[item.fieldName]:
            return <></>;
          default: {
            const idxRef = fieldInfos.findIndex(e => e.fieldId === item.fieldId);
            return (
              <>
                <DynamicControlField
                  ref={inputRefs[idxRef]}
                  isFocus={
                    props.errorValidatesComponent &&
                      props.errorValidatesComponent.length > 0 ?
                      (checkSnakeCase(item.fieldName) === firstErrorItem ? doNotFocus : false) :
                      false
                  }
                  key={item.fieldId}
                  elementStatus={getDataStatusControl(item)}
                  updateStateElement={updateStateField}
                  belong={FIELD_BELONG.BUSINESS_CARD}
                  fieldInfo={item}
                  className={className}
                  isRequired={item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
                  isDisabled={item.modifyFlag === MODIFY_FLAG.READ_ONLY || businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW}
                  errorInfo={getErrorInfo(item)}
                  controlType={businessCardActionType === BUSINESS_CARD_ACTION_TYPES.UPDATE ? ControlType.EDIT : ControlType.ADD}
                  listFieldInfo={listFieldTab}
                  isSingleFile={item.fieldName === 'business_card_image_path'}
                  updateFiles={updateFiles}
                  idUpdate={businessCardId}
                  recordId={[businessCardId]}
                  acceptFileExtension={item.fieldName === 'business_card_image_path' ? FILE_FOMATS.IMG : null}

                />
              </>
            );
          }
        }
      });

    return <></>;
  };

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setForceCloseWindow(false);
    setShowModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/create-edit-business-card`, '', style.toString());
    props.toggleNewWindow && props.toggleNewWindow(true)
  };

  const getTextByMode = isModal => {
    if (isEdit) {
      return translate(`businesscards.create-edit.${isModal ? 'modal-heading-edit' : 'button-edit'}`);
    } else {
      return translate(`businesscards.create-edit.${isModal ? 'modal-heading-create' : 'button-create'}`);
    }
  };

  const displayMessageError = () => {
    if (!props.errorCode) {
      if (props.errorValidatesComponent && props.errorValidatesComponent[0].item === "businessCardId") {
        return (<>
          <BoxMessage messageType={MessageType.Error}
            message={translate(`${`messages.ERR_BUS_0001`}`, { 0: props.errorValidatesComponent[0].item })} />
        </>
        )
      } else return <></>;
    } else if (props.errorCode === 'ERR_COM_0050') {
      return (<>
        <BoxMessage messageType={MessageType.Error}
          message={translate(`${`messages.` + props.errorCode}`)} />
      </>
      )
    }
  };

  /**
   * use for tab component
   * @param listFieldContent
   */
  const renderContentTab = (listFieldContent: any[]) => {
    return <>{renderDynamicControlField(listFieldContent)}</>;
  };

  const renderTab = () => {
    return (
      <DynamicControlField
        controlType={ControlType.EDIT}
        showFieldLabel={false}
        fieldInfo={listFieldTab[0]}
        listFieldInfo={fieldInfos}
        renderControlContent={renderContentTab}
      />
    );
  };

  const renderComponent = () => {
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a className="modal-heading-title" onClick={props.popout || !props.isOpenedFromModal ? null : handleBackPopup} >
                      <i className={`icon-small-primary icon-return-small ${props.popout || !props.isOpenedFromModal ? 'disable' : ''}`} />
                    </a>
                    <span className="text">
                      <img className="icon-popup-big" src="../../../content/images/ic-popup-title-card.svg" />
                      {getTextByMode(true)}
                    </span>
                  </div>
                </div>
                <div className="right">
                  {showModal && <button className={`icon-small-primary icon-link-small ${(businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW) ? ' disable' : ''}`}
                    onClick={() => {
                      if (businessCardViewMode !== BUSINESS_CARD_VIEW_MODES.PREVIEW) {
                        openNewWindow()
                      }
                    }} />}
                  {!props.hiddenShowNewTab && showModal && <button className="icon-small-primary icon-close-up-small line" onClick={() => handleCloseModal()} />}
                </div>
              </div>
              <div className="modal-body style-3">
                <div className="popup-content popup-content-new-window style-3">
                  <div className="user-popup-form label-regular">
                    {displayMessageError()}
                    <form>
                      {/* content  */}
                      <div className={'row'} id={formClass}>
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
                <button onClick={() => handleCloseModal()} ref={firstRef} className="button-cancel mr-5">
                  {translate('businesscards.create-edit.button-cancel')}
                </button>
                <button onClick={() => { (businessCardViewMode !== BUSINESS_CARD_VIEW_MODES.PREVIEW) && submit() }}
                  className={`button-blue ${(businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW) ? ' disable' : ''}`}>
                  {getTextByMode(false)}
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
        <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
          <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="popup-field-search" autoFocus={true} zIndex="auto">
            {renderComponent()}
          </Modal>
        </FocusTrap>
      </>
    );
  } else {
    if (props.popout) {
      return <>{renderComponent()}</>;
    } else {
      return <></>;
    }
  }
};

const mapStateToProps = ({ createEditBusinessCard, applicationProfile }: IRootState) => ({
  action: createEditBusinessCard.action,
  errorMessage: createEditBusinessCard.errorMessage,
  errorCode: createEditBusinessCard.errorCode,
  successMessage: createEditBusinessCard.successMessage,
  customFieldInfos: createEditBusinessCard.customFieldInfos,
  errorValidatesComponent: createEditBusinessCard.errorItems,
  errorCodeList: createEditBusinessCard.errorCodeList,
  businessCardIdResponse: createEditBusinessCard.businessCardIdResponse,
  businessCardDetail: createEditBusinessCard.businessCardDetail,
  suggestDepartment: createEditBusinessCard.suggestDepartment,
  tenant: applicationProfile.tenant
});

const mapDispatchToProps = {
  getCustomFieldInfo,
  suggestBusinessCardDepartment,
  updateBusinessCard,
  handleCreateBusinessCard,
  handleGetBusinessCard,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEditBusinessCard);
