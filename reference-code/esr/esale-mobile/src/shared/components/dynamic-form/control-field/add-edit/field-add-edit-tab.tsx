import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { DefineFieldType, ControlType } from '../../../../../config/constants/enum';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldAddEditTabStyles } from './field-add-edit-styles';
import {
  Text,
  View
} from 'react-native';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DynamicControlField } from '../dynamic-control-field';

// Define value props of FieldAddEditTab component
type IFieldAddEditTabProps = IDynamicFieldProps;

/**
 * Component for show tab fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditTab(props: IFieldAddEditTabProps) {
  const { listFieldInfo, elementStatus, fieldNameExtension, languageCode, fieldInfo } = props;
  const language = languageCode ?? TEXT_EMPTY

  /**
   * handle when select item
   * @param data fieldInfo that user click on
   */
  const handleGetValue = (info: any, _fieldType: any, data: any) => {
    if (!props.updateStateElement && props.isDisabled) {
      return;
    }
    if (props.updateStateElement && !props.isDisabled) {
      props.updateStateElement(info, info.fieldType, data);
    }
  }

  /**
   * Render the tab component
   */
  const renderComponent = () => {
    return (
      <View>
        <View style={FieldAddEditTabStyles.tabLabelContainer}>
          <View style={FieldAddEditTabStyles.header} />
          <Text style={FieldAddEditTabStyles.tabLabel}>{StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language)}</Text>
        </View>
        {
          fieldInfo?.tabData?.map((fieldId: any) => {
            let info = listFieldInfo?.find((fieldInfoItem) => { return fieldId === fieldInfoItem.fieldId })
            var label = '';
            var value = '';
            if (info?.availableFlag > 0) {
              label = StringUtils.getFieldLabel(info, FIELD_LABLE, language)
              if (elementStatus) {
                value = elementStatus.fieldValue[info.fieldName]
                if (!info.isDefault && fieldNameExtension) {
                  value = elementStatus.fieldValue[fieldNameExtension][info.fieldName]
                }
              } else {
                value = info.defaultValue
              }
              return (
                <View>
                  <View style={FieldAddEditTabStyles.divider} />
                  <View style={FieldAddEditTabStyles.tabData}>
                    {info?.fieldType?.toString() !== DefineFieldType.OTHER ?
                      <DynamicControlField
                        controlType={ControlType.ADD_EDIT}
                        fieldInfo={info}
                        elementStatus={{ fieldValue: value || TEXT_EMPTY }}
                        updateStateElement={handleGetValue}
                      />
                      : <View>
                        <Text style={FieldAddEditTabStyles.labelField99}>{label}</Text>
                      </View>
                    }
                  </View>
                </View>
              )
            } else {
              return <View />
            }
          }
          )
        }
      </View>
    );
  }
  return renderComponent();
}