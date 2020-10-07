import React from 'react';
import {
  Text,
  View
} from 'react-native';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { ControlType, DefineFieldType } from '../../../../../config/constants/enum';
import StringUtils from '../../../../util/string-utils';
import { DynamicControlField } from '../dynamic-control-field';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { FieldDetailTabStyles } from './field-detail-styles';

// Define value props of FieldDetailTab component
type IFieldDetailTabProps = IDynamicFieldProps;

/**
 * Component for show tab fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailTab(props: IFieldDetailTabProps) {
  const { fieldInfo, listFieldInfo, elementStatus, fieldNameExtension, languageCode } = props;
  const language = languageCode ?? TEXT_EMPTY;

  /**
   * Render the tab component
   */
  const renderComponent = () => {
    return (
      <View>
        <View style={FieldDetailTabStyles.tabLabelContainer}>
          <View style={FieldDetailTabStyles.colorContainer} />
          <View>
            <Text style={FieldDetailTabStyles.tabLabel}>{StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language)}</Text>
          </View>
        </View>
        {fieldInfo.tabData && fieldInfo.tabData.length > 0 ?
          fieldInfo.tabData.map((fieldId: any) => {
            let info = listFieldInfo?.find((fieldInfo) => { return fieldId === fieldInfo.fieldId })
            var value = ''
            if (info && info?.fieldType.toString() !== DefineFieldType.LOOKUP) {
              if (elementStatus) {
                value = elementStatus.fieldValue[info.fieldName]
                if (!info.isDefault && fieldNameExtension) {
                  elementStatus.fieldValue[fieldNameExtension]?.map((item: any) => {
                    if (item['key'] == info.fieldName) {
                      value = item['value']
                    }
                  })
                }
              } else {
                value = info.defaultValue
              }
            }
            if (info && info?.fieldType?.toString() !== DefineFieldType.LOOKUP) {
              return (
                <View style={FieldDetailTabStyles.inforComponent}>
                  <DynamicControlField
                    controlType={ControlType.DETAIL}
                    fieldInfo={info}
                    elementStatus={{ fieldValue: value }}
                    extensionData={listFieldInfo}
                  />
                </View>)
            } else {
              return <></>
            }

          }
          ) : (<View></View>)
        }
      </View>
    );
  }
  return renderComponent();
}