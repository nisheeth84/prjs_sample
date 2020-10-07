import _ from 'lodash';
import React from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, ITEM_LABEL, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View } from 'react-native';
import { FieldDetailPulldownMultiStyles } from './field-detail-styles';

// Define value props of FieldDetailPulldownMulti component
type IFieldDetailPulldownMultiProps = IDynamicFieldProps;

/**
 * Component for show pulldown multi fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailPulldownMulti(props: IFieldDetailPulldownMultiProps) {
  const { fieldInfo, languageCode } = props;
  const language = languageCode ?? TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language);

  /**
   * Render pulldown multi component 
   */
  const renderComponent = () => {
    let content = TEXT_EMPTY;
    if (props?.elementStatus?.fieldValue) {
      let defaultValue = null;
      try {
        defaultValue = _.isString(props.elementStatus.fieldValue) ? JSON.parse(props.elementStatus.fieldValue) : props.elementStatus.fieldValue;
        if (!_.isArray(defaultValue)) {
          defaultValue = [defaultValue];
        }
      } catch {
        defaultValue = [];
      }
      defaultValue.forEach((item: any) => {
        const fieldLabel = `${StringUtils.getFieldLabel(fieldInfo.fieldItems.find((i: any) => i.itemId == item), ITEM_LABEL, language)}`;
        if (content === TEXT_EMPTY) {
          content = `${content}${fieldLabel}`
        } else {
          content = `${content}, ${fieldLabel}`
        }
      });
    }
    return (
      <View>
        <Text style={FieldDetailPulldownMultiStyles.title}>{title}</Text>
        <Text style={FieldDetailPulldownMultiStyles.value}>{content}</Text>
      </View>
    );
  }

  return renderComponent();
}