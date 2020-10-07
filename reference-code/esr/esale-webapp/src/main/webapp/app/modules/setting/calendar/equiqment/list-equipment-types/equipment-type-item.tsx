import React, { Component, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { getJsonBName } from 'app/modules/setting/utils';
import _, { cloneDeep } from 'lodash';
import { translate } from 'react-jhipster';
import { useDndByIndex } from 'app/modules/setting/hook';
import { changeOrderEquipmentType } from '../equipment-type.reducer';
import { changeOrder } from 'app/shared/util/dragdrop';

interface IProps extends DispatchProps {
  index: number;
  item: any;
  listItems: any[];
  editItem: (item: any) => void;
  deleteItem: (item: any, actionDelete?: any) => Promise<void>;
  showEquipmentInType;
  ative;
  openDialogEquipmentAdd: any;
  setItems: any;
  setHadDrag: any;
}

const EquipmentTypeItem: React.FC<IProps> = ({
  index,
  item,
  editItem,
  deleteItem,
  showEquipmentInType,
  openDialogEquipmentAdd,
  ative,
  listItems,
  setItems,
  setHadDrag,
}) => {
  const [showIcon, setShowIcon] = useState(0);

  const { drag, drop, isDragging, isOver, sourceIndex } = useDndByIndex({
    index,
    item: { id: index, index, text: getJsonBName(item.equipmentTypeName) },
    type: 'EQUIPMENT_TYPE',
    handleDrop(sourceIdx, targetIdx) {
      setHadDrag(true) 
      setItems(changeOrder(sourceIdx, targetIdx, listItems));
    }
  });
  if (!item.isDelete) {
    return (
      <>
        {isOver && sourceIndex > index && <div className="setting-underline" />}
        <div
          ref={drop}
          key={index}
          className={index === ative ? 'tbl-type-common tbl-type' : 'tbl-type-common'}
          onMouseOver={() => setShowIcon(index + 1)}
          onMouseLeave={() => { if (!openDialogEquipmentAdd) { setShowIcon(0) } else { setShowIcon(null) } }}
        >
          <p onClick={() => showEquipmentInType(item, index)} ref={drag}>
            {getJsonBName(item.equipmentTypeName)}
          </p>
          {showIcon === index + 1 && (
            <span className="list-icon list-icon__center">
              <a className="icon-primary icon-edit icon-custom mr-1" onClick={() => editItem(item)} />
              <a className="icon-primary icon-erase icon-custom" onClick={() => deleteItem(item)} />
            </span>
          )}
        </div>
        {isOver && sourceIndex < index && <div className="setting-underline" />}
      </>
    )
  } else {
    return (<></>)
  }
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipmentTypeItem);
