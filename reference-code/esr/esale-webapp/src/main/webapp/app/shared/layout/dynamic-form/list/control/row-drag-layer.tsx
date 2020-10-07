import React, { useState, useEffect } from "react";
import { useDragLayer, XYCoord} from "react-dnd";
import { DND_ITEM_TYPE } from '../../constants';
import { translate } from 'react-jhipster';
import { FIELD_BELONG } from "app/config/constants";

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  width: number | 'auto',
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
    backgroundColor: '#0F6EB5',
    color: '#FFFFFF',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    width,
    height: `${height}px`,
    lineHeight: `24px`,
    padding: '0 5px',
    text: 'center'
  }
}

function getItemStylesAnimation(
  firstOffset: XYCoord | null,
  lastOffset: XYCoord | null,
  width: number | 'auto',
  height: number,) {
  if (!firstOffset || !lastOffset) {
    return {
      display: 'none',
    }
  }
  const { x, y } = lastOffset
  const transform = `translate(${x}px, ${y}px)`;
  // transform = `translate(${xDes}px, ${yDes}px)`;

  return {
    transform,
    WebkitTransform: transform,
    transition: '0.3s',
    backgroundColor: '#0F6EB5',
    color: '#FFFFFF',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    width,
    height: `${height}px`,
    lineHeight: `24px`,
    padding: '0 5px',
    text: 'center'
  }
}

export interface IRowDragLayerProps {
  recordCheckList?: any,
  itemTypeDrag,
  hasTargetDrag?: boolean,
  belong?
}

const RowDragLayer: React.FC<IRowDragLayerProps> = (props) => {
  const [endDrag, setEndDrag] = useState(false);
  const [firstOffset, setFirstOffset] = useState(null);
  const [lastOffset, setLastOffset] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const arrListCheck = props.recordCheckList.filter(e => e.isChecked === true);
  const translateContent = (fieldBelong) => {
    switch(fieldBelong){
      case FIELD_BELONG.BUSINESS_CARD: {
        return translate('businesscards.item-drag.list');
        break;
      }
      case FIELD_BELONG.PRODUCT_TRADING: {
        return translate('sales.item-drag.list');
        break;
      }
      case FIELD_BELONG.PRODUCT: {
        return translate('products.item-drag.list');
        break;
      }
      default:{
        return translate('global.item-drag.list');
        break;
      }
    }
  }
  const translateBelong = translateContent(props.belong);
  const title = (arrListCheck.length > 0 ? arrListCheck.length : "1") + translateBelong;
  const [itemTypeColumn, setItemTypeColumn] = useState(null);

  const {
    itemType,
    isDragging,
    initialOffset,
    currentOffset
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialClientOffset(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  useEffect(() => {
    if (!isDragging) {
      setEndDrag(true);
    } else {
      setFirstOffset(initialOffset);
    }
  }, [isDragging])

  useEffect(() => {
    if (itemType === DND_ITEM_TYPE.DYNAMIC_LIST_ROW) {
      setItemTypeColumn(DND_ITEM_TYPE.DYNAMIC_LIST_ROW);
    }
  }, [itemType])

  useEffect(() => {
    if (!props.hasTargetDrag) {
      if (endDrag && !isDragging) {
        const interval = setInterval(() => {
          setSeconds(seconds + 1);
        }, 500);
        const intervalOff = setInterval(() => {
          setEndDrag(false);
          setItemTypeColumn(null);
        }, 800);
        return () => { clearInterval(interval); clearInterval(intervalOff) };
      }
    } else {
      if (endDrag && !isDragging) {
        setEndDrag(false);
      }
    }
  }, [endDrag, props.hasTargetDrag])

  useEffect(() => {
    if (!isDragging && endDrag && lastOffset) {
      setLastOffset(firstOffset)
    }
  }, [seconds])

  useEffect(() => {
    if (currentOffset && isDragging) {
      setLastOffset(currentOffset);
    }
  }, [currentOffset])

  const renderPreview = () => {
    return (
      <>
        <div style={getItemStyles(initialOffset, currentOffset, 'auto', 32)}>{title}</div>
      </>
    )
  }

  function renderItem() {
    if (itemType === DND_ITEM_TYPE.DYNAMIC_LIST_ROW && props.itemTypeDrag === DND_ITEM_TYPE.DYNAMIC_LIST_ROW) {
      return renderPreview();
    }
    if (!isDragging && endDrag && itemTypeColumn === DND_ITEM_TYPE.DYNAMIC_LIST_ROW && !props.hasTargetDrag) {
      return <div style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, left: '0', top: '0' }}>
        <div style={getItemStylesAnimation(firstOffset, lastOffset, 'auto', 32)}>{title}</div>
      </div>
    }
  }

  return (
    <div style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999, left: '0', top: '0' }}>
      {renderItem()}
    </div>
  );
};

export default RowDragLayer;
