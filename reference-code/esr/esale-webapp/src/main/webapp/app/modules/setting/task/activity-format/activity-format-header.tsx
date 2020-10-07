import React, { useEffect, useRef } from 'react'
import { useDrop, useDrag } from 'react-dnd';

import { getJsonBName } from "app/modules/setting/utils";

interface IProps {
  dataInfo: any;
  setDataInfo: any;
  fieldInfo: any;
  setFieldInfo?: any;
  itemData: any;
  itemIndex: any;
  showIcon: any;
  openDialogAdd: any;
  editActivityFormat: any;
  deletectivityFormat: any;
  setShowIcon: any;
  dataAfterDragDrop?
  setWidthCol?
}

const typeAcceptLocation = 'ROW_ITEM';

const ProductActivityHeader: React.FC<IProps> = ({ dataInfo, setDataInfo, fieldInfo, setFieldInfo, itemData, itemIndex, showIcon, openDialogAdd, editActivityFormat, deletectivityFormat, setShowIcon, dataAfterDragDrop, setWidthCol }) => {

  const changeIndexProduct = (sourceIndex, targetIndex) => {
    dataInfo.splice(targetIndex, 0, dataInfo.splice(sourceIndex, 1)[0]);
    setDataInfo(dataInfo);
    dataAfterDragDrop(dataInfo)
  }

  const ref = useRef<any>()

  useEffect(() => {
    if (itemIndex === 0) {
      setWidthCol(ref?.current?.clientWidth)

    }
  })

  const [{isOver}, drop] = useDrop<{ type: string, id: string, index: number }, any, { isOver: boolean }>({
    accept: typeAcceptLocation,
    drop(item, monitor) {
      const sourceIndex = item.index;
      const targetIndex = itemIndex;
      if (sourceIndex === targetIndex) {
        return;
      }
      changeIndexProduct(sourceIndex, targetIndex);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  const [, drag] = useDrag({
    item: {
      type: typeAcceptLocation,
      id: itemData.displayOrder,
      index: itemIndex,
      text: getJsonBName(itemData.name)
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      sourceIndex: monitor.getItem()?.index
    })
  });

  drop(ref)
  return (
    <th ref={ref} key={itemIndex} className={`position-static ${showIcon === (itemIndex + 1) ? "title-table position-relative background-td " : "title-table"} ${isOver && 'th-drag-drop'}`}
      onMouseEnter={() => setShowIcon(itemIndex + 1)}
      onMouseLeave={() => !openDialogAdd && setShowIcon(0)}
      style={{minWidth: `calc(calc(100vw - 400px)/${dataInfo.length > 8 ? dataInfo.length : 8})`}}
    >
      <span ref={drag} className='text-header-td'>{getJsonBName(itemData.name)}</span>
      {
        showIcon === (itemIndex + 1) && (
          <span className="list-icon list-icon__center list-icon-action">
            <a className="icon-primary icon-edit icon-custom mr-1" onClick={() => editActivityFormat(itemData)} />
            <a className="icon-primary icon-erase icon-custom" onClick={() => deletectivityFormat(itemData)} />
          </span>
        )
      }
    </th>
  )
}
export default ProductActivityHeader;