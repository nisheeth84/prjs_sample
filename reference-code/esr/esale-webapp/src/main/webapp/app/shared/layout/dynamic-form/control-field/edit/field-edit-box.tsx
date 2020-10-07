import React, { useImperativeHandle, forwardRef, useRef } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE } from '../../constants';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import { translate } from 'react-jhipster';
import { ControlType } from 'app/config/constants';
import FieldEditAddress from './field-edit-address';
import FieldEditCalculation from './field-edit-calculation';
import FieldEditCheck from './field-edit-check';
import FieldEditDateTime from './field-edit-date-time';
import FieldEditDate from './field-edit-date';
import FieldEditEmail from './field-edit-email';
import FieldEditFile from './field-edit-file';
import FieldEditLink from './field-edit-link';
import FieldEditLookup from './field-edit-lookup';
import FieldEditMultiSelect from './field-edit-multi-select';
import FieldEditNumeric from './field-edit-numeric';
import FieldEditPhoneNumber from './field-edit-phone-number';
import FieldEditRadio from './field-edit-radio';
import FieldEditRelation from './field-edit-relation';
import FieldEditSelectOrg from './field-edit-select-org';
import FieldEditSingleSelect from './field-edit-single-select';
import FieldEditTab from './field-edit-tab';
import FieldEditTextArea from './field-edit-text-area';
import FieldEditText from './field-edit-text';
import FieldEditTime from './field-edit-time';
import FieldEditTitle from './field-edit-title';
import _ from 'lodash';

type IFieldEditBoxProps = IDynamicFieldProps

const FieldEditBox = forwardRef((props: IFieldEditBoxProps, ref) => {
  const fieldEditRef = useRef(null)  // React.createRef();

  useImperativeHandle(ref, () => ({
    resetValue() {
      if (fieldEditRef && fieldEditRef.current && fieldEditRef.current.resetValue) {
        fieldEditRef.current.resetValue();
      }
    },
    setValueEdit(val) {
      if (fieldEditRef && fieldEditRef.current && fieldEditRef.current.setValueEdit) {
        fieldEditRef.current.setValueEdit(val);
      }
    }
  }));

  const fieldInfo = props.fieldInfo;

  const renderHeaderTitle = () => {
    if (props.controlType === ControlType.EDIT_LIST || props.isCustomerIntegration) {
      return <></>
    }
    let headerClass = "";
    if (fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.DATE && fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.DATE_TIME) {
      headerClass = "advance-search-popup-label-title"
    }
    if (fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TITLE) {
      return <></>
    }
    return (
      <>
        {props.showFieldLabel && props.isRequired &&
          <label className={headerClass}>
            {StringUtils.escapeSpaceHtml(getFieldLabel(fieldInfo, 'fieldLabel'))}
            <label className="label-red ml-2">{translate('dynamic-control.require')}</label>
          </label>}
        {props.showFieldLabel && !props.isRequired &&
          <label className={headerClass}>
            {StringUtils.escapeSpaceHtml(getFieldLabel(fieldInfo, 'fieldLabel'))}
          </label>}
        {!props.showFieldLabel && props.isRequired &&
          <label className={`${headerClass} label-red `}>{translate('dynamic-control.require')}</label>
        }
      </>
    )
  }

  const propsDisable = _.cloneDeep(props);
  propsDisable.isDisabled = props.isDisabled || fieldInfo.modifyFlag === 0

  const renderDynamicControl = 
  (fieldType) => {
    switch (fieldType) {
      case DEFINE_FIELD_TYPE.SINGER_SELECTBOX:
        return <FieldEditSingleSelect ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.MULTI_SELECTBOX:
        return <FieldEditMultiSelect ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.CHECKBOX:
        return <FieldEditCheck ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.RADIOBOX:
        return <FieldEditRadio ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.NUMERIC:
        return <FieldEditNumeric ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.DATE:
        return <FieldEditDate ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.DATE_TIME:
        return <FieldEditDateTime ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.TIME:
        return <FieldEditTime ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.TEXT:
        return <FieldEditText ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.TEXTAREA:
        return <FieldEditTextArea ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.FILE:
        return <FieldEditFile ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.LINK:
        return <FieldEditLink ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.PHONE_NUMBER:
        return <FieldEditPhoneNumber ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.ADDRESS:
        return <FieldEditAddress ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.EMAIL:
        return <FieldEditEmail ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.CALCULATION:
        return <FieldEditCalculation ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.RELATION:
        return <FieldEditRelation ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.SELECT_ORGANIZATION:
        return <FieldEditSelectOrg ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.LOOKUP:
        return <FieldEditLookup ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.TAB:
        return <FieldEditTab ref={fieldEditRef} {...propsDisable} />
      case DEFINE_FIELD_TYPE.TITLE:
        return <FieldEditTitle ref={fieldEditRef} {...propsDisable} />
      // case  DEFINE_FIELD_TYPE.OTHER:
      //   return
      default:
        return <>{props.elementStatus ? props.elementStatus.fieldValue : ''}</>
    }
  }

  const renderComponent = () => {
    const className = props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TITLE ? "col-lg-12 form-group mb-2" : props.className;
    if (props.isDnDMoveField || props.isDnDAddField) {
      return props.connectDropTarget(props.connectDragSource(
        <div className={className}>
          {renderHeaderTitle()}
          {renderDynamicControl(props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString())}
        </div>
      ));
    }
    if (!props.className) {
      return (
        <>
          {renderHeaderTitle()}
          {renderDynamicControl(props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString())}
        </>
      )
    } else {
      return (
        <div className={className}>
          {renderHeaderTitle()}
          {renderDynamicControl(props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString())}
        </div>
      )
    }
  }
  return renderComponent();

});

export default FieldEditBox
