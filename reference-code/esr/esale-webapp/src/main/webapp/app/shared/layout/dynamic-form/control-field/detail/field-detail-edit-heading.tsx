import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Storage, translate } from 'react-jhipster';
import { languageCode } from 'app/config/language-code';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE, FIELD_MAXLENGTH } from '../../constants';
import { findErrorMessage, toKatakana } from 'app/shared/util/string-utils';

type IFieldDetailEditHeadingProps = IDynamicFieldProps

const FieldDetailEditHeading = forwardRef((props: IFieldDetailEditHeadingProps, ref) => {
  const [fieldLabels, setFieldLabels] = useState([]);

  useImperativeHandle(ref, () => ({

  }));

  const lang = Storage.session.get('locale', 'ja_jp');

  const initilize = () => {
    // get field label code

    if (props.fieldInfo.fieldLabel) {
      let objFieldLabel = {};
      if (_.isString(props.fieldInfo.fieldLabel)) {
        objFieldLabel = JSON.parse(props.fieldInfo.fieldLabel)
      } else {
        objFieldLabel = props.fieldInfo.fieldLabel
      }
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
          fieldLabels.push(el);
        }
      }
    }
    if (fieldLabels.length < 1) {
      let name = "";
      const idx = languageCode.findIndex(e => e.code === lang);
      if (idx >= 0) {
        name = languageCode[idx].name;
      }
      fieldLabels.push({ code: lang, name, default: true, value: '' })
    }
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
  }

  useEffect(() => {
    initilize();
  }, [])

  useEffect(() => {
    if (props.updateStateElement) {
      const fieldLabel = {}
      fieldLabels.forEach((e, i) => {
        if (e.default) {
          fieldLabel[e.code] = e.value;
        }
      });
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, { fieldLabel })
    }
  }, [fieldLabels])

  const onAddLanguage = (ev) => {
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

  const getLabel = () => {
    const label = []
    if (props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TITLE) {
      label.push(translate('dynamic-control.fieldDetail.editHeading.label'))
      label.push(translate('dynamic-control.fieldDetail.common.placeholder.titlePlaceholder'))
    } else if (props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.OTHER) {
      label.push(translate('dynamic-control.fieldDetail.editHeading.label'))
      label.push(translate('dynamic-control.fieldDetail.common.placeholder.otherPlaceholder'))
    } else if (props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TAB) {
      label.push(translate('dynamic-control.fieldDetail.editHeading.label'))
      label.push(translate('dynamic-control.fieldDetail.common.placeholder.tabPlaceholder'))
    }
    return label;
  }

  const HEADING = 0;
  const PLACEHOLDER = 1;
  const msgErrorReiqure = findErrorMessage(props.errorInfos, `fieldLabel`);
  const ADD_LANGUAGE = 'add'
  const REMOVE_LANGUAGE = 'remove'

  const handleEnterKey = (event, mode) => {
    if (event.key === 'Enter') {
      if (mode === ADD_LANGUAGE) {
        onAddLanguage(event);
      } else if (mode === REMOVE_LANGUAGE) {
        onRemoveLanguage();
      }
    }
  }

  const findDuplicateError = (errors, index) => {
    let isError = false;
    let errMess = null;
    if (errors && Array.isArray(errors)) {
      for (let i = 0; i < errors.length; i++) {
        if (errors[i].item === `fieldLabels[${index}]`) {
          isError = true;
          errMess = errors[i].errorMsg;
        }
      }
    }
    return { isError, errMess }
  }

  return (
    <div className="form-group">
      <label>{getLabel()[HEADING]}&ensp;<span className="label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span></label>
      {fieldLabels.map((e, idx) => {
        if (!e.default) {
          return <></>
        }
        const msgError = findErrorMessage(props.errorInfos, `fieldLabel[${e.code}]`);
        const duplicateError = findDuplicateError(props.errorInfos, idx).isError;
        return (
          <>
            <div className={`layout-input-text input-common-wrap ${msgError ? 'error' : msgErrorReiqure ? 'error' : duplicateError ? 'error' : ''}`} key={idx}>
              <input key={idx} type="text"
                className={`input-normal w65 mr-1`}
                placeholder={getLabel()[PLACEHOLDER]}
                onChange={(ev) => onChangeLanguage(ev, idx)}
                value={e.value} 
                onBlur={(ev) => convertToKatakana(ev, idx)}/>{`(${e.name})`}
            </div>
            {msgError &&
              <span className="messenger-error">{msgError}</span>
            }
            {!msgError && duplicateError &&
              <span className="messenger-error">{findDuplicateError(props.errorInfos, idx).errMess}</span>
            }
          </>
        )
      })}
      {msgErrorReiqure &&
        <span className="messenger-error">{msgErrorReiqure}</span>
      }
      {fieldLabels.filter(o => o.default).length < fieldLabels.length ?
        <div><a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e, ADD_LANGUAGE)} onClick={onAddLanguage} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.showOtherLanguage')}</a></div>
        : <div><a role="button" tabIndex={0} onKeyPress={e => handleEnterKey(e, REMOVE_LANGUAGE)} onClick={onRemoveLanguage} className="text-blue text-underline">{translate('dynamic-control.fieldDetail.common.label.hideOtherLanguage')}</a></div>
      }
    </div>
  )

});

export default FieldDetailEditHeading
