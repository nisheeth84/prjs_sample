import React, { useState } from 'react';
import _ from 'lodash';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { PRODUCT_SPECIAL_FIELD_NAMES } from '../constants';
import {  ScreenMode, ControlType } from 'app/config/constants';
import { translate } from 'react-jhipster';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import ProductNameField from './ProductNameField'
// import {getJsonBName} from 'app/modules/products/utils'
export interface ISpecialEditListProps {
  valueData: any,
  itemData: any,
  extensionsData: any,
  nameKey?: any,
  errorInfo?: any,
  mode?: number;
  updateStateField: (itemData, type, itemEditValue, index?:any) => void             // callback when user edit value cell
  firstFocus?: { id, item, nameId }  // Check focus error item. Id : this is id (row index or obj id). item : field name. nameId : obj key.
  onOpenPopupProductDetail?:any
}

/**
 * Component for manager setting item
 * @param props 
 */
const SpecialEditList: React.FC<ISpecialEditListProps> = (props) => {
  const { nameKey } = props;
  const rowData = { key: '', fieldValue: null };
  rowData.key = getValueProp(props.valueData, nameKey);
  const [isDisplay, setIsDisplay] = useState(props.valueData ? props.valueData[PRODUCT_SPECIAL_FIELD_NAMES.isDisplay] : false);

  const onUpdateFieldValue = (itemData, type, itemEditValue , idx) => {
    if (props.mode !== ScreenMode.EDIT && props.updateStateField) {
      return;
    }
    props.updateStateField(itemData, type, itemEditValue , idx);
  };

  const handleIsDisplayChange = event => {
    setIsDisplay(event.target.checked);
    const item = _.cloneDeep(props.itemData);
    item.itemId = props.valueData['product_id'];
    onUpdateFieldValue(item, null, event.target.checked, null)
  };

  const renderComponentIsDisplay = () => {
    if(props.mode === ScreenMode.DISPLAY) {
      const cellId = `dynamic_cell_${getValueProp(rowData, nameKey)}_${props.itemData.fieldId}`
      const val = props.valueData[PRODUCT_SPECIAL_FIELD_NAMES.isDisplay] ? translate('products.list.label.is-display.true') : translate('products.list.label.is-display.false');
      return (
        <>
          <div id={cellId} className="break-spaces">{val}</div>
        </>)
    } else {
      return (
        <div>

          <p className="check-box-item">
            <label className="icon-check">
              <input type="checkbox" defaultChecked={isDisplay} onChange={handleIsDisplayChange} />
              <i /> {translate('products.create-set.isDisplay-label2')}
            </label>
          </p>
        </div>
      );
    }
  }

  const getColumnWidth = (field: any) => {
    let width = 0;
    if (_.isArray(field) && field.length > 0) {
      field.forEach(e => {
        width += e.columnWidth ? e.columnWidth : 100;
      });
    } else if (field.isCheckBox) {
      width = 90;
    } else {
      width = field.columnWidth ? field.columnWidth : 100;
    }
    return width;
  };

  const renderComponentProductCategory = () => {
    
    const cellId = `dynamic_cell_${getValueProp(rowData, nameKey)}_${props.itemData.fieldId}`
    const styleCell = {};
    let classCell = '';
    if (props.mode !== ScreenMode.EDIT) {
      styleCell["width"] = `${getColumnWidth(props.itemData)}px`;
      classCell += ' text-over text-ellipsis';
    } else {
      classCell += ' text-form-edit';
    }
    if(props.mode === ScreenMode.DISPLAY) {
      const fieldItems = props.itemData.fieldItems;
      let val = '';
      if (fieldItems && fieldItems.length > 0) {
        const field = fieldItems.find(item => item.itemId === props.valueData[PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId]);
        val = field ? getFieldLabel(field, 'itemLabel') : '';
      }
      return (
        <>
          <div id={cellId} className="break-spaces">{val}</div>
        </>)
    } else {
      const fieldInfo = _.cloneDeep(props.itemData);
      fieldInfo.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
      if (props.valueData) {
        rowData.fieldValue = getValueProp(props.valueData, props.itemData.fieldName);
      }
      // isFocus : varible check focus
      let isFocus = false;
      // Check the props firstFocusError. 
      // If there are values, compare those values with the fixed ones to find the first position have error.
      if (props.firstFocus && props.firstFocus.id) {
        if (props.firstFocus.id === rowData[props.firstFocus.nameId] && StringUtils.equalPropertyName(props.firstFocus.item, props.itemData.fieldName)) {
          isFocus = true;
        }
      }
      return (
        <div id={cellId} style={{ ...styleCell}} className={classCell + "set-width-200" }  >
          <DynamicControlField
            key={cellId}
            showFieldLabel={false}
            errorInfo={props.errorInfo}
            controlType={ControlType.EDIT_LIST}
            isDnDAddField={false}
            isDnDMoveField={false}
            fieldInfo={fieldInfo}
            elementStatus={rowData}
            updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => {}}
            idUpdate={getValueProp(props.valueData, nameKey)}
            isFocus={isFocus}
          />
        </div>
      );
    }
  }

  return (
    <>
      {props.itemData.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.isDisplay &&
        renderComponentIsDisplay()
      }
      {props.itemData.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId &&
        renderComponentProductCategory()
      }
      {props.itemData.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productName &&
       <ProductNameField
        rowData={props.valueData} 
        mode={props.mode} 
        field={props.itemData}
        errorInfo={props.errorInfo}
        updateStateField={props.updateStateField}
        nameKey={props.nameKey}
        firstFocus={props.firstFocus}
        onOpenPopupProductDetail={props.onOpenPopupProductDetail}
         />
      }
    </>
  )
}

export default SpecialEditList;