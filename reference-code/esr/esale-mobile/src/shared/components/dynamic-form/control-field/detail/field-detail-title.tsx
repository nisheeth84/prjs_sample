import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldDetailTitleStyles } from './field-detail-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';

// Define value props of FieldAddEditTitle component
type IFieldDetailTitleProps = IDynamicFieldProps;


/**
 * Component for show title fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailTitle(props: IFieldDetailTitleProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);

  /**
   * Render the title component 
   */
  const renderComponent = () => {

    return (
      <View style={FieldDetailTitleStyles.container}>
        <View style={FieldDetailTitleStyles.header} />
        <Text style={FieldDetailTitleStyles.title}>{title}</Text>
      </View>
    );
  }

  return renderComponent();
}

