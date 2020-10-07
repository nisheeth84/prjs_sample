import React, { useState, useEffect } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldDetailTextAreaStyles } from './field-detail-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, View, Linking } from 'react-native';

interface MyText {
  text: string,
  isLink: boolean
}


// Define value props of FieldDetailTextarea component
type IFieldDetailTextareaProps = IDynamicFieldProps;


/**
 * Component for show textarea fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailTextarea(props: IFieldDetailTextareaProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const text = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue
  const [arrText, setArrText] = useState<MyText[]>([])

  const getLink = (stringText: string) => {
    if (!text || text == "") {
      return
    }
    const arrText = stringText.split(' ')
    let result: MyText[] = []
    arrText.forEach(text => {
      if (text.match(/\bhttps?:\/\/\S+/gi)) {
        const link = text.replace(/[^\x00-\x7F]/g, "")
        if (text.indexOf('http') !== 0) {
          const textBeforeLink = text.substring(0, text.indexOf('http'))
          result.push({ text: textBeforeLink, isLink: false })
          result.push({ text: link, isLink: true })
          const textAfterLink = text.substring(textBeforeLink.length + link.length, text.length)
          result.push({ text: textAfterLink, isLink: false })
          result.push({ text: " ", isLink: false })
        } else {
          const textAfterLink = text.replace(link, "")
          result.push({ text: link, isLink: true })
          result.push({ text: textAfterLink, isLink: false })
          result.push({ text: " ", isLink: false })
        }
      } else {
        result.push({ text: text, isLink: false })
        result.push({ text: " ", isLink: false })
      }
    })
    setArrText(result)
  }

  useEffect(() => {
    getLink(text)
  }, [])

  /**
   * Render the textarea component 
   */
  const renderComponent = () => {

    return (
      <View>
        <Text style={FieldDetailTextAreaStyles.title}>{title}</Text>
        <Text>
          {arrText.map(item => {
            if (item.isLink) {
              return (<Text style={FieldDetailTextAreaStyles.link} onPress={() => Linking.openURL(item.text)}>{item.text}</Text>)
            } else {
              return (<Text>{item.text}</Text>)
            }
          })}
        </Text>
      </View>
    );
  }

  return renderComponent();
}

