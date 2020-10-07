import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { getJsonBName } from 'app/modules/setting/utils';
import MasterMotivation from './master-motivation-item';
import { DragLayer } from 'app/modules/setting/components/DragLayer';
interface IProps {
  listItems: any[];
  editItem: (item: any) => void;
  deleteItem: (item, actionDelete?) => Promise<void>;
  setItems: any;
  tableRef: any;
}

const ListMasterMotivations: React.FC<IProps> = ({ listItems = [], tableRef, ...props }) => {
  const [widthCol, setWidthCol] = useState(0);
  useEffect(() => {
    setWidthCol(tableRef.current.clientWidth);
  }, []);
  return (
    <DndProvider backend={Backend}>
      {listItems.map((item, index) => (
        <MasterMotivation key={index} item={item} index={index} {...props} listItems={listItems} />
      ))}
      <DragLayer width={widthCol - 5} />
    </DndProvider>
  );
};

export default ListMasterMotivations;
