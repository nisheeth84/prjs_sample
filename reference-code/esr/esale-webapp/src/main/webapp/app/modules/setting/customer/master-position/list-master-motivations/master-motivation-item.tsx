import React, { Component, useRef } from 'react';
import { connect } from 'react-redux';
import { getJsonBName } from 'app/modules/setting/utils';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import { useDndByIndex } from 'app/modules/setting/hook';
import { changeOrder } from 'app/shared/util/dragdrop';
import { MASTER_MOTIVATIONS_ICON_TYPE, MASTER_MOTIVATIONS_BACGROUND } from 'app/modules/setting/constant';

interface IProps extends DispatchProps {
  index: number;
  item: any;
  editItem: (item: any) => void;
  deleteItem: (item: any, actionDelete?: any) => Promise<void>;
  listItems: any[];
  setItems: any;
}

const MasterMotivationItem: React.FC<IProps> = ({ index, item, editItem, deleteItem, listItems, setItems }) => {
  const { drag, drop, isDragging, isOver, sourceIndex } = useDndByIndex({
    index,
    item: { id: index, index, text: getJsonBName(item.masterMotivationName) },
    type: 'MASTER_STAND',
    handleDrop(sourceIdx, targetIdx) {
      // changeOrder(sourceIdx, targetIdx);
      setItems(changeOrder(sourceIdx, targetIdx, listItems));
    }
  });

  function generateMotivationBackground() {
    let strRender = '';
    switch (Number(item.backgroundColor)) {
      case MASTER_MOTIVATIONS_BACGROUND.RED:
        strRender += ' background-color-89';
        break;
      case MASTER_MOTIVATIONS_BACGROUND.ORANGE:
        strRender += ' background-color-24';
        break;
      case MASTER_MOTIVATIONS_BACGROUND.YELLOW:
        strRender += ' background-color-104';
        break;
      case MASTER_MOTIVATIONS_BACGROUND.GREEN:
        strRender += ' background-color-106';
        break;
      case MASTER_MOTIVATIONS_BACGROUND.BLUE:
        strRender += ' background-color-93';
        break;
      case MASTER_MOTIVATIONS_BACGROUND.PURPLE:
        strRender += ' background-color-101';
        break;
      case MASTER_MOTIVATIONS_BACGROUND.CORAL:
        strRender += ' background-color-102';
        break;
      case MASTER_MOTIVATIONS_BACGROUND.GRAY:
        strRender += ' background-color-103';
        break;
      default:
        break;
    }
    return strRender;
  }

  function generateMotivationIcons() {
    let strRender = '../../../../content/images/setting/';

    switch (item.iconType) {
      case MASTER_MOTIVATIONS_ICON_TYPE.ONE:
        strRender += 'ic-setting-ask-gray.svg';
        break;
      case MASTER_MOTIVATIONS_ICON_TYPE.TWO:
        strRender += 'ic-setting-up-arrow.svg';
        break;
      case MASTER_MOTIVATIONS_ICON_TYPE.THREE:
        strRender += 'ic-setting-horizontal-arrow.svg';
        break;
      case MASTER_MOTIVATIONS_ICON_TYPE.FOUR:
        strRender += 'ic-setting-down-arrow.svg';
        break;
      case MASTER_MOTIVATIONS_ICON_TYPE.OTHER:
        strRender = item.iconPath;
        break;
      default:
        break;
    }
    return strRender;
  }

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
        <td className={classNamePreview}>
          {
            <a className={'icon-primary-setting icon-view-motivations ' + generateMotivationBackground() + " height-16"}>
              <img src={generateMotivationIcons()} />
            </a>
          }
        </td>
        <td className={classNamePreview}>{getJsonBName(item.masterMotivationName)}</td>
        <td className={classNamePreview}>{item.isAvailable ? translate('setting.available.yes') : translate('setting.available.no')}</td>
        <td className={` text-center color-999 ${classNamePreview}`}>
          <button className="icon-primary icon-edit icon-edit-t icon-custom" onClick={() => editItem(item)} />
          <button className="icon-primary icon-erase icon-edit-t icon-custom" onClick={() => deleteItem(item, index)} />
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
)(MasterMotivationItem);
