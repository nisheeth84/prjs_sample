import React from "react";
import { IDynamicFieldProps } from "../interface/dynamic-field-props";
import { FieldDetailLink } from "./field-detail-link";
import { DefineFieldType } from "../../../../../config/constants/enum";
import { View } from "react-native";
import { FieldDetailNumeric } from "./field-detail-numeric";
import { FieldDetailText } from "./field-detail-text";
import { FieldDetailPhoneNumber } from "./field-detail-phone-number";
import { FieldDetailEmail } from "./field-detail-email";
import { FieldDetailPulldownSingle } from "./field-detail-pulldown-single";
import { FieldDetailTextarea } from "./field-detail-textarea";
import { FieldDetailDate } from "./field-detail-date";
import { FieldDetailCheckbox } from "./field-detail-checkbox";
import { FieldDetailRadio } from "./field-detail-radio";
import { FieldDetailPulldownMulti } from "./field-detail-pulldown-multi";
import { FieldDetailTime } from "./field-detail-time";
import { FieldDetailTitle } from "./field-detail-title";
import { FieldDetailCalculation } from "./field-detail-calculation";
import { FieldDetailAddress } from "./field-detail-address";
import { FieldDetailTab } from "./field-detail-tab";
import { FieldDetailRelation } from "./field-detail-relation";
import { FieldDetailDateTime } from "./field-detail-datetime";
import { FieldDetailLookup } from "./field-detail-lookup";
import { FieldDetailOrganization } from "./field-detail-organization";
import { FieldDetailEmpty } from "./field-detail-empty";

// Define props's component
type IFieldDetailBoxProps = IDynamicFieldProps;
/**
 * Component for render base on type field
 */
export function FieldDetailBox(props: IFieldDetailBoxProps) {
  const { fieldInfo, elementStatus } = props;
  const value = elementStatus
    ? elementStatus.fieldValue
    : fieldInfo.defaultValue;
  const specialTitleField = [
    DefineFieldType.TITLE,
    DefineFieldType.TAB,
    DefineFieldType.LOOKUP,
    DefineFieldType.CALCULATION,
    DefineFieldType.RELATION,
  ];

  /**
   * render detail form
   */
  const renderDynamicControl = (fieldType: string) => {
    if (
      (value === undefined || value === null || value === "") &&
      !specialTitleField.includes(fieldType)
    ) {
      return <FieldDetailEmpty {...props} />;
    }
    switch (fieldType) {
      case DefineFieldType.SINGER_SELECTBOX:
        return <FieldDetailPulldownSingle {...props} />;
      case DefineFieldType.MULTI_SELECTBOX:
        return <FieldDetailPulldownMulti {...props} />;
      case DefineFieldType.CHECKBOX:
        return <FieldDetailCheckbox {...props} />;
      case DefineFieldType.RADIOBOX:
        return <FieldDetailRadio {...props} />;
      case DefineFieldType.NUMERIC:
        return <FieldDetailNumeric {...props} />;
      case DefineFieldType.DATE:
        return <FieldDetailDate {...props} />;
      case DefineFieldType.DATE_TIME:
        return <FieldDetailDateTime {...props} />;
      case DefineFieldType.TIME:
        return <FieldDetailTime {...props} />;
      case DefineFieldType.TEXT:
        return <FieldDetailText {...props} />;
      case DefineFieldType.TEXTAREA:
        return <FieldDetailTextarea {...props} />;
      case DefineFieldType.FILE:
        return <View />; //<FieldDetailFile {...props} />;
      case DefineFieldType.LINK:
        return <FieldDetailLink {...props} />;
      case DefineFieldType.PHONE_NUMBER:
        return <FieldDetailPhoneNumber {...props} />;
      case DefineFieldType.ADDRESS:
        return <FieldDetailAddress {...props} />;
      case DefineFieldType.EMAIL:
        return <FieldDetailEmail {...props} />;
      case DefineFieldType.CALCULATION:
        return <FieldDetailCalculation {...props} />;
      case DefineFieldType.RELATION:
        return <FieldDetailRelation {...props} />;
      case DefineFieldType.SELECT_ORGANIZATION:
        return <FieldDetailOrganization {...props} />;
      case DefineFieldType.LOOKUP:
        return <FieldDetailLookup />;
      case DefineFieldType.TAB:
        return <FieldDetailTab {...props} />;
      case DefineFieldType.TITLE:
        return <FieldDetailTitle {...props} />;
      default:
        return <View />;
    }
  };
  return renderDynamicControl(props.fieldInfo.fieldType?.toString());
}
