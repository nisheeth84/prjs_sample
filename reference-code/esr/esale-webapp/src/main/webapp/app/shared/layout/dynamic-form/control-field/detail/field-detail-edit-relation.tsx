import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE, FIELD_MAXLENGTH } from '../../constants';
import { Storage, translate } from 'react-jhipster';
import { FIELD_BELONG, AVAILABLE_FLAG } from 'app/config/constants';
import RelationSelectField from './relation-select-field';
import { useId } from 'react-id-generator';
import _ from 'lodash';
import { IRootState } from 'app/shared/reducers';
import {
  getActivityFormats,
  getProductTypes,
  getFieldsInfo,
  reset,
  DynamicFieldAction,
} from 'app/shared/reducers/dynamic-field.reducer';
import { connect, Options } from 'react-redux';
import { languageCode } from 'app/config/language-code';
import { getFieldLabel, toKatakana, jsonParse } from 'app/shared/util/string-utils';

interface IRelationProps {
  serviceId?: number,
  services?: any[],
  fieldInfoSelect?: any[],
  fieldInfoService?: any[],
  parseAllFieldLabel?: any;
}

type IFieldDetailEditRelationOwnProps = IDynamicFieldProps & IRelationProps

interface IRelationDispatchProps {
  getFieldsInfo,
  getActivityFormats,
  getProductTypes,
  reset
}

interface IRelationStateProps {
  action: DynamicFieldAction;
  errorMessage: string;
  productTypes: any;
  activities: any;
  fieldSubRelation?: any[],
}

type IFieldDetailEditRelationProps = IRelationDispatchProps & IRelationStateProps & IFieldDetailEditRelationOwnProps

const FieldDetailEditRelation = forwardRef((props: IFieldDetailEditRelationProps, ref) => {
  // area relation
  const [formatSource, setFormatSource] = useState(1)
  const [displayFieldIdSource, setDisplayFieldIdSource] = useState(null)
  const [displayTabSource, setDisplayTabSource] = useState(2)
  const [displayFieldsSource, setDisplayFieldsSource] = useState([])
  const [fieldIdRelation, setFieldIdRelation] = useState(null)
  const [formatTarget, setFormatTarget] = useState(1)
  const [displayFieldIdTarget, setDisplayFieldIdTarget] = useState(null)
  const [displayTabTarget, setDisplayTabTarget] = useState(2)
  const [displayFieldsTarget, setDisplayFieldsTarget] = useState([])
  const [displayPopupSource, setDisplayPopupSource] = useState(false);
  const [displayPopupTarget, setDisplayPopupTarget] = useState(false);
  // area common
  const [fieldInfoRelation, setFieldInfoRelation] = useState(null);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [modifyFlag, setModifyFlag] = useState(0);
  const [modifyFlagReq, setModifyFlagReq] = useState(0);
  const [availableFlag, setAvailableFlag] = useState(3);
  const [searchMethodFlag, setSearchMethodFlag] = useState(1);
  const [availableDeviceWeb, setAvailableDeviceWeb] = useState(false);
  const [availableDeviceApp, setAvailableDeviceApp] = useState(false);
  const [salesProcess, setSalesProcess] = useState(null);
  const [listActiveProduct, setListActiveProduct] = useState([]);
  const [listSelectActiveProduct, setListSelectActiveProduct] = useState([]);
  const [itemErrors, setItemErrors] = useState(null);
  const [fieldSubRelation, ] = useState([]);
  const idAutomatic = useId(6, "field_detail_relation_id_");
  const nameAutomatic = useId(3, "field_detail_relation_name_");
  const idCommon = useId(10, "relation_common_edit_id_");
  const nameCommon = useId(10, "relation_common_edit_name_");
  const idSearchMethodAutomatic = useId(25, "field_detail_search_method_id_");
  const nameSearchMethodAutomatic = useId(25, "field_detail_search_method_name_");
  const [fieldRelationTmp, setFieldRelationTmp] = useState(null);

  const SEARCH_METHOD_EDITABLE = 1;
  const SEARCH_METHOD_REFERENCES = 2;
  const SEARCH_METHOD_IMPOSSIBLE = 3;

  const MODIFY_FLAG_REQUIRED_NOT_CHANGE = 3;

  useImperativeHandle(ref, () => ({
    validate () {
      const errors = {}
      let isError = false;
      if (displayFieldIdSource <= 0) {
        errors["displayFieldIdSource"] = translate("messages.ERR_COM_0014");
        isError = true;
      }
      if (displayFieldIdTarget <= 0 && props.serviceId !== props.belong) {
        errors["displayFieldIdTarget"] = translate("messages.ERR_COM_0014");
        isError = true;
      }
      if (props.serviceId !== props.belong) {
        const isEmptyLabel = fieldLabels.filter(label => label.default && !_.isEmpty(label.value)).length > 0;
        if (!isEmptyLabel) {
          errors["fieldLabel"] = translate("messages.ERR_COM_0013");
          isError = true;
        }
        // check maxlength here
        fieldLabels.forEach((label, idx) => {
          if (label && label.default && label.value.length > FIELD_MAXLENGTH.fieldLabel) {
            const maxLength = FIELD_MAXLENGTH.fieldLabel;
            errors[`fieldLabels_${idx}`] = translate("messages.ERR_COM_0025", [maxLength]);
            isError = true;
          }
        })
      }
      let fieldIdCompare = fieldRelationTmp.fieldId;
      if (!_.isNil(fieldRelationTmp.copyField)) {
        fieldIdCompare = fieldRelationTmp.copyField.from;
      }
      const resultCompareLabel = props.parseAllFieldLabel({listField: props.fieldInfoService}, fieldRelationTmp.fieldLabel, fieldIdCompare);
      const labelErrorCompare = resultCompareLabel.fieldLabelError;
      const indexError = resultCompareLabel.indexError;
      const languageErr = resultCompareLabel.fieldLanguageError;
      if (indexError.length > 0) {
        isError = true;
        for (let k = 0; k < indexError.length; k++) {
          const languageName = languageCode.find(item => item.code === languageErr[k]).name;
          errors[`fieldLabels[${indexError[k]}]`] = translate("messages.ERR_COM_0065", { 0: labelErrorCompare[k], 1: languageName });
        }
      }
      setItemErrors(errors);
      return isError ? [errors] : [];
    },
  }));

  const lang = Storage.session.get('locale', 'ja_jp');

  const getSaleProcess = (fieldId) => {
    if (listActiveProduct.length > 0) {
      return;
    } 
    const id = `${props.serviceId}_${DEFINE_FIELD_TYPE.RELATION}`
    if (props.fieldInfo.fieldId < 0) {
      if (props.serviceId === FIELD_BELONG.ACTIVITY) {
        props.getActivityFormats(id, null)
      }
      if (props.serviceId === FIELD_BELONG.PRODUCT) {
        props.getProductTypes(id, null)
      }
    } else if (fieldId > 0) {
      if (props.serviceId === FIELD_BELONG.ACTIVITY) {
        props.getActivityFormats(id, fieldId)
      }
      if (props.serviceId === FIELD_BELONG.PRODUCT) {
        props.getProductTypes(id, fieldId)
      }
    }
  }

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

  const initializeCommon = () => {
    let fieldIdTarget = null;
    let fieldTarget = null
    if (props.fieldInfo.relationData) {
      if (props.fieldInfo.relationData['fieldId']) {
        fieldIdTarget = props.fieldInfo.relationData['fieldId'];
      }
    }
    if (props.fieldInfo.relationField && !_.isNil(props.fieldInfo.relationField.salesProcess)) {
      setSalesProcess(props.fieldInfo.relationField.salesProcess)
    }
    if (_.isNil(fieldTarget) && props.fieldInfo.relationField) {
      fieldTarget = _.cloneDeep(props.fieldInfo.relationField)
    }
    if (_.isNil(fieldTarget) && !_.isNil(fieldIdTarget) && props.fieldInfoService) {
      const fIdx = props.fieldInfoService.findIndex( e => e.fieldId === fieldIdTarget)
      if (fIdx >= 0) {
        fieldTarget = props.fieldInfoService[fIdx];
      }
    }
    if (_.isNil(fieldTarget)) {
      fieldTarget = {}
    }
    getSaleProcess(fieldTarget.fieldId);
    // if (fieldTarget && fieldTarget.fieldLabel) {
    //   let objFieldLabel = {};
    //   if (_.isString(fieldTarget.fieldLabel)) {
    //     objFieldLabel = JSON.parse(fieldTarget.fieldLabel)
    //   } else {
    //     objFieldLabel = fieldTarget.fieldLabel
    //   }
    //   for (const prop in objFieldLabel) {
    //     if (Object.prototype.hasOwnProperty.call(objFieldLabel, prop)) {
    //       const el = {}
    //       el['code'] = prop
    //       el['value'] = objFieldLabel[prop];
    //       el['default'] = true;
    //       const idx = languageCode.findIndex( e => e.code === prop);
    //       if (idx >= 0) {
    //         el['name'] = languageCode[idx].name;
    //       }
    //       const labelIndex = fieldLabels.findIndex(e => e.code === prop);
    //       if (labelIndex < 0) {
    //         fieldLabels.push(el);
    //       } else {
    //         fieldLabels[labelIndex] = el;
    //       }
    //     }
    //   }
    // }
    // if (fieldLabels.length < 1) {
    //   let name = "";
    //   const idx = languageCode.findIndex( e => e.code === lang);
    //   if (idx >= 0) {
    //     name = languageCode[idx].name;
    //   }
    //   fieldLabels.push({code: lang, name, default: true, value: ''})
    // }
    // languageCode.forEach( (e) => {
    //   const idx = fieldLabels.findIndex(o => o.code === e.code);
    //   if (idx < 0) {
    //     fieldLabels.push({code: e.code, name: e.name, default: false, value: ''})
    //   }
    // });
    // const nativeIdx = fieldLabels.findIndex( e => e.code === lang);
    // if (nativeIdx >= 0) {
    //   const nativeLabel = fieldLabels.splice(nativeIdx, 1)[0];
    //   fieldLabels.splice(0, 0, nativeLabel);
    // }

    // const priorityLangs = ['ja_jp', 'en_us', 'zh_cn']
    // const fieldLabelsTmp = []
    // fieldLabelsTmp[0] = fieldLabels[0]
    // priorityLangs.forEach((item1) => {
    //   fieldLabels.forEach((item2, idx) => {
    //     if (item1 === item2['code'] && item1 !== lang) {
    //       fieldLabelsTmp.push(fieldLabels[idx]) 
    //     }
    //   })
    // })
    let objFieldLabel = {};
    if (props.fieldInfo.fieldLabel) {
      const fieldInfoTmp = _.cloneDeep(fieldTarget);
      if (typeof fieldInfoTmp.fieldLabel === 'string' || fieldInfoTmp.fieldLabel instanceof String) {
        objFieldLabel = JSON.parse(fieldInfoTmp.fieldLabel)
      } else {
        objFieldLabel = fieldInfoTmp.fieldLabel
      }
    }
    setFieldLabels(getDefaultFieldLabel(objFieldLabel));
    if (fieldTarget.modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE) {
      setSearchMethodFlag(SEARCH_METHOD_EDITABLE);
    } else if (fieldTarget.modifyFlag === 0 && fieldTarget.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE) {
      setSearchMethodFlag(SEARCH_METHOD_REFERENCES);
    } else if (fieldTarget.availableFlag === AVAILABLE_FLAG.UNAVAILABLE) {
      setSearchMethodFlag(SEARCH_METHOD_IMPOSSIBLE);
    } else {
      setSearchMethodFlag(SEARCH_METHOD_EDITABLE);
    }
    setModifyFlag(_.isNil(fieldTarget.modifyFlag) ? 1 : fieldTarget.modifyFlag)
    setModifyFlagReq(_.isNil(fieldTarget.modifyFlag) ? 1 : fieldTarget.modifyFlag)
    let available = fieldTarget.availableFlag;
    if (_.isNil(fieldTarget.availableFlag) || fieldTarget.availableFlag === undefined) {
      available = 3;
    }
    setAvailableFlag(available)
    setAvailableDeviceWeb(available === 1 || available === 3)
    setAvailableDeviceApp(available === 2 || available === 3)
    setFieldInfoRelation(fieldTarget)
  }

  const initialize = () => {
    let fieldIdTarget = null;
    if (props.fieldInfo.relationData) {
      if (props.fieldInfo.relationData['fieldId']) {
        fieldIdTarget = props.fieldInfo.relationData['fieldId'];
      }
      if (props.fieldInfo.relationData['format']) {
        setFormatSource(+props.fieldInfo.relationData['format'])
      }
      if (props.fieldInfo.relationData['displayFieldId']) {
        setDisplayFieldIdSource(props.fieldInfo.relationData['displayFieldId'])
      }
      if (props.fieldInfo.relationData['displayTab']) {
        setDisplayTabSource(+props.fieldInfo.relationData['displayTab'])
      }
      if (props.fieldInfo.relationData['displayFields']) {
        setDisplayFieldsSource(_.cloneDeep(props.fieldInfo.relationData['displayFields']))
      }
    }
    if (_.isNil(fieldIdRelation)) {
      setFieldIdRelation(_.isNil(fieldIdTarget) ? Math.round(Math.random() * 10000) * -1 : fieldIdTarget)
    }

    if (props.fieldInfo.relationField && props.fieldInfo.relationField.relationData){
      if (props.fieldInfo.relationField.relationData['format']) {
        setFormatTarget(+props.fieldInfo.relationField.relationData['format'])
      }
      if (props.fieldInfo.relationField.relationData['displayFieldId']) {
        setDisplayFieldIdTarget(props.fieldInfo.relationField.relationData['displayFieldId'])
      }
      if (props.fieldInfo.relationField.relationData['displayTab']) {
        setDisplayTabTarget(+props.fieldInfo.relationField.relationData['displayTab'])
      }
      if (props.fieldInfo.relationField.relationData['displayFields']) {
        setDisplayFieldsTarget(_.cloneDeep(props.fieldInfo.relationField.relationData['displayFields']))
      }
    } else if (fieldIdTarget && props.fieldInfoService) {
      const fIdx = props.fieldInfoService.findIndex( e => e.fieldId === fieldIdTarget)
      if (fIdx >= 0) {
        if (props.fieldInfoService[fIdx].relationData['format']) {
          setFormatTarget(+props.fieldInfoService[fIdx].relationData['format'])
        }
        if (props.fieldInfoService[fIdx].relationData['displayFieldId']) {
          setDisplayFieldIdTarget(props.fieldInfoService[fIdx].relationData['displayFieldId'])
        }
        if (props.fieldInfoService[fIdx].relationData['displayTab']) {
          setDisplayTabTarget(+props.fieldInfoService[fIdx].relationData['displayTab'])
        }
        if (props.fieldInfoService[fIdx].relationData['displayFields']) {
          setDisplayFieldsTarget(_.cloneDeep(props.fieldInfoService[fIdx].relationData['displayFields']))
        }
      }
    }
    initializeCommon()
  }

  const getServiceName = (service: number) => {
    if (!props.services) {
      return "";
    }
    const idx = props.services.findIndex( e => e.serviceId === service);
    if (idx < 0) {
      return ""
    }
    return getFieldLabel(props.services[idx], "serviceName");
  }

  useEffect(() => {
    initialize()
    return () => {
      props.reset(`${props.serviceId}_${DEFINE_FIELD_TYPE.RELATION}`);
    };
  },[])

  useEffect(() => {
    if (props.fieldInfoService) {
      initialize();
    }
  }, [props.fieldInfoService])

  useEffect(() => {
    if (!props.fieldInfoService || props.fieldInfoService.length < 1 || !props.fieldInfoService || props.fieldInfoService.length < 1) {
      return;
    }
    const relationFieldBelong = [];
    props.fieldInfoService.forEach((e, idx) => {
      if (e.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
        if (e.relationData && e.relationData.fieldBelong) {
          if (relationFieldBelong.findIndex( o => o === e.relationData.fieldBelong) < 0) {
            relationFieldBelong.push(e.relationData.fieldBelong);
          }
        }
      }
    });
    props.fieldInfoSelect.forEach((field, idx) => {
      if (field.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
        if (field.relationData && field.relationData.fieldBelong) {
          if (relationFieldBelong.findIndex( o => o === field.relationData.fieldBelong) < 0) {
            relationFieldBelong.push(field.relationData.fieldBelong);
          }
        }
      }
    });
    const subRelationId = `${props.serviceId}_${DEFINE_FIELD_TYPE.RELATION}_subRelationId`
    relationFieldBelong.forEach( e => {
      props.getFieldsInfo(subRelationId, e, null, null);
    })
  }, [props.fieldInfoService, props.fieldInfoSelect])

  useEffect(() => {
    if (props.fieldSubRelation && props.fieldSubRelation.length > 0) {
      props.fieldSubRelation.forEach((e, idx) => {
        if (fieldSubRelation.findIndex(o => o.fieldId === e.fieldId) < 0) {
          fieldSubRelation.push(e);
        }
      })
    }
  }, [props.fieldSubRelation])

  useEffect(() => {
    if ((props.serviceId === FIELD_BELONG.ACTIVITY) && props.activities) {
      if (props.activities.activityFormats) {
        const tmp = props.activities.activityFormats.filter( e => e.isAvailable).map(e => ({id: e.activityFormatId, name: e.name, order: e.displayOrder}))
        tmp.sort((a, b) => { return a.order - b.order});
        setListActiveProduct(tmp);
      }
      if (props.activities.activityFormatsByFieldId && _.isNil(salesProcess)) {
        setListSelectActiveProduct(props.activities.activityFormatsByFieldId.map(e => ({id: e.activityFormatId, name: e.name})))
      }
    }
    if (props.serviceId === FIELD_BELONG.PRODUCT &&  props.productTypes) {
      if (props.productTypes.productTypes) {
        const tmp = props.productTypes.productTypes.filter( e => e.isAvailable).map(e => ({id: e.productTypeId, name: e.productTypeName, order: e.displayOrder}))
        tmp.sort((a, b) => { return a.order - b.order});
        setListActiveProduct(tmp);
      }
      if (props.productTypes.productTypesByFieldId && _.isNil(salesProcess)) {
        setListSelectActiveProduct(props.productTypes.productTypesByFieldId.map(e => ({id: e.productTypeId, name: e.productTypeName})))
      }
    }
  }, [props.activities, props.productTypes])

  useEffect(() => {
    if (_.isNil(salesProcess) && !_.isArray(salesProcess)) {
      return;
    }
    setListSelectActiveProduct(salesProcess.map(e => ({id: e})))
  }, [salesProcess])

  useEffect(() => {
    if (availableDeviceApp || availableDeviceWeb) {
      setAvailableFlag(AVAILABLE_FLAG.WEB_APP_AVAILABLE);
    } else if (!availableDeviceApp && !availableDeviceWeb) {
      setAvailableFlag(AVAILABLE_FLAG.UNAVAILABLE);
    }
  }, [availableDeviceApp, availableDeviceWeb])

  useEffect(() => {
    if (formatSource === 1) {
      setDisplayFieldsSource([])
      setDisplayTabSource(2);
    }
    if (formatTarget === 1) {
      setDisplayFieldsTarget([])
      setDisplayTabTarget(2);
    }
  }, [formatTarget, formatSource])

  useEffect(() => {
    if (_.isNil(fieldInfoRelation)) {
      return;
    }
    const fieldLabel = {}
    fieldLabels.forEach( (e) => {
      if (e.default) {
        fieldLabel[e.code] = e.value;
      }
    });
    const relationDataSrc = {}
    relationDataSrc['fieldBelong'] = props.serviceId
    relationDataSrc['format'] = formatSource
    relationDataSrc['fieldId'] = props.serviceId !== props.belong ? fieldIdRelation : props.fieldInfo.fieldId
    relationDataSrc['displayFieldId'] = displayFieldIdSource
    if(formatSource !== 1) {
      relationDataSrc['displayTab'] = displayTabSource
      if (displayTabSource === 1) {
        relationDataSrc['displayFields'] = displayFieldsSource
      }
    }
    const relationDataTarget = {}
    relationDataTarget['fieldBelong'] = props.belong
    relationDataTarget['format'] = formatTarget
    relationDataTarget['fieldId'] = props.fieldInfo.fieldId
    relationDataTarget['displayFieldId'] = displayFieldIdTarget
    if(formatTarget !== 1) {
      relationDataTarget['displayTab'] = displayTabTarget
      if (displayTabTarget === 1) {
        relationDataTarget['displayFields'] = displayFieldsTarget
      }
    } else {
      relationDataTarget['displayTab'] = null
    }
    if (props.belong === props.serviceId) {
      relationDataTarget['asSelf'] = 1;
    } else {
      relationDataTarget['asSelf'] = null;
    }
    if (!_.has(relationDataTarget, 'displayFields')) {
      relationDataTarget['displayFields'] = [];
    }
    const fieldInfoTarget = _.cloneDeep(fieldInfoRelation)
    let userModifyFlg = false
    if (props.fieldInfoService && props.fieldInfoService.length > 0 && fieldIdRelation < 0) {
      const order = _.max(props.fieldInfoService.map( e => e.fieldOrder))
      fieldInfoTarget['fieldOrder'] = order + 1;
    }
    fieldInfoTarget['fieldId'] = fieldIdRelation;
    fieldInfoTarget['fieldBelong'] = props.serviceId;
    fieldInfoTarget['fieldType'] = _.toNumber(DEFINE_FIELD_TYPE.RELATION);
    fieldInfoTarget['fieldLabel'] = fieldLabel;
    if(!_.isEqual(fieldLabel, jsonParse(fieldInfoRelation.fieldLabel, {}))) {
      userModifyFlg = true;
    }
    fieldInfoTarget['modifyFlag'] = modifyFlag;
    if(!_.isEqual(modifyFlag, fieldInfoRelation.modifyFlag)) {
      userModifyFlg = true;
    }
    fieldInfoTarget['availableFlag'] = availableFlag;
    if(!_.isEqual(availableFlag, fieldInfoRelation.availableFlag)) {
      userModifyFlg = true;
    }
    fieldInfoTarget['relationData'] = relationDataTarget
    if(!_.isEqual(relationDataTarget, fieldInfoRelation.relationData) && !_.isNil(fieldInfoRelation.relationData)) {
      userModifyFlg = true;
    }
    if (props.serviceId === FIELD_BELONG.ACTIVITY || props.serviceId === FIELD_BELONG.PRODUCT) {
      const salesProcessIds = []
      if ((props.serviceId === FIELD_BELONG.ACTIVITY) && props.activities) {
        if (props.activities.activityFormatsByFieldId) {
          salesProcessIds.push(...props.activities.activityFormatsByFieldId.map(e => e.activityFormatId))
        }
      }
      if (props.serviceId === FIELD_BELONG.PRODUCT &&  props.productTypes) {
        if (props.productTypes.productTypesByFieldId) {
          salesProcessIds.push(...props.productTypes.productTypesByFieldId.map(e => e.productTypeId))
        }
      }
      if (!_.isEqual(salesProcessIds, listSelectActiveProduct.map( e => e.id))) {
        userModifyFlg = true;
      }
      fieldInfoTarget['salesProcess'] = listSelectActiveProduct.map( e => e.id);
    }
    fieldInfoTarget['userModifyFlg'] = userModifyFlg;
    let fIdx = -1;
    if (props.fieldInfoService) {
      fIdx = props.fieldInfoService.findIndex(e => e.fieldId === fieldIdRelation)
    }
    if (fIdx >= 0) {
      if (formatTarget === 1 && _.get(props.fieldInfoService[fIdx], 'relationData.format') === 2) {
        fieldInfoTarget['isMultiToSingle'] = true;
      }
    }
    setFieldRelationTmp(_.cloneDeep(fieldInfoTarget));
    if (props.updateStateElement) {
      if (props.serviceId === props.belong) {
        props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, {relationData : relationDataSrc})
      } else {
        props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, {relationData : relationDataSrc, relationField: fieldInfoTarget})
      }
    }
  }, [fieldLabels, modifyFlag, availableFlag,
      listSelectActiveProduct,
      formatSource,
      displayFieldIdSource,
      displayTabSource,
      displayFieldsSource,
      formatTarget,
      displayFieldIdTarget,
      displayTabTarget,
      displayFieldsTarget,
      fieldInfoRelation]);

  const onClosePopopSelectField = () => {
    if (displayPopupSource) {
      setDisplayPopupSource(false)
    }
    if (displayPopupTarget) {
      setDisplayPopupTarget(false)
    }
  }

  const onChangeSelectFields = (params: {displayTab, displayFieldId, displayFields}) => {
    if (displayPopupSource) {
      setDisplayTabSource(params.displayTab)
      setDisplayFieldIdSource(params.displayFieldId)
      setDisplayFieldsSource(params.displayFields)
      setDisplayPopupSource(false)
    }
    if (displayPopupTarget) {
      setDisplayTabTarget(params.displayTab)
      setDisplayFieldIdTarget(params.displayFieldId)
      setDisplayFieldsTarget(params.displayFields)
      setDisplayPopupTarget(false)
    }
  }

  const onAddLanguage = () => {
    fieldLabels.forEach(e => {
      e.default = true;
    });
    setFieldLabels(_.cloneDeep(fieldLabels));
  }

  const onRemoveLanguage = () => {
    fieldLabels.forEach(e => {
      if (e.code !== lang) {
        e.default = false;
        // e.value = '';
      }
    });
    setFieldLabels(_.cloneDeep(fieldLabels));
  }

  const onChangeLanguage = (ev, idx) => {
   if (ev.target.value.length <= FIELD_MAXLENGTH.fieldLabel) {
    fieldLabels[idx].value = ev.target.value;
    setFieldLabels(_.cloneDeep(fieldLabels));
   }
  }

  const convertToKatakana = (ev, idx) => {
    if (ev.target.value.length <= FIELD_MAXLENGTH.fieldLabel) {
     fieldLabels[idx].value = toKatakana(ev.target.value);
     setFieldLabels(_.cloneDeep(fieldLabels));
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
    const {checked} = event.target
    if (id > 0) {
      const idx = listSelectActiveProduct.findIndex( e => e.id === id);
      if (checked && idx < 0) {
        listSelectActiveProduct.push({id})
      } else if (!checked && idx >= 0) {
        listSelectActiveProduct.splice(idx, 1);
      }
      setListSelectActiveProduct(_.cloneDeep(listSelectActiveProduct));
    } else {
      const tmp = [];
      if (type === 1) {
        tmp.push(...listActiveProduct.map(e => ({id: e.id})))
      } else if (type === -1) {
        tmp.push(...listActiveProduct.filter( e => listSelectActiveProduct.findIndex(o => o.id === e.id) < 0))
      }
      setListSelectActiveProduct(tmp);
    }
  }

  const renderDisplayFields = (displayFields: any[], listFieldRef: any[]) => {
    const fieldsHtml = [];
    for(let i = 0; i < displayFields.length; i++) {
      if (displayFields[i].relationId > 0) {
        continue;
      }
      const idx = listFieldRef.findIndex( e => e.fieldId === displayFields[i].fieldId);
      if (idx < 0) {
        continue;
      }
      const isFirst = fieldsHtml.length === 0;
      const titleCell = translate('dynamic-control.fieldDetail.displayTargetSetting.labelTab')
      
      fieldsHtml.push(
        <tr key={idx}>
          {isFirst && <td className="title-table align-middle" align="center" style={{width: "100px"}} rowSpan={displayFields.length}>{titleCell}</td>}
          <td className="text-left"><label className="mb-0">{getFieldLabel(listFieldRef[idx], 'fieldLabel')}</label></td>
        </tr>
      )
      if (listFieldRef[idx].fieldType === DEFINE_FIELD_TYPE.RELATION) {
        const relationSub = displayFields.filter(e => e.relationId === displayFields[i].fieldId)
        if (relationSub.length < 1) {
          continue;
        }
        relationSub.forEach( e => {
          const subIndex = fieldSubRelation.findIndex( o => o.fieldId === e.fieldId)
          if (subIndex >= 0) {
            fieldsHtml.push(
              <tr key={e.fieldId}>
                <td><label>{getFieldLabel(fieldSubRelation[subIndex], 'fieldLabel')}</label></td>
              </tr>
            )
          }
        })
      }
    }
    return <>{fieldsHtml}</>
  }
  
  const ADD_LANGUAGE = 'add'
  const REMOVE_LANGUAGE = 'remove'

  const handleEnterKey = (event, mode) => {
    if (event.key === 'Enter') {
      if (mode === ADD_LANGUAGE) {
        onAddLanguage();
      }else if(mode === REMOVE_LANGUAGE){
        onRemoveLanguage();
      }
    }
  }

  const handleEnterDisplayPopupSource = (event) => {
    if (event.key === 'Enter') {
      setDisplayPopupSource(true);
    }
  }

  const renderRelationSource = () => {
    return ( <>
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.editRelation.label.linkFormat')}</label>
        <div className="wrap-check-radio">
          <p className="radio-item">
            <input type="radio" id={idAutomatic[0]} name={nameAutomatic[0]} value={1} checked={formatSource===1} onChange={(e) => setFormatSource(+e.target.value)}/>
            <label htmlFor={idAutomatic[0]}>{translate('dynamic-control.fieldDetail.editRelation.radio.singular')}</label>
          </p>
          <p className="radio-item">
            <input type="radio" id={idAutomatic[1]} name={nameAutomatic[0]} value={2} checked={formatSource===2} onChange={(e) => setFormatSource(+e.target.value)}/>
            <label htmlFor={idAutomatic[1]}>{translate('dynamic-control.fieldDetail.editRelation.radio.multiple')}</label>
          </p>
        </div>
      </div>
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.editRelation.label.representation')}</label>
        <div className="bg-blue-line">
          {translate('dynamic-control.fieldDetail.editRelation.info.representation1')}
          <span className="red">{getServiceName(props.serviceId)}</span>
          {translate('dynamic-control.fieldDetail.editRelation.info.representation2')}
          <span className="red">{getServiceName(props.belong)}</span>
          {translate('dynamic-control.fieldDetail.editRelation.info.representation3')}
        </div>
        <a role="button" tabIndex={0} onKeyPress={e => handleEnterDisplayPopupSource(e)} className="button-blue small" onClick={() => setDisplayPopupSource(true)}>{translate('dynamic-control.fieldDetail.editRelation.button.change')}</a>
        {displayFieldIdSource <= 0 && _.has(itemErrors, 'displayFieldIdSource') && 
        <div><span className="messenger-error">{_.get(itemErrors, 'displayFieldIdSource')}</span></div>
        }
      </div>
      {props.fieldInfoService && (displayFieldIdSource > 0 || (displayFieldsSource && displayFieldsSource.length > 0)) &&
      <div className="form-group">
        <table className="table-default">
          <tbody>
            {displayFieldIdSource > 0 &&
            <tr>
              <td align="center" className="title-table" style={{width: "100px"}}>{translate('dynamic-control.fieldDetail.displayTargetSetting.label')}</td>
              <td className="text-left"><label className="mb-0">{getFieldLabel(props.fieldInfoService.find( e => e.fieldId === displayFieldIdSource), 'fieldLabel')}</label></td>
            </tr>
            }
            {displayFieldsSource && renderDisplayFields(displayFieldsSource, props.fieldInfoService)}
          </tbody>
        </table>
      </div>}
      {props.serviceId !== props.belong && <>
      <div className="divider"/>
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.editRelation.label.linkDestinationItemSetting')}</label>
        <div className="bg-blue-line">
          <span className="red">{getServiceName(props.serviceId)}</span>
          {translate('dynamic-control.fieldDetail.editRelation.info.linkDestinationItemSetting1')}
          <span className="red">{getServiceName(props.belong)}</span>
          {translate('dynamic-control.fieldDetail.editRelation.info.linkDestinationItemSetting2')}
        </div>
      </div>
      </>}
    </>)
  }

  const renderRelationTarget = () => {
    return (<>
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.editRelation.label.linkFormat')}</label>
        <div className="wrap-check-radio">
          <p className="radio-item">
            <input type="radio" id={idAutomatic[2]} name={nameAutomatic[1]} value={1} checked={formatTarget===1} onChange={(e) => setFormatTarget(+e.target.value)}/>
            <label htmlFor={idAutomatic[2]}>{translate('dynamic-control.fieldDetail.editRelation.radio.singular')}</label>
          </p>
          <p className="radio-item">
            <input type="radio" id={idAutomatic[3]} name={nameAutomatic[1]} value={2} checked={formatTarget===2} onChange={(e) => setFormatTarget(+e.target.value)}/>
            <label htmlFor={idAutomatic[3]}>{translate('dynamic-control.fieldDetail.editRelation.radio.multiple')}</label>
          </p>
        </div>
      </div>
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.editRelation.label.representation')}</label>
        <div className="bg-blue-line">
          {translate('dynamic-control.fieldDetail.editRelation.info.representation1')}
          <span className="red">{getServiceName(props.belong)}</span>
          {translate('dynamic-control.fieldDetail.editRelation.info.representation2')}
          <span className="red">{getServiceName(props.serviceId)}</span>
          {translate('dynamic-control.fieldDetail.editRelation.info.representation3')}
        </div>
        <a tabIndex={0} onKeyPress={e => handleEnterDisplayPopupSource(e)} className="button-blue small" onClick={() => setDisplayPopupTarget(true)}>{translate('dynamic-control.fieldDetail.editRelation.button.change')}</a>
        {displayFieldIdTarget <= 0 && _.has(itemErrors, 'displayFieldIdTarget') && 
        <div><span className="messenger-error">{_.get(itemErrors, 'displayFieldIdTarget')}</span></div>
        }
      </div>
      {props.fieldInfoSelect && (displayFieldIdTarget > 0 || (displayFieldsTarget && displayFieldsTarget.length > 0)) &&
      <div className="form-group">
        <table className="table-default">
          <tbody>
            {displayFieldIdTarget > 0 &&
            <tr>
              <td align="center" className="title-table" style={{width: "100px"}}>{translate('dynamic-control.fieldDetail.displayTargetSetting.label')}</td>
              <td className="text-left"><label className="mb-0">{getFieldLabel(props.fieldInfoSelect.find( e => e.fieldId === displayFieldIdTarget), 'fieldLabel')}</label></td>
            </tr>
            }
            {displayFieldsTarget && renderDisplayFields(displayFieldsTarget, props.fieldInfoSelect)}
          </tbody>
        </table>
      </div>}
    </>)
  }

  const isCheckSaleProcess = (index) => {
    return listSelectActiveProduct.length > 0 && listSelectActiveProduct.findIndex( e => e.id === listActiveProduct[index].id) >= 0;
  }

  const renderComponentCommon = () => {
    return (<>
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.common.label.itemName')}<span className="ml-2 label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span></label>
          {fieldLabels.map((e, idx) => {
            if (!e.default) {
              return <></>
            }
            const isError = (itemErrors && _.get(itemErrors, 'fieldLabel')) || _.get(itemErrors, `fieldLabels[${idx}]`)
            return (
              <>
              <div className={`layout-input-text input-common-wrap ${isError ? 'error' : ''}`} key={idx}>
                <input key={idx} className={`input-normal w65 mr-1`}  type="text"
                  placeholder={translate('dynamic-control.fieldDetail.common.placeholder.itemName')}
                  onChange={(ev) => onChangeLanguage(ev, idx)}
                  value={e.value}
                  onBlur={(ev) => convertToKatakana(ev, idx)}/>{`(${e.name})`}
              </div>
              {isError &&
                <span className="messenger-error">{_.get(itemErrors, `fieldLabels[${idx}]`)}</span>
              }
              </>
            )
          })}
          {itemErrors && _.get(itemErrors,'fieldLabel') &&
            <span className="messenger-error">{_.get(itemErrors, 'fieldLabel')}</span>
          }
          {fieldLabels.filter(o=>o.default).length < fieldLabels.length ?
            <div><a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e, ADD_LANGUAGE)} onClick={onAddLanguage} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.showOtherLanguage')}</a></div>
            : <div><a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e, REMOVE_LANGUAGE)} onClick={onRemoveLanguage} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.hideOtherLanguage')}</a></div>
          }
      </div>
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.common.label.searchMethod')}</label>
        <div className="wrap-check-radio">
          <p className={`radio-item ${(modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE) ? 'radio-item-disable' : ''} normal`}>
            <input name={nameSearchMethodAutomatic[0]} id={idSearchMethodAutomatic[0]} type="radio"
              value={1}
              disabled={modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE}
              checked={searchMethodFlag === SEARCH_METHOD_EDITABLE}
              onChange={(ev) => onChangeSearchMethod(ev)} />
            <label htmlFor={idSearchMethodAutomatic[0]}>{translate('dynamic-control.fieldDetail.common.label.searchMethod.referenceEditable')}</label>
          </p>
          <p className={`radio-item ${(modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE) ? 'radio-item-disable' : ''} normal`}>
            <input name={nameSearchMethodAutomatic[0]} id={idSearchMethodAutomatic[1]} type="radio"
              value={2}
              disabled={modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE}
              checked={searchMethodFlag === SEARCH_METHOD_REFERENCES}
              onChange={(ev) => onChangeSearchMethod(ev)} />
            <label htmlFor={idSearchMethodAutomatic[1]}>{translate('dynamic-control.fieldDetail.common.label.searchMethod.referenceYes')}</label>
          </p>
          <p className={`radio-item ${(modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE) ? 'radio-item-disable' : ''} normal`}>
            <input name={nameSearchMethodAutomatic[0]} id={idSearchMethodAutomatic[2]} type="radio"
              value={3}
              disabled={modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE}
              checked={searchMethodFlag === SEARCH_METHOD_IMPOSSIBLE}
              onChange={(ev) => onChangeSearchMethod(ev)} />
            <label htmlFor={idSearchMethodAutomatic[2]}>{translate('dynamic-control.fieldDetail.common.label.searchMethod.useImpossible')}</label>
          </p>
        </div>
      </div>
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.common.label.modifyFlagRadio')}</label>
        <div className="wrap-check-radio">
          <p className={`radio-item ${(searchMethodFlag === SEARCH_METHOD_REFERENCES || availableFlag === AVAILABLE_FLAG.UNAVAILABLE || modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE) ? 'radio-item-disable' : ''} normal`}>
            <input name={nameCommon[0]} id={idCommon[0]} type="radio"
              value={2}
              disabled={searchMethodFlag === SEARCH_METHOD_REFERENCES || availableFlag === AVAILABLE_FLAG.UNAVAILABLE || modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE}
              checked={modifyFlagReq === 2 || modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE}
              onChange={(ev) => onChangeModifyFlag(ev)} />
            <label htmlFor={idCommon[0]}>{translate('dynamic-control.fieldDetail.common.label.modifyFlagRadio.required')}</label>
          </p>
          <p className={`radio-item ${(searchMethodFlag === SEARCH_METHOD_REFERENCES || availableFlag === AVAILABLE_FLAG.UNAVAILABLE || modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE) ? 'radio-item-disable' : ''} normal`}>
            <input name={nameCommon[0]} id={idCommon[1]} type="radio"
              value={1}
              disabled={searchMethodFlag === SEARCH_METHOD_REFERENCES || availableFlag === AVAILABLE_FLAG.UNAVAILABLE || modifyFlag === MODIFY_FLAG_REQUIRED_NOT_CHANGE}
              checked={modifyFlagReq === 1}
              onChange={(ev) => onChangeModifyFlag(ev)} />
            <label htmlFor={idCommon[1]}>{translate('dynamic-control.fieldDetail.common.label.modifyFlagRadio.any')}</label>
          </p>
        </div>
      </div>
      {(props.serviceId === FIELD_BELONG.ACTIVITY || props.serviceId === FIELD_BELONG.PRODUCT) &&
      <div className="form-group">
        <label>{translate('dynamic-control.fieldDetail.common.label.process')}</label>
        <table>
          <tbody>
            <tr>
              <td><a onClick={(e)=>onSelectActiveProduct(e, -1, 1)}>{translate('dynamic-control.fieldDetail.common.label.selectAll')}</a></td>
              <td><a onClick={(e)=>onSelectActiveProduct(e, -1, 0)}>{translate('dynamic-control.fieldDetail.common.label.releaseAll')}</a></td>
              <td><a onClick={(e)=>onSelectActiveProduct(e, -1, -1)}>{translate('dynamic-control.fieldDetail.common.label.selectInvert')}</a></td>
            </tr>
            {_.range(Math.ceil(listActiveProduct.length / 3)).map( (m, index) =>
            <tr key={index}>
            {_.range(3).map( (n, idx) =>
              <td key={index * 3 + idx}>
                {(listActiveProduct.length > index * 3 + idx) &&
                <label className="icon-check">
                  <input type="checkbox" key={index * 3 + idx}
                    checked={isCheckSaleProcess(index * 3 + idx)}
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
        </table>
      </div>}
    </>)
  }

  const renderPopupSelectField = () => {
    if (!displayPopupSource && !displayPopupTarget) {
      return <></>
    }
    return (
      <RelationSelectField
        fieldIdTarget={displayPopupSource ? fieldIdRelation : props.fieldInfo.fieldId}
        isMultiSelect={displayPopupSource ? formatSource === 2 : formatTarget === 2}
        displayTab={displayPopupSource ? displayTabSource : displayTabTarget}
        displayFieldId={displayPopupSource ? displayFieldIdSource : displayFieldIdTarget}
        displayFields={displayPopupSource ? displayFieldsSource : displayFieldsTarget}
        listField={displayPopupSource ? props.fieldInfoService : props.fieldInfoSelect}
        fieldSubRelation={fieldSubRelation}
        onCloseRelationSelectField={onClosePopopSelectField}
        onSaveRelationSelectField={onChangeSelectFields}
      />)
  }

  const renderComponent = () => {
    if (!props.serviceId) {
      return <></>
    }
    return (
      <>
        {renderRelationSource()}
        {props.serviceId !== props.belong && renderComponentCommon()}
        {props.serviceId !== props.belong && renderRelationTarget()}
        {renderPopupSelectField()}
      </>
    )
  }
  return renderComponent();
});

const mapStateToProps = ({ dynamicField }: IRootState, ownProps: IFieldDetailEditRelationProps) => {
  const id = `${ownProps.serviceId}_${DEFINE_FIELD_TYPE.RELATION}`;
  const subRelationId = `${ownProps.serviceId}_${DEFINE_FIELD_TYPE.RELATION}_subRelationId`
  const stateObject = {
    action: null,
    errorMessage: null,
    productTypes: null,
    activities: null,
    fieldSubRelation: [],
  }
  if (dynamicField && dynamicField.data.has(id)) {
    stateObject.action = dynamicField.data.get(id).action;
    stateObject.errorMessage = dynamicField.data.get(id).errorMessage;
    stateObject.productTypes = dynamicField.data.get(id).productTypes;
    stateObject.activities = dynamicField.data.get(id).activities;
  }
  if (dynamicField && dynamicField.data.has(subRelationId)) {
    stateObject.fieldSubRelation = dynamicField.data.get(subRelationId).fieldInfo
  }
  return stateObject
};

const mapDispatchToProps = {
  getActivityFormats,
  getProductTypes,
  getFieldsInfo,
  reset,
};

const options = {forwardRef: true};

export default connect<IRelationStateProps, IRelationDispatchProps, IFieldDetailEditRelationProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(FieldDetailEditRelation);

