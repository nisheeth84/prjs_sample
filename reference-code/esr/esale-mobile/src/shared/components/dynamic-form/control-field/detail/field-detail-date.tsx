import moment from 'moment';
import React from "react";
import { Text, View } from "react-native";
import { APP_DATE_FORMAT_ES, FIELD_LABLE, TEXT_EMPTY } from "../../../../../config/constants/constants";
import StringUtils from "../../../../util/string-utils";
import { IDynamicFieldProps } from "../interface/dynamic-field-props";
import { FieldDetailDateStyles } from "./field-detail-styles";
// Define value props of FieldDetailDatecomponent
type IFieldDetailDateProps = IDynamicFieldProps;


/**
 * Component for show date fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailDate(props: IFieldDetailDateProps) {
  const { fieldInfo, languageCode,formatDate } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const valueDate = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
	/*
	 * Render the date component 
	 */
  const renderComponent = () => {
    let valueFormatDate;

    const newDate = moment(valueDate, APP_DATE_FORMAT_ES);
    if (newDate.isValid()) {
      valueFormatDate = newDate.format(formatDate.toUpperCase());
    } else {
      valueFormatDate =  valueDate;
    }
    return (
      <View>
        <Text style={FieldDetailDateStyles.title}>{title}</Text>
        <Text style={FieldDetailDateStyles.value}>{valueFormatDate}</Text>
      </View>
    );
  }

  return renderComponent();
}

