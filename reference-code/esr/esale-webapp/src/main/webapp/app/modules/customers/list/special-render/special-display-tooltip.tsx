import React, { useState, useEffect, useRef } from 'react';
import Popover from 'react-tiny-popover';
import * as R from 'ramda';
import useEventListener from 'app/shared/util/use-event-listener';
import { translate } from 'react-jhipster';
import { CUSTOMER_SPECIAL_LIST_FIELD } from '../../constants';

export interface ISpecialDisplayTooltipProps {
  rowData: any;
  tenant: any;
  fieldName: any;
  openPopupDetail?: any;
  fieldColumn?: any
}

const SpecialDisplayTooltip: React.FC<ISpecialDisplayTooltipProps> = (props) => {
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const ref = useRef(null);
  const refMenu = useRef(null);
  const displayRef = useRef(null);

  const handleClickOutside = (e) => {
    if (refMenu.current && !refMenu.current.contains(e.target)) {
      setTooltipIndex(null);
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  const openPopup = (index) => {
    const { openPopupDetail, rowData, fieldColumn } = props;
    if (props.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT) {
      openPopupDetail(rowData.next_schedules[index].schedulesId,
        fieldColumn && fieldColumn.fieldId,
        fieldColumn && fieldColumn.fieldName);
      setTooltipIndex(null);
    } else if (props.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT) {
      openPopupDetail(rowData.next_actions[index].taskId,
        fieldColumn && fieldColumn.fieldId,
        fieldColumn && fieldColumn.fieldName);
      setTooltipIndex(null);
    }
  }

  const renderMenuSelect = (nextData) => {
    let _nextData = null;
    if (props.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT) {
      _nextData = R.path(['next_actions'], nextData);
    }

    if (props.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT) {
      _nextData = R.path(['next_schedules'], nextData);
    }

    return <div className="box-select-option position-static max-height-300 overflow-auto max-width-200 mh-auto" ref={refMenu}>
      {_nextData.map((emp, idx) =>
        <> {idx > 0 && <div className="item p-2">
          <a className="color-blue"
            onClick={() => openPopup(idx)}>
            {props.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT && R.path(['schedulesName'], emp)}
            {props.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT && R.path(['taskName'], emp)}
          </a>
        </div>}
        </>
      )}
    </div>
  }
  return <>
    {props.rowData &&
      <div ref={displayRef}>
        <Popover
          align={'end'}
          containerStyle={{ overflow: 'initial', zIndex: '9000' }}
          isOpen={props.rowData['customer_id'] === tooltipIndex}
          position={['bottom', 'top', 'left', 'right']}
          content={renderMenuSelect(props.rowData)}
        >
          <a ref={ref}
            className="color-blue"
            onClick={(e) => {
              setTooltipIndex(props.rowData['customer_id']);
              e.stopPropagation();
            }}>
            {translate('customers.list.show-more-next',
              {
                0: props.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT
                  ? R.path(['next_actions'], props.rowData).length - 1
                  : R.path(['next_schedules'], props.rowData).length - 1
              })
            }
          </a>
        </Popover>
      </div>}
  </>;
}


export default SpecialDisplayTooltip;


