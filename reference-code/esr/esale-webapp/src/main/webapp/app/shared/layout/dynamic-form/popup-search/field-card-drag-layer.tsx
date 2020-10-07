import React from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { FIELD_ITEM_TYPE_DND } from '../constants';
import { getIconSrc } from 'app/config/icon-loader';

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    minWidth: '250px',
    transform,
    WebkitTransform: transform,
  }
}

const FieldCardDragLayer = (props: {fieldBelong: number}) => {
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

  const baseUrl = window.location.origin.toString();

  const renderPreview = (p: any) => {
    const fieldBelong = p.fieldBelong ? p.fieldBelong : props.fieldBelong;
    return (
      <>
        {p.isChecked && <input className="hidden" type="checkbox" defaultChecked={true} />}
        {!p.isChecked && <input className="hidden" type="checkbox"/>}
        <i></i><span><img src={baseUrl + getIconSrc(fieldBelong)} alt="" title=""/>{p.text}</span>
      </>
    )
  }

  function renderItem() {
    if (itemType === FIELD_ITEM_TYPE_DND.ADD_CARD) {
        return renderPreview(item);
    } else {
        return null;
    }
  }
  if (!isDragging) {
    return null;
  }

  return (
    <div style={{position: 'fixed', pointerEvents: 'none', zIndex: 100, left: '0', top: '0'}}>
      <label className="icon-check" style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </label>
    </div>
  );
};

export default FieldCardDragLayer;
