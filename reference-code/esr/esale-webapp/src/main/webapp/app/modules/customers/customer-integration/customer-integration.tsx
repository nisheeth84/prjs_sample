import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal } from 'reactstrap';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import _, { update, clone } from 'lodash';
import { IRootState } from 'app/shared/reducers';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import {
  ACTION_TYPES,
  handleGetCustomerLayout,
  handleGetCustomersByIds,
  handleIntegrateCustomer,
  reset
} from './customer-integration.reducer';
import { ModalAction } from './customer-integration.reducer';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import { startExecuting } from 'app/shared/reducers/action-executing';
import StringUtils, { forceArray, getFieldLabel, jsonParse } from 'app/shared/util/string-utils';
import { formatDateTime, autoFormatTime, utcToTz, DATE_TIME_FORMAT, getDateTimeFormatString, tzToUtc } from 'app/shared/util/date-utils';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import FieldDetailViewSelectOrg from 'app/shared/layout/dynamic-form/control-field/detail/field-detail-view-select-org';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { ControlType, ScreenMode, MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import FieldBusiness from '../create-edit-customer/field-business';
import { MODIFY_FLAG } from 'app/config/constants';
import * as R from 'ramda';
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete';
import {
  TagAutoCompleteMode,
  TagAutoCompleteType
} from 'app/shared/layout/common/suggestion/constants';
import { convertSpecialFieldCustomer } from '../list/special-render/special-render';
import { SCREEN_TYPES, CUSTOMER_MODES, CUSTOMER_SPECIAL_FIELD_NAMES } from '../constants';
import Popover from 'app/shared/layout/common/Popover';
import { getDynamicData } from 'app/shared/util/utils';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { isExceededCapacity } from 'app/shared/util/file-utils';
import moment from 'moment';
import { isNullOrUndefined } from 'util';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';
import { start } from 'repl';
import { SHOW_MESSAGE_SUCCESS } from '../constants';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import { useId } from "react-id-generator";

// field names are not displayed on the screen
const arrFieldNameReject = [
  CUSTOMER_SPECIAL_FIELD_NAMES.customerBusinessSub,
  CUSTOMER_SPECIAL_FIELD_NAMES.customerScenario,
  CUSTOMER_SPECIAL_FIELD_NAMES.lastContactDate,
  CUSTOMER_SPECIAL_FIELD_NAMES.actionNext,
  CUSTOMER_SPECIAL_FIELD_NAMES.scheduleNext,
  CUSTOMER_SPECIAL_FIELD_NAMES.createdDate,
  CUSTOMER_SPECIAL_FIELD_NAMES.updatedDate,
  CUSTOMER_SPECIAL_FIELD_NAMES.createdUser,
  CUSTOMER_SPECIAL_FIELD_NAMES.updatedUser,
  CUSTOMER_SPECIAL_FIELD_NAMES.isDisplayChildCustomers
]

// field types are not displayed on the screen
const arrFieldTypeReject = [
  DEFINE_FIELD_TYPE.TAB,
  DEFINE_FIELD_TYPE.TITLE,
  DEFINE_FIELD_TYPE.LOOKUP,
  DEFINE_FIELD_TYPE.CALCULATION,
]

export interface ICustomerIntegrationModal extends StateProps, DispatchProps {
  customerIds?: any;
  handleCloseCusIntegration?: (flagChange?: boolean, customerDeleteID?: number, messageSuccess?: any) => void;
  iconFunction: any;
  showCustomerDetail?: (customerId) => void;
}

/**
 * Render Customer Integration Component
 * @param props
 */
const CustomerIntegrationModal = (props: ICustomerIntegrationModal) => {
  const [customers, setCustomers] = useState(props.customers ? props.customers : null); // customerList
  const [fieldInfos, setFieldInfos] = useState(props.fieldInfos ? props.fieldInfos : null);
  const [, setErrorItems] = useState([]); // error's list - handle validate error later
  const [customerIds, setCustomerIds] = useState(props.customerIds ? props.customerIds : []);
  const [submitData, setSubmitData] = useState(null); // array include checkbox data + customer id
  const [isFirst, setIsFirst] = useState(true); // check first time render component
  const [commonError, setCommonError] = useState(''); // error message
  const [saveInputData, setSaveInputData] = useState({}); // save manual input data
  const [displayFieldInfos, setDisplayFieldInfos] = useState(null); // field list is displayed on the screen
  const [firstData, setFirstData] = useState(null); // customer's data at first access using for dirty check
  const [mode, setMode] = useState(null); // mode add or remove customer
  const [textSearch, setTextSearch] = useState(null);
  const [showPreview, setShowPreview] = useState({ id: 0, isShow: false });
  const [fileUploads, setFileUploads] = useState({});
  const [listInputChecked, setListInputChecked] = useState([]);
  const [msgSuccess, setMsgSuccess] = useState('');
  const tableHeaderFree = useRef(null);
  const tableContentFree = useRef(null);
  const tableContentLock = useRef(null);
  const tableViewScroll = useRef(null);
  const divSpliter = useRef(null);
  const [openPopupDetailCustomer, setOpenPopupDetailCustomer] = useState(false);
  const [customerIdOpen, setCustomerIdOpen] = useState(null);
  const customerDetailCtrlId = useId(1, "customerListCustomerDetailCtrlId_");

  const previewLogoRef = useRef(null);

  useEffect(() => {
    setMsgSuccess(props.successMessage);
  }, [props.successMessage]);

  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
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

  useEffect(() => {
    if (mode === CUSTOMER_MODES.ADD) {
      props.handleGetCustomersByIds(customerIds);
    }
  }, [customerIds, mode]);

  useEffect(() => {
    if (!openPopupDetailCustomer) {
      document.body.className = 'wrap-customer modal-open';
    }
  }, [openPopupDetailCustomer])

  /**
   * Check snakecase
   * @param value
   */
  const checkSnakeCase = value => {
    if (value && value.includes('_')) {
      return StringUtils.snakeCaseToCamelCase(value);
    } else {
      return value;
    }
  };

  /**
   * Remove customer object by customer id
   * @param customerId
   */
  const removeCustomer = (customerId: number) => {
    setCustomerIds(customerIds.filter(element => element !== customerId));
    const newCustomers = customers.filter(element => element.customerId !== customerId);
    setCustomers(newCustomers);

    const newSubmitData = _.cloneDeep(submitData);
    if (submitData.customerId === customerId) {
      newSubmitData.customerId = newCustomers[0].customerId;
      newSubmitData.updatedDate = newCustomers[0].updatedDate;
    }
    // const tmp = customers.filter(customer => customer.customerId === newSubmitData.customerId);
    fieldInfos.forEach(fieldInfo => {
      const camelFieldName = checkSnakeCase(fieldInfo.fieldName);
      if (
        newSubmitData[`${camelFieldName}`] &&
        newSubmitData[`${camelFieldName}`].customerId === customerId
      ) {
        newSubmitData[`${camelFieldName}`] = {
          customerId: newCustomers[0].customerId,
          id: `${fieldInfo.fieldName}||${newCustomers[0].customerId}`,
          value: newSubmitData[`${camelFieldName}`].value
        };
      }
    });
    setSubmitData(newSubmitData);
    setMode(CUSTOMER_MODES.REMOVE);
  };

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const isChange = !_.isEqual(firstData, submitData);
    const isSearch = !(textSearch === null || textSearch.length === 0)
    if (isChange || isSearch) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  /**
   * Handle close customer integration modal
   * @param reloadFlag
   */
  const handleCloseModal = () => {
    executeDirtyCheck(() => {
      props.reset();
      if (props.handleCloseCusIntegration) {
        props.handleCloseCusIntegration(false, null, null);
      }
    });
  };

  const handleCloseDetail = () => {
    setOpenPopupDetailCustomer(false);
    setCustomerIdOpen(null);
  }

  const handleOpenPopupDetail = (id) => {
    setOpenPopupDetailCustomer(true);
    setCustomerIdOpen(id);
  }

  /**
   * Update customer data
   * @param item
   * @param val
   * @param saveData
   */
  const updateCustomerData = (item, val, saveData) => {
    let stringVal = '';
    let value = null;
    if (val && val['value'] !== undefined) {
      value = val['value'];
    } else {
      value = val;
    }
    if (value instanceof Array) {
      const joinStr = value.length > 0 ? '"' + value.join('","') + '"' : '';
      stringVal = '[' + joinStr + ']';
    } else if (value instanceof Object) {
      stringVal = JSON.stringify(value).replace(/"(\w+)"\s*:/g, '$1:');
    } else if (value !== null && value !== undefined) {
      stringVal = value.toString();
    }
    const addItem = {
      fieldType: item.fieldType.toString(),
      key: item.fieldName,
      value: stringVal
    };
    if (saveData['customerData']) {
      let notInArray = true;
      saveData['customerData']?.map((elm, index) => {
        if (elm.key === addItem.key) {
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

  /**
   * Get customer data by field name
   * @param extendFieldList
   * @param fieldName
   */
  const getCustomerDataValue = (extendFieldList, fieldName) => {
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
   * Get text inside a react fragment
   * @param chil element
   */
  const getTextOfChild = (chil: any) => {
    if (chil?.props) {
      return chil.props.text || getTextOfChild(chil.props.children);
    }
    return chil;
  };

  /**
   * Handle when clicking checkbox
   * @param event
   * @param fieldInfo
   * @param customerId
   * @param fieldValue
   */
  const handleOnChange = (event, fieldInfo, customerId = null, fieldValue = null, checked?: boolean) => {
    if (commonError && commonError.length > 0) {
      setCommonError('');
    }
    let cloneList = _.cloneDeep(listInputChecked);
    if (checked) {
      cloneList.push(fieldInfo);
    } else {
      if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerBusinessMain) {
        cloneList = cloneList?.filter(item => item.fieldName !== CUSTOMER_SPECIAL_FIELD_NAMES.customerBusinessSub);
      }
      cloneList = cloneList?.filter(item => item.fieldId !== fieldInfo.fieldId)
    }
    setListInputChecked(cloneList);
    const tmp = _.cloneDeep(submitData);
    let value = null;
    if (customerId) {
      value = fieldValue;
    } else {
      value = saveInputData['customerData']?.filter(data => fieldInfo.fieldName === data.key)[0];
    }
    if (!fieldInfo.isDefault) {
      updateCustomerData(fieldInfo, getTextOfChild(value), tmp);
    }
    tmp[checkSnakeCase(fieldInfo.fieldName)] = {
      customerId,
      id: event.target.value,
      value
    };
    const targetCustomer = customers?.filter(c => c.customerId === customerId);
    // handle for businessSubId in case choose business field
    if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerBusinessMain) {
      if (targetCustomer.length > 0) {
        tmp[checkSnakeCase(fieldInfo.fieldName)] = {
          customerId,
          id: event.target.value,
          value: targetCustomer[0].businessMainId
        };
        tmp['businessSubId'] = {
          customerId,
          id: event.target.value,
          value: targetCustomer[0].businessSubId
        };
      } else {
        tmp['businessSubId'] = {
          customerId,
          id: event.target.value,
          value
        };
      }
    }
    setSubmitData(tmp);
  };

  /**
   * Initialize array object
   * @param data
   */
  const initialize = (data, field) => {
    const tmp = {};
    const firstCustomer = data[0];
    tmp['customerId'] = firstCustomer.customerId;
    tmp['updatedDate'] = firstCustomer.updatedDate;
    tmp['customerData'] = firstCustomer && firstCustomer.customerData && firstCustomer.customerData.length > 0 ? firstCustomer.customerData : [];
    field &&
      field.forEach(fieldInfo => {
        const fieldName = checkSnakeCase(fieldInfo.fieldName);
        const value = fieldInfo.isDefault
          ? firstCustomer[fieldName]
          : getCustomerDataValue(firstCustomer['customerData'], fieldInfo.fieldName);

        tmp[`${fieldName}`] = {
          customerId: firstCustomer.customerId,
          id: `${fieldInfo.fieldName}||${firstCustomer.customerId}`,
          value,
          isDefault: fieldInfo.isDefault
        };
        // const specialFields = customFieldsInfo(fieldInfo, )
      });
    setSubmitData(tmp);
    setFirstData(tmp);
  };

  const getValueDataSubmit = (parentValue, fileName) => {
    if (fileName === CUSTOMER_SPECIAL_FIELD_NAMES.customerLogo) {
      let logo = null;
      if (parentValue.photoFileName) {
        logo = {
          [`file_name`]: parentValue.photoFileName,
          [`file_path`]: parentValue.photoFilePath,
          status: 0
        }
        return JSON.stringify([logo]);
      } else if (parentValue[`file_name`]) {
        return parentValue
      } else {
        logo = {
          [`file_name`]: '',
          [`file_path`]: '',
          status: 0
        }
        return JSON.stringify([logo]);
      }
    } else {
      const value = _.isArray(parentValue) ? (parentValue.length > 0 ? parentValue[0] : null) : parentValue;
      if (!value) {
        return '';
      }
      if (value[fileName] !== undefined) {
        return value[fileName];
      } else {
        return value[StringUtils.snakeCaseToCamelCase(fileName)];
      }
    }
  }

  const convertDateTime = (value, haveTime) => {
    if (isNullOrUndefined(value) || _.isEmpty(value)) {
      return '';
    }
    if (haveTime) {
      if (value.length !== 19) {
        const arrDate = value.split(' ');
        const strDate = formatDateTime(arrDate[0], getDateTimeFormatString(DATE_TIME_FORMAT.User));
        return strDate + ' ' + arrDate[1];
      } else {
        return formatDateTime(value, getDateTimeFormatString(DATE_TIME_FORMAT.User) + " HH:mm");
      }
    } else {
      return formatDateTime(value, getDateTimeFormatString(DATE_TIME_FORMAT.User));
    }

  }

  const isArrrayValueFied = (name?: string) => {
    if (name.startsWith('checkbox_')
      || name.startsWith('relation_')
      || name.startsWith('multiple_pulldown_')
      || name.startsWith('select_organization_')) {
      return true;
    }
    return false;
  }

  const updateValueSubmitCustomerData = (customerData) => {
    const cloneCustomerData = _.cloneDeep(customerData);
    // const arrayFieldValue = [DEFINE_FIELD_TYPE.MULTI_SELECTBOX, DEFINE_FIELD_TYPE.CHECKBOX, DEFINE_FIELD_TYPE.RELATION, DEFINE_FIELD_TYPE.SELECT_ORGANIZATION];
    cloneCustomerData.map(cloneData => {
      if (isArrrayValueFied(cloneData.key) && cloneData.value === '') {
        cloneData.value = '[]';
      } else if (cloneData.key.startsWith('file_')) {
        const jsonFile = cloneData.value !== '[]' && cloneData.value?.length > 0 ? jsonParse(cloneData.value) : '[]';
        if (jsonFile !== '[]' && jsonFile?.length > 0) {
          jsonFile.map(file => {
            if (file && !file.status) {
              file[`status`] = 0;
            }
          })
          cloneData.value = JSON.stringify(jsonFile)
        } else {
          cloneData.value = jsonFile;
        }
      } else if (cloneData.key.startsWith('date_time_')) {
        cloneData.value = convertDateTime(cloneData.value, true);
      } else if (cloneData.key.startsWith('date_')) {
        cloneData.value = convertDateTime(cloneData.value, false);
      } else if (cloneData.key.startsWith('time_')) {
        cloneData.value = autoFormatTime(cloneData.value, true, null);
      } else if (cloneData.key.startsWith('link_')) {
        if (cloneData.value === '') {
          cloneData.value = JSON.stringify({
            [`url_target`]: '',
            [`url_text`]: '',
            [`sort_value`]: ''
          })
        }
      } else if (_.isNull(cloneData.value) || cloneData.value === 'null') {
        cloneData.value = ''
      }
    })
    return cloneCustomerData;
  }

  /**
   * Format data before calling api IntegrateCustomer
   */
  const parseSubmitData = () => {
    const customerIdsDelete = customerIds.filter(
      element => element.toString() !== submitData.customerId.customerId.toString()
    );
    let customerId = '';
    let updatedDate = '';
    if (submitData.customerId) {
      customerId = submitData.customerId.customerId;
      const selectedCustomer = customers.filter(e => e.customerId === customerId);
      updatedDate = selectedCustomer[0].updatedDate;
    }

    const temp = _.cloneDeep(submitData)
    listInputChecked.forEach(item => {
      if (item.isDefault) {
        temp[StringUtils.snakeCaseToCamelCase(item.fieldName)].value = saveInputData[StringUtils.snakeCaseToCamelCase(item.fieldName)];
      } else {
        const value = saveInputData['customerData'].filter(data => item.fieldName === data.key)[0];
        updateCustomerData(item, getTextOfChild(value), temp);
      }
    });
    let address = {}
    if (temp?.customerAddress?.value) {
      address = R.compose(
        R.pipe(JSON.parse)
      )(temp.customerAddress.value);
    }
    return {
      customerId,
      customerName: temp.customerName ? temp.customerName.value : '',
      customerAliasName: temp.customerAliasName ? temp.customerAliasName.value : '',
      parentId:
        temp.customerParent && temp.customerParent.value
          ? temp.customerParent.value.customerId
          : null,
      phoneNumber: temp.phoneNumber ? temp.phoneNumber.value : '',
      zipCode: address ? getValueDataSubmit(address, 'zip_code') : '',
      building: address ? getValueDataSubmit(address, 'building_name') : '',
      address: address ? getValueDataSubmit(address, 'address_name') : '',
      businessMainId: temp.businessMainId ? temp.businessMainId.value : null,
      businessSubId: temp.businessSubId ? temp.businessSubId.value : null,
      url: temp.url ? temp.url.value : '',
      employeeId: temp.personInCharge.value ? getValueDataSubmit(temp.personInCharge.value, 'employee_id') : null,
      departmentId: temp.personInCharge.value ? getValueDataSubmit(temp.personInCharge.value, 'department_id') : null,
      groupId: temp.personInCharge.value ? getValueDataSubmit(temp.personInCharge.value, 'group_id') : null,
      memo: temp.memo ? temp.memo.value : '',
      customerLogo:
        temp.customerLogo &&
          _.size(temp.customerLogo) > 0 &&
          _.size(temp.customerLogo.value) > 0
          ? getValueDataSubmit(temp.customerLogo.value, CUSTOMER_SPECIAL_FIELD_NAMES.customerLogo)
          : null,
      customerData: temp.customerData ? updateValueSubmitCustomerData(temp.customerData) : [],
      customerIdsDelete,
      updatedDate
    };
  };

  const updateHeightField = (field, resetField) => {
    if (!resetField) {
      const row = document.getElementById(`customer-data-${field.fieldId}`);
      if (row) {
        document.getElementById(`label-${field.fieldId}`).style.height = row.offsetHeight.toString() + 'px';
      }
    }
    else {
      const label = document.getElementById(`label-${field.fieldId}`);
      if (label) {
        label.style.height = 'auto';
      }
    }
  }

  /**
   * Handle when click submit
   */
  const handleSubmit = (event) => {
    fieldInfos.map(field => updateHeightField(field, true));
    props.startExecuting(REQUEST(ACTION_TYPES.INTEGRATE_CUSTOMER));
    setCommonError('');
    const files = getfileUploads();
    if (event && isExceededCapacity(files)) {
      setCommonError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else if (event) {
      setCommonError('');
    }
    props.handleIntegrateCustomer(parseSubmitData(), files);
  };

  /**
   * Render common error message
   */
  const displayMessage = () => {
    if (!commonError) {
      return <></>;
    }
    return <BoxMessage messageType={MessageType.Error} message={commonError} />;
  };

  const displayMessageSuccess = () => {
    if ((!msgSuccess || msgSuccess.length <= 0)) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={MessageType.Success}
        message={msgSuccess}
      />
    );
  };


  useEffect(() => {
    props.handleGetCustomersByIds(props.customerIds);
    props.handleGetCustomerLayout();
    document.body.className = 'wrap-customer modal-open';
    return () => {
      setIsFirst(true);
      props.reset();
    };
  }, []);

  /**
   * Sort ascending
   * @param fieldA
   * @param fieldB
   */
  const valueSort = (fieldA, fieldB) => {
    return fieldA.fieldOrder - fieldB.fieldOrder;
  };

  useEffect(() => {
    if (
      props.customers &&
      props.customers.length > 0 &&
      props.fieldInfos &&
      props.fieldInfos.length > 0
    ) {
      setCustomers(props.customers);
      const fields = convertSpecialFieldCustomer(props.fieldInfos, props.customers);
      const cloneFieldInfos = R.sort(valueSort, _.cloneDeep(fields));
      setFieldInfos(cloneFieldInfos);
      setDisplayFieldInfos(
        _.reject(
          cloneFieldInfos,
          element =>
            arrFieldNameReject.includes(element.fieldName) || arrFieldTypeReject.includes(element.fieldType.toString())
        )
      );
      if (isFirst) {
        initialize(props.customers, cloneFieldInfos);
        setIsFirst(false);
      }
    }
  }, [props.customers, props.fieldInfos]);

  const handleChangeHeightFieldLabel = (errorItems) => {
    errorItems.map(error => {
      const fieldError = fieldInfos?.filter(field => field.fieldName === StringUtils.camelCaseToSnakeCase(error.item));
      if (fieldError && !_.isEmpty(fieldError)) {
        updateHeightField(fieldError[0], false);
      }
    })
  }

  useEffect(() => {
    // const commonErrorItems = ['updated-date'];
    if (props.errorItems && props.errorItems.length > 0) {
      handleChangeHeightFieldLabel(props.errorItems);
      setErrorItems(props.errorItems);
      props.errorItems &&props.errorItems.forEach(errorItem => {
        if (errorItem.errorCode === 'ERR_COM_0001' || errorItem.errorCode === 'ERR_COM_0012') {
          setCommonError(translate('messages.' + errorItem.errorCode))
        }
      });
    }
  }, [props.errorItems]);

  useEffect(() => {
    displayFieldInfos?.map(fieldInfo => {
      if (fieldInfo.fieldName?.startsWith('file')) {
        updateHeightField(fieldInfo, false);
      }
    })
  }, [fileUploads])

  useEffect(() => {
    if (props.action === ModalAction.IntegrateCustomerSuccess) {
      props.handleCloseCusIntegration(true, submitData?.customerId?.customerId, 'INF_COM_0003');
      props.reset();
    }
  }, [props.action]);

  useEffect(() => {
    setTimeout(() => {
      try {
        if (tableHeaderFree && tableHeaderFree.current && customers) {
          tableHeaderFree.current.style.setProperty('width', `${customers.length * 300 + 600}px`, 'important')
        }
        if (tableContentLock && tableContentLock.current && tableContentFree && tableContentFree.current) {
          for (let i = 0; i < tableContentFree.current.children[0].children.length; i++) {
            tableContentLock.current.children[0].children[i].children[0].style.height = `${tableContentFree.current.children[0].children[i].getBoundingClientRect().height}px`;
          }
          if (divSpliter && divSpliter.current && tableViewScroll.current) {
            divSpliter.current.style.height = `${tableViewScroll.current.getBoundingClientRect().height}px`
          }
        }
      } catch (ex) {
        return;
      }
    }, 1000);

  }, [customers, displayFieldInfos]);

  /**
   * Get error info by item.fieldName
   */
  const getErrorInfo = item => {
    let errorInfo = null;
    props.errorItems &&
      props.errorItems.forEach(elem => {
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
        if ((elem && elem.item && elem.item.toLowerCase() === 'url' && fieldName.toLowerCase() === 'url') || (elem && elem.arrayError && item.fieldName.indexOf('link_') !== -1)) {
          errorInfo = { arrayError: elem.arrayError || [] };
        }
        if (item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
          const relationId = StringUtils.tryGetAttribute(item, "relationData.fieldId");
          if (relationId && (_.toString(elem.item) === _.toString(relationId) || _.toString(elem.errorParams) === _.toString(relationId))) {
            errorInfo = elem;
          }
        }
        if (elem && elem.item === 'customerId') {
          errorInfo = null;
        }
      });
    return errorInfo;
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

  const addCustomerData = (addItem, saveData) => {
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

  const createExtItem = (item, val) => {
    const isArray = Array.isArray(val);
    const itemValue = isArray ? JSON.stringify(val) : val ? val.toString() : '';
    return {
      fieldType: item.fieldType.toString(),
      key: item.fieldName,
      value: itemValue
    };
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
        addCustomerData(addIt, saveData);
      });
    } else {
      addCustomerData(addItem, saveData);
    }
  };

  const updateStateField = (item, type, val) => {
    let fieldInfo = null;
    fieldInfos.forEach(field => {
      if (field.fieldId.toString() === item.fieldId.toString()) {
        fieldInfo = field;
      }
    });
    if (saveInputData !== null && saveInputData !== undefined && fieldInfo) {
      if (fieldInfo.isDefault) {
        if (fieldInfo.fieldName === "customer_logo") {
          saveInputData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = JSON.stringify(val);
        } else {
          saveInputData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = forceNullIfEmptyString(fieldInfo, val);
        }
        setSaveInputData(_.cloneDeep(saveInputData));
      } else if (fieldInfo.fieldName && _.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.CALCULATION) {
        addExtendField(fieldInfo, val, saveInputData);
        setSaveInputData(_.cloneDeep(saveInputData));
      }
    } else if (item.fieldName) {
      const newObject = {};
      newObject[StringUtils.snakeCaseToCamelCase(item.fieldName)] = val; // StringUtils.emptyStringIfNull(val);
      setSaveInputData(newObject);
    }
  };


  /**
   * Get first item error
   */
  const getFirstItemError = () => {
    let itemFirstError = null;
    if (fieldInfos && props.errorItems && props.errorItems.length > 0) {
      for (let i = 0; i < fieldInfos.length; i++) {
        const fieldNameInit = checkSnakeCase(fieldInfos[i].fieldName);
        if (props.errorItems.some(j => checkSnakeCase(j.item) === fieldNameInit)) {
          itemFirstError = fieldNameInit;
          break;
        }
      }
    }
    return itemFirstError;
  };
  const firstErrorItem = getFirstItemError();

  /**
   * Get normal fieldName
   */
  const getFieldByName = (listField, fieldName) => {
    let field = null;
    listField.every(element => {
      if (element.fieldName === fieldName) {
        field = element;
        return false;
      } else {
        return true;
      }
    });
    return field;
  };

  const updateStateParentId = (item, val, type, tags) => {
    const saveParentInput = _.cloneDeep(saveInputData);
    saveParentInput[`customerParent`] = tags && tags.length > 0 ? tags[0] : null;
    setSaveInputData(saveParentInput);
  }

  /**
   * Return manual input field
   * @param fieldInfo
   */
  const renderDynamicField = fieldInfo => {
    const isIconField = fieldInfo.fieldName === _.snakeCase(CUSTOMER_SPECIAL_FIELD_NAMES.customerLogo);
    const shouldDisable =
      submitData[`${checkSnakeCase(fieldInfo.fieldName)}`].id.toString() !==
      `manual||${fieldInfo.fieldId}`;
    if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerBusinessMain) {
      const businessMainItem = getFieldByName(fieldInfos, 'business_main_id');
      delete businessMainItem.fieldLabel;
      const businessSubItem = getFieldByName(fieldInfos, 'business_sub_id');
      delete businessSubItem.fieldLabel;

      return (
        <FieldBusiness
          fieldLabel={null}
          businessMain={businessMainItem}
          errorBusinessMain={getErrorInfo(fieldInfo)}
          businessSub={businessSubItem}
          updateStateField={updateStateField}
          businessData={{
            businessMainId: null,
            businessSubId: null
          }}
          errorBusinessSub={getErrorInfo(businessSubItem)}
          isDisabled={shouldDisable}
          classBusiness="w100 no-border d-flex"
          screen={SCREEN_TYPES.CUSTOMER_INTEGRATION}
        />
      );
    } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerParent) {
      return (
        <div className="form-group form-group w-100 mb-0">
          <TagAutoComplete
            type={TagAutoCompleteType.Customer}
            id="customer"
            modeSelect={TagAutoCompleteMode.Single}
            placeholder={translate('customers.create-edit-modal.placeholder-customer-parent')}
            elementTags={
              saveInputData['parentId']
                ? [{ customerId: saveInputData['parentId'], customerName: saveInputData['parentName'] }]
                : null
            }
            onActionSelectTag={updateStateParentId}
            inputClass={`input-normal input-common2 one-item ${shouldDisable ? 'disable' : ''}`}
            isDisabledPreView={shouldDisable}
          />
        </div>
      );
    }
    return (
      <div className={fieldInfo.fieldName !== CUSTOMER_SPECIAL_FIELD_NAMES.url ? 'w-100 form-group' : null}
        style={
          ((fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.url
            || fieldInfo.fieldName.startsWith('link')) && !getErrorInfo(fieldInfo))
            ? { marginLeft: '-12px' } : null}
      >
        <DynamicControlField
          isFocus={
            props.errorItems && props.errorItems.length > 0
              ? checkSnakeCase(fieldInfo.fieldName) === firstErrorItem
              : false
          }
          key={fieldInfo.fieldId}
          elementStatus={null}
          updateStateElement={updateStateField}
          fieldInfo={fieldInfo}
          isRequired={
            (fieldInfo.modifyFlag === MODIFY_FLAG.REQUIRED ||
              fieldInfo.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED) &&
            !(fieldInfo.fieldName.startsWith('radio') || fieldInfo.fieldName.startsWith('checkbox'))
          }
          showFieldLabel={
            !(fieldInfo.fieldName.startsWith('radio')
              || fieldInfo.fieldName.startsWith('checkbox')
              || fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerAddress
              || fieldInfo.fieldName.startsWith('address_')
              || fieldInfo.fieldName.startsWith('pulldown_')
              || fieldInfo.fieldName.startsWith('multiple_pulldown_'))
          }
          updateFiles={updateFiles}
          isDisabled={shouldDisable}
          errorInfo={getErrorInfo(fieldInfo)}
          controlType={
            (fieldInfo.fieldName.startsWith('radio')
              || fieldInfo.fieldName.startsWith('checkbox')
              || fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerAddress
              || fieldInfo.fieldName.startsWith('address_')
              || fieldInfo.fieldName.startsWith('pulldown_')
              || fieldInfo.fieldName.startsWith('multiple_pulldown_'))
              || fieldInfo.fieldName.startsWith('relation_')
              || fieldInfo.fieldName.startsWith('lookup_')
              || fieldInfo.fieldName.startsWith('text_')
              || fieldInfo.fieldName.startsWith('select_organization_')
              ? ControlType.EDIT
              : ControlType.EDIT_LIST
          }
          isSingleFile={isIconField}
          isCustomerIntegration={true}
          acceptFileExtension={isIconField ? FILE_FOMATS.IMG : null}
        />
      </div>
    );
  };

  /**
   * Return customer's data label
   */
  const getCustomerDataLabel = (customerInfo, fieldInfo) => {
    const obj = {
      dataSubmit: null,
      dataShow: null,
      isDefault: true
    }
    if (fieldInfo.isDefault) {
      if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerBusinessMain) {
        const tmp = [];
        if (customerInfo.businessMainName) tmp.push(customerInfo.businessMainName);
        if (customerInfo.businessSubName) tmp.push(customerInfo.businessSubName);
        obj.dataShow = tmp.join('・') || '';
      } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerBusinessSub) {
        obj.dataShow = customerInfo.businessSubname || '';
      } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerLogo && customerInfo.customerLogo) {
        obj.dataShow = customerInfo.customerLogo.photoFileName || '';
      } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerAddress) {
        const dataJson = R.compose(
          R.path(['address']),
          R.pipe(JSON.parse),
          R.path(['customerAddress'])
        )(customerInfo);
        if (dataJson) {
          obj.dataShow = (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`http://google.com/maps/search/${dataJson}`}>{translate("dynamic-control.fieldDetail.layoutAddress.lable.postMark")}{dataJson}
            </a>);
        }
      } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerName) {
        obj.dataShow = customerInfo.customerName ? <a className="text-blue" onClick={() => handleOpenPopupDetail(customerInfo.customerId)}>
          {customerInfo.customerName}
        </a> : null;
      } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerParent) {
        obj.dataShow = customerInfo.customerParent.customerName ? <a className="text-blue" onClick={() => handleOpenPopupDetail(customerInfo.customerParent.customerId)}>
          {customerInfo.customerParent.customerName}
        </a> : null;
      } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.createdDate) {
        obj.dataShow = formatDateTime(customerInfo.createdDate, 'DD-MM-YYYY HH:mm');
      } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.updatedDate) {
        obj.dataShow = formatDateTime(customerInfo.updatedDate, 'DD-MM-YYYY HH:mm');
      } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.url) {
        const urlText = R.compose(
          R.path(['url_text']),
          R.pipe(JSON.parse),
          R.path(['url'])
        )(customerInfo);
        const urlTarget = R.compose(
          R.path(['url_target']),
          R.pipe(JSON.parse),
          R.path(['url'])
        )(customerInfo);
        if (!urlTarget) {
          obj.dataShow = urlText;
        } else {
          obj.dataShow = (
            urlText ? (
              <a
                rel="noopener noreferrer"
                target="blank"
                href={urlTarget}
                className="have-url"
              >
                {urlText}
              </a>
            ) : (
                <a
                  rel="noopener noreferrer"
                  target="blank"
                  href={urlTarget}
                  className="no-url have-target"
                >
                  {urlTarget}
                </a>
              )
          )
        }
      } else {
        const valueDefault = customerInfo[`${checkSnakeCase(fieldInfo.fieldName)}`];
        if (valueDefault && valueDefault.toString().length > 0) {
          obj.dataShow = valueDefault;
        } else {
          obj.dataShow = '\u00A0';
        }
      }
    } else if (customerInfo.customerData && customerInfo.customerData.length > 0) {
      const customerData = getDynamicData(fieldInfo, customerInfo.customerData, customerInfo, ScreenMode.DISPLAY, customerInfo.customerId, null);
      obj.dataShow = customerData ? <>{customerData}</> : null;
      const valueData = customerInfo.customerData.filter(data => fieldInfo.fieldName === data.key);
      if (valueData.length === 0) {
        obj.dataShow = '\u00A0';
      } else if (valueData[0].value.lenght === 0) {
        obj.dataShow = '\u00A0';
      } else if (Array.isArray(jsonParse(valueData[0].value)) && jsonParse(valueData[0].value).length === 0) {
        obj.dataShow = '\u00A0';
      }
      obj.dataSubmit = customerInfo.customerData.find(e => e.fieldType === fieldInfo.fieldType)?.value;
      obj.isDefault = false;
    }
    return obj;
  };

  /**
    * Check all radio checkbox when click button 全選択/checkall
    * @param customerItem
    */
  const checkAllByCustomer = (customerItem = null) => {
    const customer = _.cloneDeep(customerItem);
    const cloneSubmitData = _.cloneDeep(submitData);
    // const temp = _.cloneDeep(submitData);
    if (customer) {
      cloneSubmitData.customerId = customer.customerId;
      cloneSubmitData.updatedDate = customer.updatedDate;
      setListInputChecked([]);
      fieldInfos &&
        fieldInfos.map(fieldInfo => {
          if (!fieldInfo.isDefault) {
            const dataCustomerArr = customer['customerData'].filter(data => data.key === fieldInfo.fieldName);
            if (dataCustomerArr && dataCustomerArr.length > 0 && dataCustomerArr[0].value) {
              updateCustomerData(fieldInfo, dataCustomerArr[0], cloneSubmitData);
            } else {
              updateCustomerData(fieldInfo, null, cloneSubmitData);
            }
          }
          cloneSubmitData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = {
            customerId: customer.customerId,
            id: `${fieldInfo.fieldName}||${customer.customerId}`,
            value: customer[`${StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)}`]
          };
        });
    } else {
      const cloneList = _.cloneDeep(listInputChecked);
      fieldInfos &&
        fieldInfos.map((fieldInfo, i) => {
          cloneList.push(fieldInfo);
          if (fieldInfo.fieldName !== 'customer_id') {
            const value = saveInputData[`${fieldInfo.fieldName}`];
            if (!fieldInfo.isDefault) {
              updateCustomerData(fieldInfo, getTextOfChild(value), cloneSubmitData);
            }
            cloneSubmitData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = {
              customerId: null,
              id: `manual||${fieldInfo.fieldId}`,
              value: saveInputData[`${fieldInfo.fieldName}`]
            };
          }
        });
      setListInputChecked(cloneList);
    }
    setSubmitData(cloneSubmitData);
  };

  /**
   * Update customerIds and mode when choose customer from suggestion text box
   */
  const updateStateCustomerId = (item, val, type, tags) => {
    const tmpIds = _.cloneDeep(customerIds);
    if (tags.length > 0 && !tmpIds.includes(tags[0].customerId)) {
      tmpIds.push(tags[0].customerId);
      setMode(CUSTOMER_MODES.ADD);
    }
    setCustomerIds(tmpIds);
  };

  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (!props.iconFunction) {
      return <></>
    } else {
      return <img src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />
    }
  }

  /**
   * Get value on changing data on the screen
   */
  const getValueDataChange = (fieldInfo, customerItem, value) => {
    if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerLogo) {
      return customerItem.customerLogo;
    } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerParent) {
      return customerItem.customerParent;
    } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.url) {
      return customerItem.url;
    } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerAddress) {
      return customerItem.customerAddress;
    } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerName) {
      return customerItem.customerName;
    } else if (!fieldInfo.isDefault) {
      return customerItem.customerData.filter(data => data.key === fieldInfo.fieldName)[0];
    }
    return value.isDefault ? value.dataShow : value.dataSubmit;
  }

  /**
  * Set position left, top for preview image
  */
  const getStyle = () => {
    const style = {};
    if (!previewLogoRef.current) {
      return style;
    }
    const marginTopImage = 360;
    if (previewLogoRef.current.getBoundingClientRect().top > window.innerHeight - marginTopImage) {
      style['top'] = '-225px';
    } else {
      style['top'] = '20px';
    }
    return style;
  }

  if (!submitData) return <></>;

  return (
    <>
      <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
        <div
          className="modal popup-esr popup-esr4 user-popup-page popup-align-right show"
          id="popup-esr"
          aria-hidden="true"
        >
          <div className="modal-dialog form-popup">
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a className="icon-small-primary icon-return-small" onClick={() => handleCloseModal()} />
                    <span className="text">
                      {getIconFunction()}
                      {translate('customers.customer-integration.title')}
                    </span>
                  </div>
                </div>
                <div className="right">
                  <a
                    className="icon-small-primary icon-close-up-small line"
                    onClick={() => handleCloseModal()}
                  />
                </div>
              </div>
              {/* Start table */}
              <div className="modal-body style-3">
                <div className="popup-content style-3 pr-2 overflow-hidden">
                  {displayMessage()}
                  <div>
                    <div className="col-lg-6 break-line form-group">
                      <div className="form-group">
                        <TagAutoComplete
                          type={TagAutoCompleteType.Customer}
                          title={translate('customers.create-edit-modal.title-intergation')}
                          id="customer"
                          modeSelect={TagAutoCompleteMode.Single}
                          placeholder={translate(
                            'customers.customer-integration.search-placeholder'
                          )}
                          elementTags={
                            submitData['parentId']
                              ? [{
                                customerId: submitData['parentId'],
                                customerName: submitData['parentName']
                              }]
                              : null
                          }
                          onActionSelectTag={updateStateCustomerId}
                          inputClass="input-normal input-common2 one-item"
                          onChangeText={setTextSearch}
                        />
                      </div>
                    </div>
                  </div>
                  <ScrollSync>
                    <div className="table-default d-flex flex-nowrap h-auto mt-3">
                      <div className="wrap-table-scroll style-0 position-relative width-200 overflow-initial" ref={tableViewScroll}>
                        <table className="table-list table-scroll table-default table-card-auto table-empty">
                          <thead>
                            <tr><td className="nobor-right"><div></div></td></tr>
                          </thead>
                        </table>
                        <ScrollSyncPane group="A">
                          <div className="overflow-y v2 style-0 width-200 scroll-table-v2">
                            <table className="table-list table-scroll" ref={tableContentLock}>
                              <tbody>
                                {displayFieldInfos && displayFieldInfos.map((fieldInfo, i) => (
                                  <tr key={fieldInfo.fieldId} id={`label-${fieldInfo.fieldId}`}>
                                    <td className="title-table nobor-right width-200">
                                      <div className="d-flex justify-content-between text-over max-width-200">
                                        <Popover y={30} >
                                          {fieldInfo.fieldName === 'business_main_id'
                                            ? translate('customers.customer-integration.business')
                                            : getFieldLabel(fieldInfo, 'fieldLabel')}
                                        </Popover>
                                        {(fieldInfo.modifyFlag === MODIFY_FLAG.REQUIRED || fieldInfo.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED) && (
                                          <span className="label-red ml-2">{translate('customers.customer-integration.required')}</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div ref={divSpliter} className="table-box-shadow-l"></div>
                          </div>
                        </ScrollSyncPane>
                      </div>
                      <div className="wrap-table-scroll width w-auto">
                        <table ref={tableHeaderFree} className="table-list table-scroll table-layout-fixed width">
                          <thead>
                            <tr>
                              {customers && customers.map((element, idx) => (
                                <td key={idx} className="title-table width-300">
                                  <div className="text-over title-table">
                                    <div className="d-flex justify-content-between max-width-270">
                                      <div className="max-width-250"><Popover y={30}>{element.customerName}</Popover></div>
                                      <a className={customerIds.length > 2 ? 'icon-small-primary icon-close-up-small' : 'icon-small-primary icon-close-up-small disable'}
                                        onClick={() => customerIds.length > 2 ? removeCustomer(element.customerId) : null}
                                      />
                                    </div>
                                    <a
                                      className="button-primary button-activity-registration w100 mt-2"
                                      onClick={() => checkAllByCustomer(element)}
                                    >
                                      {translate('customers.customer-integration.check-all')}
                                    </a>
                                  </div>
                                </td>
                              ))}
                              <td className="title-table">
                                <div className="text-over title-table">
                                  <div className="d-flex justify-content-between">
                                    {translate('customers.customer-integration.manual-input-text')}
                                  </div>
                                  <a
                                    className="button-primary button-activity-registration w100 mt-2"
                                    onClick={() => checkAllByCustomer()}
                                  >
                                    {translate('customers.customer-integration.check-all')}
                                  </a>
                                </div>
                              </td>
                            </tr>
                          </thead>
                        </table>
                        <ScrollSyncPane group="A">
                          <div className="overflow-y overflow-x-hidden height-calc-400" style={{ width: `${customers.length * 300 + 600}px` }}>
                            <table ref={tableContentFree} className="table-list table-scroll width table-customer-integration w-100">
                              <tbody>
                                {displayFieldInfos && displayFieldInfos.map((fieldInfo, i) => (
                                  <tr key={fieldInfo.fieldId} id={`customer-data-${fieldInfo.fieldId}`}>
                                    {customers && customers.map((customerItem, j) => {
                                      const value = getCustomerDataLabel(customerItem, fieldInfo);
                                      if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.personInCharge && customerItem.personInCharge) {
                                        const objPersonInCharge = {};
                                        objPersonInCharge['employee_id'] = customerItem.personInCharge.employeeId ?? null;
                                        objPersonInCharge['department_id'] = customerItem.personInCharge.departmentId ?? null;
                                        objPersonInCharge['group_id'] = customerItem.personInCharge.groupId ?? null;
                                        return <>
                                          <td key={`customer-${i}-${j}`} className="width-300">
                                            <div className="wrap-check-radio text-over width-299">
                                              <p className="radio-item max-width-270 mr-0">
                                                <input
                                                  type="radio"
                                                  id={`radio${i}${j}`}
                                                  value={`${fieldInfo.fieldName}||${customerItem.customerId}`}
                                                  name={fieldInfo.fieldLabel}
                                                  checked={
                                                    submitData[
                                                      `${checkSnakeCase(fieldInfo.fieldName)}`
                                                    ].id.toString() ===
                                                    `${fieldInfo.fieldName}||${customerItem.customerId}`.toString()
                                                  }
                                                  onChange={event =>
                                                    handleOnChange(
                                                      event,
                                                      fieldInfo,
                                                      customerItem.customerId,
                                                      value.dataShow
                                                    )
                                                  }
                                                />
                                                <label className="mt-2" htmlFor={`radio${i}${j}`}>
                                                  {'\u00A0'}
                                                </label>
                                              </p>
                                              <FieldDetailViewSelectOrg
                                                ogranizationValues={[objPersonInCharge]}
                                                fieldInfo={fieldInfo}
                                                recordId={customerItem.customerId}
                                                controlType={ControlType.DETAIL_VIEW}
                                                className="customer-integration-selected-org"
                                              />
                                            </div>
                                          </td>
                                        </>
                                      } else if (fieldInfo.fieldName === CUSTOMER_SPECIAL_FIELD_NAMES.customerLogo && customerItem.customerLogo) {
                                        return <>
                                          <td key={`customer-${i}-${j}`} className="width-300">
                                            <div className="wrap-check-radio position-relative pad-9-11 width-299">
                                              <p className="radio-item max-width-270 text-ellipsis">
                                                <input
                                                  type="radio"
                                                  id={`radio${i}${j}`}
                                                  value={`${fieldInfo.fieldName}||${customerItem.customerId}`}
                                                  name={fieldInfo.fieldLabel}
                                                  checked={
                                                    submitData[
                                                      `${checkSnakeCase(fieldInfo.fieldName)}`
                                                    ].id.toString() ===
                                                    `${fieldInfo.fieldName}||${customerItem.customerId}`.toString()
                                                  }
                                                  onChange={event =>
                                                    handleOnChange(
                                                      event,
                                                      fieldInfo,
                                                      customerItem.customerId,
                                                      getValueDataChange(fieldInfo, customerItem, value),
                                                      false
                                                    )
                                                  }
                                                />
                                                <label htmlFor={`radio${i}${j}`}></label>
                                                <a id={`customerLogo-${customerItem.customerId}`}
                                                  className="text-blue"
                                                  onMouseOver={() => { setShowPreview({ id: customerItem.customerId, isShow: true }); getStyle() }}
                                                  onMouseOut={() => { setShowPreview({ id: customerItem.customerId, isShow: false }); getStyle() }}
                                                >
                                                  {value && value.dataShow ? value.dataShow : '\u00A0'}
                                                </a>
                                              </p>
                                              <div className="position-absolute">
                                                <div
                                                  className={`${showPreview.id === customerItem.customerId && showPreview.isShow ? 'box-choose-file' : ''}`}
                                                  ref={previewLogoRef}
                                                  style={getStyle()}>
                                                  {showPreview.id === customerItem.customerId && showPreview.isShow &&
                                                    <img src={R.path(['customerLogo', 'fileUrl'], customerItem)} />}
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                        </>
                                      } else {
                                        const isSelectOrganization = fieldInfo.fieldName.startsWith('select_organization')
                                        return <>
                                          <td key={`customer-${i}-${j}`} className="width-300">
                                            <div className="wrap-check-radio text-over width-299">
                                              <p className={`radio-item max-width-270 ${isSelectOrganization ? 'mr-0' : 'w-100'}`}>
                                                <input
                                                  type="radio"
                                                  id={`radio${i}${j}`}
                                                  value={`${fieldInfo.fieldName}||${customerItem.customerId}`}
                                                  name={fieldInfo.fieldLabel}
                                                  checked={
                                                    submitData[
                                                      `${checkSnakeCase(fieldInfo.fieldName)}`
                                                    ].id.toString() ===
                                                    `${fieldInfo.fieldName}||${customerItem.customerId}`.toString()
                                                  }
                                                  onChange={event =>
                                                    handleOnChange(
                                                      event,
                                                      fieldInfo,
                                                      customerItem.customerId,
                                                      getValueDataChange(fieldInfo, customerItem, value),
                                                      false
                                                    )
                                                  }
                                                />
                                                {!isSelectOrganization
                                                  ? (<label htmlFor={`radio${i}${j}`} className="w95">
                                                    <Popover y={30}>
                                                      {value?.dataShow ?? '\u00A0'}
                                                    </Popover>
                                                  </label>)
                                                  : (
                                                    <label className="mt-2" htmlFor={`radio${i}${j}`}>
                                                      {'\u00A0'}
                                                    </label>
                                                  )
                                                }
                                              </p>
                                              {isSelectOrganization ? value.dataShow : (<></>)}
                                            </div>
                                          </td>
                                        </>
                                      }
                                    })}
                                    <td>
                                      {fieldInfo.fieldName === 'customer_id' &&
                                        <div className="text-over"><p>{translate('customers.customer-integration.cannot-enter-value')}</p></div>
                                      }
                                      {fieldInfo.fieldName !== 'customer_id' &&
                                        <div className="d-flex text-over overflow-normal align-items-center">
                                          <div className="wrap-check-radio">
                                            <p className="radio-item">
                                              <input
                                                type="radio"
                                                id={`manual-radio${i}`}
                                                name={fieldInfo.fieldLabel}
                                                value={`manual||${fieldInfo.fieldId}`}
                                                checked={
                                                  submitData[
                                                    `${checkSnakeCase(fieldInfo.fieldName)}`
                                                  ].id.toString() ===
                                                  `manual||${fieldInfo.fieldId}`.toString()
                                                }
                                                onChange={event => handleOnChange(event, fieldInfo, null, null, true)}
                                              />
                                              <label htmlFor={`manual-radio${i}`}>{'\u00A0'}</label>
                                            </p>
                                          </div>
                                          {renderDynamicField(fieldInfo)}
                                        </div>
                                      }
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </ScrollSyncPane>
                      </div>
                    </div>
                  </ScrollSync>

                  {displayMessageSuccess()}
                </div>
                <div className="user-popup-form-bottom">
                  <a
                    title="button-cancel"
                    className="button-cancel mr-5"
                    onClick={() => handleCloseModal()}
                  >
                    {translate('customers.customer-integration.button-cancel')}
                  </a>
                  {customerIds.length >= 2 && (
                    <a title="button" className="button-blue" onClick={(event) => handleSubmit(event)}>
                      {translate('customers.customer-integration.button-submit')}
                    </a>
                  )}
                  {customerIds.length < 2 && (
                    <a title="button" className="button-blue disable">
                      {translate('customers.customer-integration.button-submit')}
                    </a>
                  )}
                </div>
              </div>
              {/* End table */}
            </div>
          </div>
        </div>
      </Modal>
      {openPopupDetailCustomer &&
        <PopupCustomerDetail
          id={customerDetailCtrlId[0]}
          showModal={true}
          openFromModal={true}
          customerId={customerIdOpen}
          listCustomerId={[customerIdOpen]}
          toggleClosePopupCustomerDetail={() => handleCloseDetail()}
        />
      }
      <div className="modal-backdrop show" />
    </>
  );
};

const mapStateToProps = ({ customerModal }: IRootState) => ({
  customers: customerModal.customers,
  fieldInfos: customerModal.fieldInfos,
  errorItems: customerModal.errorItems,
  action: customerModal.action,
  successMessage: customerModal.msgSuccess
});

const mapDispatchToProps = {
  reset,
  handleGetCustomerLayout,
  handleGetCustomersByIds,
  handleIntegrateCustomer,
  startExecuting
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerIntegrationModal);
