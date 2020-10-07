import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { getJsonBName } from 'app/modules/setting/utils';
import PositionItem from './position-item';
import { DragLayer } from '../../components/DragLayer';
interface IProps {
  lisPositions: any[];
  editPositions: (item: any) => void;
  deletePositions: (item, actionDelete?) => Promise<void>;
  setListPositions: any;
  tableRef: any;
}

const ListPositions: React.FC<IProps> = ({ lisPositions = [], tableRef, ...props }) => {
  const [widthCol, setWidthCol] = useState(0);
  useEffect(() => {
    setWidthCol(tableRef.current.clientWidth);
  }, []);
  return (
    <DndProvider backend={Backend}>
      {lisPositions.map((item, index) => (
        <PositionItem key={index} item={item} index={index} listItems={lisPositions} {...props} />
      ))}
      <DragLayer width={widthCol - 5} />
    </DndProvider>
  );
};

export default ListPositions;
