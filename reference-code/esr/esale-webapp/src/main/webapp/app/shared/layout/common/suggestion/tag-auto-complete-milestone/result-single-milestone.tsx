import React from 'react';
import moment from 'moment';
import dateFnsFormat from 'date-fns/format';


export interface IResultSingleMilestoneProps {
  tags: any;
  onRemoveTag: any;
  renderTooltip: any;
  isShowOnList?: any;
  disableTag?: any;
  dateFormat?: any;
}

const ResultSingleMilestone = (props: IResultSingleMilestoneProps) => {
  const tagName1 = 'milestoneName';
  const tagName2 = 'endDate';
  return (
    <>
      {props.tags.map((e, idx) => (
        <div key={idx} className={`wrap-tag ${props.isShowOnList ? "w90" : "text-ellipsis"} flex-100`}>
          <div className={`tag text-ellipsis ${props.isShowOnList ? "" : "w-100"} max-width-content`}>
            {`${e[tagName1]}`}{e[tagName2] && `（${dateFnsFormat(e[tagName2], props.dateFormat)}）`}
            <span className="close" onClick={props.disableTag ? () => { } : props.onRemoveTag(idx)}>×</span>
          </div>
          {props.renderTooltip(e)}
        </div>
      ))}
    </>
  );
}

export default ResultSingleMilestone;