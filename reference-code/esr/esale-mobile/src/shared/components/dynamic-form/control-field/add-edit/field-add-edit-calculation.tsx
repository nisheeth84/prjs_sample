import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';
import { FieldAddEditCalculationStyles } from './field-add-edit-styles';
// Define value props of FieldAddEditCalculationProps component
type IFieldAddEditCalculationProps = IDynamicFieldProps;

/**
 * Component for calculation fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditCalculation(props: IFieldAddEditCalculationProps) {
  const { fieldInfo,languageCode } = props;
  const language = languageCode ?? TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language);

  /*
   * Render the calculation component in add-edit case
   */
  const renderConponent = () => {
    return (
      <View>
        <Text style={FieldAddEditCalculationStyles.title}>{title}</Text>
      </View>
    );
  }

  return renderConponent();
}
