import React, { useState, useEffect, forwardRef, useRef, useMemo, createRef } from 'react';
import { ControlType, FIELD_BELONG } from 'app/config/constants';

import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Options, connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import {
  getServicesInfo,
  getFieldsInfo,
  getFieldsInfoService,
  getSuggestLookup,
  DynamicFieldAction,
  reset,
} from 'app/shared/reducers/dynamic-field.reducer';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import FieldDisplayBox from '../view/field-display-box';
import StringUtils, { getPlaceHolder, forceArray } from 'app/shared/util/string-utils';
import { getValueProp } from 'app/shared/util/entity-utils';
import SearchAddSuggest from 'app/shared/layout/common/suggestion/search-add-suggest/search-add-suggest';
import { TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import IconLoading from 'app/shared/layout/common/suggestion/other/icon-loading';
import { DEFINE_FIELD_TYPE } from '../../constants';
import { getSuggestCss } from 'app/shared/layout/common/suggestion/sugesstion-helper';

type IFieldEditLookupOwnProps = IDynamicFieldProps

interface IFieldEditLookupDispatchProps {
  getServicesInfo,
  getFieldsInfo,
  getFieldsInfoService,
  getSuggestLookup,
  reset
}

interface IFieldEditLookupStateProps {
  action,
  errorMessage,
  fieldInfoSelect,
  fieldInfoService,
  serviceInfo,
  lookupData,
}

type IFieldEditLookupProps = IFieldEditLookupDispatchProps  & IFieldEditLookupStateProps & IFieldEditLookupOwnProps

const FieldEditLookup: React.FC<IFieldEditLookupProps> = forwardRef((props: IFieldEditLookupProps, ref) => {
  const LIMIT_RECORD = 10
  const [showSuggest, setShowSuggest] = useState(false)
  const [textValue, setTextValue] = useState('');
  const [fieldBelong, setFieldBelong] = useState(null)
  const [searchKeyReflect, setSearchKeyReflect] = useState(null);
  const [itemReflect, setItemReflect] = useState([]);
  const [listField, setListField] = useState([]);
  const [listFieldReflect, setListFieldReflect] = useState([]);
  const [listSuggest, setListSuggest] = useState([]);
  const [offset, setOffset] = useState(0);
  const [oldTextSearch, setOldTextSearch] = useState('');
  const [oldLimit, setOldLimit] = useState(0);
  const [lookupValue, setLookupValue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusText, setIsFocusText] = useState(false);
  const textboxRefEdit = useRef(null);
  const suggestBottomRef = useRef(null);
  const typeSelects = [
    DEFINE_FIELD_TYPE.SINGER_SELECTBOX,
    DEFINE_FIELD_TYPE.MULTI_SELECTBOX,
    DEFINE_FIELD_TYPE.CHECKBOX,
    DEFINE_FIELD_TYPE.RADIOBOX,
  ];

  const suggestRef = useRef(null)

  const inputRefs = useMemo(() => Array.from({ length: listField.length }).map(() => createRef<any>()), [listField]);

  const {fieldInfo} = props;
  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }
  const idControl = `${props.belong}_${fieldInfo.fieldId}`;

  const initilize = () => {
    props.getFieldsInfo(idControl, props.belong, null, null)
    if (props.fieldInfo.lookupData) {
      if (props.fieldInfo.lookupData.fieldBelong) {
        const lookupService = _.toNumber(props.fieldInfo.lookupData.fieldBelong)
        setFieldBelong(lookupService)
        props.getFieldsInfoService(idControl, lookupService, null, null)
      }
      if (props.fieldInfo.lookupData.searchKey) {
        setSearchKeyReflect(props.fieldInfo.lookupData.searchKey)
      }
      if (props.fieldInfo.lookupData.itemReflect) {
        setItemReflect(props.fieldInfo.lookupData.itemReflect)
      }
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

  const requestLookupData = (startRecord: number, limit?: number) => {
    if (!props.fieldInfoService || props.fieldInfoService.length < 1) {
      return;
    }
    const field = _.find(props.fieldInfoService, { fieldId: searchKeyReflect});
    if (_.isNil(field)) {
      return;
    }
    setIsLoading(true);
    field['fieldValue'] = textValue;
    props.getSuggestLookup(idControl, fieldBelong, field, startRecord, limit > 0 ? limit : LIMIT_RECORD);
    setOldTextSearch(textValue);
  }

  const getItemOrderByValue = (field, val) => {
    const forceVal = forceArray(val, val);
    const isArray = _.isArray(forceVal);
    const defaultOrder = isArray ? [] : -1;
    try {
      let order = defaultOrder;
      field.fieldItems.forEach(item => {
        if (_.isArray(order) && forceVal.includes(item.itemId)) {
          order.push(item.itemOrder);
        } else if (!_.isArray(order) && _.toString(item.itemId) === _.toString(forceVal)) {
          order = item.itemOrder;
        }
      });
      return order;
    } catch {
      return defaultOrder;
    }
  }

  const getItemSelectedByOrder = (field, order) => {
    const isArray = _.isArray(order);
    const defaultItem = isArray ? [] : null;
    try {
      let selected = defaultItem;
      field.fieldItems.forEach(item => {
        if (_.isArray(selected) && order.includes(item.itemOrder)) {
          selected.push(item);
        } else if (!_.isArray(selected) && item.itemOrder === order) {
          selected = item.itemId;
        }
      });
      return selected;
    } catch {
      return defaultItem;
    }
  }

  const mappingItemIdSelect = (fieldIn, inVal) => {
    try {
      const order = getItemOrderByValue(fieldIn, inVal);
      const idReflect = itemReflect.filter(e => e.itemReflect === fieldIn.fieldId)[0].fieldId;
      const fieldOut = listField.filter(e => e.fieldId === idReflect)[0];
      const outVal = getItemSelectedByOrder(fieldOut, order);
      return outVal || inVal;
    } catch {
      return inVal;
    }
  }

  const specialFieldMapping = {
    '2' : {
      'schedule_name': 'itemName',
      'address': 'addressName',
      'note': 'memo'
    },
    '15' : {
      'created_date': 'taskCreatedDate',
      'updated_date': 'taskUpdatedDate'
    },
    '4' : {
      'address': 'addressName',
    },
  }

  const getSpecial = (field, record) => {
    const fName = _.get(specialFieldMapping, `${field.fieldBelong}.${field.fieldName}`);
    if (_.isEqual(fName, 'schedule_name') && record.itemType !== 3) {
      return null;
    }
    return getValueProp(record, fName) || null;
  }

  const getValueFieldFromRecord = (field, record) => {
    let value = null;
    if (_.isNil(field)) {
      return value;
    }
    value = getSpecial(field, record);
    if(field.isDefault) {
      value = getSpecial(field, record);
      if(!value) {
        for(const p in record) {
          if (Object.prototype.hasOwnProperty.call(record, p) && StringUtils.equalPropertyName(p, field.fieldName)) {
            value = getValueProp(record, p)
          }
        }
      }
    } else {
      for(const prop in record) {
        if (Object.prototype.hasOwnProperty.call(record, prop)) {
          if (_.isArray(record[prop])) {
            record[prop].forEach((e, idx) => {
              if (StringUtils.equalPropertyName(_.get(e, 'key'), field.fieldName)) {
                value = _.get(e, 'value')
              }
            });
          } else {
            for(const p in record[prop]) {
              if (Object.prototype.hasOwnProperty.call(record[prop], p) && StringUtils.equalPropertyName(p, field.fieldName)) {
                value = getValueProp(record[prop], p)
              }
            }
          }
        }
      }
    }
    return value;
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
    if (itemReflect.length > 0 &&
        props.fieldInfoSelect && props.fieldInfoSelect.length > 0 &&
        props.fieldInfoService && props.fieldInfoService.length > 0 ) {
      const fields = []
      const fieldsReflect = [];
      itemReflect.forEach( e => {
        const idx = props.fieldInfoSelect.findIndex(o => o.fieldId === e.fieldId);
        const idxReflect = props.fieldInfoService.findIndex(o => o.fieldId === e.itemReflect);
        if (idx >= 0 && idxReflect >= 0) {
          fields.push(props.fieldInfoSelect[idx])
          fieldsReflect.push(props.fieldInfoService[idxReflect])
        }
      })
      setListField(fields)
      setListFieldReflect(fieldsReflect)
    }
  }, [itemReflect, props.fieldInfoService, props.fieldInfoSelect])

  useEffect(() => {
    if (props.lookupData && props.lookupData.records) {
      if (offset === 0) {
        setListSuggest(props.lookupData.records)
      } else {
        listSuggest.push(...props.lookupData.records)
        setListSuggest(_.cloneDeep(listSuggest))
      }
    }
    if (oldTextSearch !== textValue) {
      setOffset(0);
      requestLookupData(0);
    } else {
      setIsLoading(false);
    }
  },[props.lookupData])

  useEffect(() => {
    if (_.isEqual(props.action, DynamicFieldAction.Error)) {
      setIsLoading(false);
    }
  }, [props.action])

  useEffect(() => {
    // setShowSuggest(listSuggest.length > 0)
    // setOffset(listSuggest.length);
  }, [listSuggest])

  useEffect(() => {
    if (props.updateStateElement) {
      const keyObject = {itemId: null, fieldId: fieldInfo.fieldId};
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      props.updateStateElement(keyObject, fieldInfo.fieldType, lookupValue)
    }
  }, [lookupValue])

  useEffect(() => {
    if (oldTextSearch === textValue) {
      return;
    }
    if (textValue.trim().length === 0) {
      setListSuggest([]);
      setOffset(0)
    } else if (!isLoading && isFocusText) {
      setOffset(0);
      requestLookupData(0);
    }
  },[textValue])

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTextValue(value);
  }

  const onFocusTextBox = (e) => {
    setIsFocusText(true);
    setShowSuggest(true);
    if (textValue.trim().length > 0) {
      const limit = oldLimit < 1 ? LIMIT_RECORD : oldLimit;
      setOffset(0)
      requestLookupData(0, limit)
    }
  }

  const onUnFocusTextBox = (e) => {
    setIsFocusText(false);
  }

  const onKeyDownTextBox = (e) => {
    if (e.key === "Tab") {
      setOldLimit(listSuggest.length)
      setListSuggest([]);
      setShowSuggest(false);
      e.target.blur();
    }
  }

  const onSelectLookupValue = (record) => {
    const tmp = [];
    listFieldReflect.forEach((e, idx) => {
      let val = getValueFieldFromRecord(e, record);
      if (typeSelects.includes(_.toString(e.fieldType))) {
        val = mappingItemIdSelect(e, val);
      }
      const fieldValue = {key: listField[idx].fieldName, value: val, fieldInfo: listField[idx]}
      tmp.push(fieldValue)
      if (inputRefs[idx].current && inputRefs[idx].current.setValueEdit) {
        inputRefs[idx].current.setValueEdit(val)
      }
    })
    setLookupValue(tmp);
    setOldLimit(listSuggest.length);
    setListSuggest([]);
    setTextValue('');
    setShowSuggest(false);
  }

  const onSelectedRecords = (records: any[]) => {
    if (!records || records.length < 1) {
      return;
    }
    onSelectLookupValue(records[0]);
  }

  const hasMoreSuggest = () => {
    if (!props.lookupData) {
      return false;
    }
    if (!_.isNil(props.lookupData.totalRecord)) {
      if (props.lookupData.totalRecord === 0 || offset >= props.lookupData.totalRecord) {
        return false;
      }
    }
    if (!props.lookupData.records || props.lookupData.records.length === 0) {
      return false;
    }
    if (props.lookupData.records && props.lookupData.records.length % LIMIT_RECORD !== 0) {
      return false;
    }
    return true;
  }

  const loadMoreSuggest = (newOffSet) => {
    const limit = oldLimit < 1 ? LIMIT_RECORD : oldLimit;
    requestLookupData(newOffSet, limit)
  }

  const onScrollSuggest = (ev) => {
    if (ev.target.scrollHeight - ev.target.scrollTop === ev.target.clientHeight)
    {
      setOffset(listSuggest.length);
      if (hasMoreSuggest()) {
        loadMoreSuggest(listSuggest.length);
      }
    }
  }
  
  const renderItemSuggest = (key, field, record) => {

    return (
      <div key={key} className="text text1">
        <FieldDisplayBox
          controlType={ControlType.SUGGEST}
          fieldInfo={field}
          elementStatus={{fieldValue: getValueFieldFromRecord(field, record)}}
        />
      </div>
    )
  }

  useEffect(() => {
    if (props.isFocus && textboxRefEdit && textboxRefEdit.current) {
      textboxRefEdit.current.focus();
    }
  }, [props.isFocus])

  const css = getSuggestCss(fieldInfo.fieldType, { isDisabled: props.isDisabled });
  const renderSuggest = () => {
    return (
      <div className={css.wrapSuggest} onScroll={onScrollSuggest}>
        <ul className={css.ulSuggest}>
          {listSuggest.map((e, idx) =>
          <li key={idx} className={css.liSuggest} onClick={() => onSelectLookupValue(e)}>
            {listFieldReflect.map((o, jdx) =>
              <>{renderItemSuggest(jdx, o, e)}</>
            )}
          </li>
          )}
          <IconLoading isLoading={isLoading} />
        </ul>
        <SearchAddSuggest
          ref={suggestBottomRef}
          id={idControl}
          fieldBelong={fieldBelong}
          modeSelect={TagAutoCompleteMode.Single}
          onUnfocus={() => { setListSuggest([]); setShowSuggest(false)}}
          onSelectRecords={onSelectedRecords}
        />
      </div>
    )
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
    return (<>
      <div className={css.wrapInput} ref={suggestRef}>
        <input type="text"
          ref={textboxRefEdit}
          className={css.input}
          placeholder={getPlaceHolder(fieldInfo)}
          id={props.fieldInfo.fieldId}
          value={textValue}
          onChange={onTextChange}
          onFocus={onFocusTextBox}
          onBlur={onUnFocusTextBox}
          onKeyDown={onKeyDownTextBox}
          disabled={props.isDisabled}
        />
        {textValue && textValue.length > 0 && <span className={css.icDelete} onClick={() => setTextValue('')} />}
        {showSuggest && renderSuggest()}
      </div>
      {msg && <span className="messenger-error d-block">{msg}</span>}
    </>);
  }

  const renderComponentEditList = () => {
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

const mapStateToProps = ( {dynamicField} : IRootState, ownProps: IFieldEditLookupOwnProps) => {
  const id = `${ownProps.belong}_${ownProps.fieldInfo.fieldId}`
  if (!dynamicField || !dynamicField.data.has(id)) {
    return {
      action: null,
      errorMessage: null,
      serviceInfo: null,
      fieldInfoSelect: null,
      fieldInfoService: null,
      lookupData: null,
    };
  }
  return {
    action: dynamicField.data.get(id).action,
    errorMessage: dynamicField.data.get(id).errorMessage,
    fieldInfoSelect: dynamicField.data.get(id).fieldInfo,
    fieldInfoService: dynamicField.data.get(id).fieldInfoService,
    serviceInfo: dynamicField.data.get(id).serviceInfo,
    lookupData: dynamicField.data.get(id).suggestLookup,
  }
}

const mapDispatchToProps = {
  getServicesInfo,
  getFieldsInfo,
  getFieldsInfoService,
  getSuggestLookup,
  reset
};

const options = {forwardRef: true};

export default connect<IFieldEditLookupStateProps, IFieldEditLookupDispatchProps, IFieldEditLookupOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(FieldEditLookup);

