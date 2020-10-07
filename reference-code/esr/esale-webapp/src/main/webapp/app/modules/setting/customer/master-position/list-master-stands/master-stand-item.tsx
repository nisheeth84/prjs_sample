import React, { Component, useRef } from 'react';
import { connect } from 'react-redux';
import { getJsonBName } from 'app/modules/setting/utils';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import { useDndByIndex } from 'app/modules/setting/hook';
import { changeOrder } from 'app/shared/util/dragdrop';

interface IProps extends DispatchProps {
  index: number;
  item: any;
  editItem: (item: any) => void;
  deleteItem: (item: any, actionDelete?: any) => Promise<void>;
  listItems: any[];
  setItems: any;
}

const ProductTradeItem: React.FC<IProps> = ({ index, item, editItem, deleteItem, listItems, setItems }) => {
  const { drag, drop, isDragging, isOver, sourceIndex } = useDndByIndex({
    index,

    item: { id: index, index, text: getJsonBName(item.masterStandName) },
    type: 'MASTER_STAND',
    handleDrop(sourceIdx, targetIdx) {
      // changeOrder(sourceIdx, targetIdx);
      setItems(changeOrder(sourceIdx, targetIdx, listItems));
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
          {index + 1}
        </td>
        <td className={classNamePreview}>{getJsonBName(item.masterStandName)}</td>
        <td className={classNamePreview}>{item.isAvailable ? translate('setting.available.yes') : translate('setting.available.no')}</td>
        <td className={`text-center color-999 ${classNamePreview}`}>
          <button className="icon-primary icon-edit icon-edit-t icon-custom" onClick={() => editItem(item)} />
          <button className="icon-primary icon-erase icon-edit-t icon-custom" onClick={() => deleteItem(item)} />
        </td>
      </tr>
      {isOver && sourceIndex < index && <div className="setting-row-dnd-arrow-preview" />}
    </>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductTradeItem);
