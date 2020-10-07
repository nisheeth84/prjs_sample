import React from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { GROUP_TYPE, DND_DEPARTMENT_TYPE } from '../../../modules/employees/constants';
import { SALES_GROUP_TYPE } from "../../../modules/sales/constants";
import { CUSTOMER_LIST_TYPE } from 'app/modules/customers/constants';

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  height: number,
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  const { x, y } = currentOffset
  const transform = `translate(${x + 25}px, ${y + 15}px)`
  return {
    // minWidth: '250px',
    transform,
    WebkitTransform: transform,
    backgroundColor: 'white',
    color: '#666',
    borderRadius: '13px',
    height: `${height}px`,
    lineHeight: `24px`,
    padding: '0 10px',
    text: 'center'
  }
}

export interface ICategoryDragLayerProps {
  itemData?: any;
}

const CategoryDragLayer: React.FC<ICategoryDragLayerProps> = (props) => {
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
    let title = '';
    switch (itemType) {
      case GROUP_TYPE.CARD:
        title = item.sourceGroup.groupName;
        break;
      case DND_DEPARTMENT_TYPE.CARD:
        title = item.sourceDepartment.departmentName;
        break;
      case SALES_GROUP_TYPE.SALE_LIST_CARD:
        title = item.sourceGroup.listName;
        break;
      case CUSTOMER_LIST_TYPE.CARD:
        title = item.sourceList.listName;
        break;
      default:
        break;
    }
    return (
      <div style={getItemStyles(initialOffset, currentOffset, 24)}>{title}</div>
    )
  }

  function renderItem() {
    if (itemType === GROUP_TYPE.CARD ||
      itemType === DND_DEPARTMENT_TYPE.CARD ||
      itemType === SALES_GROUP_TYPE.SALE_LIST_CARD ||
      itemType === CUSTOMER_LIST_TYPE.CARD) {
      return renderPreview(item);
    } else {
      return null;
    }
  }
  if (!isDragging) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', pointerEvents: 'none', zIndex: 100, left: '0', top: '0' }}>
      {renderItem()}
    </div>
  );
};

export default CategoryDragLayer;
