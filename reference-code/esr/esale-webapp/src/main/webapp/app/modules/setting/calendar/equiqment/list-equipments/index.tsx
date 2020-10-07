import React from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import EquipmentItem from './equipment-item';
interface IProps {
  listItems: any[];
  editItem: (item: any) => void;
  deleteItem: (item, actionDelete?) => Promise<void>;
  setItems: any;
  openDialogEquipmentAdd,
  equipmentTypeId: any;
  setHadDrag: any;
}

const ListEquipments: React.FC<IProps> = ({ listItems = [], equipmentTypeId, ...props }) => {
  return (
    <DndProvider backend={Backend}>
      {
      listItems && listItems.length > 0 && listItems.map((item, index) => (
          <EquipmentItem key={index} item={item} index={index} listItems={listItems} {...props} />
        ))}
    </DndProvider>
  );
};

export default ListEquipments;
