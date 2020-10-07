import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react'
import _ from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE, DynamicControlAction, FIELD_MAXLENGTH, RELATION_LOOKUP_AVAILABLE_FLAG, FIELD_NAME } from '../../constants';
import { Storage, translate } from 'react-jhipster';
import { FIELD_BELONG, LINK_TARGET_IFRAME, AVAILABLE_FLAG } from 'app/config/constants';
import FieldDetailEditSelect from './field-detail-edit-select';
import FieldDetailEditNumeric from './field-detail-edit-numeric';
import FieldDetailEditDatetime from './field-detail-edit-datetime';
import FieldDetailEditText from './field-detail-edit-text';
import FieldDetailEditLink from './field-detail-edit-link';
import FieldDetailEditAddress from './field-detail-edit-address';
import FieldDetailEditCalculation from './field-detail-edit-calculation';
import FieldDetailEditRelation from './field-detail-edit-relation';
import FieldDetailEditLookup from './field-detail-edit-lookup';
import FieldDetailEditHeading from './field-detail-edit-heading';
import FieldDetailEditSelectOrg from './field-detail-edit-select-org';
import { languageCode } from 'app/config/language-code';
import { Options, connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import {
  getActivityFormats,
  getProductTypes,
  getServicesInfo,
  getFieldsInfo,
  getFieldsInfoService,
  reset,
  DynamicFieldAction,
} from 'app/shared/reducers/dynamic-field.reducer';
import { useId } from 'react-id-generator';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { isCanSettingField, FIELD_OPTION } from 'app/shared/util/option-manager';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import StringUtils, { isUrlify, getFieldLabel, toKatakana, jsonParse } from 'app/shared/util/string-utils'

interface IDynamicFieldDispatchProps {
  getServicesInfo,
  getFieldsInfo,
  getFieldsInfoService,
  getActivityFormats,
  getProductTypes,
  reset,
}

interface IDynamicFieldStateProps {
  action: DynamicFieldAction;
  errorMessage: string;
  fieldInfoSelect: any[];
  fieldInfoService: any[];
  serviceInfo: any[];
  productTypes: any;
  activities: any;
}

type IFieldDetailEditBoxProps = IDynamicFieldDispatchProps & IDynamicFieldStateProps & IDynamicFieldProps

const FieldDetailEditBox: React.FC<IFieldDetailEditBoxProps> = forwardRef((props, ref) => {
  const [editFieldInfo, setEditFieldInfo] = useState(null);
  const [serviceSelectId, setServiceSelectId] = useState(0);
  const [showSelectService, setShowSelectService] = useState(false);
  const [, setShowFieldSelectId] = useState(false);

  const [fieldLabels, setFieldLabels] = useState([]);
  const [modifyFlag, setModifyFlag] = useState(0);
  const [modifyFlagReq, setModifyFlagReq] = useState(0);
  const [availableFlag, setAvailableFlag] = useState(3);
  const [searchMethodFlag, setSearchMethodFlag] = useState(1);
  const [availableDeviceWeb, setAvailableDeviceWeb] = useState(false);
  const [availableDeviceApp, setAvailableDeviceApp] = useState(false);
  const [listActiveProduct, setListActiveProduct] = useState([]);
  const [listSelectActiveProduct, setListSelectActiveProduct] = useState([]);
  const [isFirst, setIsFirst] = useState(true);
  const [invalidate, setInvalidate] = useState(null);
  const [selectColorFoward, setSelectColorFoward] = useState({});
  const [selectColorBack, setSelectColorBack] = useState({});
  const fieldDetailRef = useRef(null)
  const ddSelectService = useRef(null)
  const ddFieldInfoId = useRef(null)
  const idAutomatic = useId(25, "field_detail_edit_id_");
  const nameAutomatic = useId(25, "field_detail_edit_name_");
  const [messagesErrorCommon, setMessagesErrorCommon] = useState([])
  const wrapperRefForward = useRef(null);
  const wrapperRefBackward = useRef(null);

  const idSearchMethodAutomatic = useId(25, "field_detail_search_method_id_");
  const nameSearchMethodAutomatic = useId(25, "field_detail_search_method_name_");

  const fieldInfo = props.fieldInfo;
  const fieldType = props.fieldInfo.fieldType ? props.fieldInfo.fieldType.toString() : DEFINE_FIELD_TYPE.TEXT
  const fieldName = fieldInfo.isDefault ? fieldInfo.fieldName : fieldInfo.fieldType;


  const SEARCH_METHOD_EDITABLE = 1;
  const SEARCH_METHOD_REFERENCES = 2;
  const SEARCH_METHOD_IMPOSSIBLE = 3;

  const MODIFY_FLAG_REQUIRED_NOT_CHANGE = 3;
  const LINK_FIXED = 2;
  
  const ADD_LANGUAGE = 'add'
  const REMOVE_LANGUAGE = 'remove'


  const [differenceSetting, setDifferenceSetting] = useState(fieldInfo.differenceSetting ? _.cloneDeep(fieldInfo.differenceSetting) : {
    forwardColor: 'color-3',
    forwardText : '',
    backwardColor : 'color-7',
    backwardText: '',
    isDisplay: false,
  })
  const [showSelectBoxColor, setShowSelectBoxColor] = useState(differenceSetting ? differenceSetting.isDisplay : false)
  const [showTipSelectColor, setShowTipSelectColor] = useState({
    forward: false,
    back: false
  })

  useImperativeHandle(ref, () => ({

  }));

  const lang = Storage.session.get('locale', 'ja_jp');

  const getDefaultFieldLabel = (objFieldLabel: any) => {
    const labels = []
    if (!_.isNil(objFieldLabel)) {
      for (const prop in objFieldLabel) {
        if (Object.prototype.hasOwnProperty.call(objFieldLabel, prop)) {
          const el = {}
          el['code'] = prop
          el['value'] = objFieldLabel[prop];
          el['default'] = true;
          const idx = languageCode.findIndex(e => e.code === prop);
          if (idx >= 0) {
            el['name'] = languageCode[idx].name;
          }
          labels.push(el);
        }
      }
    }
    if (labels.length < 1) {
      let name = "";
      const idx = languageCode.findIndex(e => e.code === lang);
      if (idx >= 0) {
        name = languageCode[idx].name;
      }
      labels.push({ code: lang, name, default: true, value: '' })
    }
    languageCode.forEach((e, i) => {
      const idx = labels.findIndex(o => o.code === e.code);
      if (idx < 0) {
        labels.push({ code: e.code, name: e.name, default: false, value: '' })
      }
    });
    
    const nativeIdx = labels.findIndex(e => e.code === lang);
    if (nativeIdx >= 0) {
      const nativeLabel = labels.splice(nativeIdx, 1)[0];
      labels.splice(0, 0, nativeLabel);
    }
    const priorityLangs = ['ja_jp', 'en_us', 'zh_cn']
    const labelsTmp = []
    labelsTmp[0] = labels[0]
    priorityLangs.forEach((item1) => {
      labels.forEach((item2, idx) => {
        if (item1 === item2['code'] && item1 !== lang) {
          labelsTmp.push(labels[idx]) 
        }
      })
    })
    return labelsTmp
  }

  const initilize = () => {
    const id = `${props.belong}_${fieldType}`;
    if (fieldType === DEFINE_FIELD_TYPE.CALCULATION ||
      fieldType === DEFINE_FIELD_TYPE.LOOKUP ||
      fieldType === DEFINE_FIELD_TYPE.RELATION) {
      props.getServicesInfo(id, props.serviceType);
      if (fieldType === DEFINE_FIELD_TYPE.LOOKUP && props.fieldInfo.lookupData) {
        if (props.fieldInfo.lookupData && props.fieldInfo.lookupData["fieldBelong"]) {
          setServiceSelectId(+props.fieldInfo.lookupData["fieldBelong"]);
        }
      }
      if (fieldType === DEFINE_FIELD_TYPE.RELATION && props.fieldInfo.relationData) {
        if (props.fieldInfo.relationData && props.fieldInfo.relationData["fieldBelong"]) {
          setServiceSelectId(+props.fieldInfo.relationData["fieldBelong"]);
        }
      }
    }
    if ((props.belong === FIELD_BELONG.PRODUCT_TRADING || (props.fieldInfo && props.fieldInfo.fieldBelong === FIELD_BELONG.PRODUCT_TRADING)) && differenceSetting) {
      let objForwardText = {};
      let objBackwardText = {};
      if (differenceSetting.forwardText) {
        if (_.isString(differenceSetting.forwardText)) {
          objForwardText = JSON.parse(differenceSetting.forwardText)
        } else {
          objForwardText = differenceSetting.forwardText
        }
      }
      if (differenceSetting.backwardText) {
        if (_.isString(differenceSetting.backwardText)) {
          objBackwardText = JSON.parse(differenceSetting.backwardText)
        } else {
          objBackwardText = differenceSetting.backwardText
        }
      }
      selectColorFoward["forwardColor"] = differenceSetting.forwardColor;
      selectColorFoward["forwardText"] = getDefaultFieldLabel(objForwardText);
      // setSelectColorFoward(_.cloneDeep(selectColorFoward))
      selectColorBack["backwardColor"] = differenceSetting.backwardColor;
      selectColorBack["backwardText"] = getDefaultFieldLabel(objBackwardText);
      // setSelectColorFoward(_.cloneDeep(selectColorBack))
    }
    if (props.belong === FIELD_BELONG.ACTIVITY) {
      props.getActivityFormats(id, fieldInfo.fieldId)
    }
    if (props.belong === FIELD_BELONG.PRODUCT) {
      props.getProductTypes(id, fieldInfo.fieldId)
    }
    props.getFieldsInfo(id, props.belong, null, null)
    // get field label code
    let objFieldLabel = {};
    if (props.fieldInfo.fieldLabel) {
      const fieldInfoTmp = _.cloneDeep(props.fieldInfo);
      if (typeof fieldInfoTmp.fieldLabel === 'string' || fieldInfoTmp.fieldLabel instanceof String) {
        objFieldLabel = JSON.parse(fieldInfoTmp.fieldLabel)
      } else {
        objFieldLabel = fieldInfoTmp.fieldLabel
      }
    }
    setFieldLabels(getDefaultFieldLabel(objFieldLabel))
    if (fieldInfo.modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE) {
      setSearchMethodFlag(SEARCH_METHOD_EDITABLE);
    } else if (fieldInfo.modifyFlag === 0 && fieldInfo.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE) {
      setSearchMethodFlag(SEARCH_METHOD_REFERENCES);
    } else if (fieldInfo.availableFlag === AVAILABLE_FLAG.UNAVAILABLE) {
      setSearchMethodFlag(SEARCH_METHOD_IMPOSSIBLE);
    } else {
      setSearchMethodFlag(SEARCH_METHOD_EDITABLE);
    }
    setModifyFlag(fieldInfo.modifyFlag === null ? 1 : fieldInfo.modifyFlag)
    setModifyFlagReq(fieldInfo.modifyFlag === null ? 1 : fieldInfo.modifyFlag)
    let available = fieldInfo.availableFlag;
    if (fieldInfo.availableFlag === null || fieldInfo.availableFlag === undefined) {
      available = 3;
    }
    setAvailableFlag(available)
    setAvailableDeviceWeb(available === 3)
    setAvailableDeviceApp(available === 3)
    setIsFirst(false)
  }

  const getMaxlengthError = (fName) => {
    const maxLength = FIELD_MAXLENGTH[fName];
    if (editFieldInfo[fName] && editFieldInfo[fName].length > maxLength) {
      return translate("messages.ERR_COM_0025", [maxLength]);
    }
    return null;
  }

  const checkMaxlength = (tmp, isValidate) => {
    const checks = ['defaultValue', 'currencyUnit', 'urlTarget', 'urlText', 'configValue'];
    checks.forEach(check => {
      const maxLengthErr = getMaxlengthError(check);
      if (maxLengthErr) {
        isValidate = false;
        tmp[check] = _.cloneDeep(maxLengthErr);
      }
    })
    return isValidate;
  }

  const FieldHasDifferenceSetting = fieldType === DEFINE_FIELD_TYPE.SINGER_SELECTBOX 
  || fieldType === DEFINE_FIELD_TYPE.NUMERIC || fieldType === DEFINE_FIELD_TYPE.DATE
  || fieldType === DEFINE_FIELD_TYPE.DATE_TIME || fieldType === DEFINE_FIELD_TYPE.TIME
  || fieldType ===  DEFINE_FIELD_TYPE.RADIOBOX
  || fieldName === FIELD_NAME.PRODUCT_TRADING_PROGRESS_ID
  const getParamsInput = () => {
    const params = {}
    if (_.isNil(editFieldInfo)) {
      return params
    }
    let userModifyFlg = false
    params['fieldId'] = editFieldInfo.fieldId
    params['fieldName'] = editFieldInfo.fieldName
    params['fieldType'] = editFieldInfo.fieldType
    if (!_.isEqual(props.fieldInfo.fieldItems, editFieldInfo.fieldItems)) {
      userModifyFlg = true
    }
    params['fieldItems'] = editFieldInfo.fieldItems
    if (!_.isEqual(props.fieldInfo.fieldLabel, editFieldInfo.fieldLabel)) {
      userModifyFlg = true
    }
    params['fieldLabel'] = editFieldInfo.fieldLabel
    if (!_.isEqual(props.fieldInfo.modifyFlag, editFieldInfo.modifyFlag)) {
      userModifyFlg = true
    }
    params['modifyFlag'] = editFieldInfo.modifyFlag
    if (!_.isEqual(props.fieldInfo.availableFlag, editFieldInfo.availableFlag)) {
      userModifyFlg = true
    }
    params['availableFlag'] = editFieldInfo.availableFlag
    if (!_.isEqual(props.fieldInfo.defaultValue, editFieldInfo.defaultValue)) {
      userModifyFlg = true
    }
    params['defaultValue'] = editFieldInfo.defaultValue
    if (!_.isEqual(props.fieldInfo.currencyUnit, editFieldInfo.currencyUnit)) {
      userModifyFlg = true
    }
    params['currencyUnit'] = editFieldInfo.currencyUnit
    if (!_.isEqual(props.fieldInfo.typeUnit, editFieldInfo.typeUnit)) {
      userModifyFlg = true
    }
    params['typeUnit'] = editFieldInfo.typeUnit
    if (!_.isEqual(props.fieldInfo.urlType, editFieldInfo.urlType)) {
      userModifyFlg = true
    }
    params['decimalPlace'] = editFieldInfo.decimalPlace
    if (!_.isEqual(props.fieldInfo.decimalPlace, editFieldInfo.decimalPlace)) {
      userModifyFlg = true
    }
    params['urlType'] = editFieldInfo.urlType
    if (!_.isEqual(props.fieldInfo.urlTarget, editFieldInfo.urlTarget)) {
      userModifyFlg = true
    }
    params['urlTarget'] = editFieldInfo.urlTarget
    if (!_.isEqual(props.fieldInfo.urlText, editFieldInfo.urlText)) {
      userModifyFlg = true
    }
    params['urlText'] = editFieldInfo.urlText
    if (!_.isEqual(props.fieldInfo.linkTarget, editFieldInfo.linkTarget)) {
      userModifyFlg = true
    }
    params['linkTarget'] = editFieldInfo.linkTarget
    if (!_.isEqual(props.fieldInfo.iframeHeight, editFieldInfo.iframeHeight)) {
      userModifyFlg = true
    }
    params['iframeHeight'] = editFieldInfo.iframeHeight
    if (!_.isEqual(props.fieldInfo.configValue, editFieldInfo.configValue)) {
      userModifyFlg = true
    }
    params['configValue'] = editFieldInfo.configValue
    if (!_.isEqual(props.fieldInfo.isLinkedGoogleMap, editFieldInfo.isLinkedGoogleMap)) {
      userModifyFlg = true
    }
    params['isLinkedGoogleMap'] = editFieldInfo.isLinkedGoogleMap
    if (props.belong === FIELD_BELONG.ACTIVITY || props.belong === FIELD_BELONG.PRODUCT) {
      const salesProcess = []
      if ((props.belong === FIELD_BELONG.ACTIVITY) && props.activities) {
        if (props.activities.activityFormatsByFieldId) {
          salesProcess.push(...props.activities.activityFormatsByFieldId.map(e => e.activityFormatId))
        }
      }
      if (props.belong === FIELD_BELONG.PRODUCT && props.productTypes) {
        if (props.productTypes.productTypesByFieldId) {
          salesProcess.push(...props.productTypes.productTypesByFieldId.map(e => e.productTypeId))
        }
      }
      if (!_.isEqual(salesProcess, editFieldInfo.salesProcess)) {
        userModifyFlg = true;
      }
      params['salesProcess'] = editFieldInfo.salesProcess;
    }
    if (fieldType === DEFINE_FIELD_TYPE.LOOKUP) {
      const editFieldTmp = _.cloneDeep(editFieldInfo)
      if (_.get(editFieldTmp, 'lookupData.itemReflect')) {
        editFieldTmp.lookupData.itemReflect.map((item) => {
          delete item.fieldType
        })
      }
      const fieldTmp = _.cloneDeep(props.fieldInfo)
      if (_.get(fieldTmp, 'lookupData.itemReflect')) {
        fieldTmp.lookupData.itemReflect.map((item) => {
          item.fieldLabel = jsonParse(item.fieldLabel)
        })
      }
      if (!_.isEqual(fieldTmp.lookupData, editFieldTmp.lookupData)) {
        userModifyFlg = true;
      }
      params['lookupData'] = editFieldInfo.lookupData;
    }
    else if (fieldType === DEFINE_FIELD_TYPE.RELATION) {
      params['relationField'] = editFieldInfo.relationField;
      if (editFieldInfo.relationField && editFieldInfo.relationField.userModifyFlg) {
        userModifyFlg = true;
      }
      params['relationData'] = editFieldInfo.relationData;
      // const fieldRelationDataTmp = _.cloneDeep(props.fieldInfo.relationData)
      if (props.fieldInfo.relationData && editFieldInfo.relationData) {
        Object.keys(props.fieldInfo.relationData).forEach((item1) => {
          Object.keys(editFieldInfo.relationData).forEach((item2) => {
            if (item1 === item2 && !_.isEqual(props.fieldInfo.relationData[item1], editFieldInfo.relationData[item2])) {
              userModifyFlg = true;
            }
          })
        })
      }
      // if (!_.isEqual(fieldRelationDataTmp, editFieldInfo.relationData)) {
      //   userModifyFlg = true;
      // }
    }
    else if (fieldType === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
      params['selectOrganizationData'] = editFieldInfo.selectOrganizationData;
      if (!_.isEqual(props.fieldInfo.selectOrganizationData, editFieldInfo.selectOrganizationData)) {
        userModifyFlg = true;
      }
    }
    else if (FieldHasDifferenceSetting) {
      params['differenceSetting'] = editFieldInfo.differenceSetting;
      if (!_.isEqual(props.fieldInfo.differenceSetting, editFieldInfo.differenceSetting)) {
        userModifyFlg = true;
      }
    }
    params['userModifyFlg'] = userModifyFlg;
    return params
  }

  /**
   * Check duplicate fieldLabel language to language with other field
   * @param fieldsInput
   * @param fieldLabelToCompare
   */
  const parseAllFieldLabel = (fieldsInput, fieldLabelToCompare, idCompare) => {
    const fieldLabelError = [];
    const fieldLanguageError = [];
    const indexError = [];
    const arrAllFieldLabel = [];
    fieldsInput.listField && fieldsInput.listField.length > 0 && fieldsInput.listField.forEach(elementField => {
      arrAllFieldLabel.push(_.isString(elementField.fieldLabel) ? (jsonParse(elementField.fieldLabel)) : elementField.fieldLabel);
    })
    const languageOfField = Object.keys(fieldLabelToCompare);
    for (let i = 0; i < arrAllFieldLabel.length; i++) {
      languageOfField.forEach((e, index) => {
        if (arrAllFieldLabel[i][e] === fieldLabelToCompare[e] && idCompare !== fieldsInput.listField[i].fieldId && !_.isEmpty(fieldLabelToCompare[e])) {
          fieldLabelError.push(fieldLabelToCompare[e]);
          fieldLanguageError.push(e);
          indexError.push(index);
        }
      })
    }
    return { fieldLabelError, fieldLanguageError, indexError }
  }

  const isFieldRelationDisplay = (field) => {
    if (field.fieldType.toString() !== DEFINE_FIELD_TYPE.RELATION) {
      return false;
    }
    if (!_.isNil(field.relationData) && field.relationData.asSelf === 1) {
      return false
    }
    return true;
  }

  const validateRelationLookup = (isValidate, errors) => {
    if (fieldType === DEFINE_FIELD_TYPE.RELATION || fieldType === DEFINE_FIELD_TYPE.LOOKUP) {
      if (serviceSelectId <= 0) {
        isValidate = false;
        errors['serviceSelect'] = translate("messages.ERR_COM_0014")
      }
      if (fieldDetailRef && fieldDetailRef.current && fieldDetailRef.current.validate) {
        const listErrors = fieldDetailRef.current.validate();
        if (listErrors && listErrors.length > 0) {
          isValidate = false;
        }
      }
    }
    return isValidate;
  }

  const validateCommons = (isValidate) => {
    const listMessages = [];
    if (!isValidate) {
      setMessagesErrorCommon(listMessages);
      return isValidate;
    }
    if (fieldType === DEFINE_FIELD_TYPE.RELATION && editFieldInfo.fieldId < 0) {
      const targetBelong = editFieldInfo.relationData.fieldBelong
      if (props.belong === targetBelong) {
        const selfNumber = props.listFieldInfo.filter(e => isFieldRelationDisplay(e) && _.get(e, 'relationData.fieldBelong') === props.belong).length;
        if (selfNumber >= 10) {
          listMessages.push(translate("messages.ERR_COM_0075"));
        }
      } else {
        const selfNumber = props.listFieldInfo.filter(e => isFieldRelationDisplay(e) && e.fieldBelong === props.belong && _.get(e, 'relationData.fieldBelong') === targetBelong).length;
        const otherNumber = props.fieldInfoService.filter(e => isFieldRelationDisplay(e) && e.fieldBelong === targetBelong && _.get(e, 'relationData.fieldBelong') === props.belong).length;
        if (selfNumber >= 10 || otherNumber >= 10) {
          listMessages.push(translate("messages.ERR_COM_0075"));
        }
      }
    }
    setMessagesErrorCommon(listMessages);
    if (listMessages.length > 0) {
      isValidate = false;
    }
    return isValidate;
  }

  /**
   * Validate Show label
   */
  const validateShowLabel = () => {
    let isValidateShowLabel = true;
    const tmpValidateShowLabel = {};
    let isValidateLabel = true;
    if (fieldType === DEFINE_FIELD_TYPE.TITLE || fieldType === DEFINE_FIELD_TYPE.TAB || fieldType === DEFINE_FIELD_TYPE.OTHER) {
      isValidateLabel = false;
      for (const label in editFieldInfo.fieldLabel) {
        if (Object.prototype.hasOwnProperty.call(editFieldInfo.fieldLabel, label)) {
          if (_.get(editFieldInfo.fieldLabel, label)) {
            isValidateLabel = true;
            break
          }
        }
      }
      for (const label in editFieldInfo.fieldLabel) {
        if (!Object.prototype.hasOwnProperty.call(editFieldInfo.fieldLabel, label)) {
          continue;
        }
        const itemLabel = editFieldInfo.fieldLabel[label];
        if (itemLabel && itemLabel.length > FIELD_MAXLENGTH.fieldLabel) {
          isValidateShowLabel = false;
          const maxLength = FIELD_MAXLENGTH.fieldLabel;
          tmpValidateShowLabel[`fieldLabel[${label}]`] = translate("messages.ERR_COM_0025", [maxLength]);
        }
      }
    } else {
      if (fieldLabels.filter(e => e.default).length < 1) {
        isValidateLabel = false;
      } else {
        isValidateLabel = fieldLabels.filter(e => e.default && !_.isEmpty(e.value)).length > 0
      }
    }
    if (!isValidateLabel) {
      isValidateShowLabel = false;
      tmpValidateShowLabel['fieldLabel'] = translate("messages.ERR_COM_0013")
    }
    return { isValidateShowLabel, tmpValidateShowLabel }
  }

  /**
   * Get error required
   */
  const getRequiredError = (fName) => {
    if (!editFieldInfo[fName] || _.isEmpty(editFieldInfo[fName].toString())) {
      return translate("messages.ERR_COM_0013");
    }
  }

  /**
   * Validate required
   */
  const validateRequired = (tmp, isValidate) => {
    let requiredErr = '';
    if (editFieldInfo['linkTarget'] === LINK_TARGET_IFRAME) {
      requiredErr = getRequiredError('iframeHeight');
      if (requiredErr) {
        isValidate = false;
        tmp[`iframeHeight`] = _.cloneDeep(requiredErr);
      }
    }
    if (editFieldInfo.selectOrganizationData && !_.isNil(editFieldInfo.selectOrganizationData.target) && editFieldInfo.selectOrganizationData.target === '000') {
      isValidate = false;
      tmp['target'] = translate("messages.ERR_COM_0014");
    }
    return isValidate;
  }

  /**
   * Validate Select
   */
  const checkIsSelect = (isValidate) => {
      if (fieldDetailRef && fieldDetailRef.current && fieldDetailRef.current.validate) {
        const listErrors = fieldDetailRef.current.validate();
        if (listErrors && listErrors.length > 0) {
          isValidate = false;
        }
      }
    
    return isValidate;
  }

  const isValidateInput = () => {
    const isShowLabel = (fieldType === DEFINE_FIELD_TYPE.LOOKUP && serviceSelectId > 0) ||
      (fieldType === DEFINE_FIELD_TYPE.RELATION && serviceSelectId > 0) ||
      (fieldType !== DEFINE_FIELD_TYPE.LOOKUP && fieldType !== DEFINE_FIELD_TYPE.RELATION)
    const isSelect = (fieldType === DEFINE_FIELD_TYPE.CHECKBOX || fieldType === DEFINE_FIELD_TYPE.RADIOBOX ||
      fieldType === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || fieldType === DEFINE_FIELD_TYPE.MULTI_SELECTBOX)
    let tmp = {}
    let isValidate = true;
    const isCalculation = (fieldType === DEFINE_FIELD_TYPE.CALCULATION);
    const isLink = (fieldType === DEFINE_FIELD_TYPE.LINK);
    const isDate = (fieldType === DEFINE_FIELD_TYPE.DATE || fieldType === DEFINE_FIELD_TYPE.DATE_TIME);
    const validateDefaultValue = ((fieldType === DEFINE_FIELD_TYPE.NUMERIC
      || fieldType === DEFINE_FIELD_TYPE.TEXT
      || fieldType === DEFINE_FIELD_TYPE.TEXTAREA) && !props.fieldInfo.isDefault)
    if (isShowLabel) {
      isValidate = validateShowLabel().isValidateShowLabel;
      tmp = validateShowLabel().tmpValidateShowLabel;
    }
    if (isCalculation) {
      if (_.isNil(editFieldInfo.configValue) || editFieldInfo.configValue === "") {
        isValidate = false;
        tmp['configValue'] = translate("messages.ERR_COM_0013")
      }
    }
    if (isLink) {
      if (editFieldInfo.urlType === 1) {
        if (_.isNil(editFieldInfo.defaultValue) || editFieldInfo.defaultValue === "") {
          isValidate = false;
          tmp['defaultValue'] = translate("messages.ERR_COM_0013")
        } else {
          if (!isUrlify(editFieldInfo.defaultValue.toLowerCase())) {
            isValidate = false;
            tmp['defaultValue'] = translate("messages.ERR_COM_0055")
          }
        }
      }
      if (editFieldInfo.urlType === 2) {
        if (_.isNil(editFieldInfo.urlTarget) || editFieldInfo.urlTarget === "") {
          isValidate = false;
          tmp['urlTarget'] = translate("messages.ERR_COM_0013")
        } else {
          if (!isUrlify(editFieldInfo.urlTarget.toLowerCase())) {
            isValidate = false;
            tmp['urlTarget'] = translate("messages.ERR_COM_0055")
          }
        }
      }
      if ((_.isNil(editFieldInfo.urlText) || editFieldInfo.urlText === "") && editFieldInfo.urlType === LINK_FIXED) {
        isValidate = false;
        tmp['urlText'] = translate("messages.ERR_COM_0013")
      }
    }
    if ((_.isNil(editFieldInfo.defaultValue) || editFieldInfo.defaultValue === "") && validateDefaultValue) {
      isValidate = false;
      tmp['defaultValue'] = translate("messages.ERR_COM_0013")
    }
    if(isDate && isValidate){
      isValidate = fieldDetailRef.current.validate();
    }
    // check maxlength here
    fieldLabels.forEach((label, idx) => {
      if (label && label.value.length > FIELD_MAXLENGTH.fieldLabel) {
        const maxLength = FIELD_MAXLENGTH.fieldLabel;
        isValidate = false;
        tmp[`fieldLabels[${idx}]`] = translate("messages.ERR_COM_0025", [maxLength]);
      }
    })
    if (isSelect) {
      isValidate = checkIsSelect(isValidate);
    }
    isValidate = checkMaxlength(tmp, isValidate);
    isValidate = validateRelationLookup(isValidate, tmp);
    isValidate = validateRequired(tmp, isValidate);
    // Check duplicate itemlabel
    const labelErrorCompare = parseAllFieldLabel(props.getFieldsCallBack, editFieldInfo.fieldLabel, editFieldInfo.fieldId).fieldLabelError;
    const indexError = parseAllFieldLabel(props.getFieldsCallBack, editFieldInfo.fieldLabel, editFieldInfo.fieldId).indexError;
    const languageErr = parseAllFieldLabel(props.getFieldsCallBack, editFieldInfo.fieldLabel, editFieldInfo.fieldId).fieldLanguageError;

    if (indexError.length > 0) {
      isValidate = false;
      for (let k = 0; k < indexError.length; k++) {
        const languageName = languageCode.find(item => item.code === languageErr[k]).name;
        tmp[`fieldLabels[${indexError[k]}]`] = StringUtils.translateSpecial("messages.ERR_COM_0065", { 0: labelErrorCompare[k], 1: languageName });
      }
    }
    setInvalidate(tmp);
    isValidate = validateCommons(isValidate);
    return isValidate
  }

  const getErrorInfo = () => {
    const errors = []
    if (invalidate) {
      for (const prop in invalidate) {
        if (Object.prototype.hasOwnProperty.call(invalidate, prop)) {
          errors.push({ item: prop, errorMsg: invalidate[prop] })
        }
      }
    }
    return errors;
  }

  const handleUserMouseDown = (event) => {
    if (ddSelectService.current && !ddSelectService.current.contains(event.target)) {
      setShowSelectService(false);
    }
    if (ddFieldInfoId.current && !ddFieldInfoId.current.contains(event.target)) {
      setShowFieldSelectId(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    setEditFieldInfo(props.fieldInfo)
    initilize();
    return () => {
      props.reset(`${props.belong}_${fieldType}`);
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, [])

  useEffect(() => {
    const id = `${props.belong}_${fieldType}`;
    if (fieldType === DEFINE_FIELD_TYPE.LOOKUP || fieldType === DEFINE_FIELD_TYPE.RELATION) {
      if (serviceSelectId > 0) {
        props.getFieldsInfoService(id, serviceSelectId, null, null)
      }
      if (editFieldInfo) {
        if (fieldType === DEFINE_FIELD_TYPE.LOOKUP) {
          let lookupData = {}
          if (editFieldInfo['lookupData']) {
            lookupData = editFieldInfo['lookupData']
          }
          lookupData['fieldBelong'] = serviceSelectId
          editFieldInfo['lookupData'] = serviceSelectId > 0 ? lookupData : null;
        } else if (fieldType === DEFINE_FIELD_TYPE.RELATION) {
          let relationData = {}
          if (editFieldInfo['relationData']) {
            relationData = editFieldInfo['relationData']
          }
          relationData['fieldBelong'] = serviceSelectId
          editFieldInfo['relationData'] = serviceSelectId > 0 ? relationData : null;
        }
      }
    }
  }, [serviceSelectId])

  useEffect(() => {
    if (isFirst) {
      return;
    }
    if (availableDeviceApp || availableDeviceWeb) {
      setAvailableFlag(AVAILABLE_FLAG.WEB_APP_AVAILABLE);
    } else if (!availableDeviceApp && !availableDeviceWeb) {
      setAvailableFlag(AVAILABLE_FLAG.UNAVAILABLE);
    }
  }, [availableDeviceApp, availableDeviceWeb])

  useEffect(() => {
    if (!editFieldInfo || editFieldInfo === undefined) {
      return;
    }
    const fieldLabel = {}
    fieldLabels.forEach((e, i) => {
      if (e.default) {
        fieldLabel[e.code] = e.value;
      }
    });
    editFieldInfo['fieldLabel'] = fieldLabel;
    editFieldInfo['modifyFlag'] = modifyFlag;
    editFieldInfo['availableFlag'] = availableFlag;

    setEditFieldInfo(_.cloneDeep(editFieldInfo));
  }, [fieldLabels, modifyFlag, availableFlag]);

  useEffect(() => {
    if (!editFieldInfo || editFieldInfo === undefined) {
      return;
    }
    const textForward = {}
    const textBackward = {}
    if (selectColorFoward['forwardText']) {
      selectColorFoward['forwardText'].forEach((e, i) => {
        if (e.default) {
          textForward[e.code] = e.value;
        }
      });
    }
    if (selectColorBack['backwardText']) {
      selectColorBack['backwardText'].forEach((e, i) => {
        if (e.default) {
          textBackward[e.code] = e.value;
        }
      });
    }
    differenceSetting.forwardColor = selectColorFoward ? selectColorFoward['forwardColor'] : '';
    differenceSetting.forwardText = textForward;
    differenceSetting.backwardColor = selectColorBack ? selectColorBack['backwardColor'] : '';
    differenceSetting.backwardText = textBackward;
    differenceSetting.isDisplay = showSelectBoxColor;
    editFieldInfo['differenceSetting'] = differenceSetting;
    setDifferenceSetting(_.cloneDeep(differenceSetting));
    setEditFieldInfo(_.cloneDeep(editFieldInfo));
  }, [selectColorFoward, selectColorBack, showSelectBoxColor])

  useEffect(() => {
    if ((props.belong === FIELD_BELONG.ACTIVITY) && props.activities) {
      if (props.activities.activityFormats) {
        const tmp = props.activities.activityFormats.filter(e => e.isAvailable).map(e => ({ id: e.activityFormatId, name: e.name, order: e.displayOrder }))
        tmp.sort((a, b) => { return a.order - b.order });
        setListActiveProduct(tmp);
      }
      if (props.activities.activityFormatsByFieldId) {
        setListSelectActiveProduct(props.activities.activityFormatsByFieldId.map(e => ({ id: e.activityFormatId, name: e.name })))
      }
    }
    if (props.belong === FIELD_BELONG.PRODUCT && props.productTypes) {
      if (props.productTypes.productTypes) {
        const tmp = props.productTypes.productTypes.filter(e => e.isAvailable).map(e => ({ id: e.productTypeId, name: e.productTypeName, order: e.displayOrder }))
        tmp.sort((a, b) => { return a.order - b.order });
        setListActiveProduct(tmp);
      }
      if (props.productTypes.productTypesByFieldId) {
        setListSelectActiveProduct(props.productTypes.productTypesByFieldId.map(e => ({ id: e.productTypeId, name: e.productTypeName })))
      }
    }
  }, [props.activities, props.productTypes])

  useEffect(() => {
    if (props.updateStateElement) {
      if (props.belong === FIELD_BELONG.ACTIVITY || props.belong === FIELD_BELONG.PRODUCT) {
        if (!_.isNil(editFieldInfo)) {
          editFieldInfo['salesProcess'] = listSelectActiveProduct.map(e => e.id);
          setEditFieldInfo(_.cloneDeep(editFieldInfo));
        }
      }
    }
  }, [listSelectActiveProduct]);

  useEffect(() => {
    if (props.updateStateElement) {
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, getParamsInput());
    }
  }, [editFieldInfo]);

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const params = getParamsInput();
    const isChange = params && params['userModifyFlg'];
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  }

  const updateStateElement = (keyElement, type, objEditValue) => {
    if (props.updateStateElement) {
      const tmp = _.assign({}, editFieldInfo, objEditValue);
      setEditFieldInfo(_.cloneDeep(tmp));
    }
  }

  const onCancelUpdateField = () => {
    executeDirtyCheck(() => {
      if (props.onExecuteAction) {
        props.onExecuteAction(props.fieldInfo, DynamicControlAction.CANCEL);
      }
    });
  }

  const onSaveUpdateField = () => {
    if (props.onExecuteAction) {
      const isValidate = isValidateInput();
      if (!isValidate) {
        return;
      }
      props.onExecuteAction(props.fieldInfo, DynamicControlAction.SAVE, getParamsInput());
    }
  }

  const TYPE_ADD_LANGUAGE = {
    FIELD_LABEL: 'labelRenderTop',
    FORWARD_TEXT: 'forwardText',
    BACKWARD_TEXT: 'backwardText'
  }

  const onAddLanguage = (type) => {
    switch (type) {
      case TYPE_ADD_LANGUAGE.FIELD_LABEL:
        fieldLabels.forEach(e => {
          e.default = true;
        });
        setFieldLabels(_.cloneDeep(fieldLabels));
        break;
      case TYPE_ADD_LANGUAGE.FORWARD_TEXT:
        selectColorFoward[TYPE_ADD_LANGUAGE.FORWARD_TEXT].forEach(e => {
          e.default = true;
        });
        setSelectColorFoward(_.cloneDeep(selectColorFoward))
        break;
      case TYPE_ADD_LANGUAGE.BACKWARD_TEXT:
        selectColorBack[TYPE_ADD_LANGUAGE.BACKWARD_TEXT].forEach(e => {
          e.default = true;
        });
        setSelectColorBack(_.cloneDeep(selectColorBack));
        break;
      default:
        break;
    }

  }

  const onRemoveLanguage = (type) => {
    switch (type) {
      case TYPE_ADD_LANGUAGE.FIELD_LABEL:
        fieldLabels.forEach(e => {
          if (e.code !== lang) {
            e.default = false;
            // e.value = '';
          }
        });
        setFieldLabels(_.cloneDeep(fieldLabels));
        break;
      case TYPE_ADD_LANGUAGE.FORWARD_TEXT:
        selectColorFoward[TYPE_ADD_LANGUAGE.FORWARD_TEXT].forEach(o => {
          if (o.code !== lang) {
            o.default = false;
          }
        });
        setSelectColorFoward(_.cloneDeep(selectColorFoward))
        break;
      case TYPE_ADD_LANGUAGE.BACKWARD_TEXT:
        selectColorBack[TYPE_ADD_LANGUAGE.BACKWARD_TEXT].forEach(a => {
          if (a.code !== lang) {
            a.default = false;
          }
        });
        setSelectColorBack(_.cloneDeep(selectColorBack));
        break;
      default:
        break;
    }
  }

  const onChangeLanguage = (ev, idx, type) => {
    switch (type) {
      case TYPE_ADD_LANGUAGE.FIELD_LABEL:
        if (ev.target.value.length <= FIELD_MAXLENGTH.fieldLabel) {
        fieldLabels[idx].value = ev.target.value;
        setFieldLabels(_.cloneDeep(fieldLabels));
        }
        break;
      case TYPE_ADD_LANGUAGE.FORWARD_TEXT:
        selectColorFoward[TYPE_ADD_LANGUAGE.FORWARD_TEXT][idx].value = ev.target.value;
        setSelectColorFoward(_.cloneDeep(selectColorFoward))
        break;
      case TYPE_ADD_LANGUAGE.BACKWARD_TEXT:
        selectColorBack[TYPE_ADD_LANGUAGE.BACKWARD_TEXT][idx].value = ev.target.value;
        setSelectColorBack(_.cloneDeep(selectColorBack));
        break;
      default:
        break;
    }
  }

  const onChangeModifyFlag = (ev) => {
    if (ev.target.checked) {
      if (searchMethodFlag === SEARCH_METHOD_EDITABLE) {
        setModifyFlagReq(+ev.target.value);
        setModifyFlag(+ev.target.value);
      }
    }
  }

  const onChangeSearchMethod = (ev) => {
    if (ev.target.checked) {
      if (+ev.target.value === SEARCH_METHOD_IMPOSSIBLE) {
        setAvailableFlag(AVAILABLE_FLAG.UNAVAILABLE);
      } else {
        setAvailableFlag(AVAILABLE_FLAG.WEB_APP_AVAILABLE);
      }
      if (+ev.target.value === SEARCH_METHOD_REFERENCES) {
        setModifyFlagReq(0);
        setModifyFlag(0);
      } else if (+ev.target.value === SEARCH_METHOD_IMPOSSIBLE) {
        setModifyFlagReq(modifyFlagReq);
        setModifyFlag(modifyFlag);
      } else {
        setModifyFlagReq(modifyFlagReq === 0 ? 1 : modifyFlagReq);
        setModifyFlag(modifyFlag === 0 ? 1 : modifyFlag);
      }
    }
    setSearchMethodFlag(+ev.target.value);
  }

  const onSelectActiveProduct = (event, id: number, type: number) => {
    const { checked } = event.target
    if (id > 0) {
      const idx = listSelectActiveProduct.findIndex(e => e.id === id);
      if (checked && idx < 0) {
        listSelectActiveProduct.push({ id })
      } else if (!checked && idx >= 0) {
        listSelectActiveProduct.splice(idx, 1);
      }
      setListSelectActiveProduct(_.cloneDeep(listSelectActiveProduct));
    } else {
      const tmp = [];
      if (type === 1) {
        tmp.push(...listActiveProduct.map(e => ({ id: e.id })))
      } else if (type === -1) {
        tmp.push(...listActiveProduct.filter(e => listSelectActiveProduct.findIndex(o => o.id === e.id) < 0))
      }
      setListSelectActiveProduct(tmp);
    }
  }

  /**
   * Render select service of lookup or relation. The remaining types do not show this.
   */
  const renderComponentSelectService = () => {
    if (fieldType !== DEFINE_FIELD_TYPE.LOOKUP && fieldType !== DEFINE_FIELD_TYPE.RELATION) {
      return <></>
    }
    let serviceName = translate("dynamic-control.fieldDetail.editLookup.defaultSelect");
    const services = [];
    if (props.serviceInfo && props.serviceInfo.length > 0) {
      if (_.toString(fieldType) === DEFINE_FIELD_TYPE.RELATION) {
        services.push(...props.serviceInfo.filter(e => e.relationAvailableFlag === RELATION_LOOKUP_AVAILABLE_FLAG.AVAILABLE));
      } else if (_.toString(fieldType) === DEFINE_FIELD_TYPE.LOOKUP) {
        services.push(...props.serviceInfo.filter(e => e.lookupAvailableFlag === RELATION_LOOKUP_AVAILABLE_FLAG.AVAILABLE && e.serviceId !== props.belong));
      } else {
        services.push(...props.serviceInfo.filter(e => e.serviceId !== props.belong));
      }
      const idx = props.serviceInfo.findIndex(e => e.serviceId === serviceSelectId);
      if (idx >= 0) {
        serviceName = getFieldLabel(props.serviceInfo[idx], 'serviceName');
      }
    }
    const styleClass = {};
    if (invalidate && _.get(invalidate, 'serviceSelect') && serviceSelectId <= 0) {
      styleClass['borderColor'] = '#fa5151'
      styleClass['backgroundColor'] = '#ffdedd'
    }

    return (
      <div className="form-group">
        <label>{_.toString(fieldType) === DEFINE_FIELD_TYPE.RELATION
          ? translate('dynamic-control.fieldDetail.editRelation.label')
          : translate('dynamic-control.fieldDetail.editRelation.initTitle')}
          <span className="ml-2 label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span>
          </label>
        <div className="select-option gray">
          <span className="select-text" style={styleClass}
            onClick={() => { if ((!props.fieldInfo.fieldId || props.fieldInfo.fieldId < 0) && serviceSelectId === 0) setShowSelectService(!showSelectService) }}
          >
            {serviceName}
          </span>
          {showSelectService &&
            <div ref={ddSelectService} className="drop-down drop-down2">
              <ul>
                {services.map((e, idx) =>
                  <li key={idx} className={`item ${serviceSelectId === e.serviceId ? 'active' : ''} smooth`}
                    onClick={() => { setServiceSelectId(e.serviceId); setShowSelectService(false) }}
                  >
                    <div className="text text2">{getFieldLabel(e, 'serviceName')}</div>
                  </li>
                )}
              </ul>
            </div>
          }
        </div>
        {serviceSelectId <= 0 && <span className="messenger-error">{_.get(invalidate, 'serviceSelect')}</span>}
      </div>);
  }

  const handleEnterKey = (event, mode, type) => {
    if (event.key === 'Enter') {
      if (mode === ADD_LANGUAGE) {
        onAddLanguage(type);
      } else if (mode === REMOVE_LANGUAGE) {
        onRemoveLanguage(type);
      }
    }
  }

  const convertToKatakana = (ev, idx, type) => {
    switch (type) {
      case TYPE_ADD_LANGUAGE.FIELD_LABEL:
        if (ev.target.value.length <= FIELD_MAXLENGTH.fieldLabel) {
        fieldLabels[idx].value = toKatakana(ev.target.value);
        setFieldLabels(_.cloneDeep(fieldLabels));
        }
        break;
      case TYPE_ADD_LANGUAGE.FORWARD_TEXT:
        selectColorFoward[TYPE_ADD_LANGUAGE.FORWARD_TEXT][idx].value = toKatakana(ev.target.value);
        setSelectColorFoward(_.cloneDeep(selectColorFoward))
        break;
      case TYPE_ADD_LANGUAGE.BACKWARD_TEXT:
        selectColorBack[TYPE_ADD_LANGUAGE.BACKWARD_TEXT][idx].value = toKatakana(ev.target.value);
        setSelectColorBack(_.cloneDeep(selectColorBack));
        break;
      default:
        break;
    }
  }

  const renderInputFieldLabel = () => {
    return (
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.common.label.itemName')}<span className="ml-2 label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span></label>
        {fieldLabels.map((e, idx) => {
          if (!e.default) {
            return <></>
          }
          const isError = (invalidate && _.get(invalidate, 'fieldLabel')) || _.get(invalidate, `fieldLabels[${idx}]`);
          return (
            <div className="layout-input-text" key={idx}>
              <div className={`input-common-wrap  ${isError ? 'error' : ''}`}>
                <input key={idx} className="input-normal" type="text"
                  placeholder={translate('dynamic-control.fieldDetail.common.placeholder.itemName')}
                  onChange={(ev) => onChangeLanguage(ev, idx, TYPE_ADD_LANGUAGE.FIELD_LABEL)}
                  value={e.value}
                  onBlur={(ev) => convertToKatakana(ev, idx, TYPE_ADD_LANGUAGE.FIELD_LABEL)}/>{`(${e.name})`}
              </div>
              {isError &&
                <span className="messenger-error">{_.get(invalidate, `fieldLabels[${idx}]`)}</span>
              }
            </div>
          )
        })}
        {invalidate && _.get(invalidate, 'fieldLabel') &&
          <span className="messenger-error">{_.get(invalidate, 'fieldLabel')}</span>
        }
        {fieldLabels.filter(o => o.default).length < fieldLabels.length ?
          <div><a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e, ADD_LANGUAGE, TYPE_ADD_LANGUAGE.FIELD_LABEL)} onClick={() => onAddLanguage(TYPE_ADD_LANGUAGE.FIELD_LABEL)} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.showOtherLanguage')}</a></div>
          : <div><a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e, REMOVE_LANGUAGE, TYPE_ADD_LANGUAGE.FIELD_LABEL)} onClick={() => onRemoveLanguage(TYPE_ADD_LANGUAGE.FIELD_LABEL)} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.hideOtherLanguage')}</a></div>
        }
      </div>
    )
  }


  /**
   * Render common top for setting of field items. 
   * Contain choose field name (and other language) and modify flag
   */
  const renderComponentTop = () => {
    if (fieldType === DEFINE_FIELD_TYPE.TAB ||
      fieldType === DEFINE_FIELD_TYPE.TITLE) {
      return (<>
        <div className="title">{translate(`dynamic-control.fieldTypeLabel.${fieldType}`)}{translate('dynamic-control.fieldDetail.common.label.titlePostfixTab')}</div>
      </>)
    }
    if (fieldType === DEFINE_FIELD_TYPE.OTHER) {
      return (<>
        <div className="title">{translate(`dynamic-control.fieldTypeLabel.${fieldType}`)}{translate('dynamic-control.fieldDetail.common.label.titlePostfix')}</div>
      </>)
    }
    const isShowCommonTop =
      ((fieldType === DEFINE_FIELD_TYPE.RELATION || fieldType === DEFINE_FIELD_TYPE.LOOKUP) && serviceSelectId > 0) ||
      (fieldType !== DEFINE_FIELD_TYPE.RELATION && fieldType !== DEFINE_FIELD_TYPE.LOOKUP)
    const isShowInputFieldLabel = fieldType === DEFINE_FIELD_TYPE.LOOKUP && serviceSelectId > 0

    const isCanSettingRequired = isCanSettingField(props.belong, fieldName, FIELD_OPTION.REQUIRED, fieldInfo.isDefault);
    const isDisabledRequired = searchMethodFlag === SEARCH_METHOD_REFERENCES || availableFlag === AVAILABLE_FLAG.UNAVAILABLE || modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE;
    const isCanSettingUseMethod = isCanSettingField(props.belong, fieldName, FIELD_OPTION.USE_METHOD, fieldInfo.isDefault);
    
    const isDisableRadio = !isCanSettingUseMethod || modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE;
    const isDisableModifyRadio = !isCanSettingRequired || isDisabledRequired;
    return (
      <>
        <div className="title">{translate(`dynamic-control.fieldTypeLabel.${fieldType}`)}{translate('dynamic-control.fieldDetail.common.label.titlePostfix')}</div>
        {messagesErrorCommon.length > 0 && <BoxMessage messageType={MessageType.Error} messages={messagesErrorCommon} />}
        {/*
          If field is Ralation. Show pulldown to select the service, then the rest.
          But field is Lookup. Show fill label name and other language of label name, then show pulldown to select the service, finally show the rest.
        */
        }
        {isShowInputFieldLabel && renderInputFieldLabel()}
        {fieldType === DEFINE_FIELD_TYPE.RELATION && renderComponentSelectService()}
        {fieldType === DEFINE_FIELD_TYPE.LOOKUP && renderComponentSelectService()}
        {isShowCommonTop &&
          <>
            {fieldType !== DEFINE_FIELD_TYPE.LOOKUP && renderInputFieldLabel()}
            {/*
              When field is Lookup. Render the item to select the modify flag after selecting the service.
              If field is CALCULATION, do not show this.
            */}
            {!(fieldType === DEFINE_FIELD_TYPE.CALCULATION ||
              (fieldType === DEFINE_FIELD_TYPE.LOOKUP && serviceSelectId <= 0) || (fieldType === DEFINE_FIELD_TYPE.RELATION && serviceSelectId <= 0)) &&
              <>
                <div className="form-group">
                  <label>{translate('dynamic-control.fieldDetail.common.label.searchMethod')}</label>
                  <div className="wrap-check-radio">
                    <p className={`radio-item ${isDisableRadio ? 'radio-item-disable' : ''} normal`}>
                      <input name={nameSearchMethodAutomatic[0]} id={idSearchMethodAutomatic[0]} type="radio"
                        value={1}
                        disabled={isDisableRadio}
                        checked={searchMethodFlag === SEARCH_METHOD_EDITABLE}
                        onChange={(ev) => onChangeSearchMethod(ev)} />
                      <label htmlFor={idSearchMethodAutomatic[0]}>{translate('dynamic-control.fieldDetail.common.label.searchMethod.referenceEditable')}</label>
                    </p>
                    <p className={`radio-item ${isDisableRadio ? 'radio-item-disable' : ''} normal`}>
                      <input name={nameSearchMethodAutomatic[0]} id={idSearchMethodAutomatic[1]} type="radio"
                        value={2}
                        disabled={isDisableRadio}
                        checked={searchMethodFlag === SEARCH_METHOD_REFERENCES}
                        onChange={(ev) => onChangeSearchMethod(ev)} />
                      <label htmlFor={idSearchMethodAutomatic[1]}>{translate('dynamic-control.fieldDetail.common.label.searchMethod.referenceYes')}</label>
                    </p>
                    <p className={`radio-item ${isDisableRadio ? 'radio-item-disable' : ''} normal`}>
                      <input name={nameSearchMethodAutomatic[0]} id={idSearchMethodAutomatic[2]} type="radio"
                        value={3}
                        disabled={isDisableRadio}
                        checked={searchMethodFlag === SEARCH_METHOD_IMPOSSIBLE}
                        onChange={(ev) => onChangeSearchMethod(ev)} />
                      <label htmlFor={idSearchMethodAutomatic[2]}>{translate('dynamic-control.fieldDetail.common.label.searchMethod.useImpossible')}</label>
                    </p>
                  </div>
                </div>
                <div className="form-group">
                  <label>{translate('dynamic-control.fieldDetail.common.label.modifyFlagRadio')}</label>
                  <div className="wrap-check-radio">
                    <p className={`radio-item ${isDisableModifyRadio ? 'radio-item-disable' : ''} normal`}>
                      <input name={nameAutomatic[0]} id={idAutomatic[0]} type="radio"
                        value={2}
                        disabled={isDisableModifyRadio}
                        checked={modifyFlagReq === 2 || modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE}
                        onChange={(ev) => onChangeModifyFlag(ev)} />
                      <label htmlFor={idAutomatic[0]}>{translate('dynamic-control.fieldDetail.common.label.modifyFlagRadio.required')}</label>
                    </p>
                    <p className={`radio-item ${isDisableModifyRadio ? 'radio-item-disable' : ''} normal`}>
                      <input name={nameAutomatic[0]} id={idAutomatic[1]} type="radio"
                        value={1}
                        disabled={isDisableModifyRadio}
                        checked={modifyFlagReq === 1}
                        onChange={(ev) => onChangeModifyFlag(ev)} />
                      <label htmlFor={idAutomatic[1]}>{translate('dynamic-control.fieldDetail.common.label.modifyFlagRadio.any')}</label>
                    </p>
                  </div>
                </div>
              </>}
          </>
        }
      </>
    )
  }

  const getTitleLableSelectColor = () => {
    if(fieldName === FIELD_NAME.PRODUCT_TRADING_PROGRESS_ID){
      return { up: translate('dynamic-control.select_color_label.singer_pulldown_up'), down: translate('dynamic-control.select_color_label.singer_pulldown_down'), noteUp: translate('dynamic-control.select_color_label.singer_pulldown_down_note_up'), noteDown: translate('dynamic-control.select_color_label.singer_pulldown_down_note_down') }
 
    }
    switch (fieldType) {
      case DEFINE_FIELD_TYPE.SINGER_SELECTBOX:
      case DEFINE_FIELD_TYPE.MULTI_SELECTBOX:
      case DEFINE_FIELD_TYPE.RADIOBOX:
      case DEFINE_FIELD_TYPE.CHECKBOX:
        return { up: translate('dynamic-control.select_color_label.singer_pulldown_up'), down: translate('dynamic-control.select_color_label.singer_pulldown_down'), noteUp: translate('dynamic-control.select_color_label.singer_pulldown_down_note_up'), noteDown: translate('dynamic-control.select_color_label.singer_pulldown_down_note_down') }
      case DEFINE_FIELD_TYPE.NUMERIC:
        return { up: translate('dynamic-control.select_color_label.nummeric_up'), down: translate('dynamic-control.select_color_label.nummeric_down'), noteUp: translate('dynamic-control.select_color_label.nummeric_note_up'), noteDown: translate('dynamic-control.select_color_label.nummeric_note_down') }
      case DEFINE_FIELD_TYPE.DATE:
      case DEFINE_FIELD_TYPE.DATE_TIME:
      case DEFINE_FIELD_TYPE.TIME:
        return { up: translate('dynamic-control.select_color_label.date_up'), down: translate('dynamic-control.select_color_label.date_down'), noteUp: translate('dynamic-control.select_color_label.date_note_up'), noteDown: translate('dynamic-control.select_color_label.date_note_down') }
      default:
        break;
    }
  }

  const onSelectColor = (colorSelectedId, type) => {
    if (type === "forwardColor") {
      selectColorFoward['forwardColor'] = 'color-' + colorSelectedId;
      setSelectColorFoward(_.cloneDeep(selectColorFoward));
    } else {
      selectColorBack['backwardColor'] = 'color-' + colorSelectedId;
      setSelectColorBack(_.cloneDeep(selectColorBack));
    }
    if (showTipSelectColor.forward) {
      showTipSelectColor.forward = false;
    }
    if (showTipSelectColor.back) {
      showTipSelectColor.back = false;
    }
    setShowTipSelectColor(showTipSelectColor);
  }

  const renderTipSelectColor = (type) => {
    const limitColor = 27;
    const renderColor = [];
    for (let i = 0; i < limitColor; i++) {
      const elementTmp = <li onClick={() => onSelectColor(i, type)}><span className={`color-${i}`}></span></li>
      renderColor.push({ id: i, element: elementTmp });
    }
    return (
      <div className="box-select-option box-select-option-popup" >
        <div className="box-select-option-bottom select-color">
          <ul className="color-table">
            {renderColor.map((item) => {
              return item.element;
            }
            )}
          </ul>
        </div>
      </div>
    )
  }

  /**
 * Handle for clicking the outside of dropdown
 * @param e
 */
  const handleClickOutsideForward = (e) => {
    if (wrapperRefForward.current && !wrapperRefForward.current.contains(e.target) && wrapperRefBackward.current && !wrapperRefBackward.current.contains(e.target)) {
      showTipSelectColor.forward = false;
      showTipSelectColor.back = false;
      setShowTipSelectColor(showTipSelectColor);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideForward, false);
    return () => {
      document.removeEventListener("click", handleClickOutsideForward, false);
    };
  }, []);

  const isShowTipSelectColor = (forward, back) => {
    const object = { forward, back }
    object.forward = forward
    object.back = back
    setShowTipSelectColor(object)
  }
  const iShowdifferenceSetting = props.belong === FIELD_BELONG.PRODUCT_TRADING && (fieldType === DEFINE_FIELD_TYPE.SINGER_SELECTBOX ||
    fieldType === DEFINE_FIELD_TYPE.NUMERIC || fieldType === DEFINE_FIELD_TYPE.DATE || fieldType === DEFINE_FIELD_TYPE.DATE_TIME || fieldType === DEFINE_FIELD_TYPE.TIME || fieldType === DEFINE_FIELD_TYPE.RADIOBOX) || fieldName === FIELD_NAME.PRODUCT_TRADING_PROGRESS_ID
    const isTabTitleOther = (fieldType === DEFINE_FIELD_TYPE.TAB || fieldType === DEFINE_FIELD_TYPE.TITLE || fieldType === DEFINE_FIELD_TYPE.OTHER) && fieldName !== FIELD_NAME.PRODUCT_TRADING_PROGRESS_ID
    const renderComponentBottom = () => {
      const isEnableDifferenceSetting = isCanSettingField(props.belong, fieldName, FIELD_OPTION.DIFFERENCE_SETTING, fieldInfo.isDefault);
      // const isShowPermission =
      //   isCanSettingField(props.belong, fieldInfo.fieldName, FIELD_OPTION.PERMISSION, fieldInfo.isDefault) && availableFlag !== AVAILABLE_FLAG.UNAVAILABLE;
      if (isTabTitleOther) {
      return (
        <div className="footer-popup-right bg-white pb-4">
          <button className="button-cancel" onClick={onCancelUpdateField} >{translate('dynamic-control.fieldDetail.common.label.buttonCancel')}</button>
          <button className="button-blue" onClick={onSaveUpdateField}>{translate('dynamic-control.fieldDetail.common.label.buttonSave')}</button>
        </div>
      )
    }
    const isShowCommonBottom = (fieldType === DEFINE_FIELD_TYPE.LOOKUP && serviceSelectId > 0) ||
    (fieldType === DEFINE_FIELD_TYPE.RELATION && serviceSelectId > 0) ||
    (fieldType !== DEFINE_FIELD_TYPE.LOOKUP && fieldType !== DEFINE_FIELD_TYPE.RELATION) || fieldType === DEFINE_FIELD_TYPE.RADIOBOX || fieldName === FIELD_NAME.PRODUCT_TRADING_PROGRESS_ID
    const isSalesProcess = isCanSettingField(props.belong, fieldInfo.fieldName, FIELD_OPTION.SALES_PROCESS, fieldInfo.isDefault);
    const disableProcess =  _.get(editFieldInfo, 'availableFlag') === AVAILABLE_FLAG.UNAVAILABLE;
    return (
      <>
        {isShowCommonBottom &&
          <>
            {iShowdifferenceSetting && <>
                <div className="form-group">
                  <label>{translate('dynamic-control.select_color_label.setting_special_field')}</label>
                  <label className={isEnableDifferenceSetting ? "icon-check" : "icon-check icon-check-disable font-weight-normal"}>
                    <input
                      type="checkbox"
                      name=""
                      checked={isEnableDifferenceSetting && showSelectBoxColor}
                      disabled={!isEnableDifferenceSetting}
                      onClick={() => {
                        setShowSelectBoxColor(!showSelectBoxColor);
                      }}
                    />
                    <i></i>
                    {translate('dynamic-control.select_color_label.show_special_field')}
                  </label>
                  {showSelectBoxColor && <table className="table-default table-difference">
                    <tbody>
                      <tr>
                        <td className="title-table align-center">{translate('dynamic-control.select_color_label.condition')}</td>
                        <td className="title-table align-center w17">{translate('dynamic-control.select_color_label.show_color')}</td>
                        <td className="title-table align-center">{translate('dynamic-control.select_color_label.note')}</td>
                      </tr>
                      <tr>
                        <td className="align-left">{getTitleLableSelectColor && getTitleLableSelectColor().up}</td>
                        <td className="align-center align-middle">
                          <div className="box-select-color" ref={wrapperRefForward}>
                            <div className={`box-current-color bg-${differenceSetting && differenceSetting.forwardColor}`} onClick={() => isShowTipSelectColor(!showTipSelectColor.forward, showTipSelectColor.back)}></div>
                            {showTipSelectColor.forward && renderTipSelectColor('forwardColor')}
                          </div>
                        </td>
                        <td className="text-left">
                          {selectColorFoward['forwardText'] && selectColorFoward['forwardText'].map((e, idx) => {
                            if (!e.default) {
                              return <></>
                            }
                            const isError = (invalidate && _.get(invalidate, 'forwardText') && selectColorFoward['forwardText'].filter(o => o.default && !_.isEmpty(o.value)).length < 1)
                              || _.get(invalidate, `forwardText[${idx}]`);
                            return (
                              <div className="layout-input-text" key={idx}>
                                <div className="mb-1">
                                  <input key={idx} className={`input-normal gray ${isError ? 'error' : ''}`} type="text"
                                    placeholder={getTitleLableSelectColor && getTitleLableSelectColor().noteUp}
                                    onChange={(ev) => onChangeLanguage(ev, idx, TYPE_ADD_LANGUAGE.FORWARD_TEXT)}
                                    value={e.value} 
                                    onBlur={(ev) => convertToKatakana(ev, idx, TYPE_ADD_LANGUAGE.FORWARD_TEXT)}/>{`(${e.name})`}
                                </div>
                                {isError &&
                                  <span className="messenger-error">{_.get(invalidate, `forwardText[${idx}]`)}</span>
                                }
                              </div>
                            )
                          })}
                          {selectColorFoward['forwardText'] && selectColorFoward['forwardText'].filter(o => o.default).length < selectColorFoward['forwardText'].length ?
                            <div><a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e, ADD_LANGUAGE, TYPE_ADD_LANGUAGE.FORWARD_TEXT)} onClick={() => onAddLanguage(TYPE_ADD_LANGUAGE.FORWARD_TEXT)} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.showOtherLanguage')}</a></div>
                            : <div><a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e, REMOVE_LANGUAGE, TYPE_ADD_LANGUAGE.FORWARD_TEXT)} onClick={() => onRemoveLanguage(TYPE_ADD_LANGUAGE.FORWARD_TEXT)} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.hideOtherLanguage')}</a></div>
                          }
                        </td>
                      </tr>
                      <tr>
                        <td className="align-left">{getTitleLableSelectColor && getTitleLableSelectColor().down}</td>
                        <td className="align-center align-middle">
                          <div className="box-select-color" ref={wrapperRefBackward}>
                            <div className={`box-current-color bg-${differenceSetting && differenceSetting.backwardColor}`} onClick={() => isShowTipSelectColor(showTipSelectColor.forward, !showTipSelectColor.back)}></div>
                            {showTipSelectColor.back && renderTipSelectColor('backwardColor')}
                          </div>
                        </td>
                        <td className="text-left">
                          {selectColorBack['backwardText'] && selectColorBack['backwardText'].map((e, idx) => {
                            if (!e.default) {
                              return <></>
                            }
                            const isError = (invalidate && _.get(invalidate, 'backwardText') && selectColorBack['backwardText'].filter(o => o.default && !_.isEmpty(o.value)).length < 1)
                              || _.get(invalidate, `backwardText[${idx}]`);
                            return (
                              <div className="layout-input-text" key={idx}>
                                <div className="mb-1">
                                  <input key={idx} className={`input-normal gray ${isError ? 'error' : ''}`} type="text"
                                    placeholder={getTitleLableSelectColor && getTitleLableSelectColor().noteDown}
                                    onChange={(ev) => onChangeLanguage(ev, idx, TYPE_ADD_LANGUAGE.BACKWARD_TEXT)}
                                    value={e.value} 
                                    onBlur={(ev) => convertToKatakana(ev, idx, TYPE_ADD_LANGUAGE.BACKWARD_TEXT)}/>{`(${e.name})`}
                                </div>
                                {isError &&
                                  <span className="messenger-error">{_.get(invalidate, `backwardText[${idx}]`)}</span>
                                }
                              </div>
                            )
                          })}
                          {selectColorBack['backwardText'] && selectColorBack['backwardText'].filter(o => o.default).length < selectColorBack['backwardText'].length ?
                            <div><a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e, ADD_LANGUAGE, TYPE_ADD_LANGUAGE.BACKWARD_TEXT)} onClick={() => onAddLanguage(TYPE_ADD_LANGUAGE.BACKWARD_TEXT)} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.showOtherLanguage')}</a></div>
                            : <div><a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e, REMOVE_LANGUAGE, TYPE_ADD_LANGUAGE.BACKWARD_TEXT)} onClick={() => onRemoveLanguage(TYPE_ADD_LANGUAGE.BACKWARD_TEXT)} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.hideOtherLanguage')}</a></div>
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>}
                </div>
              </>
            }
            {(props.belong === FIELD_BELONG.ACTIVITY || props.belong === FIELD_BELONG.PRODUCT) &&
              <div className="form-group">
                <label>{translate('dynamic-control.fieldDetail.common.label.process')}</label>
                <div className="wrap-check no-border">
                  <div className="wrap-check-box mh-auto">
                  <div className="check-box-item mr-2 pt-0 text-blue">
                    <a onClick={(e) => {if (isSalesProcess) onSelectActiveProduct(e, -1, 1)}} className={!isSalesProcess ? 'disable' : ''}>{translate('dynamic-control.fieldDetail.common.label.selectAll')}</a>
                  </div>
                  <div className="check-box-item mr-2 pt-0 text-blue">
                    <a onClick={(e) => {if (isSalesProcess) onSelectActiveProduct(e, -1, 0)}} className={!isSalesProcess ? 'disable' : ''}>{translate('dynamic-control.fieldDetail.common.label.releaseAll')}</a>
                  </div>
                  <div className="check-box-item mr-2 pt-0 text-blue">
                    <a onClick={(e) => {if (isSalesProcess) onSelectActiveProduct(e, -1, -1)}} className={!isSalesProcess ? 'disable' : ''}>{translate('dynamic-control.fieldDetail.common.label.selectInvert')}</a>
                  </div>
                    {
                      listActiveProduct.map((e, idx) => (
                        <div key={idx} className="check-box-item mr-2 pt-0">
                             <label className={`icon-check ${!isSalesProcess || disableProcess ? 'icon-check-disable' : ''}`}>
                             <input type="checkbox" key={listActiveProduct[idx].id}
                                    disabled={!isSalesProcess || disableProcess}
                                    checked={listSelectActiveProduct.findIndex(ev => ev.id === listActiveProduct[idx].id) >= 0}
                                    onClick={(ev) => onSelectActiveProduct(ev, listActiveProduct[idx].id, 1)}
                              />
                             <i></i>
                             {getFieldLabel(listActiveProduct[idx], 'name')}
                             </label>
                        </div>
                      )
                    )
                    }
                  </div>
                  {/* <table>
                    <tbody>
                      <tr>
                        <td><a onClick={(e) => {if (isSalesProcess) onSelectActiveProduct(e, -1, 1)}} className={!isSalesProcess ? 'disable' : ''}>{translate('dynamic-control.fieldDetail.common.label.selectAll')}</a></td>
                        <td><a onClick={(e) => {if (isSalesProcess) onSelectActiveProduct(e, -1, 0)}} className={!isSalesProcess ? 'disable' : ''}>{translate('dynamic-control.fieldDetail.common.label.releaseAll')}</a></td>
                        <td><a onClick={(e) => {if (isSalesProcess) onSelectActiveProduct(e, -1, -1)}} className={!isSalesProcess ? 'disable' : ''}>{translate('dynamic-control.fieldDetail.common.label.selectInvert')}</a></td>
                      </tr>
                      {_.range(Math.ceil(listActiveProduct.length / 3)).map((m, index) =>
                        <tr key={index}>
                          {_.range(3).map((n, idx) =>
                            <td key={index * 3 + idx}>
                              {(listActiveProduct.length > index * 3 + idx) &&
                                <label className={`icon-check ${!isSalesProcess || disableProcess ? 'icon-check-disable' : ''}`}>
                                  <input type="checkbox" key={listActiveProduct[index * 3 + idx].id}
                                    disabled={!isSalesProcess || disableProcess}
                                    checked={listSelectActiveProduct.findIndex(e => e.id === listActiveProduct[index * 3 + idx].id) >= 0}
                                    onClick={(e) => onSelectActiveProduct(e, listActiveProduct[index * 3 + idx].id, 1)}
                                  />
                                  <i></i>{getFieldLabel(listActiveProduct[index * 3 + idx], 'name')}
                                </label>
                              }
                            </td>
                          )}
                        </tr>
                      )}
                    </tbody>
                  </table> */}
                </div>
              </div>
            }
          </>
        }
        {(fieldType === DEFINE_FIELD_TYPE.LOOKUP && serviceSelectId > 0) &&
          <FieldDetailEditLookup ref={fieldDetailRef}
            {...props}
            updateStateElement={updateStateElement}
            service={{ serviceId: serviceSelectId, serviceName: {} }}
            fieldInfoService={props.fieldInfoService}
            allFields={props.getFieldsCallBack.listField}
            editFieldInfo={editFieldInfo}
          />
        }
        {(fieldType === DEFINE_FIELD_TYPE.RELATION && serviceSelectId > 0) &&
          <FieldDetailEditRelation ref={fieldDetailRef}
            {...props}
            updateStateElement={updateStateElement}
            serviceId={serviceSelectId}
            services={props.serviceInfo}
            fieldInfoSelect={props.fieldInfoSelect}
            fieldInfoService={props.fieldInfoService}
            parseAllFieldLabel={parseAllFieldLabel}
          />
        }
        <div className="footer-popup-right bg-white pb-4">
          <button disabled={!props.onExecuteAction} className="button-cancel mr-4" onClick={onCancelUpdateField} >{translate('dynamic-control.fieldDetail.common.label.buttonCancel')}</button>
          <button disabled={!props.onExecuteAction} className="button-blue" onClick={onSaveUpdateField}>{translate('dynamic-control.fieldDetail.common.label.buttonSave')}</button>
        </div>
      </>
    )
  }

  const renderComponentMiddle = () => {
    switch (fieldType) {
      case DEFINE_FIELD_TYPE.SINGER_SELECTBOX:
      case DEFINE_FIELD_TYPE.RADIOBOX:
      case DEFINE_FIELD_TYPE.MULTI_SELECTBOX:
      case DEFINE_FIELD_TYPE.CHECKBOX:
        return <FieldDetailEditSelect ref={fieldDetailRef}  {...props} updateStateElement={updateStateElement} errorInfos={getErrorInfo()}/>
      case DEFINE_FIELD_TYPE.NUMERIC:
        return <FieldDetailEditNumeric ref={fieldDetailRef}  {...props} updateStateElement={updateStateElement} errorInfos={getErrorInfo()} />
      case DEFINE_FIELD_TYPE.DATE:
      case DEFINE_FIELD_TYPE.DATE_TIME:
      case DEFINE_FIELD_TYPE.TIME:
        return <FieldDetailEditDatetime ref={fieldDetailRef}  {...props} updateStateElement={updateStateElement} />
      case DEFINE_FIELD_TYPE.TEXT:
      case DEFINE_FIELD_TYPE.TEXTAREA:
        return <FieldDetailEditText ref={fieldDetailRef} {...props} updateStateElement={updateStateElement} errorInfos={getErrorInfo()} />
      case DEFINE_FIELD_TYPE.LINK:
        return <FieldDetailEditLink ref={fieldDetailRef}  {...props} updateStateElement={updateStateElement} errorInfos={getErrorInfo()} />
      case DEFINE_FIELD_TYPE.ADDRESS:
        return <FieldDetailEditAddress ref={fieldDetailRef}  {...props} updateStateElement={updateStateElement} />
      case DEFINE_FIELD_TYPE.CALCULATION:
        return (
          <FieldDetailEditCalculation ref={fieldDetailRef}
            {...props}
            updateStateElement={updateStateElement}
            fieldsInfo={props.fieldInfoSelect}
            services={props.serviceInfo}
            errorInfos={getErrorInfo()}
          />)
      case DEFINE_FIELD_TYPE.TAB:
      case DEFINE_FIELD_TYPE.TITLE:
      case DEFINE_FIELD_TYPE.OTHER:
        return (
          <FieldDetailEditHeading ref={fieldDetailRef}
            {...props}
            updateStateElement={updateStateElement}
            errorInfos={getErrorInfo()}
          />)
      case DEFINE_FIELD_TYPE.SELECT_ORGANIZATION:
        return <FieldDetailEditSelectOrg ref={fieldDetailRef}  {...props} updateStateElement={updateStateElement} errorInfos={getErrorInfo()} />
      default:
        return <></>
    }
  }

  if (!editFieldInfo) {
    return <></>
  }

  return (
    <div>
      {renderComponentTop()}
      {renderComponentMiddle()}
      {renderComponentBottom()}
    </div>
  )
});

const mapStateToProps = ({ dynamicField }: IRootState, ownProps: IDynamicFieldProps) => {
  const id = `${ownProps.belong}_${ownProps.fieldInfo.fieldType}`;
  if (!dynamicField || !dynamicField.data.has(id)) {
    return {
      action: null,
      errorMessage: null,
      fieldInfoSelect: null,
      fieldInfoService: null,
      serviceInfo: null,
      productTypes: null,
      activities: null,
    };
  }
  return {
    action: dynamicField.data.get(id).action,
    errorMessage: dynamicField.data.get(id).errorMessage,
    fieldInfoSelect: dynamicField.data.get(id).fieldInfo,
    fieldInfoService: dynamicField.data.get(id).fieldInfoService,
    serviceInfo: dynamicField.data.get(id).serviceInfo,
    productTypes: dynamicField.data.get(id).productTypes,
    activities: dynamicField.data.get(id).activities
  }
};

const mapDispatchToProps = {
  getServicesInfo,
  getActivityFormats,
  getFieldsInfo,
  getFieldsInfoService,
  getProductTypes,
  reset,
};

const options = { forwardRef: true };

export default connect<IDynamicFieldStateProps, IDynamicFieldDispatchProps, IDynamicFieldProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(FieldDetailEditBox);

