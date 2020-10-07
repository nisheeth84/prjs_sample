import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldDetailLinkStyles } from './field-detail-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Linking, Text, View } from 'react-native';

// Define value props of FieldDetailLink component
type IFieldDetailLinkProps = IDynamicFieldProps;

/**
 * Component for show link fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailLink(props: IFieldDetailLinkProps) {
  const { fieldInfo, languageCode, elementStatus } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const [urlText, setUrlText] = useState('')
  const [urlTarget, setUrlTarget] = useState('')

  useEffect(() => {
    if (fieldInfo.isDefault) {
      setUrlText(fieldInfo.urlText)
      setUrlTarget(fieldInfo.urlTarget)
    } else {
      try {
        const data = JSON.parse(elementStatus?.fieldValue)
        setUrlTarget(data.url_target)
        setUrlText(data.url_text)
      } catch (error) {
        setUrlText('')
        setUrlTarget('')
      }
    }
  })

  /**
   * Render the link component 
   */
  const renderComponent = () => {
    return (
      <View>
        <Text style={FieldDetailLinkStyles.title}>{title}</Text>
        <Text style={FieldDetailLinkStyles.link}
          onPress={() => {
            if (urlTarget && urlTarget !== '') {
              Linking.openURL(urlTarget)
            }
          }}>
          {urlText !== "" ? urlText : urlTarget}
        </Text>
      </View>
    );
  }

  return renderComponent();
}

