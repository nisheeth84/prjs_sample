import React from "react";
import { Text, View } from "react-native";
import { FIELD_LABLE, TEXT_EMPTY } from "../../../../../config/constants/constants";
import { timeUtcToTz } from "../../../../util/date-utils";
import StringUtils from "../../../../util/string-utils";
import { IDynamicFieldProps } from "../interface/dynamic-field-props";
import { FieldDetailTimeStyles } from "./field-detail-styles";

// Define value props of FieldDetailTimecomponent
type IFieldDetailTimeProps = IDynamicFieldProps;

/**
 * Component for show time fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailTime(props: IFieldDetailTimeProps) {
  const { fieldInfo, languageCode,timezoneName,formatDate } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const value = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
  const timeDetail = timeUtcToTz(value, timezoneName,formatDate);
  /*
   * Render the time component 
   */
  const renderComponent = () => {
    return (
      <View>
        <Text style={FieldDetailTimeStyles.title}>{title}</Text>
        <Text style={FieldDetailTimeStyles.textColorTime}>{timeDetail}</Text>
      </View>
    );
  }

  return renderComponent();
}
