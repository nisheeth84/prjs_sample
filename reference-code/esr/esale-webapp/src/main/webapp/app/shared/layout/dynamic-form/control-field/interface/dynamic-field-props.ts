import { IElementStatusField } from './element-status-field';
import { ControlType } from 'app/config/constants';
import { IFieldDynamicStyleClass } from './field-dynamic-style-class';
import { ConnectDragSource, ConnectDropTarget } from 'react-dnd';
import { DynamicControlAction } from '../../constants';

export interface IDynamicFieldProps {
  id?: any;
  isFocus?: boolean; // if set focus
  isRequired?: boolean; // display required icon
  showFieldLabel?: boolean; // show field label
  errorInfo?: { rowId; item; errorCode; errorMsg; errorParams: {}; arrayError?: any[] }; // error object
  errorInfos?: { rowId; item; errorCode; errorMsg; errorParams: {} }[]; // error object
  belong?: number; // belong of module function (field-belong)
  extBelong?: number; // children of mudule function if have
  isDnDWithBelong?: boolean; // draf & drop same field belong
  serviceType?: number; // refer to service info table
  fieldInfo: any; // field info in database get from api
  listFieldInfo?: any[]; // for setting field info, list fieldinfo used
  relationDisplayField?: any; // for field relation
  fieldNameExtension?: string; // field name extension example employeeData
  elementStatus?: IElementStatusField; // current status display of control
  isDisabled?: boolean; // control disabled?
  isDnDMoveField?: boolean; // if control can drag & drop if user move order
  isDnDAddField?: boolean; // if control can drag & drop for add from other source
  controlType?: ControlType; // control type: edit, search, filter
  className?: string; // class name of div wrap control
  fieldStyleClass?: IFieldDynamicStyleClass; // style class for custom style every children control of field dynamic
  renderControlTitle?: (fieldInfo: any) => JSX.Element;
  renderControlContent?: (fieldInfo: any) => JSX.Element;
  onExecuteAction?: (fieldInfo: any, actionType: DynamicControlAction, params?: any) => void; // callback when fire action
  updateStateElement?: (
    keyElement: string | any,
    type: string | any,
    objEditValue: string | any,
    extEditValue?: any
  ) => void; // callback when change status control
  moveFieldCard?: (
    dragFieldInfo: any,
    dropFieldInfo: any,
    isDoubleColumn?: boolean,
    isAddLeft?: boolean
  ) => void; // callback when end drop for move order dynamic field
  addFieldCard?: (fieldData, dropId: number, isDoubleColumn?: boolean, isAddLeft?: boolean) => void; // callback when end drop for add dynamic control
  enterInputControl?: (event: any) => void; // callback when user pressed enter key
  // Collected Props
  isDragging?: boolean; // for drag & drop, user don't need passs compoment
  connectDragSource?: ConnectDragSource; // for drag & drop, user don't need passs compoment
  connectDropTarget?: ConnectDropTarget; // for drag & drop, user don't need passs compoment
  recordId?: any; // record id for edit
  elementTags?: any[]; // for select organization
  updateFiles?: (uploadfiles) => void; // for upload file
  isSingleFile?: boolean; // for file single
  acceptFileExtension?: any[]; // for file extension
  idUpdate?: any; // for upload file multil records
  getFieldsCallBack?: any; // for field before save when edit or add new field
  isLastColumn?: boolean; // for field in the last column on list
  isResultsSearch?: boolean; // is dialog results search
  formBottomRef?: any;
  isCustomerIntegration?: boolean;
  confirmDeleteLogo?: boolean;
}
