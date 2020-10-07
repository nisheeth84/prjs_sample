import React, { useState, useEffect, useRef } from 'react';
import { Storage, translate } from 'react-jhipster';
import StringUtils, { toKatakana } from 'app/shared/util/string-utils';
import { MODIFY_FLAG } from 'app/config/constants';
import _ from 'lodash';
export interface IFieldSuggestBoxProps {
  firstErrorItem?: string;
  fieldLabel: string;
  itemDataFields: any[];
  firstItemDataStatus: any;
  secondItemDataStatus: any;
  errors?: { rowId; item; errorCode; errorMsg; params: {} }[];
  isDisabled?: boolean;
  filteredData: any[];
  setIsOpenDropdown: (isOpenDropdown) => void;
  isOpenDropdown: boolean;
  dataSelectedInit?: any[];
  onchangeDepartment: (e) => void;
  updateStateField: (itemData, type, itemEditValue) => void;
  isHoldTextInput?: boolean;
  onTextChange?: (value: string) => void;
  disableTag?: boolean;

}

const FieldSuggestBox = (props: IFieldSuggestBoxProps) => {
  const { fieldLabel, itemDataFields, errors, firstErrorItem, filteredData, onchangeDepartment, dataSelectedInit } = props;

  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [iShowDelete, setIsShowDelete] = useState(false)
  const [dataSelected, setDataSelected] = useState(dataSelectedInit);
  const [, setText] = useState(null)
  // const [text, setText] = useState(null)
  const [isSelectedDropdown, setIsOpenDropdownList] = useState(false);

  const firstSuggestRef = useRef(null);
  const secondSuggestRef = useRef(null);

  useEffect(() => {
    const firstFiled = StringUtils.snakeCaseToCamelCase(itemDataFields[0].fieldName);
    const secondFiled = StringUtils.snakeCaseToCamelCase(itemDataFields[1].fieldName);
    if (errors[0] && (firstErrorItem === firstFiled || firstErrorItem === secondFiled)) {
      firstSuggestRef.current.focus();
    } else if (firstErrorItem === secondFiled && errors[1]) {
      secondSuggestRef.current.focus();
    }
  }, [errors]);

  const onChangeValueText = (event, itemDataField, isFirst) => {
    if (!props.updateStateField && props.isDisabled) {
      return;
    }
    const changeVal = event.target.value;
    props.onTextChange && props.onTextChange(changeVal ? changeVal : null);
    setText(changeVal ? changeVal : '')
    if (itemDataField.isDefault && !_.isNil(itemDataField.maxLength) &&
      changeVal?.length > itemDataField.maxLength) {
      if (isFirst) {
        setFirstValue(changeVal.slice(0, itemDataField.maxLength));
      } else {
        setSecondValue(changeVal.slice(0, itemDataField.maxLength));
      }
      if (itemDataField.fieldName === "department_name") {
        setIsOpenDropdownList(true)
      }
      props.updateStateField(itemDataField, itemDataField.fieldType.toString(), changeVal);
      return;
    }
    if (itemDataField.fieldName === "department_name") {
      setIsOpenDropdownList(true)
    }
    if (isFirst) {
      setFirstValue(changeVal ? changeVal : '');

    } else {
      setSecondValue(changeVal ? changeVal : '');
    }
    props.updateStateField(itemDataField, itemDataField.fieldType.toString(), changeVal ? changeVal : null);
  };

  const onClearSelect = (event, itemDataField, isFirst) => {
    setDataSelected([])
    setText('')
    onchangeDepartment(null)
    props.onTextChange && props.onTextChange("");
    onChangeValueText(event, itemDataField, isFirst)
  }
  const handleSelect = (value, fieldData) => {
    setIsOpenDropdownList(!isSelectedDropdown)
    onchangeDepartment(value)
    setDataSelected(value);
  }

  useEffect(() => {

    const firstDef = props.firstItemDataStatus ? props.firstItemDataStatus.fieldValue : itemDataFields[0].defaultValue;
    const secondDef = props.secondItemDataStatus ? props.secondItemDataStatus.fieldValue : itemDataFields[1].defaultValue;
    setFirstValue(firstDef);
    setSecondValue(secondDef);
    props.updateStateField(itemDataFields[0], itemDataFields[0].fieldType.toString(), firstDef);
    props.updateStateField(itemDataFields[1], itemDataFields[1].fieldType.toString(), secondDef);

  }, []);


  const getFieldLabel = (item, fieldLb) => {
    const lang = Storage.session.get('locale', 'ja_jp');
    if (item && Object.prototype.hasOwnProperty.call(item, fieldLb)) {
      try {
        const obj = JSON.parse(item[fieldLb]);
        return StringUtils.getValuePropStr(obj, lang);
      } catch {
        return item[fieldLb];
      }
    }
    return '';
  };
  const convertToKatakana = (event, itemDataField, isFirst) => {
    if (!props.updateStateField && props.isDisabled) {
      return;
    }
    const changeVal = toKatakana(event.target.value);
    if (isFirst) {
      setFirstValue(changeVal);
    } else {
      setSecondValue(changeVal);
    }
    props.updateStateField(itemDataField, itemDataField.fieldType.toString(), changeVal);
  }
  const getErrorMsg = errorInfo => {
    let msg = null;
    if (errorInfo) {
      if (errorInfo.errorCode) {
        msg = translate(`messages.${errorInfo.errorCode}`, errorInfo.errorParams);
      } else if (errorInfo.errorMsg) {
        msg = errorInfo.errorMsg;
      }
    }
    return msg;
  };

  const isRequired = () => {
    return itemDataFields.findIndex(item => item.modifyFlag === MODIFY_FLAG.REQUIRED) > -1;

  };

  const handleClickOutside = event => {
    if (firstSuggestRef.current && !firstSuggestRef.current.contains(event.target)) {
      setIsOpenDropdownList(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  return (
    <div className="col-lg-12 form-group">
      <label>
        {fieldLabel}
        {isRequired() && (
          <a title="" className="label-red ml-2">
            {translate('employees.common.lable-require')}
          </a>
        )}
      </label>
      <div className="row box-border">
        {itemDataFields.map((item, index) => (
          <div className="col-lg-6" key={item.fieldId}>
            <div>
              <label>
                {getFieldLabel(item, 'fieldLabel')}
                {item.required && <a className="label-red">{translate('employees.common.lable-require')}</a>}
              </label>
              <div className={dataSelected?.length > 0 ? "search-box-button-style-category " : "input-common-wrap delete"} >
                {item.fieldName === "department_name" && dataSelected?.length > 0 &&
                  <div className={"wrap-tag "}>
                    <div className="tag tag-ellipsis " >{dataSelected}<button className="close close-category" type='button' onClick={props.disableTag ? null : () => onClearSelect(event, item, index === 0)}>×</button></div>
                  </div>}
                {(item.fieldName !== "department_name" || dataSelected?.length < 1) &&
                  <input
                    // ref={node}
                    key={item.fieldId}
                    type="text"
                    className={`input-normal ${props.errors[index] ? 'error' : ''}`}
                    ref={index === 0 ? firstSuggestRef : secondSuggestRef}
                    value={index === 0 ? firstValue : secondValue}
                    onMouseEnter={() => item.fieldName === "department_name" ? setIsShowDelete(true) : null}
                    onMouseLeave={() => item.fieldName === "department_name" ? setIsShowDelete(false) : null}
                    disabled={props.isDisabled}
                    placeholder={getFieldLabel(item, 'fieldLabel') + translate('businesscards.create-edit.input')}
                    onChange={event => onChangeValueText(event, item, index === 0)}
                    onBlur={(event) => convertToKatakana(event, item, index === 0)}
                  />}
                {item.fieldName === "department_name" && iShowDelete && firstValue?.length > 0 &&
                  <span className="icon-delete" onClick={() => onClearSelect(event, item, index === 0)} onMouseEnter={() => setIsShowDelete(true)} onMouseLeave={() => setIsShowDelete(false)} />}
              </div>
              {item.fieldName === "department_name" && filteredData && isSelectedDropdown &&
                <div className="drop-down height-unset padding-bottom-unset">
                  <ul className="dropdown-item style-3 overflow-hover" >
                    {filteredData.map((data, id) => (
                      <li key={id}
                        onClick={() => handleSelect(data.departmentName, item)}
                        className="item smooth">
                        <div className="text text2 text-ellipsis">{data.departmentName}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              }
              {getErrorMsg(errors[index]) && <span className="color-red font-size-14" >{getErrorMsg(errors[index])}</span>}
            </div>
          </div>
        ))}
      </div>


    </div >
  );
};

export default FieldSuggestBox;
