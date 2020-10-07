import React, {  useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import EquipmentTypeItem from './equipment-type-item';
import { DragLayer } from 'app/modules/setting/components/DragLayer';
interface IProps {
  listItems: any[];
  editItem: (item: any) => void;
  deleteItem: (item, actionDelete?) => Promise<void>;
  showEquipmentInType;
  openDialogEquipmentAdd;
  ative;
  setItems: any;
  colEquimentTypeRef: any;
  setHadDrag: any;
}

const ListEquipmentTypes: React.FC<IProps> = ({ listItems = [], colEquimentTypeRef, ...props }) => {
  const [widthCol, setWidthCol] = useState(0);
  useEffect(() => {
    setWidthCol(colEquimentTypeRef.current.clientWidth);
  }, []);
  return (
    <DndProvider backend={Backend}>
      {listItems.map((item, index) => (
        <EquipmentTypeItem key={index} item={item} index={index} listItems={listItems} {...props} />
      ))}
      <DragLayer width={widthCol - 5} />
    </DndProvider>
  );
};

export default ListEquipmentTypes;
