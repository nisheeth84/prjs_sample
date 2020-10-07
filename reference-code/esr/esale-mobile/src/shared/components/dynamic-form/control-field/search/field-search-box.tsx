import React from "react";
import { View } from "react-native";
import { IDynamicFieldProps } from "../interface/dynamic-field-props";
import { FieldSearchLink } from "./field-search-link";
import { DefineFieldType } from "../../../../../config/constants/enum";
import { FieldSearchNumeric } from "./field-search-numeric";
import { FieldSearchText } from "./field-search-text";
import { FieldSearchRadio } from "./field-search-radio";
import { FieldSearchPhoneNumber } from "./field-search-phone-number";
import { FieldSearchEmail } from "./field-search-email";
import { FieldSearchPulldownSingle } from './field-search-pulldown-single';
import { FieldSearchTextarea } from "./field-search-textarea";
import { FieldSearchDate } from "./field-search-date";
import { FieldSearchCheckbox } from "./field-search-checkbox";
import { FieldSearchPulldownMulti } from "./field-search-pulldown-multi";
import { FieldSearchTime } from "./field-search-time";
import { FieldSearchTitle } from "./field-search-title";
import { FieldSearchCalculation } from "./field-search-calculation";
import { FieldSearchAddress } from "./field-search-address";
import { FieldSearchTab } from "./field-search-tab";
import { FieldSearchRelation } from "./field-search-relation";
import { FieldSearchFile } from "./field-search-file";
import { FieldSearchDateTime } from "./field-search-datetime";
import { FieldSearchLookup } from "./field-search-lookup";
import { FieldSearchOrganization } from "./field-search-organization";


// define type of FieldSearchBox's props
type IFieldSearchBoxProps = IDynamicFieldProps;

/**
 * Component search form
 * @param props see IDynamicFieldProps
 */
export function FieldSearchBox(props: IFieldSearchBoxProps) {

	/**
	 * render search form
	 */
  /**
   * render search form
   */
  const renderDynamicControl = (fieldType: string) => {
    switch (fieldType) {
      case DefineFieldType.SINGER_SELECTBOX:
        return <FieldSearchPulldownSingle {...props} />;
      case DefineFieldType.MULTI_SELECTBOX:
        return <FieldSearchPulldownMulti {...props} />;
      case DefineFieldType.CHECKBOX:
        return <FieldSearchCheckbox {...props} />;
      case DefineFieldType.RADIOBOX:
        return <FieldSearchRadio {...props} />;
      case DefineFieldType.NUMERIC:
        return <FieldSearchNumeric {...props} />;
      case DefineFieldType.DATE:
        return <FieldSearchDate {...props} />
      case DefineFieldType.DATE_TIME:
        return <FieldSearchDateTime {...props} />
      case DefineFieldType.TIME:
        return <FieldSearchTime {...props} />
      case DefineFieldType.TEXT:
        return <FieldSearchText {...props} />;
      case DefineFieldType.TEXTAREA:
        return <FieldSearchTextarea {...props} />;
      case DefineFieldType.FILE:
        return <FieldSearchFile {...props} />;
      case DefineFieldType.LINK:
        return <FieldSearchLink {...props} />;
      case DefineFieldType.PHONE_NUMBER:
        return <FieldSearchPhoneNumber {...props} />;
      case DefineFieldType.ADDRESS:
        return <FieldSearchAddress {...props} />;
      case DefineFieldType.EMAIL:
        return <FieldSearchEmail {...props} />;
      case DefineFieldType.CALCULATION:
        return <FieldSearchCalculation {...props} />;
      case DefineFieldType.RELATION:
        return <FieldSearchRelation {...props} />;
      case DefineFieldType.SELECT_ORGANIZATION:
        return <FieldSearchOrganization {...props} />;
      case DefineFieldType.LOOKUP:
        return <FieldSearchLookup {...props} />
      case DefineFieldType.TAB:
        return <FieldSearchTab />
      case DefineFieldType.TITLE:
        return <FieldSearchTitle {...props} />;
      default:
        return <View />;
    }
  }

  return renderDynamicControl(props.fieldInfo.fieldType?.toString());
}
