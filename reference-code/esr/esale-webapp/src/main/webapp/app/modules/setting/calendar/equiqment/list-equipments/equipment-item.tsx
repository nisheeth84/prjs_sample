import React, {  useState } from 'react';
import { connect } from 'react-redux';
import { getJsonBName } from 'app/modules/setting/utils';
import { useDndByIndex } from 'app/modules/setting/hook';
import { changeOrder } from 'app/shared/util/dragdrop';

interface IProps extends DispatchProps {
  index: number;
  item: any;
  listItems: any[];
  editItem: (item: any) => void;
  deleteItem: (item: any, actionDelete?: any) => Promise<void>;
  openDialogEquipmentAdd: any;
  setItems: any;
  setHadDrag: any;
}

const EquipmentItem: React.FC<IProps> = ({ index, item, editItem, deleteItem, openDialogEquipmentAdd, listItems, setItems , setHadDrag }) => {
  const [showIconEq, setShowIconEq] = useState(0);

  const { drag, drop, isDragging, isOver, sourceIndex } = useDndByIndex({
    index,
    item: { id: index, index , text: getJsonBName(item.equipmentName)},
    type: 'EQUIPMENT',
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
          key={index}
          className="tbl-equiqment"
          onMouseOver={() => setShowIconEq(index + 1)}
          onMouseLeave={() => { if (!openDialogEquipmentAdd) { setShowIconEq(0) } else { setShowIconEq(null) } }}
          ref={drop}
        >
          <p ref={drag}>{getJsonBName(item.equipmentName)}</p>
          {showIconEq === index + 1 && (
            <span className="list-icon list-icon__center">
              <a className="icon-primary icon-edit icon-custom mr-1" onClick={() => editItem(item)} />
              <a className="icon-primary icon-erase icon-custom" onClick={() => deleteItem(item)} />
            </span>
          )}
        </div>
        {isOver && sourceIndex < index && <div className="setting-underline" />}
      </>
    );
  } else {
    return (<></>)
  }
} 

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipmentItem);
