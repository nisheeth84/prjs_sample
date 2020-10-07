import React, { useImperativeHandle, forwardRef, useRef, useEffect, useState } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE, FIELD_MAXLENGTH } from '../../constants';
import { Storage, translate } from 'react-jhipster';
import { languageCode } from 'app/config/language-code';
import _ from 'lodash';
import StringUtils, { getFieldLabel, forceArray, jsonParse, toKatakana } from 'app/shared/util/string-utils';

interface IFieldDetailEditLookupOwnProps {
  service?: { serviceId: number, serviceName: {} }
  fieldInfoService?: any[],
  allFields?: any;
  editFieldInfo?: any;
}

type IFieldDetailEditLookupProps = IDynamicFieldProps & IFieldDetailEditLookupOwnProps

const TargetFieldSelectOption = (props: { key: any, isError?: boolean, disable: boolean, value: any, listOption: { value, label }[], onChange: (valueId: any) => void }) => {
  const [value, setValue] = useState(null)
  const [showOption, setShowOption] = useState(false)
  const ddOptions = useRef(null);

  const handleUserMouseDown = (event) => {
    if (ddOptions && ddOptions.current && !ddOptions.current.contains(event.target)) {
      setShowOption(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, [])

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const onSelectOption = (val) => {
    setValue(val);
    setShowOption(false)
    if (props.onChange) {
      props.onChange(val);
    }
  }

  const getDisplayLabel = () => {
    const idx = props.listOption.findIndex(e => e.value === value)
    if (idx < 0) {
      return translate("dynamic-control.fieldDetail.editLookup.defaultSelect");
    }
    return props.listOption[idx].label;
  }

  return (
    <div className="select-option gray w100 mb-1" key={props.key}>
      {props.disable && <span className={`select-text ${props.isError ? 'error' : ''}`}>{getDisplayLabel()}</span>}
      {!props.disable && <span className={`select-text ${props.isError ? 'error' : ''}`} onClick={() => setShowOption(!showOption)} >{getDisplayLabel()}</span>}
      {showOption &&
        <ul className={"drop-down drop-down2"} ref={ddOptions}>
          {props.listOption.map((e, idx) =>
            <li key={idx} className={`item ${e.value === props.value ? 'active' : ''} smooth`}
              onClick={() => onSelectOption(e.value)}
            >
              {e.label}
            </li>
          )}
        </ul>
      }
    </div>
  )
};

const FieldDetailEditLookup = forwardRef((props: IFieldDetailEditLookupProps, ref) => {
  const [fieldInfoList, setFieldInfoList] = useState([])
  const [fieldIdSearch, setFieldIdSearch] = useState(0);
  const [showFieldsSearch, setShowFieldsSearch] = useState(false)
  const [itemsReflect, setItemsReflect] = useState([])
  const [listFieldOption, setListFieldOption] = useState([]);
  const [errorItemsReflect, setErrorItemsReflect] = useState([]);
  const [errorEntry, setErrorEntry] = useState(false);
  const [deletedReflectIds, ] = useState([]);

  const ddFieldsSearch = useRef(null)

  /**
 * Check duplicate of item.
 * @param arrLanguage 
 */
  const checkItemForAnOption = (arrLanguage) => {
    const fieldLabelError = [];
    const fieldLanguageError = [];
    const indexError = [];
    if (Array.isArray(arrLanguage) && arrLanguage.length > 0) {
      const languageOfField = Object.keys(arrLanguage[0]);
      for (let i = 0; i < arrLanguage.length; i++) {
        languageOfField.forEach((e) => {
          for (let j = (i + 1); j < arrLanguage.length; j++) {
            if (arrLanguage[i][e].value === arrLanguage[j][e].value && !_.isEmpty(arrLanguage[j][e].value)) {
              fieldLabelError.push(arrLanguage[j][e].value);
              fieldLanguageError.push(arrLanguage[j][e].code);
              indexError.push(j);
            }
          }
        })
      }
    }
    return { fieldLabelError, fieldLanguageError, indexError }
  }

  const convetFieldLable = (fieldLabel) => {
    const objLabel = {};
    const labels = forceArray(fieldLabel);
    labels.forEach(item => {
      objLabel[item.code] = item.value;
    })
    return objLabel;
  }

  useImperativeHandle(ref, () => ({
    validate() {
      const errorList = [];
      const lstLanguageOption = [];
      itemsReflect.forEach((el, idx) => {
        lstLanguageOption.push(el.fieldInfoSource.fieldLabel);
        const countAllLanguage = el.fieldInfoSource.fieldLabel.length;
        const isEmptyLabel = el.fieldInfoSource.fieldLabel.filter(label => _.isEmpty(label.value)).length === countAllLanguage;
        const isEmptyReflect = (el.fieldInfoTargetId <= 0);
        if (isEmptyLabel || isEmptyReflect) {
          const error = { recordId: idx, label: [], reflect: [] };
          if (isEmptyLabel) {
            error.label.push(translate("messages.ERR_COM_0013"));
          }
          if (isEmptyReflect) {
            error.reflect.push(translate("messages.ERR_COM_0014"));
          }
          errorList.push(error)
        }
        // check maxlength
        el.fieldInfoSource.fieldLabel.forEach(language => {
          if (language.value.length > FIELD_MAXLENGTH.fieldLabel) {
            errorList.push({ 
              recordId: idx, 
              label: [ translate("messages.ERR_COM_0025", [FIELD_MAXLENGTH.fieldLabel])], 
              languageError: language.code ,
              type: 'maxlength',
              reflect: []});
          }
        });

        if (props.allFields) {
          const allFields = _.cloneDeep(props.allFields.filter(e => !deletedReflectIds.includes(e.fieldId)));
          allFields.push(props.editFieldInfo);
          allFields.forEach(field => {
            const copyEl = { 
              ... el.fieldInfoSource,
              fieldLabel: convetFieldLable(el.fieldInfoSource.fieldLabel)
            }
            // const duplicateLang = duplicateLable(field, copyEl);
            const labelFirst = _.isString(field.fieldLabel) ? jsonParse(field.fieldLabel) : field.fieldLabel;
            const labelSecond = _.isString(copyEl.fieldLabel) ? jsonParse(copyEl.fieldLabel) : copyEl.fieldLabel;
            const langs = Object.keys(labelFirst);
            const duplicateLang = [];
            langs.forEach(itemLang => {
              const first = labelFirst[itemLang];
              const second = labelSecond[itemLang];
              if (!_.isEmpty(first) && _.isEqual(first, second) && !_.isEqual(field.fieldId, copyEl.fieldId)) {
                duplicateLang.push(itemLang);
              }
            });
            if (duplicateLang && duplicateLang.length > 0) {
              const fieldName = getFieldLabel(field, 'fieldLabel');
              duplicateLang.forEach((dLang) => {
                const language = el.fieldInfoSource.fieldLabel.filter(e => _.isEqual(e.code, dLang))[0]?.name;
                const isExistRecord = errorList.findIndex(e => e.recordId === idx)
                if (isExistRecord >= 0) {
                  errorList[isExistRecord].label = [translate('messages.ERR_COM_0065',[fieldName, language])]
                  errorList[isExistRecord].languageError = dLang
                  errorList[isExistRecord].type = 'duplicateLang'
                } else {
                  errorList.push({ 
                    recordId: idx, 
                    label: [StringUtils.translateSpecial('messages.ERR_COM_0065', [fieldName, language])],
                    languageError: dLang,
                    type: 'duplicateLang',
                    reflect: []});
                }
                })
            }
          });
        }
      })
      const indexErrorDuplicate = checkItemForAnOption(lstLanguageOption).indexError;
      // To do for check language if you want to hint error language. 
      const fieldLanguageDuplicate = checkItemForAnOption(lstLanguageOption).fieldLanguageError;
      const fieldLabelDuplicate = checkItemForAnOption(lstLanguageOption).fieldLabelError;
      for (let k = 0; k < indexErrorDuplicate.length; k++) {
        const isExistRecord = errorList.findIndex(e => e.recordId === indexErrorDuplicate[k])
        if (isExistRecord >= 0) {
          errorList[isExistRecord].label = [translate('messages.ERR_COM_0062')]
        } else {
          errorList.push({ recordId: indexErrorDuplicate[k], label: [translate('messages.ERR_COM_0062')], labelValue: fieldLabelDuplicate[k], languageError: fieldLanguageDuplicate[k] })
        }
      }
      if(fieldIdSearch === 0) {
        setErrorEntry(true);
        const error = { recordId: 0, label: [], reflect: [] };
        error.label.push(("messages.ERR_COM_0014"));
        errorList.push(error);
      } 
      setErrorItemsReflect(errorList);
      return errorList;
    },
  }));

  /**
   * Check doplicate item
   * @param labelValue 
   * @param rowId 
   * @param language 
   */
  const isDuplicateError = (labelValue, rowId, language) => {
    let isError = false;
    let mess = "";
    const errorItem = errorItemsReflect.find(e => e.recordId === rowId && e.languageError === language);
    if (errorItem === undefined) {
      isError = false;
    } else {
      isError = errorItem.labelValue === labelValue;
      mess = errorItem.label[0];
    }
    return { isError, mess }
  }

  const maxlengthError = (rowId, language) => {
    let isError = false;
    let mess = "";
    const errorItem = errorItemsReflect.find(e => e.recordId === rowId && e.languageError === language);
    if (errorItem === undefined) {
      isError = false;
    } else {
      isError = true;
      mess = errorItem.label[0];
    }
    return { isError, mess }
  }

  const lang = Storage.session.get('locale', 'ja_jp');

  const getFieldLabelDefault = () => {
    const fieldLabels = []
    languageCode.forEach((e, i) => {
      const idx = fieldLabels.findIndex(o => o.code === e.code);
      if (idx < 0) {
        fieldLabels.push({ code: e.code, name: e.name, default: false, value: '' })
      }
    });
    const nativeIdx = fieldLabels.findIndex(e => e.code === lang);
    if (nativeIdx >= 0) {
      const nativeLabel = fieldLabels.splice(nativeIdx, 1)[0];
      fieldLabels.splice(0, 0, nativeLabel);
    }
    return fieldLabels
  }

  const initialize = () => {
    const fieldLabel = getFieldLabelDefault();
    const itemRefectDefault = {
      fieldInfoSource: { fieldId: null, fieldLabel, fieldType: null },
      fieldInfoTargetId: null,
    }

    if (props.fieldInfo.lookupData) {
      if (props.fieldInfo.lookupData.searchKey) {
        setFieldIdSearch(+props.fieldInfo.lookupData.searchKey);
      }
      if (props.fieldInfo.lookupData.itemReflect && _.isArray(props.fieldInfo.lookupData.itemReflect)) {
        props.fieldInfo.lookupData.itemReflect.forEach((e, idx) => {
          const itemReflect = _.cloneDeep(itemRefectDefault);
          itemReflect.fieldInfoSource.fieldId = e.fieldId
          let fLabel = null;
          try {
            fLabel = _.isString(e.fieldLabel) ? JSON.parse(e.fieldLabel) : e.fieldLabel
          } catch {
            fLabel = e.fieldLabel;
          }
          for (const label in fLabel) {
            if (!Object.prototype.hasOwnProperty.call(fLabel, label)) {
              continue;
            }
            const labelIdx = itemReflect.fieldInfoSource.fieldLabel.findIndex(o => o.code === label)
            if (labelIdx >= 0) {
              itemReflect.fieldInfoSource.fieldLabel[labelIdx].default = true
              itemReflect.fieldInfoSource.fieldLabel[labelIdx].value = fLabel[label]
            }
          }
          itemReflect.fieldInfoTargetId = e.itemReflect
          itemsReflect.push(itemReflect);
        })
      }
    } else {
      itemRefectDefault.fieldInfoSource.fieldLabel[0].default = true
      itemRefectDefault.fieldInfoSource.fieldId = Math.round(Math.random() * 10000) * -1;
      itemsReflect.push(itemRefectDefault);
    }
    setItemsReflect(_.cloneDeep(itemsReflect))
  }

  const getFieldNameSearch = (searchId : number) => {
    let serviceName = translate("dynamic-control.fieldDetail.editLookup.defaultSelect");
    if (searchId === 0) {
      return serviceName;
    }
    const idx = fieldInfoList.findIndex(e => e.fieldId === fieldIdSearch);
    if (idx >= 0) {
      serviceName = getFieldLabel(fieldInfoList[idx], 'fieldLabel')
    }
    return serviceName;
  }

  const handleUserMouseDown = (event) => {
    if (ddFieldsSearch && ddFieldsSearch.current && !ddFieldsSearch.current.contains(event.target)) {
      setShowFieldsSearch(false);
    }
  };

  const onChangeLanguage = (ev, itemIdx, languageIdx) => {
    if (ev.target.value.length <= FIELD_MAXLENGTH.fieldLabel) {
    itemsReflect[itemIdx].fieldInfoSource.fieldLabel[languageIdx].value = ev.target.value;
    setItemsReflect(_.cloneDeep(itemsReflect))
    }
  }

  const convertToKatakana = (ev, itemIdx, languageIdx) => {
    if (ev.target.value.length <= FIELD_MAXLENGTH.fieldLabel) {
    itemsReflect[itemIdx].fieldInfoSource.fieldLabel[languageIdx].value = toKatakana(ev.target.value);
    setItemsReflect(_.cloneDeep(itemsReflect))
    }
  }

  const onSelectFieldTarget = (itemIdx: number, value: any) => {
    itemsReflect[itemIdx].fieldInfoTargetId = value;
    const fieldIdx = fieldInfoList.findIndex(e => e.fieldId === value)
    if (fieldIdx >= 0) {
      itemsReflect[itemIdx].fieldInfoSource.fieldType = fieldInfoList[fieldIdx].fieldType;
    }
    setItemsReflect(_.cloneDeep(itemsReflect))
  }

  const onAddMoreLanguage = (itemIndex: number) => {
    // const idx = itemsReflect[itemIndex].fieldInfoSource.fieldLabel.findIndex( e => !e.default);
    // if (idx >= 0) {
    //   itemsReflect[itemIndex].fieldInfoSource.fieldLabel[idx].default = true;
    //   itemsReflect[itemIndex].fieldInfoSource.fieldLabel[idx].value = '';
    //   setItemsReflect(_.cloneDeep(itemsReflect))
    // }
    itemsReflect[itemIndex].fieldInfoSource.fieldLabel.forEach(el => {
      el.default = true;
    })
    setItemsReflect(_.cloneDeep(itemsReflect))
  }

  const onRemoveLanguage = (itemIndex: number) => {
    itemsReflect[itemIndex].fieldInfoSource.fieldLabel.forEach(el => {
      if (el.code !== lang) {
        el.default = false;
        // el.value = '';
      }
    })
    setItemsReflect(_.cloneDeep(itemsReflect))
  }

  const onAddItemRefect = (itemIndex: number) => {
    const fieldLabel = getFieldLabelDefault();
    fieldLabel[0].default = true
    const itemRefectDefault = {
      fieldInfoSource: { fieldId: null, fieldLabel },
      fieldInfoTargetId: null,
    }
    itemRefectDefault.fieldInfoSource.fieldId = Math.round(Math.random() * 10000) * -1;
    itemsReflect.splice(itemIndex + 1, 0, itemRefectDefault)
    setItemsReflect(_.cloneDeep(itemsReflect))
    const newErrors = errorItemsReflect.map(err => {
      if (err.recordId > itemIndex) {
        return { ... err, recordId: err.recordId + 1 }
      } else {
        return err;
      }
    });
    setErrorItemsReflect(_.cloneDeep(newErrors));
  }

  const onDeleteItemRefect = (itemIndex: number) => {
    if (_.get(itemsReflect[itemIndex], 'fieldInfoSource.fieldId')) {
      deletedReflectIds.push(_.get(itemsReflect[itemIndex], 'fieldInfoSource.fieldId'));
    }
    if (itemsReflect.length === 1) {
      const fieldLabel = getFieldLabelDefault();
      fieldLabel[0].default = true
      itemsReflect[0].fieldInfoSource.fieldId = Math.round(Math.random() * 10000) * -1;
      itemsReflect[0].fieldInfoSource.fieldLabel = fieldLabel;
      itemsReflect[0].fieldInfoTargetId = null;
    } else {
      itemsReflect.splice(itemIndex, 1);
    }
    const newErrors = [];
    errorItemsReflect.forEach(err => {
      if (err.recordId !== itemIndex) {
        newErrors.push(err);
      }
    })
    setErrorItemsReflect(_.cloneDeep(newErrors));
    setItemsReflect(_.cloneDeep(itemsReflect))
  }

  const isAvaiableFieldLookup = (field: any) => {
    const type = _.toString(field.fieldType);
    let available = false;
    const fieldAllow = (type !== DEFINE_FIELD_TYPE.TAB &&
      type !== DEFINE_FIELD_TYPE.FILE &&
      type !== DEFINE_FIELD_TYPE.OTHER &&
      type !== DEFINE_FIELD_TYPE.LOOKUP &&
      type !== DEFINE_FIELD_TYPE.RELATION &&
      type !== DEFINE_FIELD_TYPE.SELECT_ORGANIZATION)
    if (fieldAllow) {
      if (field.isDefault === true && (type === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX ||
        type === DEFINE_FIELD_TYPE.RADIOBOX || type === DEFINE_FIELD_TYPE.CHECKBOX)) {
        available = false;
      } else {
        available = true;
      }
    }
    return available;
  }



  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    initialize()
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, [])

  useEffect(() => {
    if (props.fieldInfoService) {
      setFieldInfoList(props.fieldInfoService.filter(e => isAvaiableFieldLookup(e) === true))
    } else {
      setFieldInfoList([])
    }
  }, [props.fieldInfoService])

  const canCopy = (field) => {
    if (field && _.toString(field.fieldType) === DEFINE_FIELD_TYPE.CALCULATION) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (fieldInfoList.length > 0) {
      if (fieldInfoList.findIndex(e => e.fieldId === fieldIdSearch) < 0) {
        setFieldIdSearch(0)
      }
      itemsReflect.forEach((e, idx) => {
        const fIdx = fieldInfoList.findIndex(o => o.fieldId === e.fieldInfoTargetId)
        if (fIdx < 0) {
          itemsReflect[idx].fieldInfoTargetId = null;
        }
      })
      setItemsReflect(_.cloneDeep(itemsReflect))
      const tmp = []
      fieldInfoList.filter(e => canCopy(e)).forEach((e) => {
        tmp.push({ value: e.fieldId, label: getFieldLabel(e, 'fieldLabel') })
      })
      setListFieldOption(tmp)
    }
  }, [fieldInfoList])

  useEffect(() => {
    if (props.updateStateElement) {
      const lookupData = {}
      lookupData['fieldBelong'] = props.service.serviceId
      lookupData['searchKey'] = fieldIdSearch
      const itemReflect = []
      itemsReflect.forEach((e, idx) => {
        const fieldLabel = {}
        e.fieldInfoSource.fieldLabel.forEach((o, i) => {
          if (o.default) {
            fieldLabel[o.code] = o.value;
          }
        });
        itemReflect.push({ fieldId: e.fieldInfoSource.fieldId, fieldLabel, fieldType: e.fieldInfoSource.fieldType, itemReflect: e.fieldInfoTargetId })
      });
      lookupData['itemReflect'] = itemReflect
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, { lookupData })
    }
  }, [fieldIdSearch, itemsReflect])

  const isItemError = (recordId: number, item: string, language?: string) => {
    if (errorItemsReflect && errorItemsReflect.length > 0) {
      let idx;
      if(language) {
        idx = errorItemsReflect.findIndex(e => e.recordId === recordId && (e.languageError === language || _.isNil(e.languageError)));
      } else {
        idx = errorItemsReflect.findIndex(e => e.recordId === recordId);
      }
      if (idx < 0) {
        return false;
      }
      if (errorItemsReflect[idx][item] && errorItemsReflect[idx][item].length > 0) {
        return true;
      }
    }
    return false;
  }

  const ADD = 'add'
  const REMOVE = 'remove'
  const REFECT = 'refect'
  const LANGUAGE = 'language'

  const handleEnterKey = (event, mode, item , idx) => {
    if (event.key === 'Enter') {
      if (mode === ADD) {
        if(item === REFECT){
          onAddItemRefect(idx);
        }else if(item === LANGUAGE){
          onAddMoreLanguage(idx);
        }
      }else if(mode === REMOVE){
        if(item === REFECT){
          onDeleteItemRefect(idx);
        }else if(item === LANGUAGE){
          onRemoveLanguage(idx);
        }
      }
    }
  }

  const isEmptyFieldLabel = (fLabel) => {
    if (_.isNil(fLabel)) {
      return true;
    }
    let nolabel = true;
    fLabel.forEach(label => {
      if (label.value) {
        nolabel = false;
      }
    });
    return nolabel;
  }

  const renderErrorReflect = (recordId: number, isLabel: boolean) => {
    if (!errorItemsReflect || errorItemsReflect.length < 1) {
      return <></>
    }
    const erIdx = errorItemsReflect.findIndex(e => e.recordId === recordId);
    if (erIdx < 0) {
      return <></>;
    }
    return (
      <>
          {isLabel && itemsReflect[recordId]
           && errorItemsReflect[erIdx].label.map((e, i) =>
          <div className="messenger-error"key={i}>{e}</div>
          )}
          {!isLabel && itemsReflect[recordId] && 
            (itemsReflect[recordId].fieldInfoTargetId <= 0) && 
            errorItemsReflect[erIdx] && 
            errorItemsReflect[erIdx].reflect &&
            errorItemsReflect[erIdx].reflect.map((e, i) =>
            <div className="messenger-error"key={i}>{e}</div>
          )}
      </>
    )
  }

  const notTypeSelet = (field) => {
    const type = field.fieldType.toString();
    return type !== DEFINE_FIELD_TYPE.MULTI_SELECTBOX &&
    type !== DEFINE_FIELD_TYPE.SINGER_SELECTBOX &&
    type !== DEFINE_FIELD_TYPE.CHECKBOX &&
    type !== DEFINE_FIELD_TYPE.RADIOBOX;
  }

  const prefix = "dynamic-control.fieldDetail.editLookup.";
  return (
    <>
      <div className="form-group">
        <label>{translate(prefix + 'searchEntry')}<span className="ml-2 label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span></label>
        <div className="select-option gray">
          <span className={`select-text ${errorEntry ? 'error' : ''}`}
            onClick={() => setShowFieldsSearch(!showFieldsSearch)}
          >
            {getFieldNameSearch(fieldIdSearch)}
          </span>
          {showFieldsSearch && fieldInfoList &&
            <div ref={ddFieldsSearch} className="drop-down drop-down2">
              <ul>
                {fieldInfoList.filter(e => notTypeSelet(e)).map((e, idx) =>
                  <li key={idx} className={`item ${fieldIdSearch === e.fieldId ? 'active' : ''} smooth`}
                    onClick={() => { setFieldIdSearch(e.fieldId); setShowFieldsSearch(false); setErrorEntry(false) }}
                  >
                    <div className="text text2">{StringUtils.escapeSpaceHtml(getFieldLabel(e, 'fieldLabel'))}</div>
                  </li>
                )}
              </ul>
            </div>
          }
        </div>
        {errorEntry && <span className="messenger-error">{translate("messages.ERR_COM_0014")}</span>}
      </div>
      {itemsReflect.map((e, idx) =>
        <div className="form-group" key={idx}>
          <div className="d-flex d-flex-select option-language">
            <div className=" w46">
              <div>{translate(prefix + 'labelName')}<span className="ml-2 label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span></div>
              {e.fieldInfoSource.fieldLabel.map((o, jdx) => {
                if (!o.default) {
                  return <></>
                }
                // let isLabelError = errorItemsReflect[0] && !("labelValue" in errorItemsReflect[0]) ?
                //   (_.isEmpty(o.value) && isItemError(idx, 'label')) :
                //   (isDuplicateError(o.value, idx, o.code).isError
                //   );
                // let msgErr = isDuplicateError(o.value, idx, o.code).mess;
                // if (!isLabelError) {
                //   isLabelError = maxlengthError(idx, o.code).isError;
                //   msgErr = maxlengthError(idx, o.code).mess;
                // }
                const maxLengthCheck = maxlengthError(idx, o.code);
                let isError = maxLengthCheck.isError;
                let msgErr = maxLengthCheck.mess;
                if (!isError) {
                  const duplicateCheck = isDuplicateError(o.value, idx, o.code);
                  isError = errorItemsReflect[0] && !("labelValue" in errorItemsReflect[0]) ?
                            isItemError(idx, 'label', o.code) : duplicateCheck.isError;
                  msgErr = duplicateCheck.mess;
                }
                return (
                  <>
                    <div className={`d-flex align-items-center mb-1 input-common-wrap ${isError ? 'error' : ''}`}>
                      <input key={idx * 200 + jdx} className={`input-normal`} type="text"
                        onChange={(ev) => onChangeLanguage(ev, idx, jdx)}
                        value={o.value}
                        onBlur={(ev) => convertToKatakana(ev, idx, jdx)}/>
                      <span className="white-space-nowrap w50">{`(${o.name})`}</span>
                    </div>
                    {/* {isError && !_.isNil(msgErr) &&
                      <>
                        <span className="messenger-error">{msgErr}</span>
                      </>
                    } */}
                  </>
                )
              })}
              {renderErrorReflect(idx, true)}
            </div>
            <div className=" w32 ml-2">
              <div>{translate(prefix + 'itemsToReflect')}<span className="ml-2 label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span></div>
              <TargetFieldSelectOption
                key={idx}
                isError={(e.fieldInfoTargetId <= 0) && isItemError(idx, 'reflect')}
                disable={e.fieldInfoSource.fieldId > 0}
                value={e.fieldInfoTargetId}
                listOption={listFieldOption}
                onChange={(val) => onSelectFieldTarget(idx, val)}
              />
              {renderErrorReflect(idx, false)}
            </div>
            <div className="btn-group">
              <a role="button" tabIndex={0} onKeyPress={event => handleEnterKey(event, ADD, REFECT, idx)} onClick={() => onAddItemRefect(idx)} ><img src="../../../content/images/common/ic-select-add.svg" /></a>
              {(itemsReflect.length > 1 || 
                  (itemsReflect.length === 1 && 
                    ((e.fieldInfoSource && !isEmptyFieldLabel(e.fieldInfoSource.fieldLabel)) || e.fieldInfoTargetId)
                )) &&
                <a role="button" tabIndex={0} onKeyPress={event => handleEnterKey(event, REMOVE, REFECT, idx)} onClick={() => onDeleteItemRefect(idx)} className="ml-3"><img src="../../../content/images/common/ic-select-remove.svg" /></a>
              }
            </div>
          </div>
          {e.fieldInfoSource.fieldLabel.filter(o=>o.default).length < e.fieldInfoSource.fieldLabel.length ?
          <a role="button" tabIndex={0} onKeyPress={event => handleEnterKey(event, ADD, LANGUAGE, idx)}  onClick={() => onAddMoreLanguage(idx)} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.showOtherLanguage')}</a>
          : <a role="button" tabIndex={0} onKeyPress={event => handleEnterKey(event, REMOVE, LANGUAGE, idx)}  onClick={() => onRemoveLanguage(idx)} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.hideOtherLanguage')}</a>
        }
        </div>
      )}
    </>
  );
});

export default FieldDetailEditLookup
