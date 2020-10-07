import React from "react";
import { IDynamicFieldProps } from "../interface/dynamic-field-props";
import { Text, View } from "react-native";
import StringUtils from "../../../../util/string-utils";
import { FIELD_LABLE, TEXT_EMPTY } from "../../../../../config/constants/constants";
import { FieldDetailAddressStyles } from "./field-detail-styles";
import { fieldDetailMessages } from './field-detail-messages';
import { translate } from "../../../../../config/i18n";

// Define value props of FieldDetailAdrdress component
type IFieldDetailAddressProps = IDynamicFieldProps;

/**
 * Component for show address fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailAddress(props: IFieldDetailAddressProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);

  const getValueAddress = () => {
    const jsonAddress = props.elementStatus ? props.elementStatus?.fieldValue : fieldInfo.defaultValue;
    if (jsonAddress && jsonAddress !== TEXT_EMPTY) {
      const objectAddress = JSON.parse(jsonAddress);
      return `${translate(fieldDetailMessages.unitAddress)} ${objectAddress.zip_code ?? TEXT_EMPTY} ${objectAddress.address_name ?? TEXT_EMPTY} ${objectAddress.building_name ?? TEXT_EMPTY}`;
    } else {
      return TEXT_EMPTY;
    }
  }

  /*
   * Render the address component 
   */
  const renderComponent = () => {
    return (
      <View>
        <Text style={FieldDetailAddressStyles.title}>{title}</Text>
        <Text style={FieldDetailAddressStyles.addressDetail}>{getValueAddress()}</Text>
      </View>
    );
  }

  return renderComponent();
}