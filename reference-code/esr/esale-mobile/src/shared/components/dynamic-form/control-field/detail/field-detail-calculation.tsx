import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { calculate } from '../../../../util/calculation-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';
import { FieldDetailCalculationStyles } from './field-detail-styles';


// define type of FieldDetailCalculation props
type IFieldDetailCalculationProps = IDynamicFieldProps;

/**
 * Component detail numeric form
 * @param props 
 */
export function FieldDetailCalculation(props: IFieldDetailCalculationProps) {
  const { fieldInfo, languageCode } = props;
  const language = languageCode ?? TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language);
  let configValue = props.fieldInfo?.configValue ?? TEXT_EMPTY;
  const fields = props?.fields ?? [];
  const [value, setValue] = useState(TEXT_EMPTY);
  useEffect(() => {
    setValue(calculate(configValue, fields, props.fieldInfo?.decimalPlace));
  }, [props.elementStatus]);
  /**
   * render detail numeric form
   */
  const renderConponent = () => {
    return (
      <View>
        <Text style={FieldDetailCalculationStyles.title}>{title}</Text>
        <Text style={FieldDetailCalculationStyles.mumberValue}>{value}</Text>
      </View>
    );
  }
  return renderConponent();
}