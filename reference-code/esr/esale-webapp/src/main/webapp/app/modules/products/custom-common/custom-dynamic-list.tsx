import _ from 'lodash';
import styled from 'styled-components';
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import StringUtils, { getFieldLabel } from '../../../shared/util/string-utils';
import { FIELD_BELONG, ScreenMode, AVAILABLE_FLAG } from 'app/config/constants';
import ListHeader from 'app/modules/products/custom-common/header/custom-list-header';
import ListHeaderContent from 'app/modules/products/custom-common/header/custom-list-header-content';
import ListContentRow from 'app/modules/products/custom-common/content/custom-list-content-row';
import ListContentCell from 'app/modules/products/custom-common/content/custom-list-content-cell';
import { isSpecialColumn } from 'app/shared/layout/dynamic-form/list/dynamic-list-helper';
import { getValueProp } from 'app/shared/util/entity-utils';
import { PRODUCT_SPECIAL_FIELD_NAMES } from '../constants';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import { Storage, translate } from 'react-jhipster';
import { IFieldDynamicStyleClass } from 'app/shared/layout/dynamic-form/control-field/interface/field-dynamic-style-class';
import DropAllowArea from './header/drop-allow-area';
import update from 'immutability-helper';
import ResizeControl from './header/resize-control';
import DragItem from './header/drag-item';
import { closest } from 'app/shared/util/dom-element';

import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
// import { getJsonBName } from '../utils';

const TableFix = styled.table`
  table-layout: fixed;
  width: ${props => `${props.width}px !important`};
`;

const DeleteColButton = styled.a`
  display: none;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
`;

const TH = styled.th`
  position: relative;
  height: 91px !important;
  &:hover ${DeleteColButton} {
    display: block;
  }
`;

const DivGrid = styled.div`
  display: grid;
`;

const validFieldTypes = [
  DEFINE_FIELD_TYPE.SINGER_SELECTBOX,
  DEFINE_FIELD_TYPE.MULTI_SELECTBOX,
  DEFINE_FIELD_TYPE.CHECKBOX,
  DEFINE_FIELD_TYPE.RADIOBOX,
  DEFINE_FIELD_TYPE.NUMERIC,
  DEFINE_FIELD_TYPE.DATE,
  DEFINE_FIELD_TYPE.DATE_TIME,
  DEFINE_FIELD_TYPE.TIME,
  DEFINE_FIELD_TYPE.TEXT,
  DEFINE_FIELD_TYPE.TEXTAREA,
  DEFINE_FIELD_TYPE.FILE,
  DEFINE_FIELD_TYPE.LINK,
  DEFINE_FIELD_TYPE.PHONE_NUMBER,
  DEFINE_FIELD_TYPE.EMAIL,
  DEFINE_FIELD_TYPE.CALCULATION
];

const minWidthByFieldType = {
  [DEFINE_FIELD_TYPE.SINGER_SELECTBOX]: 240,
  [DEFINE_FIELD_TYPE.MULTI_SELECTBOX]: 240,
  [DEFINE_FIELD_TYPE.CHECKBOX]: 240,
  [DEFINE_FIELD_TYPE.RADIOBOX]: 240,
  [DEFINE_FIELD_TYPE.NUMERIC]: 200,
  [DEFINE_FIELD_TYPE.DATE]: 250,
  [DEFINE_FIELD_TYPE.DATE_TIME]: 300,
  [DEFINE_FIELD_TYPE.TIME]: 200,
  [DEFINE_FIELD_TYPE.TEXT]: 200,
  [DEFINE_FIELD_TYPE.TEXTAREA]: 200,
  [DEFINE_FIELD_TYPE.FILE]: 500,
  [DEFINE_FIELD_TYPE.LINK]: 450,
  [DEFINE_FIELD_TYPE.PHONE_NUMBER]: 200,
  [DEFINE_FIELD_TYPE.EMAIL]: 200,
  [DEFINE_FIELD_TYPE.CALCULATION]: 200
};

export interface ICustomDynamicListProp {
  products?: any;
  fieldInfoProductSet: any[];
  screenMode?: any;
  onDeleteItem?: (idx, id) => void;
  onUpdateFieldValue?: any;
  onListProductDataChange?: (data) => void;
  customContentField: any;
  onExecuteAction?: (fieldInfo: any, actionType: DynamicControlAction, params?: any) => void; // callback when fire action
  openProductDetail?: (id) => void;
  errorItems?;
  totalPrice?: (totalPrice) => void;
  isSetting?: boolean;
  updateFiles? : (fUploads) => void
}

const CustomDynamicList = forwardRef((props: ICustomDynamicListProp, ref) => {
  const [deletedFieldInfoProductSet, setDeletedFieldInfoProductSet] = useState([]);
  const [tableDynamicWidth, setTableDynamicWidth] = useState(1000);

  const [tableContainerStyle, setTableContainerStyle] = useState({ overflow: 'hidden', width: 'unset' });
  const [isDragItemOverOnTable, setIsDragItemOverOnTable] = useState(false);
  const [fieldInfoProductSet, setFieldInfoProductSet] = useState(null);
  const keyRecordId = 'productId';
  const fieldNameExtension = 'product_set_data';
  const tableDynamicFieldsRef = useRef(null);
  const fieldStyleClass: IFieldDynamicStyleClass = {
    textBox: {
      search: {
        input: 'input-normal input-common2',
        wrapInput: 'box-radio-wrap box-aligh-right'
      },
      edit: { input: 'input-normal w100' }
    },
    textArea: {
      search: {
        input: 'form-control input-common',
        wrapInput: 'form-group common'
      },
      edit: { input: 'input-common' }
    },
    checkBox: {
      search: {
        wrapCheckbox: 'wrap-check-box',
        inputCheckbox: 'check-box-item'
      },
      edit: {
        wrapCheckbox: 'wrap-check-box',
        inputCheckbox: 'icon-check'
      }
    },
    radioBox: {
      search: { wrapRadio: 'wrap-check-radio' },
      edit: { wrapRadio: 'wrap-check-radio align-items-stretch' }
    },
    singleSelectBox: {
      search: {
        wrapSelect: 'wrap-check-box',
        inputSelect: 'check-box-item'
      },
      edit: {
        wrapSelect: 'select-option',
        inputSelect: 'select-text text-ellipsis',
        dropdownSelect: 'drop-down drop-down2 max-height-300'
      }
    },
    multiSelectBox: {
      search: {
        wrapSelect: 'wrap-check-box',
        inputSelect: 'check-box-item'
      },
      edit: {
        wrapSelect: 'select-option',
        inputSelect: 'select-text text-ellipsis',
        dropdownSelect: 'drop-down drop-down2 max-height-300'
      }
    },
    numberBox: {
      search: {
        wrapBoxFrom: 'form-group common has-delete',
        wrapInputFrom: 'form-control-wrap',
        inputFrom: 'input-normal input-common2 text-right',
        wrapBoxTo: 'form-group common has-delete',
        wrapInputTo: 'form-control-wrap',
        inputTo: 'input-normal input-common2 text-right'
      },
      edit: {
        wrapBox: 'form-group common has-delete',
        wrapInput: 'form-control-wrap currency-form input-common-wrap',
        input: 'input-normal text-right'
      },
      editList: {
        wrapBox: 'form-group common has-delete',
        wrapInput: 'form-control-wrap currency-form input-common-wrap',
        input: 'input-normal input-common2 text-right'
      }
    },
    dateBox: {
      search: {},
      edit: {
        wrapInput: 'form-group common has-delete',
        input: 'input-normal input-common2 one-item'
      }
    },
    timeBox: {
      search: {},
      edit: {
        wrapInput: 'form-group common has-delete mt-0 mb-0',
        input: 'input-normal input-common2 version2 text-left',
        inputList: 'input-normal input-common version2 text-left'
      }
    },
    datetimeBox: {
      search: {},
      edit: {
        wrapBox: 'common list-edit-date-time d-block',
        wrapDate: 'cancel form-group has-delete mt-0 mb-0',
        inputDate: 'input-normal one-item',
        wrapTime: 'cancel form-group has-delete mt-0 mb-0',
        inputTime: 'input-normal text-left'
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
        inputText: 'input-normal'
      }
    }
  };

  const onSaveEditField = useCallback(
    (oldFieldInfo, newFieldInfo) => {
      if (oldFieldInfo.fieldId > 0) {
        newFieldInfo.userModifyFlg = true;
        newFieldInfo.isModified = true;
      }
      const combineFieldInfo = { ...oldFieldInfo, ...newFieldInfo };
      delete combineFieldInfo.isBrandNew;
      const indexOfField = _.findIndex(fieldInfoProductSet, (i: any) => i.fieldId === oldFieldInfo.fieldId);
      const newFieldInfoProductSet = update(fieldInfoProductSet, {
        [indexOfField]: { $set: combineFieldInfo }
      });
      setFieldInfoProductSet(newFieldInfoProductSet);
    },
    [fieldInfoProductSet]
  );

  const onCancelEditField = oldFieldInfo => {
    const indexOfField = _.findIndex(fieldInfoProductSet, (i: any) => i.fieldId === oldFieldInfo.fieldId);
    let updateCondition = {};

    if (oldFieldInfo.isBrandNew) {
      updateCondition = { $splice: [[indexOfField, 1]] };
    } else {
      updateCondition = { [indexOfField]: { $set: oldFieldInfo } };
    }

    const newFieldInfoProductSet = update(fieldInfoProductSet, updateCondition);
    setFieldInfoProductSet(newFieldInfoProductSet);
  };

  useEffect(() => {
    if (!props.isSetting || props.screenMode === ScreenMode.DISPLAY) {
      setTableContainerStyle({
        ...tableContainerStyle,
        width: 'unset'
      });
    } else {
      const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.48;
      setTableContainerStyle({
        ...tableContainerStyle,
        width: width + 'px'
      });
    }
  }, [props.screenMode]);

  useEffect(() => {
    if (props.fieldInfoProductSet) {
      const newFieldInfoProductSet = _.cloneDeep(props.fieldInfoProductSet);
      newFieldInfoProductSet.forEach(fieldInfo => {
        const minWidth = minWidthByFieldType[fieldInfo.fieldType];
        if (!fieldInfo.columnWidth || fieldInfo.columnWidth < minWidth) {
          fieldInfo.columnWidth = minWidth;
        }
      });

      newFieldInfoProductSet.sort((a, b) => (a.fieldOrder < b.fieldOrder ? -1 : 0));
      const origin = newFieldInfoProductSet.filter(e => e.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE);
      setFieldInfoProductSet(origin);
    }
  }, [props.fieldInfoProductSet]);

  const getColumnWidth = (field: any) => {
    let width = 0;
    if (_.isArray(field) && field.length > 0) {
      field.forEach(e => {
        width += e.columnWidth ? e.columnWidth : 200;
      });
    } else if (field.isCheckBox) {
      width = 90;
    } else if(Number(field.fieldType) === Number(DEFINE_FIELD_TYPE.TIME)
      || Number(field.fieldType) === Number(DEFINE_FIELD_TYPE.EMAIL)) {
      width = 310;
    } else {
      width = field.columnWidth ? field.columnWidth : 200;
    }
    return width;
  };
  
  useEffect(() => {
    if (!fieldInfoProductSet) return;
    setTableDynamicWidth(fieldInfoProductSet.map(getColumnWidth).reduce((s, c) => (s += c), 0));
  }, [fieldInfoProductSet]);

  useImperativeHandle(ref, () => ({
    getCurrentFieldInfoProductSet() {
      // // columnWidth
      // const columnsWidth = Array.from(tableDynamicFieldsRef.current.rows[0].cells).map(
      //   cell => (cell as HTMLElement).getClientRects()[0].width
      // );

      const fieldInfoProductSetCloned = _.cloneDeep(fieldInfoProductSet?.filter(i => !i.isBrandNew));

      return fieldInfoProductSetCloned.map((e, i) => {
        e.fieldOrder = i;
        delete e.isModified;
        // e.columnWidth = columnsWidth[i];
        return e;
      });
    },
    getDeleteFieldInfoProductSet() {
      return deletedFieldInfoProductSet;
    },
    onDynamicFieldPopupExecuteAction(fieldInfo, actionType, params) {
      switch (actionType) {
        case DynamicControlAction.SAVE:
          onSaveEditField(fieldInfo, params);
          break;
        case DynamicControlAction.CANCEL:
          onCancelEditField(fieldInfo);
          break;
        default:
          break;
      }
    }
  }));

  const totalPrice = useMemo(
    () => (props.products ? props.products.reduce((s, c) => (s += Number(c.quantity) * Number(c.unitPrice)), 0) : 0),
    [props.products]
  );

  useEffect(() => {
    if (totalPrice >= 0 && props.totalPrice) {
      props.totalPrice(totalPrice);
    }
  }, [totalPrice]);

  const totalQuantity = useMemo(() => (props.products ? props.products.reduce((s, c) => (s += Number(c.quantity)), 0) : 0), [
    props.products
  ]);

  /* ______________________OPTIONAL______________________ */
  const handleQuantityChange = (idx, quantity) => {
    if (!props.onListProductDataChange) return;
    const data = { idx, quantity };
    props.onListProductDataChange(data);
  };

  const handleDeleteItem = (idx, id) => {
    if (!props.onDeleteItem) return;
    props.onDeleteItem(idx, id);
  };

  /* ______________________DRAG DROP______________________ */
  const openPopupEditField = field => {
    if (props.onExecuteAction && (_.isNil(field.lookupFieldId) || field.lookupFieldId === 0)) {
      props.onExecuteAction(field, DynamicControlAction.EDIT);
    }
  };

  const checkValidFieldType = fieldType => {
    return validFieldTypes.includes(fieldType.toString());
  };

  const checkValidFieldBelong = (fieldBelong) => {
    return !fieldBelong || fieldBelong === FIELD_BELONG.PRODUCT_BREAKDOWN;
  }

  const updateColumnOrder = fieldInfos => {
    fieldInfos.forEach((fieldInfo, i) => {
      if (!fieldInfo.userModifyFlg) {
        fieldInfo.userModifyFlg = fieldInfo.fieldOrder !== i;
      }
      fieldInfo.fieldOrder = i;
    });
    return fieldInfos;
  };

  const onDropField = useCallback(
    (fieldInfo, indexToAdd) => {
      const isValidFieldType = checkValidFieldType(fieldInfo.fieldType);
      const isValidFieldBelong = checkValidFieldBelong(fieldInfo.fieldBelong)
      if (!isValidFieldType || !isValidFieldBelong ) {
        return;
      }
      const indexOfField = _.findIndex(fieldInfoProductSet, (i: any) => i.fieldId === fieldInfo.fieldId);
      if (indexOfField !== -1) {
        fieldInfoProductSet.splice(indexOfField, 1);
        fieldInfoProductSet.splice(indexToAdd, 0, fieldInfo);
        let newFieldInfoProductSet = _.cloneDeep(fieldInfoProductSet);
        newFieldInfoProductSet = updateColumnOrder(newFieldInfoProductSet);
        setFieldInfoProductSet(newFieldInfoProductSet);
      } else {
        const fieldDrag = _.cloneDeep(fieldInfo);
        fieldDrag.fieldId = Math.round(Math.random() * 100000 * -1);

        if (fieldDrag.fieldType.toString() === DEFINE_FIELD_TYPE.CHECKBOX) {
          fieldDrag.fieldItems = [];
        }

        fieldDrag.fieldName = '';
        fieldDrag.inTab = false;
        fieldDrag.userModifyFlg = true;
        fieldDrag.isModified = true;
        fieldDrag.fieldBelong = FIELD_BELONG.PRODUCT_BREAKDOWN;
        fieldDrag.isBrandNew = true;
        fieldDrag.isDefault = false;
        fieldDrag.columnWidth = minWidthByFieldType[fieldDrag.fieldType];
        let newFieldInfoProductSet = _.cloneDeep(fieldInfoProductSet);
        newFieldInfoProductSet.splice(indexToAdd, 0, fieldDrag);
        newFieldInfoProductSet = updateColumnOrder(newFieldInfoProductSet);
        setFieldInfoProductSet(newFieldInfoProductSet);
        openPopupEditField(fieldDrag);
      }
    },
    [fieldInfoProductSet]
  );

  const onFieldInfoOver = (isOver, dragSource) => {
    if (isOver) {
      if (!dragSource) {
        isOver = false;
      } else {
        const { value: dragItem } = dragSource;

        const isValidFieldType = checkValidFieldType(dragItem.fieldType);
        if (!isValidFieldType) {
          isOver = false;
        }
      }
    }

    setIsDragItemOverOnTable(isOver);
  };

  const onColResize = (fieldInfo, width) => {
    const indexOfField = _.findIndex(fieldInfoProductSet, (i: any) => i.fieldId === fieldInfo.fieldId);
    const minWidth = minWidthByFieldType[fieldInfo.fieldType];
    const newFieldInfoProductSet = update(fieldInfoProductSet, {
      [indexOfField]: { columnWidth: { $set: width > minWidth ? width : minWidth } }
    });
    setFieldInfoProductSet(newFieldInfoProductSet);
  };

  const onDragOverColumnChange = (isOver, dragSource, htmlElement) => {
    isOver = isOver && dragSource;
    if (isOver) {
      const { value: dragItem } = dragSource;
      isOver = checkValidFieldType(dragItem.fieldType);
    }
    const thEl = closest(htmlElement, 'th');
    if (isOver) {
      thEl.className = thEl.className + ' th-drag-drop';
    } else {
      thEl.className = thEl.className.replace(/th-drag-drop/, '');
    }
  };

  /* delete column */
  const getFieldLabelDefault = (item, fieldLabel) => {
    const defaultLabel = '';
    const itemTmp = _.cloneDeep(item);
    if (!item || !itemTmp[fieldLabel]) {
      return defaultLabel;
    }

    if ((itemTmp.fieldId !== null || (item.fieldId === null && item.fieldLabel)) && _.isString(itemTmp[fieldLabel])) {
      itemTmp[fieldLabel] = JSON.parse(itemTmp[fieldLabel]);
    }
    const lang = Storage.session.get('locale', 'ja_jp');
    // labelOther is varible to set label. If label haven't Japanese name then used to English name. Finally, if label haven't English name then used to Chinese name
    let labelOther = null;
    if (Object.prototype.hasOwnProperty.call(itemTmp, fieldLabel)) {
      if (Object.prototype.hasOwnProperty.call(itemTmp[fieldLabel], lang)) {
        const label = itemTmp[fieldLabel][lang];
        if (!_.isNil(label)) {
          if (!_.isEmpty(label)) {
            labelOther = label;
          } else {
            labelOther = itemTmp[fieldLabel]['en_us'];
            if (_.isEmpty(labelOther)) {
              labelOther = itemTmp[fieldLabel]['zh_cn'];
            }
          }
          return labelOther;
        }
      }
    }
    return defaultLabel;
  };

  const showConfirmDelete = async field => {
    const itemName = getFieldLabelDefault(field, 'fieldLabel');
    const result = await ConfirmDialog({
      title: <>{translate('employees.detail.title.popupErrorMessage.delete')}</>,
      message: StringUtils.translateSpecial('messages.WAR_COM_0001', { itemName: _.toString(itemName) }),
      confirmText: translate('employees.detail.title.popupErrorMessage.delete'),
      confirmClass: 'button-red',
      cancelText: translate('employees.detail.label.button.cancel'),
      cancelClass: 'button-cancel'
    });
    return result;
  };

  const executeDelete = async (field, action: () => void, cancel?: () => void) => {
    const result = await showConfirmDelete(field);
    if (result) {
      action();
    } else if (cancel) {
      cancel();
    }
  };

  const deleteField = (field, event) => {
    event.stopPropagation();
    if (props.onExecuteAction) {
      executeDelete(field, () => {
        const indexOfField = _.findIndex(fieldInfoProductSet, (i: any) => i.fieldId === field.fieldId);
        const newFieldInfoProductSet = update(fieldInfoProductSet, {
          $splice: [[indexOfField, 1]]
        });
        setFieldInfoProductSet(newFieldInfoProductSet);

        if (!field.isBrandNew && field.fieldId > 0) {
          setDeletedFieldInfoProductSet([...deletedFieldInfoProductSet, field.fieldId]);
        }

        props.onExecuteAction(field, DynamicControlAction.DELETE);
      });
    }
  };

  /* ______________________RENDER HEADER______________________ */
  const contentHeader = (fieldHeader: any, titleColumn: string, special?: boolean) => {
    return <ListHeaderContent titleColumn={titleColumn} specialColumn={special} fieldInfo={fieldHeader} />;
  };

  const renderCellHeader = (fieldInfo, index: number) => {
    let allowEdit = true;
    let comp = null;
    switch (fieldInfo.fieldName) {
      case 'quantity':
        allowEdit = false;
        comp = (
          <>
            <div>{getFieldLabel(fieldInfo, 'fieldLabel')}</div>
            <div>
              {translate('products.create-set.th-total')}
              <span className="text-align-right">{totalQuantity ? StringUtils.numberFormat(totalQuantity) : 0}</span>
            </div>
          </>
        );
        break;
      case 'unit_price':
        allowEdit = false;
        comp = (
          <>
            <div>{translate('products.product-view.unit-price')}</div>
            {/*
            <div>
              {translate('products.create-set.th-total')}
              <span className="text-align-right">
                {totalPrice ? totalPrice.toLocaleString(navigator.language, { minimumFractionDigits: 0 }) : 0}
                {CURRENCY}
              </span>
            </div> 
            */}
          </>
        );
        break;
      default:
        comp = <ListHeader fieldInfo={fieldInfo} mode={props.screenMode} contentHeader={contentHeader} />;
        break;
    }

    if (!props.screenMode || props.screenMode === ScreenMode.DISPLAY) {
      return (
        <TH key={index.toString()} style={{ width: getColumnWidth(fieldInfo) + 'px' }}>
          <div className="text-over pad">{comp}</div>
          <ResizeControl onResize={width => onColResize(fieldInfo, width)} isResize={props.screenMode !== ScreenMode.EDIT}/>
        </TH>
      );
    }
    return (
      <TH
        key={index.toString()}
        className={fieldInfo.isModified ? 'detail-highlight-style' : ''}
        onClick={() => {
          if (!allowEdit) return;
          openPopupEditField(fieldInfo);
        }}
        style={{ width: getColumnWidth(fieldInfo) + 'px' }}
      >
        <DropAllowArea
          className="text-over pad"
          onDrop={({ value: dragItem }) => {
            const indexOfField = fieldInfo.isDefault ? 2 : _.findIndex(fieldInfoProductSet, (i: any) => i.fieldId === fieldInfo.fieldId);
            onDropField(dragItem, indexOfField);
          }}
          onIsOverChange={onDragOverColumnChange}
        >
          <DragItem item={fieldInfo}>{comp}</DragItem>
        </DropAllowArea>
        {props.isSetting && allowEdit && (
          <DeleteColButton
            className="icon-small-primary icon-erase-small"
            onClick={event => deleteField(fieldInfo, event)}
          ></DeleteColButton>
        )}
        <ResizeControl onResize={width => onColResize(fieldInfo, width)} isResize={props.screenMode !== ScreenMode.EDIT}/>
      </TH>
    );
  };

  const renderDefaultFieldsHeader = () => {
    return (
      <tr>
        {!props.isSetting && props.screenMode === ScreenMode.EDIT && <TH />}
        <TH>
          <div className="text-over pad">{translate('products.create-set.th-product')}</div>
        </TH>
      </tr>
    );
  };
 
  const renderHeader = () => {
    return <tr>{fieldInfoProductSet && fieldInfoProductSet.map(renderCellHeader)}</tr>;
  };

  /* ______________________RENDER CONTENT______________________ */
  const onUpdateFieldValue = (itemData, type, itemEditValue, idx) => {
    if (!props.onUpdateFieldValue || props.screenMode !== ScreenMode.EDIT) return;
    props.onUpdateFieldValue(itemData, type, itemEditValue, idx);
  };

  const getTextDataCell = (rowData: any, fieldColumn: any) => {
    let text = '';
    let fieldValue = getValueProp(rowData, fieldColumn.fieldName);
    if (_.isUndefined(fieldValue) && !fieldColumn.isDefault && fieldNameExtension) {
      const extData = getValueProp(rowData, fieldNameExtension);
      if (extData) {
        if (_.isArray(extData)) {
          extData.forEach(e => {
            if (StringUtils.equalPropertyName(e['key'], fieldColumn.fieldName)) {
              fieldValue = e['value'];
            }
          });
        } else {
          fieldValue = getValueProp(extData, fieldColumn.fieldName);
        }
      }
    }
    if (
      Array.isArray(fieldValue) ||
      fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.RADIOBOX ||
      fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.CHECKBOX ||
      fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.SINGER_SELECTBOX ||
      fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.MULTI_SELECTBOX
    ) {
      if (fieldColumn.fieldItems && fieldColumn.fieldItems.length > 0) {
        const fieldItem = fieldColumn.fieldItems.filter(e =>
          !e.itemId || !fieldValue ? false : fieldValue.toString().includes(e.itemId.toString())
        );
        text = fieldItem
          .map(function(elem) {
            return getFieldLabel(elem, 'itemLabel');
          })
          .join(',');
      }
    } else if (fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.ADDRESS) {
      if (fieldValue) {
        text = `${translate('dynamic-control.fieldDetail.layoutAddress.lable.postMark')}${JSON.parse(fieldValue)['address']}`;
      }
    } else {
      text = _.toString(fieldValue);
    }
    return text;
  };

  const extractDataDynamic = rowData => {
    if (rowData.productSetData) {
      rowData.productSetData.forEach(data => {
        switch (data.key) {
          case PRODUCT_SPECIAL_FIELD_NAMES.createBy:
          case PRODUCT_SPECIAL_FIELD_NAMES.updateBy:
            break;
          default:
            rowData[data.key] = data.value;
            break;
        }
      });
    }

    return rowData;
  };

  const contentCell = (rowData: any, fieldColumn: any) => {
    if (isSpecialColumn(fieldColumn)) {
      const styleCell = { width: `${getColumnWidth(fieldColumn)}px` };
      const cellId = `dynamic_cell_${getValueProp(rowData, keyRecordId)}_${
        _.isArray(fieldColumn) ? fieldColumn[0].fieldId : fieldColumn.field
      }`;
      const classCell = ' text-form-edit';

      if (props.customContentField) {
        return (
          <div id={cellId} style={styleCell} className={classCell}>
            {props.customContentField(fieldColumn, rowData, props.screenMode, keyRecordId)}
          </div>
        );
      } else {
        return <div id={cellId} style={styleCell} className="text-over"></div>;
      }
    }
    let text = undefined;

    if (_.isUndefined(text)) {
      text = getTextDataCell(rowData, fieldColumn);
    }
    const fieldInfo = _.cloneDeep(fieldColumn);
    const { fieldName } = fieldInfo
    
    const filterErrorByProductId = props.errorItems?.filter(_errorItem => _errorItem.rowId === rowData.productId) 

    const findErrorInfo = filterErrorByProductId?.find(_errorItem => _errorItem.item === fieldName)

    return (
      <ListContentCell
        textCell={text}
        targetId={fieldColumn.fieldId}
        errorInfo={findErrorInfo}
        keyRecordId={keyRecordId}
        fieldInfo={fieldInfo}
        record={extractDataDynamic(rowData)}
        modeDisplay={props.isSetting ? ScreenMode.DISPLAY : ScreenMode.EDIT}
        updateStateField={onUpdateFieldValue}
        fieldStyleClass={fieldStyleClass}
        belong={FIELD_BELONG.PRODUCT_BREAKDOWN}
        updateFiles={props.updateFiles}
      />
    );
  };

  const renderContent = isRenderDefaultField => {
    if (!props.products || props.products.length < 1) {
      return <></>;
    }
    return (
      <>
        {props.products.map((record, idx) => {
          let errorItem = null;
          if (props.errorItems && props.errorItems.length > 0) {
            errorItem = props.errorItems.find(e => e.rowId === record.productId);
          }
          return (
            <ListContentRow
              key={record.productId + ''}
              index={idx}
              keyRecordId={keyRecordId}
              record={record}
              fields={fieldInfoProductSet}
              modeDisplay={props.screenMode}
              isSetting={props.isSetting}
              isRenderDefaultField={isRenderDefaultField}
              contentCell={contentCell}
              onDragRow={() => {}}
              onQuantityChange={handleQuantityChange}
              onDeleteItem={handleDeleteItem}
              openProductDetail={props.openProductDetail}
              errorCode={errorItem ? errorItem.errorCode : null}
            />
          );
        })}
      </>
    );
  };

  const renderDefaultFields = () => {
    return (
      <DropAllowArea
        onDrop={({ value: dragItem }) => {
          onDropField(dragItem, 0);
        }}
      >
        <table className="table-thead-background">
          <thead>{renderDefaultFieldsHeader()}</thead>
          <tbody>{renderContent(true)}</tbody>
        </table>
      </DropAllowArea>
    );
  };

  const renderDynamicFields = () => {
    return (
      <div className="flex-grow-1 overflow-auto">
        <TableFix ref={tableDynamicFieldsRef} width={tableDynamicWidth} className="table-thead-background custom-dynamic-list">
          <thead>{renderHeader()}</thead>
          <tbody>{renderContent(false)}</tbody>
        </TableFix>
      </div>
    );
  };

  return (
    <DivGrid
      className="wrap-table-scroll table-popup-product style-3 esr-content"
      style={isDragItemOverOnTable ? { border: '1px dashed #01a0f4' } : {}}
    >
      <DropAllowArea className="esr-content-body d-flex" onIsOverChange={onFieldInfoOver} style={tableContainerStyle}>
        {renderDefaultFields()}
        {renderDynamicFields()}
      </DropAllowArea>
    </DivGrid>
  );
});

export default CustomDynamicList;
