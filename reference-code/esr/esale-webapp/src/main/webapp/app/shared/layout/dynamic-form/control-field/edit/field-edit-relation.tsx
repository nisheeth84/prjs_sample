import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { ControlType, FIELD_BELONG, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT_ES } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Options, connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import {
  getServicesInfo,
  getFieldsInfo,
  getCustomFieldInfo,
  getSuggestRelation,
  getServiceRecordByIds,
  DynamicFieldAction,
  reset,
} from 'app/shared/reducers/dynamic-field.reducer';
import _ from 'lodash';
import { Storage, translate } from 'react-jhipster';
import StringUtils, { forceArray, getFieldLabel, getPlaceHolder, firstChar, getDisplayTextFromValue, jsonParse } from 'app/shared/util/string-utils';
import { getValueProp } from 'app/shared/util/entity-utils';
import { parseRelationIds } from '../../list/dynamic-list-helper';
import { Link } from 'react-router-dom';
import { getLinkListModule } from 'app/modules/modulo-bridge';
import useDebounce from 'app/shared/util/useDebounce'
import SearchAddSuggest from 'app/shared/layout/common/suggestion/search-add-suggest/search-add-suggest';
import FieldDetailViewSelectOrg from 'app/shared/layout/dynamic-form/control-field/detail/field-detail-view-select-org';
import { TagAutoCompleteMode, SUGGESTION_CSS } from 'app/shared/layout/common/suggestion/constants';
import dateFnsFormat from 'date-fns/format';
import { formatDate } from 'app/shared/util/date-utils';
import { DEFINE_FIELD_TYPE } from '../../constants';
import IconLoading from 'app/shared/layout/common/suggestion/other/icon-loading';
import { CommonUtil } from 'app/modules/activity/common/common-util';
import { getSuggestCss } from 'app/shared/layout/common/suggestion/sugesstion-helper';

type IFieldEditRelationOwnProps = IDynamicFieldProps;

interface IFieldEditRelationDispatchProps {
  getServicesInfo,
  getFieldsInfo,
  getCustomFieldInfo,
  getSuggestRelation,
  getServiceRecordByIds,
  reset,
}

interface IFieldEditRelationStateProps {
  action,
  errorMessage,
  fieldInfoSelect,
  customFieldInfo,
  suggestData,
  recordData
}

type IFieldEditRelationProps = IFieldEditRelationDispatchProps & IFieldEditRelationStateProps & IFieldEditRelationOwnProps

const FieldEditRelation = forwardRef((props: IFieldEditRelationProps, ref) => {

  const LIMIT_RECORD = 10
  const [showSuggest, setShowSuggest] = useState(false)
  const [textValue, setTextValue] = useState('');
  const [fieldBelong, setFieldBelong] = useState(null)
  const [listSuggest, setListSuggest] = useState([]);
  const [offset, setOffset] = useState(0);
  const [relationFieldId, setRelationFieldId] = useState(null);
  const [fieldIdSearch, setFieldIdSearch] = useState(0)
  const [fieldSearch, setFieldSearch] = useState(null)
  const [formatResult, setFormatResult] = useState(0);
  const [oldTextSearch, setOldTextSearch] = useState('');
  const [oldLimit, setOldLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editRecords, setEditRecords] = useState([]);
  const debouncedTextValue = useDebounce(textValue, 500);
  const defaultImg = '../../content/images/noimage.png';

  const suggestRef = useRef(null);
  const textboxRef = useRef(null);
  const suggestBottomRef = useRef(null);

  const { fieldInfo } = props;
  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }

  const idControl = `${props.belong}_${fieldInfo.fieldId}`;
  const userFormatDate = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT_ES);
  const initilize = () => {
    if (props.elementStatus && props.elementStatus.fieldValue && fieldInfo.relationData && fieldInfo.relationData.fieldBelong) {
      const fValue = forceArray(props.elementStatus.fieldValue);
      if (fValue && fValue.length > 0) {
        props.getServiceRecordByIds(idControl, fieldInfo.relationData.fieldBelong, fValue);
      }
    }
    if (props.fieldInfo.relationData) {
      if (props.fieldInfo.relationData.fieldBelong) {
        const extBelong = _.toNumber(props.fieldInfo.relationData.fieldBelong)
        setFieldBelong(extBelong)
        props.getCustomFieldInfo(idControl, extBelong);
      }
      if (props.fieldInfo.relationData.displayFieldId) {
        setFieldIdSearch(props.fieldInfo.relationData.displayFieldId)
      }
      if (props.fieldInfo.relationData.format) {
        setFormatResult(props.fieldInfo.relationData.format)
      }
      if (props.fieldInfo.relationData.fieldId) {
        setRelationFieldId(props.fieldInfo.relationData.fieldId)
      }
    }
  }

  const getAlternativeValue = (fieldName: string) => {
    if (!props.customFieldInfo || !fieldName) {
      return "";
    }
    const fName = fieldName.split(".").slice(-1)[0];
    const idx = props.customFieldInfo.findIndex(e => StringUtils.equalPropertyName(e.fieldName, fName));
    let fLabel = ''
    if (idx < 0) {
      fLabel = fName
    } else {
      fLabel = getFieldLabel(props.customFieldInfo[idx], 'fieldLabel');
    }
    return translate('messages.ERR_COM_0035', { "0": fLabel })
  }

  const getFieldValueAlter = (val: any, fieldName: string, noDisplayMessages?: boolean) => {
    let fValue = null;
    if (_.isString(val)) {
      fValue = val;
    } else {
      fValue = _.get(val, fieldName)
    }
    if (_.isNil(fValue) || ((_.isString(fValue) || _.isArray(fValue))
      && _.isEmpty(fValue)) || _.toString(fValue).length < 1) {
      if (noDisplayMessages === true) {
        return "";
      } else {
        return getAlternativeValue(fieldName);
      }
    } else {
      const postMark = translate('dynamic-control.fieldDetail.layoutAddress.lable.postMark');
      const isAdr = _.toLower(fieldName).includes("address") && fValue;
      return `${isAdr ? postMark : ''}${fValue}`;
    }
  }

  const handleUserMouseDown = (event) => {
    if (suggestBottomRef && suggestBottomRef.current && suggestBottomRef.current.isShowingSearchOrAdd()) {
      return;
    }
    if (suggestRef.current && !suggestRef.current.contains(event.target)) {
      setOldLimit(listSuggest.length)
      setListSuggest([]);
      setShowSuggest(false);
    }
  };

  const requestSuggestData = (startRecord: number, limit?: number) => {
    if (!props.customFieldInfo || props.customFieldInfo.length < 1 || isLoading || _.trim(textValue).length <= 1) {
      return;
    }
    const listIdChoice = editRecords.map(e => e.recordId);
    if (fieldBelong === props.fieldInfo.fieldBelong && props.recordId) {
      if (_.isArray(props.recordId)) {
        listIdChoice.push(...props.recordId.filter(e => e > 0))
      } else if (props.recordId > 0) {
        listIdChoice.push(props.recordId)
      }
    }
    setIsLoading(true);
    props.getSuggestRelation(idControl, fieldBelong, textValue, startRecord, limit > 0 ? limit : LIMIT_RECORD, listIdChoice, relationFieldId)
  }

  const defaultFiledMapping = {
    '4': {
      'address': 'addressName'
    }
  }

  const mapFieldName = (field) => {
    return _.get(defaultFiledMapping, `${fieldBelong}.${field.fieldName}`) || field.fieldName;
  }

  const getValueFieldFromRecord = (field, record) => {
    let value = null;
    if (_.isNil(field)) {
      return value;
    }
    const fName = mapFieldName(field);
    if (field.isDefault) {
      for (const p in record) {
        if (Object.prototype.hasOwnProperty.call(record, p) && StringUtils.equalPropertyName(p, fName)) {
          value = getDisplayTextFromValue(getValueProp(record, p), field.fieldType)
        }
      }
    } else {
      for (const prop in record) {
        if (Object.prototype.hasOwnProperty.call(record, prop)) {
          let extensionData = {}
          try {
            if (record[prop] && record[prop].length > 0 && _.isString(record[prop])) {
              extensionData = JSON.parse(record[prop]);
            } else {
              extensionData = record[prop];
            }
          } catch {
            extensionData = {}
          }
          if (_.isArray(extensionData)) {
            extensionData.forEach((e, idx) => {
              if (StringUtils.equalPropertyName(_.get(e, 'key'), field.fieldName)) {
                value = getDisplayTextFromValue(_.get(e, 'value'), field.fieldType)
              }
            });
          } else {
            for (const p in extensionData) {
              if (Object.prototype.hasOwnProperty.call(extensionData, p) && StringUtils.equalPropertyName(p, field.fieldName)) {
                value = getDisplayTextFromValue(getValueProp(extensionData, p), field.fieldType)
              }
            }
          }
        }
      }
    }
    if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.CHECKBOX ||
      _.toString(field.fieldType) === DEFINE_FIELD_TYPE.RADIOBOX ||
      _.toString(field.fieldType) === DEFINE_FIELD_TYPE.SINGER_SELECTBOX ||
      _.toString(field.fieldType) === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
      const idx = props.customFieldInfo.findIndex(e => StringUtils.equalPropertyName(e.fieldName, field.fieldName));
      if (idx >= 0) {
        const fieldItems = props.customFieldInfo[idx].fieldItems;
        if (fieldItems.length > 0 && _.isArray(fieldItems)) {
          const itemIds = [];
          try {
            if (_.isString(value)) {
              value = JSON.parse(value);
            }
          } catch {
            console.log(value);
          }
          if (_.isArray(value)) {
            itemIds.push(...value)
          } else {
            itemIds.push(value);
          }
          const tmp = fieldItems.filter(e => itemIds.findIndex(item => _.toString(e.itemId) === _.toString(item)) >= 0)
          value = tmp.map(e => getFieldLabel(e, 'itemLabel')).join(',');
        }
      }
    } else if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
      const orgData = jsonParse(value, []);
      if (orgData && orgData.length > 0) {
        return <FieldDetailViewSelectOrg
          fieldInfo={field}
          controlType={ControlType.DETAIL_EDIT}
          ogranizationValues={value}
          recordId={record.recordId}
        />
      } else {
        return getAlternativeValue(field.fieldName)
      }
    }

    if (_.isNil(value) || ((_.isString(value) || _.isArray(value))
      && _.isEmpty(value)) || _.toString(value).length < 1) {
      return getAlternativeValue(field.fieldName)
    } else {
      return value;
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    initilize();
    return () => {
      props.reset(`${props.belong}_${fieldInfo.fieldId}`);
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, [])

  useEffect(() => {
    if (props.customFieldInfo && props.customFieldInfo.length > 0 && fieldIdSearch > 0) {
      const field = _.find(props.customFieldInfo, { fieldId: fieldIdSearch })
      if (!_.isNil(field)) {
        setFieldSearch(field);
      }
    }
  }, [props.customFieldInfo, fieldIdSearch])

  useEffect(() => {
    if (props.suggestData && props.suggestData.records) {
      if (offset === 0) {
        setListSuggest(props.suggestData.records)
      } else {
        listSuggest.push(...props.suggestData.records)
        setListSuggest(_.cloneDeep(listSuggest))
      }
    }
    setIsLoading(false);
  }, [props.suggestData])

  useEffect(() => {
    if (_.isEqual(props.action, DynamicFieldAction.Error)) {
      setIsLoading(false);
    }
  }, [props.action])

  useEffect(() => {
    if (props.recordData) {
      const records = props.recordData;
      if (records && records.length > 0) {
        records.forEach(e => {
          if (editRecords.findIndex(record => record.recordId === e.recordId) < 0) {
            editRecords.push(e);
          }
        })
        setEditRecords(_.cloneDeep(editRecords));
      }
    }
  }, [props.recordData])

  // useEffect(() => {
  //   setOffset(listSuggest.length);
  // }, [listSuggest])

  const getValueUpdateSate = (records) => {
    const ids = [];
    if (records && records.length > 0) {
      records.forEach(record => {
        if (!_.isNil(record['recordId'])) {
          ids.push(+record['recordId']);
        }
      })
    }
    return ids;
  }

  useEffect(() => {
    if (props.updateStateElement) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      props.updateStateElement(keyObject, fieldInfo.fieldType, getValueUpdateSate(editRecords));
    }
  }, [editRecords])

  useEffect(() => {
    if (textValue.trim().length === 0) {
      setListSuggest([]);
      setOffset(0)
    } else {
      if (oldTextSearch !== textValue) {
        setOffset(0)
        requestSuggestData(0)
      }
    }
    setOldTextSearch(textValue)
  }, [debouncedTextValue])

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTextValue(value);
  }

  const onFocusTextBox = (e) => {
    setShowSuggest(true);
    if (textValue.trim().length > 0) {
      const limit = oldLimit < 1 ? LIMIT_RECORD : oldLimit;
      requestSuggestData(offset, limit)
    }
  }

  // const onUnFocusTextBox = (e) => {
  //   // setOldLimit(listSuggest.length)
  //   // setListSuggest([]);
  // }

  const onKeyDownTextBox = (e) => {
    if (e.key === "Tab") {
      setOldLimit(listSuggest.length)
      setListSuggest([]);
      setShowSuggest(false);
      if (!e.shiftKey) {
        e.target.blur();
      }
    }
  }

  const onSelectEditRecord = (record) => {
    const idx = _.findIndex(editRecords, { recordId: record.recordId })
    if (idx >= 0) {
      return;
    }
    if (formatResult === 1) {
      setEditRecords([record]);
    } else if (formatResult === 2) {
      editRecords.push(record);
      setEditRecords(_.cloneDeep(editRecords));
    }
    setOldLimit(listSuggest.length);
    setListSuggest([]);
    setTextValue('');
    setShowSuggest(false);
  }

  const onSelectedRecords = (records: any[]) => {
    if (!records || records.length < 1) {
      return;
    }
    if (formatResult === 1) {
      setEditRecords([records[0]]);
    } else if (formatResult === 2) {
      records.forEach(e => {
        const idx = _.findIndex(editRecords, { recordId: e.recordId })
        if (idx < 0) {
          editRecords.push(e);
        }
      })
      setEditRecords(_.cloneDeep(editRecords));
    }
    setShowSuggest(false);
  }

  const onDeletedEditRecord = (record) => {
    const idx = _.findIndex(editRecords, { recordId: record.recordId })
    if (idx >= 0) {
      editRecords.splice(idx, 1);
      setEditRecords(_.cloneDeep(editRecords));
    }
  }

  const hasMoreSuggest = () => {
    if (!props.suggestData) {
      return false;
    }
    if (!_.isNil(props.suggestData.totalRecord)) {
      if (props.suggestData.totalRecord === 0 || offset >= props.suggestData.totalRecord) {
        return false;
      }
    }
    if (!props.suggestData.records || props.suggestData.records.length === 0) {
      return false;
    }
    if (props.suggestData.records && props.suggestData.records.length % LIMIT_RECORD !== 0) {
      return false;
    }
    return true;
  }

  const loadMoreSuggest = (newOffSet) => {
    const limit = oldLimit < 1 ? LIMIT_RECORD : oldLimit;
    requestSuggestData(newOffSet, limit)
  }

  const onScrollSuggest = (ev) => {
    if (ev.target.scrollHeight - ev.target.scrollTop === ev.target.clientHeight) {
      setOffset(listSuggest.length);
      if (hasMoreSuggest()) {
        loadMoreSuggest(listSuggest.length);
      }
    }
  }

  const getObjActivity = (record, noDisplayMessages?: boolean) => {
    const contactDate = dateFnsFormat(getFieldValueAlter(record, 'contactDate', noDisplayMessages), CommonUtil.getUseFormatDate());
    const activityDuration = `(${getFieldValueAlter(record, 'activityDuration', noDisplayMessages)}${translate('activity.modal.minute')})`;
    const employeePhoto = _.get(record, "employee.employeePhoto.fileUrl");
    // if (_.isNil(employeePhoto)) {
    //   employeePhoto = _.get(record, "employee.employeePhoto.fileUrl");
    // }
    let employeeFullName = getFieldValueAlter(record, "employee.employeeSurname", noDisplayMessages);
    if (_.get(record, "employee.employeeName")) {
      employeeFullName += ' ' + getFieldValueAlter(record, "employee.employeeName", noDisplayMessages);
    }
    const customerName = getFieldValueAlter(record, 'customer.customerName', noDisplayMessages);
    const productTradings = _.get(record, 'productTradings');
    let productName = '';
    if (_.isArray(productTradings) && productTradings.length > 0) {
      productName += productTradings.map(e => e.productName).join(translate('commonCharacter.comma'));
    }
    if (!productName || _.isEmpty(productName)) {
      if (noDisplayMessages) {
        productName = "";
      } else {
        productName = getAlternativeValue('product_trading_id');
      }
    } else {
      productName = "/" + productName;
    }
    return {
      contactDate,
      activityDuration,
      employeePhoto,
      employeeFullName,
      customerName,
      productName
    }
  }

  const getAddressCustomer = (record) => {
    const postMark = translate('dynamic-control.fieldDetail.layoutAddress.lable.postMark');
    const whenErr = record.customerAddress ? postMark + record.customerAddress : '';
    const display = jsonParse(record.customerAddress, {address: whenErr})['address'];
    return display;
  }

  const getProductCategory = (record) => {
    let productCat = "";
    if (_.has(record, 'productCategories') || _.isArray(_.get(record, 'productCategories'))) {
      const tmp = [];
      _.toArray(_.get(record, 'productCategories')).forEach(e => {
        tmp.push(getFieldLabel(e, 'productCategoryName'))
      })
      productCat = tmp.join('-');
    }
    if (_.isNull(productCat)) {
      productCat = getFieldLabel(record, 'productCategoryName');
    }
    return productCat;
  }

  const renderItemSuggest = (key, record) => {
    if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
      let empIcon = _.get(record, "employeeIcon.fileUrl")
      if (_.isNil(empIcon)) {
        empIcon = _.get(record, "employeeIcon.filePath")
      }
      const employeeDepartments = _.get(record, "employeeDepartments")
      let positions = "";
      let departments = "";
      if (employeeDepartments && employeeDepartments.length > 0) {
        positions = getFieldValueAlter(employeeDepartments.map(function (ep) { return StringUtils.getFieldLabel(ep, "positionName"); }).join(" "), "employeePositions", true);
        departments = getFieldValueAlter(employeeDepartments[0].departmentName, 'employeeDepartments', true);
      }
      let fullName = getFieldValueAlter(record, "employeeSurname", true);
      if (getFieldValueAlter(record, "employeeName", true)) {
        fullName += ' ' + getFieldValueAlter(record, "employeeName", true);
      }
      if (positions) {
        fullName += ' ' + positions;
      }
      return (
        <>
          <div className={`item2 ${empIcon ? '' : 'mr-4'}`}>
            <div className={`name ${empIcon ? '' : 'green'}`}>
              {empIcon ?
                <img src={empIcon} alt={getAlternativeValue("employeeIcon")} /> :
                firstChar(getFieldValueAlter(record, "employeeSurname", true))
              }
            </div>
          </div>
          <div className="overflow-hidden w100">
            <div className="text text1 font-size-12">{departments}</div>
            <div className="text text3 text-ellipsis w100 line-height-normal">{fullName}</div>
          </div>
        </>
      )
    }
    if (fieldBelong === FIELD_BELONG.PRODUCT) {
      const prodImg = getValueProp(record, 'productImagePath');
      return (
        <>
          <div className="mr-4">
            {<img style={{ minWidth: 120, maxHeight: 70, objectFit: 'contain' }} src={prodImg || defaultImg} alt={getAlternativeValue("productImageName")} />}
          </div>
          <div className="overflow-hidden w100">
            <div className="text text1 font-size-12 text-ellipsis w100">{getProductCategory(record)}</div>
            <div className="text text3 text-ellipsis w100">{getFieldValueAlter(record, 'productName', true)}</div>
            <div className="text text3">{getFieldValueAlter(record, 'unitPrice', true)}</div>
            <div className="text3 text-ellipsis w100">{getFieldValueAlter(record, 'memo', true)}</div>
          </div>
        </>
      )
    }
    if (fieldBelong === FIELD_BELONG.TASK) {
      let finishDate = _.get(record, 'finishDate');
      const status = _.get(record, 'status');
      if (!finishDate) {
        finishDate = getFieldValueAlter(record, 'finishDate', true)
      } else {
        finishDate = formatDate(finishDate);
      }
      const date = new Date(finishDate).getTime();
      const now = new Date().getTime();
      let finishType = 0;
      if (status === 3) {
        finishType = 1;
      } else if (date < now) {
        finishType = -1
      }
      const tmp = [];
      if (_.get(record, 'customer.parentCustomerName')) {
        tmp.push(_.get(record, 'customer.parentCustomerName'));
      }
      tmp.push(getFieldValueAlter(record, 'customer.customerName', true));
      let displayCustomerName = tmp.join('－');
      const productTradings = _.get(record, 'productTradings');
      if (productTradings && productTradings.length > 0) {
        displayCustomerName += translate('commonCharacter.splash')
          + productTradings.map(e => e.productTradingName).join(translate('commonCharacter.comma'));
      }
      let displayEmployeeName = '';
      const operators = _.get(record, 'operators');
      if (operators && operators.length > 0) {
        displayEmployeeName = operators.map(e => {
          let fullName = e.employeeSurname;
          if (e.employeeName) {
            fullName += ` ${e.employeeName}`
          }
          return fullName;
        }).join(', ');
      }
      return (
        <>
          <div className="overflow-hidden w100">
            <div className="text text1 font-size-12 text-ellipsis">
              {getFieldValueAlter(record, "milestone.milestoneName", true)} {displayCustomerName ? "(" + displayCustomerName + ")" : ''}
            </div>
            {finishType === 0 && <div className="text text2 text-ellipsis w100">{getFieldValueAlter(record, 'taskName', true)} {finishDate ? "(" + finishDate + ")" : ''}</div>}
            {finishType === 1 && <div className="text text2 text-ellipsis w100"><del>{getFieldValueAlter(record, 'taskName', true)} {finishDate ? "(" + finishDate + ")" : ''}</del></div>}
            {finishType === -1 && <div className="text text2 color-red text-ellipsis w100">{getFieldValueAlter(record, 'taskName', true)} {finishDate ? "(" + finishDate + ")" : ''}</div>}
            <div className="text text3 font-size-12 text-ellipsis w100 line-height-normal">{displayEmployeeName}</div>
          </div>
        </>
      )
    }
    if (fieldBelong === FIELD_BELONG.CUSTOMER) {
      return (
        <>
          <div className="overflow-hidden w100">
            <div className="text text1 font-size-12 text-ellipsis">
              <div className="text text2 text-ellipsis w100">{getFieldValueAlter(record, 'parentCustomerName', true)}</div>
              <div className="text text2 text-ellipsis w100">{getFieldValueAlter(record, 'customerName', true)}</div>
              <div className="text text2 text-ellipsis w100">{getAddressCustomer(record)}</div>
            </div>
          </div>
        </>
      )
    }
    if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
      return (
        <>
          <div className="overflow-hidden w100">
            <div className="text3 text-ellipsis mh-auto mb-0 w100">{getFieldValueAlter(record, 'customerName', true)} {getFieldValueAlter(record, 'departmentName', true)}</div>
            <div className="text3 text-ellipsis mh-auto mb-0 w100">{getFieldValueAlter(record, 'businessCardName', true)} {getFieldValueAlter(record, 'position', true)}</div>
          </div>
        </>
      )
    }
    if (fieldBelong === FIELD_BELONG.ACTIVITY) {
      const actyvity = getObjActivity(record, true);
      return (
        <>
          <div>{actyvity.contactDate} {actyvity.activityDuration}</div>
          <div className="item2 py-1">
            <div className={`item2 ${actyvity.employeePhoto ? '' : 'mr-4'}`}>
              <div className={`name ${actyvity.employeePhoto ? '' : 'green'}`}>
                {actyvity.employeePhoto ?
                  <img src={actyvity.employeePhoto} alt={getAlternativeValue("employeeIcon")} /> : firstChar(actyvity.employeeFullName)
                }
              </div>
            </div>
            <span className="text-ellipsis w100">{actyvity.employeeFullName}</span>
          </div>
          <div className="text-ellipsis w100">{actyvity.customerName}{actyvity.productName}</div>
        </>
      )
    }
  }

  useEffect(() => {
    if (props.isFocus && textboxRef && textboxRef.current) {
      textboxRef.current.focus();
    }
  }, [props.isFocus])

  const renderEditRecord = (key, record, field) => {
    if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
      let empIcon = _.get(record, "employeeIcon.fileUrl")
      if (_.isNil(empIcon)) {
        empIcon = _.get(record, "employeeIcon.filePath")
      }
      const employeeDepartments = _.get(record, "employeeDepartments")
      let positions = "";
      let departments = "";
      if (employeeDepartments && employeeDepartments.length > 0) {
        positions = getFieldValueAlter(employeeDepartments.map(function (ep) { return StringUtils.getFieldLabel(ep, "positionName"); }).join(" "), "employeePositions");
        departments = getFieldValueAlter(employeeDepartments[0].departmentName, "employeeDepartments");
      }
      return (
        <div className="drop-down height-auto position-relative">
          <ul className="dropdown-item mb-0">
            <li className="item smooth d-flex">
              <div className={`item2 ${empIcon ? '' : 'mr-4'}`}>
                <div className={`name ${empIcon ? '' : 'green'}`}>
                  {empIcon ?
                    <img src={empIcon} alt={getAlternativeValue("employeeIcon")} /> :
                    firstChar(getFieldValueAlter(record, "employeeSurname"))
                  }
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="text text1 font-size-12">{departments}</div>
                <div className="text text3 text-ellipsis">{getFieldValueAlter(record, "employeeName")} {positions}</div>
                <button type="button" className="close" onClick={() => onDeletedEditRecord(record)}>×</button>
              </div>
            </li>
          </ul>
        </div>
      )
    }
    if (fieldBelong === FIELD_BELONG.PRODUCT) {
      const imageProduct = getValueProp(record, 'productImagePath') ? getValueProp(record, 'productImagePath') : defaultImg;
      return (
        <div className="drop-down height-auto position-relative">
          <ul className="dropdown-item mb-0">
            <li className="item smooth d-flex">
              <div className="mr-4 avatar">
                <img className="rounded-0" style={{ minWidth: 120, maxHeight: 70, objectFit: "contain" }} src={imageProduct} />
              </div>
              <div className="overflow-hidden">
                <div className="text text1 font-size-12 mh-auto mb-0 line-height-normal">{getProductCategory(record)}</div>
                <div className="text text3 mh-auto mb-0 line-height-normal">{getFieldValueAlter(record, 'productName', true)}</div>
                <div className="text text3 mh-auto mb-0 line-height-normal">{getFieldValueAlter(record, 'unitPrice', true)}</div>
                <div className="text3 text-ellipsis mh-auto mb-0">{getFieldValueAlter(record, 'memo', true)}</div>
                <button type="button" className="close" onClick={() => onDeletedEditRecord(record)}>×</button>
              </div>
            </li>
          </ul>
        </div>
      )
    }
    if (fieldBelong === FIELD_BELONG.TASK) {
      let finishDate = _.get(record, 'finishDate');
      if (!finishDate) {
        finishDate = getFieldValueAlter(record, 'finishDate')
      } else {
        finishDate = dateFnsFormat(finishDate, userFormatDate);
      }
      let milestoneName;
      if (_.get(record, 'milestone.milestoneName')) {
        milestoneName = _.get(record, 'milestone.milestoneName')
      } else if (_.get(record, 'milestoneName')) {
        milestoneName = _.get(record, 'milestoneName')
      }
      if (!milestoneName) {
        milestoneName = getAlternativeValue("milestoneName");
      }
      let displayCustomerName
      let customer
      if (record['customers']) {
        customer = record['customers']
      } else if (record['customer']) {
        customer = record['customer']
      }
      if (customer) {
        if (_.isArray(customer)) {
          const customerName = [];
          customer.forEach(e => {
            const tmp = [];
            if (getValueProp(e, 'customerName')) {
              tmp.push(getValueProp(e, 'customerName'));
            }
            if (_.get(e, 'parentCustomerName')) {
              tmp.push(_.get(e, 'parentCustomerName'));
            }
            if (tmp.length > 0) {
              customerName.push(tmp.join('－'));
            }
          })
          if (customerName.length > 0) {
            displayCustomerName = customerName.join(',');
          }
        } else {
          const tmp = [];
          if (getValueProp(customer, 'customerName')) {
            tmp.push(getValueProp(customer, 'customerName'));
          }
          if (_.get(customer, 'parentCustomerName')) {
            tmp.push(_.get(customer, 'parentCustomerName'));
          }
          if (tmp.length > 0) {
            displayCustomerName = tmp.join('－');
          }
        }
      }
      if (!displayCustomerName) {
        displayCustomerName = getAlternativeValue("customerName");
      }
      return (
        <div className="drop-down height-auto position-relative">
          <ul className="dropdown-item mb-0">
            <li className="item smooth">
              <div className="text text1 font-size-12 text-ellipsis">
                {milestoneName} ({displayCustomerName})
              </div>
              <div className="text text2">{getFieldValueAlter(record, 'taskName', true)} ({finishDate})</div>
              <div className="text text3 font-size-12"></div>
              <button type="button" className="close" onClick={() => onDeletedEditRecord(record)}>×</button>
            </li>
          </ul>
        </div>
      )
    }
    if (fieldBelong === FIELD_BELONG.CUSTOMER) {
      return <>
        <div className="drop-down height-auto position-relative">
          <ul className="dropdown-item mb-0">
            <li className="item smooth">
              {
                record.parentCustomerName && <div className="text text2 text-ellipsis w100">{getFieldValueAlter(record, 'parentCustomerName')}</div>
              }
              <div className="text text2 text-ellipsis w100">{getFieldValueAlter(record, 'customerName', true)}</div>
              <div className="text text2 text-ellipsis w100">{getAddressCustomer(record)}</div>
              <button type="button" className="close" onClick={() => onDeletedEditRecord(record)}>×</button>
            </li>
          </ul>
        </div>
      </>
    }
    if (fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
      return <>
        <div className="drop-down height-auto position-relative">
          <ul className="dropdown-item mb-0">
            <li className="item smooth">
              <div className="text text2 text-ellipsis w100">{getFieldValueAlter(record, 'customerName', true)}{getFieldValueAlter(record, 'departmentName', true)}</div>
              <div className="text text2 text-ellipsis w100">{getFieldValueAlter(record, 'businessCardName', true)}{getFieldValueAlter(record, 'position', true)}</div>
              <button type="button" className="close" onClick={() => onDeletedEditRecord(record)}>×</button>
            </li>
          </ul>
        </div>
      </>
    }
    if (fieldBelong === FIELD_BELONG.ACTIVITY) {
      const actyvity = getObjActivity(record);
      return (
        <div className="drop-down height-auto position-relative">
          <ul className="dropdown-item mb-0">
            <li className="item smooth">
              <div>{actyvity.contactDate} {actyvity.activityDuration}</div>
              <div className="item2 py-1">
                <div className={`item2 ${actyvity.employeePhoto ? '' : 'mr-4'}`}>
                  <div className={`name ${actyvity.employeePhoto ? '' : 'green'}`}>
                    {actyvity.employeePhoto ?
                      <img src={actyvity.employeePhoto} alt={getAlternativeValue("employeeIcon")} /> : firstChar(actyvity.employeeFullName)
                    }
                  </div>
                </div>
                <span className="text-ellipsis w100">{actyvity.employeeFullName}</span>
              </div>
              <div className="text-ellipsis w100">{actyvity.customerName ? (actyvity.customerName + '/') : ''} {actyvity.productName}</div>
              <button type="button" className="close" onClick={() => onDeletedEditRecord(record)}>×</button>
            </li>
          </ul>
        </div>
      )
    }
  }

  const css = getSuggestCss(fieldInfo.fieldType, {
    fieldBelong,
    formatResult,
    errorInfo: props.errorInfo,
    isDisabled: props.isDisabled,
    selected: editRecords.length > 0
  });
  const renderSuggest = () => {
    return (
      <div className={css.wrapSuggest} style={{ zIndex: 99, left: '0px' }} onScroll={onScrollSuggest} ref={suggestRef}>
        <ul className={css.ulSuggest}>
          {listSuggest.map((e, idx) =>
            <li key={idx}
              className={`${css.liSuggest} ${editRecords.findIndex(o => o.recordId === e.recordId) >= 0 ? 'active' : ''}`}
              onClick={() => onSelectEditRecord(e)}
            >
              <>{renderItemSuggest(idx, e)}</>
            </li>
          )}
          <IconLoading isLoading={isLoading} />
        </ul>
        <SearchAddSuggest
          ref={suggestBottomRef}
          id={idControl}
          fieldBelong={fieldBelong}
          modeSelect={formatResult === 1 ? TagAutoCompleteMode.Single : TagAutoCompleteMode.Multi}
          onUnfocus={() => { setListSuggest([]); setShowSuggest(false) }}
          onSelectRecords={onSelectedRecords}
        />
      </div>
    )
  }

  const renderResultMulti = () => {
    if (showSuggest || listSuggest.length > 0 || editRecords.length < 1) {
      return <></>
    }
    const listRecordLeft = editRecords.slice(0, Math.round(editRecords.length / 2));
    const listRecordRight = editRecords.slice(Math.round(editRecords.length / 2));

    return (
      <div className="break-row">
        <div className="col-lg-6 p-0 chose-many">
          {listRecordLeft.map((e, idx) => { return renderEditRecord(idx, e, fieldSearch) })}
        </div>
        <div className="col-lg-6 p-0 chose-many">
          {listRecordRight.map((e, idx) => { return renderEditRecord(idx, e, fieldSearch) })}
        </div>
      </div>
    )
  }

  const renderInputComponent = () => {
    const format = fieldInfo.relationData.format;
    return (<>
      <input type="text"
        ref={textboxRef}
        className={css.input}
        placeholder={editRecords.length > 0 && formatResult === 1 ? '' : getPlaceHolder(fieldInfo, format)}
        id={props.fieldInfo.fieldId}
        value={textValue}
        onChange={onTextChange}
        onFocus={onFocusTextBox}
        // onBlur={onUnFocusTextBox}
        onKeyDown={onKeyDownTextBox}
        disabled={props.isDisabled}
        autoComplete="off"
      />
      <span className={css.icDelete}></span>
    </>)
  }

  const renderComponentEdit = () => {
    let msg = null;
    if (props.errorInfo) {
      if (props.errorInfo.errorCode) {
        msg = translate(`messages.${props.errorInfo.errorCode}`, props.errorInfo.errorParams);
      } else if (props.errorInfo.errorMsg) {
        msg = props.errorInfo.errorMsg;
      }
    }
    if (formatResult === 1) {
      return (
        <>
          <div className={css.wrapInput}>
            {editRecords && editRecords.length > 0 && <div className={SUGGESTION_CSS.WRAP_TAG}>
              <div className={SUGGESTION_CSS.TAG}>{getValueFieldFromRecord(fieldSearch, editRecords[0])}
                <button onClick={() => onDeletedEditRecord(editRecords[0])} type="button" className="close">×</button>
              </div>
            </div>
            }
            {renderInputComponent()}
            {showSuggest && renderSuggest()}
          </div>
          {msg && <span className="messenger-error d-block">{msg}</span>}
        </>
      )
    } else if (formatResult === 2) {
      return (<>
        <div className={css.wrapInput}>
          {renderInputComponent()}
          {showSuggest && renderSuggest()}
        </div>
        {msg && <span className="messenger-error d-block">{msg}</span>}
        {renderResultMulti()}
      </>)
    }
    return <></>;
  }

  const renderComponentEditList = () => {
    if (props.fieldInfo && props.fieldInfo.relationData && props.fieldInfo.relationData.fieldBelong && props.elementStatus) {
      const fBelong = props.fieldInfo.relationData.fieldBelong
      const ids = parseRelationIds(props.elementStatus.fieldValue)
      return (
        <>{ids.map(id =>
          <Link key={id} to={getLinkListModule(fBelong)} ><span>{id}</span></Link>
        )}</>
      )
    }
    return <></>;
  }

  const renderComponent = () => {
    if (type === ControlType.EDIT || type === ControlType.ADD) {
      return renderComponentEdit();
    } else if (type === ControlType.EDIT_LIST) {
      return renderComponentEditList();
    }
    return <></>;
  }

  return renderComponent();
});


const mapStateToProps = ({ dynamicField }: IRootState, ownProps: IFieldEditRelationOwnProps) => {
  const id = `${ownProps.belong}_${ownProps.fieldInfo.fieldId}`
  if (!dynamicField || !dynamicField.data.has(id)) {
    return {
      action: null,
      errorMessage: null,
      fieldInfoSelect: null,
      // fieldInfoService: null,
      customFieldInfo: null,
      suggestData: null,
      recordData: null
    };
  }
  return {
    action: dynamicField.data.get(id).action,
    errorMessage: dynamicField.data.get(id).errorMessage,
    fieldInfoSelect: dynamicField.data.get(id).fieldInfo,
    customFieldInfo: dynamicField.data.get(id).customFieldInfo,
    // fieldInfoService: dynamicField.data.get(id).fieldInfoService,
    suggestData: dynamicField.data.get(id).suggestRelation,
    recordData: dynamicField.data.get(id).recordData,
  }
}

const mapDispatchToProps = {
  getServicesInfo,
  getFieldsInfo,
  getCustomFieldInfo,
  // getFieldsInfoService,
  getSuggestRelation,
  getServiceRecordByIds,
  reset,
};

const options = { forwardRef: true };

export default connect<IFieldEditRelationStateProps, IFieldEditRelationDispatchProps, IFieldEditRelationOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(FieldEditRelation);

