import React from 'react'
import { ShareTimelineType } from '../../models/get-user-timelines-type'
import TimelineContentComment from './timeline-content-comment';
import { CommonUtil } from '../../common/CommonUtil';
type ITimelineShareViewProp = {
  // to receive data timeline share
  data: ShareTimelineType
  // for data auto
  isTimelineAuto?: boolean
}

const TimelineShareView = (props: ITimelineShareViewProp) => {
  return (
    <div className="sub-box-share mt-2">
      <div className="left mr-3">
        <div className="position-relative">
          <a title="" className="icon-small-primary icon-share"></a>
          <span className="line-col"></span>
        </div>
      </div>
      <div className="style-3 w100">
        <div className="box-share-top d-flex justify-content-between">
          <div className="mission-wrap">
            <div className="item">
               { props.data?.createdUserPhoto ? (<img className="user" src={props.data?.createdUserPhoto} alt=' ' />) 
             : (<div className="no-avatar green"> {props.data?.createdUserName ? props.data?.createdUserName.charAt(0) : ''} </div>) }
              <span className="font-size-12 text-blue">{props.data?.createdUserName}</span>
            </div>
          </div>
          <div className="date font-size-10">
            {`${CommonUtil.getJustDateTimeZone(props.data?.createdDate)} ${CommonUtil.getTimeZoneFromDate(props.data.createdDate)}`}
          </div>
        </div>
        <div className="color-333">
          <TimelineContentComment 
            isTimelineAuto={props.isTimelineAuto}
            timelinePostData={props.data}
            data={props.data?.comment?.content}  
            isHighlight={false} />
        </div>
      </div>
    </div>
  );
}

export default TimelineShareView;
