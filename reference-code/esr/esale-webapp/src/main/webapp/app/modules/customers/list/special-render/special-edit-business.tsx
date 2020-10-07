import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { ControlType } from 'app/config/constants';
import StringUtils from 'app/shared/util/string-utils';

export interface ISpecialEditBusinessProps {
  infoBusinessMain: any 
  rowDataBusinessMain: any

  infoBusinessSub: any
  rowDataBusinessSub: any

  updateStateField: (itemData, type, itemEditValue) => void
  valueData: any
  nameKey: any
  itemFirstFocus: any
  isFocusFirst: any
  errorInfos: any
  rowData
}


/**
 * Component for manager setting item
 * @param props
 */
const SpecialEditBusiness: React.FC<ISpecialEditBusinessProps> = (props) => {
  const [infoBusinessSub, setInfoBusinessSub] = useState(null);
  const [rowDataBusinessSub, setRowDataBusinessSub] = useState({});
  const getErrorInfo = (name) => {
    if (props.errorInfos) {
      const errorInfo = props.errorInfos.find(e => e.item === _.camelCase(name) && e.rowId.toString() === props.rowData.key.toString());
      if (errorInfo) {
        return errorInfo;
      }
    }
    return null;
  }

  useEffect(() => {
    if(props.infoBusinessSub) {
      setInfoBusinessSub(props.infoBusinessSub);
    }
  }, [props.infoBusinessSub])

  useEffect(() => {
    if(props.rowDataBusinessSub) {
      setRowDataBusinessSub(props.rowDataBusinessSub);
    }
  }, [props.rowDataBusinessSub])
  const refBusinessSub = useRef(null);
  const updateStateBusinessMain = (itemData, type, value) => {
    props.updateStateField(itemData, type, value);
    const filedItemSub = props.infoBusinessSub && props.infoBusinessSub.fieldItems.filter(elm => elm.itemParentId.toString() === value);
    const _inFoBusines = _.cloneDeep(props.infoBusinessSub); 
    const newDataBS = Object.assign(_inFoBusines, {fieldItems: filedItemSub})
    setInfoBusinessSub(newDataBS);

    const fieldValueItemSub = filedItemSub.length > 0 ? filedItemSub.find(element => element.fieldId === props.rowDataBusinessSub.fieldValue) : null;
    const _rowDataBusinessSub = _.cloneDeep(props.rowDataBusinessSub);
    if(_.isNil(fieldValueItemSub)) {
      _rowDataBusinessSub['fieldValue'] = filedItemSub.length > 0 ? filedItemSub[0].itemId : null;
    } else {
      _rowDataBusinessSub['fieldValue'] = fieldValueItemSub.fieldId
    }
    if(refBusinessSub && refBusinessSub.current && refBusinessSub.current.setValueEdit) {
      refBusinessSub.current.setValueEdit(_rowDataBusinessSub['fieldValue']);
    }
    setRowDataBusinessSub(_rowDataBusinessSub);
  }

  return <>
    <div className="special-input p-0">
      <div className="input-common-wrap-text w50">
        {props.infoBusinessMain &&
          <DynamicControlField
            showFieldLabel={false}
            errorInfo={getErrorInfo(props.infoBusinessMain.fieldName)}
            controlType={ControlType.EDIT_LIST} isDnDAddField={false}
            isDnDMoveField={false} fieldInfo={props.infoBusinessMain}
            elementStatus={props.rowDataBusinessMain}
            updateStateElement={updateStateBusinessMain}
            idUpdate={getValueProp(props.valueData, props.nameKey)}
          />
        }
      </div>
      <div className="input-common-wrap-text w50">
        { rowDataBusinessSub && infoBusinessSub &&
          <DynamicControlField
            ref={refBusinessSub}
            showFieldLabel={false}
            errorInfo={getErrorInfo(infoBusinessSub)}
            controlType={ControlType.EDIT_LIST} isDnDAddField={false}
            isDnDMoveField={false}
            fieldInfo={infoBusinessSub}
            elementStatus={rowDataBusinessSub}
            updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
            idUpdate={getValueProp(props.valueData, props.nameKey)}
          />
        }
      </div>
    </div>
  </>;
}

export default SpecialEditBusiness;
