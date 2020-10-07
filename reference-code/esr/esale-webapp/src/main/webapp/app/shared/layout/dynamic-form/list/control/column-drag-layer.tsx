import React from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { DND_ITEM_TYPE, ITEM_TYPE } from '../../constants';
import { getColumnWidth } from '../dynamic-list-helper';
import { getFieldLabel } from 'app/shared/util/string-utils';
import _ from 'lodash';
import { EMPLOYEE_SPECIAL_LIST_FIELD } from 'app/modules/employees/constants';

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  width: number,
  height: number,
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    // minWidth: '250px',
    transform,
    WebkitTransform: transform,
    backgroundColor: 'white',
    border: '1px solid #e5e5e5',
    borderRadius: '10px',
    boxShadow: '0px 5px 15px 0px #b0afaf',
    width: `${width}px`,
    height: `${height}px`,
  }
}

export interface IColumnDragLayerProps {
  tableHeight?: number,
}

const ColumnDragLayer: React.FC<IColumnDragLayerProps> = (props) => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  const renderPreview = (p: any) => {
    let width = 100;
    let title = "";
    if (itemType === ITEM_TYPE.CARD) {
      title = getFieldLabel(p.sourceField, 'fieldLabel');
    } else if (itemType === DND_ITEM_TYPE.DYNAMIC_LIST_COLUMN) {
      if (p && !_.isArray(p.sourceField)) {
        width = getColumnWidth(p.sourceField)
        title = p.titleColumn
      } else if (p && _.isArray(p.sourceField)) {
        const itemFilter = p.sourceField.find((field) =>
          (field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurname || field.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurnameKana));
        title = getFieldLabel(itemFilter, 'fieldLabel');
      }
    }

    return (
      <div style={getItemStyles(initialOffset, currentOffset, width, props.tableHeight)}>{title}</div>
    )
  }

  function renderItem() {
    if (itemType === DND_ITEM_TYPE.DYNAMIC_LIST_COLUMN || itemType === ITEM_TYPE.CARD) {
      return renderPreview(item);
    } else {
      return null;
    }
  }
  if (!isDragging) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', pointerEvents: 'none', zIndex: 100, left: '0', top: '0' , wordBreak: 'break-word'}}>
      {renderItem()}
    </div>
  );
};

export default ColumnDragLayer;
