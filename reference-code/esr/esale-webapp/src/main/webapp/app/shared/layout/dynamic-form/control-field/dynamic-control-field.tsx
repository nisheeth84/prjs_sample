import React, { useImperativeHandle, forwardRef, useRef } from 'react'
import { ControlType } from 'app/config/constants'
import { IDynamicFieldProps } from './interface/dynamic-field-props';
import FieldSearchBox from './search/field-search-box';
import FieldEditBox from './edit/field-edit-box';
import FieldDisplayBox from './view/field-display-box';
import FieldListFilter from './filter/field-list-filter';
import FieldDetailViewBox from './detail/field-detail-view-box';
import FieldDetailEditBox from './detail/field-detail-edit-box';

type IDynamicControlFieldProps = IDynamicFieldProps

const DynamicControlField = forwardRef((props: IDynamicControlFieldProps, ref) => {
  const fieldRef = useRef(null)  // React.createRef();
  useImperativeHandle(ref, () => ({
    resetValue() {
      if (fieldRef && fieldRef.current && fieldRef.current.resetValue) {
        fieldRef.current.resetValue();
      }
    },
    resetCurrentTab(fieldId) {
      if (fieldRef && fieldRef.current && fieldRef.current.resetCurrentTab) {
        fieldRef.current.resetCurrentTab(fieldId);
      }
    },
    setValueEdit(value) {
      if (fieldRef && fieldRef.current && fieldRef.current.setValueEdit) {
        fieldRef.current.setValueEdit(value);
      }
    }
  }));

  const fieldInfo = props.fieldInfo;
  let type = ControlType.SEARCH;
  if (props.controlType) {
    type = props.controlType;
  }

  const updateStateElement = (key, ftype, itemEdit) => {
    if (props.updateStateElement) {
      if (type === ControlType.SEARCH) {
        props.updateStateElement(fieldInfo, fieldInfo.fieldType.toString(), itemEdit);
      } else if (type === ControlType.EDIT || type === ControlType.EDIT_LIST || type === ControlType.ADD) {
        props.updateStateElement(key, fieldInfo.fieldType.toString(), itemEdit);
      } else if (type === ControlType.FILTER_LIST && key) {
        props.updateStateElement(fieldInfo, key.filterType, itemEdit);
      } else {
        props.updateStateElement(key, ftype, itemEdit);
      }
    }
  }

  const renderComponent = () => {
    if (type === ControlType.SEARCH) {
      return <FieldSearchBox ref={fieldRef} updateStateElement={updateStateElement} {...props} />
    } else if (type === ControlType.FILTER_LIST) {
      return <FieldListFilter {...props} updateStateElement={updateStateElement} />
    } else if (type === ControlType.EDIT || type === ControlType.EDIT_LIST || type === ControlType.ADD) {
      return <FieldEditBox ref={fieldRef} {...props} updateStateElement={updateStateElement} />
    } else if (type === ControlType.VIEW) {
      return <FieldDisplayBox ref={fieldRef} {...props} />
    } else if (type === ControlType.DETAIL_VIEW) {
      return <FieldDetailViewBox ref={fieldRef} {...props} />
    } else if (type === ControlType.DETAIL_EDIT) {
      return <FieldDetailEditBox ref={fieldRef} {...props} updateStateElement={updateStateElement} />
    }
    return <></>;
  }
  return renderComponent();
});

DynamicControlField.defaultProps = {
  isRequired: false,
  showFieldLabel: true,
  fieldStyleClass: {
    textBox: {
      search: {
        input: "input-normal input-common2",
        wrapInput: "box-radio-wrap box-aligh-right"
      },
      edit: { input: "input-normal w100" }
    },
    textArea: {
      search: {
        input: "form-control input-common",
        wrapInput: "form-group common",
      },
      edit: { input: "input-common" }
    },
    checkBox: {
      search: {
        wrapCheckbox: "wrap-check-box",
        inputCheckbox: "check-box-item",
      },
      edit: {
        wrapCheckbox: "wrap-check-box",
        inputCheckbox: "icon-check",
      }
    },
    radioBox: {
      search: { wrapRadio: "wrap-check-radio" },
      edit: { wrapRadio: "wrap-check-radio align-items-stretch" }
    },
    singleSelectBox: {
      search: {
        wrapSelect: "wrap-check-box",
        inputSelect: "check-box-item"
      },
      edit: {
        wrapSelect: "select-option",
        inputSelect: "select-text text-ellipsis",
        dropdownSelect: "drop-down drop-down2 max-height-300"
      }
    },
    multiSelectBox: {
      search: {
        wrapSelect: "wrap-check-box",
        inputSelect: "check-box-item"
      },
      edit: {
        wrapSelect: "select-option",
        inputSelect: "select-text text-ellipsis",
        dropdownSelect: "drop-down drop-down2 max-height-300"
      }
    },
    numberBox: {
      search: {
        wrapBoxFrom: "form-group common has-delete",
        wrapInputFrom: "form-control-wrap",
        inputFrom: "input-normal input-common2 text-right",
        wrapBoxTo: "form-group common has-delete",
        wrapInputTo: "form-control-wrap",
        inputTo: "input-normal input-common2 text-right",
      },
      edit: {
        wrapBox: "form-group common has-delete",
        wrapInput: "form-control-wrap currency-form input-common-wrap",
        input: "input-normal text-right",
      },
      editList: {
        wrapBox: "form-group common has-delete",
        wrapInput: "form-control-wrap currency-form input-common-wrap",
        input: "input-normal text-right",
      },
    },
    dateBox: {
      search: {},
      edit: {
        wrapInput: "form-group common has-delete",
        input: "input-normal input-common2 one-item"
      }
    },
    timeBox: {
      search: {},
      edit: {
        wrapInput: "form-group common has-delete mt-0 mb-0",
        input: "input-normal input-common2 version2 text-left",
        inputList: "input-normal input-common version2 text-left"
      }
    },
    datetimeBox: {
      search: {},
      edit: {
        wrapBox: 'common list-edit-date-time d-block',
        wrapDate: 'cancel form-group has-delete mt-0 mb-0',
        inputDate: 'input-normal one-item',
        wrapTime: 'cancel form-group has-delete mt-0 mb-0',
        inputTime: 'input-normal text-left',
      }
    },
    titleBox: {
      edit: {
        wrapBox: 'item'
      }
    },
    detailViewBox: {
      columnFirst: 'title-table w15',
      columnSecond: ''
    },
    addressBox: {
      search: {},
      edit: {
        inputText: "input-normal"
      }
    }

  }
};

export default DynamicControlField

