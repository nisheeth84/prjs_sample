import React from 'react';
import moment from 'moment';
import dateFnsFormat from 'date-fns/format';

export interface ISuggestMilestoneProps {
  milestoneInfo: any;
  tags: any;
  selectElementSuggest: any;
  dateFormat?: any;
}

const SuggestMilestone = (props: ISuggestMilestoneProps) => {
  const isActive = props.tags.filter(e => e.milestoneId === props.milestoneInfo.milestoneId).length > 0;
    const tmp = [];
    if (props.milestoneInfo.parentCustomerName) {
      tmp.push(props.milestoneInfo.parentCustomerName);
    }
    if (props.milestoneInfo.customerName) {
      tmp.push(props.milestoneInfo.customerName);
    }
    const displayCustomerName = tmp.join('－');
  return (
    <li className={`item ${isActive ? "active" : ""} smooth`} onClick={(e) => { if (!isActive) { props.selectElementSuggest(props.milestoneInfo) } }}>
      <div className="text text1 font-size-12 text-ellipsis">{displayCustomerName}
      </div>
      <div className="text text2 text-ellipsis">
        {`${props.milestoneInfo.milestoneName}`}{props.milestoneInfo.endDate && `（${dateFnsFormat(props.milestoneInfo.endDate, props.dateFormat)}）`}
      </div>
      </li>
    );
}

export default SuggestMilestone;