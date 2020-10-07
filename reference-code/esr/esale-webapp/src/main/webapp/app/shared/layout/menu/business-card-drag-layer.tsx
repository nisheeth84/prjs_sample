import React from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { DND_BUSINESS_CARD_LIST_TYPE } from '../../../modules/businessCards/constants';

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

export interface IBusinessCardDragLayerProps {
  itemData?: any;
}

const BusinessCardDragLayer: React.FC<IBusinessCardDragLayerProps> = (props) => {
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
    if (itemType === DND_BUSINESS_CARD_LIST_TYPE.CARD) {
      title = item.sourceBusinessCardList.listName;
    }

    return (
      <div style={getItemStyles(initialOffset, currentOffset, 24)}>{title}</div>
    )
  }

  function renderItem() {
    if (itemType === DND_BUSINESS_CARD_LIST_TYPE.CARD) {
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

export default BusinessCardDragLayer;
