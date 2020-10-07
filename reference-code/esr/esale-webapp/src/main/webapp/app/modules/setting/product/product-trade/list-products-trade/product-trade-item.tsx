import React, { Component, useRef } from 'react';
import { connect } from 'react-redux';
import { getJsonBName } from 'app/modules/setting/utils';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import { useDndByIndex } from 'app/modules/setting/hook';
import { changeOrderProductTrade } from '../product-trade.reducer';
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

    item: { id: index, index, text: getJsonBName(item.progressName) },
    type: 'PRODUCT_TRADE',
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
      <tr className="white-space-last setting-row-dnd-preview" ref={drop}>
        <td className={classNamePreview}>
          <img src="../../../content/images/setting/ic-detail.svg" ref={drag} />
          <span className="ml-2">{getJsonBName(item.progressName)}</span>
        </td>
        <td className={classNamePreview}>
          {item.bookedOrderType === 1 ? translate('setting.confirm.yes') : translate('setting.confirm.no')}
        </td>
        <td className={classNamePreview}>
          {item.bookedOrderType === 2 ? translate('setting.confirm.yes') : translate('setting.confirm.no')}
        </td>
        <td className={classNamePreview}>
          {item.bookedOrderType === 3 ? translate('setting.confirm.yes') : translate('setting.confirm.no')}
        </td>
        <td className={classNamePreview}>{item.isEnd ? translate('setting.confirm.yes') : translate('setting.confirm.no')}</td>
        <td className={`text-center color-999 ${classNamePreview}`}>
          <button className="icon-primary icon-edit mr-2" onClick={() => editItem(item)} />
          <button className="icon-primary icon-erase " onClick={() => deleteItem(item)} />
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
