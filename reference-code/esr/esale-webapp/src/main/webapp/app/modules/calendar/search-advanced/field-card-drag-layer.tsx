import React from "react";
import { useDragLayer, XYCoord } from "react-dnd";
import { FIELD_ITEM_TYPE_DND } from 'app/shared/layout/dynamic-form/constants';

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

const FieldCardDragLayer = () => {
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
    return (
      <>
        {p.isChecked && <input className="hidden" type="checkbox" defaultChecked={true} />}
        {!p.isChecked && <input className="hidden" type="checkbox"/>}
        <i></i><span><img src={baseUrl + "/content/images/ic-sidebar-calendar.svg"} alt="" title=""/>{p.text}</span>
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
    <div className="field-card-drag-layer">
      <label className="icon-check" style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </label>
    </div>
  );
};

export default FieldCardDragLayer;
