import React, { useState, useEffect } from 'react'
import { DragSourceMonitor, useDrag, useDragLayer, XYCoord } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND } from '../constants';
import { translate } from 'react-jhipster';
import { getFieldLabel } from 'app/shared/util/string-utils';
import _ from 'lodash';
import { getEmptyImage } from 'react-dnd-html5-backend';

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  width: number | null,
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
  }
}

export const DynamicFieldDragLayer: React.FC<{width?: number}> = (props) => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  const getImage = (fieldType) => {
    const img = _.padStart(_.toString(fieldType), 2, '0')
    return `../../../content/images/common/ic-input-${img}.svg`
  }

  const renderPreview = (p: any) => {
    let fieldLabel = null;
    if (item && item.value) {
      fieldLabel = _.isNil(item.value.fieldId) ? translate(`dynamic-control.fieldTypeLabel.${item.value.fieldType}`) : getFieldLabel(item.value, 'fieldLabel')
    }
    return (
      <div className="input-check-image mt-2">
        <div className="list-item-v2 mt-2 mb-2" style={getItemStyles(initialOffset, currentOffset, props.width)}>
          <img title="" src={getImage(item.value.fieldType)} alt=""></img>
          <span className="margin-left-30">{fieldLabel} </span>
        </div>
      </div>
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
      {renderItem()}
    </div>
  );
}

export interface IDynamicFieldDragableProps {
  fieldInfo: any
  onEditField?: (item) => void
  onDeleteField?: (item) => void
}

const DynamicFieldDragable: React.FC<IDynamicFieldDragableProps> = (props) => {
  const [hovered, setHovered] = useState(false);
  const [, setHoverField] = useState();
  const getTextItemField = item => {
    return translate(`dynamic-control.fieldTypeLabel.${item.fieldType}`)
  }
  const [{isDragging}, connectDragSource, preview] = useDrag({
    begin: (dragSource: DragSourceMonitor) => dragSource.getItem(),
    item: { type: FIELD_ITEM_TYPE_DND.ADD_CARD, value: { ... props.fieldInfo } },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  const headerHoverOn = (item) => {
    if (item.availableFlag === null) {
      setHovered(false);
      return
    }
    setHoverField(item)
    setHovered(true);
  }

  const headerHoverOff = (item) => {
    if (item.availableFlag === null) {
      setHovered(false);
      return
    }
    setHovered(false);
  }

  const onDeleteField = (event) => {
    event.stopPropagation();
    props.onDeleteField(props.fieldInfo)
  }

  const getImage = () => {
    const img = _.padStart(_.toString(props.fieldInfo.fieldType), 2, '0')
    return `../../../content/images/common/ic-input-${img}.svg`
  }

  return connectDragSource(
    <div onMouseEnter={() => { headerHoverOn(props.fieldInfo) }}
      onMouseLeave={() => { headerHoverOff(props.fieldInfo) }}
      className="input-check-image mt-2"
      style={{opacity: isDragging ? 0 : 1}}
      onClick={() => props.onEditField(props.fieldInfo)}
    >
      <img title="" src={getImage()} alt=""></img>
      <input type="text" className="input-normal w-100 bg-white pl--37 mt-0" value={_.isNil(props.fieldInfo.fieldId) ? getTextItemField(props.fieldInfo) : getFieldLabel(props.fieldInfo, 'fieldLabel')} readOnly />
      <div className="create-del">
      {hovered && <a onClick={(event) => onDeleteField(event)} className="icon-small-primary icon-erase-small"></a>}
      </div>
    </div>
  )
}

export default DynamicFieldDragable;
