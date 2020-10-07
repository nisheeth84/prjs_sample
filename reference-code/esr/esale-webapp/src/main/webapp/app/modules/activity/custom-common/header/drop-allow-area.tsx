import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND } from 'app/shared/layout/dynamic-form/constants';

export interface IDropAllowArea {
  className?: string;
  accept?: string[];
  style?: any;
  onDrop?: (itemdrag) => void;
  onIsOverChange?: (isOver: boolean, dragSource?, htmlElement?) => void;
}
  
const DropAllowArea: React.FC<IDropAllowArea> = props => {
  const elRef = useRef(null);
  const [{ isOver, dragSource }, connectDropTarget] = useDrop({
    accept: props.accept ?? [FIELD_ITEM_TYPE_DND.MOVE_CARD, FIELD_ITEM_TYPE_DND.ADD_CARD],
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      dragSource: monitor.getItem()
    }),
    drop(itemdrag) {
      if (!props.onDrop) return;
      props.onDrop(itemdrag);
    }
  });

  useEffect(() => {
    if (!props.onIsOverChange) return;
    props.onIsOverChange(isOver, dragSource, elRef.current);
  }, [isOver]);

  return connectDropTarget(<div ref={elRef} className={props.className} style={props.style}>{props.children}</div>);
};

export default DropAllowArea;
