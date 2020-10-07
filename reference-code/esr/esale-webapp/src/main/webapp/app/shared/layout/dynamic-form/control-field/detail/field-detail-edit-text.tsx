import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { translate } from 'react-jhipster';
import { findErrorMessage, toKatakana } from 'app/shared/util/string-utils';
import { isCanSettingField } from 'app/shared/util/option-manager';
import { FIELD_MAXLENGTH } from '../../constants';

type IFieldDetailEditTextProps = IDynamicFieldProps

/**
 * Text and text multil in setting mode
 *
 * @param props
 */
const FieldDetailEditText = forwardRef((props: IFieldDetailEditTextProps, ref) => {
  const { fieldInfo, errorInfos }  = props;
  const [value, setValue] = useState(fieldInfo.defaultValue ? fieldInfo.defaultValue : '');

  useImperativeHandle(ref, () => ({

  }));

  useEffect(() => {
    if (props.updateStateElement) {
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, { defaultValue: value })
    }
  }, [value])

  const renderComponent = () => {
    const isShowDefaultValue = isCanSettingField(props.belong, fieldInfo.fieldName, 'defaultValue');
    const msgError = findErrorMessage(errorInfos, 'defaultValue');
    return (
    <>
      <div className="form-group common">
        <label>{translate('dynamic-control.fieldDetail.layoutText.label')}&ensp;
          {!fieldInfo.isDefault && <span className="label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span>}
        </label>
          <div className={`input-common-wrap  ${msgError ? 'error' : ''}`}>
          <input type="text" 
            disabled={!isShowDefaultValue}
            className={`input-normal ${!isShowDefaultValue ? 'disable' : ''}`}
            placeholder={translate('dynamic-control.fieldDetail.layoutText.placeholder')}
            value={value} 
            onChange={evt => (evt.target.value.length <= FIELD_MAXLENGTH.defaultValue && setValue(evt.target.value))}
            onBlur={evt => (evt.target.value.length <= FIELD_MAXLENGTH.defaultValue && setValue(toKatakana(evt.target.value)))}
          />
        </div>
        {msgError && <span className="messenger-error">{msgError}</span>}
      </div>
    </>
    )
  }

  return renderComponent();

});

export default FieldDetailEditText
