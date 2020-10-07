import React from 'react';
import { authorizationSelector } from '../../../../modules/login/authorization/authorization-selector';
import { ControlType } from '../../../../config/constants/enum';
import { FieldAddEditBox } from './add-edit/field-add-edit-box';
import { FieldDetailBox } from './detail/field-detail-box';
import { FieldSearchBox } from './search/field-search-box';
import { IDynamicFieldProps } from './interface/dynamic-field-props';
import { TEXT_EMPTY } from '../../../../config/constants/constants';
import { useSelector } from 'react-redux';
import { View } from 'react-native';

// define type of DynamicControlField's props
type IDynamicControlFieldProps = IDynamicFieldProps

/**
 * Component dynamic form
 * @param props see IDynamicFieldProps
 */
export function DynamicControlField(props: IDynamicControlFieldProps) {
  const fieldInfo = props.fieldInfo;
  const type = props.controlType;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY;
  const formatDate = authorizationState?.formatDate ?? TEXT_EMPTY;
  const timeZone = authorizationState?.timezoneName ?? TEXT_EMPTY;
  const dynamicProps = { ...props, languageCode: languageCode,timezoneName : timeZone, formatDate:formatDate}
  /**
   * update dymanic component'state
   */
  const updateStateElement = (key: any, itemEdit: any) => {
    if (props.updateStateElement) {
      if (type === ControlType.ADD_EDIT) {
        props.updateStateElement(key, fieldInfo.fieldType.toString(), itemEdit);
      } else if (type === ControlType.SEARCH) {
        props.updateStateElement(fieldInfo, fieldInfo.fieldType.toString(), itemEdit);
      }
    }
  }

  /**
   * render dynamic component
   */
  const renderComponent = () => {
    if (fieldInfo) {
      if (type === ControlType.ADD_EDIT) {
        return <FieldAddEditBox updateStateElement={updateStateElement} {...dynamicProps} />;
      } else if (type === ControlType.DETAIL) {
        return <FieldDetailBox {...dynamicProps} />;
      } else if (type === ControlType.SEARCH) {
        return <FieldSearchBox updateStateElement={updateStateElement} {...dynamicProps} />;
      }
    }
    return <View />;
  }

  return renderComponent();
}