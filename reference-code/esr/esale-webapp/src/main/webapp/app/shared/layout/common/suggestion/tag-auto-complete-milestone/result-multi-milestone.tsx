import React, { useCallback } from 'react';
import _ from 'lodash';
import { getFirstCharacter } from 'app/shared/util/utils';
import { getJsonBName } from 'app/modules/calendar/constants';
import moment from 'moment';

export interface IResultMultiMilestoneProps {
  tags: any;
  onRemoveTag: any,
}

const fixTooltipOverflowStyle: React.CSSProperties = {
  overflow: 'initial'
}

const ResultMultiMilestone = (props: IResultMultiMilestoneProps) => {

  const getCustomerName = useCallback((milestone) => {
    const tmp = [];
    if (milestone['parentCustomerName']) {
      tmp.push(milestone['parentCustomerName']);
    }
    if (milestone['customerName']) {
      tmp.push(milestone['customerName']);
    }
    return tmp.join('－');
  }, [])

  return (
    <div className="chose-many">
      {props.tags && props.tags.map((milestone, idx) =>
        <div className="w48 position-relative" key={idx}>
          <div className="drop-down w100 background-color-86 overflow-initial h-auto position-relative">
            <ul className="dropdown-item">
              <li className="item smooth">
                <div className="text text1 font-size-12 text-ellipsis">{milestone['productName']}{getCustomerName(milestone)}</div>
                <div className="text text2 text-ellipsis">{`${milestone['milestoneName']}`}{milestone['endDate'] && `（${moment(milestone['endDate']).format('YYYY/MM/DD')}）`}</div>
                <button type="button" className="close"><a onClick={() => props.onRemoveTag(idx)}>×</a></button>
              </li>
            </ul>
          </div>
          <div className="drop-down child mt-0 overflow-initial h-auto">
            <ul className="dropdown-item mb-0">
              <li className="item smooth">
                <div className="text text1 font-size-12" style={fixTooltipOverflowStyle}>{milestone['productName']}{getCustomerName(milestone)}</div>
                <div className="text text2" style={fixTooltipOverflowStyle}>{`${milestone['milestoneName']}`}{milestone['endDate'] && `（${moment(milestone['endDate']).format('YYYY/MM/DD')}）`}</div>
              </li>
            </ul>
          </div>
        </div>
      )
      }
    </div >
  )
}

export default ResultMultiMilestone;
