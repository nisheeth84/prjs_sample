import React, { useEffect, useState } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { DnDItemTypes, DragItem } from "app/shared/layout/common/suggestion/constants";

type ComponentProps = {
  idx?: number,
  tag: any,
  className?: string,
  tagNames: string[],
  listActionOption?: { id, name }[],
  onActionOption?: (idx: number, ev) => void,
  onRemoveTag?: (idx: number) => void
}

const TagAutoCompleteItem = (props: ComponentProps) => {
  const item: DragItem = {
    data: props.tag,
    name: props.tagNames[0],
    type: DnDItemTypes.EMPLOYEE
  };
  const [textFirst, setTextFirst] = useState(null);
  const [textSecond, setTextSecond] = useState(null);
  const [{ opacity }, drag] = useDrag({
    item,
    end(dragItem: DragItem, monitor: DragSourceMonitor) {
      const result = monitor.getDropResult();
      if (result && result.added) {
        props.onRemoveTag(props.idx);
      }
    },
    collect: (monitor: DragSourceMonitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  })

  useEffect(() => {
    if (props.tagNames.length < 1) {
      return;
    }
    setTextFirst(props.tagNames[0]);
    setTextSecond(props.tagNames.splice(1, props.tagNames.length).join(' '));
  }, [props.tagNames]);

  return (
    <div className={props.className} ref={drag} style={{opacity}}>
      <div className="name pink">
        社
      </div>
      <div className="content">
        <div className="text text1">{textFirst}</div>
        <div className="text text2">{textSecond}</div>
      </div>
      {props.listActionOption &&
      <div className="select-option show-wrap2-input-common">
        <select value={props.tag.actionId} onChange={(ev) => props.onActionOption(props.idx, ev)}>
          {props.listActionOption.map((o, i) =>
            <option key={i} value={o.id}>{o.name}</option>
          )}
        </select>
      </div>
      }
      <button type="button" className="close"><a onClick={() => props.onRemoveTag(props.idx)}>×</a></button>
    </div>
  )
}

export default TagAutoCompleteItem;
