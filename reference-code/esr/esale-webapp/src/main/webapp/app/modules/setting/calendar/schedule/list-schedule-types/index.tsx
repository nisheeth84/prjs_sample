import React, { Component, useState, useCallback, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { IRootState } from 'app/shared/reducers';
import ScheduleTypeItem from './schedule-type-item';
import { DragLayer } from 'app/modules/setting/components/DragLayer';

interface IProps extends StateProps, DispatchProps {
  editScheduleType: (item: any) => void;
  deleteScheduleType: (item: any, actionDelete?: any) => Promise<void>;
  tableWidth: number;
  listScheduleTypes: any[];
  setScheduleTypes: any;
  setIsDragDrop: any;
}

const ListScheduleTypes: React.FC<IProps> = ({ tableWidth, editScheduleType, deleteScheduleType, listScheduleTypes, ...props}) => {
  return (
    <DndProvider backend={Backend}>
      {listScheduleTypes && listScheduleTypes.map((item, index) => (
        <ScheduleTypeItem
          item={item}
          index={index}
          key={index}
          editScheduleType={editScheduleType}
          deleteScheduleType={deleteScheduleType}
          listItems={listScheduleTypes}
          {...props}
        />
      ))}
      <DragLayer width={tableWidth - 5} />
    </DndProvider>
  );
};

const mapStateToProps = ({ scheduleType }: IRootState) => {
  return {
    scheduleTypes: scheduleType.scheduleTypes
  };
};

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListScheduleTypes);
