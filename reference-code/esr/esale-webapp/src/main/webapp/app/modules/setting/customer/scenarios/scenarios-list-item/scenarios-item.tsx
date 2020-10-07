import React, { Component, useRef } from 'react';
import { getJsonBName } from 'app/modules/setting/utils';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import { useDndByIndex } from '../../../hook';
import { changeOrder } from 'app/shared/util/dragdrop';
import { MAX_INPUT_LENGTH} from 'app/modules/setting/constant';

interface IProps {
  index: number;
  item: any;
  setMilestones: any;
  listItems: any[];
  showMilestoneInput;
  validScenarios
}

const MilestonesItem: React.FC<IProps> = ({ index, item, listItems, showMilestoneInput , validScenarios , setMilestones, ...props }) => {
  const { drag, drop, isDragging, isOver, sourceIndex } = useDndByIndex({
    index,

    item: { id: index, index, text: getJsonBName(item.milestoneName) },
    type: 'POSITION',
    handleDrop(sourceIdx, targetIdx) {
      // props.changeOrderPosition(sourceIdx, targetIdx);
      setMilestones(changeOrder(sourceIdx, targetIdx, listItems));
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
      <div className=" break-line form-group common mt-4" key={index}>
        <label ref={drop} className="mb-1">{translate('setting.customer.scenarios.milestone')}</label>
        <div className="show-search col-7" ref={drag}>
          {showMilestoneInput(item, index, validScenarios[index])}
          {validScenarios[index] &&
            <p className="mb-0 mt-2 setting-input-valis-msg w-100">
              {translate(`messages.ERR_COM_0025`, { 0: MAX_INPUT_LENGTH })}
            </p>
          }
        </div>
      </div>
      {isOver && sourceIndex < index && <div className="setting-row-dnd-arrow-preview" />}
    </>
  );
};

export default MilestonesItem;
