import React from 'react'
import {QuoteTimelineType}  from '../../models/get-user-timelines-type'
import TimelineContentComment from './timeline-content-comment';
import { CommonUtil } from '../../common/CommonUtil';
import { MODE_CONTENT } from '../../common/constants';
type ITimelineViewQuoteProp = {
  data: QuoteTimelineType;
}

const TimelineViewQuote = (props: ITimelineViewQuoteProp) => {
  return (
    <div className="card-more-comment create-share card-more-comment-gray mt-2 mb-2 timeline-ic-quote">
      <div className="content style-3 overflow-hidden">
        <div className="content-top flex-space-between ">
          <div className="mission-wrap">
          <div className="item">
              {props.data?.createdUserPhoto ? (<img className="user" src={props.data?.createdUserPhoto} alt=' ' />)
                : (<div className="no-avatar green"> {props.data?.createdUserName ? props.data?.createdUserName.charAt(0) : ''} </div>)}
              <span className="font-size-12 text-blue">{props.data?.createdUserName}</span>
            </div>
          </div>
          <div className="date font-size-10 text-blue"> {`${CommonUtil.getJustDateTimeZone(props.data?.createdDate)} ${CommonUtil.getTimeZoneFromDate(props.data.createdDate)}`} </div>
        </div>
        <div className="text">
          <TimelineContentComment 
          data={props.data?.comment?.content}  
          isHighlight={false} 
          />
        </div>
      </div>
    </div>
  );
}

export default TimelineViewQuote;
