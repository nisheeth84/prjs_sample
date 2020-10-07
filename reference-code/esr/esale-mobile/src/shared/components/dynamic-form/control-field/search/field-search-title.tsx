import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldSearchTitleStyles } from './field-search-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';

// Define value props of FieldSearchTitle component
type IFieldSearchTitleProps = IDynamicFieldProps;


/**
 * Component for show title fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchTitle(props: IFieldSearchTitleProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);

  /**
   * Render the title component 
   */
  const renderComponent = () => {

    return (
      <View>
        <Text style={FieldSearchTitleStyles.title}>{title}</Text>
      </View>
    );
  }

  return renderComponent();
}

