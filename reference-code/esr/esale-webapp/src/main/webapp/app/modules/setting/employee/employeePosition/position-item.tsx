import React, { Component, useRef } from 'react';
import { connect } from 'react-redux';
import { getJsonBName } from 'app/modules/setting/utils';
import _ from 'lodash';
import { changeOrderPosition } from './job_title_master.reducer';
import { useDndByIndex } from '../../hook';
import { changeOrder } from 'app/shared/util/dragdrop';

interface IProps extends DispatchProps {
  index: number;
  item: any;
  editPositions: (item: any) => void;
  deletePositions: (item: any, actionDelete?: any) => Promise<void>;
  setListPositions: any;
  listItems: any[];
}

const PositionItem: React.FC<IProps> = ({ index, item, listItems, editPositions, deletePositions, setListPositions, ...props }) => {
  const { drag, drop, isDragging, isOver, sourceIndex } = useDndByIndex({
    index,

    item: { id: index, index, text: getJsonBName(item.positionName) },
    type: 'POSITION',
    handleDrop(sourceIdx, targetIdx) {
      // props.changeOrderPosition(sourceIdx, targetIdx);
      setListPositions(changeOrder(sourceIdx, targetIdx, listItems));
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
          <span ref={drag}>
            <img src="../../../content/images/setting/ic-detail.svg" />
            <span className="ml-2">{getJsonBName(item.positionName)}</span>
          </span>
        </td>
        <td className={`text-center ${classNamePreview}`}>
          <button type='button' className="icon-primary icon-edit mr-2" onClick={() => editPositions(item)} />
          <button type='button' className="icon-primary icon-erase " onClick={() => deletePositions(item)} />
        </td>
      </tr>
      {isOver && sourceIndex < index && <div className="setting-row-dnd-arrow-preview" />}
    </>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  changeOrderPosition
};

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PositionItem);
