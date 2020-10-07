import React from 'react'
import { DragSourceMonitor, useDrag } from 'react-dnd'
import { FIELD_ITEM_TYPE_DND } from '../constants'
import StringUtils from 'app/shared/util/string-utils';
import { Storage } from 'react-jhipster';

export interface IDynamicFieldDropableProps {
  fieldInfo: any
  onItemClick: (item) => void
}

const DynamicFieldDropable: React.FC<IDynamicFieldDropableProps> = (props) => {

  const getTextItemField = item => {
    const lang = Storage.session.get('locale', 'ja_jp');
    let text = '';
    const prop = StringUtils.snakeCaseToCamelCase('label_' + lang);
    if (item[prop]) {
      text = item[prop];
    }
    return text;
  }
  const [, connectDragSource] = useDrag(
    {
      item: { type: FIELD_ITEM_TYPE_DND.ADD_FIELD, value: { ...props.fieldInfo } },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }
  );

  return connectDragSource(
    <input type="text" className="input-normal" readOnly onClick={item => props.onItemClick(props.fieldInfo)} value={getTextItemField(props.fieldInfo)} />
  )
}

export default DynamicFieldDropable;
