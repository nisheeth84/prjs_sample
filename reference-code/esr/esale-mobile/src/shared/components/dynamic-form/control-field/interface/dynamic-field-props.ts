
import { IElementStatusField } from "./element-status-field";

/**
 * Define props is used in control-field
 */

export interface IDynamicFieldProps {
  fields?: any;
  isFocus?: boolean; // if set focus
  isRequired?: boolean; // display required icon
  showFieldLabel?: boolean; // show field label
  errorInfo?: { rowId?: any; item?: any; errorCode?: any; errorMsg?: any; errorParams?: {}; arrayError?: any[] }; // error object
  belong?: number; // belong of module function (field-belong)
  extBelong?: number; // children of mudule function if have
  serviceType?: number; // refer to service info table
  fieldInfo: any; // field info in database get from api
  listFieldInfo?: any[]; // for setting field info, list fieldinfo used
  fieldNameExtension?: string; // field name extension example employeeData
  elementStatus?: IElementStatusField; // current status display of control
  isDisabled?: boolean; // control disabled?
  controlType?: number; // control type: edit, search, filter
  updateStateElement?: (keyElement: string | any, type: string | any, objEditValue: string | any, extEditValue?: any) => void; // callback when change status control
  data?: any; // data in database mapping with fieldInfo
  languageCode?: string; //language code
  formatDate?: any; // format date
  timezoneName?: any//timezone
  extensionData?: any// data extension example employeeData
  mode?: number; // mode select file
}