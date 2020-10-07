import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldAddEditLinkStyles } from './field-add-edit-styles';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import {
  Linking,
  Text,
  TextInput,
  View
} from 'react-native';
import { ModifyFlag, URLType } from '../../../../../config/constants/enum';
import { theme } from '../../../../../config/constants';
import { translate } from '../../../../../config/i18n';
import _ from "lodash"
// Define value props of FieldAddEditLink component
type IFieldAddEditLinkProps = IDynamicFieldProps;

/**
 * Component for inputing link fields
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditLink(props: IFieldAddEditLinkProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);

  let urlTarget = fieldInfo?.urlTarget || (fieldInfo.defaultValue || TEXT_EMPTY);
  let urlText = fieldInfo?.urlText ?? TEXT_EMPTY;
  if (!fieldInfo.isDefault) {
    const defaultValue = JSON.parse(props.elementStatus?.fieldValue || "{}");
    urlTarget = defaultValue?.url_target ?? TEXT_EMPTY;
    urlText = defaultValue?.url_text ?? TEXT_EMPTY;
  }
  const [valueUrl, setValueUrl] = useState(urlTarget);
  const [valueText, setValueText] = useState(urlText);
  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      keyObject.itemId = props.elementStatus?.key;
      const value = { url_target: valueUrl, url_text: valueText }
      props.updateStateElement(keyObject, fieldInfo.fieldType, JSON.stringify(value));
    }
  };
  /**
   * Handling after each rendering
   */
  useEffect(() => {
    initialize();
  }, [valueUrl, valueText]);

  /**
   * Render the link component in add-edit case
   */
  const renderAddEditLink = () => {
    return (
      <View
        style={FieldAddEditLinkStyles.container}>
        <View style={FieldAddEditLinkStyles.titleContainer}>
          <Text style={FieldAddEditLinkStyles.title}>{title}</Text>
          {(fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && fieldInfo.urlType !== URLType.URL_STATIC)
            && (
              <View style={FieldAddEditLinkStyles.requiredContainer}>
                <Text style={FieldAddEditLinkStyles.textRequired} allowFontScaling>
                  {translate(fieldAddEditMessages.inputRequired)}
                </Text>
              </View>
            )
          }
        </View>
        {props.fieldInfo.urlType === URLType.URL_DYNAMIC &&
          <View style={FieldAddEditLinkStyles.viewInput}>
            <View style={FieldAddEditLinkStyles.textbox}>
              <Text style={FieldAddEditLinkStyles.titleInput}>{translate(fieldAddEditMessages.linkLabelUrl)}</Text>
              <TextInput
                style={FieldAddEditLinkStyles.linkStyle}
                editable={!props.isDisabled}
                value={valueUrl}
                placeholder={`${translate(fieldAddEditMessages.linkLabelUrl)}${translate(fieldAddEditMessages.linkPlaceholder)}`}
                placeholderTextColor={theme.colors.gray}
                onChangeText={(text) => setValueUrl(text)}
              />
            </View>
            <View style={FieldAddEditLinkStyles.divider} />
            <View style={FieldAddEditLinkStyles.textbox}>
              <Text style={FieldAddEditLinkStyles.titleInput}>{translate(fieldAddEditMessages.linkLabelText)}</Text>
              <TextInput
                style={FieldAddEditLinkStyles.linkStyle}
                editable={!props.isDisabled}
                value={valueText}
                placeholder={`${translate(fieldAddEditMessages.linkLabelText)}${translate(fieldAddEditMessages.linkPlaceholder)}`}
                placeholderTextColor={theme.colors.gray}
                onChangeText={(text) => setValueText(text)}
              />
            </View>
          </View>
        }
        {props.fieldInfo.urlType === URLType.URL_STATIC &&
          <Text style={FieldAddEditLinkStyles.link}
            onPress={() => Linking.openURL(urlTarget === TEXT_EMPTY ? "/" : urlTarget)}>
            {urlText ?? urlTarget}
          </Text>
        }
      </View>
    );
  }

  return renderAddEditLink();
}
