import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldAddEditTitleStyles } from './field-add-edit-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';

// Define value props of FieldAddEditTitle component
type IFieldAddEditTitleProps = IDynamicFieldProps;


/**
 * Component for show title fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditTitle(props: IFieldAddEditTitleProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);

  /**
   * Render the title component 
   */
  const renderComponent = () => {

    return (
      <View style={FieldAddEditTitleStyles.flexDirectionRow}>
        <View style={FieldAddEditTitleStyles.tltleLeft}></View>
        <Text style={FieldAddEditTitleStyles.title}>{title}</Text>
      </View>
    );
  }

  return renderComponent();
}

