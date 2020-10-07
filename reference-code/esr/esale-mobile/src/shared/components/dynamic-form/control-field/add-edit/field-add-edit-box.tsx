import React from "react";
import { IDynamicFieldProps } from "../interface/dynamic-field-props";
import { FieldAddEditLink } from "./field-add-edit-link";
import { DefineFieldType } from "../../../../../config/constants/enum";
import { View } from "react-native";
import { FieldAddEditEmail } from "./field-add-edit-email";
import { FieldAddEditTextarea } from "./field-add-edit-textarea";
import { FieldAddEditNumeric } from "./field-add-edit-numeric";
import { FieldAddEditText } from "./field-add-edit-text";
import { FieldAddEditDate } from "./field-add-edit-date";
import { FieldAddEditRadio } from "./field-add-edit-radio";
import { FieldAddEditPhoneNumber } from "./field-add-edit-phone-number";
import { FieldAddEditPulldownMulti } from "./field-add-edit-pulldown-multi";
import { FieldAddEditPulldownSingle } from "./field-add-edit-pulldown-single";
import { FieldAddEditCheckbox } from "./field-add-edit-checkbox";
import { FieldAddEditTitle } from "./field-add-edit-title";
import { FieldAddEditCalculation } from "./field-add-edit-calculation";
import { FieldAddEditAddress } from "./field-add-edit-address";
import { FieldAddEditTab } from "./field-add-edit-tab";
import { FieldAddEditTime } from "./field-add-edit-time";
import { FieldAddEditRelation } from "./field-add-edit-relation";
import { FieldAddEditDateTime } from "./field-add-edit-datetime";
import { FieldAddEditFile } from "./field-add-edit-file";
import { FieldAddEditLookup } from "./field-add-edit-lookup";
import { FieldAddEditOrganization } from "./field-add-edit-organization";

// define type of FieldAddEditBox's props
type IFieldAddEditBoxProps = IDynamicFieldProps;

/**
 * Render field components in case of editing or adding
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditBox(props: IFieldAddEditBoxProps) {
  /**
   * render add/edit form
   */
  const renderDynamicControl = (fieldType: string) => {
    switch (fieldType) {
      case DefineFieldType.SINGER_SELECTBOX:
        return <FieldAddEditPulldownSingle {...props} />;
      case DefineFieldType.MULTI_SELECTBOX:
        return <FieldAddEditPulldownMulti {...props} />;
      case DefineFieldType.CHECKBOX:
        return <FieldAddEditCheckbox {...props} />;
      case DefineFieldType.RADIOBOX:
        return <FieldAddEditRadio {...props} />;
      case DefineFieldType.NUMERIC:
        return <FieldAddEditNumeric {...props} />;
      case DefineFieldType.DATE:
        return <FieldAddEditDate {...props} />;
      case DefineFieldType.DATE_TIME:
        return <FieldAddEditDateTime {...props} />;
      case DefineFieldType.TIME:
        return <FieldAddEditTime {...props} />;
      case DefineFieldType.TEXT:
        return <FieldAddEditText {...props} />;
      case DefineFieldType.TEXTAREA:
        return <FieldAddEditTextarea {...props} />;
      case DefineFieldType.FILE:
        return <FieldAddEditFile {...props} />;
      case DefineFieldType.LINK:
        return <FieldAddEditLink {...props} />;
      case DefineFieldType.PHONE_NUMBER:
        return <FieldAddEditPhoneNumber {...props} />;
      case DefineFieldType.ADDRESS:
        return <FieldAddEditAddress {...props} />;
      case DefineFieldType.EMAIL:
        return <FieldAddEditEmail {...props} />;
      case DefineFieldType.CALCULATION:
        return <FieldAddEditCalculation {...props} />;
      case DefineFieldType.RELATION:
        return <FieldAddEditRelation {...props} />;
      case DefineFieldType.SELECT_ORGANIZATION:
        return <FieldAddEditOrganization {...props} />;
      case DefineFieldType.LOOKUP:
        // return <FieldAddEditLookup {...props} />;
      case DefineFieldType.TAB:
        return <FieldAddEditTab {...props} />;
      case DefineFieldType.TITLE:
        return <FieldAddEditTitle {...props} />;
      default:
        return <View />;
    }
  };

  return renderDynamicControl(props.fieldInfo.fieldType?.toString());
}
