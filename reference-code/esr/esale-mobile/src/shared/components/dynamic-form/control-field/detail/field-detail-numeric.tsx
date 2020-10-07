import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';
import { FieldDetailNumericStyles } from './field-detail-styles';
import NumberUtils from '../../../../util/number-utils';
import { TypeUnit } from '../../../../../config/constants/enum';

// define type of FieldDetailNumeric's props
type IFieldDetailNumericProps = IDynamicFieldProps;

/**
 * Component detail numeric form
 * @param props 
 */
export function FieldDetailNumeric(props: IFieldDetailNumericProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);

	/**
	 * format to display
	 * @param strValue 
	 */
  const formatNumber = () => {
    const value = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
    return NumberUtils.autoFormatNumeric(value, fieldInfo.decimalPlace || 0);
  }

  /**
   * render detail numeric form
   */
  const renderConponent = () => {
    const currencyUnitValue = fieldInfo.currencyUnit ?? TEXT_EMPTY;
    let value = formatNumber();
    if(!value) {
      value = '0';
    }
    return (
      <View>
        <Text style={FieldDetailNumericStyles.title}>{title}</Text>
        <View style={[FieldDetailNumericStyles.viewValue,
        { justifyContent: fieldInfo.typeUnit !== TypeUnit.SYMBOL ? 'flex-end' : 'space-between' }]}>
          {fieldInfo.typeUnit === TypeUnit.SYMBOL && (<Text>{currencyUnitValue}</Text>)}
          <View style={FieldDetailNumericStyles.right}>
            <Text style={FieldDetailNumericStyles.value}>
              {value}
            </Text>
            {fieldInfo.typeUnit === TypeUnit.UNIT && (<Text style={FieldDetailNumericStyles.value}> {currencyUnitValue}</Text>)}
          </View>

        </View>

      </View>
    );
  }

  return renderConponent();
}