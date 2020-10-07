import _ from 'lodash';
import styled from 'styled-components';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DragSourceMonitor, ConnectDragSource } from 'react-dnd';
import { DragSource, DragSourceConnector } from 'react-dnd';
import { getValueProp } from 'app/shared/util/entity-utils';
import { ScreenMode } from 'app/config/constants';
import { isUrlify, getFieldLabel } from 'app/shared/util/string-utils';
import { isColumnCheckbox } from 'app/shared/layout/dynamic-form/list/dynamic-list-helper';
import { DEFINE_FIELD_TYPE, DND_ITEM_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { CURRENCY } from '../../constants';
import Popover from 'app/shared/layout/common/Popover';

const Td = styled.td`
  height: 83px;
`;
// height: ${props => (props.height < 83 ? 83 : props.height ) + ' px !important'};

const ProductNameEl = styled.a`
  color: #0f6db5 !important;
`;

export interface IListContentRowProps {
  index: number;
  record: any; // record for row
  rowClassName?: string; // row style class
  modeDisplay: number; // mode edit or display get from ScreenMode enum
  fields: any; // field info in database get from api
  keyRecordId?: string; // field name of record id in list record
  rowHeight?: number; // set row Height
  formatFieldGroup?: { fields: string[]; titleField: string; mergeView: boolean; mergeEdit: boolean }[];
  isResizingColumn?: boolean;
  contentCell?: (rowData, field, index) => JSX.Element; // render element from parent component
  onClickCell?: (recordId: number, fieldId: number) => void; // callback when user click row
  onChangeRowHeight?: (row: { recordId; rowHeight }) => void;
  onMouseRowEnter?: (event) => void; // callback when
  onMouseRowLeave?: (event) => void; // callback when
  onDragRow: (sourceRow, targetDepartment) => void; // callback when user drag row
  isDragging: boolean; // for drag & drop, user don't need pass component
  connectDragSource: ConnectDragSource; // for drag & drop, user don't need pass component
  onQuantityChange: (idx, quantity) => void;
  onDeleteItem: (idx, recordId) => void;
  isRenderDefaultField: boolean;
  openProductDetail?: (id) => void;
  errorCode?: any;
  isSetting?: boolean;
}

const ListContentRow: React.FC<IListContentRowProps> = props => {
  const [rowHeight, setRowHeight] = useState(0);
  // const [valueEdit, setValueEdit] = useState('');

  useEffect(() => {
    setRowHeight(props.rowHeight);
  }, [props.rowHeight]);

  // const isValidNumber = (strValue: string) => {
  //   if (!strValue || strValue.trim().length < 1) {
  //     return true;
  //   }
  //   const strNumber = strValue.replace(/,/g, '');
  //   return /^[-+]?\d*$/g.test(strNumber);
  // };

  // const commaFormatted = (amount: string) => {
  //   const delimiter = ','; // replace comma if desired
  //   let numberParts = amount.split('.', 2);
  //   const decimalPart = numberParts.length > 1 ? numberParts[1] : '';
  //   let integerPart = +numberParts[0];

  //   if (isNaN(integerPart)) {
  //     return '';
  //   }
  //   let minus = '';
  //   if (integerPart < 0) {
  //     minus = '-';
  //   }
  //   integerPart = Math.abs(integerPart);
  //   let n = integerPart.toString();
  //   numberParts = [];
  //   while (n.length > 3) {
  //     const nn = n.substr(n.length - 3);
  //     numberParts.unshift(nn);
  //     n = n.substr(0, n.length - 3);
  //   }
  //   if (n.length > 0) {
  //     numberParts.unshift(n);
  //   }
  //   n = numberParts.join(delimiter);
  //   if (decimalPart.length < 1) {
  //     amount = n;
  //   } else {
  //     amount = n + '.' + decimalPart;
  //   }
  //   amount = minus + amount;
  //   return amount;
  // };

  // const autoFormatNumber = (strValue: string) => {
  //   if (!strValue || strValue.trim().length < 1) {
  //     return '';
  //   }
  //   let ret = strValue.replace(/,/g, '').trim();
  //   if (ret.startsWith('.')) {
  //     ret = '0' + ret;
  //   }
  //   if (ret.endsWith('.')) {
  //     ret = '0' + ret;
  //   }
  //   return commaFormatted(ret);
  // };

  // useEffect(() => {
  //   if (props.record && props.record.quantity) {
  //     const val = props.record.quantity.toString();
  //     setValueEdit(val);
  //     // console.log("val", autoFormatNumber(val));
  //   } else {
  //     setValueEdit('0');
  //   }
  // }, [props.record]);

  // const handleQuantityChange = event => {
  //   if (event.target.value === '-') {
  //     setValueEdit('0');
  //     props.onQuantityChange(props.index, 0);
  //   } else if (event.target.value === '' || isValidNumber(event.target.value)) {
  //     setValueEdit(event.target.value ? event.target.value : '0');
  //     props.onQuantityChange(props.index, Number(event.target.value.replace(/,/g, '')));
  //   }
  // };

  const handleDeleteItem = event => {
    let nameKey = 'unk';
    if (props.keyRecordId) {
      nameKey = props.keyRecordId;
    }
    const recordId = getValueProp(props.record, nameKey);
    props.onDeleteItem(props.index, recordId);
    event.preventDefault();
  };

  const hasDataFile = data => {
    let hasData = false;
    try {
      const files = _.isString(data) ? JSON.parse(data) : data;
      if (files && Array.isArray(files) && files.length > 0) {
        hasData = true;
      }
    } catch (e) {
      hasData = false;
    }
    return hasData;
  };

  const isDisableClickField = field => {
    if (_.isArray(field)) {
      for (let i = 0; i < field.length; i++) {
        if (
          (field[i].fieldType.toString() === DEFINE_FIELD_TYPE.FILE && hasDataFile(getValueProp(props.record, field[i].fieldName))) ||
          (field[i].fieldType.toString() === DEFINE_FIELD_TYPE.LINK || field[i].fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL)
        ) {
          return true;
        }
      }
    } else {
      if (
        (field.fieldType.toString() === DEFINE_FIELD_TYPE.FILE && hasDataFile(getValueProp(props.record, field.fieldName))) ||
        (field.fieldType.toString() === DEFINE_FIELD_TYPE.LINK || field.fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL) ||
        (field.fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA && isUrlify(getValueProp(props.record, field.fieldName)))
      ) {
        return true;
      }
    }
    return false;
  };

  const onClickListCell = (ev, field: any) => {
    if (
      props.onClickCell &&
      (ev.target instanceof HTMLTableCellElement || (props.modeDisplay === ScreenMode.DISPLAY && ev.target.nodeName.toLowerCase() !== 'i'))
    ) {
      let nameKey = 'unk';
      if (props.keyRecordId) {
        nameKey = props.keyRecordId;
      }
      const recordId = getValueProp(props.record, nameKey);
      let params = null;
      if (_.isArray(field)) {
        params = field.map(e => e.fieldId);
      } else {
        params = isColumnCheckbox(field) ? null : field.fieldId;
      }
      props.onClickCell(recordId, isDisableClickField(field) ? null : params);
    }
  };

  const onClickToProductName = useCallback(() => {
    if (props.record && props.openProductDetail) props.openProductDetail(props.record.productId);
  }, [props.record, props.openProductDetail]);



  const renderWrapCell = (field, index) => {

    const cellStyle = {};
    if (rowHeight > 0) {
      cellStyle['height'] = `${rowHeight}px`;
    }
    let dataWidth = null;
    if (_.isArray(field)) {
      dataWidth = field.map(e => e.fieldId).join(',');
    } else {
      dataWidth = field.fieldId;
    }
    return (
      <Td
        className={field.isModified ? 'detail-highlight-style' : ''}
        key={index}
        onClick={e => onClickListCell(e, field)}
        style={cellStyle}
        data-tag={dataWidth}
      >
        {props.contentCell && props.contentCell(props.record, field, props.index)}
      </Td>
    );
  };

  /**
   * render cell 
   * @param fieldInfo 
   * @param index 
   */
  const renderCell = (fieldInfo, index) => {
    switch (fieldInfo.fieldName) {
      case 'quantity':
        // return (
        //   <Td className="quantity" key={index}>
        //     <input
        //       type="text"
        //       className={'input-normal input-common2 text-right ' }
        //       // className={'input-normal input-common2 text-right ' + (props.errorCode ? 'error' : '')}
        //       pattern="[0-9]*"
        //       onChange={handleQuantityChange}
        //       value={autoFormatNumber(valueEdit)}
        //       maxLength={9}
        //       onBlur={() => setValueEdit(autoFormatNumber(valueEdit))}
        //       onFocus={() => setValueEdit(valueEdit.replace(/,/g, ''))}
        //       disabled={!!props.isSetting}
        //     />
        //     {/* { !!props.errorCode && <span className="messenger-error text-left">{translate(`messages.${props.errorCode}`)}</span>} */}

        //   </Td>
        // );
        return renderWrapCell(fieldInfo, index);
      case 'unit_price':
        return (
          <Td className="text-right" key={index}>
            {props.record && props.record.unitPrice
              ? props.record.unitPrice.toLocaleString(navigator.language, { minimumFractionDigits: 0 })
              : 0}
            {CURRENCY}
          </Td>
        );
      default:
        return renderWrapCell(fieldInfo, index);
    }
  };

  const getWidthProduct = (widthDisplay, widthOther) =>{
    if (!props.isSetting || props.modeDisplay === ScreenMode.DISPLAY) {
      return { width: widthDisplay };
    } else {
      return { width: widthOther };
    }
  }

  const productNameColStyle = useMemo(() => {
    return getWidthProduct(360, 360);
  }, [props.isSetting, props.modeDisplay]);

  const productNameSpanStyle = useMemo(() => {
    return getWidthProduct(250, 250);
  }, [props.isSetting, props.modeDisplay]);

const trId = `tr_${props.record?.productId}_${props.modeDisplay}`
const [heightRow, setHeightRow] = useState<number>(0)
  useEffect(() => {
    if(props.isRenderDefaultField){
      setHeightRow(document?.getElementById(trId)?.getBoundingClientRect().height || 0  )
    }
  })

  const renderRow = () => {
    return (
      <>
        {props.isRenderDefaultField && (
          <>
            {!props.isSetting && props.modeDisplay === ScreenMode.EDIT &&  (
              <Td className="text-center" style={{
                height: heightRow < 83 ? 83 : heightRow
              }} >
                <a onClick={handleDeleteItem}>
                  <i className="fa fa-times" />
                </a>
              </Td>
            )}
            <Td  style={{
                'height': heightRow < 83 ? 83 : heightRow,
                paddingTop: 'unset',
                paddingBottom: 'unset'
              }} >
              <div className="product-detail" style={productNameColStyle}>
                <div className={`image_table  ${ props.record?.productImagePath ? '' : 'no_image_table'}`} >
                  <img className="max-width-130 custom-list-content-row" src={props.record.productImagePath || "../../content/images/noimage.png"} alt=""/>
                </div>
                <div className="content" style={productNameSpanStyle}>
                  <Popover x={-20} y={25}>
                    <p className="style-td-list-content-row" style={productNameSpanStyle}>
                      {getFieldLabel(props.record, 'productCategoryName')}
                    </p>
                  </Popover>
                  <Popover x={-20} y={25} isGetOffsetOfChild>
                    {
                    // props.modeDisplay === ScreenMode.EDIT ? (
                    //   <p className="name style-td-list-content-row" style={productNameSpanStyle} onClick={onClickToProductName}>
                    //     {props.record.productName}
                    //   </p>
                    // ) :
                     (
                      <ProductNameEl className="name style-td-list-content-row" style={productNameSpanStyle} onClick={onClickToProductName}>
                        {props.record.productName}
                      </ProductNameEl>
                    )}
                    {/* <ProductNameEl className="name style-td-list-content-row" style={productNameSpanStyle} onClick={onClickToProductName}>
                      {props.record.productName}
                    </ProductNameEl> */}
                  </Popover>
                  <Popover x={-20} y={25}>
                    <p className="style-td-list-content-row" style={productNameSpanStyle}>
                      {props.record.memoProduct || ""}
                    </p>
                  </Popover>
                </div>
              </div>
            </Td>
          </>
        )}
        {!props.isRenderDefaultField &&
          props.fields &&
          props.fields.map((field, idx) => {
            return renderCell(field, idx);
          })}
      </>
    );
  };

  return <tr className={props.rowClassName} {...!props.isRenderDefaultField && {id: trId} } >{renderRow()}</tr>;
};

export default DragSource(
  DND_ITEM_TYPE.DYNAMIC_LIST_ROW,
  {
    beginDrag: (props: IListContentRowProps) => ({ type: DND_ITEM_TYPE.DYNAMIC_LIST_ROW, sourceRow: props.record }),
    endDrag(props: IListContentRowProps, monitor: DragSourceMonitor) {
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        if (dropResult.targetCategory) {
          props.onDragRow(item.sourceRow, dropResult.targetCategory);
        } else {
          props.onDragRow(item.sourceRow, dropResult.targetDepartment);
        }
      }
    }
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(ListContentRow);
