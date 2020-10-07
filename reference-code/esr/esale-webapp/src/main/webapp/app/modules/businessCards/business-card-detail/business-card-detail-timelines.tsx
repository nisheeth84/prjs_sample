import React, { useState, useCallback } from 'react';
import TimelineCommonControl from 'app/modules/timeline/timeline-common-control/timeline-common-control';
import _ from 'lodash';


export interface IBusinessCardDetailTimelineProps {
  serviceType: number,
  objectId: any[],
  onShowTimeline: () => void,
  isScreenDisplay?: any,
  isDataChange?: (isChange: boolean) => void;
  hasLoginUser: boolean;
  targetDeliversForSearch?: any[];
  setBussinessCardIdForDetail?: (id: any) => void;
}

const BusinessCardDetailTimeline = (props: IBusinessCardDetailTimelineProps) => {
  const [showTimeline, setShowTimeline] = useState(true);
  const setIdOfBC = (id) => {
    props.setBussinessCardIdForDetail(id);
  }

  const timeline = useCallback(() => {
    if (props.targetDeliversForSearch) {
      return (<>
        <TimelineCommonControl 
          hasLoginUser={props.hasLoginUser}
          targetDeliversForSearch={props.targetDeliversForSearch}
          isDataChange={props.isDataChange} 
          objectId={props.objectId} 
          serviceType={props.serviceType}
          callAgain={setIdOfBC} />
      </>)
    }
  }, [props.targetDeliversForSearch, props.hasLoginUser]);

  return (
    <>
      {props.isScreenDisplay &&
        <div className="popup-content-task-right wrap-timeline popup-content-common-right v2" >
          <div className="button">
            <a className={`icon-small-primary icon-small-primary-v2 ${showTimeline ? 'icon-next' : 'icon-prev'}`}
              onClick={() => { setShowTimeline(!showTimeline); props.onShowTimeline() }}
            />
          </div>
          {timeline()}
        </div>
      }
    </>
  )
}

export default BusinessCardDetailTimeline;
