import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getJsonBName } from 'app/modules/setting/utils';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import { scheduleTypeIcons } from './constant';
import { changeOrderScheduleType } from '../schedule-type.reducer';
import { useDndByIndex } from 'app/modules/setting/hook';
import { changeOrder } from 'app/shared/util/dragdrop';

interface IProps extends DispatchProps {
  index: number;
  item: any;
  editScheduleType: (item: any) => void;
  deleteScheduleType: (item: any, actionDelete?: any) => Promise<void>;
  setScheduleTypes: any;
  listItems: any[];
  setIsDragDrop: any;
}

const ScheduleTypeItem: React.FC<IProps> = ({ index, item, listItems, editScheduleType, deleteScheduleType, setScheduleTypes, ...props }) => {

  const getIcon = () => {
    if (item.iconType===0) {
      return item.iconPath;
    } else {
      const typeIcon = _.find(scheduleTypeIcons, _.matchesProperty('iconType', item.iconType));
      return typeIcon && item.iconType > 0 ? `../../../content/images/${typeIcon.iconPath}` : `${item.iconPath}`;
    }
  };
  const { drag, drop, isDragging, isOver, sourceIndex } = useDndByIndex({
    index,
    // TODO: fix item
    item: { id: item.scheduleTypeId, index, icon: getIcon() },
    type: 'SCHEDULE',
    handleDrop(sourceIdx, targetIdx) {
      props.setIsDragDrop(true);
      // props.changeOrderScheduleType(sourceIdx, targetIdx);
      setScheduleTypes(changeOrder(sourceIdx, targetIdx, listItems));
    }
  });

  let classNamePreview = '';

  if (sourceIndex > index && isOver) {
    classNamePreview = 'setting-row-dnd-preview-top';
  } else if (sourceIndex < index && isOver) {
    classNamePreview = 'setting-row-dnd-preview-bottom';
  }

  return (
    <>
      {isOver && sourceIndex > index && <div className="setting-row-dnd-arrow-preview" />}
      <tr ref={drop} className="setting-row-dnd-preview">
        <td className={classNamePreview}>
          <a className="icon-dot-6" ref={drag} />
          <img className="icon-calendar-person" src={getIcon()} />
        </td>
        <td className={classNamePreview}>{getJsonBName(item.scheduleTypeName)}</td>
        <td className={classNamePreview}>
          {item.isAvailable
            ? translate('setting.calendar.scheduleType.new.isActive')
            : translate('setting.calendar.scheduleType.new.noActive')}
        </td>
        <td className={`text-center color-999 ${classNamePreview}`}>
          <a tabIndex={0} className="icon-primary icon-edit icon-edit-t icon-custom" onClick={() => editScheduleType(item)} />
          <a tabIndex={0} className="icon-primary icon-erase icon-edit-t icon-custom" onClick={() => deleteScheduleType(item)} />
        </td>
      </tr>
      {isOver && sourceIndex < index && <div className="setting-row-dnd-arrow-preview" />}
    </>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  changeOrderScheduleType
};

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleTypeItem);
