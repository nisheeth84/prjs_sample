import React, { useRef, useEffect } from 'react'
import { useDrop, useDrag } from 'react-dnd';

import { getJsonBName } from "app/modules/setting/utils";

interface IProps {
  dataInfo: any;
  setDataInfo: any;
  fieldInfo:any;
  setFieldInfo: any;
  itemData: any;
  itemIndex: any;
  showIcon: any;
  openDialogAdd: any;
  editProductType: any;
  deleteProductType: any;
  setShowIcon: any;
  dataAfterDragDrop?
  setWidthCol?
}

const typeAcceptLocation = 'ROW_ITEM_1';

const ProductTypeMasterHeader: React.FC<IProps> = ({dataInfo, setDataInfo, fieldInfo, setFieldInfo, itemData, itemIndex, showIcon, openDialogAdd, editProductType, deleteProductType, setShowIcon, dataAfterDragDrop, setWidthCol}) => {
  const ref = useRef<any>() 


  useEffect(() => {
    if(itemIndex === 0){
    setWidthCol(ref?.current?.clientWidth)

    }
  })

  const changeIndexProduct = (sourceIndex, targetIndex) => {
    dataInfo.splice(targetIndex, 0, dataInfo.splice(sourceIndex, 1)[0]);
    setDataInfo(dataInfo);
    dataAfterDragDrop(dataInfo)
  }
  
  const [{isOver}, drop] = useDrop<{type: string, id: string, index:number},any,{isOver:boolean}>({
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

  const [{ sourceIndex }, drag] = useDrag({
    item: {
      type: typeAcceptLocation,
      id: itemData.productTypeId,
      index: itemIndex,
      text: getJsonBName(itemData.productTypeName)
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      sourceIndex: monitor.getItem()?.index,
    })
  });

drop(ref)
  return (      
      <th ref={ref} key={itemIndex} className={`position-static ${showIcon === (itemIndex + 1) ? "title-table w-cus10 position-relative background-td" : "title-table"} ${(itemIndex > sourceIndex) && isOver && 'th-drag-drop-left'}  ${isOver && (itemIndex !== sourceIndex) && 'th-drag-drop'}`}
          onMouseEnter={() => setShowIcon(itemIndex + 1)}
          onMouseLeave={() => !openDialogAdd && setShowIcon(0)}>
          <span ref={drag} className='text-header-td aaaaaaaaaa'>{getJsonBName(itemData.productTypeName)}</span>
          {
          showIcon === (itemIndex + 1) && (
              <span className="list-icon list-icon__center list-icon-action">
              <a className="icon-primary icon-edit icon-custom mr-1" onClick={() => editProductType(itemData)} />
              <a className="icon-primary icon-erase icon-custom" onClick={() => deleteProductType(itemData)} />
              </span>
          )
          }
      </th>
  )
}
export default ProductTypeMasterHeader;