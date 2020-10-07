import React, { Component, useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import ScenariosItem from './scenarios-item';
import { DragLayer } from '../../../components/DragLayer';
interface IProps {
  lisMilestones: any[];
  setMilestones: any;
  tableRef: any;
  showMilestoneInput;
  validScenarios;
}

const ListMilestones: React.FC<IProps> = ({ lisMilestones = [], tableRef, ...props }) => {
  const [widthCol, setWidthCol] = useState(0);
  useEffect(() => {
    setWidthCol(tableRef.current.clientWidth);
  }, []);
  return (
    <DndProvider backend={Backend}>
      {lisMilestones.map((item, index) => (
        <ScenariosItem key={index} item={item} index={index} listItems={lisMilestones} {...props} />
      ))}
      <DragLayer width={widthCol - 5} />
    </DndProvider>
  );
};

export default ListMilestones;
