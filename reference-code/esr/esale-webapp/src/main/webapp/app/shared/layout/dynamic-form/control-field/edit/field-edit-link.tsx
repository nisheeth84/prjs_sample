import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { translate } from 'react-jhipster';
import  { toKatakana, jsonParse, getPlaceHolder } from 'app/shared/util/string-utils';
import _ from 'lodash';
import { ControlType } from 'app/config/constants';

type IFieldEditLinkProps = IDynamicFieldProps;

const FieldEditLink = forwardRef((props: IFieldEditLinkProps, ref) => {
  const ARBITRARY = 1;
  const FIXED = 2;
  const [valueEdit, setValueEdit] = useState('');
  const [valueEditUrlText, setValueEditUrlText] = useState('');
  const { fieldInfo } = props;
  const textboxRef = useRef(null);

  let type = ControlType.ADD;
  if (props.controlType) {
    type = props.controlType;
  }

  const makeKeyUpdateField = () => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    return keyObject;
  }

  useEffect(() => {
    if (!props.isDisabled && props.updateStateElement) {
      const updateVal = {
        "url_target": _.trim(valueEdit),
        "url_text": _.trim(valueEditUrlText),
        "sort_value": _.trim(valueEditUrlText) ? _.trim(valueEditUrlText) : _.trim(valueEdit) ? _.trim(valueEdit) : ''
      }
      let linkObj = '';
      if (fieldInfo.urlType === ARBITRARY) {
        linkObj =  JSON.stringify(updateVal);
      } else {
        linkObj = null;
      }
      props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, linkObj);
    }
  }, [valueEdit, valueEditUrlText]);



  const onChangeValueEdit = (event) => {
    const val = event.target.value;
    if (fieldInfo.isDefault && !_.isNil(fieldInfo.maxLength) &&
      val.length > fieldInfo.maxLength) {
      setValueEdit(val.slice(0, fieldInfo.maxLength));
      return;
    }
    setValueEdit(val);
  }

  const onChangeValueEditLabel = (event) => {
    setValueEditUrlText(event.target.value);
  }

  const convertToKanatanaValueEdit = (event) => {
    setValueEdit(toKatakana(event.target.value));
  }

  const convertToKanatanaUrlText = (event) => {
    setValueEditUrlText(toKatakana(event.target.value));
  }

  const initialize = (fieldValue) => {
    let defaultVal = "";
    let defaultLabel = "";
    if (fieldValue) {
      const jsonValue = jsonParse(fieldValue, {});
      defaultVal = jsonValue["url_target"] ? jsonValue["url_target"] : "";
      defaultLabel = jsonValue["url_text"] ? jsonValue["url_text"] : "";
    } else if (type === ControlType.ADD) {
      defaultVal = fieldInfo.defaultValue ? fieldInfo.defaultValue : "";
      defaultLabel = fieldInfo.urlText ? fieldInfo.urlText : "";
      if (props.updateStateElement) {
        const updateVal = {
          "url_target": _.trim(defaultVal),
          "url_text": _.trim(defaultLabel),
          "sort_value": _.trim(defaultLabel) ? _.trim(defaultLabel) : _.trim(defaultVal) ? _.trim(defaultVal) : ''
        }
        let linkObj = '';
        if (fieldInfo.urlType === ARBITRARY) {
          linkObj =  JSON.stringify(updateVal);
        } else {
          linkObj = null;
        }
        props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, linkObj);
      }
    }
    if (defaultVal !== null && defaultVal !== undefined) {
      setValueEdit(defaultVal.toString());
    }
    if (defaultLabel !== null && defaultLabel !== undefined) {
      setValueEditUrlText(defaultLabel.toString());
    }
  };

  useEffect(() => {
    initialize(_.get(props, 'elementStatus.fieldValue'));
  }, []);

  useImperativeHandle(ref, () => ({
    resetValue() {
      setValueEdit('');
    },
    setValueEdit(val) {
      if (!_.isEqual(valueEdit, val)) {
        initialize(val);
      }
    }
  }));

  useEffect(() => {
    if (props.isFocus && textboxRef && textboxRef.current) {
      textboxRef.current.focus();
    }
  }, [props.isFocus])

  const renderComponentEdit = () => {
    const defaultVal = props.elementStatus ? props.elementStatus.fieldValue : "";
    let errTarget
    let errText
    if (props.errorInfo) {
      if (props.errorInfo.arrayError && _.isArray(props.errorInfo.arrayError)) {
        props.errorInfo.arrayError.forEach(e => {
          if (e.childrenItem === 'url_target' && e.errorCode) {
            errTarget = translate(`messages.${e.errorCode}`);
          }
          if (e.childrenItem === 'url_text' && e.errorCode) {
            errText = translate(`messages.${e.errorCode}`);
          }
        })
      }
    }

    return (
      <>
        <>
          {(fieldInfo.urlType === ARBITRARY || fieldInfo.urlType === 0 || _.isNil(fieldInfo.urlType)) &&
            <>
              <div className={`wrap-check wrap-edit-link ${type === ControlType.EDIT_LIST ? "width-420 no-border d-flex" : ""} ${type === ControlType.EDIT_LIST && (errTarget || errText) ? 'p-0' : ''}`}>
                <div className={`form-group-item ${type === ControlType.EDIT_LIST ? 'mr-2 w60' : ''}`}>
                 {type !== ControlType.EDIT_LIST && <label>{translate('dynamic-control.fieldDetail.layoutLink.labelUrlFixed')}</label>}
                  <div className={`input-common-wrap`}>
                    < input
                      ref={textboxRef}
                      disabled={props.isDisabled}
                      className={`form-control input-normal ${errTarget ? 'error' : ''} ${props.isDisabled ? 'disable' : ''}`}
                      defaultValue={defaultVal} type="text"
                      placeholder={getPlaceHolder(fieldInfo, 1)}
                      value={valueEdit}
                      onChange={onChangeValueEdit}
                      onBlur={convertToKanatanaValueEdit}
                    />
                    {errTarget && <span className="messenger-error d-block word-break-all">{errTarget}</span>}
                  </div>
                </div>
                <div className="form-group-item">
                  {type !== ControlType.EDIT_LIST && <label>{translate('dynamic-control.fieldDetail.layoutLink.label')}</label>}
                  <div className={`input-common-wrap`}>
                    < input
                      defaultValue={fieldInfo.urlText ? fieldInfo.urlText : ''}
                      disabled={props.isDisabled}
                      className={`form-control input-normal ${errText ? 'error' : ''} ${props.isDisabled ? 'disable' : ''}`}
                      type="text"
                      placeholder={getPlaceHolder(fieldInfo, 2)}
                      value={valueEditUrlText}
                      onChange={onChangeValueEditLabel}
                      onBlur={convertToKanatanaUrlText}
                    />
                    {errText && <span className="messenger-error d-block word-break-all">{errText}</span>}
                  </div>
                </div>
              </div>
            </>
          }
          {fieldInfo.urlType === FIXED &&
            <>
              {props.isDisabled && <a>{fieldInfo.urlText}</a>}
              {!props.isDisabled && <a className="text-blue" target={fieldInfo.linkTarget === 0 ? "_blank" : "_self"} rel="noopener noreferrer" href={fieldInfo.urlTarget}>{fieldInfo.urlText}</a>}
            </>
          }
        </>
      </>
    )
  }
  return renderComponentEdit();
});

export default FieldEditLink
